---
id: D277
date: 2026-11-05
time: 05:23
kind: decision
title: User: an autonomous research lab built on the Claude Agent SDK, kept outside the repo (~/repos/ants-lab); a cross-model review panel (Codex, Muse and a fresh Claude checker, all passing) may approve commits to browser-sim-m1, plan order within the current plan and procedural plied questions, under 'delegated by' this entry; everything else the user decides still goes to the user with a push notification, box rentals included; agents keep 15% of each weekly subscription limit for the user and search the web for software and methods only
authority: user
scope: T065
---
- **2026-11-05 ≈ 05:23 UTC — User: an autonomous research lab built on the Claude Agent SDK, kept outside the repo (~/repos/ants-lab); a cross-model review panel (Codex, Muse and a fresh Claude checker, all passing) may approve commits to browser-sim-m1, plan order within the current plan and procedural plied questions, under 'delegated by' this entry; everything else the user decides still goes to the user with a push notification, box rentals included; agents keep 15% of each weekly subscription limit for the user and search the web for software and methods only.**
  - **User (in conversation, verbatim excerpts):** "create a research agent and possible subagents using claude
    agent sdk. i want to able to just keep doing research without my explicit approval for things that could just
    as easily be handled by a review agent - you should still come to me for sensitive things or maybe if you would
    like my help with literature retrieval, and maybe this should be a push notification to call my attention." …
    "i don't want to run out of my weekly claude/chatgpt subscription quickly" … "a single agent who handles plied
    and research and implementation will often make more mistakes" … "ideally it's untracked" … "as for the box, it
    should be used when deemed helpful, but i should still be notified".
  - **User's answers to the lead's four questions (verbatim choices):**
    1. Which user-reserved decisions a cross-model review panel may approve: "Branch commits, Plan order, Procedural
       questions" (offered and not chosen: "Pre-reg wording", i.e. approving a pre-registration's wording and
       freezing its code).
    2. Box spending cap before it must ask instead of notifying: "Always ask" (BOX.md's rule stands: rent only on
       the user's yes, the request now sent as a push notification).
    3. Share of each weekly subscription limit the agents leave for the user: "15%".
    4. Web access: "Software/methods only" (web search only for tooling, statistics and numerical methods; any
       ant/biology literature search becomes a request to the user).
  - **The delegation, as adopted.** Under `authority: delegated by D277`, the lab's review panel may approve, and only
    when every reviewer passes it: (a) commits to `browser-sim-m1` (the gated `commit:` step; not merges, pushes or
    other branches); (b) the order of threads and steps within the current plan (plied), not its goals; (c) plied
    questions that only choose between procedures the rules already allow. A failed or split panel, or a second
    failed revision, goes to the user. Everything else AGENTS.md reserves for the user stays the user's: model
    adoption, changes to the plan's goals, pre-registrations and frozen artifacts, roles of data, clearing literature,
    merges; also rentals, held-out or sealed material, exposures (recorded, then notified) and rule changes. The
    evidence policy, sealed paths, blind checks and plied gates apply to the lab's agents unchanged.
  - **Why a cross-model panel:** same-model review is biased towards its own output (Anthropic, "A harness for every
    task", self-preferential bias; LLM-judge self-preference studies), and automated review of an AI research agent's
    final output misses most methodological failures unless the logs and code are audited (Luo, Kasirzadeh & Shah,
    arXiv 2509.08713: 55 % vs 82 % accuracy); reviewers therefore get the proposal, the governing records and the
    evidence, never the author's reasoning.
  - **Subscription use:** the lab runs the unmodified Claude Code binary through the Agent SDK on the user's own
    subscription for the user's own work (Claude Code legal page: advertised limits "assume ordinary, individual
    usage of Claude Code and the Agent SDK"); Codex through `codex exec` on the user's ChatGPT login; Muse through
    `muse exec` on the user's Meta subscription. Nothing is offered to anyone else.
  - Design and code: `~/repos/ants-lab/` (local, outside this repo). Implementation through the implementer (D208)
    from briefs in `logs/handoff/`.
- **2026-11-05 ≈ 05:24 UTC — Amendment 1: the user adds the plied tool to the delegation.**
  - **User (in conversation, verbatim):** "btw, it should also have authority to make changes to plied, including
    merges and deployments".
  - **Read by the lead as:** the plied tool's own repository (`~/repos/plied`, github.com/jupsh/plied): changing its
    code and docs, merging to its `main`, releasing (version bump, CHANGELOG, tag `vX.Y.Z` pushed on `main`, which
    `release.yml` publishes) and installing the released version locally. Under the same rule as the other
    delegated items: every reviewer of the panel passes it, after plied's own tests and CI pass, and plied's own
    `AGENTS.md` applies. A release is public and cannot be withdrawn (a published version can only be yanked), so
    after each local install the lab runs `plied check` here; new errors roll the install back to the previous
    version and go to the user. Writing this project's plied records (`plied/`) is the lab's ordinary
    record-keeping, through plied as before. Merges and pushes of this repository stay the user's.
- **2026-11-05 ≈ 05:33 UTC — Scope corrected:** `scope` changed from the STATUS record id to T065 (the lab's thread, created after this
  entry): naming STATUS made every node that links STATUS stale without changing any of them. The rule itself is in
  STATUS *Rules in force* (line added with this entry).
- **2026-11-05 ≈ 05:37 UTC — Corrected after the user's review (D278):** reviewers get the proposal's scientific
  justification (assumptions, derivations, reasons for methodological choices) but not the conversation; "never the
  author's reasoning" above is narrowed to that.
