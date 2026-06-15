import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import FilterSidebar from '../components/FilterSidebar.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useT } from '../i18n.js'
import { useFavIds } from '../hooks/useFavIds.js'
import { filtrarVehiculos } from '../filters.js'

export default function Catalogo() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { canManageVehicles } = useAuth()
  const { t } = useT()
  const favIds = useFavIds()
  const q = params.get('q') || ''
  const loc = params.get('loc') || ''
  const cat = params.get('cat') || ''

  const [filters, setFilters] = useState({
    peso: '', marca: '', modelo: '', precio: 100, direccion: '', condicion: '',
  })
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.getVehiculos(cat ? { categoria: cat } : {})
      .then(setAll)
      .catch(() => setAll([]))
      .finally(() => setLoading(false))
  }, [cat])

  const resultados = useMemo(() => filtrarVehiculos(all, filters, q, loc), [all, q, loc, filters])

  return (
    <>
      <Navbar variant="app" search={q} location={loc} showFavorites />
      <div className="catalog-layout">
        <FilterSidebar filters={filters} setFilters={setFilters} />

        <section className="results-card">
          <h2>{t('catalog.results')}</h2>
          {loading ? (
            <div className="empty-state">{t('common.loadingVehicles')}</div>
          ) : resultados.length === 0 ? (
            <div className="empty-state">{t('catalog.noResults')}</div>
          ) : (
            <div className="cards-grid">
              {resultados.map((v) => (
                <VehicleCard
                  key={v.id}
                  v={v}
                  fav={favIds.includes(v.id)}
                  onDelete={(id) => setAll((prev) => prev.filter((x) => x.id !== id))}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {canManageVehicles && (
        <button className="fab" title={t('vehicle.addVehicle')} onClick={() => navigate('/nuevo-vehiculo')}>
          <Icon name="add" className="msi-lg" />
        </button>
      )}
    </>
  )
}
