# Automated Onshape→MJCF Modeling

> This chapter is the book's core innovation: replacing the original replica's manual inertia-entry approach with a full reproduction of Pollen's CAD→MJCF automated pipeline, which computes each link's mass, center of mass, and inertia tensor automatically.
> Companion scripts: `scripts/cad2mjcf/export_mjcf.py` + `onshape_config.json`.

## 4.1 The Pain Point: Why Manual Inertia Estimation Fails

The original microduck-replica MJCF model estimates link mass, inertia, and center of mass by hand. The simulated gait looks perfect, but deploying to hardware causes immediate tipping — the root cause is exactly that **the dynamics model does not match the real robot (the Sim2Real gap)**.

Pollen's original MicroDuck solution: SolidWorks assembly → import into Onshape, assign part densities → onshape-to-robot automatically exports MJCF, computing inertia tensors from geometry. This book reproduces that pipeline in full, adapted for the domestic HD1910 servo.

### 4.1.1 The Full Workflow Chain

`STEP assembly → Onshape import → assign part densities → servo-mass override config → onshape-to-robot export of STL meshes + MJCF → automatic MJCF validation → replace the simulation robot XML`

## 4.2 Onshape Prerequisites

1. Import the full-assembly STEP into an Onshape document;
2. Assign each 3D-printed part a PLA-equivalent density: `1240 kg/m³`;
3. For HD1910 servo parts, **do not compute mass from geometry**; force-override the mass to 21 g in the config;
   > A servo's internal coreless motor, magnetic encoder, and gear train are structurally complex, so geometry-derived mass is inaccurate; the manufacturer's nominal weight must override it.
4. In the Onshape assembly, define the joints (revolute), and record the joint IDs, rotation directions, and physical limits.

### 4.2.1 PLA Equivalent-Density Reference

| Infill ratio | Equivalent density (g/cm³) |
|---|---|
| 20% | 0.35–0.45 |
| 40% | 0.6–0.7 |
| Solid PLA | ~1.24 |

### 4.2.2 Preparing Onshape API Keys

Apply for Onshape API keys so the script can remotely read the assembly geometry:

- Onshape personal account → developer console → create an API key;
- Export two environment variables:

```bash
export ONSHAPE_ACCESS_KEY="your_access_key"
export ONSHAPE_SECRET_KEY="your_secret_key"
```

> Do not commit the keys to Git; add them to `.gitignore`.

## 4.3 Configuration File Walkthrough: onshape_config.json

Path: `scripts/cad2mjcf/onshape_config.json`

```json
{
  "url": "https://cad.onshape.com/documents/[document-id]/w/[workspace-id]/e/[assembly-id]",
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

- `units: meters`: MuJoCo enforces SI units (meters, kilograms, seconds);
- `limits` are in radians and must match the HD1910 mechanical hard stops exactly, preventing joint overtravel in simulation;
- `override_mass`: force-overrides the servo mass, taking precedence over geometry-derived values.

## 4.4 One-Command MJCF Export: export_mjcf.py

Path: `scripts/cad2mjcf/export_mjcf.py`

Script logic:

1. Read the JSON config;
2. Call the `onshape-to-robot` library to access Onshape remotely and export STL meshes and MJCF;
3. Auto-invoke the MJCF validation script after export;
4. On validation success, prompt to copy `robot.xml` to the simulation assets directory.

### 4.4.1 Execution Command

```bash
python scripts/cad2mjcf/export_mjcf.py --config scripts/cad2mjcf/onshape_config.json
```

Normal output:

```
=== Starting onshape-to-robot MJCF export ===
✅ Export complete, validating MJCF model
✅ MJCF loaded successfully, link count: 16
✅ Total mass: 0.726 kg
✅ Basic MJCF validation passed

✅ All done! MJCF path: scripts/cad2mjcf/output/robot.xml
Tip: copy this robot.xml to software/training/assets/robots/microduck_feetech.xml
```

## 4.5 What the Validation Script Does (validate_mjcf.py)

1. Load the MJCF model and read the link count;
2. Compute the total machine mass;
3. Iterate over every link and check that the inertia tensor is positive-definite (ixx, iyy, izz must all be > 0);

> A non-positive-definite inertia tensor causes numerical instability and simulation explosion in MuJoCo.

## 4.6 The Closed-Loop Iteration (new in this book; absent from the original replica)

> Exporting MJCF from CAD is only the first step. The complete loop:
> 1. Export the initial MJCF from Onshape;
> 2. Run the standing demo in simulation and observe center-of-mass stability;
> 3. 3D-print the parts, weigh them individually, and record in `data/cad_weigh_records/`;
> 4. Compare the CAD-computed mass against the real weight;
> 5. Fine-tune part densities in Onshape and re-export MJCF;
> 6. Iterate until the CAD-computed vs. measured mass error is < 5%.

## 4.7 Engineering Pitfall Log

1. Unit error: Onshape uses millimeters; exporting without converting to meters scales the model by 1000× and crashes the simulation immediately;
2. Joint limits entered in reverse, driving the simulated joint in a physically forbidden direction;
3. Servo without `override_mass`: geometry-derived mass is too small, shifting the simulated center of mass upward;
4. Broken STL mesh faces, causing MuJoCo collision-detection errors.

## 4.8 Chapter Summary

This chapter automates dynamics modeling, no longer relying on empirically estimated inertia.

But robot simulation needs more than rigid-body dynamics — it also needs the **servo model**. The next chapter introduces the BAM servo model and fits its parameters using HD1910 bench measurements.
