import { create } from 'zustand'
import blogService from '../services/blogs'
import loginService from '../services/login'
import persistentUser from '../services/persistentUser'

export const useUserStore = create((set) => ({
  user: null,
  initialize: () => {
    const user = persistentUser.getUser()
    if (user) {
      blogService.setToken(user.token)
      set({ user })
    }
  },
  login: async (credentials) => {
    const user = await loginService.login(credentials)
    persistentUser.saveUser(user)
    blogService.setToken(user.token)
    set({ user })
  },
  logout: () => {
    persistentUser.removeUser()
    blogService.setToken(null)
    set({ user: null })
  },
}))
