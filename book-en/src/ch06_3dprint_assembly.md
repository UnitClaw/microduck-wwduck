# 3D Printing, Assembly, and Tolerances

> Learning objectives: turn the CAD drawings into a robot duck that can move. Includes the full BOM, print parameters, assembly order, tolerance control, and the post-assembly weighing procedure (used for MJCF calibration in Automated Onshape→MJCF Modeling).

## 5.1 Complete BOM

| Category | Part | Spec / quantity | Notes |
|---|---|---|---|
| Actuator | Feetech HD1910 | 14–15 units | dual-shaft magnetic-encoder TTL bus servo |
| Mainboard | RK3566 board | 1 | runs ONNX inference + Rust firmware |
| Sensor | IMU (MPU6050/ICM20948) | 1 | attitude estimation |
| Power | lithium battery | 1 | 2S or 3S, requires BMS |
| Power management | BMS protection board | 1 | low-voltage and over-current protection |
| Structure | 3D-printed parts | 1 set | PLA, see 6.2 |
| Fasteners | M2/M3 screws | several | servo horn and structure fastening |
| Wiring | servo TTL bus cable | several | daisy-chains 15 servos |
| Misc. | washers, bearings | several | friction reduction, positioning |

> Procurement advice: servos, board, and IMU are critical parts — prefer authorized channels; fasteners and wiring can be sourced locally. The BOM Procurement List lists recommended channels and alternative substitutes.

## 5.2 3D Printing Parameters

| Parameter | Recommended | Notes |
|---|---|---|
| Material | PLA | easy to print, low cost |
| Layer height | 0.2 mm | balances speed and precision |
| Infill | 20%–40% | 40% for load-bearing parts, 20% for light parts |
| Supports | as needed | overhangs require supports |
| Print orientation | vertical for axially loaded parts | improves strength |

> ⚠️ The print infill ratio directly changes the machine's dynamics! 20% and 40% infill have different equivalent densities and will introduce error during MJCF calibration in Automated Onshape→MJCF Modeling. **Be sure to record the infill ratio of every printed batch**, and use the matching equivalent density during MJCF calibration.

## 5.3 Step-by-Step Assembly Order

1. **Test one leg first**: print and assemble a single leg (hip, knee, ankle) to validate servo fit, range of motion, and horn fastening;
2. **Torso assembly**: mount the IMU and mainboard in the torso and route wiring;
3. **Join both legs**: assemble both legs to the torso base and confirm left-right symmetry;
4. **Daisy-chain the bus**: connect the TTL bus in servo-ID order to avoid ID conflicts;
5. **Whole-machine power-on test**: before loading any gait, verify each servo can rotate independently and read back position.

> Strong recommendation: **do not print the full part set at once**. Print a single leg to validate the design first, then the whole machine, to avoid scrapping an entire batch due to a design defect.

## 5.4 Tolerance Control Essentials

| Region | Tolerance requirement | Handling |
|---|---|---|
| Servo horn and output shaft | interference fit | leave assembly allowance when printing |
| Bearing-seat holes | fit precision | ream or shim as needed |
| Servo mounting holes | alignment | check hole-position differences between the two servo versions |

3D printing itself has ±0.1–0.3 mm shrinkage error; complex assemblies should reserve clearance, or compensate with **shims/bearings**.

## 5.5 Post-Assembly Weighing (for Simulation Calibration)

A key to Sim2Real success: **the simulated mass must match the real machine**. After assembly:

1. **Weigh the whole machine**: record the total mass;
2. **Weigh by part**: disassemble each thigh, shank, and torso and weigh them individually on a 0.01 g scale;
3. **Record to `data/cad_weigh_records/`**:

```csv
part,target_cad_mass_kg,measured_mass_kg,fill_ratio
thigh_right,0.042,0.038,20%
knee_right,0.020,0.019,40%
...
```

4. Compare against the Onshape-computed CAD mass from Automated Onshape→MJCF Modeling; if the error exceeds 5%, return to Onshape to fine-tune part densities and re-export MJCF.

## 5.6 Common Assembly Problems and Troubleshooting

| Symptom | Likely cause | Handling |
|---|---|---|
| Servo horn slipping | insufficient interference fit | use a tighter horn or adhesive |
| Wiring interference | wiring not routed along structure | re-route and tie with cable ties |
| Center-of-mass shift | asymmetric assembly | check left-right part consistency |
| Joint seizure | print interference / insufficient clearance | correct CAD per 4.6 |

## 5.7 Chapter Summary

Completing this chapter, you should have a robot duck that is **mechanically correctly assembled, with the bus daisy-chained and every servo independently rotatable**, along with measured mass data for the whole machine and each link.

> The next chapter enters the hardware circuits and TTL bus system, resolving the low-level issues of servo communication and power.
