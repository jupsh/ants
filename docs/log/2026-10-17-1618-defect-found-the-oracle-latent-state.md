---
id: D024
date: 2026-10-17
time: 16:18
kind: correction
title: Defect found: the oracle / latent-state switches only ever modulated nurses
---
**2026-10-17 ≈ 16:18 UTC — Defect found: the oracle / latent-state
switches only ever modulated nurses** (found while building the
aggregation arms; logged before Y's output is opened). `ColonySim.step`
scales `P.nest.restToActive` around the policy call, but
`nestParamsOf` (`lasiusNestWorker.ts:134`) overlays `P.nest.forager`,
and at the start point foragers have their own `restToActive` (0.6).
Verified (`chkForager.ts` in the scratchpad): ×4 on `P.nest.restToActive`
moves nurses 0.345 → 1.38, foragers stay 0.6. `test/oracle.test.ts`
uses `forager: {}` and could not catch it. Consequences (corrections,
dated, in place below this entry; nothing re-run yet):
- **Oracle coupling (06:20, "closed line"):** only nurses were coupled
  (the signal u counted all in-nest ants). The all-ants verdict "(a) not
  met" is partly by construction. Nurses alone (logged then): κ = 1 2.28
  / 3.56 vs data 3.67 / 5.12, control 1.16 / 1.42 — half-gap bars for
  nurses would be 2.42 / 3.27: just under at 1 min, past at 10 min. The
  closed line is **not** reopened here; that is the user's call.
- **Comparison L (14:35):** "Nurse-only: forager T2 and rows unchanged in
  every arm" was by construction, not a finding; the latent state was
  never given to foragers.
- **Y references (k1, p, 15:48):** a nurse-only box-wide driver;
  Y's method check reads it as such.
- **New switches (E, S) scale the role-specific values** (nurse and
  `P.nest.forager`), with a test using a forager overlay.
