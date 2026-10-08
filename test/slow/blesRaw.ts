import { RNG } from '../../src/sim/core/rng';
import { BLES_TABLE1, runBles, type BlesRun } from '../../src/sim/reference/blesTEC';

/** Raw (unobserved) outputs as the paper reports them. */
export function raw(variant: string, runs: number, seed: number) {
  const out = { events: [] as number[], foragers: [] as number[], ff: [] as number[], fnf: [] as number[], nff: [] as number[], nfnf: [] as number[], t50: [] as number[] };
  for (let r = 0; r < runs; r++) {
    const { contacts, forager: F }: BlesRun = runBles(BLES_TABLE1[variant], RNG.stream(seed, r));
    out.events.push(contacts.length);
    out.foragers.push(F.filter(Boolean).length);
    out.ff.push(contacts.filter((x) => F[x.donor] && F[x.receiver]).length);
    out.fnf.push(contacts.filter((x) => F[x.donor] && !F[x.receiver]).length);
    out.nff.push(contacts.filter((x) => !F[x.donor] && F[x.receiver]).length);
    out.nfnf.push(contacts.filter((x) => !F[x.donor] && !F[x.receiver]).length);
    const st = contacts.map((x) => x.start).sort((a, b) => a - b);
    out.t50.push(st[Math.floor(st.length / 2)] / 60);
  }
  return out;
}
