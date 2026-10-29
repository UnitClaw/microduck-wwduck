# BAM Actuator Modeling and Identification

> This is one of the book's most important technical chapters. Learning objectives: understand why the BAM (Bandwidth-Aware Motor) model is central to Sim2Real success, learn to fit the HD1910's BAM parameters from bench data, and correctly implement the backlash model.

## 10.1 Why the Servo Needs a Model

The hardware uses **position-control servos**, not ideal torque sources. A servo has torque limits, friction, bandwidth, backlash, and response latency. If simulation treats the servo as an ideal "point-and-shoot" actuator, the trained policy will, on hardware:

- lag behind commands (insufficient bandwidth);
- jitter (friction/backlash);
- fall (insufficient torque).

The **BAM model** is the actuator model that simulates these characteristics accurately — the core of Pollen's original Sim2Real success.

## 10.2 The Physical Components of the BAM Model

The BAM model contains five key parameters:

| Parameter | Physical meaning | Effect |
|---|---|---|
| Max torque `torque_max` | the servo's maximum output torque | whether actions feel "weak" |
| Rotor inertia `J_rotor` | moment of inertia of motor + gear train | response speed |
| Viscous friction `b_viscous` | proportional to velocity | damping, smoothness |
| Coulomb friction `tau_coulomb` | constant friction independent of velocity | jitter, dead zone |
| Closed-loop bandwidth `bandwidth` | the servo's upper limit on tracking commands | failing to keep up |

In addition, there is **backlash** — hysteresis caused by gear clearance.

## 10.3 Differences Between the Original XL330 and the Feetech HD1910

The original `microduck_rl` ships Dynamixel XL330-specific parameters (back-EMF, voltage-torque curve, friction, backlash, and response latency, all bench-calibrated). The Feetech HD1910, by contrast, has:

- different torque constant and rotor inertia;
- different friction, bandwidth, and backlash characteristics;
- different voltage characteristics.

**Running the original pre-trained model directly on Feetech servos will necessarily fail.** The BAM parameters must be re-calibrated and the policy retrained.

## 10.4 HD1910 Parameter Fitting (Measured vs. Estimated)

Servo and IMU Calibration collected the bench data. Here we fit it with `scripts/calibration/hd1910_bench_data_process.py`.

### 10.4.1 Fitting Script Walkthrough

```python
#!/usr/bin/env python3
"""
scripts/calibration/hd1910_bench_data_process.py
Fit BAM model parameters (bandwidth, viscous friction, Coulomb friction, rotor inertia) from bench CSV.
"""
import argparse, json
import pandas as pd, numpy as np
from scipy.optimize import minimize

def bam_model_step(t, params, target):
    """Simplified first-order bandwidth model"""
    w, b, tau_c, J = params
    return target * (1 - np.exp(-w * t))   # first-order response approximation

def loss_fn(params, t, target, measured):
    pred = bam_model_step(t, params, target[0])
    return np.mean((pred - measured)**2)

def fit_bam(csv_path, out_json):
    df = pd.read_csv(csv_path)
    t = df["t"].values
    target = df["target_pos"].values
    actual = df["actual_pos"].values
    x0 = [22.0, 0.003, 0.012, 1.2e-6]     # empirical initial values
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

### 10.4.2 Reference Parameters (replace with measured values)

```python
hd1910_params = {
    "torque_max": 12.0,      # N·cm, HD1910 nominal stall torque @ 12V
    "rotor_inertia": 1.2e-6, # kg·m²
    "damping": 0.0018,       # viscous friction
    "coulomb_friction": 0.009, # Coulomb friction
    "bandwidth": 22,         # Hz, roughly 20–25 Hz
    "backlash": 0.0025,      # backlash (rad)
    "voltage": 12.0
}
```

### 10.4.3 Modifying `bam_actuator.py`

Add to the Feetech branch of `software/training/mjlab/actuators/bam_actuator.py`:

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

## 10.5 The Backlash Model: The Easiest Place to Go Wrong

**Key design decision**: Pollen's original places the backlash at the **servo output (the encoder sits after the backlash)**. This means:

- the encoder reads the **output-shaft** position, not the motor-shaft position;
- the position error caused by backlash enters the observation (feedback) and affects the policy.

The original implements `BacklashEncoderBamActuator` — the single most important design for Sim2Real success. **The replica must implement it in full; otherwise back-and-forth oscillation, jitter, and tracking error will all be mismatched.**

> ⚠️ Backlash is one of the largest contributors to Sim2Real error. Back-and-forth oscillation on hardware is essentially always caused by inaccurate backlash. After fitting, it is recommended to add perturbation to it in domain randomization (see Domain Randomization).

## 10.6 Ablation Study: Estimated vs. Measured

To demonstrate the value of measured fitting, design a comparison (recorded in the appendix data):

- Plan A: train with empirically estimated BAM parameters;
- Plan B: train with bench-fitted BAM parameters;
- Metrics: hardware standing-stability duration, walking success rate, fall-recovery success rate.

> Expected conclusion: measured parameters significantly improve hardware transfer success, especially in walking and rough-terrain scenarios.

## 10.7 Engineering Pitfall Log

- **Backlash in the wrong place**: placing backlash on the motor shaft instead of the output makes the simulated observation inconsistent with the hardware encoder reading, causing back-and-forth oscillation. 
- **Distorted bandwidth fit**: insufficient bench sampling rate with a fast step response yields an underestimated bandwidth, so the simulated servo "can't keep up." Re-sample at a higher rate (> 500 Hz) and refit.

## 10.8 Chapter Summary

You can now:

- understand the BAM model's five core parameters;
- fit the HD1910's BAM parameters from bench data;
- correctly implement the backlash model (encoder on the output side).

> Next, add domain randomization to training so the policy is robust to parameter error, further shrinking the Sim2Real gap.
