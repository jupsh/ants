# Faster colony fits — options

_Written 2026-10-14, while step-4b start 0 (Stroeymeyt 2018 in-nest
motion) was at about generation 43 on the rented box. This is an options
survey, not a decision: nothing here is adopted, and the running fit was
not touched. Any option that changes what is fitted, or the conditions
the fit was gated under, needs its own STATUS entry, logged before it is
used — the same discipline as the dt and window decisions. Options are
grouped by how much they disturb the science: §1 changes nothing about
the result, §2 changes only how the search gets there (the final fit is
still produced and judged at the adopted settings), §3 changes the
fitted quantity itself and would need a new gate._

## Where the time goes now

One candidate evaluation (`evalAt`, [fitS2018.ts](../scripts/fitS2018.ts#L61))
simulates all 22 fit colonies, one task per colony on the process pool
([s2018Lib.ts](../scripts/s2018Lib.ts#L72)). Each colony runs 2 h warm-up
+ 6 h observed at dt 0.05 s — 576,000 steps — with 41–152 ants
(colony122 is the largest, 152 ants; 2,266 ants in total across the 22
colonies). A generation is λ = 10 candidates evaluated concurrently, so
220 colony simulations, and the generation's wall time is set by the
slowest single colony task: colonies cannot be split across workers,
because each step depends on the previous one. The optimiser's own
arithmetic (k = 10) is negligible beside this, and the 0.5 s observer
adds under 1 % (colony-fastpath side project, results file). Warm-up is
25 % of every run's steps; the observed window is 75 %.

Two settings that dominate the cost are gated, not free knobs. dt 0.05
was adopted because dt 0.1 failed the equivalence gate on one row
(forager P(still ≥ 10 s), +0.55 SE; STATUS 2026-10-11), and the 6 h
window was adopted because 4 h failed one row and 2 h failed three
(STATUS 2026-10-11). Changing either silently would invalidate the
comparison those gates protect.

The 2026-10-12 fast path is already in: pair-cached contact geometry,
the resting-ant percept shortcut, and the incremental contact grid gave
2.0×, bit-identical (STATUS 2026-10-12). Generation times on the box
have still risen from ≈ 22 min early in start 0 to ≈ 60 min at
generation 43, plausibly because the search has moved into a region
with more active ants, where the resting shortcuts help less. That is
an inference from the parameter means, not a measurement; §1.1 is how
to turn it into one.

## 1. Same result, less time

### 1.1 Profile at the current search point, then refactor allocations

Every profile so far was taken at the hand-tried start point, where
≈ 95 % of ants are resting. At the generation-40 mean the ants are much
more active, so the hot spots have probably moved. First step: a CPU
profile of the two largest colonies at approximately the current mean
parameters, at the real fit settings — a few minutes locally
(`node --cpu-prof node_modules/.bin/vite-node <script>`, per CLAUDE.md).

The known structural cost is allocation. `ColonySim.step`
([colonyBles.ts](../src/sim/experiments/colonyBles.ts#L293)) builds
several fresh arrays per step (contacts, resting flags, percepts,
actions, walked lengths), and `senseAllContacts`
([contactPairs.ts](../src/sim/perception/contactPairs.ts#L39)) builds a
new list of contact objects per ant per step. At 576,000 steps ×
≈ 100 ants, that is a large amount of short-lived garbage for the GC.
Rewriting these loops with preallocated, reused buffers — keeping ant
order, contact order and every RNG draw in the same sequence — should
be exactly bit-identical, and the equality tests already exist to prove
it (fast-path on/off row-hash tests, `test/colonyClone.test.ts`). The
gain is unknown until §1.1's profile exists; if perception, walking and
contact geometry dominate rather than allocation, this shrinks to a
small win and should be dropped. Do not revive the side project's
`restDecision.ts` for this: it was rejected because it copies the nest
policy outside the perception boundary (STATUS 2026-10-12).

**Warning:** any change under `src/sim` changes the simulation hash,
and a checkpoint refuses to resume under a different hash
([fitS2018.ts](../scripts/fitS2018.ts#L53)). So §1.1 applies to start 1,
the restart, or a future fit — never as a mid-flight patch to a run
whose checkpoint must stay resumable on the same code.

### 1.2 Faster cores, not more cores

A generation's wall time is bounded by one colony on one core. The
rented box's cores are capped at 1.9 GHz and run one process ≈ 5×
slower than a local core; the largest colony's 8 h run takes ≈ 20 min
there against ≈ 2 min locally (STATUS 2026-10-11/12). A generation
needs only 220 colony tasks at a time (440 for the doubled-population
restart), so an instance with fewer but faster cores — current
generation, high clock — at ≥ 220 vCPUs would very likely beat the
present box on wall time per generation, and the checkpoint makes
moving cheap: copy the checkpoint and `data/fits/s2018-trips.json`,
check out the same commit, rerun the same command, and confirm the next
generation line continues the log. Verify the run hash on the new box
first (the `hash` target of [boxS2018.sh](../scripts/boxS2018.sh#L22)).

Relatedly, worker count is worth one benchmark before the next launch:
[boxS2018.sh](../scripts/boxS2018.sh#L11) sets `SIM_WORKERS` from the
container CPU quota, which counts hyperthreads. With 220 tasks on
440 hyperthread workers, active tasks can land on sibling threads and
slow each other. Timing one generation at the quota count against,
say, the physical-core count costs one generation and settles it.
Largest-first task submission would also help whenever workers are
fewer than tasks (the queue is currently FIFO in data order,
[pool.ts](../scripts/pool.ts#L170)); it changes nothing while tasks
fewer than workers all start at once, and results are joined in order
either way.

## 2. Same final fit, cheaper search

These keep the adopted dt, window and rows for every number that is
reported or judged, and spend less only on getting the search into the
right region. Each needs a STATUS entry before use, stating the
switching rule in advance.

### 2.1 Multi-fidelity generations

Run early generations cheaply, then restart CMA-ES from the cheap
optimum's mean at full fidelity. The cheap settings are already
measured: dt 0.1 halves the step count, and a 2 h observed window makes
the run 4 h instead of 8 h of simulated time — combined, one cheap
evaluation costs about a quarter of a full one (144,000 vs 576,000
steps). Their biases are known and small next to the losses early in a
search: dt 0.1 shifted one row by +0.55 SE, and the 2 h window shifted
three still-run tail rows (STATUS 2026-10-11). Against a loss in the
thousands (RMS fitZ ≈ 12), a sub-SE bias on a few rows cannot mislead
the search; against a loss near the good-fit scale of tens, it could.
So the switching rule must be fixed in advance — for example, cheap
generations until the generation best first falls below some loss
chosen now, then a fresh CMA-ES at dt 0.05, 2 h + 6 h from that mean,
with the final estimate, selection batch and judging all at full
fidelity as now. Expected saving: most of the early generations at
≈ 4×, i.e. the bulk of a run whose early phase is the majority of its
generations. Risk: the cheap optimum sits slightly off the full
optimum in the tail rows; the full-fidelity restart absorbs that, at
the price of some extra full generations.

### 2.2 Colony-subset screening

The 22 colonies are not equal: makespan is set by the largest few. A
screening phase over a subset — say 11 colonies chosen in advance,
stratified by colony size so the subset spans 41–152 ants — roughly
halves the tasks and removes some of the slowest. The subset's loss is
a noisier, composition-shifted estimate of the real one, so this is
only a screen: candidates are ranked cheaply, and generations switch
to all 22 colonies well before the end (same switching-rule discipline
as §2.1). Note the loss function compares the simulated colonies' mean
against the 22-colony target ([stroeymeytTargets.ts](../src/sim/experiments/stroeymeytTargets.ts#L93));
a subset screen should use the matching subset of the data rows as its
target, recomputed from the per-colony rows, so that it estimates the
same quantity noisily rather than a different quantity precisely.

### 2.3 Shared warm-up snapshots

Warm-up is 25 % of every run, and it is repeated identically in
structure for every candidate: the same colony, seed and initial
state, differing only in the candidate's motion parameters. The
analogue of the Mailleux fits' shared warm-ups (STATUS 2026-10-10) is:
once per generation and colony, warm up under the generation's current
mean parameters, snapshot the colony (`ColonySim.clone` exists and is
tested to continue bit-exactly, [colonyBles.ts](../src/sim/experiments/colonyBles.ts#L288)),
and hand each candidate a clone, followed by a short
re-equilibration under its own parameters (say 30 min) and the 6 h
window. Cost per candidate falls from 8 h to 6.5 h of simulated time
(≈ 19 %; to 25 % with no re-equilibration), plus one warm-up per colony
per generation. Two pieces of work: the pool tasks are stateless, so
snapshots must either be passed as task arguments (a colony state is
small next to an 8 h simulation) or cached in workers with
colony-affinity scheduling; and the substitution needs an equivalence
check in the gate's form — rows from shared-warm-up candidates against
own-warm-up candidates at a test point, 90 % CI inside ± 0.5 SE_data —
because an ant distribution warmed up under other parameters is not
quite the candidate's own steady state. The re-equilibration is what
the check would mostly be testing.

### 2.4 Fewer free parameters after an identifiability check

Per-evaluation cost is fixed, but the number of generations CMA-ES
needs grows with dimension. If, at start 0's optimum, an
identifiability check (the flat-direction rule already used for the
1999 fits) shows some of the k = 10 directions are flat, fixing those
parameters shrinks the restart's search space and its default
population (λ = 4 + ⌊3 ln k⌋). This costs one check and may buy
convergence speed in the restart; it buys nothing per generation, and
fixing a parameter the data actually constrain would be a modelling
error, so it stands or falls with the check.

## 3. Changing the fitted quantity (new gate required)

Recorded so the idea is not lost, not recommended as a shortcut: a 5 h
window, or dt 0.1 with an encounter-episode correction for the one
failing row, or dropping the still-run tail rows that make short
windows fail. Each changes the rows or the conditions the fit is judged
under, so each needs its own pre-registered gate rerun before use, and
the saving is modest (≈ 12 % for 5 h) next to §2.1. An event-driven
simulator that sleeps resting ants until their next drawn event would
be the largest structural win in a nest that is ≈ 95 % still, but it is
a rewrite of the stepping core, would not be bit-identical, and would
have to re-earn every dt and window gate; it is out of proportion for
this fit.

## Recommended order

1. **Do nothing to start 0.** It is checkpointed every generation; let
   it finish or stop on its own criteria.
2. **Before launching start 1 or the restart:** pick the fastest-core
   box that still offers ≥ 220 vCPUs (§1.2), benchmark `SIM_WORKERS`
   once, and verify the run hash there. This is the largest wall-clock
   lever and touches no code.
3. **Profile locally at the current mean** (§1.1). Only if the profile
   shows allocation-heavy hot loops, do the buffer refactor — for the
   next run, gated on the row-hash equality tests and the fast tier.
4. **Log a multi-fidelity rule in STATUS** (§2.1, optionally with
   §2.2) and use it for the restart, which is the run designed to
   improve the fit and the one whose doubled population makes each
   generation cost the most. The restart at ≈ 2 h per generation on
   the present box is where the ≈ 4× cheap phase pays for itself.
5. Treat §2.3 and §2.4 as second-round options, each behind its check.

What not to do: shorten the window or raise dt in the adopted fit
without a gate (§3); run start 1 beside start 0 on one box — it halved
start 0's speed (STATUS 2026-10-13); kill pool workers by name (they
are all called `poolWorker`, CLAUDE.md); or judge any cheap-phase point
as a fit result — cheap phases are search tools only, exactly like the
pilot conditions.
