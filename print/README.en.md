# Print Files · FrankenDuck Edition

**English** | [简体中文](README.md)

**This repository's 3D print set is the "FrankenDuck" edition** — combining optimizations from several community makers with changes made during real-world assembly and operation, curated and published by [@kissqy](https://github.com/kissqy) (original directory [kissqy/Microduck-kissqy · hardware/3d-print-frankenduck](https://github.com/kissqy/Microduck-kissqy/tree/main/hardware/3d-print-frankenduck)), now maintained by WWNT Robotics.

## Download

| Item | Download |
|---|---|
| **Full print pack** (36 STL + 1 3MF plate project, 5 plates, 14.5 MiB) | [⬇️ RAR](frankenduck/Microduck-Print-FrankenDuck-20261015.rar) |
| File list | [FILES.md](frankenduck/FILES.md) |
| SHA256 checksums | [SHA256SUMS](frankenduck/SHA256SUMS) |
| Plate previews (5 plates) | [frankenduck/](frankenduck/) |

## Two battery holders

Files are under `stl模型/躯体部分/` inside the archive:

| Version | File | Use |
|---|---|---|
| **HUB-clamping** | `电池仓_M2.5螺丝_HUB组合.stl` | Choose when you also need to clamp the HUB board |
| **Official-style, thicker latch** | `电池仓_卡扣加厚.stl` | Follows the official structure with a thicker latch |

## Print notes

- **Plate 5 is TPU** (`左脚底`, `右脚底`, `滑轮`) — switch to a TPU material profile before slicing
- Rollers use **623ZZ (3×10×4 mm)** bearings, purchased separately
- Reference plates: Bambu Lab P2S / 0.4 mm nozzle / 0.20 mm Standard; adjust for your own machine
- Rigid parts are PLA; flexible parts such as the soft jaw and soft mouth top are TPU per the BOM

## Relation to the editable drawings

FrankenDuck is **print-ready STL / 3MF**. For redesign or resizing, use the editable SolidWorks sources maintained in [microduck-wwduck-cad](https://github.com/UnitClaw/microduck-wwduck-cad) (Feetech HD-1910 / XL330 versions).

> The FrankenDuck edition is the work of its original author kissqy and community contributors; their additions follow the project's per-component license. Preserve attribution when redistributing.
