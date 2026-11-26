import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlantId } from '../game/config/plants'
import type { GameSave, PlantedPot, PotId, Tool } from '../game/types'
import {
  buySeed,
  sellFlower,
  uprootPlant,
  usePot,
} from '../game/systems/garden'
import type { GardenResult } from '../game/systems/garden'
import { recordGrowth } from '../game/systems/growth'
import {
  createInitialSave,
  migrateSave,
  readGameSave,
  SAVE_KEY,
  SAVE_VERSION,
  saveStorage,
} from './save'

interface GameStore {
  save: GameSave
  setMuted: (muted: boolean) => void
  buy: (id: PlantId) => GardenResult
  sell: (id: PlantId) => GardenResult
  interact: (id: PotId, tool: Tool | null, now: number) => GardenResult
  uproot: (id: PotId, pot: PlantedPot, now: number) => GardenResult
  checkpoint: (now: number, force?: boolean) => void
}

let canWriteSave = false

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => {
      function commit(result: GardenResult) {
        if ('save' in result) set({ save: result.save })
        return result
      }

      return {
        save: createInitialSave(),
        setMuted: (muted) =>
          set(({ save }) => ({ save: { ...save, audioMuted: muted } })),
        buy: (id) => commit(buySeed(get().save, id)),
        sell: (id) => commit(sellFlower(get().save, id)),
        interact: (id, tool, now) => commit(usePot(get().save, id, tool, now)),
        uproot: (id, pot, now) => commit(uprootPlant(get().save, id, pot, now)),
        checkpoint: (now, force = false) => {
          const current = get().save
          const save = recordGrowth(current, now, force)
          if (save !== current) set({ save })
        },
      }
    },
    {
      name: SAVE_KEY,
      version: SAVE_VERSION,
      storage: {
        ...saveStorage,
        setItem: (key, value) => {
          if (canWriteSave) return saveStorage.setItem(key, value)
        },
      },
      partialize: ({ save }) => save,
      migrate: migrateSave,
      merge: (persisted, current) => {
        const save =
          persisted === undefined ? current.save : readGameSave(persisted)
        canWriteSave = true
        return { ...current, save }
      },
      onRehydrateStorage: () => {
        canWriteSave = false
        return (_state, error) => {
          if (error)
            console.warn(
              'Không đọc được save. Dữ liệu trong bộ nhớ trình duyệt được giữ lại.',
              error,
            )
        }
      },
    },
  ),
)
