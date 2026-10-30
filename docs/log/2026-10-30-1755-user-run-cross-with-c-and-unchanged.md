---
id: D199
date: 2026-10-30
time: 17:55
kind: decision
title: User: run cross with c and α unchanged; report f as 7.4 % pooled, 20 % within T and 3.8 % within D together, as dependent, imprecise rates; the excess's cause is unresolved (M² already uses each dataset's covariance); a pass is described as meeting the frozen separation criterion on these 22 colony set-ups with uneven observed false-positive rates
authority: user
scope: T033 P59 P44
---
- **2026-10-30 ≈ 17:55 UTC — User: run cross with c and α unchanged; report f as 7.4 % pooled, 20 % within T and 3.8 % within D together, as dependent, imprecise rates; the excess's cause is unresolved (M² already uses each dataset's covariance); a pass is described as meeting the frozen separation criterion on these 22 colony set-ups with uneven observed false-positive rates.**
  - **User (in conversation, verbatim):**
    > I recommend **running `cross` with c and α unchanged**. The prespecified same-member gate passed; completing the
    > comparison remains useful.
    >
    > The T concentration is a substantive limitation. Report **7.4 % pooled, 20 % within T and 3.8 % within D
    > together**. The pooled rate averages over seven D members and two T members, so it cannot establish error control
    > for every member. The dependent comparisons also prevent treating those percentages as precise, independently
    > estimated rates.
    >
    > One refinement to the proposed explanation: M² already uses each dataset's estimated covariance. Greater T
    > variability alone should therefore be accommodated if that covariance estimate works well. The observed excess
    > could involve covariance estimation, distribution shape or a few unusual datasets; its cause remains unresolved.
    >
    > If `cross` passes, describe it as **meeting the frozen separation criterion on these 22 colony setups, with uneven
    > observed false-positive rates**. It would not establish a uniformly calibrated diagnostic or identify the
    > biological mechanism, especially while joint reproduction remains unestablished.
  - **Effect:**
    - `partDCap.ts cross` runs, gated `run:partdcap-cross`, with c = 9.2824 and α = 0.025/3 (D196).
    - Every report of f gives the three rates together (7.4 % pooled, 20 % within T, 3.8 % within D) as dependent,
      imprecise estimates. The pooled rate does not establish error control for every member.
    - D198's suggested explanation is corrected in place (dated): the cause of the T excess is unresolved.
    - If `cross` passes, the wording is the user's: it meets the frozen separation criterion on these 22 colony set-ups,
      with uneven observed false-positive rates. It establishes neither a uniformly calibrated diagnostic nor the
      biological mechanism, and joint reproduction remains unestablished (F103).
