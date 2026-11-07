---
id: D290
date: 2026-11-05
time: 17:51
kind: run
title: ants-lab stage 1c follow-up built and checked: per-role network allowlists keyed by fixed container IPs, per-session proxy log, Claude's non-essential traffic off, host-side workspace git isolated from the user's config; 304 + 9 container tests; Claude and Muse smokes clean, Codex answered but failed on its code-mode host. Lead: provider hosts narrowed to the measured ones, Codex features deny-by-default
---
- **2026-11-05 ≈ 17:51 UTC — ants-lab stage 1c follow-up built and checked: per-role network allowlists keyed by fixed container IPs, per-session proxy log, Claude's non-essential traffic off, host-side workspace git isolated from the user's config; 304 + 9 container tests; Claude and Muse smokes clean, Codex answered but failed on its code-mode host. Lead: provider hosts narrowed to the measured ones, Codex features deny-by-default.**
  - **Brief and report:** `logs/handoff/20261105-1710-lab-1c/` (`brief.md` § Follow-up; the follow-up section of
    `report.md`). The user logged in to both lab homes before the smokes; the login files were checked for existence
    only.
  - **Implementer's report, quoted:** "All four items are done. `npx vitest run` passes (304 tests, was 295), `npx
    tsc --noEmit` is clean (exit 0) and `npm run test:docker` passes (9/9, 94 probe rows, every one as expected)."
  - **Model calls:** one each through its container and the new proxy.
    - **Claude** (haiku, low): ok.
    - **Muse** (low, no tools): ok, `muse-wonder-1.0`.
    - **Codex** (`gpt-6.1-terra`, low): answered `{"answer":"OK"}` but returned `ok: false`, because "Code Mode is
      unavailable because failed to spawn code-mode host". A first Codex launch stopped before the container
      started: the smoke's workspace had no `.git`. It made no call.
  - **Probe rows** (all as expected):
    - a researcher reaches `api.anthropic.com` and gets 403 for `docs.rs`, `en.wikipedia.org`, `registry.npmjs.org`
      and `chatgpt.com`;
    - a scout reaches `docs.rs` and `en.wikipedia.org`, and gets 403 for npm and github;
    - an unmapped IP gets 403 for everything, logged `session: null`;
    - a second container with a taken IP is refused by Docker;
    - changing its own IP gets EPERM.
  - **Lead's check:**
    - Reproduced 304/304, tsc 0 and `test:docker` 9/9.
    - Every smoke proxy line carries its session.
    - The client map was empty after the runs, and only `ants-lab-proxy` was left running.
    - **Hosts measured:**
      - Claude: `api.anthropic.com` only. The telemetry host is gone with
        `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`.
      - Codex: `chatgpt.com` and `ab.chatgpt.com`, allowed. Three `*.oaiusercontent.com` hosts were denied, and the
        reply came back anyway.
      - Muse: `api.meta.ai`.
  - **Lead's decisions** (lab policy files):
    - **Provider hosts narrowed to the measured ones** (`policy/net-roles.json`):
      - codex: `chatgpt.com` and `auth.openai.com`. `auth.openai.com` is kept for token refresh, which is not yet
        observed; `api.openai.com` is dropped;
      - muse: `api.meta.ai` instead of `meta.ai`;
      - claude: `api.anthropic.com`, unchanged.
    - **Codex features, deny by default** (`lab.config.json` `codex.allowedFeatures`):
      - On every lab call, every enabled feature not on the list is disabled. The list holds the shell, exec,
        image-view and transport features only.
      - The host's Codex enables apps, plugins, browser use, computer use, image generation, multi-agent, hooks and
        a code-mode host by default, and a new version can add more.
      - This also removes the code-mode error, without mounting a second file from `~/.codex`.
  - **Next:** a short follow-up to wire `codex.allowedFeatures` and repeat the Codex smoke (one call). Then the
    lab-repo commit of 1c (D287's instruction covered 1b; 1c is committed only when the user agrees).
