# The Sim2Real Closed-Loop Iteration

> Learning objectives: master the hardware testing procedure, methods for diagnosing jitter/drift/falling, and implement the closed-loop iteration of "simulation training → hardware testing → data collection → model correction → retraining." This is the ultimate engineering capability of Sim2Real.

## 15.1 Hardware Testing Tiers

| Stage | Task | Pass criterion |
|---|---|---|
| 1 | Standing | stands stably for 30 s with no sustained drift |
| 2 | Squat / reset | action within limits, no seizure |
| 3 | Turn in place | rotates about the vertical axis without tipping |
| 4 | Walk on flat ground | straight-line progress, no jitter |
| 5 | Fall recovery | stands up on its own after falling |

## 15.2 Diagnosing Jitter, Drift, and Falling on Hardware

### Symptom A: Sustained jitter

Troubleshooting order:

1. **BAM parameters**: inaccurate bandwidth/backlash → re-calibrate (BAM Actuator Modeling and Identification);
2. **Action smoothing**: reward function missing the smoothing penalty → retrain;
3. **Control-loop timeout**: inference too slow, unstable control period (see Policy Deployment and On-Device Inference).

### Symptom B: Attitude drift (slowly tilting)

Troubleshooting order:

1. **IMU bias**: not six-face calibrated → Servo and IMU Calibration;
2. **IMU mounting tilt**: not compensated → add compensation in firmware;
3. **Center-of-mass offset**: asymmetric assembly → re-weigh per 3D Printing, Assembly, and Tolerances.

### Symptom C: Frequent falling

Troubleshooting order:

1. **Observation/action scaling**: dimension or scaling misaligned → `check_obs_act_space.py`;
2. **MJCF inertia error**: wrong center of mass → Automated Onshape→MJCF Modeling;
3. **Whole-machine mass differs from simulation**: different infill → cover via domain randomization or re-calibrate.

## 15.3 Hardware Data Collection (the Key to the Closed Loop)

Record IMU, joint angles, policy output, and timestamps on hardware, saving to `data/real_robot_logs/`:

```csv
t,imu_qw,imu_qx,imu_qy,imu_qz,q0,...,q13,a0,...,a13
```

> This data is the basis for system identification and parameter correction, and the source of the book's appendix experiment data.

## 15.4 Reverse System Identification (Advanced Closed Loop)

Use hardware excitation data to inversely identify the whole-machine inertia and correct the bias in the CAD-exported model:

1. Apply excitation to the robot (small oscillation, step);
2. Record the IMU + joint response;
3. Inversely fit the true mass/center of mass/inertia via least squares;
4. Write the identification result back to MJCF and retrain.

```python
# script: scripts/calibration/system_id_fit.py
# input: hardware excitation CSV + current MJCF
# output: recommended corrected inertia parameters
```

> This is an advanced academic Sim2Real technique that corrects residual errors (printing, assembly) left by Onshape geometric computation.

## 15.5 The Closed-Loop Iteration Process

```
simulation training → ONNX export → hardware test
                        ↓ (collect data)
                diagnose → correct BAM/MJCF/domain randomization
                        ↓
                  retrain → re-test (iterate)
```

Record each iteration cycle in `experiments/`, forming a reproducible iteration history.

## 15.6 Gait Performance Metrics

To quantify progress, define metrics:

- walking speed (m/s);
- standing-stability duration;
- disturbance robustness (can it recover from a push);
- fall-recovery success rate;
- turning-angle accuracy.

> These metrics are compared against the original Pollen MicroDuck, forming the book's performance-evaluation material (extended in Task Extension).

## 15.7 Engineering Pitfall Log

- **Changing everything in one iteration**: BAM, MJCF, and reward were all changed at once, so the problem still couldn't be located. **Change only one variable at a time** and record each result.
- **Hardware data without timestamps**: IMU and joint timelines can't be aligned. Synchronize clocks before collection.

## 15.8 Chapter Summary

You have mastered hardware gait diagnosis and the closed-loop iteration, and can continuously bring the simulation model closer to the real robot.

> The next chapter extends tasks, turning MicroDuck from "able to walk" into "able to walk in many ways."
