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
const ACCOUNTS: Account[] = ['external', 'food', 'crop', 'reserve', 'brood', 'store', 'respired', 'evaporated', 'waste'];
const QI: Record<Quantity, number> = { sugar: 0, water: 1, protein: 2 };
const AI = Object.fromEntries(ACCOUNTS.map((a, i) => [a, i])) as Record<Account, number>;
const NA = ACCOUNTS.length;

export class Ledger {
  /** Balances indexed by quantity × account (fixed indices: this runs every step for every ant). */
  private readonly bal = new Float64Array(QUANTITIES.length * NA);
  transfers = 0;

  get(q: Quantity, a: Account): number {
    return this.bal[QI[q] * NA + AI[a]];
  }

  move(q: Quantity, from: Account, to: Account, amount: number): void {
    if (amount === 0 || from === to) return;
    if (!Number.isFinite(amount)) throw new Error(`ledger: non-finite ${q} transfer ${from}→${to}`);
    const base = QI[q] * NA;
    this.bal[base + AI[from]] -= amount;
    this.bal[base + AI[to]] += amount;
    this.transfers++;
  }

  /** Sum over all accounts (must be 0 by construction). */
  total(q: Quantity): number {
    let s = 0;
    for (let i = 0; i < NA; i++) s += this.bal[QI[q] * NA + i];
    return s;
  }

  snapshot(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const q of QUANTITIES) for (const a of ACCOUNTS) if (this.bal[QI[q] * NA + AI[a]] !== 0) out[`${q}:${a}`] = this.bal[QI[q] * NA + AI[a]];
    return out;
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
