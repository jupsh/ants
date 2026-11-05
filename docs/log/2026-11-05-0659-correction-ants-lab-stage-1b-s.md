---
id: D285
date: 2026-11-05
time: 06:59
kind: correction
title: Correction: ants-lab stage 1b's workspaces (src/workspace.ts makeWorkspace) carry the checkout's whole git history, so an agent inside one could read tracked data/ and any once-committed sealed file through git (e.g. git show refs/lab/base^:<path>), against D278's information-flow rule; found by the lead's check of the report, to be fixed by the same implementer
---
- **2026-11-05 ≈ 06:59 UTC — Correction: ants-lab stage 1b's workspaces (src/workspace.ts makeWorkspace) carry the checkout's whole git history, so an agent inside one could read tracked data/ and any once-committed sealed file through git (e.g. git show refs/lab/base^:<path>), against D278's information-flow rule; found by the lead's check of the report, to be fixed by the same implementer.**
  - **Found:** while checking the implementer's stage-1b report (`logs/handoff/20261105-0620-lab-1b/report.md`),
    the lead ran a scratch script on a throwaway repo with one sealed file and one `data/` file, both committed.
    - The workspace tree held neither file, as specified.
    - But `makeWorkspace` clones the checkout (`clone --shared`, then `repack -a -d`) and parents the base commit
      on the checkout's HEAD, so the history comes along. `git show refs/lab/base^:<sealed file>` and
      `…:data/d.csv` both printed their content inside the workspace, and a full object scan found the sealed blob.
    - In the ants repo, 64 files under `data/` are tracked (counted, not listed).
    - The report's "D278 … isolated workspaces … met" was therefore wrong on information flow. The guard's Bash
      rules do not refuse `git show` or `git log`, and in 1c the workspace is the container's mount.
  - **Not affected:**
    - The checkout's state: HEAD, index entries and refs were unchanged after snapshot, workspace, patch and apply.
      Only the working tree changed, and only on the good apply.
    - Patch refusals, all with nothing applied:
      - a file changed since the snapshot;
      - a declared file list that differs from the patch;
      - a sealed path declared;
      - a sealed path hidden in a patch with an innocent file list.
    - `discardWorkspace` refused the checkout.
    - Nothing ran in a workspace yet: no lab step has run.
  - **Lead's other checks of 1b:**
    - Reproduced 221/221 and tsc 0. The diff against the 1a baseline touches only the reported files.
    - The guard refused:
      - `git push` under quoting, `-C`, absolute path, `GIT_DIR=`, `command`, `eval`, `bash -c` and `-c alias`;
      - `plied set` under spacing, an env prefix, `npx`, an absolute path and `--json`;
      - records.mjs writes in four spellings;
      - `--authority user`, `--authority=user` and `'User'`;
      - an issued command with a suffix;
      - the held literature and the embargo by name;
      - non-allowlisted, look-alike and credentialed URLs;
      - biology queries.
    - Passed, as text gates cannot catch them: `g''it push`, `x=git; $x push`, `p=plied; $p set`, shell redirection
      into `src/`, python networking, `ls ~/ants-*`, and reading the token file or the journal from outside the
      workspace. D279's design leaves these to the walls (no credentials, remote or network in the container;
      mounts; the write-set tripwire on patches). They become required red-team cases for stage 1c.
    - The scout denylist (lead's file) missed "trophallactic", "myrmecology" and "niger". The stems `trophallac*`
      and `myrmec*` and the word `niger` were added, and all three are now refused.
  - **Fix:** a workspace holds only the snapshot tree's objects under a parentless base commit, with no clone and no
    history. The same implementer does it, with a test that no object outside that tree is present (brief
    follow-up, with the report's open points).
