---
id: D226
date: 2026-10-31
time: 03:08
kind: reading
title: Part D item 1(c) read (D223 amendment 1, D224, D225): the foragers' 10-min D_w shortfall sits in observed coupling r (data 0.085, arms 0.006-0.069, 11 of 12 below), not in co-presence m (data 25.4, arms 24.0-24.2, all unresolved); standardising the arms to the data's co-presence recovers none of it, the data's coupling at the arms' co-presence nearly all; the arms' foragers lack the data's activity just after an observed entry (entry minute 0.19 against 0.08-0.11), enter more often and have longer observed absence spells, many of the data's short absences being unseen minutes; arithmetic accounting and observational, not causal
---
- **2026-10-31 ≈ 03:08 UTC — Part D item 1(c) read (D223 amendment 1, D224, D225): the foragers' 10-min D_w shortfall sits in observed coupling r (data 0.085, arms 0.006-0.069, 11 of 12 below), not in co-presence m (data 25.4, arms 24.0-24.2, all unresolved); standardising the arms to the data's co-presence recovers none of it, the data's coupling at the arms' co-presence nearly all; the arms' foragers lack the data's activity just after an observed entry (entry minute 0.19 against 0.08-0.11), enter more often and have longer observed absence spells, many of the data's short absences being unseen minutes; arithmetic accounting and observational, not causal.**
  - **Runs:**
    - `foragers1c-data-20261031T025750Z` (gated `run:foragers1c-data`; exit 0, 2 min 15 s): the recorder on all 22 colonies,
      `logs/partd2/foragers/data-c*.json`.
    - `foragers1c-read-20261031T030015Z` (gated `run:foragers1c-read`; exit 0, 336 s):
      `scripts/scratch/foragers1c.py` (md5 `56d8b818`), output `logs/partd2/foragers/result.json` (sha256
      `119b4869…`). Scripts as D225.
  - **Self-checks first (P113):** all pass. They were read in the run log before anything else.
    - **Check 1:** stored D_w is rebuilt from the recorder and `ydist` for every data colony and run, at 10 min and
      1 min, for all ants, nurses and foragers, to a relative 1e-9.
    - **Check 2:** D − 1 = m · r on 2,002 cells, largest error 6e-15.
    - **Check 3:** the data's set values equal `read.json`'s.
    - **Composition:** tracked nurses and foragers are identical in the data and every run.
    - **Missing:** 25 survival cells fall below the 11-colony floor; no other set cell is undefined, and every
      interval is defined.
  - **Rows** (light; foragers unless stated; colonies weighted equally; 2,000 colony draws). "Below", "above" and
    "unresolved" refer to the arm − data interval, descriptively. **Stage 2b's classes are unchanged (P82):** at
    10 min on foragers T20m and Eu stay "unresolved" and the rest "outside"; on all ants T20m, Eu-M and Eu stay
    "unresolved". The intervals here are a descriptive bootstrap, not Stage 2b's equivalence test, and reclassify
    nothing.
    - **Part A, the split at 10 min (m: activity-variance-weighted co-presence among eligible ants; r: a normalised
      cross-product measure, a correlation only under equal deviation variances and a common within-bin correlation):**

      | | data | arms (range) | arm − data |
      |---|---|---|---|
      | D_w | 3.12 [2.51, 3.86] | 1.09 (base) – 2.37 (T20m) | below in all 12 (T20m −0.76 [−1.43, −0.17], Eu −0.80 [−1.52, −0.19]) |
      | m | 25.4 [19.6, 31.4] | 24.0 – 24.2 | about −1.3 in each; unresolved in all 12 |
      | r | 0.085 [0.069, 0.102] | 0.006 (base) – 0.069 (T20m) | below in 11; T20m unresolved (−0.016 [−0.036, 0.003]) |

    - **The two arithmetic standardisations** (neither estimates what changing residence would cause; P106):
      - **D† (the arm's r at the data colony's m):** D† − D_arm is 0.002–0.054, unresolved in all 12. D_data − D† is
        0.70 (T20m) to 2.02 (base), above 0 in all 12.
      - **D‡ (the data's r at the arm's m):** D_data − D‡ is 0.12–0.15, unresolved in all 12. D‡ − D_arm is
        0.62–1.89, above 0 in all 12.
    - **All ants and nurses, 10 min (beside):** the same pattern.
      - **All ants:** m 91.3 against 88.1–89.3 (below in all 12, by about 2–3 %); r 0.060 against 0.002–0.052 (below in
        11, T20m unresolved). D† recovers 0.006–0.139 of a 0.89–5.07 gap.
      - **Nurses:** m 65.2 against 63.1–64.3; r 0.066 against 0.002–0.058 (below in 11, Eu-M unresolved).
    - **Foragers at 1 min (secondary, D224):** D 2.12 against 1.05–2.16 (below in 8, unresolved in 4). r 0.048
      against 0.003–0.055: below in 8; T20f, T20m and El20 unresolved; Eu above. The 1-min cell is where the members
      were calibrated (all ants, D173).
    - **Stay-interior bins (sensitivity):** the data's forager D_w is 2.62 [2.16, 3.17] on interior bins, against
      3.12 on all bins. Every arm is below it (1.08–2.08), and r is below in 10 (T20m, Eu unresolved). The interior
      share of eligible forager ant-bins is 0.87 in the data against 0.78–0.80 in the arms (below in all 12).
    - **Part B, observed presence and absence spells (minute resolution; not verified stays and trips; P107):**
      - **In-nest fraction:** 0.81 against 0.735–0.746 (below in 9; T20f, Es and Eu unresolved). Co-present foragers
        per minute: 26.1 against 23.9–24.2 (below in all 12). Eligible foragers per D bin: 26.3 against 24.8–25.1
        (unresolved in all 12).
      - **Entries per forager-hour:** 0.81 against 0.90–1.00 (above in all 12).
      - **Presence spells:**
        - S(10) is 0.60 against 0.77–0.80 (above in all 12) and S(30) is 0.41 against 0.48–0.52 (above in all 12).
        - S(60) is 0.27 against 0.25–0.30 (unresolved in all 12).
        - S(120) is 0.16 against 0.10–0.13 (below in all 12, on 14–18 support colonies).
        - Median: 22 min against 30–35 (above in 11; base unresolved).
        - So the arms have fewer short and fewer very long presence spells.
      - **Absence spells:**
        - S(2) is 0.41 against 0.60–0.63; S(10) 0.19 against 0.43–0.46 (19 support colonies); S(30) 0.12 against
          0.41–0.45 (16). All above.
        - S(60): the arms are missing (≤ 2 colonies with ≥ 5 at risk, below the floor).
        - Median: 2.2 min against 11.0–13.6 (above in all 12).
      - **Activity by stay age** (moving fraction):

        | | entry minute | 1–4 | 5–19 | 20–59 | ≥ 60 | overall |
        |---|---|---|---|---|---|---|
        | data | 0.192 | 0.095 | 0.052 | 0.047 | 0.046 | 0.051 |
        | arms except Es | 0.078–0.106 | 0.057–0.070 | 0.051–0.064 | 0.047–0.059 | 0.043–0.059 | 0.049–0.061 |
        | Es | 0.018 | 0.014 | 0.017 | 0.018 | 0.017 | 0.017 |

        Every arm is below the data in the entry minute and minutes 1–4. From 5 min on, most arms are unresolved or
        slightly above, and Es is below throughout.
      - **Entry clustering** (the share of entries with another forager's entry within ± 1 min):
        - The data's observed share is 0.652 against the simple benchmark's 0.583, an excess of 0.069
          [0.052, 0.088].
        - The arms' observed shares are 0.69–0.73, above the data in 11 (Es unresolved). Their benchmarks are higher
          too, because they enter more often.
        - Their excesses are 0.022–0.041, below the data's in all 12.
        - Excess against this benchmark does not establish interaction or triggering (P111).
      - **Slow variability within an ant:** 0.0044 against 0.001–0.003 (below in all 12).
    - **Part C, coverage:**
      - Eligible bins per forager and block (K): 19.1 against 18.3–18.6, unresolved in all 12.
      - The share of in-minutes seen by D_w is 0.98 on both sides.
      - Steps per in-minute: 100.2 against 95.3–98.9 (below in 11).
      - **The data's not-in minutes:** 71 % are out and 29 % unseen, and only 42 % of its absence spells contain an
        out minute.
      - **Data-only sensitivity, unseen minutes unknown:**
        - Absence median 8.4 min (21 colonies) and S(10) 0.36 (18 colonies).
        - Presence median 12.1 min (18 colonies); entries 0.33 per forager-hour.
        - Moving fraction 0.335 in the entry minute and 0.154 in minutes 1–4.
        - Clustering excess 0.038 [0.012, 0.068].
    - **Part D, the data by light block** (06–10, 10–14, 14–18 UTC; 22 colonies each):
      - **D_w:** 3.84, 2.11 and 2.13. The contrasts with 06–10 are −1.73 and −1.71, both below 0.
      - **m:** 25.4, 25.5 and 25.3 (contrasts unresolved). **r:** 0.104, 0.051 and 0.051 (contrasts −0.052, both
        below 0).
      - **In-nest fraction and co-present foragers:** flat, contrasts unresolved.
      - **Entries per forager-hour:** 0.90, 0.73 and 0.81 (contrasts −0.18 and −0.09, both below 0).
  - **What this shows and does not (D223 reading rules, amendment 1; D224; P80, P82, P83, P105–P111):**
    - **The foragers' 10-min shortfall is located in observed coupling, not in co-presence.** ~~Every arm has about as
      many foragers sharing a 10-min bin as the data, weighted by deviation size (m within about 5 %, unresolved).~~
      Every arm's m is a few percent below the data's, and the difference is unresolved in all 12, which does not
      establish equivalence (amendment 1).
      Its foragers' slow deviations co-vary far less (r a fifth to four fifths of the data's; T20m unresolved). The
      decomposition is arithmetic: m and r are not independent mechanisms, and neither standardisation says what
      changing residence would do.
    - **The same holds for nurses and all ants.** The slow-synchrony shortfall is not specific to foragers.
    - **Spells differ, but not where D_w is short.** The arms' foragers enter more often, have fewer short and fewer
      very long observed presence spells, and longer observed absence spells. These are the known stay and trip
      discrepancies (F077, F038), seen at minute resolution. ~~They change co-presence little.~~ The co-presence
      difference they leave is unresolved; that does not make residence irrelevant (amendment 1). Part of the data's short
      absences are unseen minutes (29 % of not-in minutes; 58 % of absence spells have no out detection), so the
      absence spell comparison mixes nondetection with absence. The sensitivity moves the data's absence median from
      2.2 to 8.4 min.
    - **Where the data's foragers differ in activity:** they are about twice as active in the minute of an observed
      entry and in the next four minutes as any arm's (four times Es's); later in a spell the arms are close. Entries
      also cluster beyond the simple benchmark more in the data. A shared post-entry burst among co-arriving foragers
      would raise co-variation. **That is a candidate, not a finding:** the stay-interior bins, which exclude every
      ant-bin with a not-in minute, still show the shortfall~~, so it is not confined to entry and exit bins~~ (amendment
      1: this does not rule out post-entry bursts); and none of this is tested as a cause.
    - **Es's foragers** move at about a third of the data's rate at every stay age (overall 0.017 against 0.051), the
      only arm with a level difference. This is beside F100's clipping of Es's multiplier; it is not examined here.
    - **The light-block pattern** (F108) also sits in r: the 06–10 block's forager D_w is higher through coupling
      ~~at unchanged co-presence~~ (its m contrasts unresolved, not shown equal; amendment 1), with more entries per
      hour. This is variation over the light phase that the members do
      not represent, confounded with time since recording began (P83). A 10-min shortfall is not a 10-min oscillator
      (P80).
    - No trip class was fitted, and B005 stays separate (D224; P70).
  - **Finding:** F110.
  - **Next (for the user):** any model revision addressing slow coupling or post-entry activity is a separate design
    (P103, D224). B005, 1(d) and 1(e) stay as they were ordered (D222).
- **2026-10-31 ≈ 03:21 UTC — Amendment 1: two readings corrected on the user's guidance (D227).**
  - **Interior bins.** The rule (`foragers1c.py` `interior_mask`) keeps an ant-bin when every one of its ten minutes
    has an in-nest detection. Such a bin can still include an entry during its first minute, an excursion shorter than
    a minute, or activity just after an earlier entry. So "the shortfall persists under this restriction" is supported;
    "it is not confined to entry and exit bins", and with it any reading that post-entry bursts cannot explain it, is
    withdrawn: that remains untested.
  - **Co-presence.** Unresolved differences in m (and in the light-block m contrasts) do not establish equivalence,
    and do not make residence biologically irrelevant. The phrases "about as many", "change co-presence little" and
    "unchanged co-presence" above are struck for that reason. The located shortfall in r and both standardisations
    stand as read.
  - The reading waits on an independent implementation of the item's statistics (D227) before it is relied on.
- **2026-10-31 ≈ 03:33 UTC — The independent implementation agrees (D228):** 643 of 646 per-colony values on the
  two-colony sample, the rest a duplicate key and a block-edge convention in one coverage row. The reading stands as
  amended.
