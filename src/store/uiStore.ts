import { create } from 'zustand'

interface UiStore {
  isCompact: boolean
  setCompact: (isCompact: boolean) => void
}

export const useUiStore = create<UiStore>((set) => ({
  isCompact: false,
  setCompact: (isCompact) => set({ isCompact }),
}))
