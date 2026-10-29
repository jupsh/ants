---
id: D181
date: 2026-10-29
time: 20:04
kind: decision
title: User: Q01 and Q04–Q10 answered (pasted, adopted; Q07 after a lead question): step 5's closure discloses the omitted Buffin fit row; a frozen, paired L0S1 judge for E2 trigger (c); rows 1 and 4 kept as reported predictions; B006's cause left open; B013 deferred for want of a consumer; B005 after the synchrony work; B007 from reviewed Methods, a black-box tool and a frozen criterion; B016 a metadata-only survey; Q11 pending the clearance's extent
authority: user
scope: Q01 T019 Q04 T039 Q05 T036 P15 Q06 T011 Q07 T045 Q08 T012 Q09 T010 Q10 T037
---
- **2026-10-29 ≈ 20:04 UTC — User: Q01 and Q04–Q10 answered (pasted, adopted; Q07 after a lead question): step 5's closure discloses the omitted Buffin fit row; a frozen, paired L0S1 judge for E2 trigger (c); rows 1 and 4 kept as reported predictions; B006's cause left open; B013 deferred for want of a consumer; B005 after the synchrony work; B007 from reviewed Methods, a black-box tool and a frozen criterion; B016 a metadata-only survey; Q11 pending the clearance's extent.**
  - **Source:** the user's answers to the nine open questions (pasted in conversation, 2026-10-29), each with its
    reasoning and evidence links. The lead checked each against the records it cites (D133, D134, D107, P06, D113,
    D114, STATUS Plan steps 4–9, B005, B006 `results/design.md`, B007, X015, B013, B016, D139, X008) before relying
    on it; every factual premise holds. One point went back to the user (Q07, below). The user's words are quoted
    as given; the lead's checks follow each.
  - **Q01, step 5's closure wording (T019).** User: "**Yes—expand the disclosure while retaining the closure.** State
    that the candidate failed within the allotted search, the search did not converge, and the promised Buffin
    joint-fit row was omitted. Leaving the wording unchanged understates that process failure. Reopening the fit
    would require a separate change to the stopping rule; the omission does not establish a code bug."
    - Check: D133 item 1 records the lapse ("No later entry implements or drops the fit row"); P01 is `missed`
      (D133). Under the stopping rule only demonstrated bugs reopen the 1999 rows (Plan step 5; D107).
    - **Closure wording from now on:** the fitted candidate failed to reproduce the rows within the allotted search;
      the search did not converge; the Buffin fed → starved joint-fit row promised by the adopted Buffin review was
      omitted (P01, missed). Step 5 stays closed as a transfer failure.
  - **Q04, E2 trigger (c) (T039, P06).** User: "**Prefer a bounded, paired L0S1 check over waiving the
    commitment.** Freeze its parameters, seeds and interpretation first. Swapping the layer at the existing candidate
    measures that candidate's sensitivity; it cannot establish what a separately optimized L0S1 fit could achieve.
    Waiving (c) is defensible given step 5's closure, but leaves dependence on the drinking layer untested. Neither
    answer warrants silently starting another fitting round."
    - Check: P06 (c) reads "1999 adequacy differs between layers"; step 5 was fitted and judged on L0S1c only
      (D094). The L0S1c candidate is not adequate (D106), so (c) fires only if the same candidate judged on L0S1
      passes the adequacy rule. A judge on the existing candidate is a judging run, not a fit, so the stopping
      rule does not bar it.
    - **(c) is not waived.** P06 stays open. The check is a judge of D106's candidate with only the E2 layer
      swapped (L0S1c → L0S1), on D106's judge seeds paired across layers, read by the frozen 1999 rule
      (`reportM1999.ts`). Its parameters, seeds and interpretation are frozen in a design entry before it runs. It
      measures that candidate's sensitivity, not what an L0S1 fit could reach. No refit follows from it.
  - **Q05, rows 1 and 4 before step 9 (T036, P15).** User: "**Retain them as explicit predictions and report their
    failures, without requiring every row to pass before freezing.** This fits M1's agreed endpoint of calibration
    and stress testing with disclosed failures. Requiring all rows to pass could force another substantial model
    revision. Dropping them entirely would weaken the test. Contact rows need the validated observer; if that is
    deferred, explicitly describe the held-out test as incomplete for contacts. The earlier synchrony stress test
    covered neither row family, and the final freeze still waits on the synchrony decision."
    - Check: D113 lists row 1 (stays) and row 4 (contacts vs density) as not covered by Part B; Plan step 4 leaves
      row 4 waiting on the observer's validation; P03 still holds the freeze.
    - **Rule for step 9:** rows 1 and 4 are held-out predictions, judged and reported, failures included; passing
      them is not a condition of the structure freeze. If the contact observer is not validated by step 9, the
      held-out test is reported as incomplete for contacts. P15 is fulfilled by this decision; P03 is unchanged.
  - **Q06, B006's phase / cause decision (T011).** User: "**Accept the descriptive findings and leave the cause
    unresolved.** Temperature and cycle phase are confounded, so choosing temperature—or transferring dark-phase
    motion to Mailleux solely because its temperature matches—is unsupported. A single phase multiplier also lacks
    support across both activity and trips. Separate controls for in-nest switching and outside trip duration are
    reasonable future hypotheses, with changes deferred until after M1. The observed ratios do not identify their
    hazard parameters."
    - **Applied:** B006 closes as done with its Findings as written; the cause stays open (F034's limitation
      stands); no phase mechanism and no phase mapping for Mailleux in M1. The two controls are hypotheses for after
      M1.
  - **Q07, B013's proposal.patch (T045).** User (pasted): "**Support adoption after the identified implementation
    fixes, initially for Node/process snapshots.** … Deferring is reasonable if there is no immediate consumer:
    serialization alone delivers no speed improvement. Rejecting the approach outright seems unwarranted. Its
    coverage excludes observer and wrapper closure state, so it is not yet a checkpoint of an entire observed run."
    - Lead question: B013's one concrete consumer was the shared warm-ups of the Plan step-7 Mailleux refits; with
      step 5 a transfer failure the plan goes to step 9, so steps 6–8 do not run, and Part D's runs use no
      snapshots. The user chose "**Defer, fixes listed**".
    - **Deferred; not rejected.** The patch stays unapplied in B013. If a run later needs checkpoints or shared
      warm-ups, adoption is Node/process only, with B013's lead-review fixes: a loop in place of `push(...items)`,
      the module under `src/sim/parallel/` rather than `src/sim/core/`, no browser use while restore keys on
      `constructor.name`; and observer / wrapper closure state is not covered until registered and tested.
  - **Q08, B005's path audit (T012).** User: "**Yes, as a bounded diagnostic after the active synchrony work.** It
    could clarify whether short trips form a distinct class. Holding it is a reasonable priority choice; dropping it
    means retaining the excursion explanation as unproven. Removing short trips or recalibrating now would get ahead
    of the evidence. A statistical mixture does not itself establish foraging intent, and the proposed model arm
    uses C2's start point rather than its fitted settings."
    - **Applied:** B005 is approved, to start after the active synchrony work (Part D). Its scope is unchanged
      except that the model arm runs at C2's fitted settings, not its start point. A two-component mixture is
      reported as a distinct duration / reach class, not as a difference in foraging intent. Trip inputs are not
      recalibrated and short trips are not removed.
  - **Q09, B007 (T010).** User: "**Proceed using the already authorized Methods sections, a pinned local black-box
    tool, and a numerical agreement rule frozen before comparison.** Blanket paper/supplement clearance is
    unnecessary and could expose held-out outcomes. Using only the parameter list risks guessing event definitions.
    The existing authorization already permits specific previously reviewed Methods sections, despite B007's broader
    "paper not cleared" label. The agreement criterion still needs a concrete proposal covering counts, durations
    and pair/event overlap across colonies and phases. Correlation alone would not establish agreement."
    - Check: X015 permits "a known, previously reviewed section" of the Stroeymeyt Materials and Methods and Fig. S1
      caption, and forbids extraction, search or browsing to locate others.
    - **Applied:** B007 is unblocked for the source text and the tool: it works from X015's previously reviewed
      Methods sections only; the authors' GPL-3.0 tool is pinned to an exact version, built and run locally as a
      black box (source never read, excluded from git). Before any comparison, the lead proposes a numerical
      agreement criterion (counts, total durations, pair / event overlap, per colony × phase), the user approves it,
      and it is frozen in `docs/log/`. Correlation alone is not agreement.
  - **Q10, B016's exposure rules and web search (T037).** User: "**Approve a metadata-only survey with explicit
    exposure limits.** Collect species, lab, design, recorded variables, availability and licence; return candidates
    for you to assign roles. Selected Methods sections could be permitted later where necessary. Broad
    abstract/full-paper reading risks exposing the outcomes intended for testing. Postponing preserves blindness but
    leaves the independent-validation gap unresolved. Even titles and search snippets can reveal results, so
    incidental exposures must be recorded."
    - **Applied:** web search is approved for B016's survey. It reads repository records, data descriptors and
      metadata (species, lab, design, recorded variables, availability, licence); no abstracts, full texts, results
      or figures; nothing downloaded. Any result seen in a title or snippet is reported and goes in
      `docs/contamination/`. Methods sections only by a later, separate permission.
  - **Not answered here: Q11 (Mailleux 1999 clearance).** The user answered "Yes, for the relevant Methods and
    observation definition", then, asked whether to clear the whole paper (it has no held-out part: X008), replied
    "I'm leaning towards whole paper but let me know what you think is best." The extent is the user's to state;
    Q11 stays open until then.
