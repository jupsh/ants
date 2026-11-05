---
id: D279
date: 2026-11-05
time: 05:43
kind: decision
title: User: the lab's guardrails (a container; nothing off topic, no permission given that should not be), its housekeeping (occasional refactors as the repo grows disorganized), and suggestions: every proposed change to the lab's own configuration is recorded for the user to approve, never applied by the lab
authority: user
scope: T065
---
- **2026-11-05 ≈ 05:43 UTC — User: the lab's guardrails (a container; nothing off topic, no permission given that should not be), its housekeeping (occasional refactors as the repo grows disorganized), and suggestions: every proposed change to the lab's own configuration is recorded for the user to approve, never applied by the lab.**
  - **User (in conversation, verbatim), three messages during the lab's design (D277, D278):**
    1. "i'm also wondering how we can set up guardrails to make sure that nothing goes off topic and no permissions
       are given that shouldn't. how can we ensure this? a container?"
    2. "Oh and another thing - it's pretty easy for the repo to become disorganized. this should be kept in mind and
       occasional refactors will need to happen"
    3. "i also think it's possible that an agent may want to change the config. i want all suggestions recorded so
       that i can consider and approve them, instead of just running with the current config if it's not as
       efficient as it could be"
    4. "i bet there are good places to utilize cheaper models as well, like 6.1 terra or 5.5 haiku. maybe keep this
       in mind as well"
    5. "let's never use fable 5.1"
  - **As built into the design** (`~/repos/ants-lab/DESIGN.md`):
    1. *Guardrails*:
       - walls: per-session containers, mounts that decide what exists, an allowlisting proxy, runners without a
         network, credentials only with the host executor;
       - gates: SDK permissions, the repo's hooks plus the lab's, tripwires on every patch, post-hoc transcript
         audit;
       - staying on topic: work only from the plied frontier with an authorising quote, the authority reviewer's
         scope check, methods-only web search, per-node session limits, a daily digest; the lab cannot edit its
         own code, prompts or policy.
    2. *Keeping the repo organized*:
       - a curator survey every 25 steps or weekly;
       - `refactor` steps that must leave golden outputs byte-identical;
       - `docs_map` patches limited to AGENTS.md *Run* and *Code map*;
       - record hygiene by the clerk.
    3. *Suggestions for the lab itself*:
       - every role, and the conductor from its own statistics, records suggestions in `~/repos/ants-lab/
         suggestions/`, with target, exact change, why, evidence and expected effect;
       - duplicates accumulate evidence;
       - the user approves or declines each (`lab suggestions approve|decline`), and nothing is applied otherwise;
       - the lab's configuration is in D277's `never` list for delegation.
    4. *Model ladder*:
       - cheaper models where the work needs care rather than depth:
         - Claude Haiku 5.5: the scout, simple record steps, merging duplicate suggestions;
         - Sonnet: routine researcher steps;
         - GPT-6.1 Terra: routine implementation reviews and small plied fixes;
       - expensive models kept for design, panels, releases and second implementations;
       - Claude Fable 5.1 never used (message 5): it is on the config's `forbiddenModels`, which the conductor
         enforces, and a suggestion proposing it is declined;
       - a cheap step whose checks fail is retried once a rung up;
       - a 10 % shadow sample (cheap and expensive reviewers on the same packet, the expensive verdict never
         binding) gives the evidence for suggestions to move a job up or down.
