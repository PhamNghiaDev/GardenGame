interface PlantDefinition {
  name: string
  seedPrice: number
  sellPrice: number
  sproutAfterMs: number
  matureAfterMs: number
  unlockPrice: number
}

// Provisional balance for the scaffold. Rosie is the only starter plant.
export const PLANTS = {
  rosie: {
    name: 'Cúc Rosie',
    seedPrice: 20,
    sellPrice: 60,
    sproutAfterMs: 20_000,
    matureAfterMs: 45_000,
    unlockPrice: 0,
  },
  'plant-2': {
    name: 'Loài cây 2 (tạm)',
    seedPrice: 30,
    sellPrice: 90,
    sproutAfterMs: 30_000,
    matureAfterMs: 60_000,
    unlockPrice: 150,
  },
  'plant-3': {
    name: 'Loài cây 3 (tạm)',
    seedPrice: 45,
    sellPrice: 135,
    sproutAfterMs: 45_000,
    matureAfterMs: 90_000,
    unlockPrice: 300,
  },
  'plant-4': {
    name: 'Loài cây 4 (tạm)',
    seedPrice: 60,
    sellPrice: 180,
    sproutAfterMs: 60_000,
    matureAfterMs: 120_000,
    unlockPrice: 500,
  },
  'plant-5': {
    name: 'Loài cây 5 (tạm)',
    seedPrice: 80,
    sellPrice: 240,
    sproutAfterMs: 75_000,
    matureAfterMs: 150_000,
    unlockPrice: 800,
  },
} as const satisfies Record<string, PlantDefinition>

export type PlantId = keyof typeof PLANTS
export const PLANT_IDS = Object.keys(PLANTS) as PlantId[]

export function isPlantId(value: unknown): value is PlantId {
  return typeof value === 'string' && Object.hasOwn(PLANTS, value)
}
