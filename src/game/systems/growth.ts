import { WATER_BONUS_PERCENT, WATER_DURATION_MS } from '../config/growth'
import { PLANTS } from '../config/plants'
import { POT_IDS } from '../config/economy'
import type { GameSave, PlantedPot, PlantStage, Pot } from '../types'

export function getGrowthElapsed(pot: PlantedPot, now: number): number {
  const at = pot.growthCheckpoint?.at ?? pot.plantedAt
  const elapsed = pot.growthCheckpoint?.elapsedMs ?? 0
  const time = Math.max(0, now - at)
  const wateredTime = Math.max(0, Math.min(now, pot.wetUntil ?? at) - at)

  return Math.min(
    PLANTS[pot.plantId].matureAfterMs,
    elapsed + time + (wateredTime * WATER_BONUS_PERCENT) / 100,
  )
}

export function getPlantStage(pot: Pot, now: number): PlantStage {
  if (pot === null) return 'empty'
  const { sproutAfterMs, matureAfterMs } = PLANTS[pot.plantId]
  const elapsed = getGrowthElapsed(pot, now)

  if (elapsed >= matureAfterMs) return 'mature'
  if (elapsed >= sproutAfterMs) return 'sprout'
  return 'seed'
}

export function waterPlant(pot: PlantedPot, now: number): PlantedPot {
  const at = Math.max(now, pot.growthCheckpoint?.at ?? pot.plantedAt)

  return {
    ...pot,
    growthCheckpoint: { at, elapsedMs: getGrowthElapsed(pot, at) },
    wetUntil: at + WATER_DURATION_MS,
  }
}

export function recordGrowth(
  save: GameSave,
  now: number,
  force: boolean,
): GameSave {
  let pots = save.pots

  for (const id of POT_IDS) {
    const pot = pots[id]
    if (!pot) continue
    const at = pot.growthCheckpoint?.at ?? pot.plantedAt
    const savedStage = getPlantStage(pot, at)
    if (now <= at || savedStage === 'mature') continue
    const wetEnded =
      pot.wetUntil !== undefined && at < pot.wetUntil && now >= pot.wetUntil
    if (!force && !wetEnded && savedStage === getPlantStage(pot, now)) continue

    pots = {
      ...pots,
      [id]: {
        ...pot,
        growthCheckpoint: { at: now, elapsedMs: getGrowthElapsed(pot, now) },
      },
    }
  }

  return pots === save.pots ? save : { ...save, pots }
}
