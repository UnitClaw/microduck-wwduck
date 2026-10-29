# PPO Multi-Task Training

> Learning objectives: understand PPO's role in robot locomotion, learn to design multi-task reward functions, implement a single-policy scheme where "one ONNX supports multiple gaits," and master training hyperparameters and export.

## 12.1 PPO Fundamentals

PPO (Proximal Policy Optimization) is a common algorithm for robot reinforcement learning:

- it clips between the old and new policies to prevent overly aggressive updates that crash training;
- it suits continuous action spaces (joint target positions);
- it has a mature implementation and relatively simple hyperparameters.

MicroDuck's PPO uses MuJoCo-Warp to sample hundreds of environments in parallel, paired with the mjlab training loop.

## 12.2 Multi-Task, Single-Policy Scheme

The original uses continuous velocity commands. To support multiple gaits, this book adopts a **multi-task, single-policy** scheme:

append a **one-hot task encoding** to the observation vector:

| Encoding | Task |
|---|---|
| `[1,0,0,0,0,0]` | stand in place |
| `[0,1,0,0,0,0]` | walk forward |
| `[0,0,1,0,0,0]` | turn left |
| `[0,0,0,1,0,0]` | turn right |
| `[0,0,0,0,1,0]` | self-recover from a fall |
| `[0,0,0,0,0,1]` | low-speed climbing |

The on-device firmware only needs to pass a task id to switch gaits, without loading multiple ONNX models.

## 12.3 Multi-Task Reward Design

Rewards branch by task. For walking, for example:

```python
forward_reward = torch.clip(obs[:, 0] * 1.2, 0, 1.5)   # forward speed along x
height_reward  = -torch.square(obs[:, 2] - 0.22)        # maintain body height
tilt_penalty   = -(torch.square(obs[:, 3]) + torch.square(obs[:, 4])) # suppress tilt
action_penalty = -0.01 * torch.sum(action**2, dim=-1)   # action penalty
smooth_penalty = -0.05 * torch.sum((action - prev_action)**2, dim=-1)
reward = forward_reward + height_reward + tilt_penalty \
       + action_penalty + smooth_penalty
```

Reward essentials per task:

| Task | Key reward terms |
|---|---|
| Standing | maintain height, suppress tilt, suppress jitter |
| Walking | forward speed +, maintain height +, suppress roll |
| Turning | yaw angular velocity +, lateral displacement − |
| Fall recovery | body elevation +, joint reset, standing reward |
| Climbing | maintain stability + advance along the slope (see 17.2) |

## 12.4 Training Configuration and Tuning

```yaml
# key training configuration
num_envs: 256
learning_rate: 3e-4
batch_size: 8192
update_epochs: 10
clip_range: 0.2
task: "multitask"    # multi-task mode
domain_randomization: true
control_freq: 50
```

Quick tuning reference:

| Problem | Adjustment |
|---|---|
| Not converging | lower learning rate, raise reward scale |
| Action divergence | add action/smoothing penalties |
| Training crash | reduce clip_range, lower randomization intensity |
| Overfitting to simulation | strengthen domain randomization |

## 12.5 Exporting the ONNX Policy

After training, export a deployable ONNX:

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

Place the artifact `microduck_feetech_multitask.onnx` in `software/training/pretrained/`.

> Large-file management: ONNX models are large; use **Git LFS** rather than committing directly to the main repo (see Engineering Practices and Open-Source Compliance).

## 12.6 Ready-to-Use Pre-Trained Weights

The repository's `pretrained/` should provide pre-trained ONNX models so readers can verify the whole chain out of the box without training from scratch. Each weight must carry:

- the matching MJCF version;
- the BAM parameter file;
- the training configuration;
- the experiment-log link.

## 12.7 Engineering Pitfall Log

- **Observation/action scaling mismatch**: simulation normalizes to [-1, 1] but the board does not, so hardware actions overflow. Validate with `check_obs_act_space.py`.
- **Unbalanced multi-task reward weights**: the walking reward is too large, so the standing task is ignored. Sample by task per episode to balance training.

## 12.8 Chapter Summary

You can now: design multi-task rewards, tune PPO, and export and manage ONNX pre-trained weights.

> The next chapter handles simulation debugging: methods for locating non-convergence, jitter, and action divergence.
