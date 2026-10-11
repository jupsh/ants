# Decisions log, 2026-10-10 night (archived 2026-10-11)

Moved verbatim from `docs/STATUS.md` on 2026-10-11 (STATUS cleanup). These
entries cover the STATUS split, the late-signal test, the pilots (pilot,
pilot2, pilot3), Buffin 2011, Plan 4 options A and B, the B diagnostic and
the choice of Stroeymeyt et al. 2018. Their rules still in force are
collected in STATUS § Rules in force; the Stroeymeyt entries from the
colony split onwards stay in STATUS. Earlier entries:
[`STATUS-2026-10-07-to-10.md`](STATUS-2026-10-07-to-10.md).

**2026-10-10 night — STATUS split and scripts archive (user request).**
- The full previous STATUS moved verbatim (with `git mv`) to
  `docs/archive/STATUS-2026-10-07-to-10.md`. This file was rewritten
  around the current state, the agreed plan and a **Rules in force**
  section that collects the rules currently applied (each traceable to a
  dated archive entry). Evidence policy, contamination log and criteria
  carried over verbatim, with the 2026-10-09/10 contamination additions
  summarised.
- 20 finished one-off scripts and superseded fits moved to
  `scripts/archive/` (index in its README; imports fixed; they still
  type-check and run). Provenance strings and comments that named them
  were updated (`lasiusM1.ts`, `e1TurnChecks.ts`), as were CLAUDE.md and
  README.

**2026-10-10 night — late-signal test: not confirmed** (`diagDtHandshake.ts`,
80 paired recruiters per start point, 4 d; `logs/diag-handshake-d4.log`).
- What the handshake lag would lengthen barely moves at dt 0.1 vs 0.025:
  waiting in unanswered invitations +0.50 ± 0.27 s (start 1) / −0.01 ±
  0.23 s (start 2); dry bout starts +0.40 ± 0.19 / +0.03 ± 0.18; giving
  with flow −0.34 ± 1.05 / +0.05 ± 0.21 s. At most ≈ 0.5 s of a ≈ 5 s
  (1 SE_data) timeInNest shift. Contacts ≥ 1 s: +0.24 ± 0.31 /
  −0.29 ± 0.99.
- Resting (+10.4 ± 4.9 / −3.5 ± 2.2 s) and the whole stay (+7.9 ± 11.7 /
  −8.1 ± 4.3 s) differ in sign between start points: no resolved effect.
  At n 80 the test cannot resolve a 2–5 s stay shift.
- **Reading:** pilot condition 5 is not triggered (no confirmed cause, so
  there is nothing to fix before the pilot-point gate). The timeInNest and
  contacts dt dependence remains **unexplained**. The gate at the pilot
  optimum measures it where it matters. If dt 0.1 fails there, the refits
  run at the coarsest passing dt (0.025 at worst), and the encounter
  redesign (Plan 4) is the next suspect, since it replaces the meeting
  dynamics. A larger decomposition (n ≈ 1600, on the box after the
  pilot) runs only if the pilot-point gate fails on these rows.

**2026-10-10 night — user review of the late-signal result: wording, two additions, one caution (logged before acting).**
- **Stronger wording (replaces "not confirmed" above):** the handshake
  lag is **ruled out as the main cause** of the timeInNest dt shift. The
  parts it would lengthen were measured precisely (start 1: unanswered
  invitations +0.50 ± 0.27 s, dry starts +0.40 ± 0.19) and explain at most
  ≈ 0.5 s of a ≈ 5 s shift. Nothing is read into the n 80 whole-stay or
  resting differences: start 2's −8.1 ± 4.3 s points the opposite way from
  the n 1600 gate (+0.39 SE), and start 1's resting +10.4 ± 4.9 s is as
  likely noise.
- **Code check (user):** every random switch in the nest policy uses the
  exact per-step probability 1 − e^(−rate·dt) (`rng.hazard`), so
  step-scaled probabilities are ruled out. What remains dt-dependent is
  contact geometry checked once per step: detection, a former partner
  becoming eligible again only once contact is lost, and partner choice
  each step. That is the meeting dynamics the redesign would replace.
- **Addition 1 — is 0.025 itself converged?** If dt 0.1 and 0.05 both
  fail at the pilot point, run **0.025 vs 0.0125** on the failing rows
  (contacts, timeInNest), same equivalence rule, before any refit. If that
  fails too, a smaller step does not fix it: back to finding the cause
  (decomposition, redesign) before any refit.
- **Addition 2 — decomposition, pre-registered now, run at the pilot
  point** (n 1600 per day per level, paired seeds, same levels as the
  gate; per-row paired mean differences with SE). Parts of the stay:
  (a) **stay** = timeInNest; (b) **unload** = entry → first step with
  crop ≤ `giveFrac` × capacity, censored at the stay; (c) **after
  unload** = stay − unload; (d) **bout time** = time in give or receive
  mode; (e) **give-wait** = give mode without flow; (f) **rest** = time in
  rest mode; (g) **contacts ≥ 1 s** (the fit row). It is run whenever the
  gate at the pilot point fails on contacts or timeInNest. It only
  locates the shift, and does not decide anything by itself.
- **Caution on the redesign (Plan 4):** its case is narrower. The
  late-signal argument is gone. What remains is the ≥ 1 s contact rule
  (chosen after seeing simulated durations) and whether the pilot needs
  extreme parameter values. If the dt effect disappears after a redesign,
  it is logged as **removed, not explained**, unless the decomposition
  first locates it in the meeting dynamics.
- **Decomposition implemented** (not yet run at a real point):
  `M1999Options.decompose` → `M1999Recruiter.parts` (unload, unloaded,
  bout, giveWait, rest; recorded by the observer, nothing else changes,
  test in `test/m1999.test.ts`); `scripts/decompM1999.ts [--fit f]
  [--levels 0.1,0.025] [--n 1600]` uses the dt gate's seeds and design, so
  it decomposes exactly the recruiters the gate compares; it prints paired
  differences only (no means, as the gate). It was smoke-tested at n 8 on
  the start points, mechanics only, not a result.
- **Disclosure (provenance):** the box sources were synced (3cc9be1:
  the inert `decompose` option, shown by test not to change results) while
  the pilot was running from d8090cc. The running process keeps its
  loaded code, but `fitM1999.ts` computed provenance (simHash, commit) at
  **write** time, so the pilot file will record the 3cc9be1 sources.
  Fixed for future runs: provenance is taken at launch. **From now on:
  no syncing of `src/` to the box while a run is going.**

**2026-10-10 night — pilot, start 0 finished: σ diverged, parameters at bounds (diagnostic reading; no loss is reported as fit quality, condition 1).**
- Seen (`logs/pilot-main.log`, after the cut-off was frozen): start 0 ran
  60 generations; CMA-ES σ grew from 0.97 to 285. The averaged mean drifted
  (encoded units) −64 nestSpeedFactor, +71 returnRate, +99 shareRate, −276
  shareEnd, +17 receiveReserve, −37 reserveSd, +1.5 density. Start 1 has
  begun.
- Reading: the bounded transform is logistic, so far from 0 a parameter
  sits at its bound and the loss is flat; CMA-ES then random-walks with
  growing σ. Start 0 pinned **nestSpeedFactor at its lower bound (0.02),
  returnRate at its upper bound (1 /s), shareRate at its upper bound,
  shareEnd at its lower bound (1/1200 /s), reserveSd at its lower bound**.
  That is the pattern of the void first fits (returnRate max, shareEnd
  min), and the "extreme values" input to Plan 4 (encounter redesign).
  Caveats: start 0 only; with σ ≈ 285 the averaged mean is unreliable
  beyond "at a bound".
- **Fitting-method issue** (relevant to the recovery test, Plan 3): on
  the logistic plateau σ diverges, and "mean of the last 30 generation
  means" becomes meaningless. Candidates, to decide after the pilot: σ cap
  or restart on divergence, bounds handled by reflection or penalty
  instead of saturation, and a convergence flag in the fit file.
- No action until the pilot finishes (start 1 and the IPOP restart).

**2026-10-10 night — papers supplied by the user; CMA-ES fix adopted as the plan (user: "I like that").**
- **Read in full (methods only, no ant data):**
  - Sakamoto & Akimoto 2017, Trans. Jpn. Soc. Evol. Comput. 8(2):23–35
    (Mod-BCH box-constraint handling for CMA-ES).
  - Auger & Hansen 2005, CEC (IPOP-CMA-ES restart criteria; bounds by
    penalty; flat regions as needle-in-a-haystack).
  - Carrella 2021, JASSS 24(2):7 ("No free lunch when estimating
    simulation parameters").
- **Adopted plan for the fitting method (before the recovery test, Plan 3):**
  (1) replace the logistic bound transform in CMA-ES with Mod-BCH:
  search in the box coordinates, evaluate an infeasible point at its
  clipped point, plus the penalty (1/n) Σ γᵢ (xᵢ − x_feasᵢ)², γ adapted
  from the normalised IQR of recent losses (trimmed median, uniform
  decrease); unit tests on the paper's bounded sphere / exponential cases
  with the optimum on a bound; (2) stop and restart on σ divergence, and
  record per run in the fit file whether it converged; (3) check whether
  the failed E2 L0S1c recovery (`boutFastUl` ×9.1) shows the same
  plateau signature. Implementation waits until the pilot finishes (the
  pilot's own reading uses the current method).
- **Proposal from Carrella (not adopted; for the user):** a
  reference-table identifiability check. Draw parameter sets over the
  whole box, simulate the 15 rows for each, and predict each parameter
  from the rows by cross-validated regression (random forest / GAM).
  Performance < 0.3 for every method → the parameter is not identified.
  This is global, unlike the local Jacobian whose noise floor left 5–6 of
  7 directions undecided. The same runs serve as the global sensitivity
  analysis and as a cheap recovery test for any number of synthetic
  targets. Cost ≈ one fit (≈ 1000 draws).
- **Two in-nest *L. niger* data papers (abstract-level findings already
  exposed; roles to be set by the user before further results are read):**
  - Buffin, Mailleux, Detrain & Deneubourg 2011, Insect. Soc. 58:177–183,
    "Trophallaxis in *Lasius niger*: a variable frequency and constant
    duration for three food types". Listed in `lasius-niger.md` as an
    evidence gap (trophallaxis durations). **Exposure in the assistant's
    earlier reply:** the abstract says food type changed exchange frequency
    but not duration, and the per-time stopping probability was constant.
    No numerical duration distribution or transfer rates were read; those
    remain an evidence gap.
  - Mailleux, Buffin, Detrain & Deneubourg 2011, Insect. Soc.
    58:559–567, "Recruitment in starved nests: the role of direct and
    indirect interactions between scouts and nestmates in *L. niger*".
    **Prior exposure (now registered):** a second-hand summary (Bles
    thesis) in `mailleux-rules.md` §7: ≈ 30 % of fed nestmates lay
    pheromone at 4 and 8 d, not at 1 d; nest exits rise with starvation
    independently of direct contacts. The assistant's earlier reply also
    relayed the original abstract's qualitative claim that prior antennal
    or trophallactic contact did not affect nest exits and that a chemical
    signal was implicated. Statistics on those findings count as
    contaminated in any test; further full-text results remain unread.
- **User (2026-10-10 night): roles of both 2011 papers undecided**; they
  stay unread beyond the title pages.
- **Pilot start 1 finished (22:18):** σ again grew instead of shrinking
  (peak ≈ 37, final 16; start 0: 285). Drift (encoded): **shareEnd −38
  (pinned at its lower bound again)**; the others moved little (−1.2
  nestSpeedFactor, +2.9 returnRate, −0.7 shareRate, +0.35 receiveReserve,
  −1.7 reserveSd, −1.8 density). Not converged. The IPOP restart (λ 18)
  started from the better run. No loss is reported as fit quality
  (condition 1).

**2026-10-10 night — user decisions: roles of the 2011 papers; noise handling (logged before acting).**
- **Buffin et al. 2011 → parameter and structure source**, read in full
  now, before the redesign decision (Plan 4). What is taken from it is
  logged here; its frequencies are recorded as seen.
- **Mailleux et al. 2011 → held-out colony test** (registered in the
  contamination log above). Methods only, after the model structure is
  frozen, to decide which of its measures the model can produce.
- **Noise handling decided after the recovery test.** First the bound fix
  (Mod-BCH, divergence restart, convergence flag). Only if recovery shows
  noise-limited estimates: re-evaluation (more recruiters per evaluation,
  adaptive as in RA-CMA-ES; Uchida, Nishihara & Shirakawa 2024, GECCO,
  arXiv:2405.11471, abstract read) by default, population-size
  adaptation (PSA-CMA-ES, Nishida & Akimoto; abstract supplied by the
  user) as the alternative. Reason: our loss noise is roughly additive
  near the optimum and roughly multiplicative far from it; under
  multiplicative noise, population-size adaptation can miss the true
  optimum, while re-evaluation does not (Uchida et al.).

**2026-10-10 night — Buffin et al. 2011 read (parameter source); what we take; proposal.**
Extraction in `docs/research/buffin2011.md`.
- **Seen:** set-up (4-d starved; 20 workers fed 2 h on 1 M sucrose,
  protein or melezitose, plus 20 starved, in a 5 cm dish, 30 min);
  trophallaxis = mandible contact with the donor's labrum > 3 s, first
  receiver only. **Durations are exponential** (a constant stopping hazard,
  independent of elapsed time and food type, dependent on hunger state).
  Sucrose fed→starved: 29 ± 28 s, hazard 0.039 /s (0.037–0.041), n 66;
  fed→fed 0.034; starved→starved 0.058. Frequencies (food- and
  state-dependent, constant initiation rate) recorded as seen, not used.
  Table 1's printed confidence bounds are inconsistent (paper error);
  Table 2 is used.
- **Structure taken:** bouts end at a constant hazard. This is our
  `shareEnd` structure, so bout ending needs **no redesign**.
- **Conflict with the pilot:** both pilot runs pinned `shareEnd` at
  1/1200 s ≈ 0.0008 /s, ≈ 45× below Buffin's observed hazard. The 1999 fit
  buys bouts that independent data do not show. This points Plan 4 at bout
  **initiation and encounter dynamics**, not at bout ending.
- **Proposal (Claude; for the user):** `shareEnd` leaves the free set
  (k = 6 for the refits). It is set from a small **Buffin-dish
  calibration**: the nest chamber with 40 workers (≈ 2 /cm², as the dish),
  20 with full crops of 1 M sucrose and 20 starved, 4-d reserves, 30 min,
  a trophallaxis observer as Buffin (mandible contact > 3 s, first
  receiver), and `shareEnd` chosen so the observed fed→starved ending
  hazard is 0.039 /s. The model's other bout endings add to the observed
  hazard, so `shareEnd` ≤ 0.039. Provenance: derived (Buffin 2011, Table
  2). Sensitivity at 0.037 / 0.041. Until the calibration exists, 0.039 /s
  is the interim value (an upper bound).

**2026-10-10 night — pilot finished; condition 4 met; gate at the pilot point.**
- **Pilot (22:26, 4040 s, 2205 evaluations):** starts 0 and 1 diverged
  (σ 285 / 16). The IPOP restart converged (σ 0.21, drift ≤ 0.17 encoded).
  Point: nestSpeedFactor 0.044, returnRate 0.85 /s, shareRate 0.0123
  µL/s, shareEnd 1/1200 (at bound), receiveReserve 0.933, reserveSd 0.124,
  density 0.495 /cm². **Caveat:** the restart started from start 1's end,
  where shareEnd sat at −41.9 encoded (on the logistic plateau); with a
  starting SD of 0.3 it could not return. So "shareEnd at bound" is
  inherited from start 1's drift. The direction (low shareEnd) is
  consistent across both starts; that the bound itself is needed is not
  shown. File copied back (`data/fits/colony-m1999-main-shared-pilot.json`,
  log `logs/pilot-main.log`). No loss reported as fit quality.
- **Condition 4** (`scripts/checkPilotM1999.ts`, pilot seed namespace,
  n 240 per day, shared design, dt 0.025, warm-up 900): 1-d no-bout
  14.2 % (limit 21.8 %), 4 d 4.6 %, 8 d 3.3 %; no row beyond |fitZ| 5 →
  **usable as gate point.** `reportM1999.ts` now passes the fit's dt (it
  re-ran every fit at dt 0.1, a bug for non-default dt).
- **dt 0.1 vs 0.025 at the pilot point (n 1600): not shown equivalent, but
  no row shifts by more than 0.30 SE_data.** Shifts with CIs excluding 0:
  contacts 1 d / 8 d −0.27, trophTotal 8 d −0.19, contactsBefore 1 d
  −0.16. Failures are CIs slightly wider than ±0.5 (timeInNest 4 d / 8 d,
  distance, contacts 4 d, contactsBefore 4 d). At the start points the
  shifts were 1–4 SE.
- **Warm-up 300 vs 900: a real effect at 1 d** (timeInNest +0.45, CI
  0.25–0.64; distance +0.65, CI 0.24–1.11); other rows within ±0.31. So
  warm-up 900 (the pilot's) stays; 300 is out.
- **Launched (pre-registered branches, plus one check by the user's
  0.025-vs-0.0125 argument applied to warm-up):** dt 0.05 vs 0.025;
  decomposition dt 0.1 vs 0.025 (the gate failed on timeInNest and
  contacts); warm-up 900 vs 1800.

**2026-10-10 night — follow-up runs at the pilot point (7-parameter model; a record only, see below).**
- dt 0.05 vs 0.025: not shown equivalent; no systematic shift beyond 0.43
  SE (distance 1 d, CI includes 0); failures are wide CIs (distance).
- Decomposition dt 0.1 vs 0.025 (n 1600): stay −1.7 / −0.9 / −2.2 s
  (± 1.3); the shift sits in **after unload** (−1.5 / −0.75 / −1.85 ± 0.5
  s); contacts ≥ 1 s −0.25 / −0.09 / −0.17 (± 0.08); give-wait −0.04 s;
  bout time and rest within 2 SE. So leaving after unloading starts
  sooner at dt 0.1 (returnRate 0.85 /s here).
- Warm-up 900 vs 1800: distance 1 d +0.40 (CI 0.03–0.77), contacts 8 d
  +0.23 (CI 0.03–0.45); not shown equivalent. 900 s is not settled for
  distance at this point (slow nest walkers, nestSpeedFactor 0.044).

**2026-10-10 night — user review of the Buffin proposal: four changes and three smaller points (adopted; logged before acting).**
1. **Pair ending rate = 2 × shareEnd** (verified: `lasiusNestWorker.ts`
   line 178, each partner draws `rng.hazard(p.shareEnd, dt)`; the other
   then sees `partnerOut`). Matching Buffin's 0.039 /s needs **shareEnd =
   0.0195 /s per ant** (kept per ant, symmetric; it extends to
   per-partner hunger dependence). The pilot's 1/1200 per ant is a pair
   rate of 1/600: **≈ 23× below Buffin, not 45×** (correction).
2. **Uncertainty:** with 66 exponential bouts, SE(p) ≈ p/√n ≈ 0.0048,
   exact 95 % ≈ 0.030–0.048 (Buffin's 0.037–0.041 likely comes from
   regressing log survival, treating curve points as independent and
   pooling 16 replicates). Sensitivity: pair rate 0.030 and 0.048
   (shareEnd 0.015 / 0.024). Context differences (1 M vs 0.6 M sucrose,
   ad-lib donors, dish vs nest) are probably larger and are disclosed.
3. **Bout diagnostic at the pilot optimum (pre-registered here, under pilot
   condition 1; not judged, not compared with the 1999 rows):** for the
   recruiter's bouts and for all bouts, durations of bouts > 3 s, the
   ending cause of each bout (donor depleted, receiver satiated, stall,
   random hazard, other), and SD/mean of the durations. Arithmetic
   (user): at shareRate 0.0123 µL/s and receiveReserve 0.93, a near-full
   recruiter needs ≈ 130 s to give 1.6 µL, and at a pair rate of 1/600 /s
   only ≈ 1 bout in 5 ends at random within that time. So most bouts may
   end by depletion, satiation or stall, with bunched (not exponential)
   durations. Total trophallaxis 56–66 s is about two Buffin-length bouts.
   If confirmed, the conflict with Buffin is in the **shape** of the
   duration distribution, which points at shareRate and the volume and
   hunger rules, not at bout initiation. **Plan 4 is decided on this
   evidence**, not on where shareEnd stopped.
4. **shareEnd is set directly** (pair rate = Buffin's), not tuned in a
   dish (dish-tuning would depend on the still-free shareRate; Buffin's
   exponential shape itself says duration-dependent endings are rare
   there). **The dish becomes a check at each optimum:** a 3 s-threshold
   observer estimates p as Buffin did (log-survival slope) and by maximum
   likelihood; pass if consistent with 0.039 and SD ≈ mean. If other
   endings are common at the fitted shareRate, Buffin's fed→starved
   durations become a **fit row in the joint fit** instead.
   "First receiver only" matters only if donors can feed several
   receivers at once (they cannot now).
- **Hunger state:** Buffin's rate depends on it; we use one constant. Fine
  for fed→starved at 4 d; the 1-d and 8-d receivers of 1999 are an
  extrapolation (disclosed). Buffin's fed→fed 0.034 vs starved→starved
  0.058 suggests a moderate effect.
- **k = 7 → 6:** the frozen profile cut becomes 3.84 × max(1, L_min / 9)
  (15 rows − 6 parameters); free set: nestSpeedFactor, returnRate,
  shareRate, receiveReserve, reserveSd, density.
- **The pilot cannot be the gate point for the 6-parameter model** (its
  optimum is the 7-parameter model's). Its condition-4 result and the gate
  results above describe the old model only. **A new pilot with shareEnd
  fixed runs after the Mod-BCH bound fix.**

**2026-10-10 night — Mod-BCH and the 6-parameter set-up implemented; new pilot pre-registered.**
- **CMA-ES:** Mod-BCH box constraints (option `bounds`), `tolUpSigma`
  divergence stop, `stopReason` per run; tests on Sakamoto & Akimoto's
  bounded sphere and exponential cases (optimum on the boundary;
  objective never sees an infeasible point). Unchanged without bounds
  (existing tests pass).
- **shareEnd = 0.0195 /s per ant** in `lasiusM1.ts` (derived, Buffin 2011;
  pair rate 0.039; sensitivity 0.015 / 0.024). This also changes the E6
  colony default (provisional 1/60 before).
- `fitM1999.ts --bch --fix shareEnd`: box coordinates [0, 4] per free
  parameter (log-linear where log-scaled), Mod-BCH, tolUpSigma 20; per run
  the stop reason, convergence flag and γ; `fixed` recorded. Tagged runs
  now draw seeds with a tag-specific key (0x9170 kept for 'pilot').
- **Bout diagnostic, 1 d (pilot-1 point, 200 recruiters):** 97 % of the
  recruiter's bouts > 3 s end by **donor depletion**; durations > 3 s mean
  37 s, **SD/mean 0.52** (exponential ≈ 1; Buffin ≈ 1); ≈ 1 bout per
  recruiter. This confirms the user's arithmetic: the conflict with Buffin
  is in the shape (depletion-ended bouts). Days 4 and 8 still running.
- **New pilot, pre-registered (pilot conditions 1–6 apply unchanged):**
  `fitM1999.ts --layer main --dt 0.025 --warmup 900 --bch --fix shareEnd
  --tag pilot2 --gens 60`, k = 6. Launched before days 4 and 8 of the bout
  diagnostic finish (user: use the idle box). If the bout evidence leads
  to a model change under Plan 4, pilot2 is void and rerun.

**2026-10-10 night — bout diagnostic complete (pilot-1 point, 200 recruiters per day); Plan 4 decided on it (Claude, as the user asked).**
- Recruiter bouts > 3 s: 1 d mean 37 s, SD/mean 0.52; 4 d 52 s, 0.40; 8 d
  51 s, 0.47. **Ending causes: donor depleted 97 / 97 / 92 %**, receiver
  satiated 0 %, stalled 0 %, random or other 3 / 3 / 8 %. ≈ 1.0–1.05
  recruiter bouts per recruiter. All bouts in the nest show the same
  pattern. (Box copies of days 4 and 8 were launched before the local run
  finished; redundant, same seeds.)
- **Reading:** bouts start readily (one per recruiter, no stalls,
  give-wait ≈ 0) and end when the recruiter's crop empties, so durations
  are bunched rather than exponential. The conflict with Buffin is in the
  duration *shape*, produced by depletion-ended bouts at a low pair ending
  rate. Nothing here implicates bout initiation or encounter dynamics.
- **Plan 4 decision: no encounter redesign now.** With shareEnd fixed at
  Buffin's rate (pilot2), most bouts should end at random (pair mean ≈
  26 s) before the crop empties. Unloading then needs more bouts, so the
  fit must reach the 1999 totals through shareRate and re-initiation. Two
  checks decide whether the volume and hunger rules need a change:
  pilot2's fit (rows, bounds) and the Buffin-dish check at its optimum
  (log-survival slope and ML rate consistent with 0.039, SD/mean ≈ 1).
  The ≥ 1 s contact rule remains a separate, observer-level reason for a
  stop-and-antennate addition; it is not decided here.

**2026-10-10 night — user review of the bout diagnostic: corrections (logged before acting).**
- **Correction 1 (wording above):** the diagnostic confirms the
  *conclusion* (depletion ends most bouts, bunched durations), but the
  user's arithmetic's **premise was wrong**: recruiters do not arrive near
  full (1.6 µL over ≈ 130 s). Mean bouts of 37 s (1 d) and 52 s (4 / 8 d) at
  0.0123 µL/s mean ≈ 0.45–0.65 µL given per recruiter.
- **Correction 2 (Plan 4):** "no encounter redesign now" is replaced by
  **deferred to pilot2's evidence**. At a pair ending rate of 0.039 /s
  (mean 26 s), ≈ 75–85 % of recruiter bouts should end at random before
  depletion, so a recruiter needs ≈ 2 bouts (consistent with 56–66 s of
  total trophallaxis). The fit then rests on bout *initiation*: finding a
  second partner, the part-after-a-bout rule. That is what Plan 4 is about.
  Inputs at pilot2's optimum: (a) whether it still needs extreme values;
  (b) the bout diagnostic rerun there; (c) the dish check.
- **Other extreme values at the pilot-1 point (to watch in pilot2):**
  returnRate 0.85 /s (top of [1/1200, 1]; recruiter leaves ≈ 1 s after
  unloading, the phase where the dt shift sat); nestSpeedFactor 0.044
  (near its floor 0.02; in-nest walking ≈ 1.5–2.4 mm/s depending on the
  baseline speed taken); receiveReserve 0.93 (almost every nestmate
  counts as hungry). A published in-nest walking speed (parallel track b)
  could fix nestSpeedFactor as Buffin fixed shareEnd.
- **Onward food flow (user):** "all bouts" was only ≈ 8–14 % above the
  recruiter's own bouts. **Likely partly an artefact:** the diagnostic
  counts only bouts that end during the recruiter's stay, and receivers
  would pass food on mostly afterwards. Check before the structure is
  frozen: `diagBoutsM1999.ts --follow s` keeps counting for s seconds after
  the recruiter leaves and reports onward bouts (donor = a nestmate that
  received from the recruiter).
- **Dish check, pre-registered pass rule** (`scripts/checkDishBuffin.ts`,
  run at each optimum, 200 dishes): |z| ≤ 2 for the ML ending rate vs 0.039
  (SE 0.039/√66 ⊕ the simulation's bootstrap SE over dishes), and |z| ≤ 2
  for SD/mean vs 28/29 (data SE from a parametric bootstrap of 66
  shifted-exponential durations ⊕ the simulation's SE). Buffin's
  log-survival slope is reported beside it. Disclosed: donors' reserves
  kept at the 4-d level (2 h of feeding may have refilled them); 46
  workers in the nest chamber (≈ 2.0 /cm², as the dish). **Mechanics run
  at the pilot-1 point (5 dishes, old model, development only):** ML rate
  0.035 /s (z −0.8), slope 0.047, SD/mean 0.56 (z −3.9) → fails on shape,
  as the bout diagnostic predicted.
- **Onward flow checked (pilot-1 point, 40 recruiters per day, `--follow
  600`):** nestmates the recruiter fed start 35 / 57 / 56 onward bouts
  (1 / 4 / 8 d) against 42 / 46 / 46 recruiter bouts; 83–95 % of them
  after the recruiter's exit; all non-recruiter bouts 70 / 128 / 142. **The
  "8–14 %" was the observation window**, not a lack of onward flow. To be
  rerun at pilot2's optimum with the bout diagnostic.

**2026-10-10 night — pilot2 finished (k = 6, shareEnd fixed at Buffin's rate, Mod-BCH); condition 4 NOT met.**
- **Run (23:40):** starts 0 and 1 grew σ to 6.4 / 7.2 (box range 4) while
  the loss was still falling, and stopped at the 60-generation cap; γ stayed
  uniform (the mean never sat outside the box for long). The IPOP restart
  settled (σ 0.22, drift ≤ 0.17) but also stopped at the cap, not tolX.
  Point: nestSpeedFactor 0.030, returnRate 0.625 /s, shareRate 0.0276
  µL/s (2.2× pilot-1), receiveReserve 0.959, reserveSd 0.67, density 0.73
  /cm²; shareEnd 0.0195 fixed. Extreme values persist (nestSpeedFactor
  closer to its floor, receiveReserve closer to 1, returnRate high).
- **Condition 4** (`checkPilotM1999.ts`, generalised to any pilot tag and
  its own seed key): 1-d no-bout 12.9 % (met), 4 d 5.4 %, 8 d 2.9 %; **rows
  beyond |fitZ| 5: trophTotal at 1, 4 and 8 d, and contacts at 4 d → NOT
  usable as gate point.** Per condition 4: no gate at pilot2; a stage-3
  "not adequate" signal. The failing rows are reported here; the model
  change is logged before acting.
- **Reading so far:** with bouts ending at Buffin's rate, the model cannot
  reach the 1999 total trophallaxis (56–66 s). The bout diagnostic
  (`--follow 600`) and the dish check at pilot2's optimum are running;
  they show whether the recruiter fails to re-initiate after a random
  ending (Plan 4: encounter and initiation) or something else.

**2026-10-10 night — pilot2 diagnostics; the Plan 4 evidence.**
- **Bout diagnostic at pilot2** (200 recruiters per day, `--follow 600`):
  recruiter bouts per recruiter 1.6 / 2.0 / 2.0 (1 / 4 / 8 d); bouts > 3 s
  mean 12 / 15 / 15 s, SD/mean 0.58–0.65; ending causes donor depleted
  65 / 55 / 57 %, random or other 35 / 45 / 43 %; onward bouts 281 / 412 /
  431 (most after the recruiter left).
- **Dish check at pilot2: FAIL.** ML ending rate 0.085 /s (z 9.4 vs 0.039),
  log-survival slope 0.103, SD/mean 0.54 (z −4.2). At shareRate 0.0276
  µL/s Buffin's 0.9 µL donors run out in ≈ 25 s, which truncates bouts.
- **Re-initiation** (`diagBoutsM1999.ts`, gap stats added; 80 per day):
  stays with ≥ 2 recruiter bouts 29 / 42 / 37 of 80; gap to the next bout
  after a random ending mean 32 / 23 / 20 s (median 24 / 11 / 12 s).
- **Reading:** the fit doubled shareRate so the recruiter empties fast,
  sacrificing total trophallaxis (the failing rows). The 1999 data imply
  ≈ 0.5–0.9 µL at ≈ 0.01 µL/s, so ≈ 50–65 s in about two Buffin-length
  bouts. At 4 d, 80 s in the nest with 66 s of trophallaxis leaves ≈ 14 s
  for reaching a partner, the gaps and leaving. The model's gap after a
  random ending is > 20 s on average: the old partner is excluded until
  contact is lost, so the recruiter must find another one, walking ≈ 1 mm/s
  (nestSpeedFactor 0.03) in a sparse nest (density 0.73 /cm² vs E6's 2.3).
  The density is held down by the contacts row, which ties the failure to
  the ≥ 1 s contact rule. pilot-1 avoided all this by never ending bouts.
  **Plan 4 points at bout initiation and encounters**, as anticipated.

**2026-10-10 night — Plan 4 decision (user): A now, design B in parallel (logged before acting).**
- **A, refractory parting:** after a bout ends, the former partner is
  excluded until contact is lost **or** a refractory time τ has passed,
  whichever comes first (now: only until contact is lost). New nest
  parameter `partRefractory` τ, **estimated 5 s** (no source; sensitivity
  2 / 10 s); τ = ∞ restores the old rule. The invariant "no restart with a
  former partner while in contact" becomes "not within τ". The pair may
  resume, and Buffin's observer would score each resumption as a separate
  trophallaxis (cf. 1999's "one long main trophallaxis" of ≈ 40–60 s vs
  Buffin's 26 s mean).
- **pilot3:** as pilot2 (k = 6, shareEnd fixed, Mod-BCH, dt 0.025, warm-up
  900, 60 generations, `--tag pilot3`) on the model with A. Then condition
  4, the bout diagnostic (with re-initiation gaps) and the dish check at
  its optimum.
- **B, stop-and-antennate encounters:** designed in parallel, parameters
  from the literature (parallel track b); not implemented yet.
- **Adoption rule (fixed now):** adopt whichever of A and B passes
  condition 4 and the dish check without parameters at or near bounds
  (within 5 % of the box ends). If neither passes, B is required (and
  revised).
- **A implemented:** `Stay.parted` holds `{ id, since }`; a former partner
  becomes eligible when contact is lost or `since` ≥ `partRefractory`
  (`NestParams`, estimated 5 s in `lasiusM1.ts`). Unit test (eligible after
  τ while still in contact); invariant suite updated ("no restart within τ
  while in contact"); 106 tests pass. **E2 report (600 scouts, main layer)
  bit-identical** to the post-wall-fix one (so neither the shareEnd change
  nor A touches E2). pilot3 launched.

**2026-10-10 night — Plan 4 option B (stop-and-antennate encounters): design draft and literature needs (not implemented).**
- **Mechanism:** when two nest workers come into antennal range head-on
  or head-to-side, each stops with a probability (or always) and
  antennates for a duration; within the encounter each decides from the
  other's signals (offer / solicit) whether to start a bout; otherwise
  they part. The contact rows count these encounters (replacing the ≥ 1 s
  overlap rule, which then becomes a sensitivity check). Density is then
  free to be realistic, because brushing past no longer counts as a
  contact.
- **Values needed (from the literature, not fitted):** antennation
  duration per encounter (s); probability of stopping on contact;
  in-nest walking speed (would also fix nestSpeedFactor); interaction rate
  vs density (a check on the encounter kinetics); nest density of
  1000–2000-worker colonies in Janet nests (would fix the 1999 density).
- **Candidate sources (searched 2026-10-10 night; abstracts only, full
  texts paywalled):** Nicolis, Theraulaz & Deneubourg 2005, Anim. Behav.
  69:535–540 (L. niger interaction rate vs density, kinetic encounter
  model, transient clusters); Depickere et al. 2004, Insect. Soc. (L.
  niger aggregation, brood-tenders vs foragers; a starvation paper by the
  same group); Davidson & Gordon 2017, J. R. Soc. Interface (harvester
  ants, collision-theory framework). A Camponotus japonicus traffic study
  reports 2.6 s to resolve a head-on encounter (other genus, outside the
  nest). Czaczkes et al. 2024 (L. niger): antennation in 100 % of
  nestmate encounters (no durations in the abstract). **Not to be used:**
  Mailleux et al. 2011 (held-out). Mailleux et al. 2010 (Anim. Behav.,
  recruiter or recruit) would need a role first.

**2026-10-10 night — option B prepared: sources read, spec proposed (logged before implementing; implemented switched off).**
- **Roles (user):** Nicolis et al. 2005 and Depickère et al. 2004 (Insect.
  Soc.) are parameter and structure sources, read in full; Depickère et
  al. 2008 and Mailleux, Sempo et al. 2011 are held-out candidates,
  unread (contamination log). Extraction: `docs/research/encounters-aggregation.md`.
- **What the sources give** (Depickère 2004, L. niger, arena, not
  starved): a walking ant that meets another **stops (p = 1)**; walking
  ants also stop spontaneously at **pS**; a stopped ant leaves at
  **pL = a·N^−b**, N = ants in the stop. Foragers: pS 0.08 /s, a 3.9,
  b 1.36 (lone stop 0.26 s), moving speed 3.67 ± 1.48 cm/s.
  Brood-tenders: pS 0.11 /s, a 0.4, b 1.16 (lone stop 2.5 s), 2.91 ± 0.96
  cm/s. Nicolis 2005 (4-d starved, 25 °C): pair lifetimes 0.27–0.53 s
  (the paper's two values disagree), speed with pauses 2.56 cm/s.
- **What it says about the pilots:** every sourced speed is 20–35× the
  fitted in-nest speed (nestSpeedFactor 0.03–0.044, ≈ 1–1.6 mm/s). The
  fit has been buying "slow" where the sources say "fast, with frequent
  stops". Encounters last well under 1 s, so the ≥ 1 s contact rule
  counts something other than encounters.
- **Spec (proposed; B1–B3 need user approval before any B fit):**
  - Structure: an `active` nest worker stops (→ `rest`) at the **onset**
    of antennal contact with a nestmate, with probability `encounterStop`
    (1). A stopped ant leaves at `restToActive × N^−restCrowdExp`, with
    N = 1 + nestmates in antennal contact that are not walking (new
    percept `moving`). Walking ants stop spontaneously at `activeToRest`.
    Ants in `leave` mode (heading out) do not stop (assumption). The
    trophallaxis decision is unchanged: it runs whenever two ants are in
    contact, so during an encounter stop too.
  - **B1, castes:** foragers get the forager values and nestmates get the
    brood-tender values. The recruiter is a forager. Nestmates are
    brood-tenders by default, set by `foragerFrac` (default 0; sensitivity:
    all foragers). It's a trait drawn at set-up from its own stream.
  - **B2, speed:** per-caste in-nest speed factors, **derived** by
    bisection so that the walker's mean speed over 3-s moving paths in an
    open arena equals 3.67 / 2.91 cm/s, at the E6 context. This replaces
    the free `nestSpeedFactor`.
  - **B3, observer:** a contact is an antennal-contact episode with a
    nestmate lasting ≥ 0.04 s (Depickère's video precision), for both
    contact rows. ≥ 1 s becomes a sensitivity check.
  - **Free under B (k = 5):** returnRate, shareRate, receiveReserve,
    reserveSd, density. Fixed: shareEnd (Buffin), stop rates and speeds
    (Depickère). The profile cut becomes 3.84 × max(1, L_min/10) (k = 5).
  - **Implementation check (not a test; the sources are read):** in a
    lone-pair and a lone-ant set-up, the model's lone-stop and duo-break
    rates reproduce the input values (e.g. brood-tender duo 0.36 /s).
  - **Defaults keep the current model:** `encounterStop` 0,
    `restCrowdExp` 0, no forager overrides, and no extra random draws, so
    pilot3 and E2 are unchanged (to be confirmed bit-identical).
- **Conflicts to watch:** sourced pL is from lit arenas at 0.1 /cm², not
  a dark nest at ≈ 0.5–2 /cm²; brood-tenders may rest far longer in the
  nest. A slow recruiter can now come only from encounters, crowding and
  trophallaxis. If B cannot reach the distance rows (5–9 cm per stay),
  that is a finding to report, not something to fix by freeing the speed.
- **Implemented (switched off by default; 111 tests pass):**
  - Percept `moving` and the encounter memory `Stay.touching`.
  - Trait `forager`: the recruiter has it whenever forager values are
    set; for nestmates it's drawn only if `foragerFrac` > 0.
  - Nest parameters `encounterStop`, `restCrowdExp`, `foragerFrac`,
    `forager` (overrides) and `nestPauseFactor`.
  - `nestPauseFactor` is new, beyond the spec above: under B the walker's
    own E1 pauses are off in the nest, because Depickère's stops include
    all pauses (a forager's lone stop lasts 0.26 s). Keeping them would
    count stops twice.
  - Preset `LASIUS_NEST_B` (`lasiusM1.ts`, sourced values); references
    `depickere2004` and `nicolis2005`.
  - `fitM1999.ts --model B` fixes nestSpeedFactor, takes contactMin 0.04
    by default (B3), and records model and contactMin in the fit file.
    The judging and check scripts take contactMin from the fit file.
  - **Defaults are bit-identical:** a colony run and 1999 recruiters at
    pilot2's point (dt 0.025), and the E2 report (600 scouts, main layer).
  - **B2 speed factors** (`calibNestSpeed.ts`, 2000 paths): the
    E6-context walker with pauses off walks 4.54 ± 1.80 cm/s over 3-s
    paths. Factors: **forager 0.809** (3.67 ± 1.45 cm/s vs Depickère's
    ± 1.48) and **brood-tender 0.641** (2.91 ± 1.15 vs ± 0.96). The SDs
    are reported, not used.
  - **Implementation check** (`checkStopsB.ts`; 20 ants, half foragers,
    4 × 30 min, dt 0.025). Walk-on hazards match a·N^−b for 0–3 stopped
    nestmates within 2 SE, after the discretisation (1 − e^(−r·dt))/dt;
    e.g. brood-tender 0.404 / 0.186 / 0.104 / 0.079 vs 0.400 / 0.179 /
    0.112 / 0.080. In-nest spontaneous stops are 0.113 / 0.084 vs 0.11 /
    0.08 /s.
  - Invariant suite: a B case was added and passes. Smoke run on the
    1999 set-up: completes, ≈ 7 s per nest of 4 recruiters. No fit-row
    statistic was computed or seen.
- **Before a B fit:** user approval of B1–B3 and of `nestPauseFactor` 0.
  Then a B pilot (as pilot3, `--model B --tag pilotB`; k = 5) and
  condition 4, the bout diagnostic and the dish check, under the adoption
  rule.

**2026-10-10 night — option B spec approved (user; logged before the B pilot).**
- **B1 (castes): approved.** The recruiter uses the forager values and
  nestmates use the brood-tender values. Both come from the same paper, so
  the castes are consistent. Sensitivity: all nestmates foragers
  (`foragerFrac` 1).
- **B2 (derived speeds 0.809 / 0.641): approved.** Speed is not freed
  again: if B misses the distance rows (5–9 cm per stay), that is reported
  as a finding.
- **B3 (observed contact = antennal-contact episode ≥ 0.04 s): approved,
  with disclosure.** Like the 1 s rule, this threshold was chosen with the
  model in view. The 0.04 s figure is Depickère et al. 2004's video
  precision, and no simulated contact durations under B were looked at
  when choosing it. Sources: pair lifetimes 0.27–0.53 s (Nicolis 2005)
  and duo break rates 0.38–3.72 /s (Depickère 2004). ≥ 1 s stays as a
  sensitivity check (`--contactMin 1`).
- **Decision (not in the original spec): walker pauses off in the nest
  under B** (`nestPauseFactor` 0, derived). Depickère's stop process
  (spontaneous stops at pS, walk-on at a·N^−b; a forager's lone stop lasts
  0.26 s) is measured from video at 0.04 s, so it includes the short pauses
  the E1 walker produces itself. Keeping both would count stops twice. The
  B2 speeds were derived with pauses off for the same reason (3-s
  *moving* paths). Outside the nest the walker keeps its pauses.
- **Main risk (agreed):** stop rates measured in lit arenas at ≈ 0.1
  ants/cm² may not carry over to a dark nest at 0.5–2 /cm². Density is
  free; a distance miss is informative.
- **Running B beside pilot3:** in a separate checkout on the box
  (`~/antsB`), only if pilot3 is far from done. Workers are split; kills
  only by pid; each run's provenance and sim hash are recorded from its own
  checkout.
- **B pilot set-up (decided):**
  - **Not run beside pilot3.** Pilot3 is using 230 of the box's 245 CPUs,
    about halfway (start 0 done at 60 generations; start 1 and the
    restart remain), so a split would have only ≈ 15 workers.
  - **Separate clean checkout:** `~/antsB` is a git clone of 89c8255 from
    a bundle, clean, with node_modules copied. Its runner `runPilotB.sh`
    runs the fit as pilot3 plus `--model B --tag pilotB` (60 generations,
    SIM_WORKERS 230), then condition 4, the bout diagnostic (200 per day,
    `--follow 600`) and the dish check (200 dishes).
  - **Start:** a local watcher starts it once pilot3's check job has
    exited, unless a fit is still running.
  - **Box check:** the B stop-rate check runs on the box.
- **Sim hash note:** the local working copy hashes differently
  (ccb2970b…) from any clone (a2985fa3…, box = clean local clone). The
  local-only Khuong segmentation port in `src/sim/reference/` is counted
  by `simHash`. Compare run hashes on clean clones. The port is not used
  by the colony runs.

**2026-10-10 night — pilot3 (option A) result: A fails the adoption rule.**
- **Fit** (k = 6, shareEnd fixed, Mod-BCH, dt 0.025, warm-up 900, 60
  generations; `colony-m1999-main-shared-pilot3.json`):
  - Selection-batch loss 366.0. Runs: start 0 1357, start 1 381,
    restart 366. All three stopped at the generation cap without
    converging. Pilot2 reached 317.6 on the model without A.
  - Point: nestSpeedFactor 0.244, returnRate 1.00, shareRate 0.0139,
    receiveReserve 1.00, reserveSd 0.99, density 1.13.
  - **returnRate and receiveReserve are at their upper bounds.**
  - Provenance: the old rsynced `~/ants` checkout (commit 18b7866, dirty,
    simHash 8a1ebee9…), as for pilot2.
- **Adoption rule (fixed in advance):** a parameter at a bound fails it,
  whatever condition 4 and the dish check show. **A is not adopted.**
  Those checks are still being run and logged for the record. Per the
  rule, B is required.
- **B pilot launched** in `~/antsB` once pilot3's fit had ended. The dish
  check runs alongside it on one CPU.
- **Pilot3 checks (for the record; A is already out on the bound rule):**
  - **Condition 4: NOT met.** 1-d no-bout fraction 8.3 % (met), 4 d
    2.1 %, 8 d 1.7 %. Rows beyond |fitZ| 5: timeInNest 1 d, distance 4 d
    and 8 d, contacts 4 d, trophTotal 1 d.
  - **A did what it was meant to do.** After a random ending, the gap to
    the next recruiter bout is now 2.1–2.5 s on average (median 1.2–1.4
    s); pilot2 had 20–32 s. 118 / 161 / 153 of 200 stays have ≥ 2
    recruiter bouts (pilot2: 29 / 42 / 37 of 80).
  - Recruiter bouts > 3 s average 18–20 s (SD/mean 0.70–0.76). Endings:
    donor depleted 35–48 %, random or other 52–65 %. Onward flow: 268 /
    435 / 505 bouts by fed nestmates.
  - **Dish check: FAIL**, but closer than pilot2. ML ending rate 0.050 /s
    (z 2.28 vs 0.039; pilot2 z 9.4); log-survival slope 0.061; SD/mean
    0.65 (z −3.07; pilot2 −4.2). Durations are still less variable than
    exponential: some bouts are cut short by the donor running out.
  - **Reading:** re-initiation is no longer the bottleneck. The 1999 fit
    still pins returnRate and receiveReserve at their bounds, and the
    distance rows now fail (nestSpeedFactor 0.244). Fixing re-initiation
    alone does not make the 1999 rows reachable, which is consistent with
    the missing stop mechanism that B adds.

**2026-10-10 night — B diagnostic: sourced motion misses the 1999 distance and contact rows at every density (the agreed main risk).**
- **Why I looked:** at generation 10 the B pilot's best loss was still
  42,600, against 53,000 at generation 0, with the median rising. So I
  computed the day-4 fit-row means locally at B's starting values (24
  recruiters per density, dt 0.025, warm-up 900, contactMin 0.04, seed
  77). These are fit rows, so this is not a contamination; it is disclosed
  here.

  | density /cm² | timeInNest (80) | distance cm (5.9) | contacts (3.3) | trophTotal (66) | contactsBefore (1) |
  |---|---|---|---|---|---|
  | 0.25 | 190 | 442 | 67 | 55 | 7.0 |
  | 1 | 116 | 115 | 62 | 42 | 4.5 |
  | 3 | 130 | 70 | 150 | 43 | 8.5 |
  | 6 | 119 | 78 | 255 | 42 | 16.2 |

- **Reading:**
  - Distance is ≥ 12× the data at every density.
  - Contacts (≥ 0.04 s) are 20–75× the data.
  - The free parameters (returnRate, shareRate, receiveReserve,
    reserveSd) act mainly on time in the nest and trophallaxis. None of
    them can slow the walking.
  - The 1999 recruiter covers ≈ 0.4 cm/s outside trophallaxis
    (5.9 cm in ≈ 14 s). Under B it covers 1–1.5 cm/s.
  - The arena-sourced rates (Depickère: lit arena, ≈ 0.1 /cm²) don't
    carry over to the 1999 nest.
  - Per the agreement, speed is not freed again.
  - Two candidate explanations, both untested:
    1. Crowding: the model has no body exclusion, so ants pass through
       each other at any density, whereas a nest of 1000–2000 workers is
       packed.
    2. The 1999 observers counted contacts more selectively than "any
       touch ≥ 0.04 s". The ≥ 1 s sensitivity rule gave 3–6 per stay
       under A.
- **Adoption rule:** B will not pass at these values ("if neither passes,
  B is required and revised"). Next steps wait for the user's decision:
  whether to stop the running B pilot, and which way to revise B.

**2026-10-10 night — B pilot stopped; 1999 methods read; distance-sampling sensitivity; packing (user decisions and order).**
- **B pilot stopped (user).** I killed only its process tree, by pid
  (runner 258301 and 233 descendants). The box is idle and the local
  watcher is stopped. No fit file was written, so the diagnostic above is
  the record.
- **Mailleux 1999 methods** (public PDF, p. 76, re-read 2026-10-10):
  - Distance: "le parcours effectué par la fourmi est suivi et mesuré par
    programme informatique" (the path is tracked and measured by
    computer). Filmed at ×2. **No sampling interval given.**
  - Contacts: "le nombre et la durée des contacts antennaires" (number and
    duration of antennal contacts). **No minimum duration or other
    criterion given.**
  - So the observer is not settled by the methods. Per the user's rule:
    B3 (any antennal contact ≥ 0.04 s) stays primary as the reading
    closest to "antennal contacts"; ≥ 1 s stays a sensitivity analysis and
    is not chosen because it lands near the data.
- **Distance vs tracking interval** (sensitivity only, not an observer
  choice). New observer option `distanceSamples`: path length through
  positions sampled every Δ s, with a test. Day 4, 24 recruiters, seed 77;
  values in cm, data 5.9:

  | point | walked path | 0.5 s | 1 s | 2 s | 5 s | 10 s |
  |---|---|---|---|---|---|---|
  | B start, density 1 | 115 | 87 | 66 | 44 | 25 | 18 |
  | B start, density 3 | 70 | 53 | 42 | 28 | 18 | 14 |
  | pilot3 (A) point | 18 | 16 | 13 | 11 | 9 | 7.5 |

  A coarse interval shrinks the walked path a lot. Still, B is 7–11× the
  data at 1 s and 2–3× even at 10 s. Sampling is not the explanation.
- **Packing (user's estimate, agreed):** a worker covers ≈ 0.04–0.05 cm²,
  so 1–2 /cm² is 5–10 % of the floor, far from jammed. B still walks
  78 cm at 6 /cm². Body exclusion is worth adding later for accuracy but is
  not expected to close the gap. Not built now.
- **Conclusion (the agreed risk):** arena motion does not carry over to
  the 1999 nest. B needs in-nest motion from the literature (resting
  fractions, in-nest walking speeds and stop durations), not a freed
  speed. Candidates, not read, roles needed:
  - **Stroeymeyt et al. 2018** (Science 362:941; doi:10.1126/science.aat4793):
    automated in-nest tracking of whole *L. niger* colonies. Data on
    Zenodo (doi:10.5281/zenodo.1322669, CC-BY 4.0). Could give in-nest
    speeds, active fractions and stop durations, or serve as held-out
    colony data.
  - **Planckaert et al. 2019** (Sci. Rep. 2019; doi:10.1038/s41598-019-52019-6):
    spatiotemporal trophallaxis in starved *L. niger* nests. Same lab and
    probably the same experiments as E6 (Bles et al. 2022), so reading it
    would be E6 development exposure.
  - **Lenoir & Ataya 1983 / Lenoir 1979:** about half of *L. niger*
    workers are "hypoactive" in the nest (author's later recollection,
    unverified).
- **Box data secured before release.** All 76 files from the box's
  `~/ants/logs`, `~/ants/data/fits` and `~/antsB/logs` are in
  `logs/box-2026-10-10/` (local, not committed; checksums match). Of these,
  46 logs and 2 fit files were not already local. The two fits
  (`colony-m1999-{main,alt}.json`, 2026-10-10 morning, k = 6, independent
  design, warm-up 300) are the superseded first refits, from before the
  7th parameter, shared warm-ups and the wall fix. They are kept for the
  record only. Committed fit files (pilot, pilot2, pilot3) already match
  the box.

**2026-10-10 night — new literature filed; Stroeymeyt 2018 data downloading; roles pending.**
- **Box destroyed (user)** after the archive above. Nothing runs remotely.
- **Filed in `literature/`** (git-excluded; the user's downloads, renamed
  to the folder's convention; one duplicate Greenwald copy removed,
  identical MD5). Only title pages and citation lines were read.
  - *L. niger* data, **`_ROLE-PENDING`** in the file name:
    Stroeymeyt et al. 2018 (Science 362:941), Planckaert et al. 2019
    (Sci. Rep. 9:15620), Lenoir & Ataya 1983 (Z. Tierpsychol.
    63:213–232).
  - Other species or methods, structure sources only, never targets:
    Greenwald et al. 2018 (eLife 7:e31730; *Camponotus sanctus*, crop
    loads), Baltiansky et al. 2023 (eLife 12:e77659; *C. sanctus*,
    forager movement in the nest), Mersch et al. 2013 (Science
    340:1090; *C. fellah*, spatial fidelity), Poissonnier et al. 2019
    (eLife 8:e48945; *Linepithema humile*, traffic under crowding),
    Grimm et al. 2005 (Science 310:987; pattern-oriented modelling).
- **Disclosure (Lenoir & Ataya 1983):** the scan has no text layer, so
  to identify it I rendered page 1, which shows the English abstract. It
  verifies the citation above (the earlier "unverified" note). The abstract
  is qualitative: 5 young colonies, 225 marked ants; nurses, foragers and
  a large "reserve" group; activity levels exponential within tasks and
  log-normal overall, with a few hyperactive workers. No numbers seen. It
  does not state the "about half hypoactive" figure.
- **Stroeymeyt et al. 2018 data** (Zenodo, CC-BY 4.0): the download is
  in progress in the repo root (`zenodo-data*`, git-excluded `/*.zip`).
  Nothing opened, including its README. When it finishes it goes to
  `data/stroeymeyt2018/` (raw archive not committed; size and licence
  checked first).
- **Roles (proposed below; approved by the user, 2026-10-10 night):**
  - **Stroeymeyt 2018** is the main candidate for in-nest motion. Proposal:
    split by colony, with fit/development colonies for in-nest speeds,
    resting fractions and stop durations, and held-out colonies for a
    colony-level test. The split is registered here after reading only the
    README and methods, before any track is opened.
  - **Planckaert 2019:** probably the same experiments as E6. Proposal:
    leave it unread, like E6 development, until the overlap is checked
    from the methods alone.
  - **Lenoir & Ataya 1983:** proposal: development (structure source for
    the in-nest resting fraction), since its abstract has already been
    seen.
- **Next (approved):** once the download finishes, read the Stroeymeyt
  data README and the paper's methods only, move the data to
  `data/stroeymeyt2018/`, and register the colony split here before any
  track is opened.
