---
id: D012
date: 2026-10-17
time: 14:45
kind: reading
title: Test-B model control read (reference only, 13:53 / 13:54 design; no reading rule was fixed for it)
---
**2026-10-17 ≈ 14:45 UTC — Test-B model control read (reference only,
13:53 / 13:54 design; no reading rule was fixed for it).** Box run
14:29–≈ 14:40 UTC, `logs/tb/run-tb.sh`, start point, 22 colonies, light
and dark, 12 h, same `scratch/contactOnset.ts` recorder and simulated
observer as the data; `python3 -I scripts/scratch/tbAgg.py
'logs/tb/tb-ctl-*-c*.json'`. Data figures (14:02) rerun with the same
aggregator for like-for-like units.
- **(1) exposed vs matched unexposed:** light M = 1 RR **0.93** [0.89,
  0.96], −0.12 pp; M = 2 0.93 [0.87, 0.97]; M = 4 0.94 [0.80, 1.06]. Dark
  M = 1 **0.88** [0.84, 0.91], −0.20 pp; M = 2 0.87; M = 4 0.89. Data:
  2.97 / 3.33 at M = 1.
- **(3) contact vs matched close pass:** light 1.00 / 1.08 / 1.13 (M = 1
  / 2 / 4), dark 0.97 / 1.02 / 1.18. Data 1.63 / 1.30 / 1.10 and 1.91 /
  1.47 / 1.35.
- **(2) time course (M = 2, per 1000 at risk; the 14:02 entry's per-10⁴
  figures are the same quantity):** contact and pass hazards sit at or
  below the null on both sides of the event (light −4…−2 ≈ 0.6–0.8,
  +1…+4 ≈ 1.0–1.1; null 0.7–1.0 / 1.2–1.3). The model's hazard level is
  ≈ 4–5× the data's (data ≈ 0.1–0.3), and it has ≈ 5× as many eligible
  sustained onsets (123 292 vs 23 918 light): the same direction as the
  known stillness mismatch, not read further here.
- **(4)** sustained onsets preceded by a contact within 2 s: 2.1 % light,
  2.0 % dark (data 5.5 / 4.3 %); excess share ≈ 0. **(5)** direction:
  contact mean cos −0.05 / −0.13, pass +0.15 / +0.12 (supporting only).
- **Reading (descriptive):** the recorder and observer applied to the
  model's motion give no association (RR slightly below 1), so the data's
  RR ≈ 3 is not an artefact of the shared code path at this geometry.
  This does not change the 14:02 reading: the data's pre-contact
  elevation still prevents a causal reading, and a model with no
  fluctuating activity state is expected to show none. Not repeated with
  the latent-state arm (L3): that would be a new comparison and needs the
  user. No arm follows from this.
