---
id: D323
date: 2026-11-07
time: 05:16
kind: decision
title: User: Q42 and Q43 answered as the lead recommended: diagnose Codex's missing shell tool before any allowedFeatures change; plied in the box gets a tmpfs config with an empty sealed list
authority: user
scope: T065 Q42 Q43
---
- **2026-11-07 ≈ 05:16 UTC — User: Q42 and Q43 answered as the lead recommended: diagnose Codex's missing shell tool before any allowedFeatures change; plied in the box gets a tmpfs config with an empty sealed list.**
  - **The user's words** (after the lead's recommendation on L0004, Q42 and Q43): "Yeah, that all sounds good to me."
  - **Q42 (D320: Codex has no working shell tool in its box).** The first option: the lead briefs a diagnosis of why
    `shell_tool`/`unified_exec` (allowed) are not offered and what enabling `code_mode_host` (plus its host binary in the
    image) would expose. Model-free where possible, at most a few cheap diagnostic sessions. Any `allowedFeatures`
    change stays the user's decision after the diagnosis (D290).
  - **Q43 (D320: plied in the box cannot read without `.claude/sealed-paths.txt`).** The first option: the read-only
    wrapper `bin/plied-in-box` hands plied its own config on the box tmpfs, a copy of the workspace `plied.toml` whose
    sealed file is an empty list. The workspace stays untouched; sealed material is absent from workspaces anyway.
  - Both are built by the implementer from briefs (D208) and checked by the lead.
