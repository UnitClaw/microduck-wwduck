# Minimal Simulation Example

> Learning objectives: with no 3D printing, no hardware, and no soldering, run the Feetech HD1910 MicroDuck simulation environment on a GPU machine with one command, and grasp the full Sim2Real pipeline.
> Prerequisites: Docker + NVIDIA GPU driver (CUDA support); the repository switched to the `book-dev` branch.

## 2.1 Why the Demo Comes First

Traditional robotics tutorials start from mechanical drawings and hardware assembly, so readers spend substantial time printing parts only to discover that the simulation cannot run at all.

This book adopts a **problem-driven, virtual-to-physical** learning path:

1. First validate the robot dynamics, servo model, and RL policy in simulation;
2. After confirming the simulated behavior matches expectations, move on to mechanical design, 3D printing, and hardware assembly;
3. Fix dynamics defects discovered in simulation (inertia, center of mass, servo parameters) early, avoiding physical rework.

This chapter's minimal demo does only three things:

- Load the Feetech HD1910 MJCF robot model;
- Validate the model (inertia, joint limits);
- Load a pre-trained standing policy, launch MuJoCo-Warp simulation, and visualize the robot duck standing.

> This chapter trains no new policy; it only reproduces an already-converged standing policy to quickly verify that the entire software stack works.

## 2.2 Environment Setup (One-Command Docker Container)

The repository ships a Dockerfile that pins CUDA, Python, MuJoCo-Warp, and mjlab versions, eliminating dependency conflicts.

```bash
# Clone the code and switch to the book development branch
git clone https://github.com/your-username/microduck-replica.git
cd microduck-replica
git checkout book-dev

# Build and launch the GPU simulation container
cd docker
docker-compose up --build
```

> The container auto-mounts the local repository directory, so **code changes take effect on the host directly, with no image rebuild required**.

In a new terminal, enter the container:

```bash
docker exec -it microduck-replica-sim bash
```

## 2.3 Model Validation (Mandatory)

In Sim2Real engineering, **MJCF model errors are the most frequent failure**. The repository ships an automated validation script that checks the inertia tensor, total mass, and joint limits.

```bash
python scripts/validation/validate_mjcf.py \
--mjcf software/training/assets/robots/microduck_feetech.xml
```

✅ Normal output example:
```
✅ MJCF loaded successfully, link count: 16
✅ Total mass: 0.726 kg
✅ Basic MJCF validation passed
```

❌ Failure scenarios: a non-positive-definite inertia tensor, or joint limits exceeding the servo's physical range — return to the CAD/Onshape step to correct them.

## 2.4 Running the Minimal Demo: Loading a Pre-trained Standing Policy

```bash
python software/training/train_ppo.py \
config=experiments/exp01_standup/config.yaml \
resume=experiments/exp01_standup/checkpoints/latest.onnx
```

After execution, MuJoCo-Warp launches GPU-parallel simulation, opens a visualization window, and the robot duck holds its standing pose.

### 2.4.1 Experiment Configuration (exp01_standup/config.yaml)

```yaml
robot_xml: "software/training/assets/robots/microduck_feetech.xml"
bam_params: "experiments/exp01_standup/bam_params.json"
num_envs: 256
control_freq: 50
policy_type: "ppo"
task: "stand"
domain_randomization: false
```

- `control_freq: 50`: strictly aligned with the RK3566 board's 50 Hz control frequency — the key to Sim2Real transfer;
- `domain_randomization: false`: the minimal demo disables domain randomization for stable behavior; later chapters enable it for ablation studies.

## 2.5 Observations and Basic Diagnostics

Observe the simulated behavior:

1. The robot duck stands stably, without slow tipping;
2. Joint angles stay within the HD1910 physical limits;
3. No large number of numerical-explosion warnings.

> Common troubleshooting (pitfall log for this chapter)
> 1. Falls immediately on startup: most likely incorrect MJCF center of mass / inertia; re-check the CAD→MJCF pipeline in Automated Onshape→MJCF Modeling;
> 2. Violent joint jitter: mismatched BAM servo parameters; bench calibration is required (Servo and IMU Calibration);
> 3. CUDA out of memory: reduce `num_envs`.

## 2.6 Chapter Summary

You have validated the entire simulation software stack: the MJCF model, the BAM servo model, MuJoCo-Warp, and PPO policy loading.

> Simulation is only a digital world; whether the simulated dynamics parameters match the real robot determines the success of subsequent hardware transfer.
> The next chapter enters mechanical CAD. Automated Onshape→MJCF Modeling automates Onshape MJCF export, computing link inertias and centers of mass from the source — no more manual estimation.

> Experiment log: this run is archived under `experiments/exp01_standup/`; view observation and reward curves in TensorBoard.
