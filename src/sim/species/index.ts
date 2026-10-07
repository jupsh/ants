import { resolve } from '../core/param';
import { atta } from './atta';
import { cataglyphis } from './cataglyphis';
import { formica } from './formica';
import { lasius } from './lasius';
import { monomorium } from './monomorium';
import { pogonomyrmex } from './pogonomyrmex';
import { solenopsis } from './solenopsis';
import { temnothorax } from './temnothorax';
import type { Species, SpeciesDef } from './types';

export const SPECIES_DEFS: SpeciesDef[] = [lasius, formica, solenopsis, atta, monomorium, cataglyphis, pogonomyrmex, temnothorax];

export function getSpeciesDef(id: string): SpeciesDef {
  const d = SPECIES_DEFS.find((s) => s.id === id);
  if (!d) throw new Error(`Unknown species ${id}`);
  return d;
}

export function loadSpecies(id: string): Species {
  const def = getSpeciesDef(id);
  return { ...resolve(def), def } as Species;
}

export type { Species, SpeciesDef } from './types';
