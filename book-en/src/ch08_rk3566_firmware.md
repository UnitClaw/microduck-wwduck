# RK3566 Image and Firmware

> Learning objectives: flash the prebuilt RK3566 system image onto the board, understand the on-device Rust firmware's process architecture, and master the implementation and verification of the 50 Hz real-time control loop.

## 7.1 Flashing the System Image

The repository's `software/image/` provides the prebuilt RK3566 image. Flashing procedure:

1. **Prepare**: RK3566 board, SD card (≥ 8 GB), card reader, and the image file;
2. **Flash**: write to the SD card with `balenaEtcher` or `dd`:

```bash
# Linux (assuming the SD card is /dev/sdX; verify the device name)
sudo dd if=software/image/microduck_rk3566.img of=/dev/sdX bs=4M status=progress
sync
```

3. **Configure**: after first boot, configure Wi-Fi, SSH, and timezone;
4. **Verify**: confirm the system boots and the `robotd` service runs.

## 7.2 On-Device Software Architecture

The RK3566 runs a multi-daemon system written in Rust, with this typical structure:

```
├── robotd           # main control daemon (50 Hz control loop)
├── configd          # configuration service (servo IDs, baud rate, IMU calibration)
├── busd             # servo bus management (TTL communication)
└── webui            # debug WebUI (visualizes IMU / joints / policy output)
```

Processes communicate via **Unix socket + JSON-RPC**, with separated responsibilities for independent debugging and fault isolation.

## 7.3 The 50 Hz Real-Time Control Loop (Core)

The control loop is the key to landing Sim2Real on hardware. Pseudocode:

```rust
loop {
    let t0 = Instant::now();
    // 1. read IMU attitude
    let imu = imu_read();          // quaternion / Euler angles
    // 2. read current servo positions (magnetic-encoder readback)
    let q = servo_read_positions();
    // 3. pack the observation vector (must match the simulation observation space exactly)
    let obs = build_observation(imu, q);
    // 4. ONNX inference to obtain target joint positions
    let action = onnx_infer(&obs); // outputs a 14-dim action
    // 5. write servo target positions
    servo_write_targets(action);
    // 6. hold the 50 Hz (20 ms) period
    let dt = t0.elapsed();
    if dt < Duration::from_millis(20) {
        sleep(20ms - dt);
    }
}
```

> ⚠️ **Observation-space consistency is the single most frequent Sim2Real bug.** In simulation the observation vector is 61-dimensional (including IMU, joint positions, velocities, etc.); the observation packed by the on-device firmware **must have the same dimension and the same scaling**. This book provides the `check_obs_act_space.py` validation script (see 8.5).

## 7.4 ONNX Inference Optimization

The RK3566 has limited compute (1 GB RAM), so running ONNX gait inference requires care:

- Use **RKNN/ONNX Runtime** for on-device inference;
- Keep a single inference to a few milliseconds, leaving headroom in the control loop;
- If high-resolution vision and the RL policy cannot run simultaneously, downgrade or time-share the vision task.

## 7.5 Observation/Action-Space Validation Script

`scripts/validation/check_obs_act_space.py`: reads the simulation config and the on-device firmware's observation definition, and automatically compares dimensions and scaling factors.

```bash
python scripts/validation/check_obs_act_space.py \
  --sim-cfg experiments/exp02_walk_flat/config.yaml \
  --firmware-src software/firmware/src/obs.rs
```

> Output: any dimension or scaling mismatch raises an error immediately, eliminating the hidden bug of "walks in simulation, walks chaotically on hardware."

## 7.6 WebUI Debugging

The on-device WebUI provides real-time visualization:

- IMU attitude curves;
- per-joint angle readback;
- policy output (action values);
- control-loop latency statistics.

During hardware debugging, use the WebUI to observe whether the control loop times out, joints jitter, or attitude drifts.

## 7.7 Engineering Pitfall Log

- **Control-loop timeout**: inference + bus communication exceeding 20 ms causes dropped control frames and gait jitter. Optimize by reducing inference latency and using DMA for batched servo commands.
- **Bus packet loss**: servo communication times out, position readback is missing, and the observation vector is filled with garbage data. Add timeout-retransmission and data-validity flags in `busd`.

## 7.8 Chapter Summary

You should be able to bring up the RK3566, understand every stage of the 50 Hz control loop, and troubleshoot observation-space consistency and bus timeouts.

> The next chapter performs hardware calibration: servo zero positions, IMU six-face calibration, and bench collection of HD1910 dynamics data.
