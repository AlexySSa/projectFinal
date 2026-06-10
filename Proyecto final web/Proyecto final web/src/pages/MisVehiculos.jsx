import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import FilterSidebar from '../components/FilterSidebar.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../api.js'
import { useFavIds } from '../hooks/useFavIds.js'

export default function MisVehiculos() {
  const navigate = useNavigate()
  const favIds = useFavIds()
  const [filters, setFilters] = useState({
    peso: '', marca: '', modelo: '', precio: 100, direccion: '', condicion: '',
  })
  const [lista, setLista] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMisVehiculos().then(setLista).catch(() => setLista([])).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar variant="app" showFavorites />
      <div className="catalog-layout">
        <FilterSidebar filters={filters} setFilters={setFilters} />

        <section className="results-card">
          <h2>Mis vehiculos</h2>
          {loading ? (
            <div className="empty-state">Cargando…</div>
          ) : lista.length === 0 ? (
            <div className="empty-state">Aún no has publicado vehículos. Usa el botón + para agregar uno.</div>
          ) : (
            <div className="cards-grid">
              {lista.map((v) => (
                <VehicleCard key={v.id} v={v} fav={favIds.includes(v.id)} />
              ))}
            </div>
          )}
        </section>
      </div>

      <button className="fab" title="Agregar vehículo" onClick={() => navigate('/nuevo-vehiculo')}>
        <Icon name="add" className="msi-lg" />
      </button>
    </>
  )
}
