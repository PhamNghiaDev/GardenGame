import { describe, expect, it } from 'vitest'
import { STARTER_PLANT, STARTING_COINS } from '../config/economy'
import { PLANTS } from '../config/plants'
import type { GameSave } from '../types'
import { buySeed, sellFlower, uprootPlant, usePot } from './garden'
import type { GardenResult } from './garden'

const rosie = PLANTS.rosie
const now = Date.UTC(2026, 0, 1)

function fresh(): GameSave {
  return {
    coins: STARTING_COINS,
    seedCounts: {},
    harvestCounts: {},
    pots: { left: null, center: null, right: null },
    unlockedPlantIds: [STARTER_PLANT],
    audioMuted: false,
  }
}

function changed(result: GardenResult): GameSave {
  if (!('save' in result))
    throw new Error(`Expected a save update, got ${result.kind}`)
  return result.save
}

describe('garden transactions', () => {
  it('buys, plants, waits, harvests and sells one Rosie without changing other pots', () => {
    const start = fresh()
    const bought = changed(buySeed(start, 'rosie'))
    const planted = changed(usePot(bought, 'left', null, now))
    const harvest = changed(
      usePot(planted, 'left', 'shovel', now + rosie.matureAfterMs),
    )
    const sold = changed(sellFlower(harvest, 'rosie'))

    expect(start.coins).toBe(STARTING_COINS)
    expect(bought.seedCounts.rosie).toBe(1)
    expect(planted.seedCounts.rosie).toBe(0)
    expect(planted.pots.left).toEqual({ plantId: 'rosie', plantedAt: now })
    expect(harvest.harvestCounts.rosie).toBe(1)
    expect(sold.harvestCounts.rosie).toBe(0)
    expect(sold.pots).toEqual(start.pots)
    expect(sold.coins).toBe(STARTING_COINS - rosie.seedPrice + rosie.sellPrice)
    expect(sellFlower(sold, 'rosie')).toEqual({ kind: 'no-harvest' })
  })

  it('rejects locked seeds, unaffordable seeds, planting without stock and watering empty pots', () => {
    const save = fresh()
    expect(buySeed(save, 'plant-2')).toEqual({ kind: 'locked' })
    expect(buySeed({ ...save, coins: rosie.seedPrice - 1 }, 'rosie')).toEqual({
      kind: 'low-coins',
    })
    expect(usePot(save, 'right', null, now)).toEqual({ kind: 'no-seeds' })
    expect(usePot(save, 'right', 'water', now)).toEqual({ kind: 'empty' })
  })

  it('asks before removing an immature plant and rechecks maturity and pot identity on confirmation', () => {
    const planted = changed(
      usePot({ ...fresh(), seedCounts: { rosie: 1 } }, 'left', null, now),
    )
    const pot = planted.pots.left
    if (!pot) throw new Error('Expected a planted pot')

    expect(usePot(planted, 'left', 'shovel', now)).toEqual({
      kind: 'confirm-uproot',
      pot,
    })
    expect(
      uprootPlant(planted, 'left', pot, now + rosie.matureAfterMs),
    ).toEqual({ kind: 'mature' })
    expect(uprootPlant(fresh(), 'left', pot, now)).toEqual({
      kind: 'pot-changed',
    })
    expect(changed(uprootPlant(planted, 'left', pot, now)).pots.left).toBeNull()
    expect(planted.pots.left).toBe(pot)
  })
})
