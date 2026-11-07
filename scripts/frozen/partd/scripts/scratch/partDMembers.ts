// Scratch (not committed): Part D members and capability tags, shared by partD2.ts (runs) and partDCap.ts (reader).
// The 11 primary members (D158): T under M (relay), D under M; Es's map λ 20 mm from the nest entrance (35, 40) mm.
export const MEMBERS: { id: string; family: 'T' | 'D'; spec: (s: number) => string }[] = [
  { id: 'T10f', family: 'T', spec: (s) => `relay:${s}:10:5` },
  { id: 'T20f', family: 'T', spec: (s) => `relay:${s}:20:5` },
  { id: 'T10m', family: 'T', spec: (s) => `relay:${s}:10:20` },
  { id: 'T20m', family: 'T', spec: (s) => `relay:${s}:20:20` },
  { id: 'Eu-M', family: 'D', spec: (s) => `driverSharedM:${s}:60` },
  { id: 'El20-M', family: 'D', spec: (s) => `driverLocalM:${s}:20` },
  { id: 'Ed2', family: 'D', spec: (s) => `driverWave:${s}:20:2:uniform` },
  { id: 'Ed5', family: 'D', spec: (s) => `driverWave:${s}:20:5:uniform` },
  { id: 'Ed20', family: 'D', spec: (s) => `driverWave:${s}:20:20:uniform` },
  { id: 'Ew5', family: 'D', spec: (s) => `driverWave:${s}:Infinity:5:perimeter` },
  { id: 'Es', family: 'D', spec: (s) => `driverSpatial:${s}:60:20` },
];
export const capTag = (arm: string, run: number) => `pd-cap-${arm}-r${run}`;
