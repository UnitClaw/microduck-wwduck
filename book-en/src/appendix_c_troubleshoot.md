# Troubleshooting Handbook

> A quick reference to troubleshooting across the book, indexed by symptom. Each entry gives the most likely cause and the corresponding chapter.

## C.1 Simulation-Side Faults

| Symptom | Likely cause | Handling | Chapter |
|---|---|---|---|
| Simulation crash / numerical explosion | MJCF unit error / non-positive-definite inertia | check units, `validate_mjcf.py` | Automated Onshape→MJCF Modeling |
| Falls immediately on startup | wrong center of mass / inertia | re-check CAD→MJCF | Automated Onshape→MJCF Modeling |
| Violent joint jitter | mismatched BAM parameters | re-calibrate on the bench | BAM Actuator Modeling and Identification |
| CUDA out of memory | `num_envs` too large | reduce `num_envs` | The MuJoCo-Warp Simulation Environment |
| Training not converging | sparse reward / poor learning rate | tune reward, lower LR | PPO Multi-Task Training |
| Action divergence | missing action/smoothing penalty | add penalties | PPO Multi-Task Training |

## C.2 Hardware-Side Faults

| Symptom | Likely cause | Handling | Chapter |
|---|---|---|---|
| A servo doesn't respond | ID conflict | reconfigure the ID | Hardware Circuits and the TTL Bus |
| Random bus packet loss | signal interference | lower baud rate, add isolation | Hardware Circuits and the TTL Bus |
| Freezes on power-on | insufficient power / short | separate power, test one by one | Hardware Circuits and the TTL Bus |
| Position drift | supply voltage sag | check BMS, wire gauge | Hardware Circuits and the TTL Bus |
| Gait jitter | inaccurate BAM / control-loop timeout | re-calibrate / optimize inference | BAM Actuator Modeling and Identification, 14 |
| Attitude slowly tilting | IMU bias / mounting tilt | six-face calibration / compensate tilt | Servo and IMU Calibration |
| Frequent falling | observation scaling misaligned | `check_obs_act_space.py` | RK3566 Image and Firmware, 14 |

## C.3 Sim2Real Difference Troubleshooting (Priority Order)

| Priority | Check item | Tool |
|---|---|---|
| 1 | Observation-space consistency | `check_obs_act_space.py` |
| 2 | Joint-limit alignment | MJCF vs. hardware |
| 3 | IMU bias / mounting | six-face calibration |
| 4 | BAM parameter accuracy | bench fitting |
| 5 | Whole-machine mass / center of mass | weighing vs. CAD |

> Principle: **change only one variable at a time** and record each result, avoiding the inability to locate the cause from changing multiple factors at once.

## C.4 Mechanical-Side Faults

| Symptom | Likely cause | Handling | Chapter |
|---|---|---|---|
| Servo horn slipping | insufficient interference | replace horn / add adhesive | 3D Printing, Assembly, and Tolerances |
| Joint seizure | print interference | correct CAD clearance | HD1910 CAD Model Analysis |
| Center-of-mass offset | asymmetric assembly | check left-right consistency | 3D Printing, Assembly, and Tolerances |
| Printed part fracture | insufficient wall thickness/infill | thicken, raise infill | 3D Printing, Assembly, and Tolerances |
