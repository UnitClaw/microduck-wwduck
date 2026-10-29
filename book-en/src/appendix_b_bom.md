# BOM Procurement List

> Complete bill of materials, with recommended procurement channels and alternative substitutes. Prices are reference only and fluctuate with the market.

## B.1 Core Electronics

| Part | Spec | Qty | Reference unit price | Procurement advice |
|---|---|---|---|---|
| Servo | Feetech HD1910 (dual-shaft magnetic-encoder TTL) | 14–15 | low–mid | Feetech official / authorized distributor |
| Mainboard | RK3566 board | 1 | mid | authorized channel |
| IMU | MPU6050 / ICM20948 | 1 | low | generic module |
| Battery | 2S/3S lithium | 1 | low | pair with BMS |
| BMS | lithium protection board | 1 | low | with low-voltage / over-current protection |

## B.2 Structure and Fasteners

| Part | Spec | Qty | Notes |
|---|---|---|---|
| 3D-printed parts | PLA | 1 set | 20%–40% infill |
| M2 screws | several | servo-horn fastening |
| M3 screws | several | structural fastening |
| Washers / bearings | several | friction reduction, positioning |

## B.3 Wiring and Miscellaneous

| Part | Notes |
|---|---|
| Servo TTL bus cable | daisy-chains 15 servos; use shielded cable to reduce interference |
| Thick power wire | servo power, from BMS |
| Cable ties / heat-shrink | wiring fixation |

## B.4 Tiered Procurement Advice

Three tiers by budget:

| Package | Contents | Purpose |
|---|---|---|
| Minimal simulation package | GPU computer only | run simulation, no hardware needed |
| Hardware-in-the-loop package | RK3566 + IMU + a few servos | validate bus / calibration |
| Full machine package | full BOM | complete assembly and deployment |

> It is recommended to first procure the **hardware-in-the-loop package** to validate bus communication and calibration, then move to the full machine, reducing one-time investment risk.

## B.5 Cost Comparison (Reference)

| Plan | Main cost |
|---|---|
| Original MicroDuck | 399 USD + forwarding/customs |
| Domestic Feetech full machine | servo + board + printing + misc., significantly lower |

> The domestic solution's core value is **low cost + domestic supply + controllability**; concrete numbers fluctuate with procurement channels, and the book's main text defers to actual purchases.
