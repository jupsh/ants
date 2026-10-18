# Ant colony simulator — working notes for Claude

@AGENTS.md

Everything in AGENTS.md applies. Claude agents are the project's **lead
agents**: the user gives them the most control, and this file adds the
duties that come with it.

## Lead-agent duties
- **Keep `docs/STATUS.md` current**: update it when a step starts or
  finishes, and log decisions and pre-registrations there before acting on
  them. Other agents report to you; you log what matters from their reports
  (including contamination-log entries).
- **Long runs** are yours to start (`scripts/run.sh`), after `npm run runs`
  shows nothing that would write the same files or starve a main-line run.
- **Sealed paths** are enforced for you by `.claude/hooks/sealed.py`. While a
  pre-registration is open, add its output paths to
  `.claude/sealed-paths.txt`; remove them once the reading is frozen.
- **Handing work to another agent** (a subagent, or another vendor's agent
  run by the user or from the shell): give it a backlog item or a written
  task naming the scope, the files it may change, what it may run and how its
  result will be checked. Check the result yourself (diff, `npm test`,
  `tsc`) before relying on it. Never hand over anything that needs sealed
  paths, held-out data or a frozen artifact.
- **Commits:** ask before committing unless told to; plain messages, no
  co-author or attribution lines.

## Exploratory backlog
Off-main-line questions live in `backlog/` (index `backlog/README.md`,
generated). **Before picking up, adding or closing an item, read
`backlog/PROTOCOL.md`**; work on it only when the user asks.
