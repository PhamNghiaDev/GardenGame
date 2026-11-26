import type { PersistStorage } from 'zustand/middleware'
import { POT_IDS, STARTER_PLANT, STARTING_COINS } from '../game/config/economy'
import { isPlantId } from '../game/config/plants'
import type { GameSave, PlantedPot, PlantQuantities, Pot } from '../game/types'

export const LEGACY_SAVE_KEY = 'balcony-garden-v1'
export const SAVE_KEY = 'balcony-garden-save'
export const SAVE_VERSION = 2

export function createInitialSave(): GameSave {
  return {
    coins: STARTING_COINS,
    seedCounts: {},
    harvestCounts: {},
    unlockedPlantIds: [STARTER_PLANT],
    pots: { left: null, center: null, right: null },
    audioMuted: false,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonnegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

function isPlantQuantities(value: unknown): value is PlantQuantities {
  return (
    isRecord(value) &&
    Object.entries(value).every(
      ([id, count]) => isPlantId(id) && isNonnegativeInteger(count),
    )
  )
}

function isPot(value: unknown): boolean {
  if (value === null) return true
  if (
    !isRecord(value) ||
    !isPlantId(value.plantId) ||
    !isNonnegativeInteger(value.plantedAt)
  )
    return false
  if (value.wetUntil !== undefined && !isNonnegativeInteger(value.wetUntil))
    return false

  const checkpoint = value.growthCheckpoint
  return (
    checkpoint === undefined ||
    (isRecord(checkpoint) &&
      isNonnegativeInteger(checkpoint.at) &&
      checkpoint.at >= value.plantedAt &&
      typeof checkpoint.elapsedMs === 'number' &&
      Number.isFinite(checkpoint.elapsedMs) &&
      checkpoint.elapsedMs >= 0)
  )
}

function isGameSave(value: unknown): value is GameSave {
  if (!isRecord(value)) return false

  const { pots } = value
  return (
    isNonnegativeInteger(value.coins) &&
    isPlantQuantities(value.seedCounts) &&
    isPlantQuantities(value.harvestCounts) &&
    Array.isArray(value.unlockedPlantIds) &&
    value.unlockedPlantIds.every(isPlantId) &&
    value.unlockedPlantIds.includes(STARTER_PLANT) &&
    isRecord(pots) &&
    POT_IDS.every((potId) => isPot(pots[potId])) &&
    typeof value.audioMuted === 'boolean'
  )
}

export function readGameSave(value: unknown): GameSave {
  if (!isGameSave(value)) throw new Error('Dữ liệu save không đúng định dạng.')
  return value
}

export function migrateSave(saved: unknown, fromVersion: number): GameSave {
  // V1 fields are preserved. A missing wetUntil means the plant starts dry.
  if (fromVersion === 1) return readGameSave(saved)
  throw new Error(`Phiên bản save ${fromVersion} chưa được hỗ trợ.`)
}

function migrateLegacyPot(value: unknown, now: number): Pot {
  if (value === null) return null
  if (!isRecord(value) || !isPlantId(value.type))
    throw new Error('Chậu prototype không hợp lệ.')

  const last = isNonnegativeInteger(value.last) ? value.last : undefined
  const age =
    typeof value.age === 'number' && Number.isFinite(value.age)
      ? Math.max(0, value.age)
      : undefined
  const plantedAt = isNonnegativeInteger(value.plantedAt)
    ? value.plantedAt
    : Math.max(0, (last ?? now) - Math.floor(age ?? 0))
  const pot: PlantedPot = { plantId: value.type, plantedAt }

  if (last !== undefined) {
    const at = Math.max(plantedAt, last)
    pot.growthCheckpoint = { at, elapsedMs: age ?? at - plantedAt }
    if (isNonnegativeInteger(value.wetUntil) && value.wetUntil > at)
      pot.wetUntil = value.wetUntil
  }
  return pot
}

export function migrateLegacySave(
  value: unknown,
  now: number,
  audioMuted = false,
): GameSave {
  if (
    !isRecord(value) ||
    !isNonnegativeInteger(value.coins) ||
    !Array.isArray(value.pots) ||
    value.pots.length !== POT_IDS.length
  ) {
    throw new Error('Save prototype không đúng định dạng.')
  }
  const seedCounts = value.seeds ?? {}
  const harvestCounts = value.flowers ?? {}
  if (!isPlantQuantities(seedCounts) || !isPlantQuantities(harvestCounts))
    throw new Error('Túi đồ prototype không đúng định dạng.')

  return {
    ...createInitialSave(),
    coins: value.coins,
    seedCounts,
    harvestCounts,
    audioMuted,
    pots: {
      left: migrateLegacyPot(value.pots[0], now),
      center: migrateLegacyPot(value.pots[1], now),
      right: migrateLegacyPot(value.pots[2], now),
    },
  }
}

function isScaffoldSave(save: GameSave): boolean {
  return (
    save.coins === STARTING_COINS &&
    save.unlockedPlantIds.length === 1 &&
    POT_IDS.every((id) => save.pots[id] === null) &&
    Object.values(save.seedCounts).every((count) => count === 0) &&
    Object.values(save.harvestCounts).every((count) => count === 0)
  )
}

function readLegacyStorage(audioMuted?: boolean): GameSave | undefined {
  const raw = window.localStorage.getItem(LEGACY_SAVE_KEY)
  if (raw === null) return undefined

  try {
    return migrateLegacySave(JSON.parse(raw), Date.now(), audioMuted)
  } catch (error) {
    console.warn(
      'Không đọc được save prototype. Dữ liệu gốc được giữ lại.',
      error,
    )
    return undefined
  }
}

export const saveStorage: PersistStorage<unknown> = {
  getItem(name) {
    const raw = window.localStorage.getItem(name)
    if (raw === null) {
      const legacy = readLegacyStorage()
      return legacy ? { state: legacy, version: 1 } : null
    }

    const envelope: unknown = JSON.parse(raw)
    if (
      !isRecord(envelope) ||
      !isNonnegativeInteger(envelope.version) ||
      !Object.hasOwn(envelope, 'state')
    ) {
      throw new Error('Save thiếu phiên bản hoặc dữ liệu.')
    }
    const { state, version } = envelope
    if (version === 1 && isGameSave(state) && isScaffoldSave(state)) {
      return { state: readLegacyStorage(state.audioMuted) ?? state, version }
    }
    return { state, version }
  },
  setItem(name, value) {
    try {
      window.localStorage.setItem(name, JSON.stringify(value))
    } catch (error) {
      console.warn(
        'Không ghi được save. Thay đổi hiện chỉ có trong phiên này.',
        error,
      )
    }
  },
  removeItem(name) {
    window.localStorage.removeItem(name)
  },
}
