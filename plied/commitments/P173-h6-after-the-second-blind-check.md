---
id: P173
title: >-
  H6: after the second blind check, no further coverage tuning; S1 reported as it falls
  (coverage-limited) if the cutoff is met, and the freeze proceeds
wording: >-
  No further tuning: S1 is reported under the new rule, labelled coverage-limited, with its unknown
  shares. The freeze proceeds.
made: D252
state: fulfilled
nodes: [T059]
resolved_by: D260
reviews:
  - action: run:h6-reach-20261102
    disposition: not-triggered
    because: No blind check or S1 reading in this brief
    by: lead (session 0e89af04)
    at: "2026-11-02 16:01 UTC"
  - action: run:h6-blindcheck2-20261102
    disposition: acting
    because: >-
      After this check the coverage rule is not changed again: if the cutoff is met, S1 is reported
      as it falls, labelled coverage-limited, and the freeze proceeds
    by: lead (session 0e89af04)
    at: "2026-11-02 16:55 UTC"
    inputs:
      - record: D252
        rev: cdcd4ef34d7e07f74000b894ea6fbc1781c979d8b050b255fc37ebf55783d5f8
      - record: D255
        rev: f50b4fba4c1688fad56d2fd18242fe96a850bcded2c0c4c22ed9d30f55ac6a23
  - action: commit:h6-freeze-20261102
    disposition: satisfied
    because: >-
      No coverage tuning after the second blind check: the frozen extractor is the reachability one
      D256 used (ea889e9d); the freeze proceeds; S1 will be reported coverage-limited
    by: lead (session eac59010)
    at: "2026-11-03 00:08 UTC"
    inputs:
      - record: D256
        rev: 18f3534436d222bbb3523c59cd1caccf205f78517408195ede8944058aef9bef
      - record: D259
        rev: da68ade2ca9f550792fdbb88369ec191646cd6fef041de62b8c6cd7d508f05ef
  - action: commit:h6-freeze-20261102
    disposition: satisfied
    because: >-
      Re-read D259@8bc940ad09b0: one dated line appended after the commit (committed as fb6af11,
      then the H6 output folder unsealed); the frozen files and hashes are unchanged, so the
      disposition for this commit stands
    by: lead (session eac59010)
    at: "2026-11-03 00:10 UTC"
    inputs:
      - record: D259
        rev: 8bc940ad09b0e75660f466f2aedc70317eaf37118055fa922fecc881a0740227
  - action: run:h6-reading-20261103
    disposition: acting
    because: >-
      The run executes the frozen reader (scripts/frozen/h6/…/reader.ts 3c3985c0, D259) unchanged on
      the frozen extractor's 22 intermediates (logs/h6-work-next, hashes matching the rebuild
      report), all parts, default draws 1000 and boot 2000; no coverage tuning; S1 will be reported
      as it falls, labelled coverage-limited, with its unknown shares
    by: lead (session eac59010)
    at: "2026-11-03 00:30 UTC"
    inputs:
      - record: D256
        rev: 18f3534436d222bbb3523c59cd1caccf205f78517408195ede8944058aef9bef
      - record: D259
        rev: 8bc940ad09b0e75660f466f2aedc70317eaf37118055fa922fecc881a0740227
  - action: run:h6-reading2-20261103
    disposition: acting
    because: >-
      As for run:h6-reading-20261103, which died of heap exhaustion before writing anything: the
      same frozen reader, inputs and options, rerun with Node's heap raised to 6000 MB (no change to
      code or results)
    by: lead (session eac59010)
    at: "2026-11-03 00:35 UTC"
---

## History
- 2026-11-02 15:59 UTC lead (session 0e89af04): created — D252: the user's stopping rule
- 2026-11-02 16:01 UTC lead (session 0e89af04): review for run:h6-reach-20261102: not-triggered — No blind check or S1 reading in this brief
- 2026-11-02 16:19 UTC lead (session 0e89af04): reviewed D253@a4a119c34e10, D254@7cc414a2bee9; D253 and D254 cite D252 for the clause's definition; the second blind check has not run (it waits on Q35), so this stopping rule is not yet reached
- 2026-11-02 16:23 UTC lead (session 0e89af04): reviewed D255@f50b4fba4c16; D255 fixes the clause's last open detail (ring neighbours, exact form) so the second blind check can run; this stopping rule applies to that check unchanged
- 2026-11-02 16:55 UTC lead (session 0e89af04): review for run:h6-blindcheck2-20261102: acting — After this check the coverage rule is not changed again: if the cutoff is met, S1 is reported as it falls, labelled coverage-limited, and the freeze proceeds
- 2026-11-02 16:57 UTC lead (session 0e89af04): reviewed D256@18f3534436d2; D256: the cutoff is met at the second check, so this rule now applies: S1 reported as it falls, labelled coverage-limited, with its unknown shares; no further tuning; the freeze proceeds after V1-V4. Fulfilled when the S1 reading is reported
- 2026-11-02 22:01 UTC lead (session eac59010): reviewed D257@0a64c040066c; D257 read: cites D252 only for the coverage clause the extractor carries; no coverage tuning, nothing changes here
- 2026-11-03 00:07 UTC lead (session eac59010): reviewed D258@81f3dbbbcece, D259@da68ade2ca9f; Reviewed D258, D259: the freeze carries the reachability clause as P173 fixed it; S1 is still to be reported as it falls, labelled coverage-limited, at the empirical reading; stays open
- 2026-11-03 00:08 UTC lead (session eac59010): review for commit:h6-freeze-20261102: satisfied — No coverage tuning after the second blind check: the frozen extractor is the reachability one D256 used (ea889e9d); the freeze proceeds; S1 will be reported coverage-limited
- 2026-11-03 00:10 UTC lead (session eac59010): review for commit:h6-freeze-20261102: satisfied — Re-read D259@8bc940ad09b0: one dated line appended after the commit (committed as fb6af11, then the H6 output folder unsealed); the frozen files and hashes are unchanged, so the disposition for this commit stands
- 2026-11-03 00:30 UTC lead (session eac59010): review for run:h6-reading-20261103: acting — The run executes the frozen reader (scripts/frozen/h6/…/reader.ts 3c3985c0, D259) unchanged on the frozen extractor's 22 intermediates (logs/h6-work-next, hashes matching the rebuild report), all parts, default draws 1000 and boot 2000; no coverage tuning; S1 will be reported as it falls, labelled coverage-limited, with its unknown shares
- 2026-11-03 00:35 UTC lead (session eac59010): review for run:h6-reading2-20261103: acting — As for run:h6-reading-20261103, which died of heap exhaustion before writing anything: the same frozen reader, inputs and options, rerun with Node's heap raised to 6000 MB (no change to code or results)
- 2026-11-03 00:43 UTC lead (session eac59010): set state=fulfilled; set resolved_by=D260 — D260 reports S1 under the frozen rule, labelled coverage-limited, with its unknown shares; no further tuning
