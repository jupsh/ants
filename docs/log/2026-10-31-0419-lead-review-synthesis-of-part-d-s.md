---
id: D231
date: 2026-10-31
time: 04:19
kind: review
title: Lead review: synthesis of Part D's synchrony readings F103-F110 before the focused review (D230): the shared failure is slow co-variation, short at 10 min and in coupling, not co-presence, with short windows matched and the spatial profile a separate constraint every member misses; limits and untested hypotheses listed apart; F111 left out (it constrains no synchrony hypothesis)
---
- **2026-10-31 ≈ 04:19 UTC — Lead review: synthesis of Part D's synchrony readings F103-F110 before the focused review (D230): the shared failure is slow co-variation, short at 10 min and in coupling, not co-presence, with short windows matched and the spatial profile a separate constraint every member misses; limits and untested hypotheses listed apart; F111 left out (it constrains no synchrony hypothesis).**
  - **What (D230):** the one-page synthesis the user asked for before the review scope. Each claim's home is its
    finding; this entry points to them and ranks nothing. All the data involved are development data (the Stroeymeyt
    22 fit colonies, light phase, and the Stage 2b simulations). The S1 windows are 5 s, 1 min and 10 min (D204).
    "Members" are the calibrated Part D synchrony members: family T (transmission: T20f, T20m) and family D (drivers:
    Eu-M, El20-M, Ed2, Ed5, Ed20, Ew5, Es), with controls Eu, El20 and C2 base (D158, D173).
  - **F111 (B020) is left out.** It concerns the Mailleux recruiter's crop gate at B001's historical pilot point, and
    it constrains no synchrony hypothesis. A crop or hunger state as a slow synchrony driver is not tested by it.
  - **Findings (what the readings support):**
    1. **No member reproduces the data jointly** (F103). At this precision that is expected even of a perfect model
       (F097), so the information lies in which rows are outside.
    2. **The failure every arm shares is slow.**
       - Every arm is short of the data's 10-min D_w, all ants and foragers, and outside in most arms (F104).
       - Every non-base arm is equivalent at 5 s (F104). The members were calibrated on the 1-min cell (D173).
       - The short windows are therefore matched by construction or by result, and the deficit sits at the slowest
         window measured.
    3. **The spatial profile is a second, separate constraint, and every member misses it** (F107):
       - the T members have too much near-band co-movement (raw C(< 5 mm) 1.7–2.2 times the data's) and a lower R;
       - the D members other than Es have about twice the data's 20–40 mm band;
       - Es has about twice the data's R_J.

       The data's distance decay exceeds the joint-shift null J (F095). That alone names no mechanism: a spatially
       varying response to a shared signal also passes J (F094). The (R, S3₂, R_J) diagnostic separates the T
       members from the D members on these colony set-ups (F106).
    4. **The slow synchrony varies over the light phase** (F108). The data's 10-min D_w is highest at 06–10 UTC, in
       nurses and foragers alike, and every arm is below that block.
    5. **Event associations** (F109):
       - nest activity rises after queen movement onsets, beyond matched controls and above the 10 % margin;
       - forager entries are followed by a smaller rise, which was already under way before the entry.
    6. **Decomposition** (F110):
       - The 10-min shortfall is in observed coupling r, not in co-presence m. Standardising the arms to the data's
         co-presence recovers none of it, for nurses and all ants as for foragers.
       - The arms' foragers are about half as active as the data's in the minute of an observed entry and the next four.
       - They enter more often and have longer observed absence spells.
       - The 06–10 block's higher forager D_w is also in coupling.
  - **What any candidate explanation must therefore meet** (constraints drawn from the findings above, not new
    results):
    - **C1:** raise 10-min co-variation among ants in the nest, nurses and foragers, through coupling.
    - **C2:** leave 5-s and 1-min synchrony and activity levels where they are (F104, D173).
      *Corrected 2026-10-31 ≈ 17:30 UTC (D233, the user):* C2 keeps the supported short-window behaviour, not every
      current activity level. The 5-s equivalence concerns the non-base arms on all ants, the calibration was on
      all-ants 1-min synchrony, and Es and post-entry activity are already discrepant (F100, F110).
    - **C3:** keep the distance profile: no excess near-band like T's, no doubled 20–40 mm band like D's, and R_J
      not inflated like Es's (F107, F095).
    - **C4:** allow the slow synchrony to vary over the light phase (F108).
    - **C5:** account for post-entry forager activity and the queen-onset association (F109, F110), as cause,
      consequence or by-product.
  - **Limitations:**
    - **Simulation length:** 2 × 4 h simulated against 8–12 h of light, so the slowest cell has the fewest independent
      blocks (F103, F104). D_w is computed within 4-h blocks on both sides (D205). Whether the data's and the
      simulations' blocks differ in coverage is not checked.
    - **Inherited from C2 and Stage 2:** Es is clipped 94 % of the time (F100). Packing and the near-share deficit are
      carried (F078). Q03 is not rechecked for the members (F103).
    - **Capability:** the same-member and cross-member comparisons share datasets, and all of them reuse the same 22
      colony set-ups. The pooled false-positive rate (7.4 %) does not give per-member error control, and within T it is
      20 % (F105, F106).
    - **"Unresolved" never means a match** (F107, F110).
    - **F108's limits:** time of day cannot be separated from time since recording began, and lights-on time is not
      checked. A 10-min shortfall is not a 10-min oscillator (P80), and the time-of-day pattern names no cause (P83).
    - **F109's limits:** the associations are observational, and shared drivers or reverse causation remain possible.
      41 % of queen onsets have a forager entry within their windows. The 10-min shortfall is not tested against them.
    - **F110's limits:**
      - it is arithmetic accounting, not a causal account, and m and r are not independent mechanisms;
      - 29 % of the data's not-in minutes are unseen;
      - post-entry bursts are not ruled out (D227);
      - the independent reproduction covers two colonies (D228).
    - **Observer and windows:** every member is seen through the frozen 2-fps tracker. Nothing slower than 10 min
      was measured (D205).
  - **Hypotheses left untested.** None is supported by these readings; each is named only so the review knows what
    to look for:
    - **H1, a slow common input:** temperature, airflow, vibration or light, varying over minutes to hours. The
      implemented drivers miss at 10 min (F104), but a slower or differently structured driver is untested. C3 rules
      out profiles like D's, not common input as such.
    - **H2, a slow per-ant internal state with local coupling.** This is the unadopted latent-drive proposal
      (`docs/research/latent-activity-design.md`, stage 2).
    - **H3, excitable activation with refractoriness**, giving colony cycles. Sources: Cole 1991, Boi et al. 1999,
      Napoli et al. 2026 (X018). This is a parked literature-derived structure (STATUS, Rules in force).
    - **H4, ant-mediated input from returning foragers:** food inflow, or post-entry activity spreading to nurses
      (F110). Boi et al. 1999 report that returners disrupt the entrance group's periodicity.
    - **H5, queen-linked activation** (F109). It is a retained hypothesis, not grounds for prioritising a queen-linked
      addition (D222; P104).
    - **H6, initiator and transfer individuals:** a few spontaneous initiators, with intermediaries carrying activity
      between regions. This comes from Richardson et al. 2026, known only through X023's exposure.
    - **H7, a non-biological account:** the set-up or the time since recording began, or colony composition changing
      over the day (F108; P83).

    The hypotheses are not exclusive; H4 and H5, for example, are ant-mediated forms of common input. Common-input and
    ant-mediated explanations stay as alternatives (D227).
