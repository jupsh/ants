---
id: T035
title: Forager-entry and queen triggers
parent: T023
status: open
next: 1
actor: lead
approval:
  state: approved
  by: D213
backlog: B023
links: [D134, D211, D212, D213, D215, D216, D217, D218, D219]
scanned:
  - record: D212
    rev: d4b52839054d3f76579eb1a6f9cae3ef191b57f081c66ec3aace6f84f4ba5a4e
    at: "2026-10-30 22:14 UTC"
    by: lead (session 108deea8)
    because: >-
      read in full (lead wrote it): its 'before any data run' and 'before reading any output' are
      implementation requirements of a design awaiting the user's approval (Q25), so they oblige
      nothing until approved; on approval they are recorded as commitments
---
Draft label: T3.3.7 (docs/threads-draft.md revision 2). The design separates activity before the event from activity after it, with matched control times (D134 §4).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-25 00:32 UTC lead (session 7c2d50fd): D144 (T049 scan review) cites this record's links; reviewed, nothing here changes (the cited promises are covered or discharged as D144 lists)
- 2026-10-29 20:08 UTC lead (session 7f762276): reviewed D181: reached only through D134 (checked for Q01); D181 says nothing about entry or queen triggers, so T035 is unaffected
- 2026-10-30 20:51 UTC lead (session 20261030): reviewed D205: it lists this thread's trigger analysis (B023, D134 §4) as Part 2 item 1(b), a shared-failure measurement for the 10-min D_w shortfall, in existing data. A ranking proposal for the user (Q24); nothing about T035 is decided or started
- 2026-10-30 21:57 UTC lead (session 20261030): reviewed D210: its Next names item 1(b) (triggers, this thread) among the remaining Part 2 items for the user to order; F108 shows the slow synchrony concentrated in the first light block, which a trigger analysis could look at. Nothing started
- 2026-10-30 22:13 UTC lead (session 108deea8): added D211 to links; added D212 to links; set actor=user; set next=2 — D211: the lead takes item 1(b) next; D212 drafts its design for the user's approval (Q25); waits on the user
- 2026-10-30 22:14 UTC lead (session 108deea8): scanned D212 (rev d4b52839054d): no commitment to record — read in full (lead wrote it): its 'before any data run' and 'before reading any output' are implementation requirements of a design awaiting the user's approval (Q25), so they oblige nothing until approved; on approval they are recorded as commitments
- 2026-10-30 22:41 UTC lead (session 108deea8): added D213 to links; set approval.state=approved; set approval.by=D213; set actor=lead; set next=1 — D213 approves D212 with amendments (amendment 1 frozen); the lead gates the build and briefs the implementer (D208)
- 2026-10-30 22:43 UTC lead (session 108deea8): Implementer working (D208): build, synthetic checks and a 2-colony smoke for D212 amendment 1, gated run:triggers-build-smoke; brief logs/handoff/20261030-2243-triggers/brief.md, report to report.md there. Full run is the lead's (run.sh) after the report is checked
- 2026-10-31 00:19 UTC lead (session 108deea8): added D215 to links; added D216 to links — D215: built and smoke-run, checked; D216: user settled three points, frozen as D212 amendment 2; next the implementer adds the descriptive row and calibration output
- 2026-10-31 00:21 UTC lead (session 108deea8): Implementer working (D208, D214 format): amendment 2 build (5-min control row, calibration output, P100 rule), gated run:triggers-amend2; brief logs/handoff/20261031-0030-triggers-amend2/brief.md. Then the lead runs the 100-seed calibration and the full run via run.sh
- 2026-10-31 00:37 UTC lead (session 108deea8): added D217 to links; added D218 to links — D217: amendment 2 built and checked; D218: meta.command defect (implementer code) logged
- 2026-10-31 00:38 UTC lead (session 108deea8): Run triggers-cal-full-20261031T003816Z started (gated run:triggers-cal-full): 100-seed calibration, then the 22-colony pass → logs/partd2/triggers-calibration.json and logs/partd2/triggers/. The aggregator (the read) is a separate step, held for the user's answer on a quorum check
- 2026-10-31 00:40 UTC lead (session 108deea8): added D219 to links — D219: quorum check before the read
