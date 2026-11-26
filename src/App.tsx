import { useEffect, useState } from 'react'
import { WATER_BONUS_PERCENT } from './game/config/growth'
import { PLANTS } from './game/config/plants'
import type { PlantId } from './game/config/plants'
import type { GardenResult } from './game/systems/garden'
import type { PlantedPot, PotId, Tool } from './game/types'
import { useGameStore } from './store/gameStore'
import { SAVE_KEY } from './store/save'
import { useUiStore } from './store/uiStore'
import { GardenDialog } from './ui/GardenDialog'
import { Hud } from './ui/hud/Hud'
import { Inventory } from './ui/inventory/Inventory'
import { Balcony } from './ui/scene/Balcony'
import { PotControls } from './ui/scene/PotControls'
import { HeldTool, PotFeedback } from './ui/scene/ToolEffects'
import type { PotEffect } from './ui/scene/ToolEffects'
import { useGrowthTime } from './ui/scene/useGrowthTime'
import { Shop } from './ui/shop/Shop'

type SettledResult = Exclude<GardenResult, { kind: 'confirm-uproot' }>
type Panel = 'shop' | 'inventory'

function resultMessage(result: SettledResult, tool: Tool | null): string {
  if ('save' in result) {
    const name = PLANTS[result.plantId].name
    const messages = {
      bought: `Đã mua hạt ${name}`,
      sold: `Đã bán ${name} · +${PLANTS[result.plantId].sellPrice} vàng`,
      planted: `Đã gieo hạt ${name}`,
      watered: `Đã tưới cây · lớn nhanh hơn ${WATER_BONUS_PERCENT}%`,
      harvested: `Đã thu hoạch ${name}`,
      uprooted: 'Đã nhổ cây, chậu trống',
    }
    return messages[result.kind]
  }

  const messages = {
    locked: 'Loài cây này đang khóa.',
    'low-coins': 'Chưa đủ vàng để mua hạt.',
    'no-harvest': 'Chưa có hoa này trong túi.',
    'no-seeds': 'Chưa có hạt giống. Ghé cửa hàng nhé.',
    empty:
      tool === 'water'
        ? 'Chậu đang trống, chưa có gì để tưới.'
        : 'Chậu đang trống.',
    growing: 'Cây đang lớn. Bạn có thể tưới để cây lớn nhanh hơn.',
    mature:
      tool === 'water'
        ? 'Cây đã trưởng thành, không cần tưới nữa.'
        : 'Cây đã trưởng thành. Dùng xẻng để thu hoạch.',
    'pot-changed': 'Chậu đã thay đổi. Chạm lại để tiếp tục.',
  }
  return messages[result.kind]
}

export function App() {
  const isCompact = useUiStore((state) => state.isCompact)
  const [tool, setTool] = useState<Tool | null>(null)
  const [panel, setPanel] = useState<Panel | null>(null)
  const [pending, setPending] = useState<{ id: PotId; pot: PlantedPot } | null>(
    null,
  )
  const [notice, setNotice] = useState<{ text: string } | null>(null)
  const [effect, setEffect] = useState<
    (PotEffect & { sequence: number }) | null
  >(null)
  const save = useGameStore((state) => state.save)
  const now = useGrowthTime(save.pots)
  const seedCount = Object.values(save.seedCounts).reduce(
    (sum, count) => sum + count,
    0,
  )
  const flowerCount = Object.values(save.harvestCounts).reduce(
    (sum, count) => sum + count,
    0,
  )

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setTool(null)
        setPanel(null)
        setPending(null)
      }
      if (
        event.key.toLowerCase() !== 'c' ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.repeat
      )
        return
      const ui = useUiStore.getState()
      ui.setCompact(!ui.isCompact)
      setTool(null)
      setPanel(null)
      setPending(null)
      setNotice(null)
      setEffect(null)
    }

    function syncSave(event: StorageEvent) {
      if (event.key === SAVE_KEY && event.newValue !== null)
        void useGameStore.persist.rehydrate()
    }

    window.addEventListener('keydown', handleKey)
    window.addEventListener('storage', syncSave)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('storage', syncSave)
    }
  }, [])

  useEffect(() => {
    if (!notice) return
    const timeout = setTimeout(() => setNotice(null), 1_800)
    return () => clearTimeout(timeout)
  }, [notice])

  useEffect(() => {
    if (!effect) return
    const timeout = setTimeout(() => setEffect(null), 1_300)
    return () => clearTimeout(timeout)
  }, [effect])

  function openPanel(next: Panel) {
    setTool(null)
    setNotice(null)
    setPanel(next)
  }

  function closePanel() {
    setPanel(null)
    setNotice(null)
  }

  function report(result: SettledResult) {
    setNotice({ text: resultMessage(result, tool) })
  }

  function handlePot(id: PotId) {
    const result = useGameStore.getState().interact(id, tool, Date.now())
    if (result.kind === 'confirm-uproot') {
      setPending({ id, pot: result.pot })
      return
    }

    report(result)
    if (
      'save' in result &&
      (result.kind === 'watered' || result.kind === 'harvested')
    ) {
      const { kind, plantId } = result
      setEffect((previous) => ({
        id,
        kind,
        text: kind === 'harvested' ? `+1 ${PLANTS[plantId].name}` : undefined,
        sequence: (previous?.sequence ?? 0) + 1,
      }))
    }
  }

  function trade(verb: 'buy' | 'sell', id: PlantId) {
    const result = useGameStore.getState()[verb](id)
    if (result.kind !== 'confirm-uproot') report(result)
  }

  function confirmUproot() {
    if (!pending) return
    const result = useGameStore
      .getState()
      .uproot(pending.id, pending.pot, Date.now())
    setPending(null)
    if (result.kind !== 'confirm-uproot') report(result)
  }

  return (
    <main
      className="app"
      data-mode={isCompact ? 'compact' : 'full'}
      aria-label="Balcony Garden"
    >
      <div className="garden-stage">
        <Balcony pots={save.pots} now={now} />
        {!isCompact && (
          <>
            <PotControls
              pots={save.pots}
              now={now}
              hasSeeds={seedCount > 0}
              tool={tool}
              onPot={handlePot}
            />
            <Hud
              itemCount={seedCount + flowerCount}
              tool={tool}
              onTool={(next) =>
                setTool((current) => (current === next ? null : next))
              }
              onShop={() => openPanel('shop')}
              onInventory={() => openPanel('inventory')}
              onExit={() => setNotice({ text: 'Nút Thoát' })}
            />
            {effect && <PotFeedback key={effect.sequence} effect={effect} />}
            {notice && panel === null && pending === null && (
              <p role="status" className="garden-notice">
                {notice.text}
              </p>
            )}
          </>
        )}
      </div>
      {!isCompact && (
        <>
          {tool && panel === null && pending === null && (
            <HeldTool tool={tool} />
          )}
          {panel === 'shop' && (
            <Shop
              notice={notice?.text ?? ''}
              onClose={closePanel}
              onBuy={(id) => trade('buy', id)}
              onSell={(id) => trade('sell', id)}
            />
          )}
          {panel === 'inventory' && <Inventory onClose={closePanel} />}
          {pending && (
            <GardenDialog title="Nhổ cây non?" onClose={() => setPending(null)}>
              <p>
                Chậu sẽ trống để bạn có thể gieo lại. Cây đang lớn sẽ được bỏ
                khỏi chậu.
              </p>
              <div className="dialog-actions">
                <button
                  className="trade-button"
                  type="button"
                  onClick={() => setPending(null)}
                >
                  Giữ cây
                </button>
                <button
                  className="trade-button"
                  type="button"
                  onClick={confirmUproot}
                >
                  Nhổ cây
                </button>
              </div>
            </GardenDialog>
          )}
        </>
      )}
    </main>
  )
}
