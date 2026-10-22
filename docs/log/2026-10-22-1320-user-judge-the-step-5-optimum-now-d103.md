---
id: D104
date: 2026-10-22
time: 13:20
kind: decision
title: User: judge the step-5 optimum now (D103 option 1) under the stopping rule, instead of Plan steps 6–8
---
- **2026-10-22 ≈ 13:20 UTC — User: judge the step-5 optimum now (D103 option 1) under the stopping rule, instead of Plan steps 6–8.**
  - **User:** "Yeah, let's judge now" (reply to D103's two options).
  - **What changes in the plan:** Plan steps 6–8 are skipped for step 5. Those are the gate at the optimum, recovery,
    refits with a larger budget, and fit protection. The best step-5 point as fitted (D103) is judged on fresh seeds
    by the rules fixed before the fit (D094, Rules in force). Under the stopping rule, a fit that is not adequate is
    reported as a transfer failure, and the plan goes on to step 9. E6 later runs on this fit as the best step-5 fit,
    disclosed as such.
  - **Why (D103):** the bound hits look structural (the restart still drifting into both walls), so a larger budget is
    not expected to clear them. The failing rows are needed either way.
  - **Disclosed with the result:** the point is not converged, so its rows describe this fit, not the best
    point within the boxes. The dt and warm-up gates were not repeated at the optimum.
  - **Judging code, built after this decision** (tests first; nothing changes the default path):
    - `ColonyOptions.oracle`'s placebo gives ants added after the first step their own stream when they appear. Before
      this, the 1999 recruiter, added at entry, would have read an undefined OU state (multiplier NaN). Stroeymeyt
      runs add no ants, so earlier placebo runs reproduce;
    - `M1999Options.oracle` is passed to the colony. With a coupled oracle, each recruiter carries its colony's
      log-g sums (`oracleLog`);
    - `reportM1999.ts` gains:
      - the arms: `--roles nurse` (nestmate `foragerFrac` 0; the recruiter stays a forager), `--contactMin`, `--set
        nest.k=v`, `--oracle coupled|placebo` and `--out` (rows as JSON);
      - the adoption-rule parts it can read: per-row fitZ, condition 4, and the 5 % bound check on the unit scale
        (D103);
      - the realised SD of log g;
      - the fit's `lazyRest`, followed except under the oracle (refused there; bit-identical either way);
    - `scripts/syncGateM1999.ts` reads the gate from the three arms' JSON files;
    - `fitM1999.ts` recording slip fixed. Under C2 the density entry is a copy, so `fixed` listed `density: 1` although
      density was free (k 5, value in `free`). That is metadata only. The step-5 fit file is left as written, and
      `reportM1999.ts` reads around it.
  - **Checks:**
    - identity at the step-5 optimum with the oracle off (`scripts/scratch/identM1999Oracle.ts`: 3 days × one shared
      nest × 4 recruiters, warm-up 600 s, stepped and lazy): sha256 `dddbafeb…` before and after;
    - `test/oracle.test.ts` +3 (placebo SD 0 bit-identical in the 1999 runner; the late recruiter's results finite;
      the coupled arm records log g; lazy refuses the oracle);
    - tsc clean; `npm test` 250 / 250 after re-stamping.
  - **simHash** `3c4d7e2b18d7f147` → `1388de91d25b0ca4`. The 9 results stamped at `3c4d7e2b…` were re-stamped with a
    `provenance.restamped` trail (`scripts/scratch/restampD104.ts`, as D096). The files that were stale before stay
    stale (backlog check: 5). The fit was made under `3c4d7e2b…`, so `reportM1999.ts` runs with
    `--allow-code-change`, justified by the identity check.
  - **Seen while building:** local smoke runs at n 8 recruiters per day. Their outputs were checked only for running
    and format. The lines seen were:
    - the bound line (as D103);
    - the coupled smoke arm's realised SD of log g, 0.610;
    - the gate script's last line, "FAIL", at n 8. That is meaningless at that n and not a reading.

    No row value or z was looked at.
