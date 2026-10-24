> **Superseded (2026-10-24, D142).** This draft was migrated into plied records (`plied/`, view
> `plied/README.md`, `plied frontier`) and brought up to D141; plied is now the record of open work, commitments
> and questions. Draft labels map to plied ids as follows (cite the plied ids from now on):
>
> - **Commitments:** P1 → P01 · P2 → P02 · P3 → P03 · P4 → P04 · P5 → P05 · P6 → P06 · P7 → P07 · P8 → P08 · P9 → P09 · P10 → P10 · P11 → P11 · P12 → P12 · P13 → P13 · P14 → P14 · P15 → P15 · P16 → P16 · P17 → P17 · P18 → P18 · P19 → P19 · P20 → P20 · P21 → P21 · P22 → P22 · P23 → P23 · P8b → P24 (P8b is P24).
> - **Questions:** Q1 → Q01 · Q2 → Q02 · Q3 → Q03 · Q4 → Q04 · Q5 → Q05 · Q6 → Q06 · Q7 → Q07 · Q8 → Q08 · Q9 → Q09 · Q10 → Q10 · Q11 → Q11.
> - **Threads:** T0 → T001 · T1 → T002 · T1.1 → T003 · T2 → T004 · T3 → T005 · T3.1 → T006 · T3.1a → T007 · T3.1b → T008 · T3.1c → T009 · T3.1d → T010 · T3.1e → T011 · T3.1f → T012 · T3.1g → T013 · T3.1h → T014 · T3.1i → T015 · T3.2 → T016 · T3.2a → T017 · T3.2b → T018 · T3.2c → T019 · T3.2d → T020 · T3.2e → T021 · T3.2f → T022 · T3.3 → T023 · T3.3.1 → T024 · T3.3.2 → T025 · T3.3.3 → T026 · T3.3.4 → T027 · T3.3.4a → T028 · T3.3.4b → T029 · T3.3.4c → T030 · T3.3.4d → T031 · T3.3.5 → T032 · T3.3.4e → T033 · T3.3.6 → T034 · T3.3.7 → T035 · T4 → T036 · T4.1 → T037 · T5 → T038 · T2.1 → T039 · T5.1 → T040 · T5.2 → T041 · T5.3 → T042 · T5.4 → T043 · T6 → T044 · T6.1 → T045 · T6.2 → T046 · T6.3 → T047 · T6.4 → T048 · T6.5 → T049 · T7 → T050 · T7.1 → T051 · T7.2 → T052 · T7.3 → T053 · T7.4 → T054 · T7.4a → T055 · T7.5 → T056. T6.5 is new: the review of the decisions `plied check` flags. Part D's children had no
>   labels here; in the map they are T3.3.4a Stage 0, b sensitivity (c), c sensitivity (d), d robust S3, e Stages 1–3.

# Thread tree — draft (2026-10-24, revision 2)

A trial of the `threads/` idea, drawn by hand from `docs/log/` (to D138), `findings/` (to F093), `backlog/` and
STATUS. STATUS's RESUME stops at D133; D134–D138 are taken from the log. Nothing here is a new decision: every node
points to the record it summarises, and the record wins where they differ. If the shape works, each node becomes a
file with frontmatter and this view is generated.

Revision 1 (user review, 2026-10-24): resolved items removed from the waiting list (preprint storage, P11); the
synchrony blocker linked to P3, with P4 kept as its own obligation; P6 and P8 restated as recorded; scheduling and
approval separated; `closed` redefined; parentage separated from blocking; T3.2a and Part D (c) relabelled.

Revision 2 (lead review, 2026-10-24, questions resolved under D138):
- brought up to D137: the S2 audit design written (D136), the brood allowlist frozen (D137), the contact split
  running;
- recorded wording restored (T3.2, T3.2a, P1, P4);
- P2 tied to the runs it bears on; P12 partly addressed;
- the publication branch completed (paper 1, the parked three, corrected dependencies);
- missing items added: the E6 ensemble rule against D104, the rows 1 / 4 scope, D135 rule 1, the E2 and E6
  conditions, Part D's later-stage conditions, the Mailleux 1999 extraction;
- status model: `blocked` folded into `waiting`; `next`, `actor`, `uses` and `carries` added; commitment states
  defined; decisions waiting on the user get their own ids (Q).

---

## 0. Status model

Each node carries independent fields; none implies another.

- **`status`** (the work's state):
  - `open`: nothing named stops it. Whether it is being done now is `next`, not `open`;
  - `waiting`: on something named in `waiting_on`: a user decision (`Qn`), another node's outcome, a commitment or
    an event;
  - `held`: not to start yet, by a decision. It says nothing about approval;
  - `parked`: set aside on purpose, with its revisit trigger if one was recorded;
  - `closed`: **the work concluded and its outcome is recorded**, whatever the outcome: answered, not answered in
    this pipeline, failed, or stopped by a rule.
- **`next`** (open nodes only): a position in the lead's queue, citing the record that set the order (now D134).
  **`actor`**: lead, user or another agent.
- **`approval`**, only where a decision gates execution: `approved` / `not approved` (with the record). Neither
  `held` nor a cleared `waiting_on` grants approval.
- **`outcome`** (closed nodes): one line quoted from the record, with its id.
- **`carries`** (closed nodes): failures or limitations still unresolved after the node closed, as finding ids.
  Closing a line of work does not resolve what it failed to explain. These feed STATUS's disclosed limitations and
  paper 3.
- **Relations.** `parent` is organisational only. A closed parent may have open children, and closing a child
  never reopens its parent (step 5 reopens only under its own rule). `waiting_on` is explicit and blocks (⟵ below).
  `uses` marks a dependency that does not block (⇠ below): the node needs the other's results as they come.
- **Backlog leaves** show the item's own status in brackets, e.g. `[backlog: done]`, read from the item file. The
  node's status may differ: an item can be done while a decision about its result (adopting a patch) waits on the
  user. That decision is the node's, not the item's.

---

## 1. Tree

Backlog statuses are copied here for the draft; the generated view reads them from the backlog files. Labels such as
T3.2b show tree position only; the files get flat ids (§4).

```
T0  M1: L. niger reproduces food collection and sharing with local information        open
│   end state: calibrated and stress-tested, failures disclosed (2026-10-10 night)
│
├── T1  E1 walking                                                                     parked (paused 2026-10-09, F047);
│   │                                                                                  no revisit trigger recorded
│   └── T1.1  data orientation, axis tilt (B010) [backlog: blocked]                    held ⟵ T1 (P13)
│
├── T2  E2 drinking and trail laying (L0S1c main, L0S1 alt)                            parked (provisional; F044–F046)
│   └── T2.1  reopening triggers and shared failures (P6)                              waiting ⟵ T5 for (a), (b) and the
│                                                                                      shared failures; (c) ⟵ Q4
│
├── T3  Colony model in the nest                                                       (organisational)
│   ├── T3.1  In-nest motion from Stroeymeyt (step 4)                                  closed: "C2 selected provisionally"
│   │   │                                                                              (D088); carries F068, F075
│   │   ├── T3.1a  short stills                     F004, F005                         closed: no further arms; carries F003
│   │   ├── T3.1b  per-ant persistence              F006–F008, F071–F074               parked: C3 deferred (D088)
│   │   ├── T3.1c  packing and resting site         F027–F032, F060–F063               closed: arms closed, aggregation not
│   │   │                                                                              rejected; carries F027, F078
│   │   ├── T3.1d  contacts from tracks; row 4      F015–F017, F079                    waiting ⟵ Q9 (B007 [backlog: blocked])
│   │   ├── T3.1e  light / dark                     F034–F037                          waiting ⟵ Q6 (B006 [backlog: open])
│   │   ├── T3.1f  trips                            F038, F077                         waiting ⟵ Q8 (B005 [backlog: blocked])
│   │   ├── T3.1g  slow still-period displacement   F013, F014                         open (B004 [backlog: open])
│   │   ├── T3.1h  literature structures                                               parked (P12; revisit triggers, D138)
│   │   └── T3.1i  water-init shortcut recheck: C1, C2, every Stroeymeyt set           waiting ⟵ Q3 (P2)
│   │              in synchrony Parts B–D and the S2 audit's base
│   │
│   ├── T3.2  Transfer to Mailleux 1999 (step 5)                                       closed: "the fitted candidate failed
│   │   │     reopens only on a demonstrated bug; an observation mismatch counts       to reproduce the rows within the
│   │   │     when a test encodes the source's definition (Plan step 5, D094, D107,    allotted search" (D107); carries
│   │   │     D134 §2; reconciled in D138 §1)                                          F081, F093
│   │   ├── T3.2a  Buffin bout-duration failure: donor-volume cap, the mechanism       closed: "F093 explains a structural
│   │   │          pilot2 showed (D133; F093, indicated, eight dishes)                 limitation; it does not itself reopen
│   │   │                                                                              the stopping rule" (D134 §2)
│   │   ├── T3.2b  contact split, during vs after the main bout (D135)                 open, next 1: running
│   │   │          outcomes: rule 1 → P16; rule 2 → P9; rule 3 → F093 stands           (contactsplit-20261024T162235Z);
│   │   │                                                                              read against D135's rule
│   │   ├── T3.2c  step-5 closure wording after the missed Buffin fit row (P1)          waiting ⟵ Q1
│   │   ├── T3.2d  clear Mailleux 1999: its contact definition (P9); the 1999 rows     waiting ⟵ T3.2b (rule 2 only)
│   │   │          rest on a pre-clearing extraction (D133)
│   │   ├── T3.2e  G3 contacted-nestmate departures (B001 [backlog: done], F058)       parked: not adopted in M1 (stopping
│   │   │                                                                              rule; D093, D138 §5); revisit after M1
│   │   └── T3.2f  nestmate-only crop gate (B020 [backlog: unscoped])                  open: diagnostic only; adoption not
│   │                                                                                  in M1 (D138 §5)
│   │
│   └── T3.3  Cause of colony synchrony: modelled, or omission argued (P3)             open; central interest (D114)
│       ├── T3.3.1  describe it                     F022–F026, F065                    closed: described
│       ├── T3.3.2  Part B oracle stress test       F083, F084                         closed: stress test only (matching
│       │                                                                              not met)
│       ├── T3.3.3  Part C drivers vs propagation   F085–F087                          closed: "ends without answering D114
│       │                                                                              in this pipeline" (STATUS)
│       ├── T3.3.4  Part D
│       │   ├── Stage 0: S3 audit, gate G (D130; F092)                                 closed: gate G not passed
│       │   ├── sensitivity (c), initiator-frame positions (D131, D132)                closed: "too noisy to confirm or
│       │   │                                                                          refute an excess of +0.19" (D132)
│       │   ├── sensitivity (d), misreads (D129)                                       open (P8); outside gate G
│       │   ├── robust S3 variant (D132)                                               held: bounded and secondary (D134);
│       │   │                                                                          approval: not approved (D138 §4)
│       │   └── Stages 1–3 (D126 amendment 1; conditions P21)                          held ⟵ T3.3.5 (D134)
│       │                                                                              approval: not approved (D128)
│       ├── T3.3.5  S2 audit: same-bin classing, composition nulls (D136)              waiting ⟵ Q2; approval: not approved
│       │           on approval logs/s2audit/ is sealed (P22)                          (proposal, nothing built)
│       ├── T3.3.6  brood coordinates, development only (D134 §3, D137)                open, next 2: fetch the 176
│       │           bears on F051, F056, F060 and B018's open question                 allowlisted files; STATUS § roles
│       │                                                                              line (D137)
│       └── T3.3.7  forager-entry and queen triggers (D134 §4)                         open, next 3: file the backlog item
│
├── T4  Held-out tests (step 9): Stroeymeyt age-experiment colonies                    held (D114) ⟵ T3.3 (P3), Q5
│   └── T4.1  candidate held-out colony data (B016 [backlog: blocked])                 waiting ⟵ Q10
│
├── T5  E6, Bles et al. 2022 (development benchmark on the best step-5 fit, D104)      held (D114: step 9, E6 after the
│   │                                                                                  held-out test) ⟵ T4
│   ├── T5.1  directed navigation, frozen before any E6 run (P5)                       open
│   ├── T5.2  E6 ensemble rule against D104's single best step-5 fit (P14)             open: amendment due before any E6 run
│   ├── T5.3  leaveCropFrac sensitivity with the E6 run (P17)                          held ⟵ T5
│   └── T5.4  bout end vs observed contact (B011 [backlog: open])                      open
│
├── T6  Infrastructure
│   ├── T6.1  colony save / restore (B013 [backlog: done]): adopt proposal.patch       waiting ⟵ Q7
│   ├── T6.2  pheromone sampling footprint (B017 [backlog: open]); grid F049           open
│   ├── T6.3  B018 rate tables on the model (B021 [backlog: unscoped])                 open
│   └── T6.4  V8 pretenuring, bimodal run times (B022 [backlog: unscoped])             open
│
└── T7  Publication plan (D127; briefs local only, not committed: D127 amendment 1)
    ├── T7.1  paper 1 in-nest movement                                                 closed: scoped, not pursued alone;
    │                                                                                  parts folded into 2 and 3 (D127
    │                                                                                  amendment 2); reopening P23
    ├── T7.2  paper 2 synchrony, with the individual baseline (F089, F002, F067,       open ("now", STATUS) ⇠ T3.3
    │         F070, F090, F091, F057)
    ├── T7.3  paper 3 transfer: the existing draft; step 5, the held-out test          waiting ⟵ T4, T5, P8b ⇠ T3.1, T3.2
    │         (D127, default), E6's section, the motion model's failures
    ├── T7.4  paper 4 Bles reanalysis: novelty audit first; folding into paper 3       waiting ⟵ T5
    │   │     stays an outcome (D127)
    │   └── T7.4a  clear the Bles paper after the E6 run (P10)                         waiting ⟵ T5
    └── T7.5  incline walking, simulator paper, process perspective                    parked (D127)
```

---

## 2. Frontier

**Lead, next (D134's order, as it stands after D137):**
1. T3.2b: read the running contact split against D135's rule. Rule 1 → P16, rule 2 → P9 and Q11, rule 3 → F093
   stands.
2. T3.3.6: fetch the allowlisted brood files (D137's command, hash-checked); add the development-role line D137
   promises to STATUS § roles.
3. T3.3.7: file the trigger backlog item. Its design separates activity before the event from activity after it,
   with matched control times (D134 §4).

Then T3.3.5 is built once Q2 is answered; nothing in it runs before.

**Decisions waiting on the user:**

| id | decision | raised | bears on |
|---|---|---|---|
| Q1 | Does the missed Buffin fit row (P1) change step 5's closure wording? (It does not reopen step 5: D134 §2) | D133 | T3.2c |
| Q2 | Approve or amend the S2 audit's six values: shift range 30–210 bins, J primary, reference window 5–15 min before, 100 draws, estimability floor, directional rule | D136 | T3.3.5, Stages 1–3 |
| Q3 | Recheck the water-init shortcut at C2's settings, or record it as waived | P2 | T3.1i, every Stroeymeyt simulated set |
| Q4 | E2 trigger (c), 1999 adequacy between layers: step 5 was fitted and judged on L0S1c only. Waive (c), or judge L0S1? | P6 | T2.1 |
| Q5 | Scope of rows 1 and 4 in the freeze decision before step 9 | D113, D114 | T4 |
| Q6 | B006's phase / cause decision | B006 | T3.1e |
| Q7 | Adopt B013's `proposal.patch` | B013 | T6.1 |
| Q8 | Go for B005's path audit | B005 | T3.1f |
| Q9 | B007: paper clearance, the GPL tool set-up, the agreement criterion | B007 | T3.1d (row 4) |
| Q10 | B016's exposure rules and web search | B016 | T4.1 |
| Q11 | Clear Mailleux 1999 (asked only if D135 rule 2 fires) | D135 | T3.2d |

**Open, not next:** T3.1g (B004), T3.2f (B020), Part D sensitivity (d), T5.1, T5.2, T5.4, T6.2–T6.4, and the P8b
design.

**Held or parked:** T1 with T1.1; T2; T3.1b; T3.1h; robust S3; Stages 1–3 (held, not approved); T3.2e; T4 behind
T3.3; T5 behind T4; T7.5.

---

## 3. Commitments

Conditional promises made along the way ("if X, then Y"; "before Z, do W"), in their recorded wording, found by
searching the record. "No later … found" means none was found, not that none occurred. The search covered STATUS
Rules in force, the Plan, `docs/log/` and the archives it cites. It may be incomplete, and that is why `check` warns
on unlinked conditionals (§4). Age alone does not make a commitment overdue.

**States:** `open` (trigger not met); `due` (trigger met, action not taken, no record says otherwise); `fulfilled`;
`waived` (by a record); `missed` (a record says the trigger was met and the action not taken); `not triggered` (the
trigger can no longer be met, or the reading said no).

| id | commitment (as recorded) | made | state |
|---|---|---|---|
| P1 | "If other endings are common at the fitted shareRate, Buffin's fed→starved durations become a **fit row in the joint fit** instead" (instead of the dish check) | night archive, 2026-10-10 | **missed**: pilot2 met the condition; "No later entry implements or drops the fit row" (D133, "process miss"). Q1 |
| P2 | The revised initialization "is accepted as a warm-up shortcut … provided the original and revised starts converge to the same late-window behaviour …, rechecked if walk-on rates or water parameters change" | Stroeymeyt archive, 2026-10-15 evening; STATUS Rules | **due**: C1 and C2 changed walk-on rates (C2's drive σ 1.99 / 1.94, D080); no later recheck found. It covers every Stroeymeyt simulation (`colonyStroeymeyt.ts`), not step 5 (D094). Q3 |
| P3 | Synchrony's cause "is investigated and either modelled or its absence argued and disclosed before the freeze" for any held-out colony test | D015, 2026-10-17 ≈ 15:25; D107 | open → T3.3; holds T4 |
| P4 | Step-5 synchrony sensitivity gate: before adoption, rows re-evaluated with κ = 1 and its placebo; a row moving > ≈ 1 combined SE beyond the placebo, or a changed adoption verdict, makes synchrony a step-5 blocker. Independent of P3 (D107) | D015; D094 | **fulfilled** (D106): "synchrony becomes a step-5 blocker". Moot while step 5 is closed; it applies if step 5 reopens (P16) |
| P5 | Directed navigation: "parameters from the literature, frozen in this file before any E6 run …; run-hash check that the 1999 rows and E2 do not change, against a baseline at 157cd66 or later" | E6 pre-registration, 2026-10-09 (baseline clause after the 2026-10-10 wall fix) | open → T5.1 |
| P6 | E2 reopens, with paired seeds, on (a) a between-layer difference > 1 combined SE whose CI excludes 0; (b) the E6 verdict differs between layers; (c) 1999 adequacy differs between layers. Shared failures: drinking-time spread through the intakeSd 0.4 profile point, same triggers; giving up matters only if > 5 % of E6 food visits end in a give-up | archive, 2026-10-10 night; STATUS Rules (E2 reopening) | (a), (b) and the shared failures: open, evaluated with E6 (a was written for E6 statistics). (c): open, not evaluable as things stand (step 5 L0S1c only, D094). Q4 |
| P7 | A verdict flipped by a sensitivity → refit at the flipping setting; that optimum joins the E6 ensemble | STATUS Rules | not triggered (D106: no flips) |
| P8 | The misread definition "is frozen independently of the S3 results. Suspected onsets are removed before episodes are rebuilt, and the numbers of onsets and episodes that change are reported" (sensitivity (d)) | D129 | open; outside gate G |
| P8b | The rest-splitting misread audit (data only: one-frame excursions that split rests in the data, never in the model): "needs a logged design before running"; carried to paper 3 | D127 amendment 2 | open. Its misread definition and P8's may coincide; whether they share one is decided in whichever design comes first |
| P9 | "if third-during-M, other-bout third parties or walk carry most of the excess" … "The lead then asks the user to clear Mailleux 1999, for the Methods' contact definition. Nothing reopens before that" | D135 rule 2 | open; conditional on T3.2b. Q11 |
| P10 | Clearing the Bles paper "is deferred until after the E6 run of our colony model" (lead recommendation, the user may overrule); paper 4's brief starts with a novelty audit | D127, amendment 1 | open → T7.4a |
| P11 | B006 closes only after the phase-temperature point is addressed or explicitly left out | B006 lead review, 2026-10-18 16:14 | **fulfilled** (B006, 2026-10-18 16:24); B006 stays open for Q6 |
| P12 | Literature-derived structures "parked until the current tests are read"; "an excitable coupling diagnostic … needs the user's decision" | 2026-10-16 ≈ 23:58; 2026-10-17 ≈ 06:38 | partly addressed: contact-based activation "not warranted on current evidence" (2026-10-17 ≈ 14:02, user); kept out of C2 (2026-10-18 ≈ 01:41). Rest open, revisit triggers set (D138 §3) |
| P13 | When E1 resumes: B010 first, then the Bonavita 2026 held-out test on the adopted flat-ground walker | STATUS Open problems | open; held with T1 |
| P14 | E6 ensemble: "the ranking-check survivors plus the flat-direction profile ends, both layers", with a backstop (rerun on a widened ensemble if a post-E6 scan finds a comparable region). D104 skipped steps 6–8, so neither exists: "E6 later runs on this fit as the best step-5 fit, disclosed as such" | E6 pre-registration (STATUS Rules); D104 | **open: an amendment reconciling the two is due before any E6 run**; none found → T5.2 |
| P15 | "The rows 1 / 4 scope decision waits with step 9" | D113; D114 | open → Q5 |
| P16 | D135 rule 1: a partner counted more than once within one continuous bout, carrying at least half the excess on 4 d or 8 d, "is reported as a candidate bug. Whether to fix it and rerun the judgment is the user's decision" | D135 | open; conditional on T3.2b. If step 5 reopens, P4 applies |
| P17 | `leaveCropFrac` sensitivity reported with the E6 run (Plan step 9; B003 dropped on this ground) | Plan step 9; B003 | open → T5.3 |
| P18 | "Before E2 is ever called adopted: ≥ 3 recovery replicates and a bigger-budget refit from the profile's better point" | STATUS Rules (E2 reopening) | open; only if E2 reopens |
| P19 | After or alongside E6, sized by it: full-range 1-D scans at the optimum; 5 synthetic recovery fits at the real n; the E2 backlog only if a trigger fires | Plan step 10 | open; after T5 |
| P20 | The held-out Stroeymeyt test is reported in exactly one paper: the transfer paper by default (the user may reassign) | D127 | open → T7.3 |
| P21 | For Stages 1–3: "the 2-D rule deferred until calibrated" (D128); the normalised driver multiplier before clipping and the multiplier applied "kept apart, and both reported" (D129) | D128; D129 | open; held with Stages 1–3 |
| P22 | On approval of the S2 audit, `logs/s2audit/` is sealed until the reading is frozen. If the directional rule fails, "S2 cannot be Stages 1–3's main spatial row as currently defined; what it would be replaced by is the user's call" | D136 | open; conditional on Q2 |
| P23 | Paper 1's reopening condition: "a result with a new claim, e.g. a designed demonstration that colony-average rows leave per-ant structure unidentified" | D127 amendment 2 | open → T7.1 |

---

## 4. Tooling (once this shape is agreed)

**Build order.** The commitments register and the register of decisions waiting on the user come first: they guard
against a failure that has already happened (P1 missed; P2 due), which meets the bar for new procedure (Rules in
force: "only if they block a known way to get a wrong answer"). The tree is navigation and comes second.

- **Files.**
  - Nodes: `threads/Tnnn-slug.md`, flat ids never reused. Records cite the id, never the tree label. Fields:
    `parent`, `status`, `waiting_on`, `uses`, `next`, `actor`, `approval`, `outcome`, `carries`, `closes_when`,
    `links` (D, F, B, X, P, Q ids), and `backlog: Bnnn` for a backlog leaf. The body is a short dated history.
  - Commitments: `commitments/Pnn.md`, with the recorded wording, `made` (record id), `trigger`, `state` (§3) and
    the record that resolved it.
  - Decisions waiting on the user: `questions/Qnn.md`, with the question, the options if recorded, `raised`
    (record id), and the record that answered it.
- **Authoritative records stay authoritative.** A node links to them and does not restate their state. A backlog
  leaf shows its item's status from the item file. A finding's strength comes from the finding.
- **The generator** writes the tree, the frontier (from `next` and `actor`), the Q table and the commitments
  table. STATUS's RESUME can then shrink to the frontier and the Q table.
- **`check`, hard failures:**
  - broken references (a node, record, finding, backlog, P or Q id that does not exist);
  - missing required fields, including a `closed` node without `outcome`;
  - cycles in `waiting_on`;
  - `next` on a node that is not `open`;
  - **quote check:** `outcome:` and a commitment's recorded wording must appear verbatim in the cited record
    (whitespace-normalised). A paraphrase fails and is either quoted or recorded first.
- **`check`, review warnings only:**
  - **staleness:** a log entry newer than a node's last history line that cites one of the node's links. Revision 1
    would have been flagged within minutes by D136 (citing D134 §1) and D137 (citing D134 §3);
  - a commitment `open` or `due` for more than N days;
  - a log entry containing "deferred", "pending", "if … then", "before … any" or similar that no commitment links
    to;
  - a finding linked from no node.

  Warnings never change a status by themselves.
- **No tree invariant overrides a rule:** a closed parent with open children is valid, and nothing is reopened to
  satisfy the tree.
- **Adoption** is the user's decision. It adds a row to STATUS's "Where the record lives" table, a line to
  CLAUDE.md's lead-agent duties, and `check` to `npm test` beside the records and findings checks.
