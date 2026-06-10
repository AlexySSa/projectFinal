import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useFavIds() {
  const { isLogged } = useAuth()
  const [favIds, setFavIds] = useState([])

  useEffect(() => {
    if (isLogged) api.getFavoritoIds().then(setFavIds).catch(() => setFavIds([]))
    else setFavIds([])
  }, [isLogged])

  return favIds
}
