---
id: D172
date: 2026-10-26
time: 16:06
kind: decision
title: User approves renting offer 51326867 for Part D Stage 2a (64 vCPU EPYC 7B12, $0.159/h, 4.8-8.0 h, $0.77-1.27 estimated); Q20 answered
authority: user
scope: Q20 T033
---
- **2026-10-26 ≈ 16:06 UTC — User approves renting offer 51326867 for Part D Stage 2a (64 vCPU EPYC 7B12, $0.159/h, 4.8-8.0 h, $0.77-1.27 estimated); Q20 answered.**
  - **Offers** (`box.mjs offers --runs 2904 --run-s 285`, on-demand, 20 GB, 2026-10-26 ≈ 16:00 UTC): cheapest
    51326867, 64 vCPU AMD EPYC 7B12 (Zen 2, speed 0.70 guessed), 63 jobs, $0.159/h, 4.8–8.0 h, $0.77–1.27. It is the
    offer D171's rule picks (cheapest on-demand, ≥ 32 vCPU, upper estimate ≤ $3 and ≤ 12 h). The lead also showed
    51326865 (128 vCPU, same CPU, $0.312/h, 2.5–4.1 h, $0.79–1.28; a less certain speed if its vCPUs are SMT threads).
  - **User (in conversation, verbatim):** "yes", to the lead's question: "Approve renting **51326867** at $0.159/h
    (≈ $0.77–1.27, 4.8–8.0 h), or would you rather the 128-vCPU one?" The lead had said that if the offer is gone at
    rent time it comes back to the user rather than pick another.
  - **Scope:** this offer only, for Stage 2a only (2,904 runs; D169, D171 item 1). Launcher
    `scripts/scratch/box/run-partD2a.sh` (md5 `ed553b03…`; partD2.ts `aef9c7ea…`, tmpShortSim.ts `6c85d31c…`, C2 fit
    `bccbe886…`, all checked at this entry). Stop rule (docs/BOX.md): the first wave's expected time on this CPU, limit
    1.5 ×; hourly checks and `market`; `box.mjs finish` fetches `logs/partd2/` and the run files, then destroys the box.
    Stage 2b needs another approval.
- **2026-10-26 — Gate passed; rent failed, nothing billing.** `plied review T033 --action rent:partd2a-20261026-d172
  --gate` passed after fresh dispositions (D171's `rent:partd2a-20261026` ones stand as reviews only). `logs/box.env`
  still named the user's hand-rented box 57762044 (offer 57614771, EPYC 7742, rented 2026-10-26 ≈ 03:59 UTC); vast.ai
  reported it gone, `vastai show instances` listed none, and no Stage 2a outputs or runs exist locally, so the file was
  moved to `logs/box.env.57762044.destroyed`. `box.mjs rent 51326867` then created instance 57838931, which could not
  start ("GPU error, unable to start instance"); the tool destroyed it, and `vastai show instances` lists none. The
  offer is still listed but did not start. As said at approval, no other offer is taken without the user.
- **2026-10-26 — User approves offer 56637446 in its place.** User (in conversation, verbatim): "yes", to the lead's
  question: "Shall I rent **56637446** (≈ $1.03–1.66, 2.1–3.4 h)? If it fails to start too, I'll come back to you
  again." Offer (`box.mjs offers --runs 2904 --run-s 285`, refreshed after the failure): 56637446, 128 vCPU AMD Ryzen
  Threadripper PRO 5995WX (Zen 3, speed 0.85 guessed; 64 cores, so the vCPUs are SMT threads and the guess may be
  optimistic), 127 jobs, $0.486/h, Quebec, 2.1–3.4 h, $1.03–1.66; within D171 item 2's cap. Same scope, launcher and
  stop rule as above.
- **2026-10-26 ≈ 16:17 UTC — Rented and launched.** Instance 57839805 (offer 56637446) rented ≈ 16:15 UTC; `box.mjs
  setup`: Node 22.22.1, `npm ci` ok, checksums match (283 files), quota 122.9 → 121 jobs, 118 GB free; the box has no
  smoke outputs (its `logs/` held only `notify.env`). Gate `run:partd2a` on T033 passed locally (plied is not on the
  box, so `run.sh` ran without `--node`); run `partd2a-20261026T161637Z` (`run-partD2a.sh auto`), 121 sims running at
  launch. Auto-finish `partd2a-finish-20261026T161644Z` fetches `logs/partd2` and `logs/short`, then destroys the box.
  `market --jobs 121`: stay (≈ 2.3 h, ≈ $1.13 left). `logs/box.env` given `BOX_JOBS=121` by hand (only `bench` writes
  it).
  - **Stop rule:** first wave = the first 121 runs. Expected on this CPU: slowest base colony ≈ 347 reference s × the
    slowest arm 1.66 ÷ speed 0.85 ≈ 680 s (D169); limit 1.5 × ≈ 17 min, i.e. 121 Stage 2a outputs by ≈ 16:34 UTC, else
    stop and report to the user.
- **2026-10-26 ≈ 16:34 UTC — Stop rule passed; pace slower than guessed.** 176 Stage 2a outputs by 16:34:10 (limit
  121). `box.mjs pace` (file times only), 10-min window: 134 outputs → ≈ 804 per h at 121 jobs, ≈ 542 s per run (the
  window overlaps the first wave, so provisional). At that pace the 2,904 runs take ≈ 3.6 h in all, ending ≈ 20:00 UTC,
  ≈ $1.85 with set-up: above the approved estimate's upper end ($1.66) by ≈ $0.2, within D171's cap ($3, 12 h). The
  guessed speed 0.85 looks optimistic for 121 jobs on 64 SMT cores, as noted at approval. Reported to the user; the
  run continues meanwhile.
- **2026-10-26 ≈ 20:10 UTC — Run ended, outputs fetched, box destroyed.** `partd2a-20261026T161637Z` exit 0 after 3 h 42
  min (`logs/partd2/status`: calib start 16:16:38, calib done 19:58:57). The auto-finish fetched 5,841 files (383.3 MB
  compressed, md5-checked) and destroyed instance 57839805 after **3.76 h, ≈ $1.82** (approved estimate $1.03–1.66;
  within D171's cap). `vastai show instances`: none. Local counts only: 2,904 `pd-` outputs in `logs/short`, 11 member
  calibration files and 2,904 run logs in `logs/partd2`; `logs/partd2/md5.txt` matches this entry's hashes. Measured
  speed 0.51 (≈ 555 s per run at 121 jobs on 64 SMT cores) added to `scripts/boxCpus.json`.
  - **Seen before the reading (disclosed):** a check for errors, `grep -i 'error|fail' logs/partd2/calib.log`, printed
    two of its result lines in full: T10f's and T10m's evaluated grid values, selected strengths and verification
    distance, both ending "MISS (sufficiency failure on magnitude; ineligible)". Nothing else from the outputs was read.
    These are Stage 2a calibration results (development data, not held out), whose selection rule was frozen in
    D158/D159 and which the lead reads next anyway, so no selection or rule can respond to them; P29's rule is to be
    written after calibration by design. Disclosed here for the record.
