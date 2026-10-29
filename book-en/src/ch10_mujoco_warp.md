# The MuJoCo-Warp Simulation Environment

> Learning objectives: understand GPU-parallel simulation, resolve the most frustrating environment-deployment issues, and master the definition of the observation and action spaces.

## 9.1 What MuJoCo-Warp and mjlab Are

- **MuJoCo-Warp** (NVIDIA): a GPU-parallel version of the MuJoCo physics engine that can run hundreds of simulation instances simultaneously, greatly accelerating reinforcement learning;
- **mjlab** (Pollen's own): a robotics simulation library built on top of MuJoCo-Warp, providing the environment API, actuator models (BAM), and domain-randomization support.

Together they form MicroDuck's training foundation.

## 9.2 Environment-Deployment Pain Points and the Docker Solution

The original environment has a complex dependency chain, with `mjlab`, `mujoco-warp`, and the BAM library tightly version-bound. Common problems:

- CUDA version mismatch;
- Python package version conflicts;
- **No native Windows support** — only WSL2 / Linux + NVIDIA CUDA GPU;
- Cannot train on CPU.

The repository's Docker one-command solution resolves these:

```bash
cd docker
docker-compose up --build
```

The companion `requirements-lock.txt` pins every dependency version, ensuring it "runs even on a different machine."

## 9.3 Environment Self-Check Script

After every code change, run the simulation-environment self-check first to avoid carrying errors into training:

```bash
python scripts/validation/test_env.py
```

```python
import torch
from mjlab import env

def test_sim_env():
    env = env.MicroDuckEnv(robot="feetech")
    obs, info = env.reset()
    for i in range(200):
        action = torch.zeros((1,14))
        obs, reward, done, trunc, info = env.step(action)
    print("✅ Simulation environment test passed")

if __name__ == "__main__":
    test_sim_env()
```

## 9.4 Observation Space and Action Space

MicroDuck's standard interface:

- **Action space**: 14-dimensional joint actions (servo target positions), typically normalized to [-1, 1];
- **Observation space**: 61-dimensional, including IMU attitude (quaternion/Euler angles), joint positions, joint velocities, and the previous action, etc.

> Key convention: **actions in simulation are "position commands," not torques.** Because the hardware uses position-control servos, simulation must also model position actuators — which leads directly to the BAM model in BAM Actuator Modeling and Identification.

## 9.5 Parallel Environment Count and Training Speed

```python
# key training configuration parameters
num_envs: 256      # number of parallel simulation instances
control_freq: 50   # control frequency (Hz), must match the board
```

- Larger `num_envs` samples faster but consumes more VRAM; reduce it when VRAM is insufficient;
- `control_freq=50` is a hard constraint, strictly aligned with the RK3566 control loop to guarantee Sim2Real timing consistency.

## 9.6 Engineering Pitfall Log

- **CUDA version mismatch**: the container's CUDA is incompatible with the host driver, and simulation crashes on startup. Resolved by pinning the CUDA version in Docker.
- **Version drift**: the environment fails to converge after a dependency upgrade; recovered by reinstalling the version-lock file.

## 9.7 Chapter Summary

You can now run the simulation environment in the container and understand the observation/action spaces and the 50 Hz timing convention.

> The next chapter dives into the BAM servo model — the core of MicroDuck's Sim2Real success and one of the book's most important technical chapters.
