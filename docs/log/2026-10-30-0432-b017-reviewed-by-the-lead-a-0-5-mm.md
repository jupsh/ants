---
id: D188
date: 2026-10-30
time: 04:32
kind: review
title: B017 reviewed by the lead: a 0.5-mm Gaussian sampling footprint with deposit spacing <= cell/2 passes B012's rule; legacy mode bit-identical; patch unapplied, sigma unsourced
---
- **2026-10-30 ≈ 04:32 UTC — B017 reviewed by the lead: a 0.5-mm Gaussian sampling footprint with deposit spacing <= cell/2 passes B012's rule; legacy mode bit-identical; patch unapplied, sigma unsourced.**
  - **What was handed over.** B017 (done; codex-b017, handoff on T046): `proposal.patch` adds an optional Gaussian
    sampling footprint (`samplingSigmaMm`, 0 = legacy point sampler) to `PheromoneField` and deposit spacing
    min(1 mm, cell/2) when it is on. Synthetic trails only; no empirical, sealed or held-out data.
  - **What the lead checked itself (not only the report):** `npx tsc --noEmit -p .` clean; the item's six tests pass
    (`vitest run -c backlog/B017-…/vitest.config.ts` from the repo root); `git apply --check --whitespace=error-all
    proposal.patch` passes against the current tree; `backlog.mjs check B017`: 2 results files, 0 stale (both stamped
    on a dirty tree, as the main tree has uncommitted work). Not rerun: the 96-case convergence script and the
    legacy-identity script (their stamps are current).
  - **Reading against B012's predeclared rule** (centreline and 0.5-mm-offset samples within 10 % at the 0.25 to
    0.125 mm refinement, 0.01 absolute near zero; no longitudinal gaps), from `results/analysis.md` and
    `convergence.json`:
    - candidate: all 32 comparisons pass, worst change 3.046 %, no gaps. Centreline 0.9976 at 0.25 mm and 0.9922 at
      0.125 mm (analytic 1); 0.5-mm offset 0.6069 and 0.6064 (analytic exp(-0.5) = 0.6065);
    - original control (point sampling, 1-mm deposits): fails refinement and gaps;
    - mass error 1.173e-5 on 60 units in both; legacy mode identical on 10,000 samples and 40 `walkAnt` state
      comparisons.
  - **Scope of the pass (bounded conclusion).** It supports the numerical construction only. Coarse grids stay
    alignment-sensitive (centreline 0.006-1.336 across phases at 4 mm, 0.16-0.89 at 2 mm; 0.65-0.89 at 1 mm), so a
    grid-size rule per sigma is not established. Nothing about the boundary, a biological width, trail following or
    cost at large footprints. The value 0.5 mm is provisional and unsourced; it carries `estimated` provenance.
  - **Not decided here.** The patch is unapplied and the footprint unadopted. Applying it and choosing a sigma are
    the user's (AGENTS.md, Who decides what; backlog PROTOCOL, Finishing). Reconsider if the trail-response model
    needs a width the literature gives, or a grid coarser than 0.25 mm.
  - **Records.** New finding F101 (supersedes nothing; F049 stays true for the legacy sampler and gains B017 as
    evidence); T046 gets a note and stays open; B017's Findings section points here.
