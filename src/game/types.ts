import type { POT_IDS } from './config/economy'
import type { PlantId } from './config/plants'

export type PotId = (typeof POT_IDS)[number]
export type Tool = 'water' | 'shovel'
export type PlantStage = 'empty' | 'seed' | 'sprout' | 'mature'

export interface GrowthCheckpoint {
  at: number
  elapsedMs: number
}

export interface PlantedPot {
  plantId: PlantId
  plantedAt: number
  growthCheckpoint?: GrowthCheckpoint
  wetUntil?: number
}

export type Pot = PlantedPot | null
export type PlantQuantities = Partial<Record<PlantId, number>>

export interface GameSave {
  coins: number
  seedCounts: PlantQuantities
  harvestCounts: PlantQuantities
  unlockedPlantIds: PlantId[]
  pots: Record<PotId, Pot>
  audioMuted: boolean
}
