# HD1910 CAD 模型解析

> 本章目标：读懂 `microduck-replica-cad` 仓库的机械结构，理解两套舵机版本的零件差异，并学会导出整机 STEP 装配，为第 4 章的 Onshape 自动化 MJCF 导出做准备。

## 3.1 仓库结构总览

机械 CAD 图纸独立存放于 `fanhao375/microduck-replica-cad`：

```
microduck-replica-cad/
├── feetech/          # 飞特 HD1910 版本装配 + 全部零件
│   ├── microduck_feetech.SLDASM    # 整机装配体
│   └── ... *.sldprt                 # 单个零件
├── xl330/            # 原版 Dynamixel XL330 版本
│   ├── microduck_xl330.SLDASM
│   └── ... *.sldprt
└── stl/              # 可直接打印的 STL 文件
```

> 关键区分：**两套舵机版本的零件不能通用**。飞特 HD1910 与原版 Dynamixel 的外形、安装凸台方向、出轴位置均不同，打印时必须按对应版本取件，避免装配时发现装不上。

## 3.2 机器鸭的机械拓扑

MicroDuck 是双足机器人，单侧腿部大致包含：

| 关节 | 说明 | 数量（单侧） |
|---|---|---|
| 髋部 | 允许腿部前后摆动与左右开合（pitch/roll/yaw 组合） | 3 |
| 膝部 | 允许小腿屈伸（pitch） | 1 |
| 踝部 | 允许脚掌俯仰与侧倾（pitch/roll） | 2 |

整机共 **14~15 颗舵机**（部分复刻版在尾部/头部增加自由度），具体数量与限位以你的 CAD 装配树为准。

## 3.3 运动学树梳理（为 MJCF 做准备）

第 4 章导出 MJCF 时，需要告诉 Onshape/onshape-to-robot **哪些零件是连杆、哪些关节是可动关节**。这一步必须提前理清。推荐的运动学树（以 14 自由度为例）：

```
base(躯干/底座)
 ├── thigh_right  (髋 pitch) ── knee_right(膝) ── ankle_right(踝)
 └── thigh_left   (髋 pitch) ── knee_left (膝) ── ankle_left (踝)
```
> 髋部的 roll/yaw 通常放在躯干与大腿之间；若你的装配把 roll/yaw 放在髋 pitch 之后，导出 MJCF 时关节层级必须与实际一一对应，否则仿真直接报错。

## 3.4 导出整机 STEP 装配

`microduck-replica-cad` 仓库默认上传的是 SolidWorks 源文件（`.sldasm`/`.sldprt`），**不会直接给出打包好的 STEP**，需要你手动导出：

1. 用 SolidWorks 打开 `feetech/microduck_feetech.SLDASM`；
2. 菜单「文件 → 另存为」；
3. 文件类型选择 **STEP AP214**（推荐，兼容性最好）；
4. 保存得到 `microduck_feetech.step`。

> 没有 SolidWorks？可用免费开源 **FreeCAD** 打开 `.sldasm` 再导出 STEP，但 FreeCAD 对 SolidWorks 装配约束兼容性一般，部分装配约束可能丢失，导出前需检查装配完整性。

## 3.5 导出 STEP 前的三项检查

1. **装配层级不塌缩**：确认零件不是全部平铺在根节点，否则导出的 MJCF 关节层级会错乱；
2. **无过定义/欠定义**：装配约束完整，否则 STEP 导入 Onshape 后关节位置漂移；
3. **舵机安装方向正确**：飞特 HD1910 的安装凸台方向必须与大腿/小腿零件匹配，这是两套版本最常出错的点。

## 3.6 工程踩坑实录

1. **脚踝关节卡死**：这是复刻版经典问题。3D 打印后舵盘与相邻结构干涉，导致转动受限甚至卡死。需要在 CAD 里检查舵盘与外壳的间隙，必要时在 STEP 源文件里修正装配干涉、加宽间隙。
2. **零件壁厚过薄**：部分结构件壁厚不足，打印后受力易断裂。建议加厚受力部位，或提高填充率。
3. **打印错件**：同时下载了 feetech 与 xl330 两套 STL，打印时取错版本，导致装配不上。建议分目录、按版本标记打印。

## 3.7 本章小结

你现在应该能：
- 找到 `microduck-replica-cad` 中飞特版本的正确零件；
- 理解 MicroDuck 的运动学树（为 MJCF 关节定义做准备）；
- 从 SolidWorks 导出整机 STEP AP214。

> 下一章，把这份 STEP 导入 Onshape，用 `onshape-to-robot` 自动生成带精确惯性参数的 MJCF 模型，告别手动估算。
