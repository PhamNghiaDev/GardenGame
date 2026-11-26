import { CoinIcon } from '../../art/GardenIcons'
import rosieFlower from '../../art/assets/rosie/harvest.png'
import { PLANT_IDS, PLANTS } from '../../game/config/plants'
import { useGameStore } from '../../store/gameStore'
import { GardenDialog } from '../GardenDialog'

interface InventoryItemProps {
  name: string
  count: number
  image?: string
  price?: number
}

function InventoryItem({ name, count, image, price }: InventoryItemProps) {
  return (
    <li className="inventory-card">
      <div className="inventory-item-art">
        {image && <img src={image} alt="" />}
        <span className="inventory-quantity">
          <span className="sr-only">Số lượng </span>
          <span aria-hidden="true">×</span>
          {count}
        </span>
      </div>
      {price !== undefined && (
        <span className="inventory-price">
          Giá: <CoinIcon /> {price}
        </span>
      )}
      <strong className="inventory-name">{name}</strong>
    </li>
  )
}

export function Inventory({ onClose }: { onClose: () => void }) {
  const seeds = useGameStore((state) => state.save.seedCounts)
  const flowers = useGameStore((state) => state.save.harvestCounts)
  const seedIds = PLANT_IDS.filter((id) => (seeds[id] ?? 0) > 0)
  const flowerIds = PLANT_IDS.filter((id) => (flowers[id] ?? 0) > 0)

  return (
    <GardenDialog title="Túi đồ" onClose={onClose} className="inventory-dialog">
      <section className="inventory-section">
        <h3 className="inventory-heading">Hạt giống</h3>
        {seedIds.length === 0 ? (
          <p className="inventory-empty">
            Chưa có hạt giống. Ghé cửa hàng nhé.
          </p>
        ) : (
          <ul className="inventory-grid">
            {seedIds.map((id) => (
              <InventoryItem
                key={id}
                name={PLANTS[id].name}
                count={seeds[id] ?? 0}
                image={id === 'rosie' ? rosieFlower : undefined}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="inventory-section">
        <h3 className="inventory-heading">Hoa đã thu hoạch</h3>
        {flowerIds.length === 0 ? (
          <p className="inventory-empty">
            Dùng xẻng thu hoạch khi cây trưởng thành.
          </p>
        ) : (
          <ul className="inventory-grid">
            {flowerIds.map((id) => (
              <InventoryItem
                key={id}
                name={PLANTS[id].name}
                count={flowers[id] ?? 0}
                image={id === 'rosie' ? rosieFlower : undefined}
                price={PLANTS[id].sellPrice}
              />
            ))}
          </ul>
        )}
      </section>
    </GardenDialog>
  )
}
