import { describe, expect, it } from 'vitest';
import { RNG } from '../src/sim/core/rng';
import { acrossColonies, colonyRows, InNestAccumulator, runSummary, STROEYMEYT_CFG, type AntRole } from '../src/sim/analysis/inNest';

/** Position of each ant at a frame, or null when not detected; inNest decided by y ≤ 40. */
type Script = (ant: number, frame: number) => [number, number] | null;

function feed(roles: AntRole[], frames: number, script: Script, utcHour: (f: number) => number = () => 12, cfg = STROEYMEYT_CFG) {
  const acc = new InNestAccumulator(roles, cfg);
  for (let f = 0; f < frames; f++) {
    const ids: number[] = [];
    const xs: number[] = [];
    const ys: number[] = [];
    const ins: boolean[] = [];
    roles.forEach((_, i) => {
      const p = script(i, f);
      if (!p) return;
      ids.push(i);
      xs.push(p[0]);
      ys.push(p[1]);
      ins.push(p[1] <= 40);
    });
    acc.frame(f, utcHour(f), ids.length, ids, xs, ys, ins);
  }
  return colonyRows(acc.result(), cfg);
}

describe('in-nest rows (Stroeymeyt 2018 definitions)', () => {
  it('a steady walker: speed is its speed and it is never still', () => {
    // 4 mm/s: 2 mm per 0.5 s frame, back and forth along x inside the nest.
    const r = feed(['forager'], 400, (_, f) => [10 + (f % 20 < 10 ? 2 * (f % 10) : 20 - 2 * (f % 10)), 20]);
    expect(r['speed.forager.light']).toBeCloseTo(4, 10);
    expect(r['still.forager.light']).toBe(0);
    expect(r['runMove.n.forager.light']).toBe(0); // one unbounded run only
  });

  it('a still ant: zero speed and still fraction 1', () => {
    const r = feed(['nurse'], 100, () => [5, 5]);
    expect(r['speed.nurse.light']).toBe(0);
    expect(r['still.nurse.light']).toBe(1);
  });

  it('alternating still and moving runs: complete-run durations and survival', () => {
    // 10 frames still, then 4 frames moving at 2 mm/frame, repeated.
    let x = 0;
    const pos: number[] = [];
    for (let f = 0; f < 14 * 30; f++) {
      if (f % 14 >= 10) x += 2;
      pos.push(x);
    }
    const r = feed(['nurse'], pos.length, (_, f) => [pos[f], 10]);
    // Steps end at frames 1..; a step is moving if it ends in the moving phase.
    expect(r['runStill.mean.nurse.light']).toBeCloseTo(5, 10);
    expect(r['runMove.mean.nurse.light']).toBeCloseTo(2, 10);
    expect(r['runStill.median.nurse.light']).toBe(5);
    expect(r['runStill.P5.nurse.light']).toBe(1);
    expect(r['runStill.P10.nurse.light']).toBe(0);
    expect(r['runMove.P2.nurse.light']).toBe(1);
    expect(r['runMove.P5.nurse.light']).toBe(0);
    // First run (unbounded start) and last run (no end) are excluded.
    expect(r['runStill.n.nurse.light']).toBe(29);
    expect(r['runMove.n.nurse.light']).toBe(29);
  });

  it('bridges up to two missing frames and breaks on longer gaps', () => {
    // Walker at 2 mm/frame; every third frame missing: speed unchanged.
    const r1 = feed(['forager'], 300, (_, f) => (f % 3 === 2 ? null : [2 * f, 20]));
    expect(r1['speed.forager.light']).toBeCloseTo(4, 10);
    // Three missing frames in a row break the sequence: no steps across them.
    const r2 = feed(['nurse'], 10, (_, f) => (f >= 3 && f <= 5 ? null : [f < 3 ? 0 : 100, 20]));
    expect(r2['speed.nurse.light']).toBe(0); // the 100 mm jump is never a step
  });

  it('forager stays: entry to exit, path inside, debounce of single detections', () => {
    // Out for 10 frames (y = 60), in for 20 frames walking 1 mm/frame, repeated.
    // One stray out-of-nest detection in the middle of each stay.
    const script: Script = (_, f) => {
      const c = f % 30;
      if (c < 10) return [0, 60];
      if (c === 20) return [c - 10, 50];
      return [c - 10, 20];
    };
    const r = feed(['forager'], 30 * 10, script);
    // Debounce 2: the stray detection is ignored; 9 complete stays of 10 s.
    expect(r['stay.n.light']).toBe(9);
    expect(r['stay.mean.light']).toBeCloseTo(10, 10);
    expect(r['stay.median.light']).toBeCloseTo(10, 10);
    // In-nest steps: frames 10→19 (9 mm) and 21→29 (8 mm); 19→20→21 leave the nest.
    expect(r['stay.path.light']).toBeCloseTo(17, 10);
    // Debounce 1: each stay splits at the stray detection (the last cycle's
    // first half is complete, its second half is not).
    expect(r['stay@db1.n.light']).toBe(19);
    // Nurses never contribute stays.
    expect(feed(['nurse'], 300, script)['stay.n.light']).toBe(0);
  });

  it('moving-only speed leaves still steps out', () => {
    // Still 10 frames, then 4 frames at 2 mm/frame (4 mm/s), repeated.
    let x = 0;
    const pos: number[] = [];
    for (let f = 0; f < 14 * 30; f++) {
      if (f % 14 >= 10) x += 2;
      pos.push(x);
    }
    const r = feed(['nurse'], pos.length, (_, f) => [pos[f], 10]);
    expect(r['speedMove.nurse.light']).toBeCloseTo(4, 10);
    expect(r['speed.nurse.light']).toBeCloseTo((4 * 4) / 14, 1);
    expect(feed(['nurse'], 100, () => [5, 5])['speedMove.nurse.light']).toBeNaN();
  });

  it('short-stay speed: Σ path / Σ duration over stays up to the cut, missing below the minimum count', () => {
    // As the stays test: 9 complete stays of 10 s with 17 mm of path each.
    const script: Script = (_, f) => {
      const c = f % 30;
      if (c < 10) return [0, 60];
      if (c === 20) return [c - 10, 50];
      return [c - 10, 20];
    };
    const r = feed(['forager'], 300, script);
    expect(r['staySpeed.300.light']).toBeCloseTo(1.7, 10);
    expect(r['staySpeed.300.n.light']).toBe(9);
    expect(r['staySpeed.all.light']).toBeCloseTo(1.7, 10);
    // A cut below the stays' length: none qualify, so the speed is missing.
    const short = feed(['forager'], 300, script, () => 12, { ...STROEYMEYT_CFG, stayCutS: [5] });
    expect(short['staySpeed.5.n.light']).toBe(0);
    expect(short['staySpeed.5.light']).toBeNaN();
    // Fewer stays than the minimum count: missing too.
    const few = feed(['forager'], 300, script, () => 12, { ...STROEYMEYT_CFG, stayMinN: 10 });
    expect(few['staySpeed.300.light']).toBeNaN();
  });

  it('per-ant spreads over ants with enough in-nest time', () => {
    // 4000 frames = 2000 s: one still nurse, one walking at 4 mm/s; a third
    // nurse seen for 1000 s only is left out.
    const r = feed(['nurse', 'nurse', 'nurse'], 4000, (i, f) =>
      i === 0 ? [5, 5] : i === 1 ? [10 + (f % 20 < 10 ? 2 * (f % 10) : 20 - 2 * (f % 10)), 20] : f < 2000 ? [30, 30] : null,
    );
    expect(r['antN.nurse.light']).toBe(2);
    expect(r['antSd.still.nurse.light']).toBeCloseTo(Math.SQRT1_2, 10);
    expect(r['antSd.speed.nurse.light']).toBeCloseTo(4 * Math.SQRT1_2, 10);
    expect(r['antN.forager.light']).toBe(0);
    expect(r['antSd.still.forager.light']).toBeNaN();
  });

  it('noise floor: still ants under white noise walk at the floor speed', () => {
    const rng = new RNG(11);
    const r = feed(['nurse', 'nurse'], 20000, () => [10 + rng.normal(0, 0.05), 10 + rng.normal(0, 0.05)]);
    expect(r['noise.floorSpeed']).toBeCloseTo((0.05 * Math.sqrt(Math.PI)) / 0.5, 2);
    expect(r['speed.nurse.light'] / r['noise.floorSpeed']).toBeCloseTo(1, 1);
  });

  it('forager share in the nest by latest detection', () => {
    // Forager 1 inside all the time; forager 2 outside for the first 40 of 100 frames; a nurse is ignored.
    const r = feed(['forager', 'forager', 'nurse'], 100, (i, f) => (i === 1 && f < 40 ? [0, 60] : [5, 5]));
    expect(r['foragerIn.light']).toBeCloseTo((40 * 0.5 + 60 * 1) / 100, 10);
  });

  it('splits light and dark by UTC hour', () => {
    const r = feed(['nurse'], 200, (_, f) => [f < 100 ? 0 : f - 100, 10], (f) => (f < 100 ? 3 : 7));
    expect(r['still.nurse.dark']).toBe(1);
    expect(r['speed.nurse.light']).toBeCloseTo(99 / 50, 10);
  });

  it('density counts ants last seen in the nest within the hold window, queen included', () => {
    const roles: AntRole[] = ['queen', 'nurse', 'nurse', 'forager'];
    // Ant 3 stays outside; ant 2 is seen once at frame 0 and then lost.
    const r = feed(roles, 100, (i, f) => (i === 3 ? [0, 60] : i === 2 ? (f === 0 ? [0, 10] : null) : [0, 10]));
    const hold = STROEYMEYT_CFG.densityHold;
    expect(r['density.light']).toBeCloseTo((2 * 100 + hold + 1) / 100 / 28, 10);
  });

  it('recovers white tracking noise of still ants', () => {
    const rng = new RNG(7);
    const r = feed(['nurse', 'nurse'], 20000, () => [10 + rng.normal(0, 0.05), 10 + rng.normal(0, 0.08)]);
    expect(r['noise.x']).toBeCloseTo(0.05, 2);
    expect(r['noise.y']).toBeCloseTo(0.08, 2);
    expect(r['noise.white']).toBeCloseTo(1, 1);
  });

  it('merges agreeing repeated reads of a tag and drops disagreeing ones', () => {
    const acc = new InNestAccumulator(['nurse']);
    for (let f = 0; f < 100; f++) {
      // Every frame read twice at the same place (the tracker double-reports);
      // frame 50 also has a misread 30 mm away, so all its reads are dropped.
      if (f === 50) acc.frame(f, 12, 3, [0, 0, 0], [f, f + 0.05, 30], [10, 10, 10], [1, 1, 1]);
      else acc.frame(f, 12, 2, [0, 0], [f, f], [10, 10], [1, 1]);
    }
    expect(acc.duplicates).toEqual({ merged: 101, dropped: 1 }); // 99 + 2 extra reads; one tag-frame dropped
    const r = colonyRows(acc.result());
    expect(r['speed.nurse.light']).toBeCloseTo(2, 10); // 1 mm per frame; frame 50 bridged
    expect(r['detection']).toBeCloseTo(0.99, 10);
    expect(r['runMove.mean.nurse.light']).toBeNaN(); // one unbounded run, nothing complete
  });

  it('detection rate from first to last detection', () => {
    const r = feed(['nurse'], 1000, (_, f) => (f % 10 === 3 ? null : [0, 0]));
    expect(r['detection']).toBeCloseTo(900 / 1000, 2);
  });

  it('run summary on a histogram and colony-block SE', () => {
    const s = runSummary([0, 2, 0, 0, 2], 0.5, [1, 2]);
    expect(s).toEqual({ n: 4, mean: 1.25, median: 0.5, surv: [0.5, 0.5] });
    const e = acrossColonies([{ a: 1 }, { a: 3 }, { a: NaN }]);
    expect(e.a.mean).toBe(2);
    expect(e.a.n).toBe(2);
    expect(e.a.se).toBeCloseTo(Math.SQRT2 / Math.SQRT2, 10);
  });
});
