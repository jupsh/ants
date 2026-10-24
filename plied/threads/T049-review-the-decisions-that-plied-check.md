---
id: T049
title: Review the decisions that plied check flags as possibly unrecorded commitments
parent: T044
status: open
next: 1
actor: lead
closes_when: >-
  Every flagged entry has been read: its real commitments recorded as commitments, its false
  positives recorded on this thread with plied scanned (plied 0.2.0).
links: [D142]
scanned:
  - record: D142
    rev: 9be6944c9fb886aa542586cadb32b6db9a0eed74b91ecf14d27500cab365a3e1
    at: "2026-10-24 22:45 UTC"
    by: lead (session 104e7640)
    because: >-
      'deferred' describes D140's adoption decision being left to the user, which D142 itself takes;
      no commitment.
---
Draft label: T6.5 (docs/threads-draft.md revision 2). plied check (scan_commitments, since 2026-10-17) flags 44 entries, D004 to D142, with a conditional or deferral that no commitment links. The draft review (D138) harvested commitments by search, not entry by entry.

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-24 22:45 UTC lead (session 104e7640): scanned D142 (rev 9be6944c9fb8): no commitment to record — 'deferred' describes D140's adoption decision being left to the user, which D142 itself takes; no commitment.
- 2026-10-24 22:45 UTC lead (session 104e7640): set closes_when=Every flagged entry has been read: its real commitments recorded as commitmen… — plied 0.2.0 records scan reviews (plied#3)
