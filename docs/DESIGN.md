# Ant colony simulation — design

Goal: a browser-based simulation of real ant colonies that is as faithful to the
biology as current literature allows, built so that accuracy can keep being
improved for years without rewrites.

## Principles

1. **Mechanism over appearance.** Behaviour comes from mechanisms described in the
   literature (osmotropotaxis on pheromone trails, path integration with error,
   response thresholds, degree-day development) rather than from game heuristics
   ("follow the strongest neighbour cell").
2. **Every biological number has provenance.** Parameters are declared with a
   value, unit, confidence (`measured` / `derived` / `estimated`) and source
   reference (`src/sim/species/refs.ts`). The UI exposes these, and
   `npm run params` regenerates `docs/PARAMETERS.md`. An `estimated` parameter
   is an explicit invitation to find better data.
3. **Real units everywhere.** Distances in mm, time in s, temperature in °C,
   mass in mg, liquid volume in µL. The simulation clock is real time; speeding
   up the simulation never changes the biology (a clearly-labelled optional
   life-cycle compression exists for demonstration, default off).
4. **Validation is part of the code base.** `src/sim/experiments/` contains
   reproductions of published experiments; `test/` runs them headless and checks
   the outcome against the published result.
5. **Simulation core is pure and deterministic.** `src/sim/` has no DOM or
   rendering dependencies, uses one seeded RNG, and runs identically in a Web
   Worker, in Node (tests), or anywhere else.

## Architecture

```
src/
  sim/                 pure TypeScript simulation core (no DOM)
    core/              rng, math, units, sourced-parameter types
    env/               climate (diel temperature, light), soil heat equation
    world/             terrain heightmap, pheromone fields, alarm plumes,
                       surface items (food, plants, aphids, stones), spatial hash
    nest/              sparse chunked 3D voxel nest, navigation fields,
                       chamber detection, architecture plans, excavation
    colony/            brood development, nutrition, task allocation, demography
    agent/             ant state, locomotion, senses, navigation (PI, search)
    behavior/          surface and in-nest behaviour state machines,
                       recruitment modes (mass, tandem, harvester, leaf-cutting)
    species/           one file per species: parameters with provenance
    experiments/       validation experiments from the literature
    simulation.ts      orchestrator: fixed time step, scheduling
    snapshot.ts        compact binary snapshot for renderers
  worker/              Web Worker host for the simulation
  render/              three.js renderer (terrain, nest, articulated ants)
  ui/                  DOM panels: species picker, stats, inspector, params
test/                  unit tests + validation experiments (vitest)
docs/                  this file, PARAMETERS.md (generated)
```

The renderer never mutates simulation state; it receives snapshots
(transferable typed arrays) from the worker and sends commands back
(place food, disturb, select ant, change speed).

## World model

**One 3D coordinate system** (mm, +z up). The surface is a heightmap terrain.
Ants on the surface move in (x, y) with z taken from the terrain; slope affects
speed. The nest is a **sparse 3D voxel grid** under (and for mound builders,
above) the entrance. Ants walk continuously from the surface into the entrance
shaft and through tunnels; there is no teleporting between "views".

Why 3D: chamber floor area, helical shafts, vertical temperature gradients and
crowding are intrinsically three-dimensional (Tschinkel's nest casts). Foraging
happens on a surface, so the surface is a 2.5D manifold; pheromone fields live
on that surface.

### Environment
- Diel temperature of soil surface and air: Parton & Logan (1981) model
  (sine by day, exponential decay at night), parameters per habitat.
- Ant body temperature: between air and surface temperature depending on how
  high the body is held (boundary layer; long-legged desert ants run cooler).
- Soil temperature at depth: 1D heat equation (thermal diffusivity per soil),
  forced by surface temperature. Produces damping and phase lag with depth.
- Light level from solar elevation (sky compass availability, diurnality).

### Chemical signals
- Trail pheromones: per-channel surface grids with exponential decay at the
  species' measured lifetime. Decay is applied lazily via a global scale factor,
  so cost is independent of grid size.
- Multiple channels where the species has them (e.g. Pharaoh ant long-lived
  attractive, short-lived attractive, and repellent "no entry" pheromone).
- Alarm pheromone: Bossert & Wilson (1963) instantaneous point-source diffusion
  model, calibrated per species by active-space radius and fade time.
- Sensing: two antennae sample the field; steering minimises the bilateral
  difference (osmotropotaxis, Hangartner 1967) with Weber-law normalisation.

### Individuals
- Size: species-specific size distribution (monomorphic, continuous, bimodal,
  or extreme polymorphism). Mass, head width, speed, carrying capacity and crop
  volume scale allometrically.
- Locomotion: speed = species speed at 28 °C × Arrhenius temperature term
  (species activation energy, Hurlbert et al. 2008) × mass^0.25 × load × slope
  terms. Chill coma below CTmin, heat death above CTmax.
- Navigation: path integration with per-trip compass bias and per-step noise;
  systematic search around the fictive nest (Wehner & Srinivasan 1981,
  centred-loops model); visual catchment / route memory for visual navigators;
  site fidelity (memory of profitable sites).
- Physiology: crop (social stomach) volume and sugar, fat-body reserve,
  temperature-dependent metabolic rate, starvation.

### Colony
- Brood: egg → larva → pupa → adult with degree-day development, larval
  protein requirement, caste/size determined by larval nutrition and colony size.
- Nutrition: carbohydrate and protein flows; trophallaxis between individuals;
  colony hunger feeds back on foraging and recruitment.
- Task allocation: response thresholds (Bonabeau, Theraulaz & Deneubourg 1996)
  with threshold reinforcement and age polyethism; size-dependent thresholds in
  polymorphic species. Many workers are inactive, as in real colonies.
- Recruitment modes: mass recruitment (trail + in-nest stimulation), tandem
  running (Temnothorax), interaction-rate regulation (Pogonomyrmex, Prabhakar
  et al. 2012), leaf-cutting trunk trails (Atta), solitary foraging (Cataglyphis).
- Nest construction: excavation by individual workers carrying soil pellets to
  the surface; the target volume scales with colony size (Buhl et al. 2004,
  Rasse & Deneubourg 2001); architecture follows species templates derived from
  nest casts (Tschinkel). Brood is moved along the vertical temperature profile.
- Mortality: age, starvation, heat, extranidal hazard (predation); corpse
  removal after the oleic-acid delay.

## Roadmap (beyond the first version)
- Fully emergent excavation (replace architecture templates with
  pheromone/crowding-driven digging rules, then validate against casts).
- Climbable vegetation (aphids on stems, Atta cutting in canopy).
- Inter-colony competition, territoriality, raids; predators and parasitoids
  (phorid flies vs. Atta hitchhikers).
- Seasons, overwintering, sexual brood and nuptial flights; colony founding.
- Rain, humidity and desiccation.
- Army ants (Eciton) with bivouacs and swarm raids.
- GPU (WebGPU) back end for very large colonies.
