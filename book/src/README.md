<div style="text-align:center; padding: 2.5rem 0 0.5rem;">

  <div style="letter-spacing: 0.22em; color:#8a8f98; font-size: 0.78rem; margin-bottom: 1.3rem;">开源工程实践 · 具身智能 · SIM2REAL 强化学习</div>

  <h1 style="margin:0 0 0.7rem; font-size: 1.75rem; line-height: 1.35; font-weight: 800; overflow-wrap: break-word;">MicroDuck 国产飞特舵机版电子书（首版）</h1>

  <div style="font-size: 1.05rem; color:#3b4045; font-weight: 600; margin-bottom: 1.5rem;">双足机器人 Sim2Real 迁移的工程方法论</div>

  <p style="text-align:left; color:#4a5058; font-size:0.94rem; line-height:1.8; margin:0 0 1.7rem;">
    本书以 Pollen Robotics 开源的 MicroDuck 为蓝本，系统呈现一条<b>国内可复现、低成本</b>的双足机器人技术路线：从 MJCF 逆向与 Onshape→MJCF 自动化动力学建模、HD1910 串口总线舵机 BAM 台架辨识，到扩展域随机化 + 课程学习的 PPO 策略训练，再到 RK3566 板端 50&nbsp;Hz 实时推理与真机闭环迭代，完整覆盖「CAD → 动力学 → 执行器 → 仿真 → 真机」的全栈工程闭环。
  </p>

  <div style="color:#3b4045; font-size:0.95rem; margin-bottom: 1.8rem;">
    万物拟态机器人（WWNT Robotics）<span style="color:#c2c6cc;">·</span> 开源生态 GitHub <a href="https://github.com/UnitClaw" target="_blank" rel="noopener">UnitClaw</a>
  </div>

</div>

---

# 前言

## 配套图书阅读入口

- **在线电子书（GitHub Pages 自动编译）**：<https://unitclaw.github.io/microduck-wwduck/>
- **英文版（American academic English edition）**：<https://unitclaw.github.io/microduck-wwduck/en/>
- **书稿源码仓库**：<https://github.com/UnitClaw/microduck-wwduck>（`book/` 中文版、`book-en/` 英文版，mdbook 编写，随提交自动编译部署为网页电子书）

> 本书每一章书稿都与配套工程仓库的 commit hash 一一绑定，读者可 checkout 到对应版本，完整复现书中每一步实验。
> 电子书每个章节**右上角**都有两个入口：📝「编辑」图标直达该章源文件、Octocat 图标直达仓库首页。

## 电子书章节 ↔ 仓库资源对照

每一章都对应仓库里的具体工程资源，点击即可跳转查阅源码、图纸、清单与日志：

| 电子书章节 | 仓库对应资源 |
|---|---|
| 配件商城 | [PARTS.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/PARTS.md) · [官网商城](https://www.wwntai.com/parts.html) |
| 最小仿真 Demo | [software/training/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/training) |
| CAD 模型解析 | [cad/](https://github.com/UnitClaw/microduck-wwduck/tree/master/cad) · [CAD 仓库](https://github.com/UnitClaw/microduck-replica-cad) |
| Onshape → MJCF | [scripts/](https://github.com/UnitClaw/microduck-wwduck/tree/master/scripts) |
| 3D 打印与装配 | [print/](https://github.com/UnitClaw/microduck-wwduck/tree/master/print) · [BOM.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/BOM.md) |
| 硬件电路与总线 | [hardware/](https://github.com/UnitClaw/microduck-wwduck/tree/master/hardware) |
| RK3566 镜像与固件 | [software/image/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/image) · [software/studio/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/studio) |
| 舵机 / IMU 标定 | [tools/](https://github.com/UnitClaw/microduck-wwduck/tree/master/tools) |
| 仿真与训练 | [software/training/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/training) |
| ONNX 部署 | [software/studio/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/studio) |
| 真机步态 | [software/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software) |
| 工程化与开源 | [NOTICE.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/NOTICE.md) · [LICENSE](https://github.com/UnitClaw/microduck-wwduck/blob/master/LICENSE) |
| BOM 采购清单 | [BOM.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/BOM.md) |
| 故障排查 | [踩坑记录.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/踩坑记录.md) |

> 仓库侧反向入口：仓库 `README.md` 顶部有电子书在线阅读链接与配件商城入口；`PARTS.md`、`BOM.md` 等文档也标注了对应电子书章节。

## 核心工程亮点（本书重点创新）

本书在社区 `microduck-replica` 复刻项目的基础上，补齐了六大工程闭环，构成相对 Pollen 原版与社区复刻的**重点创新**：

### 亮点 1｜Onshape → MJCF 自动化流水线（对标 Pollen 原厂）

完整复刻 Pollen 原厂 Onshape → MJCF 自动化工作流：从整机 STEP 装配导入，自动计算每个连杆的**质量、重心、惯性张量**，配合 `validate_mjcf.py` 自动校验惯性张量、关节限位与整机总质量，**彻底告别 replica 手动估算惯性参数**带来的 Sim2Real 偏差。

> 对应第 4 章 · 交付物：`scripts/cad2mjcf/export_mjcf.py` + `validate_mjcf.py`

### 亮点 2｜HD1910 舵机 BAM 台架实测辨识

对飞特 HD1910 做**台架实测辨识**，拟合 BAM（Bandwidth-Aware Motor）模型全套参数——带宽、粘性摩擦、库仑摩擦、转子惯量、齿隙，解决原版 replica 使用经验估算参数导致的 Sim2Real 迁移偏差。

> 对应第 8、10 章 · 交付物：`scripts/calibration/hd1910_bench_data_process.py`

### 亮点 3｜扩展域随机化 + 课程学习

在基础域随机化上扩展 8 维参数集（质量、摩擦、扭矩、带宽、齿隙、IMU 噪声、地面摩擦、重力），配合**课程学习**从站立逐步过渡到行走、转向、爬坡；并以**消融实验**对比不同随机策略的真机迁移成功率。

> 对应第 11、12 章 · 交付物：`domain_rand` 扩展参数集 + 课程调度逻辑

### 亮点 4｜仿真观测空间 ↔ 板端固件自动校验

提供**仿真观测空间 ↔ 板端 Rust 固件自动校验脚本**，一键比对观测/动作的维度、缩放与顺序，杜绝 Sim2Real 最常见的维度/缩放不一致隐性 bug。

> 对应第 7、14 章 · 交付物：`scripts/validation/check_obs_act_space.py`

### 亮点 5｜完整实验管理体系（可复现）

建立标准化的**实验管理体系**：每一次训练保存 `config.yaml`、MJCF 快照、BAM 参数、训练日志与 TensorBoard 曲线，任一实验可一键复现、可回溯。

> 对应第 17 章 · 交付物：`experiments/` 目录规范（config / mjcf / bam_params / logs / readme）

### 亮点 6｜Docker 锁定依赖版本

用 Docker 锁定 CUDA、Python、MuJoCo-Warp、mjlab 等依赖版本，消除「本地能跑、别人跑不起来」的环境问题，一键复现训练环境。

> 对应第 2、17 章 · 交付物：`Dockerfile` + `requirements-lock.txt`

---

## 为什么写这本书

2025 年，Pollen Robotics 联合 Hugging Face 发布 MicroDuck，一台基于 Sim2Real 强化学习的开源双足机器鸭。它的核心范式是：在 GPU 仿真环境中训练机器人策略，再直接部署到真实硬件，不需要传统步态规划。

原版 MicroDuck 使用 Dynamixel 舵机，海外预售，中国大陆无法直邮，整机 399 美元，加上转运、关税成本高昂，普通爱好者与国内高校实验室很难获取。社区诞生了 `microduck-replica` 复刻项目，将 MicroDuck 的机械结构移植，使用国产飞特 HD1910 总线舵机。

但原始复刻项目存在明显短板：
- MJCF 动力学模型依靠**手动估算连杆惯性、重心**，仿真与真机动力学差异大，Sim2Real 迁移困难；
- HD1910 舵机 BAM 模型参数为经验估算，没有台架实测标定流程；
- 缺少标准化实验管理，训练配置、模型、日志零散，难以复现；
- 没有一键容器化环境，CUDA、Warp、mjlab 版本依赖极易冲突；
- 缺少完整工程踩坑记录，读者遇到仿真倒地、真机抖动、舵机丢包等问题时无系统排查方案。

本书的目标，就是补齐这套工程闭环：**完整复刻 Pollen 原厂 Onshape→MJCF 自动化工作流，把 HD1910 舵机 BAM 实测辨识、域随机化、课程学习、RK3566 板端部署全部落地，形成一套国内可复现、低成本的国产舵机版 MicroDuck 全栈工程实践。**

本书不是纯理论的强化学习教科书，也不是简单的零件组装手册。它是**工程实践日志**：包含成功的实验、失败的尝试、参数消融对比、仿真与真机之间的 Gap 诊断。

## 本书定位与读者

- 机器人、具身智能、强化学习方向研究生/本科生；
- 高校机器人实验室工程师、开源硬件爱好者；
- 想入门 Sim2Real、MuJoCo-Warp、低成本双足强化学习机器人开发者。

> 阅读路径推荐：
> 1. 先跑【最小仿真Demo】，Docker 一键启动仿真，直观看到机器鸭仿真步态；
> 2. 理解 Sim2Real 整体链路之后，再阅读机械 CAD、3D 打印、硬件装配章节；
> 3. 进阶读者深入 BAM 模型、系统辨识、域随机化消融实验。

## 全书技术链路

`STEP装配 → Onshape云端CAD（设置零件密度、舵机质量覆盖） → onshape-to-robot导出MJCF → MuJoCo-Warp GPU仿真 → BAM舵机模型（台架实测辨识HD1910参数） → 域随机化+课程学习PPO多任务训练 → ONNX策略导出 → RK3566 Rust固件50Hz实时推理 → 真机采集IMU/关节数据 → 系统辨识修正动力学模型 → 迭代重训`

## 加入交流群

<div style="display:inline-block; padding: 1rem 1.5rem 1.1rem; border:1px solid #e6e8eb; border-radius: 12px; background:#fafbfc;">
  <img src="assets/wechat-group-2.png" alt="微信交流群二维码" width="132" style="display:block; margin:0 auto; border-radius:6px;">
  <div style="font-size:0.8rem; color:#6a7078; margin-top:0.6rem; line-height:1.6;">小鸭子的配件（主板，舵机群 2）<br>扫码入群 · 有效期至 2026-10-31</div>
</div>

欢迎加入微信交流群，与社区一起交流复刻经验、反馈勘误、共建国产低成本双足机器人开源生态。

> ⚠️ 微信群二维码 7 天自动失效（本图有效期至 **2026-10-31**）。过期后请访问官网 <https://www.wwntai.com/parts.html> 获取最新二维码，或在 GitHub 仓库提 issue 更新。

## 开源许可边界（务必阅读）

1. 本书书稿正文：CC-BY 4.0，自由阅读、分享，引用时保留署名；
2. 上游软件代码：Apache 2.0；
3. 机械 CAD 模型：CC BY-NC-SA，**仅限非商用学习、科研**。

> 若读者需要商用产品，必须独立正向设计机械结构，脱离本套 CAD 模型。

本书配套工程仓库：所有代码、脚本、实验记录、Docker 配置、书稿源码全部托管在 GitHub，每一个书稿章节绑定仓库 commit hash，你可以 checkout 到对应版本，保证代码与书中内容完全一致。

## 版权与免责声明

### 版权声明

本书（含正文、图表、代码片段与配套文档）的著作权归 **广东省万物拟态机器人有限公司**（WWNT Robotics，开源生态 GitHub [UnitClaw](https://github.com/UnitClaw)）所有。

> Copyright © WWNT Robotics (Guangdong WWNT Robotics Co., Ltd.) All rights reserved.

除另行注明外，本书正文按 CC-BY 4.0 许可开放阅读与引用（引用时须保留署名）；上游代码遵循 Apache-2.0，机械 CAD 模型遵循 CC BY-NC-SA（仅限非商用学习与研究）。

### 责任免除声明（务必阅读）

本书是一份**开源工程实践记录**，部分技术资料（仿真参数、BAM 辨识结果、固件配置、装配公差等）来自特定硬件批次与实验环境，**尚未全部经过真机充分验证**。硬件装配、电路接线、上电调试本身存在短路、烧毁、机械损伤等固有风险；仿真模型与真机动力学之间存在固有 Gap，直接照搬可能无法稳定行走；舵机、主控、传感器等参数会随批次、固件版本、供电与负载条件变化。

因此，**万物拟态机器人不对任何读者照搬本书内容而导致的实验失败、财产损失或人身伤害承担任何责任**。请务必在安全环境下逐步验证——先仿真、后台架、再真机——并做好供电隔离与防护。您使用本书即表示已理解并接受上述风险与责任边界。

### 知识产权与侵权声明

1. 本项目是基于 Pollen Robotics 开源 MicroDuck 的**第三方独立复刻研究**，与 Pollen Robotics 无隶属、授权、背书或赞助关系；「MicroDuck」及相关商标、品牌归其各自权利人所有。
2. 本书与配套仓库仅为**教学、科研与非商业开源学习**目的，不构成对任何上游商业产品、商标或专利的授权使用。
3. 若读者基于本书内容开展商用活动，须自行独立正向设计机械结构、脱离本套 CAD 模型，并自行完成对相关权利人知识产权、商标与专利的合规审查与必要授权。
4. 因读者擅自商用、侵权使用或未取得必要授权而引发的任何纠纷与损失，**万物拟态机器人不承担任何责任**。

## 致谢

感谢 Pollen Robotics 开源 MicroDuck、mjlab 与 microduck_rl；感谢 fanhao375 开源 microduck-replica 与 microduck-replica-cad；感谢飞特提供 HD1910 舵机硬件与技术文档；感谢所有开源社区开发者。

> 完整的公司介绍与致谢（Pollen、飞特、fanhao375、机械行者Robo、kissqy、LuwuDynamics、Rhoban 等）见书末 **【致谢】** 章节。

> 本书持续迭代，工程实验会持续更新；勘误、改进建议欢迎提交 GitHub Issue。
