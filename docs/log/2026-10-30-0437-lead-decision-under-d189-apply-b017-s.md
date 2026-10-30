---
id: D190
date: 2026-10-30
time: 04:37
kind: decision
title: Lead decision under D189: apply B017's patch with the footprint off by default, after Part D's Stage 2b reading and capfiles finish; choose no biological sigma until the trail-response model is designed
authority: delegated by D189
scope: T046
---
- **2026-10-30 ≈ 04:37 UTC — Lead decision under D189: apply B017's patch with the footprint off by default, after Part D's Stage 2b reading and capfiles finish; choose no biological sigma until the trail-response model is designed.**
  - **1. Apply the patch, with the footprint off by default.** B017's `proposal.patch` (`src/sim/world/field.ts`,
    `src/sim/physics/antPhysics.ts`, `test/fieldFootprint.test.ts`) goes into the main tree as a diagnostic switch
    (`samplingSigmaMm`, default 0 = the legacy point sampler), bit-identical when off (D188). It fixes a known numerics
    defect (F049; F101) and gives the trail-response model a field that converges. It is not adopted: nothing turns it
    on, and nothing uses the field yet.
  - **When:** the patch is applied only after run partd2b-read and the paused capfiles stage have finished. Reason: the
    patch changes `src/sim`, and so the simulation hash (`scripts/simHash.ts`), under a sealed Part D reading that is
    running now and a stage that resumes after it. Bit-identity makes the results the same, but their provenance would
    record a hash taken mid-run. After applying it: `npm test`, `npx tsc --noEmit -p .`, and `npm run precompute`,
    since pages run live until the hash matches.
  - **2. No biological sigma now.** No cleared paper gives a trail-sensing footprint for *L. niger* (searched
    `.cache/papers` for antenna and trail-width terms; the one antenna length found, 3 mm in Jeanson 2005, is for
    larvae). `PROVISIONAL_TRAIL_SAMPLING_SIGMA` (0.5 mm, `estimated`) stays a numerical test value, never enabled by
    default. Before any trail-following result, the sigma is chosen from a cleared source, or fitted to trail data with
    a designated role, and the grid is no coarser than the one B017 checked for that sigma (cell <= sigma/2) unless a
    grid check at the new sigma passes B012's rule.
  - **Reconsider** if a cleared paper gives a footprint, or if the trail-response model's design needs the field on.
