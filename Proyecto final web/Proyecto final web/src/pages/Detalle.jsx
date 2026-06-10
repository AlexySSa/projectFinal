import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../api.js'
import { CATEGORY_ICON } from '../constants.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Detalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLogged } = useAuth()
  const [v, setV] = useState(null)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)
  const [fav, setFav] = useState(false)

  useEffect(() => {
    api.getVehiculo(id).then(setV).catch(() => setV(null)).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (isLogged) {
      api.getFavoritoIds().then((ids) => setFav(ids.includes(Number(id)))).catch(() => {})
    }
  }, [id, isLogged])

  const toggleFav = async () => {
    if (!isLogged) {
      navigate('/auth')
      return
    }
    try {
      const { favorito } = await api.toggleFavorito(id)
      setFav(favorito)
    } catch {
      /* ignora */
    }
  }

  if (loading) {
    return (
      <>
        <Navbar variant="app" />
        <div className="empty-state">Cargando…</div>
      </>
    )
  }

  if (!v) {
    return (
      <>
        <Navbar variant="app" />
        <div className="empty-state">Vehículo no encontrado.</div>
      </>
    )
  }

  const icon = CATEGORY_ICON[v.categoria] || 'directions_car'
  const fotos = v.fotos && v.fotos.length ? v.fotos : []
  const main = fotos[active]

  return (
    <>
      <Navbar variant="app" />
      <div className="detail-grid">
        <div className="detail-main">
          {main ? (
            <img src={main} alt={v.titulo} />
          ) : (
            <div className="detail-hero"><Icon name={icon} className="msi-xl" /></div>
          )}

          <div className="thumbs">
            {(fotos.length ? fotos : [null, null, null, null]).map((f, i) => (
              <div
                key={i}
                className={'thumb' + (i === active ? ' thumb-active' : '')}
                onClick={() => f && setActive(i)}
              >
                {f ? <img src={f} alt="" /> : <Icon name={icon} className="msi-lg" />}
              </div>
            ))}
            <Icon name="chevron_right" className="msi-lg" style={{ color: '#5a6478' }} />
          </div>

          <div className="detail-cols">
            <div className="spec-block">
              <h3>Especificaciones:</h3>
              <p>Marca: {v.marca}</p>
              <p>Modelo: {v.modelo}</p>
              <p>Año: {v.anio}</p>
              <p>KM: {v.km}km</p>
              <p>Condición visual: {v.condicion}</p>
              <p>Color: {v.color}</p>
            </div>
            <div className="spec-block">
              <h3>Descripción:</h3>
              <p>{v.descripcion}</p>
            </div>
          </div>
        </div>

        <aside>
          <div className="detail-side">
            <h1>{v.titulo}</h1>
            <p><strong>Precio:</strong> ${v.tarifa}/día</p>
            <p><strong>Dirección:</strong> {v.direccion}</p>
            <button
              className={'btn btn-block btn-icon ' + (fav ? 'btn-fav-active' : 'btn-outline')}
              style={{ marginTop: 14 }}
              onClick={toggleFav}
            >
              <Icon name="favorite" className="msi-sm" fill={fav} />
              {fav ? 'En tus deseados' : 'Agregar a deseados'}
            </button>
            <button
              className="btn btn-blue btn-block btn-icon"
              style={{ marginTop: 10 }}
              onClick={() => navigate('/reservar/' + id)}
            >
              <Icon name="credit_card" className="msi-sm" /> Realizar reserva
            </button>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3>Dirección completa:</h3>
            <p style={{ fontWeight: 700, lineHeight: 1.5 }}>{v.direccionCompleta || v.direccion}</p>
          </div>
        </aside>
      </div>
    </>
  )
}
