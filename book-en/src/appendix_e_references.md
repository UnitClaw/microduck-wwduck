# References and Project Index

## E.1 Open-Source Projects

| Project | URL |
|---|---|
| Pollen microduck_rl | https://github.com/pollen-robotics/microduck_rl |
| Pollen microduck (firmware) | https://github.com/pollen-robotics/microduck |
| Pollen mjlab | https://github.com/pollen-robotics/mjlab |
| fanhao375 microduck-replica | https://github.com/fanhao375/microduck-replica |
| fanhao375 microduck-replica-cad | https://github.com/fanhao375/microduck-replica-cad |
| UnitClaw microduck-wwduck (WWNTRobotics-optimized edition) | https://github.com/UnitClaw/microduck-wwduck |
| LuwuDynamics xgoduck_hardware | https://github.com/LuwuDynamics/xgoduck_hardware |
| onshape-to-robot | https://github.com/onshape-to-robot/onshape-to-robot |
| NVIDIA Warp | https://github.com/NVIDIA/warp |

## E.2 Official Pages and Documentation

| Content | URL |
|---|---|
| MicroDuck product page | https://pollen-robotics.com/microduck/ |
| MicroDuck pre-order store | https://store.pollen-robotics.com/products/microduck |
| HF online simulation | https://huggingface.co/spaces/pollen-robotics/microduck-simulator |
| onshape-to-robot docs | https://onshape-to-robot.readthedocs.io/ |
| Onshape | https://cad.onshape.com/ |
| Warp docs | https://nvidia.github.io/warp/ |
| MJCF docs | https://mujoco.readthedocs.io/en/latest/modeling.html |
| FreeCAD | https://www.freecadweb.org/ |
| Feetech HD1910 product page | https://www.feetech.cn/500263.html |
| HD1910 XGO-Duck kit | https://www.feetech.cn/en/509038.html |

## E.3 Foundational Literature (for citation)

> The following are classical methodological references; verify the exact entries before citing during writing.

- PPO: Schulman et al., Proximal Policy Optimization Algorithms.
- Domain Randomization: related work by NVIDIA's Tobin et al.
- BAM servo model: Pollen MicroDuck technical papers / blog posts.
- Low-cost bipedal Sim-to-Real: Pollen MicroDuck technical paper.

> Writing convention: on formal publication, verify DOI / volume / page numbers for all references; cite sources when quoting in the main text, and do not erase original authorship.

## E.4 Reference-Material Archive

All original material for this book is archived in the repository's `book/materials/`, organized into subdirectories:

- `pollen_original/`: original RL, firmware, blog, papers;
- `replica_source/`: microduck-replica source snapshot;
- `cad/`: CAD drawings, STEP, Onshape config;
- `feetech_hd1910/`: servo specs, protocol, calibration docs;
- `hardware/`: RK3566, IMU, power;
- `framework_docs/`: MuJoCo-Warp, mjlab, PPO;
- `scripts/`: companion scripts;
- `references/`: literature and terminology.

> Note: some external resources cannot be downloaded and packaged directly; the archive provides **access link + acquisition method + key notes** instead. The complete HD1910 PDF datasheet and serial-protocol documents must be requested from Feetech customer service.
