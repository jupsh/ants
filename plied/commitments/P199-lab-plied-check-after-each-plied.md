---
id: P199
title: "Lab: plied check after each plied install; new errors roll back and go to the user"
wording: >-
  after each local install the lab runs plied check here; new errors roll the install back to the
  previous version and go to the user.
made: D277
state: open
nodes: [T065]
reviews:
  - action: run:lab-1a
    disposition: not-applicable
    because: >-
      run:lab-1a installs no plied version (the brief forbids touching ~/repos/plied or the
      installed binary)
    by: lead (session 48c74063)
    at: "2026-11-05 05:35 UTC"
    inputs:
      - record: D277
        rev: 4b7df37ecf52dd226b9df30ad81579101ed78f1e88042b334a34b2369b0b025b
  - action: run:lab-1a
    disposition: not-applicable
    because: >-
      re-read D277 and D278: run:lab-1a installs no plied version; the brief forbids touching
      ~/repos/plied or the installed binary
    by: lead (session 48c74063)
    at: "2026-11-05 05:38 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
      - record: D278
        rev: 07ac35c141c54e21cf726150cd9670f0669f481aa8d4b15b10dbc1ceed4c153c
  - action: commit:lab-records-20261105
    disposition: not-applicable
    because: no plied version is installed or changed by this commit
    by: lead (session 48c74063)
    at: "2026-11-05 06:00 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-1b
    disposition: not-applicable
    because: >-
      run:lab-1b installs no plied version; the brief forbids touching ~/repos/plied or the
      installed binary
    by: lead (session 48c74063)
    at: "2026-11-05 06:21 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-1b-fix
    disposition: not-applicable
    because: >-
      run:lab-1b-fix installs no plied version and runs no plied check rollback; the lab's code is
      built and tested only
    by: lead (session 48c74063)
    at: "2026-11-05 07:02 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: commit:lab-1b-records-20261105
    disposition: not-applicable
    because: >-
      no plied version is installed or changed by this commit; ~/repos/plied and the installed
      binary are untouched
    by: lead (session 772be7be)
    at: "2026-11-05 16:54 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-1c
    disposition: not-applicable
    because: >-
      run:lab-1c installs no plied version; the brief forbids touching ~/repos/plied or the
      installed binary
    by: lead (session 772be7be)
    at: "2026-11-05 16:58 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-1c-fix
    disposition: not-applicable
    because: run:lab-1c-fix installs no plied version; ~/repos/plied and the installed binary are untouched
    by: lead (session 772be7be)
    at: "2026-11-05 17:35 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-1c-fix2
    disposition: not-applicable
    because: run:lab-1c-fix2 installs no plied version
    by: lead (session 772be7be)
    at: "2026-11-05 17:52 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-1c-fix3
    disposition: not-applicable
    because: No plied install happens in this follow-up; it changes only the lab's box and adapter code (D291).
    by: lead (session 772be7be)
    at: "2026-11-05 18:02 UTC"
    inputs:
      - record: D291
        rev: 02d5b0a9caebf920b2e88f39a4a6e4135782d1bacd48b9fe106ded757faf9540
  - action: run:lab-1c-fix4
    disposition: not-applicable
    because: No plied install; lab box code only (D293).
    by: lead (session 772be7be)
    at: "2026-11-05 21:04 UTC"
    inputs:
      - record: D293
        rev: 7917c299322726c9edfc56e548e73b04f6e2dc532b2faa47018c32f645789c47
  - action: run:lab-2a
    disposition: not-applicable
    because: No plied install; the plied install kinds are sent to the user as not yet supported in 2a (D296).
    by: lead (session 772be7be)
    at: "2026-11-05 21:12 UTC"
    inputs:
      - record: D296
        rev: 2a20f9f4f648c7594479973d065f00f070f3ccd680721a094a08087b152dbe21
  - action: run:lab-2a-fix1
    disposition: not-applicable
    because: No plied install; the plied install kinds stay asks marked not yet supported (D296, D297).
    by: lead (session 487510ed)
    at: "2026-11-05 22:08 UTC"
    inputs:
      - record: D297
        rev: e33106d3fa8a1ce0ec2ef77bd17ba08a7e90249beb7a1bc132f03286eca52074
  - action: run:lab-2b
    disposition: not-applicable
    because: No plied install in 2b; the install kinds stay asks marked not yet supported (D296, D300).
    by: lead (session 487510ed)
    at: "2026-11-05 22:21 UTC"
    inputs:
      - record: D300
        rev: d6bfb7a6d85a1d5d13f80c010edaef17ffa9baa09cbab4b1363cf46fd2e17b42
  - action: run:lab-2c-prep
    disposition: not-applicable
    because: No plied install in this stage (D302 brief scope).
    by: lead (session 487510ed)
    at: "2026-11-05 23:13 UTC"
    inputs:
      - record: D302
        rev: 1aa559d7d917b1cf8363c627e9d718523699029d78f5d986a21cc2030e69f532
  - action: run:lab-2c-prep-fix1
    disposition: not-applicable
    because: No plied install (D303 follow-up scope).
    by: lead (session 487510ed)
    at: "2026-11-05 23:39 UTC"
    inputs:
      - record: D303
        rev: af28df3b4f7690c8904db184752b48575e8828b31cff3c10a1ff8a4a80e447d1
  - action: run:lab-probe-flag
    disposition: not-applicable
    because: no plied install in this build
    by: lead (session 487510ed)
    at: "2026-11-06 02:59 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-probe-1
    disposition: not-applicable
    because: no plied install
    by: lead (session 487510ed)
    at: "2026-11-06 03:04 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-test-fixture
    disposition: not-applicable
    because: no plied install
    by: lead (session 487510ed)
    at: "2026-11-06 03:11 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-ui
    disposition: not-applicable
    because: no plied install; the page runs plied read commands only
    by: lead (session 487510ed)
    at: "2026-11-06 03:17 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-session-errors
    disposition: not-applicable
    because: no plied install
    by: lead (session 487510ed)
    at: "2026-11-06 03:30 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-claude-schema
    disposition: not-applicable
    because: no plied install
    by: lead (session 487510ed)
    at: "2026-11-06 03:38 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-packet-plied
    disposition: not-applicable
    because: >-
      no plied install or version change: the host's existing plied 0.14.1 binary is mounted
      read-only into the box
    by: lead (session 487510ed)
    at: "2026-11-06 04:19 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-rehearsal
    disposition: not-applicable
    because: no plied install or version change
    by: lead (session 487510ed)
    at: "2026-11-06 04:26 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: run:lab-codex-plied
    disposition: not-applicable
    because: >-
      no plied install: the wrapper hands the existing binary a tmpfs config; the plied version is
      unchanged
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:17 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
  - action: commit:partd-backfill-records-20261107
    disposition: not-applicable
    because: no plied install; plied.toml gains only the lab actor (D302)
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:33 UTC"
    inputs:
      - record: D277
        rev: 11d2ab364d49247eb1bdc2a64a20b5c5ff62712e457b945ca9405d43aebb26bf
      - record: D325
        rev: 7326260db82fda4cc885860de4618ee923614d23b6c81f286bed853e1ff5aaa9
  - action: merge:browser-sim-m1@78765aa
    disposition: not-triggered
    because: >-
      A fast-forward of main (f8d29d5) to browser-sim-m1 (78765aa), pushed with the user's
      instruction (D326): five commits already on the branch, each gated when made
      (commit:q38-records-20261105 ... commit:partd-backfill-records-20261107). They hold records
      and byte-identical copies of frozen Part D readers; no src/, public/, fit or data change, so
      the published pages are unchanged. No freeze, model change, run, held-out use or new reading
      is in it.
    by: lead (session 9871fd6b)
    at: "2026-11-07 05:44 UTC"
    inputs:
      - record: D326
        rev: 4af08c5fa754c9b883af7b755d3b50d8b0f284acdc6fa13039d238587d0e1a6b
---

## History
- 2026-11-05 05:34 UTC lead (session 48c74063): created — D277 amendment 1: guard on installing a lab-made plied release
- 2026-11-05 05:35 UTC lead (session 48c74063): review for run:lab-1a: not-applicable — run:lab-1a installs no plied version (the brief forbids touching ~/repos/plied or the installed binary)
- 2026-11-05 05:38 UTC lead (session 48c74063): review for run:lab-1a: not-applicable — re-read D277 and D278: run:lab-1a installs no plied version; the brief forbids touching ~/repos/plied or the installed binary
- 2026-11-05 05:45 UTC lead (session 48c74063): reviewed D279@22eb7cdfc9f1; D279 read: nothing about plied installs; P199 unchanged.
- 2026-11-05 05:59 UTC lead (session 48c74063): reviewed D280@e1c4e6a09f8a; D280 read: nothing about plied installs; unchanged.
- 2026-11-05 06:00 UTC lead (session 48c74063): review for commit:lab-records-20261105: not-applicable — no plied version is installed or changed by this commit
- 2026-11-05 06:08 UTC lead (session 48c74063): reviewed D282@23fbdb91f91f; D282 read: nothing about plied installs; unchanged.
- 2026-11-05 06:21 UTC lead (session 48c74063): review for run:lab-1b: not-applicable — run:lab-1b installs no plied version; the brief forbids touching ~/repos/plied or the installed binary
- 2026-11-05 07:02 UTC lead (session 48c74063): review for run:lab-1b-fix: not-applicable — run:lab-1b-fix installs no plied version and runs no plied check rollback; the lab's code is built and tested only
- 2026-11-05 16:54 UTC lead (session 772be7be): review for commit:lab-1b-records-20261105: not-applicable — no plied version is installed or changed by this commit; ~/repos/plied and the installed binary are untouched
- 2026-11-05 16:58 UTC lead (session 772be7be): review for run:lab-1c: not-applicable — run:lab-1c installs no plied version; the brief forbids touching ~/repos/plied or the installed binary
- 2026-11-05 17:35 UTC lead (session 772be7be): review for run:lab-1c-fix: not-applicable — run:lab-1c-fix installs no plied version; ~/repos/plied and the installed binary are untouched
- 2026-11-05 17:52 UTC lead (session 772be7be): review for run:lab-1c-fix2: not-applicable — run:lab-1c-fix2 installs no plied version
- 2026-11-05 18:02 UTC lead (session 772be7be): review for run:lab-1c-fix3: not-applicable — No plied install happens in this follow-up; it changes only the lab's box and adapter code (D291).
- 2026-11-05 21:04 UTC lead (session 772be7be): review for run:lab-1c-fix4: not-applicable — No plied install; lab box code only (D293).
- 2026-11-05 21:12 UTC lead (session 772be7be): review for run:lab-2a: not-applicable — No plied install; the plied install kinds are sent to the user as not yet supported in 2a (D296).
- 2026-11-05 22:08 UTC lead (session 487510ed): review for run:lab-2a-fix1: not-applicable — No plied install; the plied install kinds stay asks marked not yet supported (D296, D297).
- 2026-11-05 22:21 UTC lead (session 487510ed): review for run:lab-2b: not-applicable — No plied install in 2b; the install kinds stay asks marked not yet supported (D296, D300).
- 2026-11-05 23:13 UTC lead (session 487510ed): review for run:lab-2c-prep: not-applicable — No plied install in this stage (D302 brief scope).
- 2026-11-05 23:39 UTC lead (session 487510ed): review for run:lab-2c-prep-fix1: not-applicable — No plied install (D303 follow-up scope).
- 2026-11-06 02:59 UTC lead (session 487510ed): review for run:lab-probe-flag: not-applicable — no plied install in this build
- 2026-11-06 03:04 UTC lead (session 487510ed): review for run:lab-probe-1: not-applicable — no plied install
- 2026-11-06 03:11 UTC lead (session 487510ed): review for run:lab-test-fixture: not-applicable — no plied install
- 2026-11-06 03:17 UTC lead (session 487510ed): review for run:lab-ui: not-applicable — no plied install; the page runs plied read commands only
- 2026-11-06 03:30 UTC lead (session 487510ed): review for run:lab-session-errors: not-applicable — no plied install
- 2026-11-06 03:38 UTC lead (session 487510ed): review for run:lab-claude-schema: not-applicable — no plied install
- 2026-11-06 04:19 UTC lead (session 487510ed): review for run:lab-packet-plied: not-applicable — no plied install or version change: the host's existing plied 0.14.1 binary is mounted read-only into the box
- 2026-11-06 04:26 UTC lead (session 487510ed): review for run:lab-rehearsal: not-applicable — no plied install or version change
- 2026-11-07 05:17 UTC lead (session 9871fd6b): review for run:lab-codex-plied: not-applicable — no plied install: the wrapper hands the existing binary a tmpfs config; the plied version is unchanged
- 2026-11-07 05:33 UTC lead (session 9871fd6b): review for commit:partd-backfill-records-20261107: not-applicable — no plied install; plied.toml gains only the lab actor (D302)
- 2026-11-07 05:44 UTC lead (session 9871fd6b): review for merge:browser-sim-m1@78765aa: not-triggered — A fast-forward of main (f8d29d5) to browser-sim-m1 (78765aa), pushed with the user's instruction (D326): five commits already on the branch, each gated when made (commit:q38-records-20261105 ... commit:partd-backfill-records-20261107). They hold records and byte-identical copies of frozen Part D readers; no src/, public/, fit or data change, so the published pages are unchanged. No freeze, model change, run, held-out use or new reading is in it.
