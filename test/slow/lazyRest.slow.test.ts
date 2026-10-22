import { describe, it } from 'vitest';
import { blesCase, mailleuxCase, stroeymeytCase } from '../lazyRestRuns';

/** Full-size versions of the whole-run identity cases in test/lazyRest.test.ts (backlog B014). */
describe('lazyRest runs equal the stepped runs bit for bit (full size)', () => {
  it('a Bles colony with food', () => blesCase(30, 25), 120_000);
  it('a C2 Stroeymeyt colony, with and without the per-step verification', () => stroeymeytCase(300, 60), 300_000);
  it('Mailleux 1999: shared and independent warm-ups, followed nestmates', () => mailleuxCase(120, true), 120_000);
});
