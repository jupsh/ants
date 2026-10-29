# Ant colony simulator — working notes for Claude

@AGENTS.md

Everything in AGENTS.md applies. Claude agents are the project's **lead
agents**: the user gives them the most control, and this file adds the
duties that come with it.

## Lead-agent duties
- **Keep each fact in its one home** (AGENTS.md, *How the record is
  divided*). A change is written once, where it belongs, and summaries are
  pointers:
  - a decision or reading goes in its log entry;
  - the claim it supports goes in a finding;
  - what it opens, closes or promises goes in plied;
  - STATUS changes only if the state, the plan or a rule changes.

  RESUME is not a narrative of the work. Keep it short, the state and where
  to look, and when it grows, move the old text verbatim to an archive
  (`docs/archive/STATUS-RESUME-*.md`, with an `A` id for plied).
- **Keep `docs/STATUS.md` current** (state, plan, rules): update it when a
  step starts or finishes. **Log decisions and pre-registrations in
  `docs/log/` before acting on them**: `node docs/records.mjs log new
  "<title>" --kind k` stamps the real UTC time (never type a time by hand);
  amend an entry with a dated line in its own file. Exposures go in
  `docs/contamination/` (`contamination new`). Other agents report to you;
  you log what matters from their reports. `node docs/records.mjs check`
  must pass (it flags dated entries written into STATUS).
- **Keep `findings/` current** (one file per empirical claim; `node
  findings/findings.mjs` regenerates the index, `check` validates references):
  add or update a finding in the same step as the log entry that reads a
  result, or when a backlog item closes; supersede rather than delete.
- **Keep plied current** (`plied/`, adopted D142; contract in the plied
  repo's `docs/FORMAT.md`). It holds the open work and its order (threads),
  the commitments ("if X, then Y", quoted from the record that made them) and
  the decisions waiting on the user (questions). It links the records above
  and never restates them. `PLIED_AGENT=lead` is set for Claude sessions.
  - Start from `plied frontier`. Write only through plied: `plied show` gives
    the rev, then `plied set <id> … --expect <rev> --why "…"`; `new` and
    `note` likewise. Never edit `plied/` by hand (the pre-commit guard refuses
    it).
  - In the same step as the log entry that changes a node, update the node:
    close it with an `outcome.quote` copied from that entry, and list in
    `carries` the findings it leaves unresolved. Record a new commitment when
    it is made, with `wording` quoted from its `made` record, and attach it to
    its nodes. A question raised for the user becomes a `question`. Answer
    one with a decision entry that carries `--authority user --scope "<ids>"`
    (`records.mjs log new`), so plied can check the authority.
  - Before a consequential action (a fit or long run, freezing a reading,
    committing results), run `plied review <nodes> --action <kind:name>
    --gate`, record a disposition for each commitment it lists (`plied
    dispose`, with the reason), and start runs with `run.sh start <name>
    --node <ids> -- …`.
  - Before running any code a commitment governs, at any size (smokes, toy
    runs and tests included), run `plied review <nodes>` (no `--gate`) and
    read the list. A commitment saying "before any X" has no size exemption,
    and a plan inherited from an earlier session is not a review.
  - `plied check` must pass (it is in `npm test`). Its warnings are review
    prompts, never a change of status. A flagged log entry that holds no
    commitment is recorded as read with `plied scanned <D…> --rev … --on
    T049 --because "…"` (silences it until the entry changes).
  - Claim the node you work on (`plied claim <id>`). Messages to it arrive
    through the hook; acknowledge them with `plied ack` (receipt, not
    approval).
- **Long runs** are yours to start (`scripts/run.sh`), after `npm run runs`
  shows nothing that would write the same files or starve a main-line run.
- **Rented boxes:** follow `docs/BOX.md` (`scripts/box.mjs`: offers, rent,
  setup, pace, market, fetch, destroy). Rent only after the user approves the
  offer and its estimate; destroy the box once its outputs are fetched.
- **Sealed paths** are enforced for you by `.claude/hooks/sealed.py`. While a
  pre-registration is open, add its output paths to
  `.claude/sealed-paths.txt`; remove them once the reading is frozen.
- **Handing work to another agent** (a subagent, or another vendor's agent
  run by the user or from the shell): give it a backlog item or a written
  task naming the scope, the files it may change, what it may run and how its
  result will be checked; name its plied thread, if it has one (it may
  `plied claim` it and message it, not write records). Check the result
  yourself (diff, `npm test`, `tsc`) before relying on it. Never hand over anything that needs sealed
  paths, held-out data or a frozen artifact.
- **Commits:** ask before committing unless told to; plain messages, no
  co-author or attribution lines.

## Exploratory backlog
Off-main-line questions live in `backlog/` (index `backlog/README.md`,
generated). **Before picking up, adding or closing an item, read
`backlog/PROTOCOL.md`**; work on it only when the user asks.
