---
id: P63
title: "Part D capability: member cap outputs sealed until c is frozen"
wording: logs/partd2/cap/ and the pd-cap- outputs of the members sealed until c is frozen
made: D176
state: fulfilled
nodes: [T033]
resolved_by: D197
reviews:
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      The capability output paths listed in D179 were added to .claude/sealed-paths.txt before
      rental; checks during the run are counts only.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: >-
      Capability output paths sealed locally before launch (D179); on the box only counts and file
      times are checked.
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: Carried outputs move by script (fetch, push), md5-checked, never opened; sealed paths unchanged.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: satisfied
    because: Member capability outputs stay sealed; logs/ is git-ignored, so none is committed.
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: satisfied
    because: Outputs go to logs/partd2/cap/s2 and s3, both sealed; the lead checks only counts until c is frozen.
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: satisfied
    because: The 2b reader reads no capability output; those stay sealed.
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
  - action: run:partdcap-nulls
    disposition: satisfied
    because: >-
      nulls reads only the base pool (D176: 'The base pool is read for the freeze'); member pd-cap-
      outputs stay sealed and unopened, and the sealed-paths lines stay until c is frozen
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:36 UTC"
    inputs:
      - record: D176
        rev: 1a0a604d94312ce0b943f54a70dff070a96bb5b490e6fe2f4ec5f8ae18b71d96
  - action: run:partdcap-same
    disposition: satisfied
    because: >-
      c is frozen (D196), so the seal's condition is met; the member outputs are unsealed for this
      check on the user's word (D197)
    by: lead (session 9d2b15e6)
    at: "2026-10-30 17:48 UTC"
    inputs:
      - record: D196
        rev: e67ec9a3bd52e5eeb41bfcccda9d7a2a85443a1237617457d9c19481031db034
      - record: D197
        rev: b80fed2f6a3a83d6d30dafdd1f6007b7304b1610817dc6abe029073ca9bbafe1
---

## History
- 2026-10-29 05:26 UTC lead (session 20261029): created — D176: the members' capability outputs stay unread until the null threshold is frozen (P59's order, on trust beyond the code)
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: sealing of member cap outputs until c is frozen is unchanged. Open.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: the sealing of member cap outputs until c is frozen is unchanged; it will be applied when the runs start. Open.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — The capability output paths listed in D179 were added to .claude/sealed-paths.txt before rental; checks during the run are counts only.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — Capability output paths sealed locally before launch (D179); on the box only counts and file times are checked.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Carried outputs move by script (fetch, push), md5-checked, never opened; sealed paths unchanged.
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: satisfied — Member capability outputs stay sealed; logs/ is git-ignored, so none is committed.
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: satisfied — Outputs go to logs/partd2/cap/s2 and s3, both sealed; the lead checks only counts until c is frozen.
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: satisfied — The 2b reader reads no capability output; those stay sealed.
- 2026-10-30 05:36 UTC lead (session 9d2b15e6): reviewed D194: D194 states the capability outputs stay sealed and were not opened; the seal on logs/partd2/cap/ and pd-cap- remains in .claude/sealed-paths.txt. capfiles writes them now; still sealed until c is frozen. Open.
- 2026-10-30 17:36 UTC lead (session 9d2b15e6): review for run:partdcap-nulls: satisfied — nulls reads only the base pool (D176: 'The base pool is read for the freeze'); member pd-cap- outputs stay sealed and unopened, and the sealed-paths lines stay until c is frozen
- 2026-10-30 17:42 UTC lead (session 9d2b15e6): reviewed D196: c is frozen, so P63's condition is met, but the lead keeps the member outputs sealed (and the sealed-paths lines in place) until the user says to start the same-member check, given D196's S3₂ location point. Open until unsealed.
- 2026-10-30 17:48 UTC lead (session 9d2b15e6): review for run:partdcap-same: satisfied — c is frozen (D196), so the seal's condition is met; the member outputs are unsealed for this check on the user's word (D197)
- 2026-10-30 17:48 UTC lead (session 9d2b15e6): set state=fulfilled; set resolved_by=D197 — Member capability outputs stayed sealed until c was frozen (D196); unsealed for the same-member check on the user's word (D197); sealed-paths lines removed 17:48 UTC
- 2026-10-30 17:50 UTC lead (session 9d2b15e6): reviewed D198: it reports the unsealing at 17:48 UTC after c was frozen, which is what fulfilled P63 (D197); nothing reopens it. Stays fulfilled.
