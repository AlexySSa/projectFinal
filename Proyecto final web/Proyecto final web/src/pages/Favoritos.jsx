import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import FilterSidebar from '../components/FilterSidebar.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../api.js'
import { useT } from '../i18n.js'
import { filtrarVehiculos } from '../filters.js'

export default function Favoritos() {
  const navigate = useNavigate()
  const { t } = useT()
  const [filters, setFilters] = useState({
    peso: '', marca: '', modelo: '', precio: 100, direccion: '', condicion: '',
  })
  const [lista, setLista] = useState([])
  const [loading, setLoading] = useState(true)

  const cargar = () => api.getFavoritos().then(setLista).catch(() => setLista([])).finally(() => setLoading(false))

  useEffect(() => {
    cargar()
  }, [])

  const resultados = useMemo(() => filtrarVehiculos(lista, filters), [lista, filters])

  const handleToggle = () => cargar()

  return (
    <>
      <Navbar variant="app" showFavorites />
      <div className="catalog-layout">
        <FilterSidebar filters={filters} setFilters={setFilters} />

        <section className="results-card">
          <h2>{t('favorites.title')}</h2>

          {loading ? (
            <div className="empty-state">{t('common.loading')}</div>
          ) : lista.length === 0 ? (
            <div className="empty-state">
              <Icon name="favorite" className="msi-xl" style={{ color: '#c2cad8' }} />
              <p style={{ marginTop: 12 }}>{t('favorites.empty')}</p>
              <button className="btn btn-orange" style={{ marginTop: 8 }} onClick={() => navigate('/catalogo')}>
                {t('home.exploreCatalog')}
              </button>
            </div>
          ) : resultados.length === 0 ? (
            <div className="empty-state">{t('catalog.noResults')}</div>
          ) : (
            <div className="cards-grid">
              {resultados.map((v) => (
                <VehicleCard
                  key={v.id}
                  v={v}
                  fav
                  onToggle={handleToggle}
                  onDelete={(id) => setLista((prev) => prev.filter((x) => x.id !== id))}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
