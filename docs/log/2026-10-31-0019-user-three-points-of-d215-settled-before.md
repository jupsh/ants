---
id: D216
date: 2026-10-31
time: 00:19
kind: decision
title: User: three points of D215 settled before the item 1(b) read (D212 amendment 2): balance on the SD pooled over blocks; a 100-seed synthetic calibration of the pre-event-rise label first, a type above 5 % reported uncalibrated; a descriptive row with controls at least 5 min from any same-type event, the primary rule unchanged
authority: user
scope: T035
---
- **2026-10-31 ≈ 00:19 UTC — User: three points of D215 settled before the item 1(b) read (D212 amendment 2): balance on the SD pooled over blocks; a 100-seed synthetic calibration of the pre-event-rise label first, a type above 5 % reported uncalibrated; a descriptive row with controls at least 5 min from any same-type event, the primary rule unchanged.**
  - **User (dialog answers to the lead's questions, each the lead's recommended option):**
    - Balance SD: "Pooled over blocks (Recommended)". The per-block version stays descriptive.
    - Rise label: "Calibrate first (Recommended)": run 100 null seeds and report the label's false-positive rate per
      event type with the reading. If it is above 5 % for a type, that type's rise label is reported as uncalibrated
      rather than read.
    - Controls near other events: "Add a descriptive row (Recommended)": keep the primary rule as frozen, and add a
      descriptive sensitivity (no class) using only controls at least 5 min from any same-type event, beside the
      isolated-event row.
  - **Effect:** frozen as D212 amendment 2 before any event-aligned value is computed or seen. The calibration runs on
    synthetic data only and is started by the lead (`run.sh`).
