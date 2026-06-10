import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import FilterSidebar from '../components/FilterSidebar.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavIds } from '../hooks/useFavIds.js'

export default function Catalogo() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { isArrendador } = useAuth()
  const favIds = useFavIds()
  const q = (params.get('q') || '').toLowerCase()
  const cat = params.get('cat') || ''

  const [filters, setFilters] = useState({
    peso: '', marca: '', modelo: '', precio: 100, direccion: '', condicion: '',
  })
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.getVehiculos({ q: params.get('q') || '', categoria: cat })
      .then(setAll)
      .catch(() => setAll([]))
      .finally(() => setLoading(false))
  }, [params, cat])

  const resultados = useMemo(() => {
    return all.filter((v) => {
      if (q && !(`${v.titulo} ${v.marca} ${v.modelo}`.toLowerCase().includes(q))) return false
      if (filters.marca && v.marca !== filters.marca) return false
      if (filters.modelo && v.modelo !== filters.modelo) return false
      if (filters.direccion && v.direccion !== filters.direccion) return false
      if (filters.condicion && v.condicion !== filters.condicion) return false
      return true
    })
  }, [all, q, filters])

  return (
    <>
      <Navbar variant="app" search={params.get('q') || ''} showFavorites />
      <div className="catalog-layout">
        <FilterSidebar filters={filters} setFilters={setFilters} />

        <section className="results-card">
          <h2>Resultados</h2>
          {loading ? (
            <div className="empty-state">Cargando vehículos…</div>
          ) : resultados.length === 0 ? (
            <div className="empty-state">No se encontraron vehículos con esos filtros.</div>
          ) : (
            <div className="cards-grid">
              {resultados.map((v) => (
                <VehicleCard key={v.id} v={v} fav={favIds.includes(v.id)} />
              ))}
            </div>
          )}
        </section>
      </div>

      {isArrendador && (
        <button className="fab" title="Agregar vehículo" onClick={() => navigate('/nuevo-vehiculo')}>
          <Icon name="add" className="msi-lg" />
        </button>
      )}
    </>
  )
}
