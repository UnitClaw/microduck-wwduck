# Engineering Practices and Open-Source Compliance

> Learning objectives: turn the entire project into a standardized, reproducible, open-source-compliant repository. Covers branch management, documentation engineering, automated testing, and open-source licensing.

## 17.1 Fork Workflow and Branch Management

A correct branch strategy avoids "upstream-sync conflicts":

```
main            # upstream tracking branch, only syncs fanhao375/microduck-replica updates
book-dev        # the book's main development branch (manuscript, scripts, Docker, experiments)
feature/cad2mjcf     # feature branches, merged into book-dev on completion
feature/bam-id
feature/docker
```

**Why separate them**:

- `main` stays close to upstream, making upstream updates easy to pull;
- all of your customizations (removing contact info, adding English docs, changing RL code) go into `book-dev`;
- on upstream updates, sync `main`, then merge into `book-dev` with minimal conflicts.

### Upstream Sync Procedure

```bash
git fetch upstream
git checkout main
git merge upstream/main
git checkout book-dev
git merge main   # resolve any conflicts that arise
```

## 17.2 Documentation Engineering

Repository documentation layers:

- `README.md`: Chinese quick start;
- `README_EN.md`: English version;
- `book/`: this book's mdbook manuscript;
- `docs/tutorials/`: standalone step-by-step tutorials (not embedded in the manuscript);
- `docs/engineering_log/`: engineering pitfall logs (manuscript material).

> Consider adding a bilingual `README_EN.md` — an improvement missing from the original replica and part of your plan.

## 17.3 Automated Testing and CI

`.github/workflows/test-sim.yml`: on every commit, load the MJCF and validate the model, keeping errors out before merging.

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

`build-book.yml`: mdbook auto-compilation, deploying the GitHub Pages web book.

## 17.4 Experiment-Management Convention

All training experiments go into `experiments/`; each experiment folder must contain:

1. `config.yaml`: training config, domain randomization, BAM parameters;
2. `mjcf/`: MJCF snapshot;
3. `bam_params.json`: servo parameters;
4. `logs/` + `tensorboard/`;
5. `readme.md`: goal, ablation variables, results, failure analysis.

> Guaranteeing that every experiment is reproducible and traceable is the core of engineering and of the book's case studies.

## 17.5 Managing Large Files with Git LFS

ONNX, STL, STEP, CSV, and TensorBoard logs are large; use Git LFS:

```bash
# .gitattributes
*.onnx filter=lfs diff=lfs merge=lfs -text
*.stl   filter=lfs diff=lfs merge=lfs -text
*.step  filter=lfs diff=lfs merge=lfs -text
*.csv   filter=lfs diff=lfs merge=lfs -text
```

## 17.6 Open-Source Licensing Details (Must Comply)

| Content | License | Commercial restriction |
|---|---|---|
| Software code (training/firmware) | Apache 2.0 | ✅ commercial use allowed |
| Mechanical CAD models (replica-cad) | CC BY-NC-SA | ❌ commercial use prohibited |
| Book manuscript | CC-BY 4.0 | free to share, attribution required |

### Fork Compliance Essentials

1. **Do not remove** LICENSE files or the original authors' attribution statements;
2. **May remove** private contact info (WeChat, email) from the README;
3. Keep source attribution: `derived from pollen-robotics/microduck_rl and fanhao375/microduck-replica`;
4. Do not erase the source or claim complete originality;
5. For a commercial product, you must independently design the mechanical structure from scratch, independent of the CC BY-NC-SA models.

### Image Compliance

Prefer images produced by your own experiments; cite original Pollen images cautiously to avoid image-copyright issues.

## 17.7 Engineering Pitfall Log

- **Editing `main` directly**: a pile of conflicts after upstream updates. Switching to book-dev + feature branches greatly reduced conflicts.
- **Unpinned versions**: the environment broke after dependency upgrades. Pin with `requirements-lock.txt`.

## 17.8 Chapter Summary

You have mastered branch management, documentation engineering, CI, experiment management, Git LFS, and open-source licensing compliance.

> The final chapter looks ahead: hardware upgrades, algorithm advances, and commercialization boundaries.
