import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { WateringIcon } from '../../art/GardenIcons'
import drop from '../../art/assets/scene/watering-drop.svg'
import shovel from '../../art/assets/scene/shovel.svg'
import type { PotId, Tool } from '../../game/types'
import { plantRootY, potCenters, stageHeight, stageWidth } from './layout'

export function HeldTool({ tool }: { tool: Tool }) {
  const icon = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = icon.current
    if (!element) return

    function move(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || !element) return
      element.style.left = `${event.clientX}px`
      element.style.top = `${event.clientY}px`
      element.hidden = false
    }
    function hide() {
      if (element) element.hidden = true
    }

    document.addEventListener('pointermove', move)
    document.documentElement.addEventListener('mouseleave', hide)
    return () => {
      document.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('mouseleave', hide)
    }
  }, [])

  return (
    <div
      ref={icon}
      className="held-tool"
      data-tool={tool}
      hidden
      aria-hidden="true"
    >
      {tool === 'water' ? <WateringIcon /> : <img src={shovel} alt="" />}
    </div>
  )
}

export type PotEffect = {
  id: PotId
  kind: 'watered' | 'harvested'
  text?: string
}

export function PotFeedback({ effect }: { effect: PotEffect }) {
  return (
    <div
      className="pot-effect"
      aria-hidden="true"
      style={{
        left: `${(potCenters[effect.id] / stageWidth) * 100}%`,
        top: `${(plantRootY / stageHeight) * 100}%`,
      }}
    >
      {effect.kind === 'harvested' ? (
        <span className="harvest-effect">{effect.text}</span>
      ) : (
        Array.from({ length: 14 }, (_, index) => (
          <img
            key={index}
            src={drop}
            alt=""
            className="watering-drop"
            style={
              {
                '--drop-offset': `${((index % 7) - 3) * 3}cqw`,
                '--drop-delay': `${(index * 61) % 380}ms`,
              } as CSSProperties
            }
          />
        ))
      )}
    </div>
  )
}
