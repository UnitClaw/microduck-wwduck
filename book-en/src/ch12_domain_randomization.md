# Domain Randomization

> Learning objectives: understand the principle of domain randomization, learn to extend the randomization parameter set, and combine it with curriculum learning to progress from standing to walking and climbing.

## 11.1 Why Domain Randomization Is Needed

A simulation model can never reproduce hardware with 100% accuracy. Print infill, servo-parameter error, and ground-material differences all cause "walks in simulation, falls on hardware." **Domain randomization** addresses this by randomly perturbing simulation parameters during training, so the policy "sees" a wide range of possible conditions and becomes robust to model error.

Pollen's original achieves product-grade Sim2Real through domain randomization (distinguishing flat and rough terrain). The replica project's baseline randomization is too small and must be extended.

## 11.2 The Extended Domain-Randomization Parameter Set

Extend the `domain_rand` section of `software/training/train_ppo.py`:

```python
domain_rand = {
    "mass_scale": [0.85, 1.15],          # link mass ±15% (covers print-infill differences)
    "friction_scale": [0.7, 1.3],         # friction coefficient ±30%
    "actuator_torque_scale": [0.8, 1.2],  # servo max torque ±20%
    "bandwidth_noise": [18, 26],          # servo bandwidth randomized 18–26 Hz
    "backlash_noise": [0.001, 0.004],     # backlash random perturbation
    "imu_noise_std": [0.002, 0.008],      # IMU noise randomization
    "ground_friction": [0.4, 1.2],        # ground friction (carpet / wood floor)
    "gravity_noise": [0.98, 1.02]         # small gravity perturbation
}
```

> **Mass randomization `mass_scale` is especially important**: it covers whole-machine mass variation caused by 3D-print infill changes (see Automated Onshape→MJCF Modeling and 3D Printing, Assembly, and Tolerances).

## 11.3 Wiring Domain Randomization into the Code

On each environment `reset()`, sample the random parameters once from their distributions and apply them to every step of that episode:

```python
def reset(self):
    # sample this episode's randomization parameters
    self.rand = {
        k: np.random.uniform(*v) for k, v in domain_rand.items()
    }
    # apply to the model: scale mass, friction, etc.
    self.model = self.apply_domain_rand(self.model, self.rand)
    return self.get_obs()

def apply_domain_rand(self, model, r):
    # actually modify the MuJoCo model parameters
    model.body_mass *= r["mass_scale"]
    # friction, torque, etc. handled similarly
    return model
```

## 11.4 Curriculum Learning

Full-parameter randomization alone can leave the policy "learning nothing." Curriculum learning progresses from easy to hard, improving convergence stability and final performance:

| Stage | Task | Randomization intensity |
|---|---|---|
| 1 | stand in place | low |
| 2 | squat in place | low |
| 3 | low-speed walking | medium |
| 4 | walking on rough ground | medium |
| 5 | turning | medium |
| 6 | climbing | high |

The curriculum advances automatically: once the policy reaches a success-rate threshold on the current stage, the difficulty is raised.

## 11.5 Reward Smoothing Terms

Beyond domain randomization, the reward function must also suppress jitter. Add an action-smoothing penalty to discourage violent output jumps:

```python
action_smooth_penalty = -0.05 * torch.sum(torch.square(next_action - prev_action), dim=-1)
reward = reward + action_smooth_penalty
```

## 11.6 Ablation Study Design (recorded in the book)

To quantify the value of domain randomization, design an ablation:

- Plan A: **no** domain randomization;
- Plan B: mass-only randomization;
- Plan C: full-parameter domain randomization.

Compare the three on hardware transfer success, and record the results in the appendix experiment data. Expected: C > B > A, with a significant gap especially in walking scenarios.

## 11.7 Engineering Pitfall Log

- **Over-strong randomization prevents convergence**: starting with large full-parameter randomization, the policy cannot learn to stand. Start with low intensity and increase gradually (paired with curriculum learning).
- **Mass randomization not taking effect**: the randomization code is not wired to the MuJoCo model — the parameter changed but the simulation didn't. Use a validation script to confirm `body_mass` is actually modified.

## 11.8 Chapter Summary

You have mastered: extending the domain-randomization parameter set, wiring it into the reset logic, curriculum progression, and reward smoothing.

> The next chapter assembles all of this into PPO multi-task training: from standing to walking, turning, and climbing, all supported by a single policy.
