# Acknowledgments

> This book is the product of community collaboration. It stands on the shoulders of many open-source authors and manufacturers; without their generous sharing, this full-stack engineering practice for low-cost domestic bipedal robots would not exist. We extend our sincere thanks to each of them here.

## About WWNT Robotics

This book is written and maintained by **WWNT Robotics** (full name: "Guangdong WWNT Robotics Co., Ltd.").

WWNT Robotics is a company focused on **embodied intelligence and AI-robotics education**. Adhering to the principle of "open-source-driven, full-stack empowerment," it operates along two tracks:

- **Domestically**: industry–education integration for university AI/robotics programs, offering one-stop solutions spanning hardware, open-source curricula, training laboratories, campus large language models, and "factory-in-school";
- **Internationally**: expanding into the North American market, exporting robot platforms and joint modules.

The company was co-founded by founder Chi Ching Ip (Henry Ip) and co-founder Yan Chaolei. Its open-source ecosystem is hosted under the GitHub **UnitClaw** organization, and its official websites are [wwntai.com](https://www.wwntai.com) (domestic) and [wwnt.ai](https://wwnt.ai) (international).

This book is one of the embodiments of that philosophy: it organizes the process of replicating an overseas commercial product into a **reproducible, low-cost** engineering book, made freely available to university faculty and students, laboratory engineers, and open-source-hardware enthusiasts.

## Acknowledgments

### Pollen Robotics

Thanks to [Pollen Robotics](https://pollen-robotics.com/) for open-sourcing MicroDuck, mjlab, and microduck_rl, and for making the complete technical route of a Sim2Real reinforcement-learning bipedal robot available to the community. The mechanical structure, simulation models, and training paradigm of this book all derive from their open-source work.

> Note: this project is a **third-party replication study** of MicroDuck. It has no affiliation with Pollen Robotics and has not received its endorsement.

### Hugging Face

Thanks to [Hugging Face](https://huggingface.co/) for its open platform and robotics ecosystem — MicroDuck is an open-source project of Pollen Robotics, its in-house robotics team, and the online simulator (HF Spaces) and related training toolchain also run on the Hugging Face open community. It is this openness that makes "watching the robot duck walk in the cloud" and "reproducing the training locally" possible.

### Feetech

Thanks to **Feetech** for providing the HD-1910 serial-bus servo hardware and its official technical documentation. It is this high-value domestic servo that gives MicroDuck a "half the price, 2.5× the torque" domestic alternative, and that gives this book's BAM bench identification a real calibration target.

### fanhao375

Thanks to [@fanhao375](https://github.com/fanhao375) — the **original author** of this project. The reverse-engineering research, assembly drawings, exploded views, hardware analysis, and documentation were initially completed by him (original repository: [fanhao375/microduck-replica](https://github.com/fanhao375/microduck-replica)). This book and its companion repository build on his foundation.

### 机械行者Robo

Thanks to **机械行者Robo** — who organized the SolidWorks drawings, the assembly BOM, and the assembly videos. He made the journey "from parts to a walking robot" genuinely approachable and reproducible.

### kissqy

Thanks to **kissqy** — a key contributor to the Feetech HD-1910 adaptation (training controller, IMU gyroscope fusion, etc.). His controller is subject to personal non-commercial terms; this book and its repository respect that agreement and do not include his controller modifications.

### LuwuDynamics and Rhoban

Thanks to [LuwuDynamics](https://github.com/LuwuDynamics) for sharing the 1910 M6 BAM parameters and companion configuration, which serve as the baseline for this book's simulation training; and thanks to [Rhoban](https://github.com/Rhoban) for open-sourcing the BAM actuator model and identification library, which provides the theoretical tools for servo modeling.

### All Open-Source Community Developers

Thanks to every developer who provided feedback, corrections, and suggestions in GitHub Issues, Pull Requests, and community discussions. The meaning of open source lies precisely in this "many hands" collaboration.

## Build It Together

This book and its companion repository are still young and inevitably contain errors and omissions. With humility, we invite you to make them better:

- If you find errors or unclear wording, please open an [Issue](https://github.com/UnitClaw/microduck-wwduck/issues);
- If you have improvements or additions, please submit a Pull Request;
- If you have reproduced the result successfully or hit pitfalls, please share your experience back with the community.

Please respect the licensing boundaries of each part (code under Apache-2.0, mechanical CAD and documents under CC BY-NC-SA; see NOTICE). **The domestic open-source ecosystem for low-cost bipedal robots needs everyone's participation.** Together, let us make "bringing the robot dream to life" more inclusive and more open.

—— WWNT Robotics

---

> **Copyright and Disclaimer**: The copyright in this book belongs to Guangdong WWNT Robotics Co., Ltd. (Copyright © WWNT Robotics). This book is an open-source engineering-practice record, and some technical material has not been fully validated on physical hardware; WWNT Robotics assumes no responsibility for replication failures, property loss, personal injury, or any infringement dispute arising from unauthorized commercialization. For the complete statement, see the "Copyright and Disclaimer" section of the Preface.
