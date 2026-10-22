# B014 design: lazy evaluation of resting ants in the colony runner

_Deliverable 1 (GUIDE.md), for the user's approval. Stepped code at `f0a05a0` (`src/sim` identical to `3a98e86`,
the C2 preparation). Nothing is implemented yet. Measurements: `results/baseline.json` (stamped); scripts
`profile.ts`, `profileM1999.ts`, `sumProfile.ts`._

**Revision 2 (2026-10-19), after the user's review of revision 1.** The user approved the direction and named three
defects:

- **Encounter expiry:** revision 1 tested expiry before applying the current contact. The original code resets
  `unseen` on renewed contact first.
- **Timers:** revision 1 replaced accumulated timers with timestamps. That changes decisions: 100 additions of
  0.05 give 4.99999999999999, not 5. The crossing moves by one step at the defaults (dt 0.05, `partRefractory`
  5 s, `giveUpTime` 120 s) and in other cases (§ 6).
- **Drive clock:** revision 1's boundary `T ≤ D_k` differed from the original strict crossing, and equality, zero
  rates and rests starting partway through a step were unspecified. It also overstated what was established
  ("only the draw order changes").

Revision 2 resolves all three at the root:

- **The tick.** A resting ant is no longer skipped with pre-drawn events. Each step it gets a cheap tick that
  repeats the original resting step's arithmetic and random draws, the same operations in the same order.
- **Hand-back.** On any step where the original code would take another branch, the tick hands the step back,
  unchanged, to the original policy.
- **Consequences:**
  - the switch is **bit-identical to the stepped model**;
  - there are no separate event streams and no drive clock;
  - no statistical equivalence gate is needed;
  - nothing that depends on the stepping path changes.

  This is a change of mechanism from the item's question ("consulted only at events"); see § 12.

## 1. Summary

- **What.** An opt-in runner switch, `ColonyOptions.lazyRest`, off by default.
  - With the switch on, an in-nest ant that rested through its last full policy call is advanced by
    `restTick`, a small function in the policy module. It runs only while its contact set and its partners'
    signals are unchanged.
  - The tick either completes the step exactly as the original `decide` would have, or returns "not this step"
    with nothing changed. The original `lasiusNestWorker` then runs.
  - The ant's action, and so its signals, are reused, and no percept is built for it.
  - The runner's own steps for it stay exactly as they are: the drive, metabolism, the contact adjacency and the
    observer.
- **Bit-identical, switch on or off.** Same rows, frames, bouts and ledger; same draws from every stream, in the same
  order. This is the property to be tested, against the **original** stepped policy (§ 7).
- **Expected gain:** ≈ 1.6–1.8× on colony122 and on a 138-ant Mailleux nest, ≈ 1.25× at 53 nestmates. This is an
  estimate (§ 2, § 8); it is slightly lower than revision 1's, because the tick costs a little each step.
- **Correction to the item's motivation (§ 3):** the simulated Mailleux nests are not 10× the Stroeymeyt colonies.
  The step-5 saving is small. The main use is Stroeymeyt-scale runs, and since the switch is bit-identical, those
  include C2's judging.

## 2. Baseline (stepped code, measured 2026-10-19, local, niced, one run each)

| Workload | Ants | Ant-steps at rest¹ | Wall time |
|---|---|---|---|
| Stroeymeyt colony122, C2 start 0 (σ 1.0), dt 0.05, 30 min + 1 h | 152 | 97.5 % | 25.7 s |
| Mailleux, pilot motion (B008's workload), density 2.3, dt 0.1, 300 s warm-up, 16 recruiters | 53 + 1 | 40.0 % | 8.1 s (504 ms per recruiter) |
| Mailleux, **C2-proxy** motion², density 2.3, same | 53 + 1 | 96.6 % | 4.3 s (270 ms) |
| Mailleux, C2-proxy motion², density 6 (the density bound) | 138 + 1 | 97.9 % | 12.2 s (761 ms) |

¹ Living in-nest ants that start a step resting, over all steps.

² C2's start-0 in-nest motion keys copied onto the pilot nest: cost-representative, not a step-5 model.

**Profile of colony122** (self time, 25.9 s sampled):

| Group | Self time |
|---|---|
| Contact sensing (`senseIncremental`) | 16.7 % |
| `meet` | 10.3 % |
| `decide` | 7.1 % |
| `metabolise` | 6.9 % |
| Policy closure in `step` | 5.6 % |
| Garbage collection | 4.9 % |
| `step` itself | 4.7 % |
| Drive loop | ≈ 4.2 % |
| `nestParamsOf` (an object spread per forager call) | 3.1 % |
| Percept map | 1.8 % |
| `lasiusNestWorker` | 1.7 % |
| `switchWithin` | 1.4 % |
| `driveFactor` | 1.0 % |

The Mailleux nest at density 6 profiles alike (contact sensing 17.4 %, `meet` 12.4 %, `decide` 7.5 %). At density
2.3, fixed per-run costs weigh more: `PathField` construction, module load, the scout run.

## 3. Correction: Mailleux nest size

- The README and GUIDE say the "Mailleux 1999 step-5 colonies are about 10× the Stroeymeyt ones". That applies to
  the **real** 1999 colonies (STATUS Plan, main risk).
- The simulation runs 1999 nestmates in the stand-in chamber at a nuisance density: 23 (density 1) to 138
  (density 6) ants, against colony122's 152.
- A recruiter run is ≤ 900 s of warm-up plus ≤ 20 min of stay.
- B008 put a whole step-5 fit at ≈ 1.3 h at local speed, with the pilot motion; C2-like motion already halves each
  run.
- So the step-5 saving is minutes to an hour per fit. The larger use is Stroeymeyt-scale work:
  - C2's judging, any refit, the C1 rejudge;
  - the step-9 held-out runs, the synchrony gate, B021;
  - the E6 colony.
- README and GUIDE are corrected in place, dated.

## 4. What the original resting step does (the part the tick must reproduce)

The step is for an ant that is alive, under the nest policy and in rest mode at its start, with the fast path on.
- The percept: `perceiveResting`.
- `nestParamsOf`.
- `decide`, in this order:
  1. `modeTime += dt`.
  2. `carrying` and `hungry` from interoception.
  3. `sinceGive = mouthFlow < 0 ? 0 : sinceGive + dt`.
  4. `parted`: each `since + dt`, kept while `< partRefractory` and in contact.
  5. `meet`.
  6. `pick` a partner: a bout starts if one is found.
  7. **The `outRate` hazard** (a `body.rng` draw when `outRate > 0`): on firing, the ant leaves.
  8. `returning`: `(carrying && sinceGive < giveUpTime) || !(ingested > 0) || !hazard(returnRate)`. It draws only
     if not short-circuited; on firing, the ant leaves.
  9. `switchWithin`:
     - a new spell if `!(spell > 0)`;
     - the rest depth if `restMult` is NaN;
     - `base = restToActive × walkOnFactor × driveFactor`;
     - `walkOn = base × (1 + nStill)^−b`;
     - `rate = walkOn × depth`;
     - `need = rate > 0 ? spell / rate : ∞`;
     - if `need >= dt`: `spell -= rate × dt`, and the ant stands;
     - otherwise it switches within the step.
- The signals `offer` and `solicit`.

Then the runner sets the body's signals and `stepLen = 0`, metabolises, and the observer frame runs.

## 5. The mechanism

### `restTick` (policy module, `lasiusNestWorker.ts`)

`restTick(io, m, p, rng, dt, rec): boolean` runs in two phases. Phase A may only bail. Phase B commits.

**Phase A: decide, mutating nothing except the RNG (whose state is restored on a bail).** It returns false (bail)
if any of the following holds:
- `m.mode !== 'rest'`, or `io.mouthFlow !== 0`;
- `carrying` or `hungry`, evaluated by the policy's own predicate functions on `io`, differs from `rec`. That covers
  `offer` and `solicit`, the `returning` condition and `pick`;
- any `parted` entry has `q.since + dt < p.partRefractory` false: an expiry may free a partner for `pick`;
- `!(m.stay.spell > 0)`, or a depth is still to be drawn (`restMult` NaN while `restShape > 0` or
  `restDeepFrac > 0`);
- after `s = rng.snapshot()`:
  - `p.outRate > 0 && rng.hazard(p.outRate, dt)` fires;
  - or the `returning` expression, evaluated with `sinceGive' = sinceGive + dt` and short-circuiting as in the
    original, fires.

  Either way it calls `rng.restore(s)` and bails.
- `need < dt`, with `need` and `rate` computed by **the same expressions as `switchWithin`**:
  - `driveFactor(m, p.driveSd)`;
  - `Math.pow(1 + rec.nStill, -p.restCrowdExp)` when `restCrowdExp ≠ 0`;
  - `need = rate > 0 ? spell / rate : Infinity`.

  On this bail it calls `rng.restore(s)` too.

**Phase B: commit, in `decide`'s order, with the original operations:**
- `modeTime += dt`;
- `sinceGive += dt`;
- each `parted` `since += dt` (no entry is dropped; see Phase A);
- the encounter update (§ 5.2);
- `spell -= rate * dt`.

It then returns true.

On a bail, the runner builds the percept (`perceiveResting` from the current adjacency) and calls the original
`lasiusNestWorker`. The step then runs exactly as the stepped code would run it. The percept is built later than in
the stepped code, but the policy phase changes no body state, so its values are the same.

### Encounters (`meet`) without a contact list

- **Invariant.** After any call of the original `meet`, an episode is in contact iff its `unseen === 0`:
  `unseen = inContact ? 0 : unseen + dt` with dt > 0, and new episodes start at 0. While the contact set is
  unchanged (the tick's precondition), this stays true.
- **The tick's update** is `meet` restricted to an unchanged contact set. In the original order, per episode:
  1. `unseen = (unseen === 0) ? 0 : unseen + dt`;
  2. drop if `unseen - dt > encounterGap + 1e-9`;
  3. `age += dt`;
  4. compaction in place.

  Then `counted` is set where `!counted && unseen === 0 && age + dt >= encounterMin - 1e-9`. No episode is added:
  every current contact already has one, because in-contact episodes are never dropped.
- Renewed contact cannot occur within a tick, since it is a set change and so a full call. This removes revision 1's
  error: there is no closed form and no "expired earlier vs rescued now" logic. Each step is the original
  sequence, so an episode lost at step L and found again at step k is dropped or kept exactly as the original drops
  or keeps it. Boundary tests (§ 7) pin this against the original `meet`.

### The runner (`ColonySim.step`, switch on)

- **Record.** After a full call that leaves an ant standing in rest in the nest, the runner stores
  `rec = { carrying, hungry, nStill }` and the returned action. The policy returns `rec` with its action
  (`NestAction.lazy`); the runner never computes it.
- **Change marks** (contact sensing split into an adjacency update and per-ant percept building; § 9). An ant is
  marked in a step if either holds:
  - its partner set differs from the previous step's. The comparison is of sorted lists, so a moving partner whose
    pair was recomputed but which is still in contact does not count;
  - a partner's signal word changed since the previous step's sensing. The word holds `offering`, `soliciting`,
    `sharingWith`, `stepLen > 0` and `gasterDown`; together these give every flag of a `ContactPercept` except
    the geometric ones.
- **Distance, bearing and mouth contact are not compared.** A resting ant reads distance only in `pick`'s ordering,
  and `pick` returns a partner only if one is eligible. Eligibility depends only on:
  - the partner's signals (marked);
  - the `parted` list (expiry bails);
  - the ant's own `carrying` and `hungry` (bail);
  - `inNest`, which is constant while the ant stands.

  At the last full call no partner was eligible, or a bout would have started.
- **Per ant per step:** if the ant has a record, is unmarked, alive and under the nest policy, the runner calls
  `restTick` (after `stepDrive`, where the policy is called today).
  - On true, it reuses the action and `per[i] = null`.
  - Otherwise, a full call, as today.
  - The move loop, the sharing loop and metabolism treat the reused action exactly as today. A reused action has
    `stand`, `give = receive = -1`, `leaveNest = false`, and the same `offer` and `solicit`, so the body's
    signals are written with the same values.
- **Observers.**
  - `ColonyStepInfo.lazy[i]` marks ticked ants; their `per[i]` is `null`.
  - `lazyRest.observe` lists ants whose percept is always built: the Mailleux observer passes the recruiter.
  - The Stroeymeyt observer reads positions and modes only.
- **Per-role parameters** are computed once at construction (`nestParamsOf`, the same values). The switch therefore
  refuses the diagnostics that mutate `P.nest` per call (`oracle`, `aggregate`, `site`) and those that need full
  percepts (`taxis`, `slowEp`), as well as `fastPath: false`. All are closed diagnostics.
- **Clone safety.** All state is plain data in runner arrays, which `clone` copies; no RNG is added.

## 6. The three review points, answered

1. **Encounter expiry.** Each tick step is the original per-step sequence: renewed contact resets `unseen` before
   the drop test, as in the original, and cannot happen inside a tick (§ 5.2). Deterministic boundary cases are run
   against the original policy (§ 7).
2. **Timers.** No timestamps. Every timer is advanced by the same `+= dt` per step as the original, so its value is
   the original's bit for bit. Every threshold decision is therefore the original's. Examples, all of which become
   test cases:

   | dt | Threshold | Accumulated sum crosses at step | k × dt crosses at step |
   |---|---|---|---|
   | 0.05 | `partRefractory` 5 s | 101 | 100 |
   | 0.05 | `giveUpTime` 120 s | 2401 | 2400 |
   | 0.1 | 5, 10 and 120 s | 51, 101 and 1201 | 50, 100 and 1200 |
   | 0.025 | 2 s | 81 | 80 |

   **No numerical change is proposed, so there is none to approve.**
3. **Rest-end boundary.** There is no drive clock. The tick evaluates the original `need >= left` with the original
   expressions and continues only on that branch. Each case is handled by the original code:
   - **Equality** (`need === dt`): the original's branch, resting with `spell − rate·dt`.
   - **An exactly zero spell afterwards:** the original redraws a spell on the next step without switching. The
     tick bails on `!(spell > 0)` and lets the original do it.
   - **A zero rate:** `need = Infinity`, resting, as the original.
   - **A rest beginning partway through a step:** that step is a full call. The spell and depth are drawn there, so
     the tick starts on the following step.
   - **A rest after an encounter stop:** the tick bails until the original has drawn the depth.

   The claim is now bit-identity, which is testable directly (§ 7). Revision 1's "only the draw order changes" is
   withdrawn.

## 7. Verification: deterministic, against the original stepped policy

1. **Whole runs, switch on vs off (the original code path):** identical rows, every frame (positions, headings,
   modes, crops), the bouts and the ledger totals.
   - Cases:
     - colony122 C2 σ 1.0 (1 h, and 6 h with the activity rows);
     - colony250 6 h activity;
     - C1 on colony112 (no drive);
     - Mailleux at the pilot and the C2-proxy motion, days 1/4/8, independent and shared warm-ups (clone) with
       `followNestmates` and `decompose`;
     - variants: `restShape`, deep rests, `encounterStop`, thirst, `outRate > 0`, `returnRate > 0`, dt 0.025,
       0.05 and 0.1.
   - Short versions go in `npm test`; the long ones are a script with a stamped result.
2. **A per-step differential mode** (`lazyRest.verify`, tests and checks only). On every tick, the original policy
   is also run on a deep copy: mind, RNG snapshot and a freshly built percept. The resulting mind, RNG state and
   action must equal the tick's bit for bit, or the run throws with the ant, the step and the first differing field.
   This places any mismatch at its step, including ones that end-of-run rows could mask.
3. **Deterministic boundary unit tests** against the original functions:
   - encounters: gap 0 and gap = k·dt; an episode lost for exactly 1, 2 and 3 steps, then found again at a full
     call; maturity at `age + dt` = `encounterMin`, at dt 0.025, 0.05 and 0.1;
   - the `parted` expiry at 5 s (and 2 and 10 s), and `giveUpTime` 120 s, at the dt values of the table in § 6;
   - `need === dt` exactly; a spell left at exactly 0; a zero rate; a rest starting partway through a step; the
     first step after an encounter stop;
   - a hazard firing on a tick step: the RNG is restored, and the full call draws the same number;
   - the drive off, σ 0 and σ 1; the first step, with the drive not yet started.
4. **Skip-invariance**, the approved test, is now the special case "switch on = switch off" (item 1), which compares
   with the original rather than with a second new path.
5. **Clone mid-run** with the switch on gives the same continuation as off. Pooled = serial.

**Gate:** the byte-for-byte checks above, run locally (minutes to about an hour). No box run is needed.

## 8. Expected gain

**What a ticked ant no longer costs:**
- percept building (assumed 50–80 % of contact sensing; the adjacency upkeep stays);
- `meet`'s contact scans;
- `decide` and `pick` with their allocations;
- `nestParamsOf`'s spreads;
- the action spreads;
- part of the garbage collection.

**What it still costs:**
- the tick: a few flops, one `exp` for the drive factor, 0–2 RNG draws, and the episode and `parted` loops;
- a non-allocating interoception;
- the change marks;
- the drive, metabolism and the observer, as now.

**Estimate:**
- ≈ 40–45 % of colony122's time removed, so ≈ 1.6–1.8×;
- the 138-ant Mailleux nest alike;
- ≈ 1.25× at 53 nestmates.

**Benchmark (deliverable 3):** the four workloads of § 2, same seeds, off vs on, back to back on an idle machine,
then profiled. Stamped results in `results/`.

## 9. Code touched (in the worktree, delivered as `proposal.patch`)

- **`lasiusNestWorker.ts`:** `restTick`, the encounter update, and `NestAction.lazy`. The original functions are not
  edited, except that the full call returns `lazy` alongside an unchanged action.
- **`colonyBles.ts`:** the switch, the records, the change marks, lazy percept building and the refusals.
- **`contactPairs.ts`:** `senseIncremental` split into the adjacency update (same arithmetic, same order) and
  per-ant percept building. The stepped path calls both for every ant, which is checked byte for byte.
- **`perceive.ts`:** a non-allocating interoception, with the same arithmetic as `interocept`.
- **`colonyStroeymeyt.ts` and `colonyMailleux1999.ts`:** pass-through, and `observe` for the recruiter.
- **Scripts:** a `--lazyRest` flag where the benchmark and the checks need it.
- **Tests:** as § 7.
- **Not touched:** parameters, fits, defaults.

## 10. Out of scope here; possible later

- **Analytic metabolism for resting ants** (≈ 11 % of the profile). It would change the ledger's floating point, so
  it is not bit-identical: its own item, with its own gate.
- **True event skipping with pre-drawn times** (revision 1). Now not worth it: per step it would still need the
  drive factor and the wake checks, so it would gain only a few percent over the tick, at the cost of
  bit-identity, a statistical gate and the stepping-path dependencies.
- **A drive tick:** not needed.

## 11. Results that depend on the stepping path

None change, because the switch is bit-identical:
- the trip calibration;
- C1 vs C2 judging;
- the dt and window gates;
- the STATUS diagnostics.

Runs with the switch on can be mixed with stepped runs, once the § 7 checks pass.

## Implementation notes (2026-10-19, after the user approved rev 2)

- **The record holds the crowding factor, not the count.** `rec.crowd = Math.pow(1 + nStill, -restCrowdExp)`
  replaces `rec.nStill`. It is the same expression on the same inputs as `switchWithin`, so the value is identical,
  and the tick no longer evaluates `Math.pow` each step.
- **Phase A's bail checks run in a different order.** The non-random checks, including `need >= dt`, come before the
  hazard draws, and the RNG snapshot is taken only when a draw will happen.
  - The outcome is unchanged: any bail leaves nothing changed, and the draws, when made, are the original's in the
    original order (trip, then return).
  - The step-by-step tests check this, including mutation checks: a late or early hand-back, or a missing drop
    test, makes them fail.
- **Module layout, changed after the benchmark found a switch-off regression.** The first layout added code to the
  stepped modules. Stepped runs then fell into a slow garbage-collection regime in some runs: 35–38 s against 30 s
  on colony122. Unpatched main does the same when it merely retains extra memory. The cause is V8's
  allocation-site pretenuring, and the regime disappears with `node --no-allocation-site-pretenuring`.
  - The lazy code now lives in its own modules: `LazyColonySim extends ColonySim` (`experiments/colonyLazy.ts`,
    chosen by `newColonySim`), `perception/lazyPerception.ts` and `behavior/lasiusNestRest.ts`.
  - The stepped modules change only by types, `private` becoming `protected`, and `export` keywords.
  - `ColonySim` ignores `lazyRest` (same results, stepped speed). `simulateStroeymeyt` and the Mailleux runners use
    the factory; `runColony` stays stepped.
  - The pretenuring question itself is backlog B022.

## 12. Decisions for the user

1. **Approve revision 2:** an exact per-step tick in place of event skipping.
   - It drops revision 1's separate event streams and drive clock.
   - It keeps the policy-owned contract and the stepped drive.
   - It replaces the statistical gate with bit-identity checks against the original policy.
2. **The item's question and Done-when change accordingly** (mechanism; "statistically equivalent" becomes
   "bit-identical"; no box gate). The README is updated once you approve.
3. **Priority, given § 3:** implement now, or later?
