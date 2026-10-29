# Introduction: Pollen MicroDuck and Open-Source Embodied Intelligence

> Learning objectives: understand what MicroDuck is, how the Sim2Real paradigm operates, why the original is difficult to obtain in China, and the rationale behind the community replica's servo selection.

## 1.1 An Open-Source Robot Duck That Can Walk

In 2025, Pollen Robotics — a robotics team under Hugging Face — open-sourced a bipedal robot duck named **MicroDuck**. It is compact (≈0.7 kg) and affordable, but its core value lies not in the hardware itself but in *how it moves*: a **gait trained via reinforcement learning**.

Traditional quadrupedal/bipedal robots (such as Spot and Atlas) rely on complex kinematic planning: first build a precise dynamics model, then solve joint torques frame by frame. MicroDuck takes a completely different route:

1. In a GPU simulation environment (MuJoCo-Warp), a "digital duck" falls and walks randomly;
2. A PPO reinforcement-learning algorithm, guided by a reward function, teaches it to stand, walk, and self-recover from falls;
3. The trained policy is exported as an ONNX model and deployed directly onto the physical duck's "brain" (an RK3566 board);
4. The physical duck reads IMU and joint angles at 50 Hz, runs ONNX inference to obtain target servo positions, and closes the control loop.

This is the complete **Sim2Real (simulation-to-reality)** loop. It does not require engineers to hand-design gaits; it only requires a well-designed reward function and simulation environment.

## 1.2 Why "Simulate First, Deploy Later" Is a Paradigm Shift

| Dimension | Traditional gait planning | Sim2Real reinforcement learning |
|---|---|---|
| Modeling cost | Requires a precise dynamics model; error-sensitive | Uses domain randomization to tolerate model error |
| Source of gait | Hand-designed by engineers | Discovered automatically by the algorithm |
| Disturbance robustness | Depends on precise feedback; fragile | Has seen various disturbances in training; robust |
| Complex terrain | Hard to plan by hand | Guided by the reward function |

The essence of Sim2Real is not "simulation" itself but **how to close the gap between simulation and reality** — the central problem this book revisits from Automated Onshape→MJCF Modeling through The Sim2Real Closed-Loop Iteration.

## 1.3 Why the Original Is Hard to Buy in China

The original MicroDuck uses Dynamixel XL330 servos with an official pre-order price of **399 USD**. The more critical constraint is the supply chain:

- Official direct-shipping regions: US, Canada, EU, UK, Norway, Switzerland, Japan, South Korea;
- **Mainland China is not on the direct-shipping list**, requiring freight forwarding or proxy ordering;
- 399 USD plus international shipping, tariffs, and customs clearance makes the actual landed cost significantly higher than the list price;
- New orders have an estimated 4–6 month wait.

These real-world constraints make it hard for domestic hobbyists and university labs to obtain an original robot duck at low cost. **A domestic replica therefore becomes an engineering proposition of genuine value.**

## 1.4 Servo Selection for the Domestic Replica: Why the Feetech HD1910

The original's core actuator is the Dynamixel XL330, a serial-bus servo. Domestic alternatives fall into two main categories:

| Servo | Type | Torque @ 4.8 V | Weight | Communication | Price range |
|---|---|---|---|---|---|
| Dynamixel XL330 | Magnetic-encoder bus servo | ~6.5 kg·cm | ~16 g | TTL | High |
| Feetech HD1910 | Magnetic-encoder TTL bus servo | 9 kg·cm | 21±2 g | TTL | Low |

Key specifications of the Feetech HD1910:
- Model: HD-1910-C001, dual-shaft magnetic-encoder TTL bus servo, coreless motor, metal gears;
- Operating voltage: 4.8–8.4 V;
- Stall torque: 9 kg·cm @ 4.8 V;
- No-load speed: 0.137 sec/60° (≈73 RPM) @ 4.8 V;
- Weight: 21±2 g;
- Communication: TTL bus, baud rate up to 1 Mbps, 360° magnetic encoder, multi-turn position readout.

> ⚠️ Selection warning: the **torque, friction, bandwidth, and backlash** parameters of domestic servos differ dramatically from the original. The original's pre-trained gait model **cannot be directly transplanted**; the servo model must be re-calibrated and the policy retrained (see BAM Actuator Modeling and Identification).

## 1.5 The Community Replica Landscape

| Repository | Nature | Servo | Companion assets |
|---|---|---|---|
| `pollen-robotics/microduck_rl` | Original RL core | XL330 | Training code only |
| `UnitClaw/microduck-wwduck` | WWNTRobotics-optimized edition | HD1910 | Training + CAD + firmware + image + engineering optimizations |
| `fanhao375/microduck-replica` | Complete replica project | XL330 + HD1910 | Training + CAD + firmware + image |
| `fanhao375/microduck-replica-cad` | Mechanical drawings | XL330 + HD1910 | SolidWorks/STL |
| `LuwuDynamics/xgoduck_hardware` | Feetech-partner robot duck | HD1910 | Standalone robot |

> Boundary note: 晨芯时代科技 is a domestic hardware solution provider that adapted the original for domestic hardware, but it has **no standalone MicroDuck GitHub repository**, delivering only RK-platform images and BSP. Feetech has likewise not published an identically named MicroDuck repository.

## 1.6 Goals of This Book

This book completes something the community has not yet done in full: **building, from scratch, a reproducible MicroDuck full-stack engineering loop using domestic Feetech HD1910 servos**, while specifically addressing five shortcomings of the original replica project:

1. **Dynamics modeling**: replace manually estimated inertia parameters with the Onshape→MJCF automated pipeline (Automated Onshape→MJCF Modeling);
2. **Servo modeling**: identify the HD1910's BAM actuator parameters via bench measurement (BAM Actuator Modeling and Identification);
3. **Training robustness**: extended domain randomization + curriculum learning to shrink the Sim2Real gap (Domain Randomization);
4. **Engineering**: Docker environment, automated validation, experiment management (The MuJoCo-Warp Simulation Environment);
5. **Hardware closed loop**: real-robot gait iteration and system identification (The Sim2Real Closed-Loop Iteration).

> **Chapter summary**: You now understand the value of MicroDuck and the necessity of a domestic replica. In the next chapter, we run the simulation end-to-end with one Docker command, building first-hand intuition for the entire pipeline.
