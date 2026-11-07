---
id: D316
date: 2026-11-06
time: 04:19
kind: decision
title: User: S001 approved (the step packet carries the context the governing entries cite), and plied available inside the session boxes, read-only
authority: user
scope: T065 T064
---
- **2026-11-06 ≈ 04:19 UTC — User: S001 approved (the step packet carries the context the governing entries cite), and plied available inside the session boxes, read-only.**
  - **The user's words:** on S001 (the L0003 researcher's suggestion, D315), "i like that suggestion"; then "also
    yeah, plied should be installed in the container" (the hand-off's doubt: "`plied` is not on PATH in this
    container").
  - **S001, as the lead builds it:** S001's change is prose ("include in the packet the key findings and the Part D
    design entries …, or raise the researcher's context budget"), so `approve` could not apply it as an exact edit, and
    `lab suggestions approve` is not built yet. The lead takes the first branch, made general rather than T064-only:
    the packet adds, under `context/`, the log entries and findings that the node and its governing entries cite (one
    hop), whole, hashed in the manifest, marked context and not governing, within a byte cap, sealed paths excluded.
    The budget stays as it is. S001 is marked approved with this entry once built (`lab suggestions show`, `approve`,
    `decline`, as DESIGN describes, are built with it).
  - **plied in the box, read-only:** the host's plied binary mounted read-only, behind a wrapper that runs only read
    subcommands; agents never write plied records (AGENTS.md *Who decides what*; the conductor writes through plied on
    the host). Inside the box it reads the workspace's records (the commit the workspace was made from); the packet's
    `plied-review.json` stays the current review. P199 (installs) does not apply: no new plied version.
  - **Sequencing:** the lab is paused at the next boundary, after L0004 and its review, so the box launcher is not
    changed under a running loop and the next T064 step gets the new packet.
