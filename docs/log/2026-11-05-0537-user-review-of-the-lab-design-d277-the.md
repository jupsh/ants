---
id: D278
date: 2026-11-05
time: 05:37
kind: review
title: User review of the lab design (D277): the research step as the central object; isolated workspaces with changes applied by the conductor, no rollback against the user's tree; blindness as control of information flow; approvals bound to hashed artifacts, with a crash-safe journal outside agent-writable storage; obligations rebuilt from the records, not the hand-off; reviewers with distinct scientific jobs and independent verdicts; a failed panel goes straight to the user; publishing credentials with the executor; a quota uncertainty policy; scientific justification kept in packets. Adopted by the lead in full
---
- **2026-11-05 ≈ 05:37 UTC — User review of the lab design (D277): the research step as the central object; isolated workspaces with changes applied by the conductor, no rollback against the user's tree; blindness as control of information flow; approvals bound to hashed artifacts, with a crash-safe journal outside agent-writable storage; obligations rebuilt from the records, not the hand-off; reviewers with distinct scientific jobs and independent verdicts; a failed panel goes straight to the user; publishing credentials with the executor; a quota uncertainty policy; scientific justification kept in packets. Adopted by the lead in full.**
  - **User (in conversation, verbatim):**

    > I like the foundation: **short, specialised sessions; a deterministic conductor; explicit authority; and review based on evidence.** That fits this project well. I'd keep those choices.
    >
    > My biggest concern is that the design specifies agent roles more clearly than it specifies **what makes a research step safe to accept**. I'd strengthen these parts:
    >
    > 1. **Make the research step the central object.** Each step should identify its governing decision, applicable commitments, permitted inputs, expected outputs, checks and stopping condition. For example, T064 currently authorises a design brought back before implementation. An "implementer brief within `src/`" must not become automatically permissible just because its paths match.
    > 2. **Use isolated workspaces instead of the shared writable checkout.** Giving every container the ants repo read-write undermines the role boundaries, especially where Codex and Muse are audited afterward. Reviewers should receive read-only snapshots; implementers should receive isolated writable workspaces. The conductor applies accepted changes. I would remove automatic `git checkout` rollback against the user's working tree—it could erase intervening work.
    > 3. **Treat blindness as control over information flow.** Masking named paths helps, but results can escape through stdout, errors, copied files and transcripts. The runner should receive only the inputs needed for its particular run and a fresh output directory, rather than access to every sealed directory. Its logs need the same embargo as its results. An exposure cannot be undone by restoring files.
    > 4. **Bind approval to an exact artifact.** A verdict should approve a particular diff, command, input manifest and governing rule, identified by hashes. Changes invalidate that approval. The conductor also needs explicit recovery states: if it crashes after launching a run or making a commit, restarting should reconcile what happened before repeating anything. Keep that journal outside agent-writable storage.
    > 5. **Rebuild obligations independently of the hand-off.** Fresh contexts are useful, but a hand-off can omit the very constraint the previous agent forgot. The conductor should assemble applicable commitments, amendments and whole governing entries directly from the records. The hand-off supplies continuity; it should not determine which rules survive.
    > 6. **Give review concrete scientific jobs.** Cross-model agreement is useful, but I'd assign distinct responsibilities: authority and scope; statistical validity; implementation and reproducibility. Reviewers should produce independent verdicts before seeing one another's. Your independent implementation of statistics is particularly valuable. I'd also check for obligations such as a promised comparison row being absent—the Buffin omission is exactly the sort of failure ordinary software tests can miss.
    >
    > The cited audit study supports providing logs and code: its detection accuracy increased from 55% to 82% in that experiment. That supports richer evidence packets; it doesn't establish the reliability of this particular panel. [Luo et al.](https://arxiv.org/html/2509.08713v2)
    >
    > A few details need tightening:
    >
    > - **A failed panel is different from a routine failed check.** The loop currently allows revisions after any failure, whereas D277 sends a failed or split panel to you.
    > - **Publishing credentials belong with the executor.** Giving the toolsmith a plied token lets it publish before approval. Let it prepare the change; let the conductor publish the exact approved revision.
    > - **Quota preservation needs an uncertainty policy.** Reserve capacity before starting work and pause when meters are unavailable. I wouldn't assume `codex exec --json` provides the subscription meters described here; the documented explicit interface is app-server's `account/rateLimits/read` and update notifications. [Official documentation](https://learn.chatgpt.com/docs/app-server)
    > - **Keep scientific justification in review packets.** Excluding conversational deliberation makes sense; reviewers still need assumptions, derivations and reasons for methodological choices.

  - **Lead: adopted in full, before any code was built** (the stage-1a brief, `logs/handoff/20261105-0535-lab-1a/`,
    was written but not handed over; it is rewritten). The changes, all in `~/repos/ants-lab` (DESIGN.md, policy,
    schemas, prompts, config):
    1. A **step contract**, assembled by the conductor, is the unit of work and of approval:
       - the governing decision (whole entries with their amendments) and the clause in it that authorises this
         kind of step;
       - the applicable commitments (`plied review`);
       - the permitted inputs (a manifest);
       - the expected outputs, including every promised row or item;
       - the checks and the stopping condition.

       Nothing beyond reading, recording what happened and sealing is automatic: a brief or a run needs the
       authority-and-scope review to find the authorising clause.
    2. **Workspaces:**
       - agents write only in isolated clones;
       - reviewers read snapshots that leave sealed and embargoed material out entirely;
       - the conductor applies an accepted patch to the checkout only when the touched files are unchanged there;
       - tripwire hits discard the workspace, and the user's tree is never rolled back.
    3. **Runs:**
       - a run gets only its manifest inputs, read-only, and a fresh output directory;
       - its stdout, stderr and logs are embargoed with its results;
       - agents learn only a run's state;
       - embargoed material is released only by the step contract's rule.
    4. **Approvals:**
       - a verdict names the SHA-256s of the diff, command, input manifest and governing records;
       - the conductor re-checks them at execution;
       - the journal is an intent/done log in `~/.local/state/ants-lab/`, mounted nowhere;
       - on restart the conductor reconciles before repeating anything.
    5. **Obligations:** the conductor assembles them from the records for every session, reviewers included. The
       hand-off note is continuity only.
    6. **Review jobs:** three reviewers, each with its own job and verdicts collected blind to each other:
       - authority and scope: the Claude checker;
       - statistical validity: Muse, from the packet;
       - implementation and reproducibility: Codex, in a throwaway copy.

       An obligation-completeness check, deterministic and also each reviewer's duty, compares the outputs with
       every promised item. The independent second implementation is required for any statistic a
       pre-registration freezes.
    7. Details:
       - a failed or split panel goes straight to the user (P198), and only a failed check may be revised (twice);
       - the toolsmith holds no credential, and the conductor pushes, merges and tags the exact approved commit;
       - quota: a step starts only if its estimated cost (p90 of past steps of its kind) fits under the allowance,
         an unavailable meter pauses that provider, and Codex meters are read through `codex app-server`
         (`account/rateLimits/read`);
       - proposals carry a `justification` (assumptions, derivations, reasons for methodological choices), and
         reviewers get it but not the conversation.
