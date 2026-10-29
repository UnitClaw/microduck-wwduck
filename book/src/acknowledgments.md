# 致谢

> 这本书是一份社区协作的产物。它站在众多开源作者与厂商的肩膀上，没有他们的慷慨分享，就没有这份国产低成本双足机器人的全栈工程实践。在此一一郑重致谢。

## 关于万物拟态机器人（WWNT Robotics）

本书由 **万物拟态机器人**（WWNT Robotics，全称「广东省万物拟态机器人有限公司」）编写并维护。

万物拟态机器人是一家专注于**具身智能与 AI 机器人教育**的企业，坚持「开源驱动、全栈赋能」，双轮驱动：

- **国内**：面向高校 AI / 机器人专业做产教融合，提供硬件整机、开源课程、实训室、校园大模型与「校中厂」一站式方案；
- **海外**：开拓北美市场，输出机器人本体与关节模组。

公司由创始人叶志青与联合创始人严超磊共同创立，开源生态托管于 GitHub **UnitClaw** 组织，官网为 [wwntai.com](https://www.wwntai.com)（国内）与 [wwnt.ai](https://wwnt.ai)（国际）。

本书正是这套理念的落地之一：把一个海外商业产品的复刻过程，整理成一份**国内可复现、低成本**的工程书，免费开放给每一位高校师生、实验室工程师与开源硬件爱好者。

## 致谢

### Pollen Robotics

感谢 [Pollen Robotics](https://pollen-robotics.com/) 开源 MicroDuck、mjlab 与 microduck_rl，把 Sim2Real 强化学习双足机器人的完整技术路线公开给社区。本书的机械结构、仿真模型与训练范式均源自他们的开源工作。

> 需要说明：本项目是 Microduck 的**第三方复刻研究**，与 Pollen Robotics 无隶属关系，未获其背书。

### Hugging Face

感谢 [Hugging Face](https://huggingface.co/) 提供开放平台与机器人生态——MicroDuck 正是其旗下机器人团队 Pollen Robotics 的开源项目，在线仿真（HF Spaces）与相关训练工具链也都依托于 Hugging Face 的开放社区。正是这份开放，让「在云端看机器鸭走路」与「本地复现训练」成为可能。

### 飞特（Feetech）

感谢 **飞特（Feetech）** 提供 HD-1910 串口总线舵机硬件与官方技术文档。正是这颗高性价比的国产舵机，让 MicroDuck 有了「便宜一半、力矩 2.5 倍」的国产方案，也让本书的 BAM 台架实测辨识有了真实的标定对象。

### fanhao375

感谢 [@fanhao375](https://github.com/fanhao375) —— 本项目的**原作者**。逆向研究、装配图、爆炸图、硬件分析与文档最初都由他完成（原仓库 [fanhao375/microduck-replica](https://github.com/fanhao375/microduck-replica)）。本书与配套仓库都是在他的基础上继续前行。

### 机械行者Robo

感谢 **机械行者Robo** —— SolidWorks 图纸、装配 BOM 与装配视频的建模整理者。他让「从零件到会走路」这件事真正变得可上手、可复现。

### kissqy

感谢 **kissqy** —— 飞特 HD-1910 适配（训练中控、IMU 陀螺融合等）的关键贡献者。他的中控受个人非商业条款约束，本书与仓库尊重这一约定，未收录其中控改动。

### LuwuDynamics 与 Rhoban

感谢 [LuwuDynamics](https://github.com/LuwuDynamics) 分享 1910 M6 的 BAM 参数与配套配置，作为本书仿真训练的基线；感谢 [Rhoban](https://github.com/Rhoban) 开源 BAM 执行器模型与辨识库，为舵机建模提供了理论工具。

### 所有开源社区开发者

感谢每一位在 GitHub Issue、Pull Request、社区讨论中提供反馈、勘误与建议的开发者。开源的意义，正在于这份「众人拾柴」的协作。

## 一起共建

这本书和配套仓库都还很年轻，难免有错漏与不足。我们怀着谦逊之心，邀请你一起把它做得更好：

- 发现勘误、表述不清，欢迎提 [Issue](https://github.com/UnitClaw/microduck-wwduck/issues)；
- 有改进、补充，欢迎提 Pull Request；
- 复现成功、踩过坑，欢迎把你的经验回馈给社区。

请尊重各部分的许可边界（代码 Apache-2.0，机械 CAD 与文档 CC BY-NC-SA，详见 NOTICE）。**低成本双足机器人的国产开源生态，需要每一个人的参与。** 让我们一起，把「让机器人梦想落地」这件事，做得更普惠、更开放。

—— 万物拟态机器人（WWNT Robotics）

---

> **版权与免责声明**：本书著作权归广东省万物拟态机器人有限公司所有（Copyright © WWNT Robotics）。本书为开源工程实践记录，部分技术资料尚未经过真机充分验证；万物拟态机器人不对照搬失败、财产损失、人身伤害或任何擅自商用引发的侵权纠纷承担任何责任。完整声明详见【前言】之「版权与免责声明」。
