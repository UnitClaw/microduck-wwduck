# Onshape→MJCF 自动化建模

> 本章是本书核心创新章节：替代原始 replica 手动填写惯性参数的方式，复刻 Pollen 原厂 CAD→MJCF 全自动化流水线，自动计算连杆质量、重心、惯性张量。
> 配套脚本：`scripts/cad2mjcf/export_mjcf.py` + `onshape_config.json`。

## 4.1 痛点：为什么不能手动估算惯性

原始 microduck-replica 的 MJCF 模型，连杆质量、惯性、重心依靠人工估算。
仿真中步态完美，但部署真机直接倾倒，核心根源就是**动力学模型和真实机器人不一致（Sim2Real gap）**。

Pollen 原版 MicroDuck 的解决方案：
SolidWorks 装配 → 导入 Onshape，设置零件密度 → onshape-to-robot 自动导出 MJCF，几何自动计算惯性张量。
本书完整复刻这套流水线，适配国产 HD1910 舵机。

### 4.1.1 工作流总链路
`STEP整机装配文件 → Onshape导入 → 零件密度赋值 → 舵机质量覆盖配置 → onshape-to-robot导出STL网格 + MJCF模型 → 自动MJCF校验 → 替换仿真机器人xml`

## 4.2 Onshape 前置准备

1. 将整机 STEP 装配导入 Onshape 文档；
2. 给每一个 3D 打印零件设置 PLA 等效密度：`1240 kg/m³`；
3. HD1910 舵机零件**不使用几何计算质量**，在配置文件强制覆盖质量 21g；
> 舵机内部空心杯、磁编码、齿轮结构复杂，几何计算质量不准，必须使用厂商标称重量覆盖。
4. 在 Onshape 装配中，定义关节（旋转副 revolute），记录关节 ID、旋转方向、物理限位。

### 4.2.1 PLA 等效密度参考
| 填充率 | 等效密度 (g/cm³) |
|---|---|
| 20% | 0.35~0.45 |
| 40% | 0.6~0.7 |
| 实体 PLA | ~1.24 |

### 4.2.2 Onshape API 密钥准备
需要申请 Onshape API 密钥，用于脚本远程读取装配几何：
- Onshape 个人账号 → 开发者控制台 → 创建 API Key；
- 导出两个环境变量：
```bash
export ONSHAPE_ACCESS_KEY="你的access_key"
export ONSHAPE_SECRET_KEY="你的secret_key"
```
> 密钥不要提交到 Git 仓库，加入 `.gitignore`。

## 4.3 配置文件讲解：onshape_config.json

路径：`scripts/cad2mjcf/onshape_config.json`

```json
{
  "url": "https://cad.onshape.com/documents/【文档ID】/w/【工作区ID】/e/【装配ID】",
  "output_format": "mjcf",
  "output_dir": "./output",
  "mesh_type": "stl",
  "units": "meters",
  "joints": {
    "thigh_right": {"type":"revolute","limits":[-1.57,1.57]},
    "thigh_left": {"type":"revolute","limits":[-1.57,1.57]},
    "knee_right": {"type":"revolute","limits":[-1.57,1.57]},
    "knee_left": {"type":"revolute","limits":[-1.57,1.57]},
    "hip_pitch_right": {"type":"revolute","limits":[-1.57,1.57]},
    "hip_pitch_left": {"type":"revolute","limits":[-1.57,1.57]},
    "hip_roll_right": {"type":"revolute","limits":[-1.0,1.0]},
    "hip_roll_left": {"type":"revolute","limits":[-1.0,1.0]},
    "hip_yaw_right": {"type":"revolute","limits":[-1.0,1.0]},
    "hip_yaw_left": {"type":"revolute","limits":[-1.0,1.0]},
    "ankle_pitch_right": {"type":"revolute","limits":[-1.57,1.57]},
    "ankle_pitch_left": {"type":"revolute","limits":[-1.57,1.57]},
    "ankle_roll_right": {"type":"revolute","limits":[-0.8,0.8]},
    "ankle_roll_left": {"type":"revolute","limits":[-0.8,0.8]}
  },
  "override_mass": {
    "hd1910_servo": 0.021
  }
}
```

- `units: meters`：MuJoCo 强制使用米、千克、秒国际单位；
- `limits` 单位为弧度，严格匹配 HD1910 机械硬限位，防止仿真中关节超程；
- `override_mass`：强制覆盖舵机质量，优先于几何计算。

## 4.4 一键导出 MJCF 脚本 export_mjcf.py

路径：`scripts/cad2mjcf/export_mjcf.py`

脚本逻辑：
1. 读取 JSON 配置；
2. 调用 `onshape-to-robot` 库远程访问 Onshape，导出 STL 网格与 MJCF；
3. 导出完成自动调用 MJCF 校验脚本；
4. 校验通过后提示，将 `robot.xml` 复制到仿真 assets 目录。

### 4.4.1 执行命令
```bash
python scripts/cad2mjcf/export_mjcf.py --config scripts/cad2mjcf/onshape_config.json
```

正常输出：
```
=== 启动 onshape-to-robot 导出MJCF ===
✅ 导出完成，开始校验MJCF模型
✅ MJCF加载成功，连杆数量: 16
✅ 整机总质量: 0.726 kg
✅ MJCF基础校验完成

✅ 全部完成！MJCF路径：scripts/cad2mjcf/output/robot.xml
提示：可将此robot.xml复制到 software/training/assets/robots/microduck_feetech.xml
```

## 4.5 校验脚本做了什么（validate_mjcf.py）

1. 加载 MJCF 模型，读取连杆数量；
2. 计算整机总质量；
3. 遍历每一个连杆，检查惯性张量正定（ixx, iyy, izz 必须 > 0）；
> 惯性张量非正定，MuJoCo 会出现数值不稳定、仿真爆炸。

## 4.6 闭环迭代流程（本书新增，原版 replica 没有）

> CAD 导出 MJCF 只是第一步，完整闭环：
1. Onshape 导出初始 MJCF；
2. 仿真跑站立 Demo，观察重心稳定性；
3. 3D 打印零件，单独称重，记录在 `data/cad_weigh_records/`；
4. 对比 CAD 自动计算质量 vs 真实称重；
5. 在 Onshape 微调零件密度，重新导出 MJCF；
6. 迭代直到 CAD 计算质量和实测质量误差 < 5%。

## 4.7 工程踩坑实录

1. 单位错误：Onshape 使用毫米，导出未转米，模型尺寸放大 1000 倍，仿真直接崩溃；
2. 关节限位写反，仿真关节向物理禁止方向转动；
3. 舵机没有 override_mass，几何计算质量偏小，仿真重心上移；
4. STL 网格破面，MuJoCo 碰撞检测报错。

## 4.8 本章小结

本章完成动力学建模自动化，不再依靠经验估算惯性。

但机器人仿真除了刚体动力学，还需要**舵机模型**。下一章进入 BAM 舵机模型，使用 HD1910 台架实测数据拟合参数。
