import { POT_IDS } from '../../game/config/economy'
import { getPlantStage } from '../../game/systems/growth'
import type { GameSave, PotId, Tool } from '../../game/types'
import {
  potBaseY,
  potCenters,
  potImageY,
  potSize,
  stageHeight,
  stageWidth,
} from './layout'

interface PotControlsProps {
  pots: GameSave['pots']
  now: number
  hasSeeds: boolean
  tool: Tool | null
  onPot: (id: PotId) => void
}

export function PotControls({
  pots,
  now,
  hasSeeds,
  tool,
  onPot,
}: PotControlsProps) {
  return (
    <div
      className="pot-controls absolute inset-0"
      data-tool={tool ?? undefined}
    >
      {POT_IDS.map((id, index) => {
        const pot = pots[id]
        const stage = getPlantStage(pot, now)
        const wet =
          pot?.wetUntil !== undefined &&
          Math.max(now, pot.growthCheckpoint?.at ?? pot.plantedAt) <
            pot.wetUntil
        const status =
          stage === 'mature'
            ? 'Trưởng thành'
            : wet
              ? 'Đang lớn · đã tưới'
              : 'Đang lớn'
        const hint = pot === null && hasSeeds && tool === null
        return (
          <button
            key={id}
            type="button"
            className="pot-button"
            aria-label={`Chậu ${index + 1}${pot ? `: ${status}` : ''}`}
            style={{
              left: `${(potCenters[id] / stageWidth) * 100}%`,
              top: `${((potImageY - potSize * 1.5) / stageHeight) * 100}%`,
              width: `${((potSize * 1.64) / stageWidth) * 100}%`,
              height: `${((potBaseY - potImageY + potSize * 1.5) / stageHeight) * 100}%`,
            }}
            onClick={() => onPot(id)}
          >
            {hint && <span className="pot-hint">Chạm để gieo</span>}
            {pot && <span className="pot-label">{status}</span>}
          </button>
        )
      })}
    </div>
  )
}
