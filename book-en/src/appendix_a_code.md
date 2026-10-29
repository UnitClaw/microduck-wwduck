# Code Inventory

> All code, scripts, and configuration accompanying this book, indexed by repository path. All code follows the repository's `book-dev` branch.

## A.1 Simulation and Training Code (software/training/)

| File | Purpose | Chapter |
|---|---|---|
| `mjlab/actuators/bam_actuator.py` | BAM servo model (HD1910 parameters) | BAM Actuator Modeling and Identification |
| `assets/robots/microduck_feetech.xml` | Feetech-edition MJCF model | Automated Onshape→MJCF Modeling, 9 |
| `train_ppo.py` | PPO training main script (with domain randomization) | Domain Randomization, 12 |
| `export_onnx.py` | export the ONNX policy | PPO Multi-Task Training |
| `test_env.py` | simulation-environment self-check | The MuJoCo-Warp Simulation Environment |
| `requirements.txt` / `requirements-lock.txt` | dependency list | The MuJoCo-Warp Simulation Environment |

## A.2 Calibration and System Identification (scripts/calibration/)

| File | Purpose | Chapter |
|---|---|---|
| `hd1910_bench_data_process.py` | bench CSV → BAM parameter fitting | Servo and IMU Calibration, 10 |
| `system_id_fit.py` | hardware data → inertia-parameter identification | The Sim2Real Closed-Loop Iteration |

## A.3 CAD Export (scripts/cad2mjcf/)

| File | Purpose | Chapter |
|---|---|---|
| `onshape_config.json` | Onshape assembly configuration | Automated Onshape→MJCF Modeling |
| `export_mjcf.py` | one-command onshape-to-robot export | Automated Onshape→MJCF Modeling |
| `validate_mjcf.py` | MJCF inertia/limit validation | Automated Onshape→MJCF Modeling |

## A.4 Validation Scripts (scripts/validation/)

| File | Purpose | Chapter |
|---|---|---|
| `check_bam_params.py` | BAM parameter physical-sanity check | BAM Actuator Modeling and Identification |
| `check_obs_act_space.py` | simulation ↔ board observation-space comparison | RK3566 Image and Firmware, 14 |
| `mass_inertia_check.py` | whole-machine mass/inertia validation | 3D Printing, Assembly, and Tolerances |

## A.5 Container and Configuration (docker/)

| File | Purpose | Chapter |
|---|---|---|
| `Dockerfile` | GPU training environment image | The MuJoCo-Warp Simulation Environment |
| `docker-compose.yml` | one-command startup | The MuJoCo-Warp Simulation Environment |

## A.6 Example Experiment Configurations (experiments/)

| Directory | Purpose | Chapter |
|---|---|---|
| `exp01_standup/config.yaml` | standing training config | Minimal Simulation Example |
| `exp02_walk_flat/config.yaml` | flat-ground walking config | PPO Multi-Task Training |
| `exp03_domain_rand/config.yaml` | domain-randomization ablation | Domain Randomization |
| `exp04_curriculum/config.yaml` | curriculum-learning config | Domain Randomization |

## A.7 On-Device Firmware (software/firmware/)

Rust multi-daemon system: `robotd` (main control loop), `configd` (configuration), `busd` (bus), `webui` (debug interface). See RK3566 Image and Firmware.
