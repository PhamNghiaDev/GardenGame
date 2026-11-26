import { describe, expect, it } from 'vitest'
import { WATER_BONUS_PERCENT, WATER_DURATION_MS } from '../config/growth'
import { PLANTS } from '../config/plants'
import type { PlantedPot, PlantStage } from '../types'
import { getGrowthElapsed, getPlantStage, waterPlant } from './growth'

const plantedAt = Date.UTC(2026, 0, 1)
const rosie: PlantedPot = { plantId: 'rosie', plantedAt }
const { sproutAfterMs, matureAfterMs } = PLANTS.rosie
const thirtyDaysMs = 30 * 24 * 60 * 60 * 1_000

describe('getPlantStage', () => {
  it.each<{
    label: string
    pot: PlantedPot | null
    now: number
    stage: PlantStage
  }>([
    { label: 'empty pot', pot: null, now: plantedAt, stage: 'empty' },
    {
      label: 'just before sprouting',
      pot: rosie,
      now: plantedAt + sproutAfterMs - 1,
      stage: 'seed',
    },
    {
      label: 'at the sprouting threshold',
      pot: rosie,
      now: plantedAt + sproutAfterMs,
      stage: 'sprout',
    },
    {
      label: 'at the maturity threshold',
      pot: rosie,
      now: plantedAt + matureAfterMs,
      stage: 'mature',
    },
    {
      label: 'after 30 days offline',
      pot: rosie,
      now: plantedAt + thirtyDaysMs,
      stage: 'mature',
    },
    {
      label: 'clock rolls back before planting',
      pot: rosie,
      now: plantedAt - 1,
      stage: 'seed',
    },
    {
      label: 'clock rolls back after a mature checkpoint',
      pot: {
        ...rosie,
        growthCheckpoint: {
          at: plantedAt + matureAfterMs,
          elapsedMs: matureAfterMs,
        },
      },
      now: plantedAt - 1,
      stage: 'mature',
    },
  ])('returns $stage for $label', ({ pot, now, stage }) => {
    expect(getPlantStage(pot, now)).toBe(stage)
  })
})

describe('watered growth', () => {
  it('applies a temporary bonus and caps the elapsed time at maturity', () => {
    const watered = waterPlant(rosie, plantedAt)
    const wet = (WATER_DURATION_MS * WATER_BONUS_PERCENT) / 100
    expect(
      getGrowthElapsed(watered, plantedAt + WATER_DURATION_MS),
    ).toBeCloseTo(WATER_DURATION_MS + wet)
    expect(getGrowthElapsed(watered, plantedAt + thirtyDaysMs)).toBe(
      matureAfterMs,
    )
    expect(getGrowthElapsed(watered, plantedAt - 1)).toBe(0)
  })

  it('refreshes watering without counting the previous window twice', () => {
    const first = waterPlant(rosie, plantedAt)
    const refreshAt = plantedAt + 9_000
    const second = waterPlant(first, refreshAt)
    expect(second.wetUntil).toBe(refreshAt + WATER_DURATION_MS)
    expect(getGrowthElapsed(second, refreshAt)).toBeCloseTo(
      getGrowthElapsed(first, refreshAt),
    )
    expect(
      getGrowthElapsed(second, refreshAt + 1_000) -
        getGrowthElapsed(second, refreshAt),
    ).toBeCloseTo(1_000 * (1 + WATER_BONUS_PERCENT / 100))
  })
})
