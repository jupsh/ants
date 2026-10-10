/**
 * Trophallaxis statistics computed identically for the Bles et al. (2022)
 * scan data and for simulated colonies.
 *
 * Observation model (as in the experiment): a scan every minute; an exchange
 * is recorded if mandible contact lasts > 5 s; the same donor→receiver pair
 * seen on consecutive scans is one event spanning several minutes.
 */
export interface Scan {
  colony: number;
  minute: number;
  donor: number;
  receiver: number;
}

export interface TrophEvent {
  colony: number;
  start: number; // minute
  end: number;
  donor: number;
  receiver: number;
}

export function parseScans(csv: string): Scan[] {
  return csv
    .trim()
    .split('\n')
    .slice(1)
    .map((l) => l.split(',').map(Number))
    .map(([colony, minute, donor, receiver]) => ({ colony, minute, donor, receiver }));
}

/** A trophallactic contact in a simulation (times in s since food introduction). */
export interface ContactInterval {
  donor: number;
  receiver: number;
  start: number;
  end: number;
}

export interface ObserverOptions {
  colony: number;
  /** Scan period (s). */
  period?: number;
  /** A contact counts if mouth-to-mouth contact lasts longer than this (s). */
  minContact?: number;
  /**
   * How "lasts > minContact" is applied at a scan: 'after' (default) — the
   * contact continues more than minContact s after the scan instant, the only
   * reading an observer starting at an instantaneous scan can apply;
   * 'total' — in progress at the scan and longer than minContact in total
   * (the earlier reading, kept as a sensitivity; STATUS 2026-10-09).
   */
  rule?: ObserverRule;
  /**
   * Time of the first scan after food introduction (s, in [0, period)). The
   * real phase is unknown, so callers draw it uniformly per colony.
   */
  phase?: number;
  /** Number of scans (Bles et al.: minutes 30–90 inclusive = 61). */
  scans?: number;
  /** Minute label of the first scan (food introduced at minute 30). */
  foodMinute?: number;
}

/**
 * Simulated observer matching the Bles et al. protocol: every `period` s,
 * record each donor→receiver pair whose contact is in progress at the scan
 * instant and continues > `minContact` s after it (rule 'after'; or lasts
 * > `minContact` s in total, rule 'total'). Returns scan records in the
 * same form as the data, so `scansToEvents` and `colonyStats` apply as-is.
 */
/** 'after': contact continues > minContact s after the scan (default); 'total': lasts > minContact s in all (sensitivity). */
export type ObserverRule = 'after' | 'total';

export function observeContacts(contacts: ContactInterval[], o: ObserverOptions): Scan[] {
  const period = o.period ?? 60;
  const minContact = o.minContact ?? 5;
  const phase = o.phase ?? 0;
  const nScans = o.scans ?? 61;
  const foodMinute = o.foodMinute ?? 30;
  const after = (o.rule ?? 'after') === 'after';
  const out: Scan[] = [];
  for (const c of contacts) {
    if (c.end - c.start <= minContact) continue;
    const k0 = Math.max(0, Math.ceil((c.start - phase) / period));
    for (let k = k0; k < nScans; k++) {
      const tau = phase + k * period;
      if (tau >= c.end || (after && c.end - tau <= minContact)) break;
      out.push({ colony: o.colony, minute: foodMinute + k, donor: c.donor, receiver: c.receiver });
    }
  }
  return out;
}

/** Merge consecutive-minute scans of the same directed pair into events. */
export function scansToEvents(scans: Scan[]): TrophEvent[] {
  const sorted = [...scans].sort((a, b) => a.colony - b.colony || a.donor - b.donor || a.receiver - b.receiver || a.minute - b.minute);
  const out: TrophEvent[] = [];
  let cur: TrophEvent | null = null;
  for (const s of sorted) {
    if (cur && cur.colony === s.colony && cur.donor === s.donor && cur.receiver === s.receiver && s.minute <= cur.end + 1) {
      cur.end = s.minute;
      continue;
    }
    cur = { colony: s.colony, start: s.minute, end: s.minute, donor: s.donor, receiver: s.receiver };
    out.push(cur);
  }
  return out.sort((a, b) => a.colony - b.colony || a.start - b.start);
}

/** Gini coefficient of non-negative values. */
export function gini(values: number[]): number {
  const v = [...values].sort((a, b) => a - b);
  const n = v.length;
  const sum = v.reduce((s, x) => s + x, 0);
  if (!n || !sum) return 0;
  let acc = 0;
  v.forEach((x, i) => (acc += (2 * (i + 1) - n - 1) * x));
  return acc / (n * sum);
}

export interface ColonyTrophStats {
  colony: number;
  events: number;
  /** Minutes after food introduction until half the events had started. */
  t50: number;
  /** Individuals involved in at least one event. */
  participants: number;
  /** Gini coefficient of per-individual event counts (over `colonySize` ants, zeros included). */
  gini: number;
  /** Gini over participants only (zeros excluded), as reported by Bles et al. */
  giniParticipants: number;
  /** Fraction of participants that both donated and received. */
  bothRoles: number;
  /** Global efficiency of the undirected interaction network (mean inverse shortest path). */
  efficiency: number;
}

export function colonyStats(events: TrophEvent[], colony: number, foodMinute: number, colonySize: number): ColonyTrophStats {
  const ev = events.filter((e) => e.colony === colony && e.start >= foodMinute);
  const starts = ev.map((e) => e.start - foodMinute).sort((a, b) => a - b);
  const t50 = starts.length ? starts[Math.floor((starts.length - 1) / 2)] : NaN;
  const count = new Map<number, number>();
  const gave = new Set<number>();
  const got = new Set<number>();
  const adj = new Map<number, Set<number>>();
  const link = (a: number, b: number) => {
    if (!adj.has(a)) adj.set(a, new Set());
    adj.get(a)!.add(b);
  };
  for (const e of ev) {
    count.set(e.donor, (count.get(e.donor) ?? 0) + 1);
    count.set(e.receiver, (count.get(e.receiver) ?? 0) + 1);
    gave.add(e.donor);
    got.add(e.receiver);
    link(e.donor, e.receiver);
    link(e.receiver, e.donor);
  }
  const participants = count.size;
  const counts = [...count.values()];
  const giniParticipants = gini(counts);
  while (counts.length < colonySize) counts.push(0);
  let both = 0;
  for (const id of count.keys()) if (gave.has(id) && got.has(id)) both++;
  // Global efficiency over participants (BFS from each node).
  const nodes = [...adj.keys()];
  let effSum = 0;
  for (const s of nodes) {
    const dist = new Map<number, number>([[s, 0]]);
    const q = [s];
    for (let h = 0; h < q.length; h++) for (const nb of adj.get(q[h]) ?? []) if (!dist.has(nb)) {
      dist.set(nb, dist.get(q[h])! + 1);
      q.push(nb);
    }
    for (const [n, d] of dist) if (n !== s) effSum += 1 / d;
  }
  const np = nodes.length;
  return { colony, events: ev.length, t50, participants, gini: gini(counts), giniParticipants, bothRoles: participants ? both / participants : NaN, efficiency: np > 1 ? effSum / (np * (np - 1)) : 0 };
}
