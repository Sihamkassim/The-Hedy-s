import { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const loading = useAuthStore((s) => s.loading)
  const initialize = useAuthStore((s) => s.initialize)
  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    initialize()
  }, [initialize])

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
