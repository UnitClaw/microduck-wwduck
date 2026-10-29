# Outlook and Future Directions

> Learning objectives: point readers to the advanced paths beyond MicroDuck — hardware upgrades, algorithm advances, and commercialization boundaries. This chapter is an open outlook, not a full implementation.

## 18.1 Hardware Upgrade Directions

| Direction | Description |
|---|---|
| Higher-compute boards | RK3588 / edge GPUs, supporting high-resolution vision + RL in parallel |
| Depth cameras | integrate RGB-D for dense perception and obstacle avoidance |
| Hand end-effectors | add degrees of freedom and explore grasping/manipulation |
| Higher-performance servos | switch to higher torque/bandwidth bus servos to extend load capacity |

> Upgrade note: changing servos changes the whole-machine dynamics; MJCF inertia and BAM parameters must be re-calibrated (return to Automated Onshape→MJCF Modeling and BAM Actuator Modeling and Identification).

## 18.2 Algorithm-Advance Directions

### 18.2.1 Online Adaptation

Fine-tune the policy on hardware using real-time data to further shrink the Sim2Real gap:

- residual policy: simulation learns the baseline, hardware learns the correction;
- online domain adaptation: update dynamics assumptions in real time.

### 18.2.2 Multi-Modal Perception Policies

- fuse vision + proprioception, moving toward vLA (vision-language-action);
- use spatial VLMs to guide arm/body motion and achieve semantic-level tasks.

> This is the "embodied intelligence" direction; its workload and research depth far exceed the book's main chain, and it is offered as an advanced topic.

## 18.3 Performance Evaluation and Benchmarking

Establish a quantitative metric system and compare against the original Pollen MicroDuck:

- walking speed;
- disturbance robustness;
- fall-recovery success rate;
- energy consumption.

> The comparison data can serve as material for an upgraded edition or a paper, validating the competitiveness of the domestic Feetech solution.

## 18.4 Commercialization Boundaries (Important Compliance Reminder)

1. **Software is commercializable**: the Apache 2.0 training/firmware code may be used commercially;
2. **CAD is not commercializable**: the CC BY-NC-SA mechanical models prohibit commercial use — **a clean independent design is required**;
3. **Brands and trademarks**: do not misuse the Pollen/MicroDuck trademarks;
4. For a commercial product, independent design + self-developed software are required, independent of the open-source CAD models.

> This is consistent with the licensing boundaries in Engineering Practices and Open-Source Compliance. Commercialization is a direction, but it must be built on compliant reconstruction.

## 18.5 Community Collaboration and Continuous Iteration

- maintain `docs/engineering_log/`, recording every pitfall;
- keep Issues / PRs open and iterate with the community;
- keep the manuscript and repository in sync so readers can reproduce every version.

## 18.6 Chapter Summary

The book's main chain (mechanics → simulation → training → hardware closed loop) is now complete. This chapter points to advanced directions: hardware upgrades, algorithm adaptation, performance benchmarking, and compliant commercialization.

---

*This concludes the nineteen chapters across six parts. Appendices A–E provide the code inventory, BOM, troubleshooting handbook, glossary, and references.*
