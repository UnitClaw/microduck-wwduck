# Servo and IMU Calibration

> Learning objectives: perform three calibration tasks on the hardware side — servo zero-position calibration, IMU six-face calibration, and HD1910 bench data collection (providing measured data for the BAM parameter fitting in BAM Actuator Modeling and Identification).

## 8.1 Servo Zero-Position Calibration

The servo's factory center may not match the mechanical zero position. Zero-position calibration procedure:

1. Send a position-0 command to the servo;
2. Manually check whether the horn points to the mechanical design zero;
3. If misaligned, record the offset and write it into `configd`'s offset table;
4. Calibrate each joint independently and save the offsets to the on-device configuration.

```bash
# Example: calibrate a single servo via the configuration service
configd set-servo-offset --id 1 --offset +12
```

> An inaccurate zero position causes policy actions to land in the wrong place, appearing as a "duck standing crooked." This is a hardware prerequisite that must be resolved before Sim2Real.

## 8.2 Joint-Limit Calibration

Each joint's physical range of motion must be written into both the simulation (MJCF `limits`) and the board (servo target limits):

1. Manually drive each joint slowly and record the mechanical hard-stop angles;
2. Compare against the MJCF `limits` from Automated Onshape→MJCF Modeling;
3. If the simulated range exceeds the hardware, the trained policy may command "impossible angles" on the real robot, causing mechanical seizure or servo stall.

## 8.3 IMU Six-Face Calibration

IMU bias drift is another major source of gait instability. Six-face calibration method:

1. Place the IMU stationary in six orientations in turn: up, down, forward, backward, left, right;
2. Collect accelerometer/gyroscope readings for each face and solve for the bias;
3. Write the IMU calibration parameters to eliminate static drift.

```bash
# Example: enter calibration mode and place each of the six faces in turn
robotd imu-calibrate --faces 6
```

## 8.4 HD1910 Bench Data Collection (Core; for BAM Fitting)

BAM Actuator Modeling and Identification fits the BAM model using measured data, which requires bench experiments first. Mount the HD1910 on a bench and run four types of tests:

### 8.4.1 Step-Response Test (to fit bandwidth)

Send a step position command to the servo and record target position, actual magnetic-encoder position, and the time series.

```csv
t,target_pos,actual_pos,torque,voltage
0.000,0.0,0.001,0.00,7.4
0.002,0.5,0.003,0.01,7.4
0.004,0.5,0.012,0.02,7.4
...
```

### 8.4.2 Torque-Speed Test

Under different loads/voltages, record the maximum sustained torque and no-load speed, used to fit the maximum-torque parameter.

### 8.4.3 Friction and Backlash Test

- Rotate slowly in both directions to measure viscous and Coulomb friction;
- Sweep back and forth to measure the dead-zone/hysteresis (backlash).

### 8.4.4 Rotor Inertia

Combine the step response with a known load to inversely identify the rotor inertia.

## 8.5 Bench Data → BAM Parameter Fitting Script

The repository provides `scripts/calibration/hd1910_bench_data_process.py`:

```bash
python scripts/calibration/hd1910_bench_data_process.py \
  --csv data/hd1910_bench/hd1910_step_response.csv \
  --out experiments/exp01_standup/bam_params.json
```

Output `bam_params.json`:

```json
{
  "bandwidth_hz": 22.0,
  "b_viscous": 0.0018,
  "tau_coulomb": 0.009,
  "J_rotor": 1.2e-6,
  "servo_model": "HD1910",
  "voltage": 7.4,
  "unit": "SI(kg,m,s,rad)"
}
```

Fitting algorithm: least-squares fitting of a simplified first-order bandwidth model (`scipy.optimize.minimize`); see BAM Actuator Modeling and Identification for the code walkthrough.

## 8.6 Ablation Study Design (recorded in the book)

To quantify the value of calibration, design a comparison:

- Plan A: train with **empirically estimated** BAM parameters;
- Plan B: train with **bench-fitted** BAM parameters;
- Compare the **transfer success rate** on hardware (standing-stability duration, walking success rate).

## 8.7 Engineering Pitfall Log

- **IMU not six-face calibrated**: attitude drifts slowly and the duck stands increasingly crooked. Recovered after calibration.
- **Insufficient bench sampling rate**: the step response is too fast for the sampling rate, distorting the bandwidth fit. Re-sample at a higher rate (> 500 Hz).

## 8.8 Chapter Summary

Completing this chapter, you now have:

- Calibrated servo zero positions and joint limits;
- A calibrated IMU;
- Measured HD1910 bench data suitable for BAM fitting.

> The next chapter enters the simulation world: setting up MuJoCo-Warp + mjlab in preparation for training.
