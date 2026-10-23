---
id: D123
date: 2026-10-23
time: 17:41
kind: decision
title: User: run the data side of S5 / S6 and the descriptive placement as planned (option 1); what follows Part C decided after
---
- **2026-10-23 ≈ 17:41 UTC — User: run the data side of S5 / S6 and the descriptive placement as planned (option 1); what follows Part C decided after.**
  - **Context:** D122 logged the screen (neither calibrated driver sufficient; separation not evaluable, no P variant
    calibrated, D121). The data side of S5 / S6 was withheld until then (D115 amendment 1).
  - **Decision (user):** option 1. Compute S5 / S6 on the 22 fit colonies' tracks, with the fixed definitions (D115
    amendment 1, D117; S5 radius 4.1 mm, D119): `scripts/scratch/s5Data.ts --after-screen --colony i` →
    `logs/short/s5data-c<i>.json`. Then `partC.ts read --stage place` → `logs/partc/place.json`.
    - Placement is **descriptive only**: no signature was screened, and the P range is empty. Each row is reported as
      the data value with its 95 % colony-bootstrap CI beside the E range (Eu ∪ El20) and the base arm. No P-like / E-like
      class is possible.
    - S5 and S6 are new definitions, so their data reading is exploratory (D115 limits).
  - **Deferred:** what follows Part C (the follow-up built around the distance profile) needs a new design, then the
    user's approval.
  - **Also (user):** commit the work since the last push (box tooling, D121–D123, F085, F086, and this reading) once it is done.
