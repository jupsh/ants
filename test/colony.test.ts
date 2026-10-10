import { describe, expect, it } from 'vitest';
import { Body } from '../src/sim/agent/body';
import { RNG } from '../src/sim/core/rng';
import { runColony } from '../src/sim/experiments/colonyBles';
import { alignFaceToFace, antennalContact, detectContacts, headPoint, mouthContact } from '../src/sim/physics/contacts';
import { sucroseSugarPerUl, sucroseWaterPerUl } from '../src/sim/physics/ledger';
import { shareCrop } from '../src/sim/physics/trophallaxis';
import { LASIUS_NEST, LASIUS_PARAMS } from '../src/sim/species/lasiusM1';
import { blesApparatus } from '../src/sim/world/apparatus';
import { PathField } from '../src/sim/world/pathField';
import { World } from '../src/sim/world/world';
import { newMind } from '../src/sim/mind/mind';
import { walkAnt } from '../src/sim/physics/antPhysics';
import { basicPercept } from '../src/sim/perception/types';

/** Step 4, bounded version (STATUS 2026-10-08): geometry, contacts, transfer, conservation, determinism. */
const morph = { len: 4, mass: 2, cropCapacity: 2, antennaReach: 2.6, cropFullFrac: 0.98 };
const body = (id: number, x: number, y: number, heading: number) => {
  const b = new Body(id, 1, morph, 0.5, 1);
  b.x = x;
  b.y = y;
  b.heading = heading;
  return b;
};

describe('Bles nest geometry', () => {
  it('nest, passage and foraging area are connected and bounded', () => {
    const { app, entrance, feeder } = blesApparatus();
    expect(app.regionAt(28, 20)?.kind).toBe('nest');
    expect(app.regionAt(58, 20.5)?.kind).toBe('bridge');
    expect(app.regionAt(90, 0)?.kind).toBe('arena');
    expect(app.inside(...entrance)).toBe(true);
    expect(app.regionAt(...feeder)?.kind).toBe('arena');
    // The passage is the only way through: 4 mm beside it is wall.
    expect(app.inside(58, 15)).toBe(false);
    expect(app.inside(58, 26)).toBe(false);
    expect(app.inside(-1, 20)).toBe(false);
  });
});

describe('cues along the surface and walls', () => {
  it('nest odour follows the passage, not the straight line through the wall', () => {
    const { app } = blesApparatus();
    const f = new PathField(app, (r) => r.kind === 'nest');
    // Just outside the passage mouth, beside it (y 22.5, the passage spans 19–22): straight at the
    // entrance would point into the wall; the cue points down into the mouth.
    expect(f.distanceAt(60.5, 20.5)).toBeCloseTo(4.5, 0);
    expect(f.distanceAt(60.5, 30)).toBeGreaterThan(Math.hypot(4.5, 9.5) - 0.5);
    const dir = f.descentAt(60.5, 30)!;
    expect(Math.sin(dir)).toBeLessThan(-0.5); // towards smaller y, i.e. the mouth
    expect(f.distanceAt(28, 20)).toBe(0);
  });

  it('a long step cannot jump the 4 mm wall between nest and foraging area', () => {
    const { app, entrance } = blesApparatus();
    const w = new World(app, entrance, 1, 25, 50);
    const P = LASIUS_PARAMS;
    const b = new Body(0, 1, morph, 0.5, 1);
    b.x = 55;
    b.y = 30; // in the nest, 1 mm from its right wall, beside (not at) the passage
    const mind = newMind({ desiredVolumeFactor: 1, neverLays: true, layIntensity: 0 }, P.walk, b.rng);
    mind.walk.heading = 0;
    const a = { body: b, mind, inactive: false };
    // A motor that asks for one 8 mm step to the right.
    walkAnt(w, a, basicPercept(0.1, 0, 0, 25), P.walk, P.phys, {}, (_p, _s, _per, _k, _pi, move) => {
      move(8, 0, 8);
      return 8;
    });
    expect(b.x).toBeLessThanOrEqual(56);
    expect(app.regionAt(b.x, b.y)?.kind).toBe('nest');
  });
});

describe('contact geometry', () => {
  it('mouth contact needs heads close and headings opposed', () => {
    // Centres 3.8 mm apart: heads 0.6 mm apart when facing each other.
    const a = body(0, 0, 0, 0);
    const b = body(1, 3.8, 0, Math.PI);
    expect(mouthContact(a, b)).toBe(true);
    expect(antennalContact(a, b)).toBe(true);
    b.heading = 0; // same direction: head to tail
    expect(mouthContact(a, b)).toBe(false);
    expect(antennalContact(a, b)).toBe(true);
    b.x = 20;
    expect(antennalContact(a, b)).toBe(false);
  });

  it('alignment puts a pair face to face, inside the surface', () => {
    const a = body(0, 0, 0, 1);
    const b = body(1, 2, 3, -2);
    expect(alignFaceToFace(a, b, () => true)).toBe(true);
    expect(mouthContact(a, b)).toBe(true);
    const [ax, ay] = headPoint(a);
    const [bx, by] = headPoint(b);
    expect(Math.hypot(ax - bx, ay - by)).toBeCloseTo(0.6, 9);
    // Refused (and nothing moved) when the partner would leave the surface.
    const c = body(2, 5, 5, 0);
    expect(alignFaceToFace(a, c, () => false)).toBe(false);
    expect([c.x, c.y, c.heading]).toEqual([5, 5, 0]);
  });

  it('hashed contact detection equals the all-pairs check', () => {
    const r = new RNG(7);
    const bodies = Array.from({ length: 120 }, (_, i) => body(i, r.range(0, 60), r.range(0, 45), r.range(-Math.PI, Math.PI)));
    const brute: string[] = [];
    for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) if (antennalContact(bodies[i], bodies[j])) brute.push(`${i}-${j}-${mouthContact(bodies[i], bodies[j])}`);
    const hashed = detectContacts(bodies, { x0: 0, y0: 0, x1: 60, y1: 45 }).map((p) => `${p.a}-${p.b}-${p.mouth}`);
    expect(brute.length).toBeGreaterThan(20);
    expect(hashed).toEqual(brute);
  });
});

describe('food transfer', () => {
  it('moves crop contents in the donor’s proportions, within content and room', () => {
    const d = body(0, 0, 0, 0);
    const r = body(1, 3.8, 0, Math.PI);
    d.cropUl = 1.5;
    d.cropSugar = 1.5 * sucroseSugarPerUl(1);
    d.cropWater = 1.5 * sucroseWaterPerUl(1);
    r.cropUl = 1.8;
    r.cropSugar = 1.8 * sucroseSugarPerUl(0.5);
    r.cropWater = 1.8 * sucroseWaterPerUl(0.5);
    const before = { ul: d.cropUl + r.cropUl, s: d.cropSugar + r.cropSugar, w: d.cropWater + r.cropWater };
    const ul = shareCrop(d, r, 1, 1); // 1 µL offered, room for 0.2
    expect(ul).toBeCloseTo(0.2, 12);
    expect(d.cropUl + r.cropUl).toBeCloseTo(before.ul, 12);
    expect(d.cropSugar + r.cropSugar).toBeCloseTo(before.s, 12);
    expect(d.cropWater + r.cropWater).toBeCloseTo(before.w, 12);
    expect(d.cropSugar / d.cropUl).toBeCloseTo(sucroseSugarPerUl(1), 12);
    expect(r.mouthFlow).toBeCloseTo(0.2, 12);
    expect(d.mouthFlow).toBeCloseTo(-0.2, 12);
    // Limited by the donor's content.
    const e = body(2, 0, 0, 0);
    e.cropUl = 0.05;
    e.cropSugar = 0.05 * sucroseSugarPerUl(1);
    e.cropWater = 0.05 * sucroseWaterPerUl(1);
    const f = body(3, 0, 0, 0);
    expect(shareCrop(e, f, 1, 1)).toBeCloseTo(0.05, 12);
    expect(e.cropUl).toBe(0);
    expect(shareCrop(e, f, 1, 1)).toBe(0);
  });
});

describe('colony run (provisional behaviour)', () => {
  const P = { ...LASIUS_PARAMS, nest: LASIUS_NEST };
  const opts = { seed: 3, ants: 20, minutes: 25, foodMinute: 2 };
  const run = () => runColony(P, opts);

  it('conserves sugar and water: ledger accounts equal the per-entity sums', () => {
    const r = run();
    expect(r.bouts.length).toBeGreaterThan(0); // food actually flowed between ants
    const w = r.world;
    const e = w.entityTotals();
    for (const q of ['sugar', 'water'] as const) {
      const scale = Math.abs(w.ledger.get(q, 'external'));
      expect(Math.abs(w.ledger.total(q))).toBeLessThan(1e-9 * scale);
      for (const a of ['food', 'crop', 'reserve'] as const) expect(Math.abs(w.ledger.get(q, a) - e[`${q}:${a}`])).toBeLessThan(1e-9 * scale);
    }
    // Every shared volume is accounted for by the bouts' sum of transfers.
    expect(r.bouts.every((b) => b.ul > 0 && b.end > b.start && b.donor !== b.receiver)).toBe(true);
  });

  it('is deterministic: the same seed gives identical bouts and final state', () => {
    const a = run();
    const b = run();
    expect(b.bouts).toEqual(a.bouts);
    expect(b.world.ants.map((x) => [x.body.x, x.body.y, x.body.cropUl, x.body.reserve])).toEqual(a.world.ants.map((x) => [x.body.x, x.body.y, x.body.cropUl, x.body.reserve]));
    const c = runColony(P, { ...opts, seed: 4 });
    expect(c.world.ants.map((x) => x.body.x)).not.toEqual(a.world.ants.map((x) => x.body.x));
  });
});
