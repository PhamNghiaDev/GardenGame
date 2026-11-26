import { CoinIcon } from '../../art/GardenIcons'
import seedPacket from '../../art/assets/rosie/seed-packet.svg'
import harvest from '../../art/assets/rosie/harvest.png'
import { PLANT_IDS, PLANTS } from '../../game/config/plants'
import { useGameStore } from '../../store/gameStore'
import { GardenDialog } from '../GardenDialog'

export function Inventory({ onClose }: { onClose: () => void }) {
  const seeds = useGameStore((state) => state.save.seedCounts)
  const flowers = useGameStore((state) => state.save.harvestCounts)
  const seedIds = PLANT_IDS.filter((id) => (seeds[id] ?? 0) > 0)
  const flowerIds = PLANT_IDS.filter((id) => (flowers[id] ?? 0) > 0)

  return (
    <GardenDialog title="Túi đồ" onClose={onClose}>
      <h3 className="inventory-heading">Hạt giống</h3>
      {seedIds.length === 0 ? (
        <p className="dialog-empty">Chưa có hạt giống. Ghé cửa hàng nhé.</p>
      ) : (
        <ul className="inventory-grid">
          {seedIds.map((id) => (
            <li className="inventory-card" key={id}>
              {id === 'rosie' && <img src={seedPacket} alt="" />}
              <strong>{PLANTS[id].name}</strong>
              <span>×{seeds[id]}</span>
            </li>
          ))}
        </ul>
      )}

      <h3 className="inventory-heading">Hoa đã thu hoạch</h3>
      {flowerIds.length === 0 ? (
        <p className="dialog-empty">
          Dùng xẻng thu hoạch khi cây trưởng thành.
        </p>
      ) : (
        <ul className="inventory-grid">
          {flowerIds.map((id) => (
            <li className="inventory-card" key={id}>
              {id === 'rosie' && <img src={harvest} alt="" />}
              <strong>{PLANTS[id].name}</strong>
              <span>×{flowers[id]}</span>
              <span className="inventory-price">
                <CoinIcon /> {PLANTS[id].sellPrice}
              </span>
            </li>
          ))}
        </ul>
      )}
    </GardenDialog>
  )
}
