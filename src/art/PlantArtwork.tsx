import stageOne from './assets/rosie/stage-1.png'
import stageTwo from './assets/rosie/stage-2.png'
import stageThree from './assets/rosie/stage-3.png'
import type { PlantId } from '../game/config/plants'
import type { PlantStage } from '../game/types'

const rosieArtwork = {
  seed: { src: stageOne, width: 374, height: 262, rootX: 176, rootY: 252 },
  sprout: { src: stageTwo, width: 478, height: 424, rootX: 262, rootY: 336 },
  mature: { src: stageThree, width: 474, height: 443, rootX: 240, rootY: 352 },
}

interface PlantArtworkProps {
  plantId: PlantId
  stage: PlantStage
  x: number
  y: number
  scale: number
}

export function PlantArtwork({
  plantId,
  stage,
  x,
  y,
  scale,
}: PlantArtworkProps) {
  if (plantId !== 'rosie' || stage === 'empty') return null
  const { src, rootX, rootY, height, width } = rosieArtwork[stage]

  return (
    <image
      className="plant-art"
      data-plant-stage={stage}
      href={src}
      x={x - rootX * scale}
      y={y - rootY * scale}
      width={width * scale}
      height={height * scale}
    />
  )
}
