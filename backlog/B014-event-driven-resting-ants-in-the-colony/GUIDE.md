# Event-driven resting ants in the colony runner: handoff guide

_Written 2026-10-18 ≈ 04:20 UTC (before B014 was filed at 04:21) for the agent working backlog item B014 (its `README.md` holds the scope; this is
the technical background). A work item, not adopted. Context: STATUS Decisions log 2026-10-18 (speed-up attempt
≈ 04:09 and the discussion after it)._

## Goal

Make colony runs faster by not doing per-step work for in-nest ants that are resting. About 95 % of in-nest ants
are still at any time. The aim is a switch that is **off by default**. It is needed before the Mailleux 1999 step-5
fit, whose colonies are about 10× the Stroeymeyt ones (**corrected 2026-10-19:** the real 1999 colonies were; the simulated 1999 nests hold 23–138
nestmates, so the step-5 saving is small: `DESIGN.md` § 3); C2's step-4 fit runs on the stepped code and is not
waiting for this.

Expected gain: **≈ 1.5–2×** on Stroeymeyt colony runs, possibly more with the drive tick below. The per-step work
resting ants could avoid is roughly a third to a half of the profile. Measure; don't assume.

## Read first (in this order)

1. `AGENTS.md` (§ Who decides what, Conventions, Gotchas) and `backlog/PROTOCOL.md`. **Every rule there applies.**
2. `docs/STATUS.md` ▶ RESUME HERE, then the Decisions log entries from 2026-10-18 (C2, the speed-up attempt).
3. `src/sim/experiments/colonyBles.ts`, `ColonySim.step`: the step loop, in order.
   1. Advance the latent drive for every ant (`stepDrive`).
   2. Build the contact grid and sense contacts (`senseAllContacts`, incremental since 2026-10-18).
   3. Perceive: resting ants get `perceiveResting`, a cheap percept.
   4. Run the policy for every ant (`lasiusNestWorker` in the nest, `lasiusForager` outside).
   5. Move (`walkAnt` unless the action stands).
   6. Share food between agreeing pairs.
   7. `metabolise` every ant.
   8. Trips: leaving and returning.
   9. The observer frame (`colonyStroeymeyt.ts` `onStep`: the frozen tracker, noise and pixel rounding, every 0.5 s,
      for every ant).
4. `src/sim/behavior/lasiusNestWorker.ts`: `decide`, `switchWithin` (the unit-rate exposure clock), `meet`,
   `restDepth`, `returning`.
5. `src/sim/mind/drive.ts` and `src/sim/perception/contactPairs.ts`.
6. Tests that pin behaviour: `test/contactGrid.test.ts` (fast path vs full scan), `test/drive.test.ts`,
   `test/packingArms.test.ts`, `test/colonyClone.test.ts`, `test/colonyInvariants.test.ts`,
   `test/architecture.test.ts` (perception boundary).

## Hard constraints

- **Default off, bit-identical.** With the switch off, every existing test, fit file and committed result must
  reproduce exactly. Pooled results must stay bit-identical to serial ones, and new randomness must come from
  per-ant, per-purpose streams (`RNG.stream(seed, purpose, ant)`), never from shared streams.
- **Perception boundary.** Behaviour (`src/sim/behavior/`) reads only percepts, mind and interoception; the runner
  must not reach into the policy's logic. A clean shape: the policy returns, with its action, the earliest time it
  next needs to be consulted (a "quiet until" hint) plus the inputs that would wake it early. The runner then skips
  calling it until that time or until one of those inputs changes. The policy owns the decision; the runner only
  schedules.
- **The main checkout is read-only for this item** (backlog protocol). Develop in a separate git worktree outside
  it (e.g. `git worktree add ../ants-b014 -b b014-event-rest <base commit>`; the base is the commit holding the C2
  preparation, named in the README's Base). Deliver the change as `proposal.patch` in this folder, with its tests
  in the patch. Notes, scripts, results and Progress go in this folder. Never apply the patch to the main tree:
  the user (or a lead agent at the user's request) does.
- **Don't disturb running work.** Never touch the box worktree `/root/ants-w7` or its runs, and never kill pool
  workers by name (AGENTS.md gotchas). Local compute is niced.
- **The user decides.** The design (deliverable 1) goes to the user before implementation. Pre-registrations that
  bear on the main line go in STATUS, written by a lead agent. No box runs, no fits, no commits.
- **Model vs numerics.** Anything that changes the model (the drive tick below) is a model change, logged and
  decided by the user, never slipped in as an optimisation.

## What a resting in-nest ant does every step today

Each needs an event-driven treatment, or must stay stepped:

| Process | Where | Today | Event-driven treatment |
|---|---|---|---|
| Walk-on (wake) | `switchWithin` | exposure clock `stay.spell` consumed at rate × dt | Wake time = now + spell / rate while the rate is constant; recompute at any rate change. Exact. |
| Crowding in the rate | `restCrowdExp` | stopped nestmates in contact, each step | Changes only when the contact set or a partner's moving flag changes, so it's an event. |
| Latent drive (C2) | `stepDrive`, `driveFactor` | OU advanced every step, rate × exp(σz − σ²/2) | **Changes every step: no exact skip.** Option: a drive tick Δ (e.g. 1 s), z held constant between ticks, an exact OU update at each tick. **A model change for the user.** Rests are then evaluated at ticks and on events (≈ 20× fewer than at dt 0.05). |
| Rest depth | `restDepth` | gamma draw once per rest | Unchanged (one draw per rest). |
| Trip departure (foragers) | `decide`, `outRate` | `rng.hazard` every step | Exponential event time from its own stream; redraw not needed (memoryless). |
| Return to source | `returning`, `returnRate` | hazard every step (0 in Stroeymeyt, > 0 in Mailleux) | Exponential event, with the conditions (`sinceGive` vs `giveUpTime`, `ingested`) as wake inputs. |
| Sharing start | `decide` | each step: a partner in contact offering / soliciting, own thresholds | Wake on contact-set change, a partner's signal change, or own threshold crossing (metabolism). |
| Encounter bookkeeping | `meet` | ages and unseen times of contact episodes each step | Advance lazily by the skipped time at the next evaluation. Check exactly what `encounterMin` / `encounterGap` mean for an ant that wakes mid-episode. |
| Clocks | `modeTime`, `stay.sinceGive`, `stay.parted[].since` | += dt each step | Advance lazily; `parted` entries expire at `partRefractory`, so that's an event. |
| Metabolism, water | `metabolise` (physics) | every step for every ant, with ledger moves | **Keep stepped in a first version** (ledger arithmetic; analytic integration changes floating point everywhere and the conservation checks). It also drives the hunger and thirst thresholds the policy needs, which are wake inputs. |
| Observer | `colonyStroeymeyt.ts` | every frame for every ant | Unchanged (it is the measurement). |

Suggested first version: **lazy policy evaluation**.
- A resting ant is consulted only when its next event is due, or when a wake input changes: contact set, a
  partner's signals or moving flag, own threshold crossings, a drive tick if adopted, or leaving the nest region.
- Clocks are advanced lazily.
- Physics (metabolism) and the observer stay stepped.

Measure the gain before going further.

## Randomness

Event-driven draws differ from per-step hazard draws, so the switch-on results are **statistically**, not
bit-for-bit, equivalent to stepping. Give each new event type its own per-ant stream, so that adding one never
shifts another. With the switch on, a run must still be bit-identical between pooled and serial execution, and
between repeated runs.

## Validation (pre-register with the user before running)

1. **Unit tests:**
   - switch off = bit-identical rows (as `test/drive.test.ts` does for σ = 0);
   - a lone resting ant's rest lengths under a constant rate match the exponential / Lomax expectation (as the
     rest-length test in `test/drive.test.ts`);
   - each event type fires at its rate;
   - clocks after a skip equal the stepped values;
   - pooled = serial.
2. **Equivalence gate, event-driven vs stepped** (a new gate in the style of the dt gate): the 36 Stroeymeyt rows
   (`checkS2018Window.ts`-style comparison, `--candidate C2`) and the trip statistics (`calibTrips --check`).
   - The runs are not paired (different draws), so compare per-colony means over many seeds.
   - Rule proposal for the user: the 90 % bootstrap CI of the difference inside ±0.5 SE_data, per row.
   - Size the seeds from the 2026-10-18 gate results: the persistence rows need many runs.
3. **Before step 5:** the same comparison on the Mailleux 1999 rows (`fitM1999.ts` / `reportM1999.ts` set-up).
4. **Benchmark:** the profile method in CLAUDE.md (`node --cpu-prof … vite-node`, sum self time) on the largest
   Stroeymeyt colony and on a Mailleux colony, before and after, back to back on an idle machine.

## Results that depend on the stepping path (if the switch is ever used)

- **`data/fits/s2018-trips.json`** (trip calibration, simulated through the colony runner, an input to C2):
  recalibrate or show equivalence (validation step 2 covers the trip statistics).
- **C1 vs C2 judging** must use one scheme for both: rerun C1's judging run (`diagS2018 --candidate C1 --rows 36
  --fit … --seeds judge`), about 1 h on the box, not a refit.
- **Untouched:** E1, all E2 fits, the E6 TEC reference and the frozen tracker do not use the colony runner. The
  Mailleux 1999 pilots are tools, never adopted. The STATUS diagnostics remain records of the stepping model.

## Deliverables and stopping points

1. `DESIGN.md` in this folder: the wake-input list, the event types and their streams, the drive-tick question,
   and the equivalence-gate rule. **Stop: the user approves.**
2. The implementation behind the switch, with tests, as `proposal.patch` (developed in the separate worktree):
   `npm test` and `npx tsc --noEmit -p .` pass there, and switch-off bit-identity is shown.
3. A local benchmark (`results/`, stamped) and the Findings. **Stop: the user decides on the gate run (box) and on
   adoption.**
