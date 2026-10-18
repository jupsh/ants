---
id: D006
date: 2026-10-17
time: 13:53
kind: design
title: Test B recheck, design logged before building (user guidance, pasted, adopted)
---
**2026-10-17 ≈ 13:53 UTC — Test B recheck, design logged before building
(user guidance, pasted, adopted).** Name for now: **contact-associated
activation** (the tracks cannot yet separate behavioural activation from
pushing or tracking errors during overlap). Test A: little evidence for an
ordered travelling wave, especially after usual timing; its weakness does
not weigh heavily against local spread (no positive control at 2 fps).
`scratch/contactOnset.ts` (one code path, data and simulated observers;
4.1 / 5.1 mm hysteresis as before; moving = step ≥ 0.6 mm/frame between
consecutive detections).
- **Stricter definitions:** focal track uninterrupted (detected and in
  the nest every frame of the window); onset = first moving step after
  ≥ 20 consecutive still steps, **sustained** = it starts a run of ≥ M
  consecutive moving steps (primary M = 2, i.e. ≥ 1 s, which removes
  one-frame displacements; sensitivity M = 1 as before and M = 4); the
  outcome window starts on the frame **after** the contact crossing (f+1
  … f+4).
- **(1) Risk ratio and absolute increase:** units = ant-frames with the
  focal still for frames f−19 … f and detected through f+4+M; exposed if
  a moving partner (partner detected at f−1 and f) crosses into 4.1 mm at
  f; same 12 strata as before; Mantel–Haenszel risk ratio and risk
  difference, colony bootstrap.
- **(2) Time course before and after contact:** for each contact event
  with the focal still and detected for f−30 … f−11 and detected through
  f+10+M, the hazard of a first sustained onset at offsets −10 … +10
  frames; an elevation before 0 means movement already beginning before
  contact.
- **(3) Close passes:** a moving partner crossing into 7 mm (hysteresis 8
  mm) with the pair never within 4.1 mm from f−4 to f+4; same time course
  and risk; contact vs close pass separates the contact threshold from
  general nearby motion.
- **(4) Share of onsets:** fraction of all sustained onsets (eligible
  units) preceded by such a contact within 4 frames, and the excess
  share exposed × (1 − 1/RR).
- **(5) Direction, supporting only:** cosine between the focal's first
  sustained displacement and the partner's motion at contact (contacts
  and close passes); not a discriminator on its own.
- **Reading, fixed now:** contact-associated activation **survives** if
  the M = 2 risk ratio CI stays above 1 in both phases, the time course
  shows no elevation before contact comparable to the one after
  (pre-contact offsets −4 … −1 below half the excess at +1 … +4), and
  contacts exceed close passes (risk ratio of contact vs close-pass
  events, CI above 1). It is **reduced to mechanical / tracking** if the
  risk ratio falls to ≈ 1 (CI including 1) once M = 2 and the
  uninterrupted-track rule apply. Mixed outcomes reported as such. The
  absolute increase and the share of onsets decide how much of the
  colony's synchrony it could carry, reported regardless. Model control
  (start point, light and dark, 12 h) through the same code on the box
  after L and O. **Then** decide whether a contact-based activation arm
  is warranted, judged on synchrony, onset timing and contacts together.
