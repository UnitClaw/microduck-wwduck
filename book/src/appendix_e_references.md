# 参考文献与项目索引

## E.1 开源项目

| 项目 | 地址 |
|---|---|
| Pollen microduck_rl | https://github.com/pollen-robotics/microduck_rl |
| Pollen microduck（固件） | https://github.com/pollen-robotics/microduck |
| Pollen mjlab | https://github.com/pollen-robotics/mjlab |
| fanhao375 microduck-replica | https://github.com/fanhao375/microduck-replica |
| fanhao375 microduck-replica-cad | https://github.com/fanhao375/microduck-replica-cad |
| UnitClaw microduck-wwduck（WWNTRobotics 优化版） | https://github.com/UnitClaw/microduck-wwduck |
| LuwuDynamics xgoduck_hardware | https://github.com/LuwuDynamics/xgoduck_hardware |
| onshape-to-robot | https://github.com/onshape-to-robot/onshape-to-robot |
| NVIDIA Warp | https://github.com/NVIDIA/warp |

## E.2 官方与文档

| 内容 | 地址 |
|---|---|
| MicroDuck 产品主页 | https://pollen-robotics.com/microduck/ |
| MicroDuck 预购商店 | https://store.pollen-robotics.com/products/microduck |
| HF 在线仿真 | https://huggingface.co/spaces/pollen-robotics/microduck-simulator |
| onshape-to-robot 文档 | https://onshape-to-robot.readthedocs.io/ |
| Onshape | https://cad.onshape.com/ |
| Warp 文档 | https://nvidia.github.io/warp/ |
| MJCF 文档 | https://mujoco.readthedocs.io/en/latest/modeling.html |
| FreeCAD | https://www.freecadweb.org/ |
| 飞特 HD1910 产品页 | https://www.feetech.cn/500263.html |
| HD1910 XGO-Duck 套件 | https://www.feetech.cn/en/509038.html |

## E.3 基础文献（写作引用）

> 以下为方法论层面的经典文献，需在写作时检索确认具体条目后引用。

- PPO：Schulman 等人，Proximal Policy Optimization Algorithms。
- Domain Randomization：NVIDIA Tobin 等人相关工作。
- BAM 舵机模型：Pollen MicroDuck 相关技术论文 / 技术博客。
- Sim-to-Real 低成本双足：Pollen MicroDuck 技术论文。

> 写作规范：正式出版时，所有文献需核对 DOI / 卷期页码；书稿正文引用时标注来源，不抹除原作者署名。

## E.4 参考资料归档

全书原始资料归档于仓库 `book/materials/`，按以下子目录分类：
- `pollen_original/`：原版 RL、固件、博客、论文；
- `replica_source/`：microduck-replica 源码快照；
- `cad/`：CAD 图纸、STEP、onshape 配置；
- `feetech_hd1910/`：舵机规格、协议、校准文档；
- `hardware/`：RK3566、IMU、电源；
- `framework_docs/`：MuJoCo-Warp、mjlab、PPO；
- `scripts/`：配套脚本；
- `references/`：文献与术语。

> 说明：部分外部资源无法直接下载打包，归档时给出**访问链接 + 获取方法 + 保存要点**；HD1910 完整 PDF 规格书与串口协议文档需联系飞特客服索取。
