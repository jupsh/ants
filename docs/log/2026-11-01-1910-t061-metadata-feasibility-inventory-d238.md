---
id: D240
date: 2026-11-01
time: 19:10
kind: review
title: T061 metadata feasibility inventory (D238, D239; permitted metadata only): lights-on is 06 UTC for every colony with temperature switching with it, so clock and time since lights-on cannot be separated; PreTreatment files start 05:03-07:43 GMT (offsets up to 2.7 h) at 81-92 h since tracking began, the only independent variation and between colonies only; food is sugar water and water ad libitum with no feeding or replenishment times in the permitted metadata, so food-state variation is unknown; neither comparison has useful designed variation
---
- **2026-11-01 ≈ 19:10 UTC — T061 metadata feasibility inventory (D238, D239; permitted metadata only): lights-on is 06 UTC for every colony with temperature switching with it, so clock and time since lights-on cannot be separated; PreTreatment files start 05:03-07:43 GMT (offsets up to 2.7 h) at 81-92 h since tracking began, the only independent variation and between colonies only; food is sugar water and water ad libitum with no feeding or replenishment times in the permitted metadata, so food-state variation is unknown; neither comparison has useful designed variation.**
  - **What (D238, D239; P138, P141):** an inventory of already permitted metadata for two proposed comparisons, food
    state (H4) and clock versus elapsed time (H7, H8). Nothing was computed on tracks; no new file was downloaded or
    opened beyond those listed. The Stroeymeyt supplement was not reopened: lighting and feeding come from the
    lead's notes of its Materials and Methods, read 2026-10-10 (`docs/archive/STATUS-2026-10-10-to-15.md`, "Stroeymeyt
    2018 methods read"; X015).
  - **Sources read (fit colonies only):** `data/stroeymeyt2018/README.txt` (the Zenodo README); `original_data/info.txt`
    and `info_dat.txt`; the 22 `time_aggregation_info/*_PreTreatment.txt` files (Unix and GMT times of the 3-h bins,
    hours since tracking began); the file listing of `original_data/`.
  - **Inventory:**

    | Item | Source | Status | What it shows |
    |---|---|---|---|
    | Lights-on and lights-off | methods notes (archive) | available | 12 h light at 26 °C, 06–18 UTC; 12 h dark at 22 °C; the same for every colony. The nest is under an IR-pass filter, dark to the ants; light reaches the foraging area. |
    | Lighting changes within the light phase | — | unknown | none recorded in the permitted metadata |
    | Temperature | methods notes | available (nominal) | switches with the light (26 / 22 °C); no logged temperature |
    | PreTreatment file start | `info_dat.txt`, `time_aggregation_info` | available | 05:02:53–07:42:42 GMT across the 22 colonies (11 start before lights-on, 11 after) |
    | Time since tracking began | `time_aggregation_info` (`time_since_start`) | available | 81.1–92.3 h at the file start (median ≈ 85 h), fixed per colony |
    | Recording dates | `time_aggregation_info` | available | 2014-11-05 to 2015-01-21, pairs of colonies often on the same day |
    | Food | methods notes | available (nominal) | water and 10 % sugar water ad libitum (the only food the notes mention) |
    | Feeding or replenishment times | — | unknown | not in the README, `info.txt` or the methods notes |
    | Food-zone geometry | `plume_files` | available (not opened here) | nest, water and sugar zones per colony; would allow sugar-zone visits to be measured from the fit tracks, a behavioural proxy, not a food-state variable |
    | Box (experimental system) | `info.txt` | available | one box per colony |

  - **Can these support the comparisons?**
    - **Clock versus elapsed time (H7, H8):** lights-on is 06 UTC for all colonies, so within the light phase clock
      time and time since lights-on are the same variable, and no comparison can separate them. Time since the file
      began differs from clock time by a per-colony offset of at most 2.7 h, and time since tracking began by 81–92 h.
      Both vary between colonies only, are fixed within a colony, and are small against the 4-h blocks of F108. A
      between-colony comparison of 22 colonies on such offsets would be weak and confounded with colony; **no useful
      designed variation**. This bears on F108's open confound (P83): it stays unseparated in these data.
    - **Food state (H4):** feeding is ad libitum with no recorded feeding or replenishment times, so there is no
      designed variation in food state, and any incidental variation is **unknown**. A design would need either new
      data (item 1(d)) or a behavioural proxy from the fit tracks (sugar-zone visits), which is not a food-state
      variable and would be a new analysis needing its own design (P87).
    - **Not checked (access not authorised, P141):** the sample images (one per hour) and anything in the supplement
      beyond the methods already read; the authors' code repository.
  - **For the user:** whether to commission either design given this; the lead does not recommend a design for either on
    these data.
