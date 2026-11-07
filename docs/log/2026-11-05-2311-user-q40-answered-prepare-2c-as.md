---
id: D302
date: 2026-11-05
time: 23:11
kind: decision
title: User: Q40 answered, prepare 2c as recommended; the lead's settings for the 2c prerequisites (lab actor and queue, meters from the lab's homes, --alongside, one key per setting, no lab commit of a file dirty before its step)
authority: user
scope: T065 Q40 P201
---
- **2026-11-05 ≈ 23:11 UTC — User: Q40 answered, prepare 2c as recommended; the lead's settings for the 2c prerequisites (lab actor and queue, meters from the lab's homes, --alongside, one key per setting, no lab commit of a file dirty before its step).**
  - **The user's words (2026-11-05, in session 487510ed, answering Q40):** "you decide the answers to 2c prereqs. the
    recommended solution looks good to me". Q40's recommended option (D301), adopted: "a 2c-prep brief first, no model
    calls: meters read from the lab's own engine homes (never the user's Muse account), the duplicate config keys
    removed; plied gets a `lab` actor and the lab takes only nodes the user or lead sets actor=lab; it runs with
    --alongside so the user's and the lead's sessions do not block it; then the first analysis step's dry run comes to
    the user before lab enable".
  - **P201 answered:** plied gets a `lab` actor (`plied.toml` `[checks] actors`), and the lab's `queue.actor` is `lab`,
    set explicitly in `lab.config.json`. The lab takes only nodes whose `actor` the user or the lead sets to `lab`; no
    node is set to it until the first step's dry run has gone to the user.
  - **The lead's settings for the prerequisites (delegated by the user above):**
    - **Meters:** read with each provider's lab login only: Claude from `paths.claude_token_file`; Codex and Muse from
      a meter home built like a session home (a copy of the lab home's login, 0600, copied back under the D293 rules,
      then deleted), never `~/.codex`, `~/.config/muse` or any other home of the user's. The probe is wired the same way;
      it is a model call, so the prep work never runs it, and neither does a meter read the implementer makes.
    - **`--alongside`:** the lab is run as `lab run --alongside`. The lab still never takes a node another session has
      claimed, and never commits or patches over the user's or the lead's uncommitted work (next item).
    - **No lab commit of a file dirty before its step:** while the ants checkout holds uncommitted work (now: the
      1c-2b records held under D294), a lab step's commit plan, or patch, that touches a file which differed from
      HEAD (or was untracked) when the step began is refused before review and ends the step as an ask. Files the
      records tool regenerates (`docs/log/README.md`, `docs/contamination/README.md`, `plied/README.md`) count: a lab
      commit carrying them would carry index lines for the held entries.
    - **One key per setting:** the 2b keys that duplicated existing ones are removed: `ladder.shadowShare` (kept:
      `ladder.shadowRate`) and `digest.hourUtc` (kept: `limits.dailyDigestUtcHour`). `queue.actor` stays.
    - **Codex and Muse context limits** (open since D297): soft and hard context enforcement for the two adapters goes
      in the same brief, since a live step may use either.
  - **Order:** the 2c-prep brief (implementer, no model calls, nothing written in the ants repo), checked by the lead;
    one real meter read by the lead (`lab usage --read`, no probe); the lead picks the first analysis thread and runs
    its `lab step --dry-run`; that dry run, the thread and the meters go to the user before `lab enable`, as D296
    requires. The commits of 1c onward stay held (D294).
