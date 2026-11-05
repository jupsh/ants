---
id: D284
date: 2026-11-05
time: 06:19
kind: run
title: ants-lab stage 1a built and checked: the decision core (config with the model ladder and forbidden models, policy and P198 aggregation, step contracts and obligations, plied-exact quote matching, data-role classification, artifact hashing, journal, suggestions register, template-only notifications, per-provider pacing); 134 tests, tsc clean; the D283 quote defect fixed
---
- **2026-11-05 ≈ 06:19 UTC — ants-lab stage 1a built and checked: the decision core (config with the model ladder and forbidden models, policy and P198 aggregation, step contracts and obligations, plied-exact quote matching, data-role classification, artifact hashing, journal, suggestions register, template-only notifications, per-provider pacing); 134 tests, tsc clean; the D283 quote defect fixed.**
  - **Brief and reports:** `logs/handoff/20261105-0535-lab-1a/` (`brief.md`; `report.md` with the follow-up). The
    code is in `~/repos/ants-lab/src/` (2.6k lines) and `test/`. It is uncommitted: the ants repo's guard hook
    refused the implementer's `git commit` there.
  - **Implementer's report, quoted:** "All eight modules are built … `npx vitest run` passes 119/119 and `npx tsc
    --noEmit` is clean". After the follow-up: "The full suite passes (9 files, 134 tests) and tsc is clean."
  - **Lead's check:**
    - Reproduced 134/134 and tsc 0.
    - Adversarial cases:
      - path tricks against data roles (`..`, `./`, absolute paths): held-out, unused and off-allowlist inputs were
        caught;
      - the forbidden model under six spellings: all caught;
      - unknown or case-changed kinds: routed to the user;
      - the four plied quote cases of D283: all match after the port.
  - **Accepted from the report:**
    - a Claude fallback only on halt or pause, never on lean (D282's intent);
    - default checks kept in code;
    - `aggregate` treats a pass carrying a blocking problem, or `in_scope: false`, as a fail;
    - the short-window meter is optional;
    - frontmatter is quotable, mirroring plied, which matches the whole file.
  - **Noted:** a quote across a 4-space-indented blockquote must keep its `>` or use ` … `, as in plied. Also, the
    guard hook's text matching refused harmless commands ("plied tool", "plied does"), to be raised as the lab's
    first suggestion.
  - **Next:** stage 1b (workspaces and patches, hooks, tripwires, engine adapters, quota meters, wiring smokes).
