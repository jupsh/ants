---
id: D286
date: 2026-11-05
time: 16:51
kind: run
title: ants-lab stage 1b follow-up built and checked: workspaces carry no history (only the snapshot tree's objects under one parentless commit), Codex strict-schema transform with one real verdict smoke, meter probes (fake engines), tripwire severity and issued-command authority; 244 tests, tsc clean; the D285 defect fixed
---
- **2026-11-05 ≈ 16:51 UTC — ants-lab stage 1b follow-up built and checked: workspaces carry no history (only the snapshot tree's objects under one parentless commit), Codex strict-schema transform with one real verdict smoke, meter probes (fake engines), tripwire severity and issued-command authority; 244 tests, tsc clean; the D285 defect fixed.**
  - **Brief and report:** `logs/handoff/20261105-0620-lab-1b/` (`brief.md` § Follow-up; `report.md` § Follow-up,
    with the lead's check). The previous session hit its usage limit while the implementer was partway through item 1
    (5 tests failing, no report); a new session re-handed the same follow-up, and the implementer finished it from
    that state.
  - **Implementer's report, quoted:** "Done. `npx vitest run` passes: 16 files, 244 tests (221 before this
    follow-up). `npx tsc --noEmit` is clean. Workspaces now carry no history: they hold exactly the snapshot tree's
    objects plus one parentless commit."
  - **Model calls:** one, the brief's Codex smoke (`gpt-6.1-terra`, low, read-only, strict `verdict` schema). It
    returned `ok`, 16,868 input and 104 output tokens, `structuredValid: true`. The fixture's SHA-256 is
    `d1bfe41a…77a3`. No Claude or Muse calls and no live probes.
  - **Lead's check:**
    - Reproduced 244/244 and tsc 0. The three fixture hashes match the report.
    - **Independent no-history check** (scratch script, throwaway repo):
      - **Setup:** a committed, then deleted sealed file and `data/` file; a tag; a stash; `git gc`, so the objects
        are packed; untracked sealed, data and source files.
      - **Objects:** the workspace held 7 objects, the tree's 6 plus the base commit, with one commit and only the
        refs `refs/heads/lab` and `refs/lab/base`.
      - **Paths back:** there is no remote and no alternates, and the checkout path is not in its config.
      - **Content:** all five marker contents (committed sealed, committed data, stash, untracked sealed, untracked
        data) are absent from every object, and `git show v1:…` fails. D285 is fixed.
    - **Wrong in the report:** the "duplicate `$comment` in `quota`" is not there. The probe comment is inside
      `quota.probe`, and a duplicate-key scan of the whole file finds none.
  - **Open points for the next brief** (not changed now):
    - **Curator sandbox:** the curator (Codex Sol) runs in a `read-only snapshot` sandbox. Its write set and prompt
      have it write a docs_map patch under `logs/lab/drafts/`, and DESIGN's role table still says it writes
      "nothing (proposals)". Either it returns the patch in its output and the conductor writes the draft, or it
      gets a workspace.
    - **Amended authority entries:** an amended `authority:` entry now halts unless a matching `log new` was issued
      for that step, a literal reading of "new or changed". Whether clerk amendments that keep title, authority and
      scope get an exemption is to be decided before the clerk runs.
    - **Guard false positives:** the guard refused two of the implementer's commands on text matches, a git
      plumbing name and the records CLI's new-entry verb, as with D284's. They go in the first suggestion.
  - **Next:** stage 1c (containers), with D285's text-gate escapes as required red-team cases.
