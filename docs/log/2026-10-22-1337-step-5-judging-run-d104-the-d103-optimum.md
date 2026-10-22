---
id: D105
date: 2026-10-22
time: 13:37
kind: run
title: Step-5 judging run (D104): the D103 optimum on fresh judge seeds with the sensitivities, the synchrony gate and the Buffin check; settings and readings fixed before launch
---
- **2026-10-22 ≈ 13:37 UTC — Step-5 judging run (D104): the D103 optimum on fresh judge seeds with the sensitivities, the synchrony gate and the Buffin check; settings and readings fixed before launch.**
  - **What:** the judgment fixed in D094 and Rules in force, at the D103 optimum (`data/fits/colony-m1999-c2-main-shared.json`,
    md5 `48aa1723…`), as D104 decided. Script `scripts/scratch/box/run-step5judge.sh` (md5 of every input printed
    first). Outputs on the box: `logs/step5/judge-<arm>.{json,log}`, `gate.log`, `buffin.log`, `status`.
  - **Settings (declared now):**
    - `reportM1999.ts --fit … --n 240 --allow-code-change` (240 recruiters per day, the script's frozen default),
      seeds `seedFor(1999, 'judge')`, never used by the step-5 fit (its seeds are fit / cmaes / probe / select). The
      same seeds in every arm, so arms are paired. The fit's design: shared warm-ups (4 per nest), dt 0.025, warm-up
      7200 s, B3 contacts ≥ 0.04 s, followNestmates, lazy rests except under the oracle;
    - arms, in order: `base`; `coupled` (`--oracle coupled:1:60`); `placebo` (`--oracle placebo:0.53:60`, F025's arm
      as logged, D093 "κ = 1 with its placebo"); `contact1` (`--contactMin 1`); `giveup60` / `giveup300` (`--set
      nest.giveUpTime=…`); `nurse` (`--roles nurse`);
    - Buffin dish check: `checkDishBuffin.ts --fit … --dishes 200`, beside the judge on one core (niced). SIM_WORKERS 62
      for the judge; the box quota is 122 CPUs.
  - **Readings (fixed before the fit, D094 / Rules in force; restated, not changed):**
    - **Adoption rule:** (1) no free parameter within 5 % of a box end. This already fails (D103: density and
      returnRate, unit scale); (2) condition 4: no row beyond |fitZ| 5, plus the no-bout bound; (3) Buffin: |z| ≤ 2
      for the ML ending rate vs 0.039 /s and for SD / mean vs 28 / 29.
    - **Adequacy:** no row |z| > 3 (combinedZ, 10 blocks), at most 2 in (2, 3], at most ≈ 11 % of recruiters per day
      without a bout.
    - **Sensitivities** (contacts ≥ 1 s, giveUpTime 60 / 300 s, all-nurse nestmates): the adequacy and condition-4
      verdicts in each arm. A verdict that flips is a real result. D094 says refit there; under D104 (no refits now),
      whether to refit goes to the user. The bound condition cannot flip, because the point is the same.
    - **Synchrony gate** (`syncGateM1999.ts`): fail if any row's coupled shift differs from the placebo's by more than
      1 combined SE (the row's SE_data ⊕ SE_sim in `base`), or if the adequacy or condition-4 verdict changes under
      coupling. The realised SD of log g is reported beside the placebo SD; a mismatch > 20 % is flagged and the rule
      is unchanged (as the oracle correction). Fail = disclosed blocker for freezing the structure before any held-out
      test; no refit, no κ tuning. Pass = insensitive to this artificial synchrony only.
    - **Not adopted / not adequate →** the failing rows are reported as a transfer failure (stopping rule), and the
      plan goes on to step 9. E6 later uses this fit as the best step-5 fit, disclosed.
    - Reported only: zSD (between-recruiter log-SD), Table 2b (development), leaver / stayer diagnostics.
  - **Box:** idle before launch. Changed files copied (colonyBles, colonyMailleux1999, reportM1999, fitM1999,
    syncGateM1999, oracle test). md5 equal to the local tree is checked before launch, and the box simHash must read
    `1388de91d25b0ca4`.
- 2026-10-22 ≈ 13:38 UTC: launched, `run.sh` run `step5judge-20261022T133809Z` (box, 62 workers). Box md5 equal to the local tree for every input (`logs/md5-step5judge.txt`), box simHash `1388de91d25b0ca4`, `test/oracle.test.ts` 12 / 12 on the box. Projected ≈ 30–45 min.
