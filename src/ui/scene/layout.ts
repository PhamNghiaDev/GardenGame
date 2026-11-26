import type { PotId } from '../../game/types'

// Original coordinates in the 1920 × 1440 scene from docs/prototype/ver2.2.html.
export const stageWidth = 1920
export const stageHeight = 1440
export const potSize = 320
export const potImageY = 1390 - (251 / 256) * potSize
export const potBaseY = 1390
export const plantRootY = potImageY + 0.1 * potSize
export const plantScale = (potSize / 256) * 0.62 * 1.5
export const potCenters = {
  left: 390,
  center: 930,
  right: 1470,
} satisfies Record<PotId, number>
