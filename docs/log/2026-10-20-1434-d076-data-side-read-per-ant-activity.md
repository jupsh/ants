---
id: D079
date: 2026-10-20
time: 14:34
kind: reading
title: D076 data side read: per-ant activity persistence is mostly not spatial (both groups); active ants rest in less occupied places
---
- **2026-10-20 ≈ 14:34 UTC — D076 data side read: per-ant activity persistence is mostly not spatial (both groups); active ants rest in less occupied places.**
  - **Run:** `nice -n 10 npx vite-node scripts/stroeymeytRestPosition.ts` (22 fit colonies, PreTreatment, development
    use; ≈ 3 min) → `data/reference/stroeymeyt2018-rest-position.json` (stamped, simHash `88f9271e1dc0755a`). Summary and
    readings in `scripts/restLib.ts` (colony bootstrap 2000, seed 76; percentile 95 % CI; bootstrap SD as SE).
  - **Check (D076):** z_full on the full D043 ant set reproduces `persist.<group>.light` exactly, every colony (the
    script stops otherwise); across colonies 0.791835 (nurses, 22) and 0.730128 (foragers, 20), equal to the reference
    rows. No ant lacked a rest position (all eligible ants have ≥ 600 still step-frames), so the analysis set is D043's.
  - **Readings, mechanically by D076:**

    | group | S | z_full | z_part | z_E | persistence | activity level |
    |---|---|---|---|---|---|---|
    | nurse (22 col.) | 0.047 [0.016, 0.080] | 0.792 [0.711, 0.874] | 0.755 [0.676, 0.834] | −0.211 [−0.306, −0.121] | **mostly not spatial** | **varies with rest position** |
    | forager (20 / 21) | 0.087 [0.046, 0.143] | 0.730 [0.620, 0.846] | 0.666 [0.546, 0.796] | −0.335 [−0.420, −0.240] | **mostly not spatial** | **varies with rest position** |

    Back-transformed: persistence r 0.66 → 0.64 (nurses), 0.62 → 0.58 (foragers) given rest position; z_E r −0.21 and
    −0.32: more active ants rest where still occupancy is lower.
  - **What it means for C2's reading (D076 model side, still to come):** D076's "C2 carries as per-ant activity what
    the data share with rest position" reading needs the data to read "mostly shared" or "partly spatial". The data
    read "mostly not spatial", so that reading cannot arise. The model side can only read "reproduces how much is
    spatial" (|z| ≤ 2), "more spatial than the data" (z ≥ 2), or the case D076 left without a label (z ≤ −2 against
    "mostly not spatial"). z_E and z_part stay descriptive.
  - **Disclosed:** the E map uses D043's observed history (first read of a repeated tag kept), not B018's 0.12-mm
    duplicate rule, so the data side shares one code path with the activity rows. Shared variance only; cause not
    identified (D076). Finding F067.
