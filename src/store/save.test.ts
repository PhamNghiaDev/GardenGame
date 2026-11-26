import { describe, expect, it } from 'vitest'
import { PLANTS } from '../game/config/plants'
import { getGrowthElapsed, getPlantStage } from '../game/systems/growth'
import { createInitialSave, migrateLegacySave, migrateSave } from './save'

const now = Date.UTC(2026, 0, 1)

describe('save migrations', () => {
  it('keeps v1 game data and audio settings', () => {
    const save = { ...createInitialSave(), coins: 140, audioMuted: true }
    expect(migrateSave(save, 1)).toEqual(save)
    expect(() => migrateSave(save, 99)).toThrow()
  })

  it('imports legacy balances, inventories, wet progress and plantedAt-only pots', () => {
    const save = migrateLegacySave(
      {
        coins: 35,
        seeds: { rosie: 2 },
        flowers: { rosie: 3 },
        pots: [
          { type: 'rosie', age: 12_000.5, last: now, wetUntil: now + 5_000 },
          { type: 'rosie', plantedAt: now - PLANTS.rosie.matureAfterMs },
          null,
        ],
      },
      now,
      true,
    )

    expect(save.coins).toBe(35)
    expect(save.seedCounts.rosie).toBe(2)
    expect(save.harvestCounts.rosie).toBe(3)
    expect(save.audioMuted).toBe(true)
    expect(save.pots.right).toBeNull()
    const wet = save.pots.left
    if (!wet) throw new Error('Missing migrated plant')
    expect(getGrowthElapsed(wet, now + 1_000)).toBeCloseTo(13_300.5)
    expect(getPlantStage(save.pots.center, now)).toBe('mature')
  })

  it('rejects incomplete or invalid prototype data', () => {
    expect(() => migrateLegacySave({ coins: 35, pots: [null] }, now)).toThrow()
    expect(() =>
      migrateLegacySave(
        { coins: 35, seeds: { rosie: -1 }, pots: [null, null, null] },
        now,
      ),
    ).toThrow()
  })
})
