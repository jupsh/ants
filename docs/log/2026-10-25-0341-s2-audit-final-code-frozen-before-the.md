---
id: D153
date: 2026-10-25
time: 03:41
kind: design
title: S2 audit final code frozen before the run: two fixes outside every synthetic calculation (label precedence in loadFile, the empty-gate draw count), unit checks and plumbing rerun; the six script hashes; the seal stays until the user lifts it
---
- **2026-10-25 ≈ 03:41 UTC — S2 audit final code frozen before the run: two fixes outside every synthetic calculation (label precedence in loadFile, the empty-gate draw count), unit checks and plumbing rerun; the six script hashes; the seal stays until the user lifts it.**
  - **Fixes after D152's synthetic run** (both found by a plumbing test on throwaway synthetic files in the session
    scratchpad, seed 0x5aee, not part of the acceptance):
    1. `loadFile` (`s2Audit.ts`): for a simulated file, a `colony` field inside `ydist` would have overridden the file's
       label. Now the file's label wins. None of the 132 Part C separation files has such a field (checked), so real
       inputs read the same before and after.
    2. `gate` (`s2AuditGate.ts`): with no common colony it reported "draws Infinity"; now 0. The verdict was already
       "unestimable".
    - **No synthetic calculation changes.** The cases call neither `loadFile` nor `gate`; `gate` runs only in the V6
      unit checks. D152's case results stand without a rerun.
    - **Rechecked on the fixed code:** the 17 unit checks pass. The plumbing test passes end to end: file runner →
      reader with matched labels, a 20-draw run plus a 20–40 extension merged to 40 draws, and every descriptive block
      written. `s2AuditRun.sh` passes `bash -n`, and its file keys were dry-run on the real file names (names only).
  - **Frozen code** (`scripts/scratch/`, local):

    | File | Role | md5 |
    |---|---|---|
    | `s2Audit.ts` | statistics, nulls, reference classing | `f9ef0fb4c11df92318cfb0c382e2b8f2` |
    | `s2AuditGate.ts` | colony statistics, gate, MC error | `47b8cb7d9491ed4a6e24ca59079054fd` |
    | `s2AuditFile.ts` | one file per process | `d888bb33e91583b6853dd75265e72856` |
    | `s2AuditRead.ts` | reader: pooling, gate, descriptive blocks | `75414e8c55c9e64ee38bf27c313ef840` |
    | `s2AuditRun.sh` | run order: simulated sets, data, reader; `ext` for the one extension | `6c012c913026a91da95527a5282013f0` |
    | `s2AuditSyn.ts` | synthetic checks (as D151) | `49d3e26028b495837de3668c04ca7669` |

  - **The reading is fixed by D136, as amended by D145, D146 (confirmed and amended by D147) and D150, with D148 /
    D151 for the synthetic checks, and J as primary (D152).** Its gate, wording and disclosures are in P31–P40.
    - The extension to 400 draws is run only if the reader prints "extend" (`s2AuditRun.sh <dir> 14 ext`, then the
      reader again).
  - **Not yet done:**
    - **The seal stays.** The audit output folder stays in `.claude/sealed-paths.txt` until the user formally lifts
      it. Nothing has been written there.
    - The run starts after that, through `plied review T032 --action run:s2audit --gate` and `run.sh start … --node
      T032`. Estimate ≈ 10–20 min locally, from the synthetic cases' pair-bin counts; not timed on a real file.
- **2026-10-26 ≈ 03:35 UTC — Amendment (D171 item 3, under D170): `s2AuditSyn.ts` changed after the audit was read.**
  The unused parameter `i` on line 338 is renamed `_i`, to clear a `tsc` error (`noUnusedParameters`); the parameter is
  never read, so nothing the script computes changes. md5 `49d3e26028b495837de3668c04ca7669` → `d93060f5c38610e1dd2116e6890b3ff7`.
  The frozen version is kept verbatim in `logs/s2audit/frozen/s2AuditSyn.ts` (md5 `49d3e260…`); the table above still
  names what ran (D152, D156).
