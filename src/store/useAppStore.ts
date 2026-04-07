import { create } from 'zustand'
import type { Token } from '@/lib/types'

interface AppStore {
  selectedToken: Token | null
  isPopupOpen: boolean
  setSelectedToken: (token: Token) => void
  closePopup: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  selectedToken: null,
  isPopupOpen: false,
  setSelectedToken: (token) => set({ selectedToken: token, isPopupOpen: true }),
  closePopup: () => set({ selectedToken: null, isPopupOpen: false }),
}))
