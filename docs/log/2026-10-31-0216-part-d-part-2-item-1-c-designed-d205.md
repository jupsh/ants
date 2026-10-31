---
id: D223
date: 2026-10-31
time: 02:16
kind: design
title: Part D Part 2 item 1(c) designed (D205, D222; T012; proposal for the user, nothing run): the 10-min D_w split exactly into co-presence and pairwise coupling (D − 1 = m · r) per colony, data beside every Stage 2b arm, with a co-presence-matched counterfactual; forager residence, stays, trips, entries and activity by stay age at 1-min resolution from one recorder for data and runs; coverage and composition rows; data by light block; descriptive, Stage 2b classes copied beside
---
- **2026-10-31 ≈ 02:16 UTC — Part D Part 2 item 1(c) designed (D205, D222; T012; proposal for the user, nothing run): the 10-min D_w split exactly into co-presence and pairwise coupling (D − 1 = m · r) per colony, data beside every Stage 2b arm, with a co-presence-matched counterfactual; forager residence, stays, trips, entries and activity by stay age at 1-min resolution from one recorder for data and runs; coverage and composition rows; data by light block; descriptive, Stage 2b classes copied beside.**
  - **What:** D205 Part 2 item 1(c), chosen next by the user (D222): the foragers' 10-min D_w shortfall (F104: data
    3.12, arms 1.36–2.37; outside for 9 of 11 non-base arms, T20m and Eu unresolved) beside forager residence, trips
    and activity, as D222 asks. Descriptive: no rule, no new class, no placement, no closest member. Development data
    only (the 22 Stroeymeyt fit colonies, light). Nothing is simulated (P87). Model changes, if any follow, need their
    own design (D222).
  - **Why this shape.** D_w is not a per-pair statistic. `syncStats.ts` computes, per bin b of the n_b eligible ants
    (ants with ≥ w / 4 in-nest steps in the bin), D = Σ_b S_b² / Σ_b Q_b, with S_b the sum and Q_b the sum of squares of
    the ants' deviations from their own block means. With synchrony, D − 1 grows with the number of ants sharing a bin.
    A model whose foragers are in the nest at other times, or in other numbers, than the data's foragers can therefore
    fall short at the same pairwise coupling. C2's forager stays and trips are known to be wrong (F077, F038). So the
    design first splits the shortfall into co-presence and coupling, then describes the residence, trip and activity
    structure behind each.
  - **Inputs:**
    - **Runs (existing, no new run):** the 12 Stage 2b arms (T20f, T20m, Eu-M, El20-M, Ed2, Ed5, Ed20, Ew5, Es,
      controls Eu and El20, base), `logs/short/pd-as-<arm>-r{0,1}-c{0..21}.json` (44 files per arm, all present). Their
      `ydist` block holds, per tracked ant and 1-min bin from the first observed frame, in-nest moving steps, steps
      and detections (`ydistStats.ts`, the same step rule as `syncStats`). **Checked during design** on two runs
      (T20f r0 c0, base r1 c7): 10-min D_w rebuilt from these bins equals the stored `sync` value for foragers and
      nurses to 1e-15. Those values were already read (F104), so this is a plumbing check, not a result.
    - **Data (existing tracks, re-read):** the 22 fit colonies, PreTreatment, streamed one colony at a time with
      `streamColony` and `roles` (`scripts/stroeymeytTracks.ts`), as items 1(a) and 1(b) did. The stored data minute bins
      (`logs/ydist/data-c*.json`) cannot be reused: they follow the clock, whereas `syncStats`' bins start at the first
      frame, so they do not rebuild D_w exactly. They also omit out-of-nest detections, which the coverage rows need.
      This reads existing development data; it is not a new simulation or experiment (P87).
    - `logs/partd2/assess/read.json`, only to copy Stage 2b's row classes beside (P82).
  - **One recorder for both sides.** Per tracked ant and 1-min bin counted from the first frame (as `ydist` in the
    runs): moving steps `mv`, steps `st`, in-nest detections `np`, and for the data also out-of-nest detections `no`.
    Each minute carries its block label as `syncStats` assigns it (clock blocks from 06 UTC for the data; one block per
    run). 10-min bins are 10 consecutive 1-min bins, so the data's 10-min D_w is rebuilt exactly as Stage 2b computed it.
    - **Minute states:** an ant's minute is **in** if `np` ≥ 1, else **not-in**. In the data only, a not-in minute is
      **out** (`no` ≥ 1) or **unseen** (no detection). Stays, trips and entries use in / not-in on both sides. The runs
      are observed through the frozen detection tracker, so in-nest misses enter both sides at the tracker's rates. The
      out / unseen split is a coverage row for the data alone, because the runs store in-nest detections only.
    - **Observation windows:** each run is one 4-h window. The data are cut into their light blocks (06–10, 10–14,
      14–18 UTC), each block a window, so stays and trips are censored at window edges in the same way on both sides.
      Residence rows use data blocks with ≥ 120 of their 240 minutes (D207's half-block rule).
  - **Part A: the decomposition (groups all ants, nurses, foragers; windows 10 min primary, 1 min beside).**
    - Per bin with n_b ≥ 2 eligible ants: X_b = S_b² − Q_b (the cross-products). Then, exactly,
      **D − 1 = m · r**, with
      - **m = Σ_b (n_b − 1) Q_b / Σ_b Q_b**, the mean number of other eligible group members sharing a bin, weighted
        by deviation size (co-presence);
      - **r = Σ_b X_b / Σ_b (n_b − 1) Q_b**, the pairwise coupling: with equal deviation variances and a common
        within-bin correlation ρ, r estimates ρ.
    - Per colony, m and r are computed from the sums over its light observation: for the data all its light blocks,
      pooled as the Stage 2b reader pools them; for an arm both runs, Σ over runs.
    - **Set values:** the means over colonies of D, m and r, and the differences arm − data in each.
    - **Co-presence-matched counterfactual:** per colony D†_c = 1 + m_c(data) · r_c(arm), the arm's coupling at the
      data colony's co-presence. Reported: **D_data − D†** (what remains of the shortfall with co-presence matched) and
      **D† − D_arm** (what matching co-presence adds). The reverse, D‡_c = 1 + m_c(arm) · r_c(data), is beside. No ratio
      or share is reported: the forager shortfall's interval is near 0 for T20m and Eu.
    - **Stay-interior bins (foragers, 10 min; sensitivity):** D, m and r again on the ant-bins whose ten minutes are all
      **in** (each ant's mean then taken over its interior bins), and the share of eligible forager ant-bins that are
      interior. This locates how much of each set's forager D_w sits in bins where foragers enter or leave.
  - **Part B: residence, trips and activity (foragers; per colony, then the mean over colonies).**
    - **In-nest fraction:** in minutes per forager-minute observed.
    - **Co-present foragers:** mean number of foragers in per minute, and mean n_b of eligible foragers per 10-min bin.
    - **Stays:** runs of in minutes from an entry. A stay already under way at the window's start (start unknown) is
      left out; one running to the window's end is censored. Kaplan–Meier survival at 10, 30, 60 and 120 min, and
      the median when survival falls below 0.5 inside the window, ~~else "> window"~~ (amendment 1, point 3).
    - **Trips:** runs of not-in minutes between an exit and the next entry. One under way at the window's start is
      left out; one running to its end is censored. Kaplan–Meier survival at 2, 10, 30 and 60 min, and the median.
      A trip is visible only if it covers a whole minute, so excursions under about a minute (B005's question) are
      below this resolution.
    - **Entries:** per forager-hour observed. **Clustering:** the share of entries with another forager's entry in
      the same or an adjacent minute. Beside it, ~~the share expected if the colony's entries in that window were
      independent and uniform over its minutes, 1 − (1 − 3 / T)^(N − 1) for N entries in T minutes~~ the benchmark of
      amendment 1, point 4.
    - **Activity:** in-nest moving fraction Σ mv / Σ st, overall and by stay age: the entry minute, 1–4, 5–19, 20–59
      and ≥ 60 min since entry (stays whose entry was observed).
    - **Slow variability within an ant:** Σ_b Q_b / Σ_b n_b at 10 min, the mean squared deviation per eligible
      forager-bin.
  - **Part C: coverage and colony composition.**
    - **Composition:** tracked nurses and foragers per colony, data and runs. The simulated colonies take their numbers
      from the data colony (`DataColony.ants`, `s2018Lib.ts`), so equality is a check, reported.
    - **Eligibility:** eligible 10-min ant-bins per ant and block (K), per group. Each ant's deviations sum to 0 over
      its eligible bins in a block, which biases cross-products down by more when K is small. K is reported so that r
      can be read with this in mind.
    - **Detection density:** steps per in minute, data and runs.
    - **Seen by D_w:** the share of forager in-minutes that fall in eligible 10-min ant-bins.
    - **Data only:** the out and unseen shares of forager not-in minutes.
  - **Part D: the data by light block (foragers, 10 min).** D, m, r, in-nest fraction, co-present foragers and entries
    per forager-hour in the 06–10, 10–14 and 14–18 blocks, with ≥ half-block coverage as D207; contrasts with 06–10.
    These sit beside F108's block values and F109's block entry rates.
  - **Classes beside:** Stage 2b's row class for each arm's all-ants and forager 10-min rows, copied from `read.json`
    unchanged.
  - **Weighting and uncertainty:** each colony counts once. One joint colony bootstrap: 2,000 draws of the 22 colony
    labels, the same draws for the data and every arm (D207's practice); seed `random.Random(0xD223)`; 95 % percentile
    intervals, an interval reported only if ≥ 99 % of draws are defined. Every arm − data difference is paired within
    draws.
  - **Self-checks before anything is read:**
    1. per data colony and per run, D_w at 10 min and 1 min, for all ants, nurses and foragers, rebuilt from the recorder
       equals the stored value (data: Σ num / Σ den of the light blocks in `logs/short/data-c*.json`; runs: `sync`) to a
       relative 1e-9;
    2. D − 1 = m · r per colony to 1e-9;
    3. the set values at 10 min equal `read.json`'s (data all ants 6.28, foragers 3.12; F104) to the printed precision.

    Until they pass, only these values are printed. If one fails, nothing else is read and the cause is logged.
  - **Synthetic checks (before any data run):** generated ant × bin deviations:
    - independent ants give r ≈ 0 and D ≈ 1 for any n_b;
    - equicorrelated ants (ρ = 0.2, varied n_b) give r ≈ 0.2 less the demeaning bias, and D − 1 tracks m at fixed ρ;
    - hand-built minute-state sequences give the expected stays, trips, censoring, entries and stay ages.
  - **Reading rules, fixed now:**
    - Descriptive throughout. A difference whose interval includes 0 is "unresolved", never "matches". No row is a class.
    - Stage 2b's outside and unresolved classes are kept as they are (P82); nothing here reclassifies a row.
    - D − 1 = m · r is an identity. The counterfactual is accounting under it, not a prediction of what a model with
      more co-present foragers would do: in the members co-presence and coupling are linked (S6, D205), and residence
      follows from the stays and trips.
    - r does not tell a shared driver, an interaction and a shared stay phase apart. The stay-age and interior-bin rows
      locate where the foragers' co-variation sits, not what causes it.
    - No trip class is fitted. A B005 mixture, if fitted later, is a duration / reach class, not foraging intent (P70).
    - The shortfall at 10 min does not establish a 10-min oscillator (P80). The block rows show variation over the
      light phase that the members do not represent, confounded with time since recording began (P83, D207).
    - These minute-resolution rows are not F077's frame-resolution statistics. The base arm's rows are reported beside
      F077 and F038, not tested against them.
    - Every row is reported for every arm and group; nothing is selected.
  - **Not in this design:**
    - B005's mixture (log duration × reach). Its model side needs the reach of simulated trips, which the runs do not
      store, so it would need a run: a separate design (P87).
    - The dark phase, and a queen-linked analysis or mechanism (D222).
    - Any model change.
  - **Implementation (after approval; implementer, D208):**
    - `scripts/scratch/foragers1cData.ts` (the data recorder; one colony at a time) writes
      `logs/partd2/foragers/data-c<i>.json`.
    - `scripts/scratch/foragers1c.py` (`python3 -I`) reads those and the runs. It parses each run file alone and keeps
      only `ydist` and `sync` (D207's memory fix), and writes `logs/partd2/foragers/result.json`.
    - `scripts/scratch/foragers1cSyn.py` holds the synthetic checks.
    - Gates on T012: `run:foragers1c-build-smoke` (implementer; 2 colonies, self-checks printed only),
      `run:foragers1c-data` (22 colonies via `run.sh`), `run:foragers1c-read`.
    - Compute: the data pass is about as long as item 1(b)'s 22-colony pass; the read about as long as D207's. No seal,
      since the reading follows at once.
  - **For the user:** approve, amend or reject. Open choices:
    - the stay-age classes and Kaplan–Meier points;
    - whether the 1-min window stays beside;
    - whether B005's data side (D181's Done-when 1) joins this item, with its model side left to a separate design.
- **2026-10-31 ≈ 02:30 UTC — Amendment 1: approved with amendments by the user (D224; Q26), frozen before anything is
  built.** The open choices are settled as drafted: stay-age groups (entry minute, 1–4, 5–19, 20–59, ≥ 60 min) and
  survival points (stays 10, 30, 60, 120 min; trips 2, 10, 30, 60 min); the 1-min window kept as a secondary descriptive
  comparison; B005's data side left out. Stage 2b's classes and the self-checks stay as designed. The four amendments,
  with the details the lead fixed to implement them:
  1. **The decomposition is read narrowly.** m is activity-variance-weighted co-presence among eligible ants, not
     their number. r is a normalised cross-product measure; it reads as a pairwise correlation only under equal
     deviation variances and a common within-bin correlation. D† and D‡ are both reported, and neither estimates what
     changing residence would cause.
  2. **Missingness is explicit.**
     - Runs of in minutes and of not-in minutes are **observed presence spells** and **observed absence spells**, not
       verified stays and trips; Part B's "stays", "trips", "entries" and "stay age" are read in that sense and so
       labelled in the output.
     - **Exposure, frozen, the same for data and runs:** forager-minutes observed = tracked foragers × the window's
       minutes (every minute of the window from its first to its last frame, whether or not the ant was detected).
       In-nest fraction = in minutes / exposure; entries per forager-hour = entries / (exposure / 60).
     - **Out / unseen** (data): the share of forager not-in minutes that are out and unseen, and the share of absence
       spells containing at least one out minute.
     - **Data-only sensitivity, unseen as unknown:** a presence spell ends at an out minute (an event) and is censored
       at an unseen minute; an absence spell starts at an out minute after an in minute, ends at an in minute (an
       event) and is censored at an unseen minute; a spell whose start follows an unseen minute is left out (start
       unknown); an entry counts only when the minute before it is out. The survival, entry, clustering and stay-age
       rows are repeated under this rule, data only.
  3. **Survival support.**
     - Kaplan–Meier per colony (data: its windows pooled; arm: both runs pooled). At each survival point the output
       gives, summed over colonies, events, censorings and the number at risk, and the colony-mean S.
     - A colony's S_c(t) is defined when its number at risk at t is ≥ 5 (supported follow-up), else missing.
     - **Common support:** an arm − data comparison at t uses the colonies whose S_c(t) is defined on both sides,
       fixed on the original sample; its bootstrap draws from those colonies only. The count and the excluded
       colonies are listed. A set value or comparison resting on fewer than 11 colonies is reported as missing.
     - **Median:** per colony, the first time S_c ≤ 0.5 while at least 5 are at risk; otherwise "median not
       estimable". A set's mean median is reported only over common-support colonies whose medians are estimable on
       both sides, with that count and the count not estimable.
     - Undefined values stay missing everywhere: never set to 0 and never dropped without their count.
  4. **Entry clustering against a corrected benchmark.**
     - Entry e by forager i at minute t of window W is clustered if another forager j ≠ i enters in N_e = {t − 1, t,
       t + 1} ∩ W. The observed share is the mean over a colony's entries.
     - **Benchmark:** q_e = 1 − Π_{j ≠ i} (1 − |N_e ∩ E_j| / |E_j|)^{k_j}, with k_j forager j's entries in W and E_j
       its eligible minutes in W (every minute after W's first whose previous minute is not-in for j; out under the
       sensitivity). Each of j's entries is placed independently and uniformly over E_j (with replacement, an
       approximation). Foragers with k_j = 0 contribute a factor 1. The benchmark share is the mean of q_e. The focal
       ant's own entries never enter its q_e.
     - Per-ant entry counts are kept in the output.
     - Reported: observed, benchmark and their difference, with intervals. The uniform-time reference is a simple
       benchmark: excess clustering against it does not establish interaction or triggering.
  - **Reading (D224):** the result locates discrepancies in occupancy, observed coupling and spell structure. Any model
    revision follows through a separate design (P103).
