---
id: D154
date: 2026-10-25
time: 03:55
kind: decision
title: User: Q14 answered, the audit seal lifted and the frozen S2 audit started with J primary; the one extension to 400 draws only when the frozen reader requests it; V3b, phase, duration and P02/Q03 disclosures kept; Stages 1–3 held; wording correction on L_same − L_ref
authority: user
scope: Q14 T032
---
- **2026-10-25 ≈ 03:55 UTC — User: Q14 answered, the audit seal lifted and the frozen S2 audit started with J primary; the one extension to 400 draws only when the frozen reader requests it; V3b, phase, duration and P02/Q03 disclosures kept; Stages 1–3 held; wording correction on L_same − L_ref.**
  - **User:** "Q14: approve lifting the audit seal and starting the frozen S2 audit with J as primary. All required
    synthetic criteria pass, and I verified that all six current script hashes match D153."
    - "Record this decision, remove the audit seal, record the commitment dispositions, and rerun the gate before
      launch. My gate check currently stops only because dispositions are missing for P22, P32–P35, P38 and P39."
    - "The approval includes the single extension to 400 draws only when the frozen reader requests it, followed by the
      frozen reading. Preserve the V3b limitation, phase and duration disclosures, and unwaived P02/Q03 limitation.
      Stages 1–3 remain held."
    - "One wording correction does not block execution: positive L_same − L_ref alone does not establish that reference
      classing leaves nonzero decay. Report the two values separately if making that claim; otherwise report only the
      observed reduction."
  - **Correction applied (lead):** D152 and F094 claimed that reference classing does not remove a stable-site
    artefact. Reported separately (means over 24 synthetic colonies; `logs/s2syn/V1a.json`, `V1b.json`):
    - V1a: L_same 0.209, L_ref −0.002;
    - V1b: L_same 0.370, L_ref −0.015.
    - Reference classing greatly reduced the artefact in both cases, so the claim was wrong; it is corrected in place
      in D152 and F094. No interval was computed for L_ref alone, so equivalence to zero is not shown (user, after
      D155: "greatly reduced", not "removed"); this is description, not a rule.
  - **Effect:** Q14 is answered by this entry. The audit output folder's line is removed from
    `.claude/sealed-paths.txt`. The gate is reviewed and dispositions recorded, then the frozen run starts
    (`s2AuditRun.sh`, D153 hashes). The extension runs only if the frozen reader prints "extend".
