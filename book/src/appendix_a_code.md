# 代码清单

> 本书配套的全部代码、脚本与配置，按仓库路径索引。所有代码以仓库 `book-dev` 分支为准。

## A.1 仿真与训练代码（software/training/）

| 文件 | 用途 | 对应章节 |
|---|---|---|
| `mjlab/actuators/bam_actuator.py` | BAM 舵机模型（HD1910 参数） | BAM 执行器建模与辨识 |
| `assets/robots/microduck_feetech.xml` | 飞特版 MJCF 模型 | Onshape→MJCF 自动化建模、MuJoCo-Warp 仿真环境 |
| `train_ppo.py` | PPO 训练主脚本（含域随机化） | 域随机化、PPO 多任务训练 |
| `export_onnx.py` | 导出 ONNX 策略 | PPO 多任务训练 |
| `test_env.py` | 仿真环境自检 | MuJoCo-Warp 仿真环境 |
| `requirements.txt` / `requirements-lock.txt` | 依赖清单 | MuJoCo-Warp 仿真环境 |

## A.2 标定与系统辨识（scripts/calibration/）

| 文件 | 用途 | 对应章节 |
|---|---|---|
| `hd1910_bench_data_process.py` | 台架CSV→BAM参数拟合 | 舵机与 IMU 标定、BAM 执行器建模与辨识 |
| `system_id_fit.py` | 真机数据→惯性参数辨识 | Sim2Real 闭环迭代 |

## A.3 CAD 导出（scripts/cad2mjcf/）

| 文件 | 用途 | 对应章节 |
|---|---|---|
| `onshape_config.json` | Onshape 装配配置 | Onshape→MJCF 自动化建模 |
| `export_mjcf.py` | onshape-to-robot 一键导出 | Onshape→MJCF 自动化建模 |
| `validate_mjcf.py` | MJCF 惯性/限位校验 | Onshape→MJCF 自动化建模 |

## A.4 校验脚本（scripts/validation/）

| 文件 | 用途 | 对应章节 |
|---|---|---|
| `check_bam_params.py` | BAM 参数物理合理性校验 | BAM 执行器建模与辨识 |
| `check_obs_act_space.py` | 仿真↔板端观测空间比对 | RK3566 镜像与固件、策略部署与板端推理 |
| `mass_inertia_check.py` | 整机质量/惯性校验 | 3D 打印、装配与公差 |

## A.5 容器与配置（docker/）

| 文件 | 用途 | 对应章节 |
|---|---|---|
| `Dockerfile` | GPU 训练环境镜像 | MuJoCo-Warp 仿真环境 |
| `docker-compose.yml` | 一键启动 | MuJoCo-Warp 仿真环境 |

## A.6 实验配置示例（experiments/）

| 目录 | 用途 | 对应章节 |
|---|---|---|
| `exp01_standup/config.yaml` | 站立训练配置 | 最小仿真示例 |
| `exp02_walk_flat/config.yaml` | 平地行走配置 | PPO 多任务训练 |
| `exp03_domain_rand/config.yaml` | 域随机化消融 | 域随机化 |
| `exp04_curriculum/config.yaml` | 课程学习配置 | 域随机化 |

## A.7 板端固件（software/firmware/）

Rust 多守护进程：`robotd`（主控制环）、`configd`（配置）、`busd`（总线）、`webui`（调试界面）。对应第 7 章。
