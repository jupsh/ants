---
id: P202
title: >-
  Lab trial: restore Claude pacing (reserve 0.15, paceSlack 0.05) before the 2026-11-12 01:00 UTC
  reset
wording: >-
  the trial setting is restored to reserve 0.15 and paceSlack 0.05 before the Claude weekly reset at
  2026-11-12 01:00 UTC, or when the user ends the trial if sooner
made: D308
state: open
nodes: [T065]
reviews:
  - action: run:lab-test-fixture
    disposition: not-applicable
    because: >-
      the build changes tests only; the live config's trial values are left as D308 set them, and
      the restore stays due
    by: lead (session 487510ed)
    at: "2026-11-06 03:11 UTC"
    inputs:
      - record: D308
        rev: 3e3d773d24c617b56b6f79206dbcfadcf10c3123d9616c22831b0b1421d73cc3
  - action: run:lab-ui
    disposition: not-applicable
    because: the UI build does not touch lab.config.json; the restore stays due
    by: lead (session 487510ed)
    at: "2026-11-06 03:17 UTC"
    inputs:
      - record: D308
        rev: 3e3d773d24c617b56b6f79206dbcfadcf10c3123d9616c22831b0b1421d73cc3
  - action: run:lab-session-errors
    disposition: not-applicable
    because: does not touch lab.config.json; the restore stays due
    by: lead (session 487510ed)
    at: "2026-11-06 03:30 UTC"
    inputs:
      - record: D308
        rev: 3e3d773d24c617b56b6f79206dbcfadcf10c3123d9616c22831b0b1421d73cc3
  - action: run:lab-claude-schema
    disposition: not-applicable
    because: does not touch lab.config.json; the restore stays due
    by: lead (session 487510ed)
    at: "2026-11-06 03:38 UTC"
    inputs:
      - record: D308
        rev: 3e3d773d24c617b56b6f79206dbcfadcf10c3123d9616c22831b0b1421d73cc3
  - action: run:lab-packet-plied
    disposition: not-applicable
    because: does not touch lab.config.json's Claude pacing; the restore stays due
    by: lead (session 487510ed)
    at: "2026-11-06 04:19 UTC"
    inputs:
      - record: D308
        rev: 3e3d773d24c617b56b6f79206dbcfadcf10c3123d9616c22831b0b1421d73cc3
  - action: run:lab-rehearsal
    disposition: not-applicable
    because: >-
      the Claude pacing values are not changed; the rehearsal stops at Claude weekly 0.58, under the
      D308 cap
    by: lead (session 487510ed)
    at: "2026-11-06 04:26 UTC"
    inputs:
      - record: D308
        rev: 3e3d773d24c617b56b6f79206dbcfadcf10c3123d9616c22831b0b1421d73cc3
  - action: run:lab-codex-plied
    disposition: not-applicable
    because: does not touch lab.config.json's Claude pacing (D321's 0.30/0.85 stays); the restore stays due
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:17 UTC"
    inputs:
      - record: D308
        rev: 3e3d773d24c617b56b6f79206dbcfadcf10c3123d9616c22831b0b1421d73cc3
      - record: D321
        rev: 2c92df3da82f859a06ec521556e29afa06d9e91f1994898b4452b28849a068c2
  - action: commit:partd-backfill-records-20261107
    disposition: not-applicable
    because: lab.config.json is in ants-lab and not in this commit; the restore stays due
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:33 UTC"
    inputs:
      - record: D308
        rev: 3e3d773d24c617b56b6f79206dbcfadcf10c3123d9616c22831b0b1421d73cc3
      - record: D325
        rev: 7326260db82fda4cc885860de4618ee923614d23b6c81f286bed853e1ff5aaa9
---

## History
- 2026-11-06 03:11 UTC lead (session 487510ed): created — D308: the user's trial cap at 62 %
- 2026-11-06 03:11 UTC lead (session 487510ed): review for run:lab-test-fixture: not-applicable — the build changes tests only; the live config's trial values are left as D308 set them, and the restore stays due
- 2026-11-06 03:17 UTC lead (session 487510ed): review for run:lab-ui: not-applicable — the UI build does not touch lab.config.json; the restore stays due
- 2026-11-06 03:30 UTC lead (session 487510ed): review for run:lab-session-errors: not-applicable — does not touch lab.config.json; the restore stays due
- 2026-11-06 03:38 UTC lead (session 487510ed): review for run:lab-claude-schema: not-applicable — does not touch lab.config.json; the restore stays due
- 2026-11-06 04:19 UTC lead (session 487510ed): review for run:lab-packet-plied: not-applicable — does not touch lab.config.json's Claude pacing; the restore stays due
- 2026-11-06 04:26 UTC lead (session 487510ed): review for run:lab-rehearsal: not-applicable — the Claude pacing values are not changed; the rehearsal stops at Claude weekly 0.58, under the D308 cap
- 2026-11-07 05:17 UTC lead (session 9871fd6b): review for run:lab-codex-plied: not-applicable — does not touch lab.config.json's Claude pacing (D321's 0.30/0.85 stays); the restore stays due
- 2026-11-07 05:33 UTC lead (session 9871fd6b): review for commit:partd-backfill-records-20261107: not-applicable — lab.config.json is in ants-lab and not in this commit; the restore stays due
