# Microduck 复刻

**简体中文** · [English](README.en.md)

> 📖 **在线阅读电子书**（19 章全栈工程书，第 19 章为配件商城）→ [unitclaw.github.io/microduck-wwduck](https://unitclaw.github.io/microduck-wwduck/)
> 🛒 **配件商城**（散件与配件 · 图文清单）→ [wwntai.com/parts.html](https://www.wwntai.com/parts.html) ｜ 仓库清单见 [PARTS.md](PARTS.md)

> 对 [Pollen Robotics Microduck](https://pollen-robotics.com/microduck/) 的第三方复刻研究 —— 从官方公开的 MJCF 仿真模型，反推出装配图、爆炸图与可导入 CAD 的装配体。
>
> 打印件（飞特·缝合怪版）：[print/frankenduck](print/frankenduck/)　·　可编辑图纸：[microduck-wwduck-cad](https://github.com/UnitClaw/microduck-wwduck-cad)　·　装配视频：[B 站合集《MicroDuck 从零安装教程》](https://space.bilibili.com/312747174/lists/9279084?type=season)

---

## 这是什么

Microduck 是一只 **25 cm 高、737 g** 的双足机器鸭，15 颗舵机、用强化学习走路。软件开源（Apache-2.0），硬件部分开源：

| 部件 | 开源状态 |
|---|---|
| RPI Robot HAT 板 | ✅ 官方完整开源（KiCad / Gerber / BOM）→ [`elec_RPI_Robot_HAT`](https://github.com/pollen-robotics/elec_RPI_Robot_HAT) |
| `imu_to_dxl` 板 | ❌ 未开源 —— 本仓库的逆向是目前唯一公开重建 |
| 机械 CAD / BOM / 装配文档 | ❌ 未开源 —— 本仓库从 MJCF + 47 个 STL 反推 |

---

## 两条路线，选一条

本仓库同时覆盖两种舵机，**机械、电路、软件三层都有差别**，动手前先定：

| | 原版 · Dynamixel XL330 | 飞特 · HD-1910 |
|---|---|---|
| 舵机 | XL330-M288-T ×15 | HD-1910-C001 ×15 —— 便宜一半、力矩 2.5 倍 |
| 打印件 | [CAD 仓库 · XL330 版](https://github.com/UnitClaw/microduck-wwduck-cad#两个版本选一个下) | [缝合怪版（本仓）](print/frankenduck/)，舵盘配合件不能混用 |
| 电路 | 官方 HAT + [`imu_to_dxl`](hardware/imu_to_dxl/) | 同左；舵机连接器 2.0 mm（官方 2.5） |
| 软件 | 官方运行时直接跑 | 总线协议不同，要换协议模块 + 按 HD-1910 重训 |
| 状态 | 纸上分析 + 首批打印件 | 已装机并站起（09-18），14 颗关节已读通 |

主线走飞特；原版资料同样齐全，两条都能复刻。选型论证见 [执行器选型](docs/执行器选型.md)。

---

## 快速开始

```bash
git clone https://github.com/UnitClaw/microduck-replica.git
```

1. **选路线** —— XL330（官方原版）还是 HD-1910（飞特，便宜一半）
2. **备料** —— 按 [BOM.md](BOM.md) 买舵机、轴承、紧固件；打印件：飞特路线用[缝合怪版](print/frankenduck/)，XL330 路线到 [CAD 仓库](https://github.com/UnitClaw/microduck-wwduck-cad) 下载；舵机、主控、电池等配件可到 [配件商城](https://www.wwntai.com/parts.html) 一站配齐（完整清单见 [PARTS.md](PARTS.md)）
3. **看视频装配** —— [B 站合集](https://space.bilibili.com/312747174/lists/9279084?type=season)，一集装一个部件
4. **烧镜像走起来** —— [复刻镜像](https://github.com/UnitClaw/microduck-replica/releases/latest)，烧卡 → 开机 → 手机连热点配网，全程不用 SSH

---

## 目录结构

```
microduck-replica/
├── book/                # 📖 电子书（mdbook 源码，在线见 unitclaw.github.io/microduck-wwduck）
├── docs/                # 逆向分析、选型、采购清单
├── assembly-drawings/   # 装配图、爆炸图
├── build-log/           # 实物构建日志（照片）
├── hardware/            # imu_to_dxl 板、HAT、新版自制板
├── print/               # 3D 打印件（飞特·缝合怪版）
├── software/            # Studio 网页中控、复刻镜像、训练工程
├── tools/               # 网页调试台、飞特工具、步态分析
├── PARTS.md             # 🛒 配件商城清单（对照电子书第 19 章）
├── BOM.md               # 物料清单（要买什么、买几个）
├── 构建日志.md           # 机械装配过程
├── 调试记录.md           # 电气与软件调试过程
├── 踩坑记录.md           # 上手前扫一遍：现象、原因、怎么办
└── NOTICE.md            # 署名、来源与许可
```

---

## 现在做到哪了

| 方向 | 进展 |
|---|---|
| 🔌 **电气** | IMU 乱跳的根因找到（BNO085 芯片自算姿态走路时跳），改用陀螺积分后推摇杆 60 秒一次没摔；新版自制板三块已画好（总线 IMU v2、舵机 HUB、接电池板）→ [`hardware/新版/`](hardware/新版/) |
| 🔨 **机械** | 飞特 HD-1910 版已装机，15 颗配好 ID 装进机身，有实物 → [构建日志](构建日志.md) |
| 💻 **软件** | 自研 **Microduck Studio** 网页中控（看状态/调舵机/配手柄/让它走）+ 复刻镜像（预发布）→ [Studio](software/studio/) · [镜像](software/image/) |
| 🧠 **算法** | 采用 [LuwuDynamics/xgoduck_rl](https://github.com/LuwuDynamics/xgoduck_rl) 的 1910 BAM M6 参数作仿真基线；训练工程已收进 [`software/training/`](software/training/) |

> 详细进展见 [最近更新](#最近更新)，完整日志见 [CHANGELOG.md](CHANGELOG.md)。

---

## 逆向成果

### 装配图与爆炸图

![爆炸图](assembly-drawings/06_爆炸图_四分之三.png)

`assembly-drawings/` 共 7 张：装配完成态 4 张（正面/侧面/背面/四分之三）、爆炸图 2 张（侧面/四分之三，标注部件名称与质量）、分色对照 1 张。

### 装配结构与关节参数

```
躯干主体 199g
├─ 左髋 yaw→roll 23g → 左髋 roll 6g → 左大腿 48g → 左小腿 22g → 左踝+脚 30g
├─ 颈根 37g → 颈俯仰件 6g → 头 yaw/roll 机构 49g → 头部总成+喙 189g
└─ 右髋 yaw→roll 23g → 右髋 roll 6g → 右大腿 48g → 右小腿 22g → 右踝+脚 30g

整机 737.2g   外形 144 × 141 × 264 mm
```

每条腿 5 个自由度、头颈 4 个 —— **14 个受控**（第 15 个舵机驱动喙，走被动连杆，不进动作空间）。

| 关节 | 行程 |
|---|---|
| `hip_yaw` | -25° ~ +30° |
| `hip_roll` | ±22° |
| `hip_pitch` / `knee` / `ankle` / `head_pitch` | ±90° |
| `neck_pitch` | -90° ~ +60° |
| `head_yaw` | ±170° |
| `head_roll` | ±25° |

---

## 电控方案

一条 1 Mbps 的 TTL 串行总线搞定一切：

```
                Radxa Zero 3W (RK3566) · Armbian
                  ├── UART2  1 Mbps TTL 单线半双工 ── 15× XL330 + imu_to_dxl (ID 200)
                  ├── I2C3   400 kHz (pin 3/5) ────── AIC3104@0x18 · ToF@0x29 · BMI088（未用）
                  ├── I2S3   12.288 MHz ───────────── 音频
                  ├── MIPI CSI ────────────────────── IMX219（I2C@0x10，转 90°）
                  ├── 蓝牙 ────────────────────────── 手柄 / 手机 App
                  ├── Wi-Fi ───────────────────────── WebRTC
                  └── USB-C ───────────────────────── 供电 + maskrom
```

| 模块 | 说明 |
|---|---|
| 主控 | **Radxa Zero 3W** —— 市售模块，非定制载板（RK3566 四核） |
| 舵机总线 | 单线半双工 TTL（非 RS-232 / RS-485），Dynamixel Protocol V2 @ 1 Mbps |
| 自制板 1 | `imu_to_dxl` v2 —— IMU 伪装成 Dynamixel 从机，姿态与关节状态同一次读回 |
| 自制板 2 | RPI Robot HAT —— AIC3104 音频 + BMI088 + ToF，官方已开源 |
| 电池 | 索尼 NP-F550 2S 锂电（无电量计，读舵机上报电压） |

完整细节：[硬件方案逆向](docs/硬件方案逆向.md) · [硬件规格速查](docs/硬件规格速查.md) · [硬件入门](docs/硬件入门.md)

---

## 复刻结论

**整机可复刻，卡点在成本不在技术。**

- **零件几何** ✅ 47 个 STL　**装配关系** ✅ 精确到 0.1mm　**关节/行程** ✅ 14 个全有　**质量惯量** ✅ 15 个刚体
- **HAT 板** ✅ 官方 Gerber 直接打样　**主控** ✅ 市售模块　**`imu_to_dxl` 板** ⚠️ 需自绘（协议已还原）
- **控制软件** ✅ 主控同款直接跑（Apache-2.0）　**策略** ✅ 官方 9 个 ONNX 直接可用

⚠️ **仿真 STL ≠ 可打印工程件。** 仿真只关心外形与惯量，不保证配合公差、螺纹孔、热熔螺母座和走线空间，直接打印大概率装不起来。

💰 **自己造大概率比买贵，差多少看渠道。** 15 个 XL330 在 ROBOTIS 国际站约 $359、美国站 $412、欧洲含税 €603–629。完整核价见 [BOM.md](BOM.md)。

### 三个必踩的坑

1. **Armbian 默认在 UART2 上跑登录控制台** —— 必须 `systemctl mask` 掉 `serial-getty@ttyS2`。
2. **i2c3 和 FUSB302 抢引脚** —— 用排针 pin 3/5 的硬件 I²C，代价是失去 USB-C PD 协商（普通 5V 充电仍可用）。
3. **NPU 出厂是关的** —— Armbian 默认禁用，要跑 RKNN 模型得刷 overlay 并重启。

---

## 装配视频教程

[B 站合集《MicroDuck 从零安装教程》](https://space.bilibili.com/312747174/lists/9279084?type=season) —— 从零件清单讲起，一集装一个部件，共 8 集：

| 集 | 内容 | 时长 |
|---|---|---|
| [第 1 集](https://www.bilibili.com/video/BV1RoHX68EFV/) | 零件清单 | 1:32 |
| [第 2 集](https://www.bilibili.com/video/BV1Xppb6tECr/) | 小腿安装 | 2:21 |
| [第 3 集](https://www.bilibili.com/video/BV1ycpb6yEwB/) | 大腿安装 | 5:13 |
| [第 4 集](https://www.bilibili.com/video/BV1Kwpg6wE9G/) | 躯干组件 | 2:29 |
| [第 5 集](https://www.bilibili.com/video/BV1EEpg6nEkD/) | 颈部安装 | 0:40 |
| [第 6 集](https://www.bilibili.com/video/BV1aKpE6hEzj/) | 头部安装 | 5:50 |

---

## 文档导航

| 文档 | 内容 |
|---|---|
| [紧固件反推](docs/紧固件反推.md)（[EN](docs/fastener-reconstruction.en.md)） | 从 47 个 STL 反推 M2 螺丝系统与采购量 |
| [执行器选型](docs/执行器选型.md)（[EN](docs/actuator-selection.en.md)） | XL330 参数、BAM M6、同级别舵机横向对比（含宇树 S288） |
| [**踩坑记录**](踩坑记录.md) | 上手前扫一遍 —— 买东西/打板/飞线/软件/工具 |
| [**调试记录**](调试记录.md) | 拿到货一步一步做 —— 配 ID、供电、按日期记过程 |
| [**HD-1910 训练前数据清单**](docs/HD-1910训练前数据清单.md) | 给算法重训用 —— 几何、惯量、标定、舵机规格 |
| [**不打 HAT**](docs/不打HAT.md) | HAT 打样太贵？¥70 降压模块 + 半双工转接板飞线替代 |
| [**硬件入门**](docs/硬件入门.md) | 一块板一块板讲清楚 + 复刻前五件核对 |
| [**硬件规格速查**](docs/硬件规格速查.md) | 一页纸规格表 |
| [硬件方案逆向](docs/硬件方案逆向.md)（[EN](docs/hardware-teardown.en.md)） | 完整推导过程与证据出处 |
| [**电控采购清单**](docs/电控采购清单.md) | 淘宝实链 —— 主控/摄像头/ToF/电源/PCB |
| [**机械采购清单**](docs/机械采购清单.md) | 淘宝实链 —— 轴承/M2 紧固件/耗材 |
| [社区动态](docs/社区动态.md) | X / GitHub 情报 |

---

## 重现逆向流程

```bash
# 1. 拉取上游（训练工程已在 software/training/，无需此步骤）
bash scripts/fetch_upstream.sh

# 2. 重新生成装配图
python scripts/render_assembly.py upstream/microduck_rl assembly-drawings

# 3. 导出上游装配分析预览（不作为实物打印件）
python scripts/export_assembly_stl.py upstream/microduck_rl analysis-output/cad-upstream

# 4. 重新扫描孔特征
python scripts/analyze_holes.py upstream/microduck_rl/src/mjlab_microduck/robot/microduck/assets
```

依赖：`mujoco` `numpy` `pillow` `scipy`。渲染需要可用的 OpenGL 上下文。

---

## 鸭友贡献

这个仓库不是一个人写的。合并进来的代码、实测验证过的结论，都记在这儿。

> **原作者**：本仓库源自 [@fanhao375](https://github.com/fanhao375) 的 [microduck-replica](https://github.com/fanhao375/microduck-replica) —— 逆向研究、装配图、爆炸图、硬件分析与文档的最初工作都由他完成；SolidWorks 图纸、装配 BOM 与装配视频由 **机械行者Robo** 建模整理。本仓库在其基础上继续维护。

| 谁 | 贡献了什么 |
|---|---|
| [@yoyojacky](https://github.com/yoyojacky) | **Rust 版飞特舵机测试工具**（[PR #27](https://github.com/UnitClaw/microduck-replica/pull/27)）→ [`tools/sts3215Servo_testtool/`](tools/sts3215Servo_testtool/) |
| [@Abo1ish](https://github.com/Abo1ish) | **IMU 小板固件 + 调试台姿态显示**（[PR #32](https://github.com/UnitClaw/microduck-replica/pull/32)）→ [`hardware/imu_to_dxl/firmware/`](hardware/imu_to_dxl/firmware/) |
| 微信群的鸭友 | **Radxa Zero 3W V1.12J 启动方案**（B1 引导 + B1 DTB + 内核 + Trixie）→ [踩坑记录](踩坑记录.md#软件) |

### 鸭友的项目

| 项目 | 作者 | 做什么的 |
|---|---|---|
| [microduck-color-studio](https://github.com/LathamZ/microduck-color-studio) | [@LathamZ](https://github.com/LathamZ) | 3D 配色工作室，打印前先在网页里定颜色 |
| [MICDUCK_FTHD1901_REBUILD](https://github.com/fengj4780-sudo/MICDUCK_FTHD1901_REBUILD) | [@fengj4780-sudo](https://github.com/fengj4780-sudo) | 飞特版结构改进 + 可选 CNC 加强件 |
| [Microduck-kissqy](https://github.com/kissqy/Microduck-kissqy) | [@kissqy](https://github.com/kissqy) | 飞特 HD1910 训练流程与控制实现参考 |

想加进来：直接开 [issue](https://github.com/UnitClaw/microduck-replica/issues) 或提 PR。硬件、固件、算法、文档、实测数据都算 —— 实测数据尤其欢迎。

---

## 最近更新

**2026-10-21 · 复刻镜像 20261021b（预发布）**：新卡第一次开机热点马上开；SSH 卡片能登记公钥；总线 IMU 认本仓库自制板。→ [下载](https://github.com/UnitClaw/microduck-replica/releases/tag/microduck-replica-image-20261021b)

**2026-10-20 · Microduck Studio 第一版**：装在鸭子上的网页中控，浏览器开 `http://<鸭子 IP>:8000/` 就能看状态、调舵机、配手柄、让它走。→ [Studio 说明](software/studio/)

**2026-10-15 · 「走两三步就摔」根因找到**：BNO085 芯片自算姿态走路时会跳，改用陀螺积分后推摇杆 60 秒一次没摔。→ [完整记录](docs/HD1910-20261015-IMU乱跳根因与陀螺融合上机.md)

**2026-10-12 · 主控配置勘误**：Radxa Zero 3W 买 **1G/2G 无 eMMC 版 + 32GB microSD 卡**即可，之前让大家多花了钱。→ [买哪个配置](docs/电控采购清单.md#该买哪个配置)

> 完整更新日志见 [CHANGELOG.md](CHANGELOG.md)。

---

## 许可证

- `scripts/`、`software/studio/`、`software/image/` —— **Apache-2.0**
- `assembly-drawings/` 及保留的仿真网格 —— **CC BY-NC-SA 4.0**（上游 3D 模型为 CC BY-NC-SA，**不得商用**）
- 复刻镜像里的走路和动作模型 —— 模型作者的个人非商业许可，**镜像不得随收费产品分发**

详见 [NOTICE.md](NOTICE.md)。本项目与 Pollen Robotics 无隶属关系，未获其背书。

---

## 联系我们

<table align="center">
<tr>
<td align="center"><a href="https://www.wwntai.com"><b>官网</b></a><br><sub>www.wwntai.com</sub></td>
<td align="center"><a href="https://wwnt.ai"><b>国际站</b></a><br><sub>wwnt.ai</sub></td>
<td align="center"><a href="https://www.wwntai.com/parts.html"><b>配件商城</b></a><br><sub>wwntai.com/parts.html</sub></td>
<td align="center"><a href="mailto:Support@wwntai.com"><b>邮箱</b></a><br><sub>Support@wwntai.com</sub></td>
</tr>
</table>

<div align="center">
  <img src="assets/wechat-group-2.png" alt="小鸭子的配件（主板，舵机群 2）微信二维码" width="280">
  <br>
  <sub><b>小鸭子的配件（主板，舵机群 2）· 下单：wwntai.com · 二维码有效期到 2026-10-31</b><br>
  配件商城：<a href="https://www.wwntai.com/parts.html">www.wwntai.com/parts.html</a> · 完整清单见 <a href="PARTS.md">PARTS.md</a><br>
  微信群码 7 天自动失效，过期后请访问官网获取最新，或在 <a href="https://github.com/UnitClaw/microduck-replica/issues">issue</a> 说一声，我会换上新的</sub>
</div>

---

© WWNT Robotics | 官网：[www.wwntai.com](https://www.wwntai.com) · 国际站：[wwnt.ai](https://wwnt.ai)
