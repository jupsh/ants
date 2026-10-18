---
id: D032
date: 2026-10-17
time: 21:26
kind: reading
title: Before designing the wall rule: data anchors for the guard, and a further Q qualification (descriptive; found by Claude, not yet put to the user)
---
**2026-10-17 ≈ 21:26 UTC — Before designing the wall rule: data
anchors for the guard, and a further Q qualification (descriptive;
found by Claude, not yet put to the user).** Data side for oracle
correction done: `tmpShortData` rerun identical to the backups in 22 / 22
colonies apart from the new forager key. Exits on recorded tracks with
the `tmpShortSim` counter (`scratch/exitsData.ts`, `logs/q/exits-data-*`);
moving fraction of the data from comparison X's per-ant series (same
step definition). Geometric means over colonies, light / dark:

| | data | baseline | W | W+E(0.25) | W+E(1.0) | W+S(3) |
|---|---|---|---|---|---|---|
| exits / in-nest ant-h | 0.204 / 0.202 | 0.348 / 0.356 | 0.238 / 0.243 | 0.170 / 0.170 | 0.146 / 0.147 | 0.200 / 0.205 |
| moving fraction | 0.0241 / 0.0176 | 0.0265 / 0.0264 | 0.0292 / 0.0292 | 0.0084 / 0.0084 | 0.0025 / 0.0024 | 0.0171 / 0.0174 |

- **The guard was anchored to a baseline that is itself off:** baseline
  exits 1.7–1.8× the data's (this counter counts every observed in →
  out transition, so entrance excursions and boundary flicker are
  included on both sides), moving fraction 1.10 / 1.50×, and no light /
  dark activity contrast (data 1.37×, model 1.00). **W moves exits
  toward the data (1.16–1.20×) and moving fraction away (1.21 /
  1.65×).**
- **Further Q qualification (an omission in the 16:19 design: the guard
  covered W only):** the aggregation arms cut activity drastically —
  moving fraction ×0.29 (E 0.25) and ×0.09 (E 1.0) relative to W; W+E(1.0)
  is ≈ 10× stiller than the data. The "packing" verdict was reached by
  largely freezing the colony; stop-rate multiplication is not a
  viable form of aggregation. Any packing follow-up must keep activity
  (and exits) as guarded quantities and redistribute where ants stop
  rather than how often.
