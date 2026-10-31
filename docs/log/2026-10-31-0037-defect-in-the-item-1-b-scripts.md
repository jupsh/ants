---
id: D218
date: 2026-10-31
time: 00:37
kind: correction
title: Defect in the item 1(b) scripts (implementer-written, D215): meta.command omitted the script path under vite-node; found and fixed by the second implementer (D217); no value affected
---
- **2026-10-31 ≈ 00:37 UTC — Defect in the item 1(b) scripts (implementer-written, D215): meta.command omitted the script path under vite-node; found and fixed by the second implementer (D217); no value affected.**
  - **Logged for D208's defect count** (implementer code). In `triggers.ts`, `triggersAgg.ts` and `triggersSyn.ts` as
    built under D215, `meta.command` was built from `process.argv[1]`, which under vite-node is the vite-node binary,
    so the recorded command lacked the script path (the amendment 1 smoke files included). Provenance only: no
    computed value depends on it.
  - **Found and fixed** by the second implementer (D217, report Deviation 4); the lead's check of D215 missed it.
