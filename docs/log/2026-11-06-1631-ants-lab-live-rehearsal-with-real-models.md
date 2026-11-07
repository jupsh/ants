---
id: D320
date: 2026-11-06
time: 16:31
kind: run
title: ants-lab live rehearsal with real models (D318) checked: 36 sessions, about $0.13, 7 lab defects fixed with tests; apply, commit and clerk not reached because Codex has no working tool in its box; plied in the box cannot read without the sealed list; both to the user
---
- **2026-11-06 ≈ 16:31 UTC — ants-lab live rehearsal with real models (D318) checked: 36 sessions, about $0.13, 7 lab defects fixed with tests; apply, commit and clerk not reached because Codex has no working tool in its box; plied in the box cannot read without the sealed list; both to the user.**
  The rehearsal D318 asked for ran on two throwaway sandboxes (clones of HEAD with no remote, separate state, cheapest
  models, dry-run notifier); brief and report with the lead's check in `logs/handoff/20261106-0445-lab-rehearsal/`.
  The first implementer stopped on the account's usage limit after the two pre-items (`messages` in the box's plied
  wrapper; L0004's draft backfilled into the real state's `packets/L0004/outputs/`, journaled, sha256 4079cf20…, shown
  under `prior/` in the T064 dry run); a fresh one continued from a handover appended to the brief.
  - **Spend:** 36 model sessions, ≈ $0.13 estimated (Claude only), 15:40–16:26 UTC. Claude weekly 0.53 → 0.55
    (account-wide), short 0.10 → 0.22; Codex weekly 0.02 → 0.06; Muse 0.01. All caps held (≤ $5, 40 sessions, 2 h,
    Claude ≤ 0.58).
  - **Lab defects fixed, each with a model-free test that fails without the fix:**
    - the repo hooks (git-excluded) missing from a clone (`repoHooksDir`);
    - an escalated brief under ignored `logs/` lost with its workspace, as D317's draft (`outputsToCarry`);
    - inputs bind-mounted read-only over the implementer's own workspace copy, so it could not edit them
      (`inputMountable`);
    - a schema-less Codex session (clerk, toolsmith) failing at docker start on a missing `schema.json`;
    - Muse (no tools) reviewing a contract it never saw, inventing z-scores and a run (`inlinePacket`; afterwards
      grounded);
    - the researcher pointing at a `prior/` copy absent from its workspace (one prompt sentence);
    - the launcher root and dry-run notifier (first implementer).
  - **Reached and working:** researcher → contract → authority review; the implementer producing a patch; the panel
    (Claude, Muse, Codex) on a procedural step; Muse accepts the 2020-12 schemas (`valid: true`, D313 answered); a
    user-tier draft carried into the ask and the next step's `prior/`, answered, and picked up by the loop; cited
    `context/`; meter reads and probes; a forced start failure kept and climbing the ladder.
  - **Not reached:** apply to the checkout, the commit, the clerk. Every patch review and panel fails on the Codex
    implementation reviewer: in its box Codex's only shell tool runs through code mode, whose host is denied by D290
    (`allowedFeatures`) and absent from the image. That is the user's (allowedFeatures, image).
  - **plied in the box** cannot read: the workspaces lack the git-excluded `.claude/sealed-paths.txt` that `plied.toml`
    names, so `plied show`/`review` fail. Options: (a) the wrapper gives plied a tmpfs config with an empty sealed list;
    (b) an empty list placed in each workspace; (c) the real list mounted read-only. A design choice for the user.
  - **For a later brief (lead):** the contract's default checks (`npm test`, `tsc`) are never run by the conductor; a
    brief step with an empty patch ends `done` though the report says "Not done"; Muse's inlined packet has no size cap;
    minor record wording (a failed session's subtype `success`, a box-start failure worded as the transcript tripwire,
    an answer title cut at a colon). Policy (the user's): a researcher's own ignored draft listed as an input is
    `unclassified` and escalates.
  - ants-lab tree 8d28d6a2 → 837a7da3 (uncommitted, D294); 584 tests and tsc pass (re-run by the lead). Kept copies:
    `~/.local/state/ants-lab/rehearsal/20261106T154033Z/` and `…/20261106T160023Z/`. The real lab stays paused, ask
    L0004 pending.
