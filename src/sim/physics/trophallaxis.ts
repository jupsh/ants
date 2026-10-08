import type { Body } from '../agent/body';

/**
 * Food transfer by trophallaxis (step 4, STATUS 2026-10-08). The donor
 * regurgitates crop contents to the receiver: volume at `rate` µL/s, sugar
 * and water in the donor crop's proportions, limited by what the donor holds
 * and the room in the receiver's crop. Returns the volume moved (µL).
 *
 * Both sides are the ledger's `crop` account, so its balances do not change;
 * conservation is checked by comparing the per-ant sums with the ledger
 * (test/colony.test.ts), and the caller logs each transfer.
 */
export function shareCrop(donor: Body, receiver: Body, rate: number, dt: number): number {
  const room = Math.max(0, receiver.morph.cropCapacity - receiver.cropUl);
  const ul = Math.min(rate * dt, donor.cropUl, room);
  if (!(ul > 0)) return 0;
  const f = ul / donor.cropUl;
  const s = donor.cropSugar * f;
  const w = donor.cropWater * f;
  donor.cropUl -= ul;
  donor.cropSugar -= s;
  donor.cropWater -= w;
  receiver.cropUl += ul;
  receiver.cropSugar += s;
  receiver.cropWater += w;
  donor.mouthFlow -= ul;
  receiver.mouthFlow += ul;
  return ul;
}
