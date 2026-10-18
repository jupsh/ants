---
id: D061
date: 2026-10-18
time: 16:16
kind: run
title: Tools for scanned papers (user request): OCR in `paperText.ts`, page images in `paperPage.ts`
---
- **2026-10-18 ≈ 16:16 UTC — Tools for scanned papers (user request): OCR in `paperText.ts`, page images in
  `paperPage.ts`.** No model, fit or data change.
  - **`scripts/paperText.ts`** now OCRs pages without a text layer (< 50 non-space characters) with tesseract.js
    7.0.0 (new dev dependency; WASM, no system install; English + French + German models downloaded once to
    `.cache/tessdata`, rendered at 300 dpi). Each OCR'd page starts with an `[OCR …]` line: mean word confidence,
    the command for the page image, and the numbers read below 75 % confidence with their height on the page.
    Figures and tables come out garbled; read them from the image. The stamp records the OCR set-up, so a new OCR
    version re-extracts. Directories without a `.sha256` stamp (e.g. a hand transcription) are never touched.
  - **`scripts/paperPage.ts <Paper> <page|a-b> [--crop x0,y0,x1,y1] [--dpi n]`** renders cleared pages (bytes
    checked) to `.cache/paper-img/<Paper>/` for reading scans, tables and figures; the crop is in page fractions.
    Shared code in `scripts/paperLib.ts`.
  - **Lenoir & Ataya 1983 now has page text:** 20 pages OCR'd, mean confidence 90 % (75–94 %; the low pages are the
    figure pages 6, 9, 10, 12–14). Body text checked against the images on pp. 6 and 10: near-exact, decimal
    commas kept. Other papers unchanged (stamps match). Seen while testing: pp. 1, 6 and 10 of this cleared
    development paper only.
