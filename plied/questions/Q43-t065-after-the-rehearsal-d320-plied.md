---
id: Q43
title: >-
  T065 after the rehearsal (D320): plied in the box cannot read because the workspace lacks the
  git-excluded .claude/sealed-paths.txt that plied.toml names; which fix?
options:
  - "the read-only wrapper hands plied its own config on the box tmpfs, a copy of the workspace plied.toml whose sealed_file is an empty list; the workspace is untouched and sealed material is absent from workspaces anyway (lead recommends)"
  - an empty .claude/sealed-paths.txt placed in each workspace, git-excluded there
  - "the real list mounted read-only into the box (agent-readable; a transcript naming sealed paths trips the tripwire)"
raised: D320
state: answered
nodes: [T065]
answered_by: D323
---

## History
- 2026-11-06 16:32 UTC lead (session 487510ed): created — D320: plied show/review fail in the box
- 2026-11-07 05:16 UTC lead (session 9871fd6b): set state=answered; set answered_by=D323 — D323: the user accepted the lead's recommended option
