import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import FilterSidebar from '../components/FilterSidebar.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../api.js'

export default function Favoritos() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    peso: '', marca: '', modelo: '', precio: 100, direccion: '', condicion: '',
  })
  const [lista, setLista] = useState([])
  const [loading, setLoading] = useState(true)

  const cargar = () => api.getFavoritos().then(setLista).catch(() => setLista([])).finally(() => setLoading(false))

  useEffect(() => {
    cargar()
  }, [])

  const handleToggle = () => cargar()

  return (
    <>
      <Navbar variant="app" showFavorites />
      <div className="catalog-layout">
        <FilterSidebar filters={filters} setFilters={setFilters} />

        <section className="results-card">
          <h2>Favoritos</h2>

          {loading ? (
            <div className="empty-state">Cargando…</div>
          ) : lista.length === 0 ? (
            <div className="empty-state">
              <Icon name="favorite" className="msi-xl" style={{ color: '#c2cad8' }} />
              <p style={{ marginTop: 12 }}>Aún no tienes vehículos en favoritos.</p>
              <button className="btn btn-orange" style={{ marginTop: 8 }} onClick={() => navigate('/catalogo')}>
                Explorar catálogo
              </button>
            </div>
          ) : (
            <div className="cards-grid">
              {lista.map((v) => (
                <VehicleCard key={v.id} v={v} fav onToggle={handleToggle} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
