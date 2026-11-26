import { PLANTS, PLANT_IDS } from '../config/plants'
import type { PlantId } from '../config/plants'
import type { GameSave, PlantedPot, PotId, Tool } from '../types'
import { getPlantStage, waterPlant } from './growth'

type Changed =
  'bought' | 'sold' | 'planted' | 'watered' | 'harvested' | 'uprooted'
type Rejected =
  | 'locked'
  | 'low-coins'
  | 'no-harvest'
  | 'no-seeds'
  | 'empty'
  | 'growing'
  | 'mature'
  | 'pot-changed'

export type GardenResult =
  | { kind: Changed; save: GameSave; plantId: PlantId }
  | { kind: Rejected }
  | { kind: 'confirm-uproot'; pot: PlantedPot }

export function buySeed(save: GameSave, plantId: PlantId): GardenResult {
  if (!save.unlockedPlantIds.includes(plantId)) return { kind: 'locked' }
  const price = PLANTS[plantId].seedPrice
  if (save.coins < price) return { kind: 'low-coins' }

  return {
    kind: 'bought',
    plantId,
    save: {
      ...save,
      coins: save.coins - price,
      seedCounts: {
        ...save.seedCounts,
        [plantId]: (save.seedCounts[plantId] ?? 0) + 1,
      },
    },
  }
}

export function sellFlower(save: GameSave, plantId: PlantId): GardenResult {
  const count = save.harvestCounts[plantId] ?? 0
  if (count === 0) return { kind: 'no-harvest' }

  return {
    kind: 'sold',
    plantId,
    save: {
      ...save,
      coins: save.coins + PLANTS[plantId].sellPrice,
      harvestCounts: { ...save.harvestCounts, [plantId]: count - 1 },
    },
  }
}

export function usePot(
  save: GameSave,
  id: PotId,
  tool: Tool | null,
  now: number,
): GardenResult {
  const pot = save.pots[id]
  const stage = getPlantStage(pot, now)

  if (tool === 'water') {
    if (pot === null) return { kind: 'empty' }
    if (stage === 'mature') return { kind: 'mature' }

    return {
      kind: 'watered',
      plantId: pot.plantId,
      save: { ...save, pots: { ...save.pots, [id]: waterPlant(pot, now) } },
    }
  }

  if (tool === 'shovel') {
    if (pot === null) return { kind: 'empty' }
    if (stage !== 'mature') return { kind: 'confirm-uproot', pot }

    return {
      kind: 'harvested',
      plantId: pot.plantId,
      save: {
        ...save,
        pots: { ...save.pots, [id]: null },
        harvestCounts: {
          ...save.harvestCounts,
          [pot.plantId]: (save.harvestCounts[pot.plantId] ?? 0) + 1,
        },
      },
    }
  }

  if (pot !== null) return { kind: stage === 'mature' ? 'mature' : 'growing' }
  const plantId = PLANT_IDS.find((plant) => (save.seedCounts[plant] ?? 0) > 0)
  if (!plantId) return { kind: 'no-seeds' }

  return {
    kind: 'planted',
    plantId,
    save: {
      ...save,
      seedCounts: {
        ...save.seedCounts,
        [plantId]: (save.seedCounts[plantId] ?? 0) - 1,
      },
      pots: { ...save.pots, [id]: { plantId, plantedAt: now } },
    },
  }
}

export function uprootPlant(
  save: GameSave,
  id: PotId,
  expected: PlantedPot,
  now: number,
): GardenResult {
  const pot = save.pots[id]
  if (pot?.plantId !== expected.plantId || pot.plantedAt !== expected.plantedAt)
    return { kind: 'pot-changed' }
  if (getPlantStage(pot, now) === 'mature') return { kind: 'mature' }

  return {
    kind: 'uprooted',
    plantId: pot.plantId,
    save: { ...save, pots: { ...save.pots, [id]: null } },
  }
}
