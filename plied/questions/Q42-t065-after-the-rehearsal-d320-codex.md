---
id: Q42
title: >-
  T065 after the rehearsal (D320): Codex has no working shell tool in its box (its exec runs through
  code mode, denied by D290 and absent from the image), so every Codex review and panel fails; how
  to proceed?
options:
  - "the lead briefs a diagnosis first: why shell_tool/unified_exec (allowed) are not offered and what enabling code_mode_host (plus its host binary in the image) would expose, model-free where possible and at most a few cheap diagnostic sessions; the user then decides any allowedFeatures change (lead recommends)"
  - "the user allows code_mode_host now (a suggestion changing codex.allowedFeatures) and the lead briefs adding the host binary to the box image"
  - "hold Codex roles: the user changes the policy so reviews and panels use the Claude fallback until Codex works"
raised: D320
state: answered
nodes: [T065]
answered_by: D323
---

## History
- 2026-11-06 16:32 UTC lead (session 487510ed): created — D320: apply, commit and clerk unreachable while Codex has no tool
- 2026-11-07 05:16 UTC lead (session 9871fd6b): set state=answered; set answered_by=D323 — D323: the user accepted the lead's recommended option
