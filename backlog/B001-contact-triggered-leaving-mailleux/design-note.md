# B001 design note — a contact-triggered leaving rule (for the user's decision; nothing implemented)

## Why a new rule, in one paragraph
Raising `leaveCropFrac` (B001 sweep, `results/sweep.json`) lifts
after-trophallaxis leaving only from 6–7 % to a saturated 13–19 %, against
44/56/86 % in Mailleux 1999 Table 2b, with no rise over starvation; and
leaving after other contacts stays at 26–39 % against 69–93 %, untouched
by the constant because those nestmates received no food. The missing
piece is therefore not only the crop gate on receivers: in the data a
contact itself — trophallactic or not — makes a nestmate likely to leave
within minutes, more so the hungrier the colony. That is gap G3.

## The rule (smallest form)
A nestmate that has a qualifying contact enters an *excited* state for a
window `W`; while excited and in the nest it leaves at an added hazard
`contactLeaveRate` (on top of, not instead of, the existing hungry-leave
hazard), then heads for the entrance by the existing `leave` mode /
`leaveGain` steering. No new mode and no runner change: `toLeave(m)` is
reused, exactly as `returning()` and the `outRate` path already do.

## What it may read (perception boundary)
Only existing percepts, interoception and mind — no world access:
- Trigger, trophallactic: own `io.mouthFlow > 0` during a bout, or a bout
  with `c.sharingWithMe` (both already sensed in `lasiusNestWorker.ts`).
- Trigger, other contact: an antennal-contact episode reaching the
  existing encounter machinery (`meet()`, `encounterMin`), with the
  partner `offering` or not — two trigger strengths if the data ordering
  (other > trophallactic) must be matched by the trigger rather than by
  the crop gate below.
- State: one timer in `Mind`/`Stay` (e.g. `stay.excited` seconds left),
  set on the trigger, decremented by `per.dt`; drawn/advanced only when
  the switch is on, so off is bit-identical.
- Modulators (own body only): `io.reserve` (hunger — the starvation rise
  in Table 2b would come from colony-level reserve, already set by the
  starvation protocol, if the hazard or the gate scales with deficit) and
  `io.cropUl` (a receiver that just filled its crop leaves less readily:
  keep the existing `leaveCropFrac` gate for the *spontaneous* hazard but
  let the excited hazard pass it, scaled down by crop fill — this is
  what can keep trophallactic < other while both stay high).

## Parameters and provenance (all `estimated`, none measured)
| Parameter | Meaning | Starting guess / source |
|---|---|---|
| `contactLeaveRate` | added leaving hazard while excited (1/s) | ≈ 1/300–1/150 s⁻¹: Table 2b's 5-min window and 44–93 % leaving imply a hazard of that order; to be set in step 5, never fitted to Table 2b (development) |
| `contactLeaveWindow` | excitement duration `W` (s) | 300 s, the Table 2b window itself (an upper bound, not a measurement) |
| `contactLeaveTrophFrac` | excited-hazard scale after trophallaxis vs other contact (dimensionless) | < 1; start 0.5 (data ratios ≈ 0.6–0.9, confounded with the crop gate) |

All three behind one switch, off by default and bit-identical when off,
with tests per AGENTS.md § Conventions. Any adoption, and whether these
join the step-5 free set (fitted on Table 2a only, judged on the frozen
rule), is the user's decision before the step-5 structure freeze.

## What it would change, and risks
- Table 2b (development, reported only): after-contact leaving up by
  construction; the test is the *pattern* — trophallactic < other, both
  rising with starvation — not the levels it was designed from.
- Table 2a (fit): recruiter rows can move (the B001 sweep saw
  nestmate-side changes shift recruiter `timeInNest`/`trophTotal` by up
  to 9 SE_data at extreme `leaveCropFrac`); the step-5 refit must
  re-check the 1 SE_data-scale guard, and nestmates leaving en masse
  would drain the nest (density is a fixed set-up count, so leavers must
  be handled as the current `leave` path handles them).
- E6 shares the nest policy: the same switch would act there; E6's
  `leaveCropFrac` sensitivity stays Plan step 9, out of scope here.
- Caveat carried from B001: all of this is measured at the pilot nest
  motion, which step 5 replaces; rerun the sweep's baseline row once the
  step-5 motion is in before fixing any parameter value.
