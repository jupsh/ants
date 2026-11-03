---
id: P172
title: At each freeze, the frozen reader and its imports committed byte-identical under scripts/frozen/
wording: >-
  At each freeze, copy the frozen reader and every file it imports into a committed
  scripts/frozen/<name>/, byte-identical to the SHA-256 in the log.
made: D249
state: open
nodes: [T059, T060]
reviews:
  - action: run:h6-zoneflag-20261102
    disposition: not-triggered
    because: No freeze
    by: lead (session 0e89af04)
    at: "2026-11-02 15:30 UTC"
  - action: run:h6-v1v4-20261102
    disposition: not-triggered
    because: No freeze; the reader is copied under scripts/frozen/ at the freeze
    by: lead (session 0e89af04)
    at: "2026-11-02 15:30 UTC"
  - action: run:h6-blindcheck-20261102
    disposition: not-triggered
    because: No freeze
    by: lead (session 0e89af04)
    at: "2026-11-02 15:37 UTC"
  - action: run:h6-reach-20261102
    disposition: not-triggered
    because: No freeze
    by: lead (session 0e89af04)
    at: "2026-11-02 16:01 UTC"
  - action: run:h6-blindcheck2-20261102
    disposition: not-triggered
    because: No freeze
    by: lead (session 0e89af04)
    at: "2026-11-02 16:55 UTC"
  - action: commit:h6-freeze-20261102
    disposition: satisfied
    because: >-
      This commit adds scripts/frozen/h6/: the frozen reader and every file it imports (24 files),
      each byte-identical to the SHA-256 listed in D259, checked file by file
    by: lead (session eac59010)
    at: "2026-11-03 00:08 UTC"
    inputs:
      - record: D259
        rev: da68ade2ca9f550792fdbb88369ec191646cd6fef041de62b8c6cd7d508f05ef
---

## History
- 2026-11-02 15:27 UTC lead (session 0e89af04): created — D249: the user's rule for preserving frozen code
- 2026-11-02 15:30 UTC lead (session 0e89af04): review for run:h6-zoneflag-20261102: not-triggered — No freeze
- 2026-11-02 15:30 UTC lead (session 0e89af04): review for run:h6-v1v4-20261102: not-triggered — No freeze; the reader is copied under scripts/frozen/ at the freeze
- 2026-11-02 15:37 UTC lead (session 0e89af04): review for run:h6-blindcheck-20261102: not-triggered — No freeze
- 2026-11-02 15:40 UTC lead (session 0e89af04): reviewed D251@cf9244d69620; D251 cites D249 only for the blind-check cutoff; the freeze (and so this copy) waits on Q34; unchanged
- 2026-11-02 15:59 UTC lead (session 0e89af04): reviewed D252@cdcd4ef34d7e; D252 cites D249 only for the cutoff; the freeze's frozen copy will include the reachability extractor; unchanged
- 2026-11-02 16:01 UTC lead (session 0e89af04): review for run:h6-reach-20261102: not-triggered — No freeze
- 2026-11-02 16:55 UTC lead (session 0e89af04): review for run:h6-blindcheck2-20261102: not-triggered — No freeze
- 2026-11-02 16:57 UTC lead (session 0e89af04): reviewed D256@18f3534436d2; D256 cites D249 only for the cutoff; the extractor to copy at the freeze is h6-next's (reachability)
- 2026-11-02 22:01 UTC lead (session eac59010): reviewed D257@0a64c040066c; D257 read: names the files to freeze (reader.ts 3c3985c0, extract.ts ea889e9d) under scripts/frozen/; no freeze yet, stays open
- 2026-11-03 00:08 UTC lead (session eac59010): reviewed D258@81f3dbbbcece; Reviewed D258: the H6 freeze follows this commitment (D259, 24 files byte-identical under scripts/frozen/h6/, hashes in the log); it stays open for later freezes (T060)
- 2026-11-03 00:08 UTC lead (session eac59010): review for commit:h6-freeze-20261102: satisfied — This commit adds scripts/frozen/h6/: the frozen reader and every file it imports (24 files), each byte-identical to the SHA-256 listed in D259, checked file by file
