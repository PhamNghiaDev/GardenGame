import { useEffect, useState } from 'react'
import { POT_IDS } from '../../game/config/economy'
import { getPlantStage } from '../../game/systems/growth'
import type { GameSave } from '../../game/types'
import { useGameStore } from '../../store/gameStore'

export function useGrowthTime(pots: GameSave['pots']): number {
  const [now, setNow] = useState(Date.now)
  const checkpoint = useGameStore((state) => state.checkpoint)
  const hasGrowingPlant = POT_IDS.some((id) => {
    const pot = pots[id]
    return (
      pot !== null &&
      getPlantStage(pot, pot.growthCheckpoint?.at ?? pot.plantedAt) !== 'mature'
    )
  })

  useEffect(() => {
    if (!hasGrowingPlant) return

    let timer: ReturnType<typeof setTimeout>
    function refresh() {
      const time = Date.now()
      checkpoint(time)
      setNow(time)
      timer = setTimeout(refresh, 500)
    }

    refresh()
    return () => clearTimeout(timer)
  }, [hasGrowingPlant, checkpoint])

  useEffect(() => {
    function saveGrowth() {
      const time = Date.now()
      checkpoint(time, true)
      setNow(time)
    }

    document.addEventListener('visibilitychange', saveGrowth)
    window.addEventListener('pagehide', saveGrowth)
    return () => {
      document.removeEventListener('visibilitychange', saveGrowth)
      window.removeEventListener('pagehide', saveGrowth)
    }
  }, [checkpoint])

  return now
}
