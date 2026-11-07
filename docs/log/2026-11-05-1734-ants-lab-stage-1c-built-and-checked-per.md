---
id: D289
date: 2026-11-05
time: 17:34
kind: run
title: ants-lab stage 1c built and checked: per-session agent containers (non-root, no capabilities, read-only root, mounts decide what exists, the user's engine homes never mounted), an allowlisting CONNECT proxy as the only way out, runners without a network, post-hoc transcript audit, the curator read-only; 295 + 6 container tests; both Claude smokes through the containers, the host hook denying a write from inside; Codex and Muse wait on the user's lab logins
---
- **2026-11-05 ≈ 17:34 UTC — ants-lab stage 1c built and checked: per-session agent containers (non-root, no capabilities, read-only root, mounts decide what exists, the user's engine homes never mounted), an allowlisting CONNECT proxy as the only way out, runners without a network, post-hoc transcript audit, the curator read-only; 295 + 6 container tests; both Claude smokes through the containers, the host hook denying a write from inside; Codex and Muse wait on the user's lab logins.**
  - **Brief and report:** `logs/handoff/20261105-1710-lab-1c/` (`brief.md`; `report.md`, with the lead's check).
    The code is in `~/repos/ants-lab` (`src/box/`, `container/`, `bin/`, `test/docker/`), not yet committed.
  - **Implementer's report, quoted:** "Mostly done. Everything in the brief is built and tested. Both test tiers
    pass and both Claude smokes ran through the containers and the proxy. The Codex and Muse smokes did **not** run
    because neither lab home exists yet (so no login)."
  - **Model calls:** two, both `claude-haiku-5-5` at low effort:
    - `{"answer":"OK"}`;
    - the cross-boundary hook check. The researcher's `Write` of `src/x.ts` was denied by the host hook ("src/x.ts
      is code: implementation goes to the implementer subagent …"), and the file was absent.

    No Codex or Muse calls.
  - **Built:**
    - **Image:** `sha256:fc1052d6a84f…`, on `node:22.22.1-trixie-slim` pinned by digest; trixie for plied's glibc.
    - **Agent containers:** run as the host uid; `--cap-drop ALL`; `no-new-privileges`; read-only root; CPU, memory
      and pids capped; no Docker socket.
    - **Engines:** binaries mounted read-only from the host. Codex's own sandbox cannot run under these
      restrictions (no bubblewrap, `unshare` EPERM), so it runs `danger-full-access` and the container is the
      sandbox.
    - **Workspace `.git`:** mounted read-only, so an agent cannot plant git config that the host's git would run
      (the implementer's addition).
  - **Lead's check:**
    - Reproduced 295/295, tsc 0, and `npm run test:docker` 6/6 (82 probe rows).
    - **The lead's own probes in a researcher container** (scratch script, no model calls):
      - through the proxy, refused 403: an allowlisted host on port 22, `localhost`, the proxy's own address, a
        plain-HTTP GET to 169.254.169.254, and a `docs.rs@example.com` userinfo trick;
      - the control, `api.anthropic.com:443`, got 200;
      - no other open proxy port;
      - the `.git` mount can be neither removed nor written;
      - no other credential-like variable in the environment.
    - **Host side:** a symlink to the token file in a workspace entered the patch as a link, without the content.
    - The stray `ants-lab-probe:tmp` image was removed (that tag only).
  - **Open, from the report:**
    - **One allowlist for every role, used by any HTTP method.** `en.wikipedia.org` accepts anonymous edits, so it
      is an exfiltration channel. Build hosts (npm, crates, github) are open to roles that need none of them.
    - **No per-session attribution in the proxy log.**
    - **Claude telemetry:** it tries Datadog on every session; denied, harmless.
    - **Host-side git in workspaces** still reads the user's global `~/.gitconfig`. It holds no filter today, so
      this is hardening, not a live hole.
    - **`docker inspect` shows a running Claude container's token.** Accepted: Docker access on the host is
      root-equivalent anyway.
  - **Next:**
    - A follow-up on the same brief:
      - per-role network allowlists, with the session identified by its container's fixed IP;
      - per-session proxy attribution;
      - `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`;
      - isolated git config for host-side workspace git.
    - The user's two lab logins (the commands are in the report), then the Codex and Muse smokes.
