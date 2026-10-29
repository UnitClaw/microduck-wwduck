# RK3566 镜像与固件

> 本章目标：把预编译的 RK3566 系统镜像烧录到板卡，理解板端 Rust 固件的进程架构，并掌握 50Hz 实时控制环的实现与验证。

## 7.1 系统镜像烧录

仓库 `software/image/` 提供预编译 RK3566 镜像。烧录流程：

1. **准备**：RK3566 板卡、SD 卡（≥8GB）、读卡器、镜像文件；
2. **烧录**：用 `balenaEtcher` 或 `dd` 写入 SD 卡：
```bash
# Linux 环境（假设 SD 卡为 /dev/sdX，务必确认设备号）
sudo dd if=software/image/microduck_rk3566.img of=/dev/sdX bs=4M status=progress
sync
```
3. **配置**：首次启动后配置 Wi-Fi、SSH、时区；
4. **验证**：确认系统启动、`robotd` 服务运行。

## 7.2 板端软件架构

RK3566 上运行的是 Rust 编写的多守护进程系统，典型结构：

```
├── robotd           # 主控制守护进程（50Hz 控制环）
├── configd          # 配置服务（舵机ID、波特率、IMU校准）
├── busd             # 舵机总线管理（TTL通信）
└── webui            # 调试用 WebUI（可视化 IMU/关节/策略输出）
```

进程间通过 **Unix socket + JSON-RPC** 通信，职责分离，便于独立调试与故障隔离。

## 7.3 50Hz 实时控制环（核心）

控制环是 Sim2Real 在真机上落地的关键。伪代码：

```rust
loop {
    let t0 = Instant::now();
    // 1. 读取 IMU 姿态
    let imu = imu_read();          // 四元数/欧拉角
    // 2. 读取舵机当前位置（回读磁编码）
    let q = servo_read_positions();
    // 3. 打包观测向量（必须与仿真观测空间严格一致）
    let obs = build_observation(imu, q);
    // 4. ONNX 推理，得到目标关节位置
    let action = onnx_infer(&obs); // 输出 14 维动作
    // 5. 下发舵机目标位置
    servo_write_targets(action);
    // 6. 保持 50Hz（20ms）周期
    let dt = t0.elapsed();
    if dt < Duration::from_millis(20) {
        sleep(20ms - dt);
    }
}
```

> ⚠️ **观测空间一致性是 Sim2Real 最高发的 bug**。仿真里观测向量是 61 维（含 IMU、关节位置、速度等），板端固件打包的观测**必须维度相同、缩放相同**。本书提供 `check_obs_act_space.py` 自动校验脚本（见 7.5）。

## 7.4 ONNX 推理优化

RK3566 算力有限，1GB 内存，跑 ONNX 步态需注意：
- 用 **RKNN/ONNX Runtime** 做板端推理；
- 单次推理控制在几毫秒内，留足控制环余量；
- 若无法同时跑高分辨率视觉 + RL 策略，视觉任务需降级或分时处理。

## 7.5 观测/动作空间自动校验脚本

`scripts/validation/check_obs_act_space.py`：读取仿真配置与板端固件的观测定义，自动比对维度与缩放因子。

```bash
python scripts/validation/check_obs_act_space.py \
  --sim-cfg experiments/exp02_walk_flat/config.yaml \
  --firmware-src software/firmware/src/obs.rs
```

> 输出：若维度或缩放不一致，直接报错，杜绝"仿真能走、真机乱走"的隐性 bug。

## 7.6 WebUI 调试

板端 WebUI 提供实时可视化：
- IMU 姿态曲线；
- 各关节角度回读；
- 策略输出（动作值）；
- 控制环延迟统计。

真机调试时，通过 WebUI 观察控制环是否超时、关节是否抖动、姿态是否漂移。

## 7.7 工程踩坑实录

- **控制环超时**：推理 + 总线通信耗时超过 20ms，控制环掉帧，步态抖动。优化方向：降低推理耗时、用 DMA 批量收发舵机指令。
- **总线丢包**：舵机通信超时，回读位置缺失，观测向量填了脏数据。需要在 `busd` 里做超时重传与数据有效性标记。

## 7.8 本章小结

你应能把 RK3566 跑起来，理解 50Hz 控制环的每个环节，并掌握观测空间一致性与总线超时的排查。

> 下一章做真机标定：舵机零位、IMU 六面校准、台架采集 HD1910 的动力学数据。
