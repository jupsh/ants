---
id: D195
date: 2026-10-30
time: 17:38
kind: decision
title: B017 patch applied to src/sim under D190, footprint off by default; 13 stamped results re-stamped (simHash ecce22a65b2428dc → eb48ce968127e6a8)
---
- **2026-10-30 ≈ 17:38 UTC — B017 patch applied to src/sim under D190, footprint off by default; 13 stamped results re-stamped (simHash ecce22a65b2428dc → eb48ce968127e6a8).**
  - **Condition of D190 (P75) met:** run `partd2b-read` finished `ok` (D194) and `partd2-capfiles-20261030T053011Z`
    finished `ok` (`npm run runs`); no run was going when the patch went in.
  - **Applied:** `backlog/B017-…/proposal.patch` (`git apply`, checked first): `src/sim/world/field.ts`
    (`samplingSigmaMm`, default 0 = the legacy point sampler; `PROVISIONAL_TRAIL_SAMPLING_SIGMA`, 0.5 mm, `estimated`,
    not enabled anywhere), `src/sim/physics/antPhysics.ts` (deposit spacing ≤ cell/2 only when the footprint is on),
    `test/fieldFootprint.test.ts`. Nothing sets a sigma; no sigma is chosen (D190 item 2; P76 stays open).
  - **Checks:** `npx tsc --noEmit -p .` clean. `npm test`: 291 of 292 passed; the one failure was the findings check
    reporting stale stamps, which is the hash change below, not a behaviour change.
  - **Why the stamps changed and why they are re-stamped:** the patch changes `src/sim`, so `scripts/simHash.ts`
    moved from `ecce22a65b2428dc` to `eb48ce968127e6a8`. With the footprint off, outputs are bit-identical to the
    unpatched tree (D188: B017 `legacyIdentity`, 10000 samples and 40 walking-state comparisons), so, as in D085, D096 and
    D120, the 13 results that were current at `ecce…` carry a `provenance.restamped` entry (reason D195) and the new
    hash: B001 sweep; B004 data, sim; B013 roundtrip; B014 bench, identity; B017 convergence, legacy-identity; B018
    rules, site, walkon; B019 comove; `data/reference/stroeymeyt2018-rest-position.json`. Only provenance changed in
    each file (B004's two by a text edit, to keep their layout).
  - **Not touched:** five backlog results that were already stale before this change (B008 makespan, timings; B009
    results; B014 baseline, bench-round1), stamped at older hashes (`baf4…`, `1a32…`) and not re-stamped by earlier
    entries either.
  - **Pages:** run live until `npm run precompute` is rerun (D190); see the follow-up line below.
