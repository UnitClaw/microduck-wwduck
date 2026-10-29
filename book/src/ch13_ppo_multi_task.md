# PPO 多任务训练

> 本章目标：理解 PPO 在机器人运动中的角色，学会设计多任务奖励函数，实现"一个 ONNX 支持多种步态"的单策略方案，并掌握训练调参与导出。

## 12.1 PPO 基础

PPO（Proximal Policy Optimization）是机器人强化学习的常用策略：
- 在旧策略与新策略之间做裁剪（clip），防止更新过猛导致训练崩溃；
- 适合连续动作空间（关节目标位置）；
- 实现成熟、调参相对简单。

MicroDuck 的 PPO 用 MuJoCo-Warp 并行数百环境采样，配合 mjlab 训练循环。

## 12.2 多任务单策略方案

原版是连续速度指令控制。为支持多种步态，本书采用**多任务单策略**方案：

在观测向量里追加 **one-hot 任务编码**：

| 编码 | 任务 |
|---|---|
| `[1,0,0,0,0,0]` | 原地站立 |
| `[0,1,0,0,0,0]` | 向前行走 |
| `[0,0,1,0,0,0]` | 左转 |
| `[0,0,0,1,0,0]` | 右转 |
| `[0,0,0,0,1,0]` | 摔倒自恢复 |
| `[0,0,0,0,0,1]` | 低速爬坡 |

板端固件只需传入任务 id，即可切换步态，无需加载多个 ONNX。

## 12.3 多任务奖励函数设计

按任务分支奖励。以行走为例：

```python
forward_reward = torch.clip(obs[:, 0] * 1.2, 0, 1.5)   # x 方向前进速度
height_reward  = -torch.square(obs[:, 2] - 0.22)        # 保持身体高度
tilt_penalty   = -(torch.square(obs[:, 3]) + torch.square(obs[:, 4])) # 抑制倾斜
action_penalty = -0.01 * torch.sum(action**2, dim=-1)   # 动作惩罚
smooth_penalty = -0.05 * torch.sum((action - prev_action)**2, dim=-1)
reward = forward_reward + height_reward + tilt_penalty \
       + action_penalty + smooth_penalty
```

各任务奖励要点：

| 任务 | 关键奖励项 |
|---|---|
| 站立 | 保持高度、抑制倾斜、抑制抖动 |
| 行走 | 前进速度 +、保持高度 +、抑制侧倾 |
| 转向 | 绕 yaw 角速度 +、横向位移 - |
| 摔倒自恢复 | 身体抬升 +、关节复位、站立奖励 |
| 爬坡 | 保持稳定 + 沿斜面前进（见 16.3） |

## 12.4 训练配置与调参

```yaml
# 训练配置要点
num_envs: 256
learning_rate: 3e-4
batch_size: 8192
update_epochs: 10
clip_range: 0.2
task: "multitask"    # 多任务模式
domain_randomization: true
control_freq: 50
```

调参速查：

| 问题 | 调整方向 |
|---|---|
| 不收敛 | 降低学习率、提高奖励尺度 |
| 动作发散 | 增加动作/平滑惩罚 |
| 训练崩溃 | 减小 clip_range、降域随机强度 |
| 过拟合仿真 | 增强域随机化 |

## 12.5 导出 ONNX 策略

训练完成后导出可部署的 ONNX：

```python
# export_onnx.py
import torch
from policy import PPOPolicy

policy = PPOPolicy.load("outputs/best_model.pt")
policy.eval()
dummy_input = torch.randn(1, policy.obs_dim)
torch.onnx.export(
    policy, dummy_input,
    "microduck_feetech_multitask.onnx",
    opset_version=17, input_names=["obs"], output_names=["action"]
)
```

产物 `microduck_feetech_multitask.onnx` 放入 `software/training/pretrained/`。

> 大文件管理：ONNX 模型体积大，建议用 **Git LFS** 管理，不直接提交 git 主仓库（见第 17 章）。

## 12.6 预训练权重开箱即用

仓库 `pretrained/` 应提供训练好的预训练 ONNX，供读者开箱即用、验证整条链路，不必从零训练。每个权重需附带：
- 对应的 MJCF 版本；
- BAM 参数文件；
- 训练配置；
- 实验记录链接。

## 12.7 工程踩坑实录

- **观测/动作缩放不一致**：仿真归一化 [-1,1]，板端未归一化，真机动作溢出。用 `check_obs_act_space.py` 校验。
- **多任务奖励权重失衡**：行走奖励权重过大，站立任务被忽略。按任务分 episode 采样，平衡训练。

## 12.8 本章小结

你现在能：设计多任务奖励、调参 PPO、导出并管理 ONNX 预训练权重。

> 下一章处理仿真调试：训练不收敛、抖动、动作发散的定位方法。
