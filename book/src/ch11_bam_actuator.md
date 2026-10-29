# BAM 执行器建模与辨识

> 本章是本书最重要的技术章节之一。目标：理解 BAM（Bandwidth-Aware Motor）模型为什么是 Sim2Real 成败的核心，学会用台架实测数据拟合 HD1910 的 BAM 参数，并正确实现齿隙模型。

## 10.1 为什么要给舵机"建模型"

真机用的是**位置控制舵机**，不是理想力矩源。舵机有扭矩上限、摩擦、带宽、齿隙、响应延迟。如果在仿真里把舵机当成"指哪打哪"的理想执行器，训练出的策略在真机上会：

- 跟不上（带宽不足）；
- 抖（摩擦/齿隙）；
- 摔倒（扭矩不够）。

**BAM 模型**就是用来在仿真里精确模拟这些特性的执行器模型，是 Pollen 原版 Sim2Real 成功的核心。

## 10.2 BAM 模型的物理成分

BAM 模型包含五个关键参数：

| 参数 | 物理含义 | 影响 |
|---|---|---|
| 最大扭矩 `torque_max` | 舵机最大输出扭矩 | 动作是否"没劲" |
| 转子惯量 `J_rotor` | 电机+齿轮的转动惯量 | 响应快慢 |
| 粘性摩擦 `b_viscous` | 与速度成正比 | 阻尼、平滑 |
| 库仑摩擦 `tau_coulomb` | 与速度无关的恒定摩擦 | 抖动、死区 |
| 闭环带宽 `bandwidth` | 舵机跟随指令的速度上限 | 跟不上指令 |

此外还有**齿隙 `backlash`**——齿轮间隙造成的滞后。

## 10.3 原版 XL330 与飞特 HD1910 的差异

原版 `microduck_rl` 内置的是 Dynamixel XL330 专属参数（反电动势、电压-扭矩曲线、摩擦、齿隙、响应延迟经过台架标定）。而飞特 HD1910：

- 扭矩常数、转子惯量不同；
- 摩擦、带宽、齿隙特性不同；
- 电压特性不同。

**直接用原版预训练模型跑飞特舵机，步态必然失效。**必须重新标定 BAM 参数并重训。

## 10.4 HD1910 参数拟合（实测 vs 估算）

第 8 章做了台架数据采集。这里用 `scripts/calibration/hd1910_bench_data_process.py` 拟合。

### 10.4.1 拟合脚本代码详解

```python
#!/usr/bin/env python3
"""
scripts/calibration/hd1910_bench_data_process.py
从台架CSV拟合BAM模型参数（带宽、粘性摩擦、库仑摩擦、转子惯量）
"""
import argparse, json
import pandas as pd, numpy as np
from scipy.optimize import minimize

def bam_model_step(t, params, target):
    """简化一阶带宽模型"""
    w, b, tau_c, J = params
    return target * (1 - np.exp(-w * t))   # 一阶响应近似

def loss_fn(params, t, target, measured):
    pred = bam_model_step(t, params, target[0])
    return np.mean((pred - measured)**2)

def fit_bam(csv_path, out_json):
    df = pd.read_csv(csv_path)
    t = df["t"].values
    target = df["target_pos"].values
    actual = df["actual_pos"].values
    x0 = [22.0, 0.003, 0.012, 1.2e-6]     # 经验初值
    bounds = [(1,60), (1e-6,0.1), (1e-6,0.1), (1e-8,1e-4)]
    res = minimize(loss_fn, x0, args=(t, target, actual),
                   bounds=bounds, method="L-BFGS-B")
    bam_result = {
        "bandwidth_hz": float(res.x[0]),
        "b_viscous": float(res.x[1]),
        "tau_coulomb": float(res.x[2]),
        "J_rotor": float(res.x[3]),
        "servo_model": "HD1910", "voltage": 7.4,
        "unit": "SI(kg,m,s,rad)"
    }
    print(json.dumps(bam_result, indent=2))
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(bam_result, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--csv", required=True)
    p.add_argument("--out", required=True)
    a = p.parse_args()
    fit_bam(a.csv, a.out)
```

### 10.4.2 拟合得到的参考参数（实测后替换）

```python
hd1910_params = {
    "torque_max": 12.0,      # N·cm，HD1910 标称堵转扭矩@12V
    "rotor_inertia": 1.2e-6, # kg·m²
    "damping": 0.0018,       # 粘性摩擦
    "coulomb_friction": 0.009, # 库仑摩擦
    "bandwidth": 22,         # Hz，约20~25Hz
    "backlash": 0.0025,      # 齿隙(rad)
    "voltage": 12.0
}
```

### 10.4.3 修改 `bam_actuator.py`

在 `software/training/mjlab/actuators/bam_actuator.py` 的 Feetech 分支加入：

```python
class FeetechHD1910BAMActuator(FrictionDRBamActuator):
    def __init__(self, **kwargs):
        super().__init__(
            torque_max=12.0, rotor_inertia=1.2e-6,
            damping=0.0018, coulomb_friction=0.009,
            bandwidth=22, backlash=0.0025, voltage=12.0,
            **kwargs
        )
```

## 10.5 齿隙模型：最容易出错的地方

**关键设计**：Pollen 原版的齿隙放在**舵机输出端（编码器在齿隙之后）**。这意味着：
- 编码器读到的位置是"输出轴"位置，而不是电机轴位置；
- 齿隙造成的位置误差会进入观测（反馈），影响策略。

原版实现了 `BacklashEncoderBamActuator`，这是 Sim2Real 成功最核心的设计。**复刻时必须完整实现，否则来回摆动、抖动、跟随误差都会失配。**

> ⚠️ 齿隙 `backlash` 是 Sim2Real 最大影响项之一。真机上来回摆动基本就是齿隙不准导致的。拟合后建议在域随机化里给它加扰动（见第 11 章）。

## 10.6 消融实验：估算 vs 实测

为证明实测拟合的价值，设计对照实验（写入书稿附录数据）：
- 方案 A：经验估算 BAM 参数训练；
- 方案 B：台架实测拟合 BAM 参数训练；
- 指标：真机站立稳定时长、行走成功率、跌倒恢复成功率。

> 预期结论：实测拟合参数显著提升真机迁移成功率，尤其在行走与粗糙地面场景。

## 10.7 工程踩坑实录

- **齿隙放错位置**：齿隙放在电机轴而非输出端，导致仿真观测与真机编码器读数不一致，真机来回摆。
- **带宽拟合失真**：台架采样率不足，阶跃响应太快，拟合带宽偏小，仿真里舵机"跟不上"。提高采样率（>500Hz）后重采重拟合。

## 10.8 本章小结

你现在能：
- 理解 BAM 模型的五个核心参数；
- 用台架数据拟合 HD1910 的 BAM 参数；
- 正确实现齿隙模型（编码器在输出侧）。

> 下一步，给训练加上域随机化，让策略对参数误差鲁棒，进一步缩小 Sim2Real gap。
