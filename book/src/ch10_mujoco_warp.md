# MuJoCo-Warp 仿真环境

> 本章目标：理解 GPU 并行仿真原理，解决最让人头疼的环境部署问题，并掌握观测/动作空间的定义。

## 9.1 MuJoCo-Warp 与 mjlab 是什么

- **MuJoCo-Warp**（NVIDIA）：MuJoCo 物理引擎的 GPU 并行版本，可同时跑数百个仿真实例，大幅加速强化学习；
- **mjlab**（Pollen 自研）：在 MuJoCo-Warp 之上封装的机器人仿真库，提供环境 API、执行器模型（BAM）、域随机化支持。

两者组合构成了 MicroDuck 的训练底座。

## 9.2 环境部署痛点与 Docker 方案

原版环境依赖链复杂，`mjlab`、`mujoco-warp`、BAM 库版本绑定严格，常见问题：
- CUDA 版本不匹配；
- Python 包版本冲突；
- **Windows 原生不支持**，只能 WSL2 / Linux + NVIDIA CUDA GPU；
- CPU 无法训练。

仓库提供 Docker 一键方案解决这些问题：

```bash
cd docker
docker-compose up --build
```

配套 `requirements-lock.txt` 锁定所有依赖版本，保证"换个环境也能跑"。

## 9.3 环境自动校验脚本

每次修改代码后，先跑仿真环境自检，避免把错误带入训练：

```bash
python scripts/validation/test_env.py
```
```python
import torch
from mjlab import env

def test_sim_env():
    env = env.MicroDuckEnv(robot="feetech")
    obs, info = env.reset()
    for i in range(200):
        action = torch.zeros((1,14))
        obs, reward, done, trunc, info = env.step(action)
    print("✅ Simulation environment test passed")

if __name__ == "__main__":
    test_sim_env()
```

## 9.4 观测空间与动作空间

MicroDuck 的标准接口：
- **动作空间**：14 维关节动作（舵机目标位置），范围通常归一化到 [-1,1]；
- **观测空间**：61 维，含 IMU 姿态（四元数/欧拉角）、关节位置、关节速度、上一时刻动作等。

> 关键约定：**动作在仿真里是"位置指令"，不是力矩**。因为真机用的是位置控制舵机，仿真里也必须按位置执行器建模，这正好引出第 10 章的 BAM 模型。

## 9.5 并行环境数量与训练速度

```python
# 训练配置关键参数
num_envs: 256      # 并行仿真实例数
control_freq: 50   # 控制频率（Hz），必须与板端一致
```

- `num_envs` 越大，采样越快，但吃显存；显存不足时减小；
- `control_freq=50` 是硬约束，与 RK3566 控制环严格对齐，保证 Sim2Real 时序一致。

## 9.6 工程踩坑实录

- **CUDA 版本不匹配**：容器里 CUDA 与宿主机驱动不兼容，仿真启动即崩。用 Docker 锁定 CUDA 版本解决。
- **版本漂移**：依赖升级后环境不收敛，重装版本锁定文件后恢复。

## 9.7 本章小结

你现在能在容器里跑起仿真环境，理解观测/动作空间与 50Hz 时序约定。

> 下一章深入 BAM 舵机模型——这是 MicroDuck Sim2Real 成败的核心，也是本书最重要的技术章节之一。
