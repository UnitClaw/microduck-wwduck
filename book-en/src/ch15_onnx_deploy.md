# Policy Deployment and On-Device Inference

> Learning objectives: upload the trained ONNX policy to the board, verify the inference chain, and focus on solving observation/action scaling alignment — the most frequently hit Sim2Real pitfall.

## 14.1 Deployment Procedure

1. **Upload the ONNX**: upload `microduck_feetech_multitask.onnx` to the RK3566 board:

```bash
scp software/training/pretrained/microduck_feetech_multitask.onnx user@rk3566:~/microduck/
```

2. **Configure the load path**: make `robotd` load that policy file;
3. **Verify loading**: confirm the board loads the ONNX and outputs 14 dimensions.

## 14.2 The On-Device Inference Chain

```
IMU + joint readback → pack observation (61-dim) → ONNX inference → action (14-dim) → servo target positions
```

> Key: **observation space and action scaling must match simulation exactly** (see RK3566 Image and Firmware). Actions normalized to [-1, 1] in simulation must be de-normalized on the board to the actual servo position range (radians/degrees) before being sent.

## 14.3 Observation/Action Scaling Alignment (the Most Common Pitfall)

Three typical bugs:

1. **Dimension mismatch**: simulation observation is 61-dimensional but the board packs only 60, causing an inference error or silent misalignment;
2. **Scaling mismatch**: simulation uses radians but the board sends degrees, so servos turn the wrong way;
3. **Ordering mismatch**: the joint order in the observation differs from the board's readback order, so the policy "can't understand" the data.

> Use `check_obs_act_space.py` for automatic validation to eliminate these hidden bugs (see Section 7.5).

## 14.4 Verifying the 50 Hz Control-Loop Timing

The control loop must run stably on a 20 ms period:

- use the WebUI to view each iteration's latency;
- if inference + bus communication times out, the gait will jitter;
- optimization: accelerate inference with RKNN and batch servo commands with DMA.

```bash
# check control-loop latency statistics on the board
robotd status
# expected output: control_loop_avg_ms < 20
```

## 14.5 First Power-On Deployment Steps (Safe)

1. **Stand first**: load the standing task and observe whether the duck stands stably;
2. **Then squat/reset**: confirm actions stay within physical limits;
3. **Finally walk**: test walking only after stability is confirmed.

> At each stage observe: jitter, drift, and any exceeding of joint limits.

## 14.6 Engineering Pitfall Log

- **Action not de-normalized**: the [-1, 1] simulation action was sent directly as a position, driving the servo out of its physical limits and seizing the mechanism. Add de-normalization + clamping.
- **Observation ordering misaligned**: the board's joint readback order differs from the simulation training order, so policy behavior is abnormal. Use automatic validation + single-joint excitation tests to align them.

## 14.7 Chapter Summary

You have deployed the ONNX policy to the board, run the 50 Hz control loop, and specifically resolved observation/action scaling alignment.

> But "it runs" does not mean "it walks well." The next chapter performs real-robot gait iteration to tune Sim2Real in closed loop.
