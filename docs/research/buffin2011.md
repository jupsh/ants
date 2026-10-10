# Buffin, Mailleux, Detrain & Deneubourg 2011 — trophallaxis durations

*Insect. Soc.* 58:177–183, doi:10.1007/s00040-010-0133-y. "Trophallaxis in
*Lasius niger*: a variable frequency and constant duration for three food
types". Full text read 2026-10-10 (PDF supplied by the user, not in the
repo). **Role: parameter and structure source** (user decision 2026-10-10;
STATUS). None of its results can serve as a test.

## Set-up
- Four queenless, broodless colonies of 500 workers (Brussels, Oct 2004),
  Janet nests 11.5 × 12.5 × 0.5 cm, 22 ± 3 °C, normally fed 1 M sucrose ad
  libitum plus half a mealworm twice a week.
- Colonies starved 4 days. Two groups of 20 workers taken at random: one
  group had 2 h access to the food (1 M sucrose, a protein solution, or 1 M
  melezitose), the other to water only. Then 20 fed + 20 starved workers
  together in a **Petri dish 5 cm in diameter** (≈ 19.6 cm², ≈ 2.0
  workers/cm²), filmed 30 min (×4). Control: 20 + 20 starved.
- Replicates: control 13, sucrose 16, protein 19, melezitose 12.
- **Trophallaxis (observation definition):** contact at the mandibles; the
  donor has opened mandibles, and the receiver is in contact with the
  donor's labrum **for more than 3 s**. In star-shaped trophallaxis (several
  receivers) only the first receiver is counted. Partners' nutritional
  state known from the marking (fed group marked or not, alternately).

## Results used
- **Durations are exponential** (survival D(t) = k e^(−pt), r² 0.93–0.99):
  the probability of ending a trophallaxis per unit time is constant, not
  dependent on how long it has lasted, and does not depend on the food
  type. It depends on the partners' hunger states. k ≈ 1.03–1.10 is
  consistent with the > 3 s observation threshold: k = e^(p·t₀) gives
  t₀ ≈ 1–2 s.
- The table note says "probability of stopping equals 1/P min⁻¹", but the
  numbers only make sense as **p in s⁻¹**: sucrose fed→starved p 0.039 with
  mean duration 29 s (3 s threshold + 1/0.039 = 28.6 s). Read as s⁻¹ here.
- **Table 2, sucrose** (mean ± SD; p with 95 % interval; n):
  - fed donor → starved receiver: **29 ± 28 s; p 0.039 /s (0.037–0.041);
    n 66**
  - fed → fed: 33 ± 31 s; p 0.034 (0.032–0.037); n 21
  - starved → starved: 17 ± 14 s; p 0.058 (0.051–0.065); n 13
  - starved → fed: 21 ± 10 s; n 3 (insufficient)
- Protein: fed→starved 31 ± 27 s, p 0.031; fed→fed 15 ± 14 s; starved→
  starved 21 ± 12 s; starved→fed 29 ± 28 s.
- Table 1 (all pairs, by food): sucrose p 0.036, protein 0.035, melezitose
  0.037, control 0.050 (n 56, 41, 17, 22). The printed 95 % bounds for
  protein (0.036–0.038), melezitose (0.041–0.046) and control
  (0.057–0.071) do not contain their point values: errors in the paper's
  Table 1. Table 2's fed→starved values are self-consistent and are the
  ones used.
- SD ≈ mean in every fed-donor row: consistent with exponential.

## Results seen but not used (frequencies; recorded as seen)
- Number of trophallaxes per 30 min depends on food: sucrose highest;
  control and melezitose lower. The cumulative count is linear in time
  (constant initiation rate) in all conditions.
- Frequency depends on partners' state: fed donor → starved receiver most
  frequent (sucrose and protein).
- Ingested volumes: sucrose 0.9 µL (quoted from Portha et al. 2004),
  protein 0.5 µL, melezitose 0.6 µL.

## How it bears on our model
- **Structure:** our bouts end at a constant hazard `shareEnd` (plus
  endings when the donor runs out, the receiver is full, the partner
  leaves, or flow stalls). Buffin supports the constant-hazard structure,
  and shows the hazard depends on hunger state, not food type.
- **Value:** fed donor → starved receiver, 1 M sucrose, 4-d starved:
  observed total ending hazard 0.039 /s (mean ≈ 26 s beyond the 3 s
  threshold). In the model, the observed hazard is `shareEnd` plus the
  other ending causes, so 0.039 /s is an **upper bound** for `shareEnd`
  in that context. Donors had 2 h of ad lib food (full crops), so running
  out within one bout is unlikely there.
- **Conflict with the pilot:** both pilot runs pinned `shareEnd` at its
  lower bound (1/1200 s ≈ 0.0008 /s), about 45× below Buffin's hazard. The
  1999 fit is buying long bouts that independent data do not show. That
  points at bout *initiation* or encounter dynamics, not bout ending.
- **Differences to keep in mind:** 1 M sucrose here vs 0.6 M in 1999; a
  dish of 40 workers, not a recruiter entering a nest; donors fed ad lib
  for 2 h, not a single 3 µL drop; observation threshold 3 s (our contact
  rule is ≥ 1 s antennal; a trophallaxis observer needs the 3 s mandible
  rule).
