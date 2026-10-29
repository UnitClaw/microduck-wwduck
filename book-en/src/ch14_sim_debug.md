# Simulation Debugging and Diagnostics

> Learning objectives: learn to observe training with TensorBoard, master methods for locating training failures (non-convergence, jitter, action divergence), and judge whether the problem lies in the reward function, the dynamics, or the observation space.

## 13.1 Observing Training with TensorBoard

The training process records reward curves, losses, action distributions, and observation statistics:

```bash
tensorboard --logdir experiments/exp02_walk_flat/tensorboard
```

Key metrics:

- **reward**: whether it rises overall and whether there are plateaus;
- **action std**: whether actions converge (don't diverge);
- **value loss / policy loss**: whether they oscillate.

## 13.2 Locating Common Training Failures

### Symptom 1: Non-convergence / reward plateau

Troubleshooting order:

1. **Reward function**: is the reward too sparse? Is the signal too small?
2. **Observation**: do key states (height, velocity) enter the observation?
3. **Learning rate**: too large (oscillation) or too small (too slow)?

### Symptom 2: Action jitter / divergence

Troubleshooting order:

1. **Missing action penalty**: add `action_penalty` and `smooth_penalty` (see 13.3);
2. **High-frequency reward fluctuation**: suppress violent actions;
3. **Actuator bandwidth too low**: the simulated servo can't keep up (see BAM Actuator Modeling and Identification).

### Symptom 3: Always falling

Troubleshooting order:

1. **Dynamics error**: wrong MJCF center of mass / inertia (re-check Automated Onshape→MJCF Modeling);
2. **Over-strong domain randomization**: too hard to train; lower intensity or pair with curriculum learning;
3. **Reward doesn't encourage standing**: add standing and height rewards.

## 13.3 A Framework for Locating Simulation-vs-Hardware Differences

When "simulation is perfect but the robot walks chaotically," check in priority order:

| Priority | Check item | Tool / chapter |
|---|---|---|
| 1 | Observation-space consistency | `check_obs_act_space.py` (RK3566 Image and Firmware) |
| 2 | Joint-limit alignment | MJCF `limits` vs. hardware (HD1910 CAD Model Analysis / Servo and IMU Calibration) |
| 3 | IMU bias / mounting | six-face calibration (Servo and IMU Calibration) |
| 4 | BAM parameter accuracy | bench fitting (BAM Actuator Modeling and Identification) |
| 5 | Whole-machine mass / center of mass | weighing vs. CAD (3D Printing, Assembly, and Tolerances) |

> This framework is the core message the book reiterates: **the Sim2Real gap is not a single cause but an entire chain from observation, dynamics, actuation, to sensing**, and it must be investigated layer by layer.

## 13.4 Simulation Self-Check Scripts

After every code change, run the environment self-checks first to keep errors out of training:

```bash
python scripts/validation/test_env.py
python scripts/validation/validate_mjcf.py --mjcf software/training/assets/robots/microduck_feetech.xml
```

## 13.5 Engineering Pitfall Log

- **MJCF unit error**: Onshape exported in millimeters without converting to meters, scaling the model by 1000× and crashing simulation (see Automated Onshape→MJCF Modeling).
- **Reward drowned in noise**: the reward signal magnitude is far smaller than `action_penalty`, so the policy "gives up" and outputs only tiny actions. Adjust the reward weights.

## 13.6 Chapter Summary

You have mastered the framework for locating training failures, and the layer-by-layer method for "good in simulation, poor on hardware."

> The next chapter enters deployment: sending the ONNX policy to the RK3566 board and running the hardware control loop.
