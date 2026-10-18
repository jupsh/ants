# B008 — Recommendation for the step-5 Mailleux fit

Evidence: `timings.json` (measured, this folder) and `makespan.json` (modelled
from those timings). All timings use the pilot nest motion (the step-4 motion
is not plumbed into the Mailleux runner yet), so they are indicative: the
ranking of options is the result, not the absolute hours. Local single-core
times; a slower box core scales every design by the same factor.

Measured base (300 s warm-up, dt 0.1, both `m1999Points` starts, days 1/8):
an independent recruiter costs 403–903 ms. Warm-up alone is 53–68 % of that
(243–515 ms); the E2 recruiter load is 4–49 ms; the rest is the observed stay
(mean stay 92–187 s of the 1,200 s window). Nest size is set by the fitted
density: 23 nestmates at density 1, 53 at density 2.3 (chamber 23.0 cm²).
At the density bound (6/cm², 138 nestmates) per-step costs rise roughly in
proportion to ant count, so warm-up dominance only grows.

One CMA-ES generation (λ = 9 for k = 7, 80 recruiters/day × 3 days, 62
workers, local-speed cores): 22.5 s independent, 12.8 s shared. A full fit
(≈360 generations over 2 starts + restart) is then ≈2.2 h independent /
≈1.3 h shared at local speed, before the step-4 motion and any density rise
inflate the per-task cost.

### 1. Shared warm-ups, `--perNest 4` (already implemented)

Applies: yes, unchanged. The Mailleux design is recruiters in nests, not
22 separate colonies, and shared warm-ups already exist
(`pool.m1999Shared`, `runNest1999`).
Saving: measured 1.6–2.2× per recruiter (larger nest, larger saving). At a
900 s warm-up (the pilot condition) the measured components give an
estimated ≈2.7×, because warm-up is then ≈80 % of a run.
Gate: none new for using it as the fit design — it is already a logged
design, and `m1999FitLoss` already treats a nest as the SE block. A
shared-vs-independent equivalence check in the existing form (paired test
points, per-row 90 % bootstrap CI inside ±0.5 SE_data, as in
`convergeM1999.ts`) is the gate if the step-5 design needs to prove the
two designs estimate the same rows.
B013/B014: independent of B014. This is the in-process form of the
snapshot idea (see 4).

### 2. Multi-fidelity generations (cheap early generations)

Applies: yes, in recruiter terms. The cheap knob with measured scaling is
dt: dt 0.2 costs 0.55–0.62× dt 0.1 per recruiter; dt 0.05 costs
1.9–2.3×. A cheap phase at dt 0.2 with half recruiters costs ≈0.3× a full
evaluation. Unlike Stroeymeyt there is no long observed window to shorten
(the stay ends when the recruiter leaves), so window-shortening does not
transfer; warm-up shortening is the other cheap knob and is exactly what
the warm-up convergence gate already tests (300 vs 900 s).
Saving: estimated ≈3× on the generations run cheap; worth most if the
fit runs many early generations far from the optimum.
Gate: a STATUS entry fixing the switching rule in advance (as in the
deleted faster-fit note §2.1), plus an equivalence check in the existing
form before dt 0.2 is trusted even for search: `convergeM1999.ts --vary
dt --levels 0.2,0.1` at both test points, every row's 90 % CI inside
±0.5 SE_data. Final generations, selection batch and judging stay at
dt 0.1.
B013/B014: multiplies with both; no interaction beyond that.

### 3. Colony-subset screening

Applies: only translated. There are no 22 colonies to subset; the units
are recruiters, nests and the 3 starvation days. A screening phase at
half recruiters/day (40 instead of 80) costs 0.50× per evaluation
(measured work; generation 11.6 s independent, 6.9 s shared). Dropping a
day costs 0.67× but discards a fit dimension, so recruiter-halving is the
cleaner screen. Stratification "by size" becomes stratification by day
and, in the shared design, keeping whole nests (never split a nest: it is
the SE block).
Saving: measured 2× on screening generations, combined with (1).
Gate: the subset loss must estimate the same quantity — recompute the
target means from the same rows restricted to the screened days (all 15
rows survive a recruiter-halving, so no target change is needed there),
and fix the switch-to-full rule in advance in STATUS. No ±0.5 SE_data
equivalence gate applies to the screen itself, because nothing screened
is reported; the gate is that the final fit is produced and judged at
the full design.
B013/B014: none.

### 4. Shared warm-up snapshots across candidates (needs B013)

Applies: not yet. Today's sharing is within one candidate (4 recruiters
share one nest's warm-up). Sharing one warm-up across the λ candidates of
a generation — warm up under the generation mean, clone to each
candidate, re-equilibrate briefly — would remove most of the remaining
warm-up: estimated ceiling ≈1.5× on top of `--perNest 4` at 300 s
warm-up (warm-up falls from W/4 to W/(4λ) per recruiter; W ≈ 250–500 ms),
more at 900 s. It needs colony state to cross to pool workers, which is
B013's serialise/restore prototype.
Gate: an equivalence check in the existing form — snapshot candidates vs
own-warm-up candidates at both test points, paired seeds, per-row 90 %
CI inside ±0.5 SE_data — where the re-equilibration length is the main
thing tested. B013's own gate is stricter and comes first: round-trip
byte-identical continuation.
B014: orthogonal; both gains multiply if both land.

### 5. Fixing flat parameters after an identifiability check

Applies: yes, and the tool exists (`identM1999.ts`, replicate mode: a
direction is unresolved when its singular value is below 1 and below the
replicate noise floor). Fixing density from the literature (B015) or any
parameter the check shows flat does not speed a generation; it shrinks
λ slightly (k 7→6 leaves λ = 9; k 7→5 gives λ = 8) and, the real gain,
cuts the generations CMA-ES needs in a smaller space. Unquantifiable
from timings — one identifiability run at the step-5 starting points is
the measurement, and it is cheap (15 evaluations per batch).
Gate: the identifiability check itself, logged before fixing; fixing a
parameter the data constrain would be a modelling error, and fixing from
literature is the user's decision (B015 collects the candidates).
B013/B014: none.

### 6. Profile-driven refactor and faster cores (from the deleted note §1)

The CPU profile of the largest pilot nest (53 nestmates, day 1;
`out/*.cpuprofile`) shows no dominant hotspot: `senseIncremental` 8.8 %,
`pairGeometry` 5.1 %, GC 3.7 %, the rest spread under 6 %. So the
allocation/buffer refactor that the Stroeymeyt profile suggested is a
poor lever for Mailleux at these nest sizes — estimated <10 %, not worth
its bit-identity risk before step 5. Faster cores remain the largest
wall-clock lever that touches no code (a generation is bounded by total
work on 62 workers here, not by one long task, so core count matters
more for Mailleux than it did for Stroeymeyt).
Gate: none for hardware; any code refactor needs the existing
byte-for-byte row checks.
B014 is the structural version of this row: its expected 1.5–2× (its own
README) would multiply every design above, behind its user-approved
equivalence gate. It is not needed to start step 5.

## Suggested order for the step-5 design

1. Adopt `--perNest 4` (or more) as the fit design — implemented, measured
   1.6–2.2×, biggest certain saving.
2. Log the identifiability check and run it at the step-5 points before
   fixing anything; combine with B015's literature candidates.
3. If the projected fit is still long once the step-4 motion is plumbed
   in and re-timed, log a multi-fidelity switching rule and gate dt 0.2
   with `convergeM1999.ts`; add half-recruiter screening under the same
   entry if needed.
4. Treat cross-candidate snapshots (B013) and event-driven resting ants
   (B014) as second-round multipliers, each behind its own gate, in that
   order (B013 also serves checkpoints).
