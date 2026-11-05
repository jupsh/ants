---
id: D283
date: 2026-11-05
time: 06:15
kind: correction
title: Correction: ants-lab stage 1a's quote matching (src/quote.ts) differs from plied 0.14.1's textmatch in five ways, so the conductor could accept a quote plied rejects or refuse one it accepts; found by the lead's check of the report, fixed by the same implementer
---
- **2026-11-05 ≈ 06:15 UTC — Correction: ants-lab stage 1a's quote matching (src/quote.ts) differs from plied 0.14.1's textmatch in five ways, so the conductor could accept a quote plied rejects or refuse one it accepts; found by the lead's check of the report, fixed by the same implementer.**
  - **Found:** while checking the implementer's stage-1a report (`logs/handoff/20261105-0535-lab-1a/report.md`; the
    report itself flagged the hyphen rule as unconfirmed), the lead compared `~/repos/ants-lab/src/quote.ts` with the
    installed plied's own source (`~/.cargo/registry/src/…/plied-0.14.1/src/textmatch.rs`). The local
    `~/repos/plied` checkout is at 0.6.0, older than the installed binary.
  - **The five differences:**
    - **NFKC:** plied applies it, and maps no-break spaces to spaces. The lab did neither.
    - **Hyphenation:** plied joins a line-end hyphenation and drops the hyphen (`(\w)-\n\s*(\w)` → `$1$2`). The
      lab kept the hyphen.
    - **Blockquotes:** plied strips a prefix only after at most three leading spaces (`^ {0,3}(?:>[ \t]?)+`). The
      lab stripped after any indent, so the 4-space-indented `>` of a nested list stayed in plied's text but not in
      the lab's.
    - **Curly quotes:** plied straightens only ‘ ’ “ ”. The lab also changed ‚ ‛ „ ‟.
    - **Ellipsis:** plied splits a quote on `…` or `...` with any surrounding space, after NFKC. The lab required
      spaces around `…`.
  - **The lead's test** (scratch script on the built code), each returned `false` where plied returns `true`:
    "in the fed condition" against "fed condi-\ntion"; a ligature `ﬁ`; "alpha…delta"; and a 4-space blockquote
    kept inline.
  - **Not affected:** the other adversarial checks passed. Data-role classification held against path tricks (`..`,
    `./`, absolute paths): held-out, unused and off-allowlist inputs were all caught. The forbidden-model match
    caught every spelling tried. Unknown or case-changed kinds route to the user.
  - **Fix:** an exact port of plied 0.14.1's `normalise`, `quote_parts` and `find_quote`, with plied's own test
    vectors, by the same implementer (HANDOFF.md, follow-up on the same brief). Also fixed: the step schema now
    carries `second_implementation`, `preregistration` and `action` (lead's file; the implementer had patched them
    in memory). Nothing used the defective function yet: no lab step has run.
