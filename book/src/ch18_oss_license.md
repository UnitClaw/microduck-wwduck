# 工程化与开源合规

> 本章目标：把整套工程做成规范、可复现、开源合规的仓库。包含分支管理、文档工程化、自动化测试与开源许可详解。

## 17.1 Fork 仓库工作流与分支管理

正确的分支策略能避免"上游同步冲突"：

```
main            # 上游跟踪分支，仅同步 fanhao375/microduck-replica 更新
book-dev        # 本书开发主分支（书稿、脚本、Docker、实验）
feature/cad2mjcf     # 功能分支，开发完成合并到 book-dev
feature/bam-id
feature/docker
```

**为什么要分开**：
- `main` 保持和上游接近，方便拉取上游更新；
- 你的定制（删联系方式、新增英文文档、改 RL 代码）全放 `book-dev`；
- 上游更新时同步 `main`，再合并进 `book-dev`，冲突最少。

### 上游同步操作
```bash
git fetch upstream
git checkout main
git merge upstream/main
git checkout book-dev
git merge main   # 解决可能出现的冲突
```

## 17.2 文档工程化

仓库文档分层：
- `README.md`：中文快速上手；
- `README_EN.md`：英文版本；
- `book/`：本书 mdbook 书稿；
- `docs/tutorials/`：独立分步教程（不嵌入书稿）；
- `docs/engineering_log/`：工程踩坑日志（书稿素材）。

> 建议增加中英双语 `README_EN.md`，这是原复刻仓库缺失、也是你计划的改进点。

## 17.3 自动化测试与 CI

`.github/workflows/test-sim.yml`：每次提交自动加载 MJCF、校验模型，把错误挡在合并前。

```yaml
name: Sim Validate
on: [push, pull_request]
jobs:
  test-mjcf:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.10" }
      - run: pip install mujoco
      - run: python scripts/validation/validate_mjcf.py --mjcf software/training/assets/robots/microduck_feetech.xml
```

`build-book.yml`：mdbook 自动编译，部署 GitHub Pages 网页电子书。

## 17.4 实验管理规范

所有训练实验存入 `experiments/`，每个实验文件夹必须含：
1. `config.yaml`：训练配置、域随机化、BAM 参数；
2. `mjcf/`：MJCF 快照；
3. `bam_params.json`：舵机参数；
4. `logs/` + `tensorboard/`；
5. `readme.md`：目标、消融变量、结果、失败分析。

> 保证每个实验可复现、可回溯，是工程化与书稿案例的核心。

## 17.5 Git LFS 管理大文件

ONNX、STL、STEP、CSV、Tensorboard 日志体积大，用 Git LFS：

```bash
# .gitattributes
*.onnx filter=lfs diff=lfs merge=lfs -text
*.stl   filter=lfs diff=lfs merge=lfs -text
*.step  filter=lfs diff=lfs merge=lfs -text
*.csv   filter=lfs diff=lfs merge=lfs -text
```

## 17.6 开源许可详解（务必合规）

| 内容 | 许可 | 商用限制 |
|---|---|---|
| 软件代码（training/firmware） | Apache 2.0 | ✅ 可商用 |
| 机械 CAD 模型（replica-cad） | CC BY-NC-SA | ❌ 禁止商用 |
| 本书书稿正文 | CC-BY 4.0 | 可自由分享，引用需署名 |

### Fork 合规要点
1. **不能删除** LICENSE 文件、原作者版权归属声明；
2. **可删除** README 里私人联系方式（微信、邮箱）；
3. 保留来源署名：`基于 pollen-robotics/microduck_rl 与 fanhao375/microduck-replica 衍生开发`；
4. 不可抹除来源、宣称完全原创；
5. 若要商用产品，必须独立正向设计机械结构，脱离 CC BY-NC-SA 模型。

### 图片合规
优先使用自己实验产出的图；原版 Pollen 图片谨慎引用，避免图片版权问题。

## 17.7 工程踩坑实录

- **直接改 main 分支**：上游更新后冲突一堆。改用 book-dev + feature 分支后大幅减少冲突。
- **未锁版本**：依赖升级后环境跑不起来。用 `requirements-lock.txt` 锁定。

## 17.8 本章小结

你已掌握分支管理、文档工程化、CI、实验管理、Git LFS 与开源许可合规。

> 最后一章展望进阶方向：硬件升级、算法进阶与商业化边界。
