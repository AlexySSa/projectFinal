import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORY_ICON } from '../constants.js'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Img from './Img.jsx'
import Icon from './Icon.jsx'

export default function VehicleCard({ v, fav = false, onToggle }) {
  const navigate = useNavigate()
  const { isLogged } = useAuth()
  const [isFav, setIsFav] = useState(fav)
  const cover = v.fotos && v.fotos.length ? v.fotos[0] : null

  useEffect(() => setIsFav(fav), [fav])

  const toggle = async (e) => {
    e.stopPropagation()
    if (!isLogged) {
      navigate('/auth')
      return
    }
    try {
      const { favorito } = await api.toggleFavorito(v.id)
      setIsFav(favorito)
      onToggle?.(v.id, favorito)
    } catch {
      /* ignora errores de red en el toggle */
    }
  }

  return (
    <div className="v-card" onClick={() => navigate('/vehiculo/' + v.id)}>
      <div className="v-thumb">
        <Img src={cover} alt={v.titulo} icon={CATEGORY_ICON[v.categoria] || 'directions_car'} iconClass="msi-xl" />
        <button
          className={'v-fav' + (isFav ? ' v-fav-active' : '')}
          onClick={toggle}
          title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Icon name="favorite" className="msi-sm" fill={isFav} />
        </button>
      </div>
      <div className="v-body">
        <p className="v-title">{v.titulo}</p>
        <p className="v-meta">Marca: {v.marca} &nbsp; Modelo: {v.modelo}</p>
        <div className="v-foot">
          <span className="v-price">${v.tarifa}/día</span>
          <span className="v-loc"><Icon name="location_on" className="msi-sm" /> {v.direccion}</span>
        </div>
      </div>
    </div>
  )
}
