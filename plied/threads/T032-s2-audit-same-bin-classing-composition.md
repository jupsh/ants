---
id: T032
title: "S2 audit: same-bin classing, composition nulls"
parent: T023
status: closed
approval:
  state: approved
  by: D145
outcome:
  quote: S2's decay exceeds the specified joint-shift null and C2 base.
  ref: D156
carries: [F094, F095]
links: [D136, D134, P22, D145, D146, D147, D148, D149, D150, D152, D153, F094, D154, D156]
---
Draft label: T3.3.5 (docs/threads-draft.md revision 2). Proposal D136; nothing built or run.

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-25 00:32 UTC lead (session 7c2d50fd): D144 (T049 scan review) cites this record's links; reviewed, nothing here changes (the cited promises are covered or discharged as D144 lists)
- 2026-10-25 03:03 UTC lead (session 0bcdd30b): set status=open; cleared waiting_on; set approval.state=approved; set approval.by=D145; added D145 to links — design approved with amendments (D145); amendment values to be made concrete and confirmed before any run
- 2026-10-25 03:05 UTC lead (session 0bcdd30b): set status=waiting; set waiting_on=["Q12"]; added D146 to links — amendment D146 proposed; waits on the user's confirmation (Q12)
- 2026-10-25 03:10 UTC lead (session 0bcdd30b): set status=open; cleared waiting_on; added D147 to links — D146 confirmed as amended (D147); implementation and synthetic checks
- 2026-10-25 03:22 UTC lead (session 0bcdd30b): set status=waiting; set waiting_on=["Q13"]; added D148 to links; added D149 to links — frozen kappa calibration failed (D149); waits on the user (Q13)
- 2026-10-25 03:28 UTC lead (session 0bcdd30b): set status=open; cleared waiting_on; added D150 to links — Q13 answered (D150); generator revision, gamma calibration, synthetic cases
- 2026-10-25 03:30 UTC lead (session 0bcdd30b): reviewed D151: generator revision frozen, gamma* = 0.1; synthetic cases running.
- 2026-10-25 03:42 UTC lead (session 0bcdd30b): set status=waiting; set waiting_on=["Q14"]; added D152 to links; added D153 to links; added F094 to links — synthetic checks passed (D152), final code frozen (D153); the run waits on the user lifting the seal (Q14)
- 2026-10-25 03:56 UTC lead (session 0bcdd30b): set status=open; cleared waiting_on; added D154 to links — Q14 answered (D154): seal lifted; gate review, then the frozen run
- 2026-10-25 03:58 UTC lead (session 0bcdd30b): reviewed D155: run s2audit-20261025T035716Z started under the passed gate; reading next.
- 2026-10-25 04:03 UTC lead (session 0bcdd30b): set status=closed; set outcome.quote=S2's decay exceeds the specified joint-shift null and C2 base.; set outcome.ref=D156; set carries=["F094","F095"]; added D156 to links — frozen S2 audit read: pass at 100 draws (D156)
- 2026-10-25 04:10 UTC lead (session 0bcdd30b): reviewed D157: it corrects D156's J - A sentence and F095 to the frozen contrast between nulls, without an artefact fraction; the outcome quote (the gate verdict) is unchanged.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): reviewed D158: it reuses this audit's frozen code and D156's values as targets for S2 and S2-J; outcome untouched.
