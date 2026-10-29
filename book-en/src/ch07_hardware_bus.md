# Hardware Circuits and the TTL Bus

> Learning objectives: build MicroDuck's electrical system — power, servo bus communication, and IMU integration — and master the most common troubleshooting (servo packet loss, communication timeouts, over-current protection).

## 6.1 System Electrical Architecture

```
lithium battery → BMS → power distribution
                  ├─ RK3566 mainboard (5V/3.3V logic)
                  ├─ IMU (I2C/SPI)
                  └─ servo bus (TTL, 15 HD1910 daisy-chained)
```

> Key point: **servo power and mainboard logic power must be separated**. When 15 servos move simultaneously the current is large; if they share a power supply with the mainboard (even with a common ground), the mainboard voltage drops and it resets.

## 6.2 Power Scheme and BMS

- **Battery**: 2S (7.4 V) or 3S (11.1 V) lithium; servos are rated 4.8–8.4 V, so 2S is safer;
- **BMS**: must include **low-voltage protection** and **over-current protection**. At low voltage, servo torque drops sharply and position readback drifts, destabilizing the policy; over-current burns the servo drivers;
- Consider adding **power soft-start** (inrush limiting) to avoid the inrush of charging capacitors at power-on disturbing the bus.

## 6.3 The Feetech HD1910 TTL Bus Topology

Fifteen servos are **daisy-chained** on the TTL bus, each with a unique ID:

```
mainboard UART(TTL) ── HD1910 ID=1 ── ID=2 ── ... ── ID=15
```

- Baud rate: up to 1 Mbps; start debugging at a lower rate (e.g., 500 kbps);
- Half-duplex TTL: transmit and receive share a line, requiring direction control on the mainboard side;
- Each servo must be configured with its ID and baud rate first; **ID conflicts scramble the entire bus**.

## 6.4 IMU Integration and Mounting

- Models: MPU6050 / ICM20948;
- Interface: I2C or SPI; I2C bandwidth is limited, so prefer SPI for higher sample rates;
- **Mounting position**: as close to the machine's center of mass as possible, on a rigid part of the torso;
- **Mounting tilt**: the IMU's mounting attitude enters the attitude-estimation initial value. If it is mounted with a tilt, it must be compensated in firmware; otherwise the attitude angle drifts directly and Sim2Real fails.

## 6.5 Bus Troubleshooting

| Symptom | Likely cause | Handling |
|---|---|---|
| A servo does not respond | ID conflict / wrong address | reconfigure the ID |
| Random packet loss | long bus, signal interference | lower the baud rate, add bus isolation |
| Bus freezes after power-on | insufficient power / a shorted servo | power up one servo at a time |
| Position readback drift | supply voltage sag | check BMS and wire gauge |

> ⚠️ Long-line interference: with 15 daisy-chained servos and long cables, TTL signals are easily affected by EMI. Use shielded cable or add bus-isolation chips. This is the most easily overlooked pitfall from simulation to hardware.

## 6.6 Wiring Convention for Power/Signal Separation

1. Servo power wires (thick) come directly from the BMS, not through the mainboard;
2. The mainboard and servos share only a **signal ground**; logic levels are driven by the mainboard;
3. Place a **current-limiting resistor/fuse** in series at the servo-bus end to protect the mainboard UART.

## 6.7 Engineering Pitfall Log

- **Shared power causing mainboard reset**: current spikes during multi-servo emergency stops pull down the mainboard voltage and reboot the system. Fixed by separating the power supplies.
- **ID conflict paralyzing the whole bus**: two servos configured with the same ID scramble every command. Recovered by powering each servo individually and reconfiguring its ID.

## 6.8 Chapter Summary

You should be able to build an electrical system with **separated power, a correct bus, and the IMU integrated**, and to troubleshoot servo packet loss and power faults.

> The next chapter brings the system up: flash the RK3566 image, deploy the Rust firmware, and understand the 50 Hz control loop.
