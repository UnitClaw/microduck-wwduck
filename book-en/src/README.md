<div style="text-align:center; padding: 2.5rem 0 0.5rem;">

  <div style="letter-spacing: 0.22em; color:#8a8f98; font-size: 0.78rem; margin-bottom: 1.3rem;">OPEN-SOURCE ENGINEERING PRACTICE · EMBODIED INTELLIGENCE · SIM2REAL REINFORCEMENT LEARNING</div>

  <h1 style="margin:0 0 0.7rem; font-size: 1.5rem; line-height: 1.35; font-weight: 800; overflow-wrap: break-word;">MicroDuck: A Bipedal Robot with Feetech Servos<br>(First Edition)</h1>

  <div style="font-size: 1.05rem; color:#3b4045; font-weight: 600; margin-bottom: 1.5rem;">An Engineering Methodology for Sim2Real Transfer in Bipedal Robots</div>

  <p style="text-align:left; color:#4a5058; font-size:0.94rem; line-height:1.8; margin:0 0 1.7rem;">
    Building on the open-source MicroDuck released by Pollen Robotics, this book presents a <b>reproducible, low-cost</b> bipedal-robot engineering pipeline for China's domestic supply chain: from MJCF reverse engineering and automated Onshape&nbsp;→&nbsp;MJCF dynamic modeling, through bench identification of the HD1910 serial-bus servo using a Bandwidth-Aware Motor (BAM) model, to PPO policy training with extended domain randomization and curriculum learning, and finally to 50&nbsp;Hz on-device inference on the RK3566 and closed-loop iteration on the physical robot. Together, these cover the full-stack engineering loop of CAD → dynamics → actuation → simulation → hardware.
  </p>

  <div style="color:#3b4045; font-size:0.95rem; margin-bottom: 1.8rem;">
    WWNT Robotics<span style="color:#c2c6cc;"> · </span>open-source ecosystem on GitHub <a href="https://github.com/UnitClaw" target="_blank" rel="noopener">UnitClaw</a>
  </div>

</div>

---

# Preface

## Reading Entry Points

- **Online book (English edition)**: <https://unitclaw.github.io/microduck-wwduck/en/>
- **中文版（Chinese edition）**: <https://unitclaw.github.io/microduck-wwduck/>
- **Book source repository**: <https://github.com/UnitClaw/microduck-wwduck> (the `book/` Chinese and `book-en/` English directories, written in mdbook and compiled into a web book on every commit)

> Every chapter in this book is bound to a specific commit hash in the companion engineering repository, so readers can check out the corresponding version and fully reproduce each experiment.
> Each chapter has two entry points in its **upper-right corner**: the 📝 "edit" icon, which jumps to that chapter's source file, and the Octocat icon, which jumps to the repository home.

## Chapter ↔ Repository Resource Mapping

Each chapter maps to concrete engineering resources in the repository; click to jump to the source code, drawings, bills of materials, and logs:

| Book Chapter | Corresponding Repository Resource |
|---|---|
| Parts Store | [PARTS.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/PARTS.md) · [Official Store](https://www.wwntai.com/parts.html) |
| Minimal Simulation Demo | [software/training/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/training) |
| CAD Model Analysis | [cad/](https://github.com/UnitClaw/microduck-wwduck/tree/master/cad) · [CAD repo](https://github.com/UnitClaw/microduck-replica-cad) |
| Onshape → MJCF | [scripts/](https://github.com/UnitClaw/microduck-wwduck/tree/master/scripts) |
| 3D Printing & Assembly | [print/](https://github.com/UnitClaw/microduck-wwduck/tree/master/print) · [BOM.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/BOM.md) |
| Hardware Circuits & Bus | [hardware/](https://github.com/UnitClaw/microduck-wwduck/tree/master/hardware) |
| RK3566 Image & Firmware | [software/image/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/image) · [software/studio/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/studio) |
| Servo / IMU Calibration | [tools/](https://github.com/UnitClaw/microduck-wwduck/tree/master/tools) |
| Simulation & Training | [software/training/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/training) |
| ONNX Deployment | [software/studio/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/studio) |
| Real-Robot Gait | [software/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software) |
| Engineering & Open Source | [NOTICE.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/NOTICE.md) · [LICENSE](https://github.com/UnitClaw/microduck-wwduck/blob/master/LICENSE) |
| BOM | [BOM.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/BOM.md) |
| Troubleshooting | [踩坑记录.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/踩坑记录.md) |

> Reverse entry points on the repository side: the repository `README.md` carries the online-book link and the parts-store entry at the top; documents such as `PARTS.md` and `BOM.md` also reference their corresponding book chapters.

## Core Engineering Highlights (Key Innovations of This Book)

Building on the community `microduck-replica` project, this book completes six engineering loops that constitute the **key innovations** relative to both the original Pollen robot and the community replica:

### Highlight 1 — Automated Onshape → MJCF Pipeline (on par with Pollen's original)

A complete reproduction of Pollen's original Onshape → MJCF automated workflow: starting from the full-assembly STEP import, the pipeline automatically computes each link's **mass, center of mass, and inertia tensor**, and uses `validate_mjcf.py` to automatically validate the inertia tensor, joint limits, and total mass — **eliminating the Sim2Real bias** introduced by the replica's manual inertia estimation.

> See Automated Onshape→MJCF Modeling · Deliverables: `scripts/cad2mjcf/export_mjcf.py` + `validate_mjcf.py`

### Highlight 2 — Bench Identification of the HD1910 Servo Using a BAM Model

Performs **bench-based identification** of the Feetech HD1910 to fit the full BAM (Bandwidth-Aware Motor) parameter set — bandwidth, viscous friction, Coulomb friction, rotor inertia, and backlash — resolving the Sim2Real bias caused by the original replica's use of empirically guessed parameters.

> See Servo and IMU Calibration and BAM Actuator Modeling and Identification · Deliverable: `scripts/calibration/hd1910_bench_data_process.py`

### Highlight 3 — Extended Domain Randomization + Curriculum Learning

Extends the baseline domain randomization with an eight-dimensional parameter set (mass, friction, torque, bandwidth, backlash, IMU noise, ground friction, gravity) combined with **curriculum learning** that progresses from standing to walking, turning, and climbing; **ablation studies** compare the real-robot transfer success of different randomization strategies.

> See Domain Randomization and PPO Multi-Task Training · Deliverables: the `domain_rand` extended parameter set + curriculum scheduling logic

### Highlight 4 — Automatic Validation Between Simulated Observation Space and On-Device Firmware

Provides an **automatic validation script that cross-checks the simulation observation space against the on-device Rust firmware**, comparing the dimension, scaling, and ordering of observations/actions in one step, thereby eliminating the most common hidden Sim2Real bugs caused by dimension or scaling mismatches.

> See RK3566 Image and Firmware and Policy Deployment and On-Device Inference · Deliverable: `scripts/validation/check_obs_act_space.py`

### Highlight 5 — A Complete Experiment-Management System (Reproducible)

Establishes a standardized **experiment-management system**: every training run saves `config.yaml`, an MJCF snapshot, BAM parameters, training logs, and TensorBoard curves, so any experiment can be reproduced and traced one-to-one.

> See Engineering Practices and Open-Source Compliance · Deliverable: the `experiments/` directory convention (config / mjcf / bam_params / logs / readme)

### Highlight 6 — Docker-Locked Dependency Versions

Uses Docker to pin CUDA, Python, MuJoCo-Warp, mjlab, and other dependency versions, eliminating the "works locally, fails elsewhere" environment problem and enabling one-command reproduction of the training environment.

> See Minimal Simulation Example and Engineering Practices and Open-Source Compliance · Deliverables: `Dockerfile` + `requirements-lock.txt`

---

## Why This Book

In 2025, Pollen Robotics — a robotics team under Hugging Face — open-sourced **MicroDuck**, a bipedal robot duck trained with Sim2Real reinforcement learning. Its core paradigm is to train the robot's policy in a GPU simulation and deploy it directly to real hardware, with no traditional gait planning required.

The original MicroDuck uses Dynamixel servos and is sold internationally on pre-order; it cannot be shipped directly to mainland China, and at 399 USD plus forwarding and customs fees, it is difficult for hobbyists and domestic university labs to obtain. The community responded with the `microduck-replica` project, which ports MicroDuck's mechanical structure to the domestic Feetech HD1910 bus servo.

The original replica, however, has clear shortcomings:

- The MJCF dynamics model relies on **manually estimated link inertias and centers of mass**, producing a large gap between simulation and hardware that makes Sim2Real transfer difficult;
- The HD1910 BAM parameters are empirically guessed, with no bench-based calibration procedure;
- There is no standardized experiment management, so training configs, models, and logs are scattered and hard to reproduce;
- There is no one-command containerized environment, and CUDA, Warp, and mjlab version dependencies collide easily;
- There is no complete engineering troubleshooting log, so readers have no systematic way to handle falling in simulation, hardware jitter, servo packet loss, and similar problems.

The goal of this book is to complete this engineering loop: **to fully reproduce Pollen's Onshape→MJCF automated workflow and to land bench-based HD1910 BAM identification, domain randomization, curriculum learning, and RK3566 on-device deployment, forming a reproducible, low-cost, domestic-servo MicroDuck full-stack engineering practice.**

This book is neither a purely theoretical reinforcement-learning textbook nor a simple parts-assembly manual. It is an **engineering practice log**: it contains successful experiments, failed attempts, parameter ablation comparisons, and diagnoses of the gap between simulation and hardware.

## Intended Audience

- Graduate and undergraduate students in robotics, embodied intelligence, and reinforcement learning;
- Robotics-lab engineers at universities and open-source-hardware enthusiasts;
- Developers who want to get started with Sim2Real, MuJoCo-Warp, and low-cost bipedal RL robots.

> Recommended reading path:
> 1. First run [Minimal Simulation Demo], launching the simulation with one Docker command to see the robot duck's simulated gait;
> 2. After understanding the overall Sim2Real chain, read the mechanical CAD, 3D printing, and hardware assembly chapters;
> 3. Advanced readers should go deep into the BAM model, system identification, and domain-randomization ablation experiments.

## The Full Technical Chain

`STEP assembly → Onshape cloud CAD (assign part densities, override servo masses) → onshape-to-robot MJCF export → MuJoCo-Warp GPU simulation → BAM servo model (bench-identified HD1910 parameters) → domain randomization + curriculum-learning PPO multi-task training → ONNX policy export → RK3566 Rust firmware 50 Hz real-time inference → real-robot IMU/joint data collection → system identification to correct the dynamics model → iterative retraining`

## Join the Community

<div style="display:inline-block; padding: 1rem 1.5rem 1.1rem; border:1px solid #e6e8eb; border-radius: 12px; background:#fafbfc;">
  <img src="assets/wechat-group-2.png" alt="WeChat community group QR code" width="132" style="display:block; margin:0 auto; border-radius:6px;">
  <div style="font-size:0.8rem; color:#6a7078; margin-top:0.6rem; line-height:1.6;">MicroDuck Parts (Mainboard, Servo Group 2)<br>Scan to join · valid until 2026-10-31</div>
</div>

Join our WeChat community to share replication experience, report corrections, and help build the domestic open-source ecosystem for low-cost bipedal robots.

> ⚠️ The WeChat group QR code expires automatically after 7 days (this image is valid until **2026-10-31**). After expiry, visit <https://www.wwntai.com/parts.html> for the latest QR code, or open a GitHub issue to update it.

## Open-Source Licensing Boundaries (Please Read)

1. The prose of this book: CC-BY 4.0 — free to read and share, with attribution required when quoting;
2. Upstream software code: Apache 2.0;
3. Mechanical CAD models: CC BY-NC-SA — **non-commercial study and research only**.

> If a commercial product is required, the mechanical structure must be independently designed from scratch, independent of this CAD model set.

The companion engineering repository hosts all code, scripts, experiment records, Docker configuration, and book source on GitHub; every chapter is bound to a repository commit hash, so you can check out the corresponding version and ensure the code matches the book exactly.

## Copyright and Disclaimer

### Copyright

The copyright in this book (including its text, figures, code snippets, and companion documents) belongs to **Guangdong WWNT Robotics Co., Ltd.** (WWNT Robotics; open-source ecosystem on GitHub: [UnitClaw](https://github.com/UnitClaw)).

> Copyright © WWNT Robotics (Guangdong WWNT Robotics Co., Ltd.) All rights reserved.

Unless otherwise noted, the book's prose is licensed under CC-BY 4.0 (free to read and quote, with attribution); upstream code is under Apache-2.0, and the mechanical CAD models are under CC BY-NC-SA (non-commercial study and research only).

### Limitation of Liability (Please Read)

This book is an **open-source engineering-practice record**. Some technical material (simulation parameters, BAM identification results, firmware configuration, assembly tolerances, etc.) derives from specific hardware batches and experimental environments and **has not all been fully validated on physical hardware**. Hardware assembly, circuit wiring, and power-on debugging inherently carry risks of short circuits, damage, and mechanical injury; an intrinsic gap always exists between the simulation model and the real robot, and directly copying the settings may not produce stable walking; servo, mainboard, and sensor parameters vary with batch, firmware version, power supply, and load conditions.

Accordingly, **WWNT Robotics assumes no responsibility for any experimental failure, property loss, or personal injury arising from a reader's direct replication of this book's contents**. Please validate progressively in a safe environment — simulation first, then bench, then the physical robot — and ensure power isolation and protection. By using this book, you acknowledge and accept the risks and limitations of liability described above.

### Intellectual Property and Infringement

1. This project is an **independent third-party replication study** of Pollen Robotics' open-source MicroDuck; it is not affiliated with, authorized by, endorsed by, or sponsored by Pollen Robotics. The "MicroDuck" name and related trademarks and brands belong to their respective owners.
2. This book and its companion repository are provided solely for **educational, research, and non-commercial open-source study** and do not constitute an authorized use of any upstream commercial product, trademark, or patent.
3. If a reader pursues commercial activity based on this book, they must independently design the mechanical structure from scratch (independent of this CAD model set) and perform their own compliance review and obtain any necessary authorization regarding the intellectual property, trademarks, and patents of the relevant rights holders.
4. **WWNT Robotics assumes no responsibility** for any dispute or loss arising from unauthorized commercialization, infringing use, or failure to obtain necessary authorization.

## Acknowledgments

Thanks to Pollen Robotics for open-sourcing MicroDuck, mjlab, and microduck_rl; to fanhao375 for open-sourcing microduck-replica and microduck-replica-cad; to Feetech for the HD1910 servo hardware and technical documentation; and to all open-source community developers.

> For the full company introduction and acknowledgments (Pollen, Feetech, fanhao375, 机械行者Robo, kissqy, LuwuDynamics, Rhoban, and others), see the **[Acknowledgments]** chapter at the end of the book.

> This book is under continuous iteration, and the engineering experiments are updated as they evolve; corrections and suggestions are welcome via GitHub Issues.
