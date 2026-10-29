# Task Extension

> Learning objectives: on top of basic walking, implement three advanced tasks — turning, climbing, and obstacle avoidance — turning a "straight-line walker" into a duck that "walks in many ways."

## 16.1 Turning Gait

On the basic walking task, change the reward from "forward along x" to "drive about the yaw angular velocity":

```python
yaw_rate = obs[:, yaw_vel_idx]        # angular velocity about the vertical axis
turn_reward = clip(target_yaw_speed * yaw_rate, 0, 1.0)
# suppress lateral slip
lateral_penalty = -torch.abs(obs[:, yaw_vel_idx_side])
reward = turn_reward + lateral_penalty + stance_rewards
```

Hardware verification: the duck turns in place to a specified angle without tipping or slipping.

## 16.2 Climbing Slopes

### 16.2.1 Building the Slope Environment

In MuJoCo, turn the ground into a slope, or add a sloped geom in the MJCF:

```xml
<geom type="box" size="..." pos="..." quat="..."/>
<!-- or tilt the ground -->
```

### 16.2.2 Climbing Reward

The difficulty of climbing is **advancing along the slope's projection** + maintaining stability:

```python
slope_forward = obs[:, proj_along_slope_idx]
reward = clip(slope_forward * 1.0, 0, 1.0) + stability_terms
```

> Pair with curriculum learning: flat ground first, then a small incline (5°), gradually up to 15° (see Domain Randomization).

### 16.2.3 Hardware Verification

Test climbing on a wooden block or incline pad, observing slipping and backward tipping. Ground-friction domain randomization is especially critical in this scenario.

## 16.3 Obstacle Avoidance (Advanced)

### 16.3.1 Visual Perception Integration

The RK3566 has limited compute (1 GB) and cannot run high-resolution vision + RL policy simultaneously. Recommended degraded schemes:

- use a **lightweight YOLO** (e.g., YOLOv5-nano / YOLO11-nano) for obstacle detection;
- output only low-dimensional information ("obstacle ahead or not, distance") into the observation vector;
- or time-share: low-frequency vision (e.g., 5 Hz) with high-frequency RL control (50 Hz).

### 16.3.2 Avoidance Reward

```python
if obstacle_detected:
    reward += turn_away_reward   # encourage turning away
else:
    reward += forward_reward     # advance when clear
```

### 16.3.3 Limitations

- The visual closed loop is an **advanced extension of this book**, involving camera selection, calibration, and vLA/perception-policy integration, and is a substantial workload;
- The book's main chain completes "body balancing + walking/turning/climbing," with visual avoidance as an optional extension.

## 16.4 Combined Multi-Task Training

Merge turning and climbing into the PPO Multi-Task Training multi-task one-hot encoding, so one ONNX supports all behaviors:

| Encoding | Task |
|---|---|
| `[0,1,0,0,0,0]` | walk forward |
| `[0,0,1,0,0,0]` | turn left |
| `[0,0,0,1,0,0]` | turn right |
| `[0,0,0,0,1,0]` | self-recover from a fall |
| `[0,0,0,0,0,1]` | climbing |

## 16.5 Engineering Pitfall Log

- **Backward tipping while climbing**: the reward only rewards forward progress, not center-of-mass stability, so the duck tips backward on slopes. Add a center-of-mass-projection reward.
- **Slip while turning**: ground friction is too low, causing lateral slip during turns. Strengthen ground-friction domain randomization to train more robust turning.

## 16.6 Chapter Summary

You have implemented three extended tasks — turning, climbing, and obstacle avoidance (advanced) — advancing MicroDuck from "able to walk" to "able to walk in many ways."

> The next part enters engineering and open-source compliance: how to make your entire project a standardized, compliant, reproducible open-source repository.
