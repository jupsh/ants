/**
 * Conservation ledger for sugar (mg sucrose-equivalent energy), water (mg)
 * and protein (mg). Every physical transfer between reservoirs is recorded
 * here as well as applied to the entities involved; tests check that the
 * ledger's account totals equal the sums held by entities, so food can never
 * be created or destroyed silently.
 *
 * 'external' is the experimenter / environment boundary: food added to the
 * arena comes from it, and anything leaving the system (respired sugar,
 * evaporated water) goes to its dedicated sink account.
 */
export type Quantity = 'sugar' | 'water' | 'protein';
export type Account =
  | 'external' // inputs from outside the system (negative balance)
  | 'food' // food items in the world
  | 'crop' // ants' social stomachs
  | 'reserve' // ants' body energy reserves / body water / body protein
  | 'brood'
  | 'store'
  | 'respired' // sugar oxidised by metabolism
  | 'evaporated' // water lost to the air
  | 'waste';

export const QUANTITIES: Quantity[] = ['sugar', 'water', 'protein'];

export class Ledger {
  private readonly bal = new Map<string, number>();
  transfers = 0;

  private key(q: Quantity, a: Account): string {
    return `${q}:${a}`;
  }

  get(q: Quantity, a: Account): number {
    return this.bal.get(this.key(q, a)) ?? 0;
  }

  move(q: Quantity, from: Account, to: Account, amount: number): void {
    if (amount === 0 || from === to) return;
    if (!Number.isFinite(amount)) throw new Error(`ledger: non-finite ${q} transfer ${from}→${to}`);
    const kf = this.key(q, from);
    const kt = this.key(q, to);
    this.bal.set(kf, (this.bal.get(kf) ?? 0) - amount);
    this.bal.set(kt, (this.bal.get(kt) ?? 0) + amount);
    this.transfers++;
  }

  /** Sum over all accounts (must be 0 by construction). */
  total(q: Quantity): number {
    let s = 0;
    for (const [k, v] of this.bal) if (k.startsWith(`${q}:`)) s += v;
    return s;
  }

  snapshot(): Record<string, number> {
    return Object.fromEntries(this.bal);
  }
}

/**
 * Sucrose solution composition. Density of aqueous sucrose rises ~0.133 g/mL
 * per mol/L (CRC tables, linear to ~2 M).
 */
export const SUCROSE_MG_PER_MMOL = 342.3;
export function sucroseSugarPerUl(molar: number): number {
  return (molar * SUCROSE_MG_PER_MMOL) / 1000; // mg per µL
}
export function sucroseWaterPerUl(molar: number): number {
  const density = 0.998 + 0.1335 * molar; // mg per µL
  return Math.max(0, density - sucroseSugarPerUl(molar));
}
