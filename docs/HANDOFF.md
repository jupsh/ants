# Hand-off between the lead agent and the implementer (D208)

The lead agent keeps the record; the implementer subagent (`.claude/agents/implementer.md`, Opus) writes the code.
They meet in two files, kept per task in `logs/handoff/<YYYYMMDD-HHMM>-<slug>/` (local, not committed; the log
entry quotes what matters):

- `brief.md`, written by the lead before the work;
- `report.md`, written by the implementer at the end.

## The lead's side

**Before the brief:** read the node (`plied show`), run `plied review <nodes>`, log the decision or
pre-registration the work rests on. A test or smoke that runs governed code is a governed action, so gate every run
the brief will allow (`plied review <nodes> --action run:<slug> --gate`, dispositions) and name the action in the
brief. Then write the brief, `plied claim` the node and note on it that the implementer is working and where the
brief is: the claim lapses after 30 min without your tool calls, and the note keeps the work visible.

**The implementer and plied:** it reads plied (`show`, `review`, `messages`, …) but does not claim, message or
release: it runs with your `PLIED_AGENT` and session id, so those would act as you (the guard refuses them). Its
report is its hand-off; the plied hook does not run inside it.

**After the report:** check the result yourself (read the diff, `npm test`, `npx tsc --noEmit -p .`, the brief's
acceptance checks). Then write the log entry (it is the record a closed thread's `outcome.ref` names, not the
report), quoting the report for what was built, run and seen, and update the
finding and plied in the same step. A defect found in the implementer's code, now or later, is logged with
`--kind correction`.

Do the bookkeeping at these two points, not while the implementer works.

**Spawning:** `Agent` with `subagent_type: "implementer"`, prompt: the brief's path and one line on the task.
Continue the same implementer with `SendMessage` for follow-up fixes on the same brief; start a new one for a
new brief.

**For a statistic a pre-registration freezes**, consider a second implementer with a brief that gives only the
pre-registration's definition (not the first one's code), run both on a development or toy input, and compare
the numbers before the real reading.

## Brief (`brief.md`)

```markdown
# <task title>
- Nodes: <T…>; log entry it rests on: <D…>
- Blind: no | yes: <outputs not to open, list or tail>
- Gated: <run:<slug>, covering every run under May run> | none govern (`plied review <nodes>` lists no commitment)

## Task
<What to build or change and why, in a few sentences. Point to the log entry or code, don't restate them.>

## Requirements
<Each commitment or decision that governs the work, quoted word for word with its id, e.g.
- P45: "…" (D150)
Add any constraint the lead sets, marked as the lead's.>

## Scope
- May change: <files or folders>
- May run: <npm test, tsc, named scripts with their arguments, time limit>
- Must not: <anything specific beyond AGENTS.md>

## Acceptance
<How the result will be checked: tests that must pass, a known case and its answer, numbers to reproduce.>

## Report
Write to `logs/handoff/<…>/report.md`.
```

## Report (`report.md`)

```markdown
# Report: <task title>
## Outcome
<Done / partly done / not done, in one or two sentences.>
## Changes
<Each file changed and what changed in it.>
## Ran
<Each command, its exit status, and the lines of output that matter (test counts, tsc errors, numbers).>
## Outputs
<Each file written: path and `sha256sum`. Nothing opened if the brief is blind.>
## Checks against the brief
<Each Requirement and Acceptance item: met / not met / not checked, with the evidence.>
## Deviations and doubts
<Anything done differently from the brief, anything unclear, anything that looks wrong in code you did not change.>
## Seen against a rule
<Anything you saw that a rule says you should not have, exactly what; or "nothing".>
```
