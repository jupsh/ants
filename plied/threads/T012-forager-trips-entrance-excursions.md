---
id: T012
title: Forager trips; entrance excursions
parent: T006
status: open
next: 2
actor: user
uses: [T033]
approval:
  state: approved
  by: D224
backlog: B005
links: [F038, F077, D222, D223, D224, D225, D226, F110]
scanned:
  - record: D223
    rev: b738f2de5839da5bc48e84484c9d570d28b2c5956af628c3e85cd8f0fe3dd7b2
    at: "2026-10-31 02:18 UTC"
    by: lead (session 6b5fb317)
    because: >-
      read in full (lead wrote it): its 'before any data run' (synthetic checks) and 'before
      anything is read' (self-checks) are implementation requirements of a design awaiting the
      user's approval (Q26), so they oblige nothing until approved; on approval they are recorded as
      commitments
---
Draft label: T3.1f (docs/threads-draft.md revision 2).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-29 20:06 UTC lead (session 7f762276): set waiting_on=["T033"] — D181 (Q08): B005 approved, to start after the active synchrony work (Part D, T033); model arm at C2's fitted settings
- 2026-10-29 22:37 UTC lead (session 20261029): reviewed D186: cites T033 only; unaffected
- 2026-10-30 05:37 UTC lead (session 9d2b15e6): reviewed F103 and F104: they report Part D's Stage 2b reading (T033); T012 waits on T033 finishing the synchrony work (D181 Q08), and T033 is still open (Stage 3b next), so T012 keeps waiting.
- 2026-10-30 17:50 UTC lead (session 9d2b15e6): reviewed D197: it is the user's go-ahead for T033's same-member check; T033 remains open (cross next), so T012 keeps waiting on it.
- 2026-10-30 17:58 UTC lead (session 9d2b15e6): reviewed D199: it is the user's go-ahead for T033's cross step; T033 stays open (measurement list next), so T012 keeps waiting.
- 2026-10-30 18:10 UTC lead (session 9d2b15e6): reviewed D201: it adds T033's closing steps (descriptive comparison, measurement list); T033 remains open, so T012 keeps waiting.
- 2026-10-30 20:49 UTC lead (session 20261030): reviewed D204: it reaches T012 only by citing T033, and corrects S1 window labels (the forager shortfall in F104 is at 10 min, not 20 min); T033 is still open with the measurement list next, so T012 keeps waiting on it
- 2026-10-30 20:51 UTC lead (session 20261030): reviewed D205: it lists the foragers' 10-min D_w shortfall beside C2's forager stays and trips (F077, F038; B005) as Part 2 item 1(c), a pointer to this thread. T012 still waits on T033, which now waits on Q24
- 2026-10-30 21:06 UTC lead (session 20261030): reviewed D206: it reaches T012 through T033 only; it approves the existing-data 1(a) analysis as T033's next step and leaves item 1(c) (forager stays and trips) in the list; T012 keeps waiting on T033
- 2026-10-30 21:22 UTC lead (session 20261030): reviewed D207: it designs T033's Part 2 item 1(a) (the data's D_w by light block beside the arms), forager cells included as reported beside; it does not start T012's trip work, so T012 keeps waiting on T033
- 2026-10-30 21:57 UTC lead (session 20261030): reviewed D210: its Next names item 1(c) (foragers, this thread) as one of the remaining Part 2 items for the user to order; F108's forager rows (first block 3.84 against 2.11, 2.13) are context for it. Still waiting on T033
- 2026-10-31 01:11 UTC lead (session 108deea8): reviewed D221@2c4c00f83034; D221 names this thread's item, 1(c) the foragers' 10-min shortfall, as next for the user to order; nothing about T012 is decided. D221's forager-entry result (F109) is context for it
- 2026-10-31 02:17 UTC lead (session 6b5fb317): set status=open; cleared waiting_on; set uses=["T033"]; set actor=user; set next=2; added D222 to links; added D223 to links — D222: the user takes item 1(c) (this thread) next; T033's synchrony work it waited on (D181) now includes it, so it no longer waits but uses T033's Stage 2b outputs; D223 drafts its design for the user's approval (Q26)
- 2026-10-31 02:18 UTC lead (session 6b5fb317): scanned D223 (rev b738f2de5839): no commitment to record — read in full (lead wrote it): its 'before any data run' (synthetic checks) and 'before anything is read' (self-checks) are implementation requirements of a design awaiting the user's approval (Q26), so they oblige nothing until approved; on approval they are recorded as commitments
- 2026-10-31 02:31 UTC lead (session 6b5fb317): set approval.state=approved; set approval.by=D224; set actor=lead; set next=1; added D224 to links — D224 approves D223 with amendments (amendment 1 frozen); the lead gates the build and briefs the implementer (D208)
- 2026-10-31 02:35 UTC lead (session 6b5fb317): Implementer working (D208): build, synthetic checks and a 2-colony smoke for D223 amendment 1, gated run:foragers1c-build-smoke; brief logs/handoff/20261031-0240-foragers1c/brief.md, report to report.md there. The 22-colony data pass and the read are the lead's (run.sh) after the report is checked
- 2026-10-31 02:56 UTC lead (session 6b5fb317): added D225 to links — D225: item 1(c) built and smoke-run; the 22-colony data pass and the read are next
- 2026-10-31 03:09 UTC lead (session 6b5fb317): added D226 to links; added F110 to links; set actor=user; set next=2 — D226 reads item 1(c) (F110): the shortfall is in coupling r, not co-presence m; post-entry activity is a candidate, untested. What follows (a model design, P103; B005, still separate) is the user's to order
- 2026-10-31 03:24 UTC lead (session 6b5fb317): Second implementer working (D227, D208): an independent implementation of item 1(c)'s per-colony statistics from D223 amendment 1 and D225 only, blind to the first implementation, on colonies 20 and 12 with arms T20f and base; gated run:foragers1c-second; brief logs/handoff/20261031-0330-foragers1c-second/brief.md, report to report.md there. The lead reruns the first implementation per colony into logs/partd2/foragers-check-c{20,12}/ and compares
- 2026-10-31 03:34 UTC lead (session 6b5fb317): reviewed D228@e6f75b99836a; reviewed D228: the independent implementation agrees on 643 of 646 per-colony values; D226 (amended) and F110 stand. Next per D227: the Part D commit, then item 1(e)'s design (after the user's synchrony review question)
- 2026-10-31 04:22 UTC lead (session 548cad34): reviewed D230@d48f344b163e, D231@68d492443f36; D230 and D231 cite F110, this thread's item 1(c) reading, as synthesis input: D231 makes it constraint C5 and hypothesis H4 (post-entry forager activity). No new work on forager trips; B005 stays a separate audit (D227)
