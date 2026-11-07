---
id: D306
date: 2026-11-06
time: 02:59
kind: decision
title: User: Q41 answered: the lead probes Claude and Muse once now, re-reads the meters and reports; T064 gets actor=lab only if Claude gives a meter
authority: user
scope: Q41 T065 T064
---
- **2026-11-06 ≈ 02:59 UTC — User: Q41 answered: the lead probes Claude and Muse once now, re-reads the meters and reports; T064 gets actor=lab only if Claude gives a meter.**
  - **The user's answer** (to Q41, raised by D305): "Probe once now (Recommended)", the option reading "I run one
    Claude probe and one Muse probe (two tiny one-turn calls on the lab's logins), re-read the meters and report back.
    If Claude gives a meter, T064 gets actor=lab and you run lab enable."
  - **How the lead does it:** the probe is reachable only inside `lab run`'s loop. The implementer adds `lab usage
    --read --probe` (brief `logs/handoff/<stamp>-lab-probe/`), which calls the loop's own `ensureFreshMeter` for Claude
    and Muse: a probe only when the meter is not fresh, once per `meterMaxAgeMinutes`, recorded in `usage.jsonl` as a
    probe, journaled, then the re-read. Codex is never probed. The probe settings stay as configured (`quota.probe`:
    Claude Haiku 5.5 low, Muse low, "Reply with the single word OK"). The implementer builds and tests it with fakes
    only; the lead makes the one real call.
  - **After:** if Claude gives a fresh meter, T064 gets actor=lab and `lab enable` goes to the user. If not, the result
    comes back to the user with the reason, and no node gets actor=lab.
