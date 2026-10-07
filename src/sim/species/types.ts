import type { Resolved, Sourced } from '../core/param';

type S = Sourced<number>;

export type ForageMode =
  | 'mass' // pheromone mass recruitment (Lasius, Monomorium, Solenopsis)
  | 'trunk' // trunk trails + strong individual route fidelity (Formica)
  | 'leafcutter' // trunk trails, leaf cutting, fungus agriculture (Atta)
  | 'harvester' // individual seed search, interaction-rate regulated exits (Pogonomyrmex)
  | 'solitary' // individual foraging, path integration only (Cataglyphis)
  | 'tandem'; // one-to-one tandem-run recruitment (Temnothorax)

export type SizeDistribution = 'mono' | 'continuous' | 'fire' | 'atta';
export type NestArchitecture = 'lasius' | 'fireant' | 'harvester' | 'atta' | 'cataglyphis' | 'formica' | 'cavity' | 'crevice';
export type FoodKind = 'sugar' | 'honeydew' | 'insect' | 'seed' | 'leaf';
export type GroundStyle = 'garden' | 'forest' | 'saltpan' | 'desertgrass' | 'rainforest' | 'kitchen' | 'pasture' | 'heath';

export type PheromoneChannelId = 'trail' | 'trailLong' | 'repel' | 'cleared';

export interface PheromoneChannelDef {
  id: PheromoneChannelId;
  label: string;
  gland: string;
  /** Mean lifetime τ of the behavioural effect (C(t) = C0 e^{-t/τ}). */
  lifetime: S;
  /** Amount deposited per mm walked while laying (arbitrary trail units / mm). */
  deposit: S;
  /** Concentration giving a half-maximal following response (same units). */
  threshold: S;
  /** Steering weight; negative = repellent. */
  weight: S;
  /** Who lays it. */
  laidBy: 'recruiters' | 'all-foragers' | 'unrewarded' | 'traffic';
}

export interface SpeciesDef {
  id: string;
  name: string;
  common: string;
  subfamily: 'Formicinae' | 'Myrmicinae';
  blurb: string;
  /** Bullet list of the distinguishing mechanisms modelled for this species. */
  highlights: string[];

  habitat: {
    label: string;
    ground: GroundStyle;
    surfaceMin: S; // °C daily minimum of soil surface
    surfaceMax: S; // °C daily maximum of soil surface
    airMin: S;
    airMax: S;
    sunrise: S; // h
    sunset: S; // h
    soilDiffusivity: S; // mm²/s
    startHour: number;
    indoor: boolean;
  };

  arena: {
    width: S; // mm
    height: S; // mm
    cell: S; // pheromone/terrain grid cell, mm
    relief: S; // terrain amplitude, mm
  };

  morphology: {
    lengthMin: S; // mm
    lengthMax: S; // mm
    sizeDistribution: SizeDistribution;
    massCoef: S; // mg / mm³  (mass = coef · length³)
    headAllometry: S; // head width ∝ length^x relative to isometry
    legRatio: S; // hind leg length / body length
    rideHeight: S; // body height above ground / body length
    petioleNodes: 1 | 2;
    cocoons: boolean;
    antennalClub: boolean;
    spines: boolean;
    colors: { head: string; mesosoma: string; gaster: string; legs: string };
  };

  locomotion: {
    v28: S; // mm/s at 28 °C for refMass
    refMass: S; // mg
    activationEnergy: S; // eV
    massExponent: S;
    tempMin: S; // chill coma
    tempOpt: S; // speed plateaus above this
    tempMax: S; // critical thermal maximum
    turnNoise: S; // rad / sqrt(s)
    loadSlope: S; // fractional speed loss per body-mass of load
  };

  senses: {
    antennaRatio: S; // antenna reach / body length
    antennaAngle: S; // rad from body axis
    trailGain: S; // rad/s per unit normalised bilateral difference
    foodDetect: S; // mm, olfactory detection of food items
    nestDetect: S; // mm, detection of nest entrance odour/CO2
  };

  navigation: {
    compassBias: S; // rad, SD of per-trip systematic compass error
    compassNoise: S; // rad, SD of per-step heading-reading error
    odometerError: S; // fractional SD of distance estimate per trip
    visualCatchment: S; // mm; 0 = no visual homing
    systematicSearch: boolean;
    siteFidelity: S; // probability of returning to a rewarded site
    memoryFailures: S; // unrewarded visits before a site is forgotten
  };

  foraging: {
    mode: ForageMode;
    foods: FoodKind[];
    bodyTempMin: S; // °C, below which foragers stay in
    bodyTempMax: S; // °C, above which foragers stay in / return
    diurnal: boolean; // requires daylight (sky compass)
    cropVolume: S; // µL at reference size
    drinkRate: S; // µL/s
    carryCapacity: S; // × body mass, single-ant transport limit
    giveUpTime: S; // s, outbound search before returning empty
    exploreRadius: S; // mm, mean excursion radius of a naive scout
    restTime: S; // s, mean rest between trips
    scoutRate: S; // spontaneous exits per available forager per hour
    extranidalHazard: S; // 1/s, mortality outside the nest
    recruitProbability: S; // probability a successful forager recruits
    recruitContacts: S; // nestmates contacted per recruitment event
    recruitResponse: S; // probability a contacted forager responds
  };

  pheromones: PheromoneChannelDef[];

  alarm: {
    radius: S; // mm, maximum active-space radius
    fade: S; // s, time for the active space to vanish
    aggression: S; // 0..1
  };

  colony: {
    queens: S;
    workers: S;
    eggs: S;
    larvae: S;
    pupae: S;
    eggsPerQueenDay: S;
    workerLifespan: S; // days
    forageAge: S; // days, median age at onset of foraging
    inactiveFraction: S;
    volumePerWorker: S; // mm³ of nest per worker
    workerCap: number; // performance cap for the simulation
  };

  development: {
    egg: S; // days at refTemp
    larva: S;
    pupa: S;
    refTemp: S; // °C
    lowerThreshold: S; // °C, development stops below
    upperThreshold: S; // °C, development declines above
    broodTempPref: S; // °C preferred by nurses for larvae/pupae
  };

  nest: {
    architecture: NestArchitecture;
    voxel: S; // mm
    depth: S; // mm, maximum depth of initial plan
    radius: S; // mm, lateral extent
    tunnelWidth: S; // mm
    chamberHeight: S; // mm
    moundHeight: S; // mm (0 = none)
    moundRadius: S; // mm
    pelletTime: S; // s to loosen one soil pellet
    pelletVolume: S; // mm³ per pellet
    queenDepth: S; // fraction of max depth where queen prefers to stay
  };

  physiology: {
    metabolicRate: S; // µg sugar / h per mg^0.75 at 25 °C, resting
    activeFactor: S; // metabolic multiplier while walking
    reserveDays: S; // days a fed worker survives without food
    larvalProtein: S; // mg protein-equivalent per mg adult mass
    eggCost: S; // mg protein per egg
  };

  /** Mode-specific extras. */
  special: {
    tandem?: { gapStop: S; gapResume: S; followerPause: S; leaderSlowdown: S };
    harvester?: { c: S; q: S; d: S; alphaMin: S; patrollers: S; patrolDuration: S; seedsPerDay: S };
    leafcutter?: {
      fragmentAreaCoef: S; // mm² per mm² of body length
      leafDensity: S; // mg fresh mass per mm²
      cutRate: S; // mm of cut per s at 7 mm body length
      hitchhikerProbability: S;
      gardenPerWorker: S; // mg fungus garden per worker at equilibrium
      gardenYield: S; // mg food per mg garden per day
      leafToGarden: S; // mg garden per mg leaf
      sapRate: S; // µL/s of sap imbibed while cutting
    };
    trunk?: { routeMemoryWeight: S };
    crevice?: { cavityHeight: S; wallAreaPerWorker: S; grainVolume: S };
  };

  /** Initial resources in the arena; user tools add more. */
  world: {
    aphidColonies: number;
    sugarDrops: number;
    insects: number;
    insectRainPerHour: number;
    seeds: number;
    plants: number;
    stones: number;
    grit: number;
    /** Radius of vegetation-free disc around the nest (harvesters), mm. */
    clearedDisc?: number;
  };
}

export type Species = Resolved<SpeciesDef> & { def: SpeciesDef };
