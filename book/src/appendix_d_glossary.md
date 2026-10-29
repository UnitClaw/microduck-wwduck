# 术语表

| 术语 | 全称/解释 | 对应章节 |
|---|---|---|
| Sim2Real | Simulation-to-Real，仿真到现实迁移，核心范式 | 全书 |
| BAM | Bandwidth-Aware Motor，带宽感知舵机执行器模型 | BAM 执行器建模与辨识 |
| MJCF | MuJoCo 机器人建模文件格式 | Onshape→MJCF 自动化建模 |
| PPO | Proximal Policy Optimization，近端策略优化算法 | PPO 多任务训练 |
| Domain Randomization | 域随机化，训练时随机扰动仿真参数 | 域随机化 |
| Curriculum Learning | 课程学习，从易到难推进训练 | 域随机化 |
| ONNX | Open Neural Network Exchange，模型交换格式 | PPO 多任务训练、策略部署与板端推理 |
| MuJoCo-Warp | NVIDIA GPU 并行物理仿真 | MuJoCo-Warp 仿真环境 |
| mjlab | Pollen 自研机器人仿真库 | MuJoCo-Warp 仿真环境 |
| TTL 总线 | 半双工串行通信总线（舵机用） | 硬件电路与 TTL 总线 |
| 齿隙（backlash） | 齿轮间隙造成的滞后 | BAM 执行器建模与辨识 |
| 域随机化强度 | 随机扰动参数的范围大小 | 域随机化 |
| Sim2Real gap | 仿真与现实之间的动力学差距 | 仿真调试与诊断、Sim2Real 闭环迭代 |
| 系统辨识 | System Identification，反向辨识真实参数 | Sim2Real 闭环迭代 |
| RKNN | RK 平台神经网络推理工具 | RK3566 镜像与固件、策略部署与板端推理 |
| BMS | Battery Management System，电池管理系统 | 硬件电路与 TTL 总线 |
| onshape-to-robot | CAD→MJCF 自动导出工具 | Onshape→MJCF 自动化建模 |
| 观测空间 | 策略输入的传感器数据向量 | MuJoCo-Warp 仿真环境、PPO 多任务训练 |
| 动作空间 | 策略输出的控制指令向量 | MuJoCo-Warp 仿真环境、PPO 多任务训练 |
