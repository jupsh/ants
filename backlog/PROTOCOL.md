# Exploratory backlog: protocol

For Claude agents (the lead agents, `CLAUDE.md`). Agents of other vendors
handed an item follow `AGENTS.md` § Who decides what.

Open questions and side investigations **off the main line** (the Plan and
RESUME in STATUS): diagnostics, checks of assumptions, tooling and speed-ups,
questions answerable from cleared literature. Not backlog: steps of the Plan,
anything needing held-out data, and anything the user parked "not to be run
without the user".

**Layout.** One folder per item, `backlog/Bnnn-slug/`. Its `README.md`
frontmatter (`status`, `size`, `priority`, `note`, `outcome`) is the item's
state. The body holds the scope, the Progress log (the history) and the
Findings (the answer). `backlog/README.md` (open items, by priority) and
`backlog/CLOSED.md` are **generated**: never edit them; run
`node backlog/backlog.mjs` after any frontmatter change. Statuses:
`unscoped` → `open` → `active` → `done` | `dropped`, with `blocked` (the
reason in `note`) at any point. The user sets priorities.

**Committed.** Item READMEs, `LOG.md`, scripts and small results are
committed with the rest of the work (when the user asks for a commit).
Bulky outputs go in the item's `out/` (git-ignored), with a summary in
`results/`. Never copy the local-only Khuong port or sealed material into
an item.

**Isolation.** Every write of a backlog item stays in its folder (plus the
STATUS entries named below). Read the main tree freely (except sealed
paths) and import from `../../src`, but never edit it from a backlog item.
`side-projects/` holds the user's own projects: read them when an item
builds on one, never write to them.

## Picking up an item
Only when the user asks ("work the backlog", "pick up B007", or continue
after your task). Never instead of an open main-line task.
1. Read `backlog/README.md` and run `npm run runs`: know which items are
   active and which compute is in use. `backlog.mjs check` lists closed
   items whose findings have gone stale (worth a rerun item). Read RESUME for what the main line is
   doing.
2. Take the highest `open` or `unscoped` row you can do: no clash with an
   active item or the main line, and compute you have (an L item needs the
   user's go-ahead). A claim marked **(stale)** (no progress for 24 h) may
   be taken over: release it and say so in the item's log.
3. **Claim it**: `node backlog/backlog.mjs claim Bnnn --as "<session label>"`.
   The claim is an atomic `mkdir` of `.claim/`, so if it fails, someone else
   has the item; pick another. Claims are per checkout and not committed.
4. **Unscoped items are scoped first**: fill in Question, Why it matters,
   Done when, Base (commit, and whether the main-tree files it depends on
   are dirty), Data and roles, Compute and Out of scope, and set the size.
   If the scope needs held-out data, a frozen artifact, a change to an
   adopted model, or more than L compute, release it as `blocked` with the
   reason in `note`, and stop.

## Working on it
- **State the reading before you run**: a Progress entry saying what you
  will run and what each outcome would mean. If the result could change a
  main-line decision, this is not enough: stop and ask for a full
  pre-registration in STATUS.
- **Code** lives in the item's folder: scripts, wrappers, modified copies of
  modules. Imports from `../../src` see the live working tree, which the
  main line may change during the item. If that could change your results,
  snapshot what you depend on into the folder. A change the main code needs
  becomes `proposal.patch` in the folder; it is never applied from the
  backlog. A switch must follow AGENTS.md § Conventions (off by default,
  bit-identical when off, with tests). Reuse, don't copy: `scripts/lib.ts`
  (args, JSON, `seedFor(study, 'diag', …)`, `provenance()`),
  `scripts/pool.ts` and its existing tasks, `src/sim/analysis/compare.ts`.
  A helper two items need goes in `backlog/_lib/`. Run item scripts from
  the repository root.
- **Stamp results**: every JSON file in the item's `results/` carries
  `provenance: stamp(ITEM)` (`backlog/_lib/stamp.ts`: simHash, commit,
  dirty flag, command, and hashes of the frontmatter's `depends:` paths,
  which list inputs beyond simHash's: other fits, the Stroeymeyt data, the
  tracker). `node backlog/backlog.mjs check [Bnnn]` then flags findings
  computed on code or inputs that have since changed.
- **Compute**: niced; never slow a main-line run (beside one, use only the
  workers it leaves idle). For long jobs, point `scripts/run.sh` at a
  command whose outputs land in the item's folder.
- **Data**: comparing with targets already designated fit or development
  is fine (say which in Data and roles). Data with no role yet becomes
  development once looked at: log it in the STATUS contamination log first.
  Held-out data: never.
- **Keep it small**: Progress entries are a few lines each, added with
  `backlog.mjs log Bnnn "…"` (what, the command, the numbers). Long output goes
  in `results/` and is linked. Past ~300 lines, move older entries to
  `LOG.md`; Findings stay in the README. Report failures as faithfully as
  successes.
- **Leave it resumable**: the last entry says where things stand and what
  comes next. If you stop: `backlog.mjs release Bnnn` (back to `open`), or
  `--status blocked` with the reason in `note`.

## Finishing
- Write **Findings**: the answer in a few sentences, the evidence (paths in
  the folder), confidence and caveats, what it implies, suggested next steps.
- Run `backlog.mjs check Bnnn`: every results file stamped and current.
- Set `outcome:` (one line), then `backlog.mjs release Bnnn --status done`
  (answered) or `--status dropped` (moot or not worth it; say why).
- If it bears on the main line: tell the user in your reply and add a dated
  one-line entry to the STATUS Decisions log pointing to the item. Never
  change the Plan, RESUME's next steps, adopted fits or rules from a
  backlog item; propose, and the user decides.
- Questions you notice along the way become new items:
  `backlog.mjs new "<title>" --question "…" --source "…"` (status
  `unscoped`, last in priority until the user reorders).
