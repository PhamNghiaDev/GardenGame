import { useId } from 'react'
import { PlantArtwork } from '../../art/PlantArtwork'
import { PotArtwork } from '../../art/PotArtwork'
import background from '../../art/assets/scene/background.jpg'
import balcony from '../../art/assets/scene/balcony.png'
import { POT_IDS } from '../../game/config/economy'
import { getPlantStage } from '../../game/systems/growth'
import type { GameSave } from '../../game/types'
import {
  plantRootY,
  plantScale,
  potCenters,
  potImageY,
  potSize,
  stageHeight,
  stageWidth,
} from './layout'

interface BalconyProps {
  pots: GameSave['pots']
  now: number
}

export function Balcony({ pots, now }: BalconyProps) {
  const titleId = useId()

  return (
    <svg
      className="balcony"
      viewBox={`0 0 ${stageWidth} ${stageHeight}`}
      role="img"
      aria-labelledby={titleId}
    >
      <title id={titleId}>Ban công với ba chậu cây</title>
      <image
        href={background}
        width={stageWidth}
        height={stageHeight}
        preserveAspectRatio="none"
      />
      <image
        href={balcony}
        width={stageWidth}
        height={stageHeight}
        preserveAspectRatio="none"
      />

      {POT_IDS.map((id) => (
        <PotArtwork
          key={id}
          x={potCenters[id] - potSize / 2}
          y={potImageY}
          size={potSize}
        />
      ))}
      {POT_IDS.map((id) => {
        const pot = pots[id]
        if (!pot) return null
        const stage = getPlantStage(pot, now)
        return (
          <PlantArtwork
            key={`${id}-${stage}`}
            plantId={pot.plantId}
            stage={stage}
            x={potCenters[id]}
            y={plantRootY}
            scale={plantScale}
          />
        )
      })}
    </svg>
  )
}
