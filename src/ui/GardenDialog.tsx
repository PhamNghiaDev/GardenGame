import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { ExitIcon } from '../art/GardenIcons'

interface GardenDialogProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export function GardenDialog({ title, onClose, children }: GardenDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    element.showModal()
    return () => element.close()
  }, [])

  return (
    <dialog
      ref={dialog}
      className="garden-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="garden-dialog-body">
        <header className="garden-dialog-header">
          <h2 id={titleId}>{title}</h2>
          <button
            className="dialog-close"
            type="button"
            aria-label="Đóng"
            onClick={onClose}
          >
            <ExitIcon />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}
