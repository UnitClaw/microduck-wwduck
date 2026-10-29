# 打印文件 · 缝合怪版（FrankenDuck）

**简体中文** · [English](README.en.md)

**本仓库的 3D 打印件采用「缝合怪版」** —— 汇集多位社区制作者的优化与实机装配改动，由 [@kissqy](https://github.com/kissqy) 整理发布（原目录 [kissqy/Microduck-kissqy · hardware/3d-print-frankenduck](https://github.com/kissqy/Microduck-kissqy/tree/main/hardware/3d-print-frankenduck)），现由 WWNT Robotics 维护。

## 下载

| 内容 | 下载 |
|---|---|
| **完整打印包**（36 个 STL + 1 个 3MF 摆盘，5 盘，14.5 MiB） | [⬇️ RAR](frankenduck/Microduck-Print-FrankenDuck-20261015.rar) |
| 包内文件清单 | [FILES.md](frankenduck/FILES.md) |
| SHA256 校验 | [SHA256SUMS](frankenduck/SHA256SUMS) |
| 摆盘预览（5 盘） | [frankenduck/](frankenduck/) |

## 两种电池仓

文件在压缩包 `stl模型/躯体部分/` 下：

| 版本 | 文件 | 用途 |
|---|---|---|
| **夹 HUB 板版** | `电池仓_M2.5螺丝_HUB组合.stl` | 需要同时夹持 HUB 板时选择 |
| **官方式加厚卡扣版** | `电池仓_卡扣加厚.stl` | 沿用官方式结构，加厚卡扣部分 |

## 打印要点

- **第 5 盘为 TPU**（`左脚底`、`右脚底`、`滑轮`），打印前切换为 TPU 材料配置
- 滑轮使用 **623ZZ（3×10×4 mm）** 轴承，按选配另购
- 参考摆盘：Bambu Lab P2S / 0.4 mm 喷嘴 / 0.20 mm Standard；按自己的机器调整
- 硬质件为 PLA；软下巴、软嘴顶部等柔性件按 BOM 用 TPU

## 与可编辑图纸的关系

缝合怪版是**直接打印的 STL / 3MF**。如需二次设计、改尺寸，用可编辑的 SolidWorks 源文件，统一维护在 [microduck-wwduck-cad](https://github.com/UnitClaw/microduck-wwduck-cad)（飞特 HD-1910 / XL330 两版）。

> 缝合怪版版权归原作者 kissqy 及社区贡献者所有，新增修改遵循其分项许可；转载与二次分发请保留署名。
