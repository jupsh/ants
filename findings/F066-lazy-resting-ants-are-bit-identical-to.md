---
id: F066
title: Lazy resting ants are bit-identical to stepping and give ≈1.4× on Stroeymeyt-scale colonies, ≈1.15× on Mailleux nests at density 2.3
topic: numerics
status: indicated
date: 2026-10-19
data: none (colony set-ups as inputs)
evidence: B014; docs/log/2026-10-19-2213-backlog-b014-done-lazy-resting-ants-bit.md
bears_on: step-5 and Stroeymeyt-scale run time (judging, refits, step 9)
related: F059
supersedes:
superseded_by:
depends: backlog/B014-event-driven-resting-ants-in-the-colony/results/identity.json, backlog/B014-event-driven-resting-ants-in-the-colony/results/bench.json
---
Opt-in `lazyRest` (LazyColonySim): resting ants advanced by an exact per-step tick, every other branch handed to the
original policy. Hash-equal to stepping on D048's three checks, Mailleux (both motions, days 1/4/8, shared warm-ups)
and 22 pooled colonies; per-step verification clean. Medians of 3: colony122 1.37×, Mailleux C2-proxy 138 nestmates
1.40×, 53 nestmates 1.15×, pilot motion none. Stepped run times are bimodal under V8 pretenuring (B022).
proposal.patch unapplied (user's decision). Applied 2026-10-20 as a rebased copy (D095 review, D096): bit-identical
re-checked in the current tree, including the fitted C2 / C1 points and step-5 C2 nests.
