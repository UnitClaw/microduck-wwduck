# 最小仿真示例

> 本章目标：无需 3D 打印、无需硬件、无需焊接，在 GPU 电脑上一键跑通飞特 HD1910 版 MicroDuck 仿真环境，理解 Sim2Real 完整链路全貌。
> 前置：Docker + NVIDIA GPU 驱动（CUDA 支持）；仓库已切换至 `book-dev` 分支。

## 2.1 为什么把 Demo 放在最前面

传统机器人教程习惯从机械图纸、硬件装配开始，读者投入大量时间打印零件，最后才发现仿真根本跑不起来。
本书采用**问题驱动、由虚到实**的学习路径：

1. 先在仿真世界验证机器人动力学、舵机模型、强化学习策略；
2. 确认仿真环境行为符合预期后，再进入机械设计、3D 打印、硬件装配；
3. 仿真里发现的动力学缺陷（惯性、重心、舵机参数），提前修正，避免真机返工。

本章最小 Demo 只做三件事：
- 加载飞特 HD1910 版本 MJCF 机器人模型；
- 校验模型合法性（惯性、关节限位）；
- 加载预训练站立策略，启动 MuJoCo-Warp 仿真，可视化机器鸭站立。

> 本章不训练新策略，只复现一个已经收敛的站立策略，快速验证整套软件栈是否正常工作。

## 2.2 环境准备（Docker 一键容器）

仓库内置 Dockerfile，锁定 CUDA、Python、MuJoCo-Warp、mjlab 版本，消除版本依赖冲突。

```bash
# 拉取代码，切换本书开发分支
git clone https://github.com/你的用户名/microduck-replica.git
cd microduck-replica
git checkout book-dev

# 构建并启动 GPU 仿真容器
cd docker
docker-compose up --build
```

> 容器会自动挂载本地仓库目录，**代码修改在宿主机直接生效，不需要重新打包镜像**。

新开终端，进入容器环境：

```bash
docker exec -it microduck-replica-sim bash
```

## 2.3 模型校验（必须执行）

Sim2Real 工程中，**MJCF 模型错误是最高发故障**。仓库内置自动化校验脚本，检查惯性张量、总质量、关节限位。

```bash
python scripts/validation/validate_mjcf.py \
--mjcf software/training/assets/robots/microduck_feetech.xml
```

✅ 正常输出示例：
```
✅ MJCF加载成功，连杆数量: 16
✅ 整机总质量: 0.726 kg
✅ MJCF基础校验完成
```

❌ 报错场景：惯性张量非正定、关节限位超出舵机物理范围，需要回到 CAD/Onshape 环节修正。

## 2.4 运行最小 Demo：加载预训练站立策略

```bash
python software/training/train_ppo.py \
config=experiments/exp01_standup/config.yaml \
resume=experiments/exp01_standup/checkpoints/latest.onnx
```

执行后，MuJoCo-Warp 启动 GPU 并行仿真，弹出可视化窗口，机器鸭保持站立。

### 2.4.1 实验配置说明（exp01_standup/config.yaml）

```yaml
robot_xml: "software/training/assets/robots/microduck_feetech.xml"
bam_params: "experiments/exp01_standup/bam_params.json"
num_envs: 256
control_freq: 50
policy_type: "ppo"
task: "stand"
domain_randomization: false
```

- `control_freq: 50`：和 RK3566 板端 50Hz 控制频率严格对齐，是 Sim2Real 迁移的关键；
- `domain_randomization: false`：最小 Demo 关闭域随机化，保证行为稳定；后续章节开启域随机化做消融实验。

## 2.5 观察现象与基础诊断

观察仿真行为：
1. 机器鸭稳定站立，无缓慢倾倒；
2. 关节角度在 HD1910 物理限位内；
3. 仿真无大量数值爆炸警告。

> 常见故障排查（本章踩坑实录）
> 1. 启动立刻倒地：大概率 MJCF 重心/惯性参数错误；回到第 4 章 CAD→MJCF 流程复核；
> 2. 关节剧烈抖动：BAM 舵机参数不匹配，需要第 8 章台架标定；
> 3. CUDA out of memory：减小 `num_envs`。

## 2.6 本章小结

你已经验证了整套仿真软件栈：MJCF 模型、BAM 舵机模型、MuJoCo-Warp、PPO 策略加载。

> 仿真只是数字世界，仿真的动力学参数是否贴近真实机器人，决定后续真机迁移成败。
> 下一章进入机械 CAD，第 4 章：Onshape 自动化导出 MJCF，从源头计算连杆惯性、重心，告别手动估算。

> 实验记录：本次实验归档于 `experiments/exp01_standup/`，可在 TensorBoard 查看观测、奖励曲线。
