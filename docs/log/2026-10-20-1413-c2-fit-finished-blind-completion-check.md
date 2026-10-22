---
id: D075
date: 2026-10-20
time: 14:13
kind: reading
title: C2 fit finished: blind completion check (D068 counts only); outputs unread pending the activity-by-zone pre-registration
---
- **2026-10-20 ≈ 14:13 UTC — C2 fit finished: blind completion check (D068 counts only); outputs unread pending the activity-by-zone pre-registration.**
  - **Run state** (`npm run runs -- --box`, from files): `c2fit-20261018T210632Z` **ok**, elapsed 37 h 07 m (D044 /
    D071 projected ≈ 28 h), so it ended ≈ 2026-10-20 10:13 UTC. Box idle since (no `vite-node` process).
  - **D068 counts** over `logs/c2/fit.log`, printed on the box, ≈ 14:13 UTC: (a) generation lines with a non-finite
    `best` 0, (b) a generation line exists: yes, (c) lines matching error / exception 0, (d) checkpoint mtime
    2026-10-20 10:13:34 UTC (consistent with the end time). Healthy by D068's rule. Also printed: whether
    `data/fits/s2018-motion-c2.json` exists (yes; not opened, size not listed).
  - **Seen:** nothing else. No loss, generation count, phase or start label, stop reason, σ, estimate or parameter
    value was printed. Known beyond the counts: the run length, which says the fit used more generations than
    "a switch fired early" would need (no loss or stop reason inferred from it). Disclosed for the activity-by-zone
    pre-registration.
  - **Next (RESUME):** the activity-by-zone pre-registration is logged and approved before any C2 output is read;
    then the whole-model judgment of D041 / D042 on fresh seeds. The fit JSON stays on the box until then.
