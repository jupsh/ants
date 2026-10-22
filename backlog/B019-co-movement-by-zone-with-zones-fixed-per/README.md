---
id: B019
title: Co-movement by zone with zones fixed per ant
status: done
size: S
priority: 910
note:
outcome: B018's peripheral co-movement is ≈ 2/3 classing artefact; ants are not based in the periphery, so the zone test cannot be run; site-based ants co-move (Δ 0.034)
depends: backlog/B018-resting-site-and-aggregation-in-the/out
---
# B019 — Co-movement by zone with zones fixed per ant

<!-- Frontmatter is the item's state; README.md (open index) and CLOSED.md are generated
from it (`node backlog/backlog.mjs`). size: S | M | L. note: one line
shown in the index (e.g. why blocked). outcome: one line, when done/dropped.
depends: comma-separated paths the results depend on beyond simHash's inputs
(e.g. data/fits/s2018-tracker.json); see _lib/stamp.ts.
The claim is the `.claim/` folder, made by `backlog.mjs claim`. -->

Source: B018 lead review 2026-10-19 (family 6 caveat)

## Question
Does B018's 'co-movement sits at the periphery and entrance, not at the resting site' survive when an ant's zone is fixed over the 4-h block (or by its rest position) instead of by where it is in each minute, which is endogenous to activity?

## Why it matters
- **Synchrony is a blocker for freezing the structure** (Rules in force): its cause must be investigated before any
  held-out test. B018 family 6 read local co-movement as peripheral (C(< 10 mm) core 0.06, periphery 0.26, entrance
  0.26), which would argue against Y's "shared brood micro-environment" reading (F024, F064).
- **The lead review found a possible artefact.** B018 classes each pair by both ants' positions *in that minute*.
  Position is endogenous to activity: an ant in the low-occupancy periphery is nearly always moving, and a core ant
  mostly still. Proximity in that minute is endogenous the same way. Until this is settled, F064 is marked "not yet usable".
- **The answer either restores F064 as evidence** on the synchrony cause or withdraws it. It is an input to the
  investigation, not a decision rule: no Plan, fit or rule changes from it.

## Done when
1. **Reproduction:** B018's minute-classed C by zone and distance class recomputed from its `out/` files. It must
   match `results/rules.json` → `summary.comove6` before anything else is read.
2. **Artefact size:** the same minute-classed statistic under a per-ant time-shift null (cross-ant timing broken,
   each ant's own position–activity link kept). This gives the share of B018's periphery − core contrast that the
   classing alone produces.
3. **Fixed classing:** zone and pair distance from each ant's mean in-nest position over its 4-h block (primary)
   and over 24 h (beside), observed and under the same null. The answer is the null-corrected core − periphery and
   entrance − periphery contrasts, with colony-bootstrap CIs, read by the rule stated in the Progress log before computing.

## Base
Claimed 2026-10-19 by lead-claude at `f0a05a0`; tree clean. Inputs: B018's per-colony files
`backlog/B018-resting-site-and-aggregation-in-the/out/rules-c*.json`, written by its `rules.ts` at `ecbb918` (git-ignored, local;
hashed through `depends`). Their per-ant 1-min bins (in-nest moving and step counts, position sums) and the 24-h site
field `e24` are all this item reads. `rules.ts` is unchanged since, so the files can be regenerated.

## Data and roles
- **Stroeymeyt 2018 main experiment, PreTreatment, 22 fit colonies: fit, in a development role**, as in B018
  and comparisons X, Y, P, Q. Read only through B018's derived files; no new data set and no new variable
  (queen tracks are not in the bins). No new contamination entry needed.
- **Already seen before this scope (disclosed):** B018's minute-classed results (core 0.062, periphery 0.260,
  entrance 0.255 at < 10 mm; core − periphery −0.198 [−0.257, −0.145]). Not seen: any fixed-classing or null value.
- **Held-out: none.** No age-experiment or PostTreatment file.

## Compute
Local, one niced process, no pool. Pairwise sums per minute over 22 colonies × 24 h × (1 + 20 shifts) × the
classings: minutes. The C2 fit runs on the box, so nothing here competes with it.

## Out of scope
- New track passes, new activity definitions, or changes to Y's C statistic (same deviations, same 4-h blocks
  from 02 UTC, same zone thresholds and entrance point as B018).
- Rest-position classing (needs a new track pass: it would be a separate item if the block classing is ambiguous).
- Lead–lag between zones, model-side comparisons (B021), and any mechanism or design.

## Progress log
<!-- Newest last, a few lines each, added with `backlog.mjs log Bnnn "…"`:
what was done, the command, and the result in numbers. Long output goes in results/ and is linked. Before each run, state
what each outcome would mean. Past ~300 lines in this file, move older entries
to LOG.md (same format); Findings stay here. -->
- 2026-10-19 18:02 UTC · lead-claude · Scoped and claimed (lead-claude, f0a05a0). Reading before computing (comove.ts; already seen: B018's minute-classed values only). Statistic as B018/Y: d = an ant's in-nest moving fraction in a 1-min bin minus its 4-h block mean (blocks from 02 UTC); per colony C = Σ d_i d_j / √(Σ d_i² Σ d_j²) pooled over minutes and pairs; zones core (E24 ≥ 2), periphery (E24 < 0.5), entrance (≤ 10 mm from (35.5, 42.25), first), mid, mixed (pair in different zones); distance < 10 and 10–20 mm; colony mean, colony bootstrap 2000 (B018 lib boot). Classings: M = B018's (both ants' positions in that minute); F4 = each ant's mean in-nest position over its 4-h block (primary); F24 = its 24-h mean (beside). Zone and pair distance both from the classing's positions. Null: each ant's whole series (d, positions) circularly shifted by an independent offset uniform in [60, L − 60] min, 20 replicates per colony, seeded; Δ = C_obs − C_null per colony. (R1) M must reproduce rules.json comove6 to 1e-9, else stop. (R2) Artefact share of B018's contrast = (Cnull_per − Cnull_core) / (Cobs_per − Cobs_core) under M: 'mostly artefact' if ≥ 0.5; 'partly' if < 0.5 with the null contrast's CI > 0; 'not an artefact' if that CI includes 0. (R3, primary) F4, < 10 mm: Δ_core − Δ_per with CI > 0 → 'centred on the site' (fits Y's shared-micro-environment alternative; not decisive); CI < 0 → 'peripheral' (F064 becomes usable as evidence against it); else 'no zone difference' (F064 withdrawn; synchrony cause stays open). Same rule for Δ_ent − Δ_per ('entrance-centred' if > 0). Per zone, Δ_z with CI > 0 → coupling present there. (R4) F24 beside; a disagreement with F4 is reported and the verdict follows F4. 10–20 mm beside.
- 2026-10-19 18:05 UTC · lead-claude · Per-colony runs done (comove.ts, 20 shift replicates, 22 colonies, ≈ 2 min at 6 niced processes; out/comove-c*.json). Seen so far: only colony112's (c0) M values, checked against B018 (identical); they show its periphery C 0.585 resting on 98 pair-minutes vs 238,054 for its core. So one post hoc check is added before aggregating, labelled as such and beside the logged rules (which stand): the same F4 and M tables over colonies with ≥ 1000 pair-minutes in each zone compared.
- 2026-10-19 18:06 UTC · lead-claude · Read (agg.ts → results/comove.json, stamped). (R1) M reproduces B018 exactly (max |diff| 0). (R2) Under M at < 10 mm, the shift null alone gives periphery − core 0.134 [0.078, 0.201] against B018's 0.198 [0.145, 0.257]: artefact share 0.68 [0.48, 0.86], so by the rule **mostly artefact**. Null-corrected Δ under M: core 0.053 [0.045, 0.061], mid 0.079, entrance 0.098 [0.059, 0.141], periphery 0.116 [0.081, 0.156]; Δcore − Δper −0.064 [−0.105, −0.029] (10–20 mm −0.037 [−0.065, −0.009]); post hoc, colonies with ≥ 1000 pair-minutes in both zones: −0.082 [−0.120, −0.042] (9 colonies). (R3, F4, primary) **The test cannot be run:** almost no ant is based in the periphery or at the entrance. Periphery pairs exist in 3 colonies (1,557 pair-minutes vs 49.3 million in the core), entrance in 9 (19,343). The rule's mechanical outputs are 'no zone difference' (Δcore − Δper −0.086 [−0.547, 0.222], 3 colonies) and 'entrance below periphery'. The latter rests on 1 colony (degenerate CI), so I do not read it as a result: the logged rule lacked a minimum colony count, my error. Coupling present at the site: Δcore 0.034 [0.030, 0.039] (mixed 0.031 [0.019, 0.040]). (R4, F24) Same picture: periphery in 1 colony (4 pair-minutes); its 'centred on the site' rests on that colony, so not read. Δcore 0.032 [0.028, 0.036].

## Findings
**Answer.** B018's "co-movement sits at the periphery and the entrance, not at the resting site" does not survive. About
two thirds of its contrast comes from the classing alone. With zones fixed per ant, the comparison cannot be made, because
almost no ant is *based* in the periphery or at the entrance: those are places ants pass through. Ants based at the site do
co-move beyond chance. So the B018 result is not evidence for or against Y's shared-micro-environment reading, and the
synchrony cause stays open.

**Evidence** (`results/comove.json`; scripts `comove.ts`, `agg.ts`; 22 fit colonies, 20 shift replicates each, colony
bootstrap 2000):
- *Reproduction.* B018's minute-classed C recomputed exactly from its `out/` files.
- *Artefact.* Each ant's series is shifted in time (its own position–activity link kept, cross-ant timing broken). The
  minute classing then gives periphery − core 0.134 [0.078, 0.201] against the observed 0.198: share 0.68 [0.48, 0.86].
  The mechanism: an ant in the low-occupancy periphery that minute is nearly always moving, a core ant mostly still.
- *What is left under the minute classing* (observed − null, < 10 mm): core 0.053, mid 0.079, entrance 0.098, periphery
  0.116. Δcore − Δper −0.064 [−0.105, −0.029], also in the 9 well-sampled colonies (post hoc). This residual is
  co-movement among ants passing through the same sparse area at the same time (walking together or in traffic), not a
  property of ants based there.
- *Fixed zones* (4-h mean position, primary; 24-h beside). Periphery pairs exist in 3 colonies (1,557 pair-minutes vs
  49 million in the core); at 24 h in 1 colony (4 pair-minutes). Core ants: Δ 0.034 [0.030, 0.039] (24 h: 0.032 [0.028, 0.036]).

**Confidence and caveats.**
- High for the artefact share and for the periphery being a transit zone.
- **A flaw in my rule:** the logged R3/R4 had no minimum colony count. Their mechanical outputs ("no zone difference";
  "entrance below periphery" and, at 24 h, "centred on the site", each resting on 1 colony) are stated in the Progress
  log but not read as results.
- The shift null also removes colony-wide synchrony (F022). So Δ is local and global co-movement together; it does not
  separate local coupling from a shared driver.
- Zone thresholds, blocks and C are B018's, unchanged.

**What it implies.** F064's reading is withdrawn. A zone-based contrast in this nest cannot test where coupling sits,
because ants are based almost only in the core and mid regions. A test of the synchrony cause needs a design that does not
condition on position or proximity in the same minute: for example, coupling against the distance between *home*
positions within the core, with a global-synchrony baseline from far pairs. That would be a new item, if wanted.
Nothing in the main line changes.
