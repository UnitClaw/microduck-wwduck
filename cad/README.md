# CAD 与模型统一到配套仓库

**请到 [UnitClaw/microduck-wwduck-cad](https://github.com/UnitClaw/microduck-wwduck-cad) 下载结构件、装配体、SolidWorks / STEP 源文件。** 直接打印用的飞特 STL / 3MF 见本仓 [打印件·缝合怪版](../print/README.md)。

该仓库是模型的统一维护入口，包含版本选择、装配 BOM、组件图及安装说明。截至 2026-09-28，飞特 HD-1910 为 [v2.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v2.1)，XL330 为 [v1.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v1.1)。下载前核对舵机类型和具体附件版本；打印注意事项见 [print/README](../print/README.md)。

本目录以前的 16 个 STL 是从上游 MJCF 生成的装配预览，未同步最新实物 CAD，已于 2026-09-28 移除。需要追溯时查看 Git 历史；最新文件统一从配套仓库获取。

本仓 `assembly-drawings/` 的分析渲染、训练模型和网页调试模型仍有上游几何，不应作为最新结构件的加工或打印依据。[导出脚本](../scripts/export_assembly_stl.py)仅供上游模型分析，默认输出到被忽略的 `analysis-output/cad-upstream/`。

**English:** CAD assemblies and mechanical parts now have one maintained source: [microduck-wwduck-cad](https://github.com/UnitClaw/microduck-wwduck-cad). Print files: the Feetech STL/3MF live in this repo's [FrankenDuck edition](../print/frankenduck/), editable sources in the CAD repo. The old upstream assembly-preview STLs were removed from this directory. Simulation and visualization meshes retained elsewhere are not manufacturing files.
