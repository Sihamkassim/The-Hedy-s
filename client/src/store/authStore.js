import { create } from 'zustand'
import { authAPI } from '../api/services'

const getSavedAuth = () => {
  const savedToken = localStorage.getItem('herspace_token')
  const savedUser = localStorage.getItem('herspace_user')

  if (!savedToken || !savedUser) {
    return { token: null, user: null }
  }

  try {
    return {
      token: savedToken,
      user: JSON.parse(savedUser),
    }
  } catch {
    return { token: null, user: null }
  }
}

const persistAuth = (token, user) => {
  if (!token || !user) return
  localStorage.setItem('herspace_token', token)
  localStorage.setItem('herspace_user', JSON.stringify(user))
}

const clearAuth = () => {
  localStorage.removeItem('herspace_token')
  localStorage.removeItem('herspace_user')
}

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: true,

  initialize: () => {
    const { token, user } = getSavedAuth()
    set({ token, user, loading: false })
  },

  login: async (email, password) => {
    const res = await authAPI.login({ email, password })
    const { token, data } = res.data
    persistAuth(token, data.user)
    set({ token, user: data.user })
    return data.user
  },

  register: async (payload) => {
    const res = await authAPI.register(payload)
    const { token, data } = res.data
    persistAuth(token, data.user)
    set({ token, user: data.user })
    return data.user
  },

  logout: () => {
    clearAuth()
    set({ user: null, token: null })
  },
}))
