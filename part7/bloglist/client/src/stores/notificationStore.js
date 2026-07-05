import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  notification: null,
  setNotification: (notification) => {
    set({ notification })
    if (notification) {
      setTimeout(() => {
        set({ notification: null })
      }, 5000)
    }
  },
  clearNotification: () => set({ notification: null }),
}))
