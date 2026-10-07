import type { Track } from './trajectory';

/**
 * Parser for the Khuong et al. (2013) Lasius niger trajectories
 * (PLoS ONE 8:e76531, Datasets S1–S5, CC BY 4.0), converted to CSV with
 * columns: incline index, colony, °C, %RH, ant id, t (s), x (mm), y (mm).
 * Incline index 1..5 ↔ 0, π/9, π/6, π/4, π/3 rad.
 */
export const KHUONG_INCLINES = [0, Math.PI / 9, Math.PI / 6, Math.PI / 4, Math.PI / 3];
export const KHUONG_CONDITIONS = { tempC: 26, rh: 50 };

export interface KhuongTrack extends Track {
  incline: number; // rad
  colony: string;
}

export function parseKhuongCsv(text: string): KhuongTrack[] {
  const lines = text.split('\n');
  const byAnt = new Map<string, { incline: number; colony: string; t: number[]; x: number[]; y: number[] }>();
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const p = line.split(',');
    const id = `${p[1]}-${p[4]}`;
    let rec = byAnt.get(id);
    if (!rec) byAnt.set(id, (rec = { incline: KHUONG_INCLINES[Number(p[0]) - 1], colony: p[1], t: [], x: [], y: [] }));
    rec.t.push(Number(p[5]));
    rec.x.push(Number(p[6]));
    rec.y.push(Number(p[7]));
  }
  return [...byAnt.entries()].map(([id, r]) => ({
    id,
    incline: r.incline,
    colony: r.colony,
    t: Float64Array.from(r.t),
    x: Float64Array.from(r.x),
    y: Float64Array.from(r.y),
  }));
}
