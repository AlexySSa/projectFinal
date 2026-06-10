import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import FilterSidebar from '../components/FilterSidebar.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../api.js'
import { useFavIds } from '../hooks/useFavIds.js'
import { useT } from '../i18n.js'
import { filtrarVehiculos } from '../filters.js'

export default function MisVehiculos() {
  const navigate = useNavigate()
  const favIds = useFavIds()
  const { t } = useT()
  const [filters, setFilters] = useState({
    peso: '', marca: '', modelo: '', precio: 100, direccion: '', condicion: '',
  })
  const [lista, setLista] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMisVehiculos().then(setLista).catch(() => setLista([])).finally(() => setLoading(false))
  }, [])

  const resultados = useMemo(() => filtrarVehiculos(lista, filters), [lista, filters])

  return (
    <>
      <Navbar variant="app" showFavorites />
      <div className="catalog-layout">
        <FilterSidebar filters={filters} setFilters={setFilters} />

        <section className="results-card">
          <h2>{t('myVehicles.title')}</h2>
          {loading ? (
            <div className="empty-state">{t('common.loading')}</div>
          ) : lista.length === 0 ? (
            <div className="empty-state">{t('myVehicles.empty')}</div>
          ) : resultados.length === 0 ? (
            <div className="empty-state">{t('catalog.noResults')}</div>
          ) : (
            <div className="cards-grid">
              {resultados.map((v) => (
                <VehicleCard
                  key={v.id}
                  v={v}
                  fav={favIds.includes(v.id)}
                  onDelete={(id) => setLista((prev) => prev.filter((x) => x.id !== id))}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <button className="fab" title={t('vehicle.addVehicle')} onClick={() => navigate('/nuevo-vehiculo')}>
        <Icon name="add" className="msi-lg" />
      </button>
    </>
  )
}
