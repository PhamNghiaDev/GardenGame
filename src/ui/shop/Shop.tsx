import { useState } from 'react'
import { CoinIcon } from '../../art/GardenIcons'
import rosieFlower from '../../art/assets/rosie/harvest.png'
import { PLANT_IDS, PLANTS } from '../../game/config/plants'
import type { PlantId } from '../../game/config/plants'
import { useGameStore } from '../../store/gameStore'
import { GardenDialog } from '../GardenDialog'

interface ShopProps {
  notice: string
  onClose: () => void
  onBuy: (id: PlantId) => void
  onSell: (id: PlantId) => void
}

export function Shop({ notice, onClose, onBuy, onSell }: ShopProps) {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy')
  const save = useGameStore((state) => state.save)
  const flowers = PLANT_IDS.filter((id) => (save.harvestCounts[id] ?? 0) > 0)

  return (
    <GardenDialog title="Cửa hàng" onClose={onClose}>
      <p className="shop-balance">
        <CoinIcon /> <span>{save.coins} vàng</span>
      </p>
      <div className="shop-tabs" role="group" aria-label="Giao dịch">
        <button
          type="button"
          aria-pressed={tab === 'buy'}
          onClick={() => setTab('buy')}
        >
          Mua hạt giống
        </button>
        <button
          type="button"
          aria-pressed={tab === 'sell'}
          onClick={() => setTab('sell')}
        >
          Bán cây
        </button>
      </div>

      {tab === 'buy' ? (
        <ul className="shop-list">
          {PLANT_IDS.map((id) => {
            const plant = PLANTS[id]
            const unlocked = save.unlockedPlantIds.includes(id)
            return (
              <li key={id} className="shop-row">
                {id === 'rosie' && <img src={rosieFlower} alt="" />}
                <div className="min-w-0 flex-1">
                  <strong>Hạt {plant.name}</strong>
                  {id === 'rosie' && <p>Hoa cúc vàng nhỏ xinh, dễ trồng.</p>}
                </div>
                {unlocked ? (
                  <button
                    className="trade-button"
                    type="button"
                    aria-label={`Mua hạt ${plant.name}`}
                    disabled={save.coins < plant.seedPrice}
                    onClick={() => onBuy(id)}
                  >
                    <CoinIcon /> {plant.seedPrice}
                  </button>
                ) : (
                  <span className="shop-locked">Đang khóa</span>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <ul className="shop-list">
          {flowers.length === 0 && (
            <li className="dialog-empty">Chưa có hoa để bán.</li>
          )}
          {flowers.map((id) => {
            const plant = PLANTS[id]
            return (
              <li key={id} className="shop-row">
                {id === 'rosie' && <img src={rosieFlower} alt="" />}
                <div className="min-w-0 flex-1">
                  <strong>{plant.name}</strong>
                  <p>Trong túi · {save.harvestCounts[id]}</p>
                </div>
                <button
                  className="trade-button"
                  type="button"
                  aria-label={`Bán ${plant.name}`}
                  onClick={() => onSell(id)}
                >
                  <CoinIcon /> {plant.sellPrice}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <p className="shop-notice" role="status">
        {notice}
      </p>
    </GardenDialog>
  )
}
