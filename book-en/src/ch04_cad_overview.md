# HD1910 CAD Model Analysis

> Learning objectives: understand the mechanical structure of the `microduck-replica-cad` repository, grasp the part differences between the two servo versions, and learn to export the full-assembly STEP, preparing for the automated Onshape MJCF export in Automated Onshape→MJCF Modeling.

## 3.1 Repository Structure Overview

The mechanical CAD drawings live separately in `fanhao375/microduck-replica-cad`:

```
microduck-replica-cad/
├── feetech/          # Feetech HD1910 assembly + all parts
│   ├── microduck_feetech.SLDASM    # full-machine assembly
│   └── ... *.sldprt                 # individual parts
├── xl330/            # original Dynamixel XL330 version
│   ├── microduck_xl330.SLDASM
│   └── ... *.sldprt
└── stl/              # ready-to-print STL files
```

> Key distinction: **parts are not interchangeable between the two servo versions**. The Feetech HD1910 and the original Dynamixel differ in outline, mounting-boss orientation, and output-shaft position. When printing, you must select parts from the matching version to avoid discovering a mismatch during assembly.

## 3.2 The Robot Duck's Mechanical Topology

MicroDuck is a bipedal robot. Each leg roughly contains:

| Joint | Description | Count (per leg) |
|---|---|---|
| Hip | allows forward/backward swing and lateral opening (pitch/roll/yaw combination) | 3 |
| Knee | allows shank flexion/extension (pitch) | 1 |
| Ankle | allows foot pitch and roll | 2 |

The whole machine has **14–15 servos** (some replicas add degrees of freedom at the tail or head); the exact count and limits follow your CAD assembly tree.

## 3.3 Mapping the Kinematic Tree (Preparing for MJCF)

When exporting MJCF in Automated Onshape→MJCF Modeling, you must tell Onshape/onshape-to-robot **which parts are links and which joints are actuated**. This must be clarified in advance. The recommended kinematic tree (for 14 DOF):

```
base(torso/base)
 ├── thigh_right  (hip pitch) ── knee_right(knee) ── ankle_right(ankle)
 └── thigh_left   (hip pitch) ── knee_left (knee) ── ankle_left (ankle)
```

> The hip roll/yaw usually sit between the torso and the thigh; if your assembly places roll/yaw after hip pitch, the joint hierarchy in the exported MJCF must match reality one-to-one, or the simulation will error out immediately.

## 3.4 Exporting the Full-Assembly STEP

The `microduck-replica-cad` repository uploads SolidWorks source files (`.sldasm`/`.sldprt`) by default and **does not provide a pre-packaged STEP**; you must export it manually:

1. Open `feetech/microduck_feetech.SLDASM` in SolidWorks;
2. Choose "File → Save As";
3. Select file type **STEP AP214** (recommended, best compatibility);
4. Save as `microduck_feetech.step`.

> No SolidWorks? The free, open-source **FreeCAD** can open `.sldasm` and export STEP, but FreeCAD's compatibility with SolidWorks assembly constraints is limited; some constraints may be lost, so verify assembly integrity before exporting.

## 3.5 Three Checks Before Exporting STEP

1. **Assembly hierarchy must not collapse**: confirm parts are not all flattened to the root node, or the exported MJCF joint hierarchy will be scrambled;
2. **No over- or under-constrained mates**: assembly constraints must be complete, or joint positions will drift after importing the STEP into Onshape;
3. **Servo mounting orientation is correct**: the HD1910's mounting-boss orientation must match the thigh/shank parts — this is the most error-prone point between the two versions.

## 3.6 Engineering Pitfall Log

1. **Ankle joint seizure**: a classic replica problem. After 3D printing, the servo horn interferes with adjacent structure, restricting rotation or seizing it. Check the horn-to-shell clearance in CAD, and if necessary correct the assembly interference in the STEP source and widen the clearance.
2. **Part walls too thin**: some structural parts have insufficient wall thickness and fracture under load after printing. Thicken load-bearing regions or raise the infill ratio.
3. **Printing the wrong part**: downloading both the feetech and xl330 STL sets and selecting the wrong version during printing leads to assembly failure. Print by directory and version labeling.

## 3.7 Chapter Summary

You should now be able to:

- Locate the correct Feetech-version parts in `microduck-replica-cad`;
- Understand MicroDuck's kinematic tree (preparing for MJCF joint definitions);
- Export the full-assembly STEP AP214 from SolidWorks.

> In the next chapter, import this STEP into Onshape and use `onshape-to-robot` to auto-generate an MJCF model with accurate inertia parameters — no more manual estimation.
