import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken } from '../api.js'

const AuthContext = createContext(null)
const USER_KEY = 'bahn_user'
const LANG_KEY = 'bahn_lang'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY)
    return saved === 'EN' || saved === 'ES' ? saved : 'ES'
  })

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang)
    document.documentElement.lang = lang.toLowerCase()
  }, [lang])

  useEffect(() => {
    if (getToken() && !user) {
      api.me().then((response) => setUser(response.user)).catch(() => logout())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async ({ email, password }) => {
    const { token, user: nextUser } = await api.login({ email, password })
    setToken(token)
    setUser(nextUser)
    return nextUser
  }

  const register = async (data) => {
    const { token, user: nextUser } = await api.register(data)
    setToken(token)
    setUser(nextUser)
    return nextUser
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const isLogged = Boolean(user)
  const isAdmin = user?.rol === 'admin'
  const isArrendador = user?.rol === 'arrendador'
  const canManageVehicles = isArrendador && !isAdmin

  return (
    <AuthContext.Provider
      value={{
        user,
        isLogged,
        isAdmin,
        isArrendador,
        canManageVehicles,
        login,
        register,
        logout,
        lang,
        setLang,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
