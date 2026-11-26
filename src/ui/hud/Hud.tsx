import {
  CoinIcon,
  ExitIcon,
  InventoryIcon,
  ShopIcon,
  WateringIcon,
} from '../../art/GardenIcons'
import shovel from '../../art/assets/scene/shovel.svg'
import type { Tool } from '../../game/types'
import { useGameStore } from '../../store/gameStore'

interface HudProps {
  itemCount: number
  tool: Tool | null
  onTool: (tool: Tool) => void
  onShop: () => void
  onInventory: () => void
  onExit: () => void
}

export function Hud({
  itemCount,
  tool,
  onTool,
  onShop,
  onInventory,
  onExit,
}: HudProps) {
  const coins = useGameStore((state) => state.save.coins)
  const muted = useGameStore((state) => state.save.audioMuted)
  const setMuted = useGameStore((state) => state.setMuted)

  return (
    <div
      className="garden-hud pointer-events-none absolute inset-0"
      role="group"
      aria-label="Điều khiển bản Full"
    >
      <div className="hud-corner top-0 left-0 flex items-center">
        <span className="hud-item hud-counter" aria-label={`${coins} vàng`}>
          <CoinIcon />
          {coins}
        </span>
        <button
          className="hud-item hud-button relative cursor-pointer"
          type="button"
          aria-label="Túi đồ"
          onClick={onInventory}
        >
          <InventoryIcon />
          {itemCount > 0 && (
            <span className="hud-badge" aria-hidden="true">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      <div className="hud-corner top-0 right-0 flex items-center">
        <button
          className="hud-item hud-button cursor-pointer"
          type="button"
          aria-label="Tắt tiếng"
          aria-pressed={muted}
          onClick={() => setMuted(!muted)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M4 9h4l5-4v14l-5-4H4Z" strokeLinejoin="round" />
            {muted ? (
              <path d="m16 10 5 5m0-5-5 5" />
            ) : (
              <path d="M16 8a6 6 0 0 1 0 8m2-10a9 9 0 0 1 0 12" />
            )}
          </svg>
        </button>
        <button
          className="hud-item hud-button hud-exit cursor-pointer"
          type="button"
          aria-label="Exit"
          onClick={onExit}
        >
          <ExitIcon />
        </button>
      </div>

      <div className="hud-corner bottom-0 left-0">
        <button
          className="hud-item hud-tool hud-shop cursor-pointer"
          type="button"
          onClick={onShop}
        >
          <ShopIcon />
          <span>Cửa hàng</span>
        </button>
      </div>

      <div className="hud-corner right-0 bottom-0 flex flex-col items-end">
        <button
          className="hud-item hud-tool hud-shovel cursor-pointer"
          type="button"
          aria-pressed={tool === 'shovel'}
          onClick={() => onTool('shovel')}
        >
          <img src={shovel} alt="" />
          <span>Xẻng</span>
        </button>
        <button
          className="hud-item hud-tool hud-water cursor-pointer"
          type="button"
          aria-label="Bình tưới nước"
          aria-pressed={tool === 'water'}
          onClick={() => onTool('water')}
        >
          <WateringIcon />
          <span>Tưới cây</span>
        </button>
      </div>

      {tool && (
        <p className="tool-status" role="status">
          {tool === 'water' ? 'Đang cầm bình tưới' : 'Đang cầm xẻng'} · Bấm lại
          hoặc Esc để cất
        </p>
      )}
    </div>
  )
}
