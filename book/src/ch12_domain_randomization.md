# 域随机化

> 本章目标：理解域随机化原理，学会扩展随机化参数集，并结合课程学习（Curriculum Learning）从站立逐步过渡到行走、爬坡。

## 11.1 为什么需要域随机化

仿真模型永远无法 100% 精确复现真机。打印填充率、舵机参数误差、地面材质差异，都会导致"仿真能走、真机摔倒"。**域随机化**的思路是：训练时不断随机扰动仿真参数，让策略"见过"各种可能的情况，从而对模型误差鲁棒。

Pollen 原版就是靠域随机化（区分平地/粗糙地形）实现产品级 Sim2Real。复刻项目基础域随机化参数偏少，需要扩展。

## 11.2 扩展域随机化参数集

在 `software/training/train_ppo.py` 的 `domain_rand` 部分扩展：

```python
domain_rand = {
    "mass_scale": [0.85, 1.15],          # 连杆质量 ±15%（覆盖打印填充率差异）
    "friction_scale": [0.7, 1.3],         # 摩擦系数 ±30%
    "actuator_torque_scale": [0.8, 1.2],  # 舵机最大扭矩 ±20%
    "bandwidth_noise": [18, 26],          # 舵机带宽随机 18~26Hz
    "backlash_noise": [0.001, 0.004],     # 齿隙随机扰动
    "imu_noise_std": [0.002, 0.008],      # IMU 噪声随机
    "ground_friction": [0.4, 1.2],        # 地面摩擦（地毯/木地板）
    "gravity_noise": [0.98, 1.02]         # 重力微小扰动
}
```

> **质量随机化 `mass_scale` 尤其重要**：它能覆盖 3D 打印填充率变化带来的整机质量波动（见第 4、5 章）。

## 11.3 域随机化的代码接入方式

在每个环境 `reset()` 时，从分布采样一次随机参数，应用到本 episode 的所有 step：

```python
def reset(self):
    # 采样本 episode 的随机化参数
    self.rand = {
        k: np.random.uniform(*v) for k, v in domain_rand.items()
    }
    # 应用到模型：缩放质量、摩擦等
    self.model = self.apply_domain_rand(self.model, self.rand)
    return self.get_obs()

def apply_domain_rand(self, model, r):
    # 实际修改 MuJoCo 模型参数
    model.body_mass *= r["mass_scale"]
    # 摩擦、扭矩等类似处理
    return model
```

## 11.4 课程学习 Curriculum Learning

单靠全参数随机可能让策略"什么都学不会"。课程学习从简单逐步过渡到困难，提升收敛稳定性和最终性能：

| 阶段 | 任务 | 域随机化强度 |
|---|---|---|
| 1 | 原地站立 | 低 |
| 2 | 原地下蹲 | 低 |
| 3 | 低速行走 | 中 |
| 4 | 粗糙地面行走 | 中 |
| 5 | 转向 | 中 |
| 6 | 爬坡 | 高 |

课程自动推进：当上一阶段策略达到成功率阈值，自动提升难度。

## 11.5 奖励函数平滑项

域随机化之外，奖励函数也要抑制抖动。增加动作平滑惩罚，避免策略输出剧烈跳变：

```python
action_smooth_penalty = -0.05 * torch.sum(torch.square(next_action - prev_action), dim=-1)
reward = reward + action_smooth_penalty
```

## 11.6 消融实验设计（写入书稿）

为量化域随机化价值，设计消融：
- 方案 A：**不开**域随机化；
- 方案 B：仅质量随机；
- 方案 C：全参数域随机化。

对比三者在真机上的迁移成功率，结果写入本书附录实验数据。预期：C > B > A，尤其在行走场景差距显著。

## 11.7 工程踩坑实录

- **随机化过强导致不收敛**：一开始全参数大幅随机，策略学不会站立。先用低强度，再逐步增强（配合课程学习）。
- **质量随机化未生效**：随机化代码没接到 MuJoCo 模型，参数改了但仿真没变。用校验脚本验证 `body_mass` 确实被修改。

## 11.8 本章小结

你已掌握：扩展域随机化参数、接入 reset 逻辑、课程学习推进、奖励平滑。

> 下一章把这一切组装成 PPO 多任务训练：从站立到行走、转向、爬坡，一个策略全部支持。
