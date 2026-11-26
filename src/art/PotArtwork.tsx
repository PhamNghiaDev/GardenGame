import pot from './assets/scene/pot.png'

interface PotArtworkProps {
  x: number
  y: number
  size: number
}

export function PotArtwork({ x, y, size }: PotArtworkProps) {
  return <image data-pot="" href={pot} x={x} y={y} width={size} height={size} />
}
