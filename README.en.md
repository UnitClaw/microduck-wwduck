# Microduck Replica

**English** · [简体中文](README.md)

> 📖 **Read the online book** (19-chapter full-stack engineering book, Ch.19 = Parts Store) → [unitclaw.github.io/microduck-wwduck](https://unitclaw.github.io/microduck-wwduck/)
> 🛒 **Parts Store** (parts & accessories · illustrated list) → [wwntai.com/parts.html](https://www.wwntai.com/parts.html) ｜ in-repo list: [PARTS.md](PARTS.md)

> A third-party reconstruction study of [Pollen Robotics' Microduck](https://pollen-robotics.com/microduck/).
> Assembly drawings, exploded views, CAD-importable assemblies, and a complete electronics teardown — all derived from publicly released files and source code.
>
> Print files (Feetech · FrankenDuck): [print/frankenduck](print/frankenduck/)　·　Editable drawings: [microduck-wwduck-cad](https://github.com/UnitClaw/microduck-wwduck-cad)　·　Assembly videos: [Bilibili series](https://space.bilibili.com/312747174/lists/9279084?type=season)

---

## What this is

Microduck is a **25 cm, 737 g** bipedal robot duck driven by 15 servos that learns to walk with reinforcement learning. Its software is open source (Apache-2.0); its hardware is **partly** open:

| Part | Status |
|---|---|
| RPI Robot HAT board | ✅ Fully published by Pollen (KiCad / Gerbers / BOM) → [`elec_RPI_Robot_HAT`](https://github.com/pollen-robotics/elec_RPI_Robot_HAT) |
| `imu_to_dxl` board | ❌ Not published —— the reconstruction here is the only one available |
| Mechanical CAD / BOM / assembly docs | ❌ Not published —— reverse-engineered from the MJCF + 47 STLs |

Two public artifacts turn out to be enough: **`microduck_rl`** ships the full MJCF model and 47 STL meshes (the complete kinematic tree, accurate to 0.1 mm), and **the open-source Rust runtime** hard-codes device paths, I²C addresses and register offsets — the code *is* the datasheet.

> ✅ **Independently verified.** On 2026-08-31 [@tspy](https://x.com/tspy/status/2094249218735300630) published a hardware teardown that matches this repository's conclusions exactly — including that the main board is a Radxa Zero 3W. See [Community Intelligence](docs/社区动态.md).

---

## Two tracks — pick one

This repository covers two servo choices. **Mechanics, electronics and software all differ**, so decide before building:

| | Original · Dynamixel XL330 | Feetech · HD-1910 |
|---|---|---|
| Servos | XL330-M288-T ×15 | HD-1910-C001 ×15 — half the price, 2.5× the torque |
| Printed parts | [CAD repository · XL330](https://github.com/UnitClaw/microduck-wwduck-cad) | [FrankenDuck (this repo)](print/frankenduck/); mating parts are not interchangeable |
| Electronics | Official HAT + [`imu_to_dxl`](hardware/imu_to_dxl/) | Same; servo connectors are 2.0 mm (official 2.5) |
| Software | Official runtime runs as-is | Different bus protocol, swap the protocol module + retrain for HD-1910 |
| Status | Paper analysis + first prints | Assembled and stood up (09-18), 14 joints read on the bus |

The selection argument is in [Actuator Selection](docs/actuator-selection.en.md). This repo's main line is Feetech; the original track is documented just as fully.

---

## Quick start

```bash
git clone https://github.com/UnitClaw/microduck-replica.git
```

1. **Pick a track** — XL330 (original) or HD-1910 (Feetech, half the price)
2. **Source parts** — servos, bearings and fasteners per [BOM.en.md](BOM.en.md); print files: [FrankenDuck](print/frankenduck/) for the Feetech track, the [CAD repository](https://github.com/UnitClaw/microduck-wwduck-cad) for XL330; servos, mainboard and batteries are available at the [Parts Store](https://www.wwntai.com/parts.html) (full list in [PARTS.md](PARTS.md))
3. **Watch the assembly videos** — [Bilibili series](https://space.bilibili.com/312747174/lists/9279084?type=season), one subassembly per episode
4. **Flash the image and walk** — [replica image](https://github.com/UnitClaw/microduck-replica/releases/latest): flash → boot → join the hotspot → set up WiFi, no SSH at any point

---

## Repository layout

```
microduck-replica/
├── book/                # 📖 The book (mdbook source, online at unitclaw.github.io/microduck-wwduck)
├── docs/                # Reverse-engineering notes, selection, sourcing
├── assembly-drawings/   # Assembly drawings and exploded views
├── build-log/           # Physical build log (photos)
├── hardware/            # imu_to_dxl board, HAT, new custom boards
├── print/               # 3D print set (Feetech · FrankenDuck)
├── software/            # Studio web console, replica image, training
├── tools/               # Web servo console, Feetech tools, gait analysis
├── PARTS.md             # 🛒 Parts store list (maps to book Ch.19)
├── BOM.en.md            # Bill of materials (what to buy, how many)
├── BUILD-LOG.en.md      # Mechanical assembly log
├── 调试记录.md           # Electrical & software debug log (Chinese)
├── 踩坑记录.md           # Pitfalls: symptom, cause, fix (Chinese)
└── NOTICE.md            # Attribution, sources and licensing
```

---

## Where things stand

| Track | Progress |
|---|---|
| 🔌 **Electronics** | IMU jump root cause found (BNO085 self-fused attitude jumps while walking); gyro integration gives 60 s of pushing with no fall; three new custom boards drawn → [`hardware/新版/`](hardware/新版/) |
| 🔨 **Mechanical** | Feetech HD-1910 build assembled, all 15 servos configured and mounted → [Build Log](BUILD-LOG.en.md) |
| 💻 **Software** | **Microduck Studio** web console (watch / tune / pair / walk) + replica image (pre-release) → [Studio](software/studio/) · [Image](software/image/) |
| 🧠 **Algorithms** | 1910 BAM M6 parameters from [LuwuDynamics/xgoduck_rl](https://github.com/LuwuDynamics/xgoduck_rl) as the simulation baseline; training project bundled in [`software/training/`](software/training/) |

> Detailed progress under [Latest](#latest); the full log is in [CHANGELOG.en.md](CHANGELOG.en.md).

---

## Reverse-engineered results

### Assembly and exploded views

![Exploded view](assembly-drawings/06_爆炸图_四分之三.png)

Seven drawings under `assembly-drawings/`: four assembled views (front/side/rear/isometric), two exploded views (side/isometric, labeled with names and masses) and one color-coded cross-reference.

### Assembly structure and joint parameters

```
Trunk 199 g
├─ L hip yaw→roll 23 g → L hip roll 6 g → L thigh 48 g → L shin 22 g → L ankle+foot 30 g
├─ Neck base 37 g → Neck pitch 6 g → Head yaw/roll 49 g → Head assembly + beak 189 g
└─ R hip yaw→roll 23 g → R hip roll 6 g → R thigh 48 g → R shin 22 g → R ankle+foot 30 g

Total 737.2 g   Envelope 144 × 141 × 264 mm
```

Five DoF per leg, four for neck and head — **14 under policy control** (the 15th servo drives the beak through a passive linkage, outside the action space).

| Joint | Travel |
|---|---|
| `hip_yaw` | −25° … +30° |
| `hip_roll` | ±22° |
| `hip_pitch` / `knee` / `ankle` / `head_pitch` | ±90° |
| `neck_pitch` | −90° … +60° |
| `head_yaw` | ±170° |
| `head_roll` | ±25° |

---

## Electronics, reverse-engineered from the runtime

One 1 Mbps TTL serial bus does everything:

```
                Radxa Zero 3W (RK3566) · Armbian
                  ├── UART2  1 Mbps TTL half-duplex ── 15× XL330 + imu_to_dxl (ID 200)
                  ├── I2C3   400 kHz (pins 3/5) ────── AIC3104@0x18 · ToF@0x29 · BMI088 (unused)
                  ├── I2S3   12.288 MHz ────────────── audio
                  ├── MIPI CSI ─────────────────────── IMX219 (I2C@0x10, mounted upside down)
                  ├── Bluetooth ────────────────────── gamepad / phone app
                  ├── Wi-Fi ────────────────────────── WebRTC
                  └── USB-C ────────────────────────── power + maskrom
```

| Module | Notes |
|---|---|
| Main board | **Radxa Zero 3W** — off-the-shelf module, not a custom carrier (RK3566 quad-core) |
| Servo bus | Single-wire half-duplex TTL (not RS-232 / RS-485), Dynamixel Protocol V2 @ 1 Mbps |
| Custom board 1 | `imu_to_dxl` v2 — the IMU presents itself as a Dynamixel slave, so orientation and joint states return in the same read |
| Custom board 2 | RPI Robot HAT — AIC3104 audio + BMI088 + ToF, published by Pollen |
| Battery | Sony NP-F550 2S Li-ion (no fuel gauge — voltage read from the servos) |

Full detail: [Hardware Teardown](docs/hardware-teardown.en.md) (EN) · [Hardware Primer](docs/硬件入门.md) · [Spec Sheet](docs/硬件规格速查.md)

---

## Verdict: can you build one?

**The whole robot is reproducible — the constraint is cost, not technology.**

- **Part geometry** ✅ 47 STLs　**Assembly** ✅ 0.1 mm accurate　**Joints/travel** ✅ all 14　**Mass/inertia** ✅ all 15 bodies
- **HAT board** ✅ official Gerbers, order directly　**Main board** ✅ off the shelf　**`imu_to_dxl`** ⚠️ redraw it (protocol fully recovered)
- **Control software** ✅ runs as-is (Apache-2.0)　**Policies** ✅ nine shipped ONNX work unchanged

⚠️ **Simulation STLs are not manufacturing files.** Simulation only needs outer shape and inertia — it guarantees nothing about fit tolerances, threads, heat-set bosses or cable clearance. Printing these directly will most likely not assemble.

💰 **Building one probably costs more than buying one, but how much depends on your channel.** Fifteen XL330s run about $359 (ROBOTIS international), $412 (ROBOTIS US), €603–629 (Europe inc-VAT). Full costing: [BOM.en.md](BOM.en.md).

### Three pitfalls worth knowing

1. **Armbian runs a login console on UART2** — `systemctl mask` `serial-getty@ttyS2`.
2. **i2c3 collides with the FUSB302** — using the hardware I²C on header pins 3/5 costs you USB-C PD negotiation (plain 5 V charging still works).
3. **The NPU ships disabled** in Armbian — flash the overlay and reboot to run RKNN models.

---

## Assembly videos

[Bilibili series "MicroDuck 从零安装教程"](https://space.bilibili.com/312747174/lists/9279084?type=season) — starts from the parts list, one subassembly per episode (Chinese narration; the hands-on footage is easy to follow):

| Episode | Content | Length |
|---|---|---|
| [1](https://www.bilibili.com/video/BV1RoHX68EFV/) | Parts list | 1:32 |
| [2](https://www.bilibili.com/video/BV1Xppb6tECr/) | Lower legs | 2:21 |
| [3](https://www.bilibili.com/video/BV1ycpb6yEwB/) | Thighs | 5:13 |
| [4](https://www.bilibili.com/video/BV1Kwpg6wE9G/) | Torso | 2:29 |
| [5](https://www.bilibili.com/video/BV1EEpg6nEkD/) | Neck | 0:40 |
| [6](https://www.bilibili.com/video/BV1aKpE6hEzj/) | Head | 5:50 |

---

## Documentation

| Document | Contents |
|---|---|
| [**Hardware Teardown**](docs/hardware-teardown.en.md) 🇬🇧 | Full derivation with evidence citations — main board, both custom boards, bus protocol, sensors, power |
| [**Actuator Selection**](docs/actuator-selection.en.md) 🇬🇧 | XL330 parameters, BAM M6, same-class servo comparison (incl. Unitree S288) |
| [**Fastener Reconstruction**](docs/fastener-reconstruction.en.md) 🇬🇧 | Hole-feature scan across 47 STLs → M2 system and purchase quantities |
| [**Hardware Primer**](docs/硬件入门.md) | Board by board + five checks before you replicate |
| [**Hardware Spec Sheet**](docs/硬件规格速查.md) | One-page reference — block diagram, part numbers, bus parameters |
| [**Electronics Sourcing**](docs/电控采购清单.md) | Taobao links — main board, camera, ToF, power, PCBs |
| [**Mechanical Sourcing**](docs/机械采购清单.md) | Bearings, M2 fasteners, inserts, filament |
| [**HD-1910 pre-training data checklist**](docs/HD-1910训练前数据清单.md) | Geometry, inertia, calibration, servo specs for retraining |
| [Pitfalls](踩坑记录.md) | Symptom, cause, fix — read before you start |
| [Ecosystem Map](docs/ecosystem.en.md) 🇬🇧 | Every official repo, simulator, policy and dataset annotated |
| [Community Intelligence](docs/社区动态.md) | X / GitHub signals, independent verification, scam warnings |

> 🇬🇧 marks documents available in English. The rest are Chinese-only for now — their tables, part numbers, addresses and diagrams are readable without it, and machine translation handles the prose well.

---

## Reproducing this

```bash
# 1. Fetch upstream for the drawing scripts below (training is already in software/training/)
bash scripts/fetch_upstream.sh

# 2. Regenerate the drawings
python scripts/render_assembly.py upstream/microduck_rl assembly-drawings

# 3. Export upstream assembly previews for analysis (not manufacturing)
python scripts/export_assembly_stl.py upstream/microduck_rl analysis-output/cad-upstream

# 4. Re-scan hole features
python scripts/analyze_holes.py upstream/microduck_rl/src/mjlab_microduck/robot/microduck/assets
```

Requires `mujoco`, `numpy`, `pillow`, `scipy`. Rendering needs a working OpenGL context.

---

## Contributions from the flock

This repo is not one person's work. Merged code and bench-verified findings are credited here.

> **Original authors**: this repo descends from [@fanhao375](https://github.com/fanhao375)'s [microduck-replica](https://github.com/fanhao375/microduck-replica) — the reverse-engineering study, assembly drawings, exploded views, hardware analysis and documentation were originally his work. The SolidWorks drawings, assembly BOM and assembly videos were modelled by **机械行者Robo**. This repo continues that work.

| Who | What they contributed |
|---|---|
| [@yoyojacky](https://github.com/yoyojacky) | **Rust test tool for Feetech servos** ([PR #27](https://github.com/UnitClaw/microduck-replica/pull/27)) → [`tools/sts3215Servo_testtool/`](tools/sts3215Servo_testtool/) |
| [@Abo1ish](https://github.com/Abo1ish) | **IMU board firmware + attitude view in the console** ([PR #32](https://github.com/UnitClaw/microduck-replica/pull/32)) → [`hardware/imu_to_dxl/firmware/`](hardware/imu_to_dxl/firmware/) |
| A member of the WeChat group | **Boot recipe for the Radxa Zero 3W V1.12J** (B1 bootloader + B1 DTB + kernel + Trixie) → [pitfalls log](踩坑记录.md#软件) |

### Projects from the flock

| Project | Author | What it does |
|---|---|---|
| [microduck-color-studio](https://github.com/LathamZ/microduck-color-studio) | [@LathamZ](https://github.com/LathamZ) | 3D color studio — settle colors in the browser before printing |
| [MICDUCK_FTHD1901_REBUILD](https://github.com/fengj4780-sudo/MICDUCK_FTHD1901_REBUILD) | [@fengj4780-sudo](https://github.com/fengj4780-sudo) | Feetech structural rework + optional CNC reinforcement |
| [Microduck-kissqy](https://github.com/kissqy/Microduck-kissqy) | [@kissqy](https://github.com/kissqy) | HD1910 training workflow & robot control reference |

Built something for the duck? Open an [issue](https://github.com/UnitClaw/microduck-replica/issues) or send a PR — hardware, firmware, algorithms, docs, measured data all count. **Measured data especially.**

---

## Latest

**2026-10-21 — Replica image 20261021b (pre-release)** — hotspot opens immediately on first boot, the SSH card registers your public key, and the bus IMU recognizes this repo's own board. → [Download](https://github.com/UnitClaw/microduck-replica/releases/tag/microduck-replica-image-20261021b)

**2026-10-20 — Microduck Studio, first release** — a web console that runs on the duck: watch the robot, tune servos, pair a gamepad, make it walk, no SSH. → [Studio](software/studio/)

**2026-10-15 — "falls after two or three steps" root cause found** — the BNO085's self-fused attitude jumps while walking; gyro integration gives 60 s of pushing with no fall. → [Full record](docs/HD1910-20261015-IMU乱跳根因与陀螺融合上机.md)

**2026-10-12 — Main board correction** — buy a **1 GB/2 GB board without eMMC + 32 GB microSD**, not the 2G/16G we previously suggested. → [Purchase guide](docs/电控采购清单.md#该买哪个配置)

> The full log is in [CHANGELOG.en.md](CHANGELOG.en.md).

---

## License

- `scripts/`, the code in `software/studio/`, and `software/image/` — **Apache-2.0**
- `assembly-drawings/` and retained simulation meshes — **CC BY-NC-SA 4.0** (upstream 3D models are CC BY-NC-SA; **non-commercial only**)
- The walking and skill models in the replica image — their author's personal non-commercial licence; **the image must not be distributed with any paid product**

See [NOTICE.md](NOTICE.md). Not affiliated with or endorsed by Pollen Robotics.

---

## Contact

<table align="center">
<tr>
<td align="center"><a href="https://www.wwntai.com"><b>Website</b></a><br><sub>www.wwntai.com</sub></td>
<td align="center"><a href="https://wwnt.ai"><b>International</b></a><br><sub>wwnt.ai</sub></td>
<td align="center"><a href="https://www.wwntai.com/parts.html"><b>Parts Store</b></a><br><sub>wwntai.com/parts.html</sub></td>
<td align="center"><a href="mailto:Support@wwntai.com"><b>Email</b></a><br><sub>Support@wwntai.com</sub></td>
</tr>
</table>

<div align="center">
  <img src="assets/wechat-group-2.png" alt="MicroDuck Parts (Mainboard & Servo) Group 2 WeChat QR code" width="280">
  <br>
  <sub><b>MicroDuck Parts (Mainboard & Servo) Group 2 · order at wwntai.com · expires 2026-10-31</b><br>
  Parts store: <a href="https://www.wwntai.com/parts.html">www.wwntai.com/parts.html</a> · full list: <a href="PARTS.md">PARTS.md</a><br>
  WeChat group codes are valid for 7 days; if expired, visit the website for the latest, or open an <a href="https://github.com/UnitClaw/microduck-replica/issues">issue</a> and I will post a fresh one</sub>
</div>

---

© WWNT Robotics | [www.wwntai.com](https://www.wwntai.com) · [wwnt.ai](https://wwnt.ai)
