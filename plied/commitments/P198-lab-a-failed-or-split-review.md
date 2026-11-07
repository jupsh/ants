---
id: P198
title: "Lab: a failed or split review panel goes to the user"
wording: A failed or split panel, or a second failed revision, goes to the user.
made: D277
state: open
nodes: [T065]
reviews:
  - action: run:lab-1a
    disposition: not-applicable
    because: >-
      run:lab-1a builds and unit-tests the lab's guard, policy, quota and adapter code with fake
      engines in ~/repos/ants-lab; no review panel runs and nothing is approved, so P198's stop rule
      has no panel outcome to route
    by: lead (session 48c74063)
    at: "2026-11-05 05:35 UTC"
    inputs:
      - record: D277
        rev: 4b7df37ecf52dd226b9df30ad81579101ed78f1e88042b334a34b2369b0b025b
  - action: run:lab-1a
    disposition: not-applicable
    because: >-
      re-read D277 (amended: plied tool, scope T065, justification in packets) and D278: run:lab-1a
      builds and unit-tests guard, policy, quota and adapter code with fakes plus three single-word
      wiring smokes per engine; no panel runs and nothing is approved, so no panel outcome exists to
      route to the user
    by: lead (session 48c74063)
    at: "2026-11-05 05:38 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: commit:lab-records-20261105
    disposition: not-applicable
    because: >-
      the commit records D277-D280; no review panel has run, so no panel outcome needs routing; the
      rule itself is committed unchanged
    by: lead (session 48c74063)
    at: "2026-11-05 06:00 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-1b
    disposition: not-applicable
    because: >-
      run:lab-1b builds and tests workspaces, hooks, tripwires, adapters and meters, with at most
      two single-word wiring calls per engine; no review panel runs and nothing is approved
    by: lead (session 48c74063)
    at: "2026-11-05 06:21 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-1b-fix
    disposition: not-applicable
    because: >-
      run:lab-1b-fix rebuilds lab workspaces without history and adds schema, probe and tripwire
      code with fake engines and one single-word Codex call; no review panel runs and nothing is
      approved
    by: lead (session 48c74063)
    at: "2026-11-05 07:02 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: commit:lab-1b-records-20261105
    disposition: not-applicable
    because: >-
      the commit records D281-D287, T065 notes and earlier dispositions, and ants-lab's tested code;
      no review panel has run, so no panel outcome needs routing
    by: lead (session 772be7be)
    at: "2026-11-05 16:54 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-1c
    disposition: not-applicable
    because: >-
      run:lab-1c builds and tests the lab's containers, proxy, runner and transcript audit, with
      container probes that make no model calls and at most two Claude, one Codex and one Muse
      wiring call; no review panel runs and nothing is approved
    by: lead (session 772be7be)
    at: "2026-11-05 16:58 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-1c-fix
    disposition: not-applicable
    because: >-
      run:lab-1c-fix changes the proxy to per-role allowlists with session attribution, and isolates
      host-side git config; container probes without model calls and one Claude wiring call; no
      review panel runs and nothing is approved
    by: lead (session 772be7be)
    at: "2026-11-05 17:35 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-1c-fix2
    disposition: not-applicable
    because: >-
      run:lab-1c-fix2 wires Codex's deny-by-default feature list and repeats one Codex wiring call;
      no review panel runs and nothing is approved
    by: lead (session 772be7be)
    at: "2026-11-05 17:52 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-1c-fix3
    disposition: not-applicable
    because: >-
      Lab build work (containers, engine homes) with two smokes; no review panel runs, so no failed
      or split panel can arise (D291).
    by: lead (session 772be7be)
    at: "2026-11-05 18:02 UTC"
    inputs:
      - record: D291
        rev: 02d5b0a9caebf920b2e88f39a4a6e4135782d1bacd48b9fe106ded757faf9540
  - action: run:lab-1c-fix4
    disposition: not-applicable
    because: Unit-tested change to the lab's login copy-back; no review panel runs (D293).
    by: lead (session 772be7be)
    at: "2026-11-05 21:04 UTC"
    inputs:
      - record: D293
        rev: 7917c299322726c9edfc56e548e73b04f6e2dc532b2faa47018c32f645789c47
  - action: run:lab-2a
    disposition: not-applicable
    because: >-
      Stage 2a builds the step pipeline with fake engines; no real review panel runs. The pipeline's
      routing of a failed or split panel to the user is asserted end to end in its tests (brief,
      D296).
    by: lead (session 772be7be)
    at: "2026-11-05 21:12 UTC"
    inputs:
      - record: D296
        rev: 2a20f9f4f648c7594479973d065f00f070f3ccd680721a094a08087b152dbe21
  - action: run:lab-2a-fix1
    disposition: not-applicable
    because: >-
      Follow-up 1 changes the plied note call, the session-limit counting and adds a kept-workspace
      test, all with fake engines; no real panel runs, and the P198 routing tests stay in the suite
      that must pass (D297, D298).
    by: lead (session 487510ed)
    at: "2026-11-05 22:08 UTC"
    inputs:
      - record: D297
        rev: e33106d3fa8a1ce0ec2ef77bd17ba08a7e90249beb7a1bc132f03286eca52074
      - record: D298
        rev: ddd3ce2a33b8898389cbfe4779cd230b8e21e500a5277488dc0108a0c05f6f2e
  - action: run:lab-2b
    disposition: not-applicable
    because: >-
      Stage 2b builds the loop, commands and recovery with fake engines; no real panel runs. The
      loop skips nodes with a pending ask, so a failed or split panel's ask stops the node; tested
      (D300, brief logs/handoff/20261105-2219-lab-2b).
    by: lead (session 487510ed)
    at: "2026-11-05 22:21 UTC"
    inputs:
      - record: D300
        rev: d6bfb7a6d85a1d5d13f80c010edaef17ffa9baa09cbab4b1363cf46fd2e17b42
  - action: run:lab-2c-prep
    disposition: not-applicable
    because: >-
      2c-prep builds meter wiring, the queue setting, the dirty-file refusal and Codex/Muse context
      limits with fake engines and no model call; no panel or revision runs, and the refusals it
      adds end steps as asks (D302).
    by: lead (session 487510ed)
    at: "2026-11-05 23:13 UTC"
    inputs:
      - record: D302
        rev: 1aa559d7d917b1cf8363c627e9d718523699029d78f5d986a21cc2030e69f532
  - action: run:lab-2c-prep-fix1
    disposition: not-applicable
    because: >-
      Follow-up 1 changes meter-read env, Codex/Muse hard-limit handling and meter-home cleanup with
      fakes, no model call; no panel or revision runs (D303).
    by: lead (session 487510ed)
    at: "2026-11-05 23:39 UTC"
    inputs:
      - record: D303
        rev: af28df3b4f7690c8904db184752b48575e8828b31cff3c10a1ff8a4a80e447d1
  - action: run:lab-probe-flag
    disposition: not-applicable
    because: >-
      a CLI flag built with fakes; no panel or revision is involved, and the build does not touch
      the ask routing
    by: lead (session 487510ed)
    at: "2026-11-06 02:59 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-probe-1
    disposition: not-applicable
    because: >-
      a meter probe (two one-turn calls, no tools) on the user's instruction D306; no panel,
      revision or ask is involved
    by: lead (session 487510ed)
    at: "2026-11-06 03:04 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-test-fixture
    disposition: not-applicable
    because: tests moved onto a config fixture; no panel, revision or ask routing
    by: lead (session 487510ed)
    at: "2026-11-06 03:11 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-ui
    disposition: not-applicable
    because: a read-only page; no panel, revision or ask routing; answers stay with lab answer
    by: lead (session 487510ed)
    at: "2026-11-06 03:17 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-session-errors
    disposition: not-applicable
    because: >-
      records a failed session's error; the ask routing is unchanged (a failed or unauditable
      session still ends as an ask)
    by: lead (session 487510ed)
    at: "2026-11-06 03:30 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-claude-schema
    disposition: not-applicable
    because: the schema handed to the Claude CLI; no panel, revision or ask routing
    by: lead (session 487510ed)
    at: "2026-11-06 03:38 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-packet-plied
    disposition: not-applicable
    because: packet contents and a read-only plied in the box; no panel, revision or ask routing changes
    by: lead (session 487510ed)
    at: "2026-11-06 04:19 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-rehearsal
    disposition: not-applicable
    because: >-
      a rehearsal on a throwaway clone and state; its asks are the sandbox's; the routing to the
      user is exercised, not changed, and nothing reaches the real checkout
    by: lead (session 487510ed)
    at: "2026-11-06 04:26 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-codex-plied
    disposition: not-applicable
    because: >-
      the diagnosis's few Codex sessions are tools probes, not review panels; no panel verdict is
      acted on, and any allowedFeatures change goes to the user (D323)
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:17 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
      - record: D323
        rev: aa8cf7819ac48b758a116c8c0b2d523587a7004a427eec49f94f11306200b97a
  - action: commit:partd-backfill-records-20261107
    disposition: not-applicable
    because: "no panel verdict is involved: the user instructed this commit (D325)"
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:33 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
      - record: D325
        rev: 7326260db82fda4cc885860de4618ee923614d23b6c81f286bed853e1ff5aaa9
  - action: merge:browser-sim-m1@78765aa
    disposition: not-triggered
    because: >-
      A fast-forward of main (f8d29d5) to browser-sim-m1 (78765aa), pushed with the user's
      instruction (D326): five commits already on the branch, each gated when made
      (commit:q38-records-20261105 ... commit:partd-backfill-records-20261107). They hold records
      and byte-identical copies of frozen Part D readers; no src/, public/, fit or data change, so
      the published pages are unchanged. No freeze, model change, run, held-out use or new reading
      is in it.
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:44 UTC"
    inputs:
      - record: D326
        rev: 4af08c5fa754c9b883af7b755d3b50d8b0f284acdc6fa13039d238587d0e1a6b
---

## History
- 2026-11-05 05:34 UTC lead (session 48c74063): created — D277: the delegation's stop rule
- 2026-11-05 05:35 UTC lead (session 48c74063): review for run:lab-1a: not-applicable — run:lab-1a builds and unit-tests the lab's guard, policy, quota and adapter code with fake engines in ~/repos/ants-lab; no review panel runs and nothing is approved, so P198's stop rule has no panel outcome to route
- 2026-11-05 05:38 UTC lead (session 48c74063): review for run:lab-1a: not-applicable — re-read D277 (amended: plied tool, scope T065, justification in packets) and D278: run:lab-1a builds and unit-tests guard, policy, quota and adapter code with fakes plus three single-word wiring smokes per engine; no panel runs and nothing is approved, so no panel outcome exists to route to the user
- 2026-11-05 05:45 UTC lead (session 48c74063): reviewed D279@22eb7cdfc9f1; D279 read: it adds no route around the panel rule; suggestions about the lab go to the user, so P198 stands unchanged.
- 2026-11-05 05:59 UTC lead (session 48c74063): reviewed D280@e1c4e6a09f8a; D280 read: a commit instruction and the data-roles table; the panel rule is unchanged.
- 2026-11-05 06:00 UTC lead (session 48c74063): review for commit:lab-records-20261105: not-applicable — the commit records D277-D280; no review panel has run, so no panel outcome needs routing; the rule itself is committed unchanged
- 2026-11-05 06:08 UTC lead (session 48c74063): reviewed D282@23fbdb91f91f; D282 read: panels never fall back to another engine; they wait, so P198's routing is unchanged.
- 2026-11-05 06:19 UTC lead (session 48c74063): reviewed D284@fa27feb6e463; D284 read: stage 1a's aggregate() implements P198 (a non-pass panel goes to the user without revision; a review fails to the user at the second revision); tested, not yet exercised by a live panel; P198 stays open.
- 2026-11-05 06:21 UTC lead (session 48c74063): review for run:lab-1b: not-applicable — run:lab-1b builds and tests workspaces, hooks, tripwires, adapters and meters, with at most two single-word wiring calls per engine; no review panel runs and nothing is approved
- 2026-11-05 07:02 UTC lead (session 48c74063): review for run:lab-1b-fix: not-applicable — run:lab-1b-fix rebuilds lab workspaces without history and adds schema, probe and tripwire code with fake engines and one single-word Codex call; no review panel runs and nothing is approved
- 2026-11-05 16:54 UTC lead (session 772be7be): review for commit:lab-1b-records-20261105: not-applicable — the commit records D281-D287, T065 notes and earlier dispositions, and ants-lab's tested code; no review panel has run, so no panel outcome needs routing
- 2026-11-05 16:58 UTC lead (session 772be7be): review for run:lab-1c: not-applicable — run:lab-1c builds and tests the lab's containers, proxy, runner and transcript audit, with container probes that make no model calls and at most two Claude, one Codex and one Muse wiring call; no review panel runs and nothing is approved
- 2026-11-05 17:35 UTC lead (session 772be7be): review for run:lab-1c-fix: not-applicable — run:lab-1c-fix changes the proxy to per-role allowlists with session attribution, and isolates host-side git config; container probes without model calls and one Claude wiring call; no review panel runs and nothing is approved
- 2026-11-05 17:52 UTC lead (session 772be7be): review for run:lab-1c-fix2: not-applicable — run:lab-1c-fix2 wires Codex's deny-by-default feature list and repeats one Codex wiring call; no review panel runs and nothing is approved
- 2026-11-05 18:02 UTC lead (session 772be7be): review for run:lab-1c-fix3: not-applicable — Lab build work (containers, engine homes) with two smokes; no review panel runs, so no failed or split panel can arise (D291).
- 2026-11-05 21:04 UTC lead (session 772be7be): review for run:lab-1c-fix4: not-applicable — Unit-tested change to the lab's login copy-back; no review panel runs (D293).
- 2026-11-05 21:12 UTC lead (session 772be7be): review for run:lab-2a: not-applicable — Stage 2a builds the step pipeline with fake engines; no real review panel runs. The pipeline's routing of a failed or split panel to the user is asserted end to end in its tests (brief, D296).
- 2026-11-05 22:08 UTC lead (session 487510ed): review for run:lab-2a-fix1: not-applicable — Follow-up 1 changes the plied note call, the session-limit counting and adds a kept-workspace test, all with fake engines; no real panel runs, and the P198 routing tests stay in the suite that must pass (D297, D298).
- 2026-11-05 22:17 UTC lead (session 487510ed): reviewed D299@8e6a248061db; Reviewed against D299: it cites this commitment only for the follow-up-1 gate's not-applicable disposition (no real panel or pre-registration ran); status unchanged, open.
- 2026-11-05 22:21 UTC lead (session 487510ed): review for run:lab-2b: not-applicable — Stage 2b builds the loop, commands and recovery with fake engines; no real panel runs. The loop skips nodes with a pending ask, so a failed or split panel's ask stops the node; tested (D300, brief logs/handoff/20261105-2219-lab-2b).
- 2026-11-05 23:08 UTC lead (session 487510ed): reviewed D301@0818bb0a1b81; Reviewed against D301: 2b keeps the routing (no step on a node with a pending ask; panels never fall back); status unchanged, open.
- 2026-11-05 23:13 UTC lead (session 487510ed): review for run:lab-2c-prep: not-applicable — 2c-prep builds meter wiring, the queue setting, the dirty-file refusal and Codex/Muse context limits with fake engines and no model call; no panel or revision runs, and the refusals it adds end steps as asks (D302).
- 2026-11-05 23:39 UTC lead (session 487510ed): review for run:lab-2c-prep-fix1: not-applicable — Follow-up 1 changes meter-read env, Codex/Muse hard-limit handling and meter-home cleanup with fakes, no model call; no panel or revision runs (D303).
- 2026-11-06 02:59 UTC lead (session 487510ed): review for run:lab-probe-flag: not-applicable — a CLI flag built with fakes; no panel or revision is involved, and the build does not touch the ask routing
- 2026-11-06 03:04 UTC lead (session 487510ed): review for run:lab-probe-1: not-applicable — a meter probe (two one-turn calls, no tools) on the user's instruction D306; no panel, revision or ask is involved
- 2026-11-06 03:11 UTC lead (session 487510ed): review for run:lab-test-fixture: not-applicable — tests moved onto a config fixture; no panel, revision or ask routing
- 2026-11-06 03:17 UTC lead (session 487510ed): review for run:lab-ui: not-applicable — a read-only page; no panel, revision or ask routing; answers stay with lab answer
- 2026-11-06 03:30 UTC lead (session 487510ed): review for run:lab-session-errors: not-applicable — records a failed session's error; the ask routing is unchanged (a failed or unauditable session still ends as an ask)
- 2026-11-06 03:38 UTC lead (session 487510ed): review for run:lab-claude-schema: not-applicable — the schema handed to the Claude CLI; no panel, revision or ask routing
- 2026-11-06 04:19 UTC lead (session 487510ed): review for run:lab-packet-plied: not-applicable — packet contents and a read-only plied in the box; no panel, revision or ask routing changes
- 2026-11-06 04:26 UTC lead (session 487510ed): review for run:lab-rehearsal: not-applicable — a rehearsal on a throwaway clone and state; its asks are the sandbox's; the routing to the user is exercised, not changed, and nothing reaches the real checkout
- 2026-11-07 05:17 UTC lead (session 9871fd6b): review for run:lab-codex-plied: not-applicable — the diagnosis's few Codex sessions are tools probes, not review panels; no panel verdict is acted on, and any allowedFeatures change goes to the user (D323)
- 2026-11-07 05:33 UTC lead (session 9871fd6b): review for commit:partd-backfill-records-20261107: not-applicable — no panel verdict is involved: the user instructed this commit (D325)
- 2026-11-07 05:44 UTC lead (session 9871fd6b): review for merge:browser-sim-m1@78765aa: not-triggered — A fast-forward of main (f8d29d5) to browser-sim-m1 (78765aa), pushed with the user's instruction (D326): five commits already on the branch, each gated when made (commit:q38-records-20261105 ... commit:partd-backfill-records-20261107). They hold records and byte-identical copies of frozen Part D readers; no src/, public/, fit or data change, so the published pages are unchanged. No freeze, model change, run, held-out use or new reading is in it.
