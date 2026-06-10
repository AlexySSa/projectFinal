import { createContext, useContext, useEffect, useState } from 'react'
import { api, setToken, getToken } from '../api.js'

const AuthContext = createContext(null)
const USER_KEY = 'bahn_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [lang, setLang] = useState('ES')

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  useEffect(() => {
    if (getToken() && !user) {
      api.me().then((r) => setUser(r.user)).catch(() => logout())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async ({ email, password }) => {
    const { token, user: u } = await api.login({ email, password })
    setToken(token)
    setUser(u)
    return u
  }

  const register = async (data) => {
    const { token, user: u } = await api.register(data)
    setToken(token)
    setUser(u)
    return u
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const isLogged = !!user
  const isArrendador = user?.rol === 'arrendador'

  return (
    <AuthContext.Provider value={{ user, isLogged, isArrendador, login, register, logout, lang, setLang }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
