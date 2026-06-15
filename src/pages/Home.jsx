import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useT } from '../i18n.js'
import { api } from '../api.js'
import { CATEGORY_ICON, CATEGORY_IMAGE } from '../constants.js'
import { useFavIds } from '../hooks/useFavIds.js'
import VehicleCard from '../components/VehicleCard.jsx'
import Icon from '../components/Icon.jsx'
import Img from '../components/Img.jsx'

const CATEGORIES = ['Autos', 'Motocicletas', 'Maquinaria Pesada', 'Agrícola']

export default function Home() {
  const navigate = useNavigate()
  const { lang, setLang, isLogged, isAdmin } = useAuth()
  const { t } = useT()
  const [q, setQ] = useState('')
  const [loc, setLoc] = useState('')
  const [destacados, setDestacados] = useState([])
  const favIds = useFavIds()

  useEffect(() => {
    api.getVehiculos().then((list) => setDestacados(list.slice(0, 4))).catch(() => setDestacados([]))
  }, [])

  const buscar = (e) => {
    e.preventDefault()
    const sp = new URLSearchParams()
    if (q.trim()) sp.set('q', q.trim())
    if (loc.trim()) sp.set('loc', loc.trim())
    const qs = sp.toString()
    navigate('/catalogo' + (qs ? '?' + qs : ''))
  }

  return (
    <div className="page">
      <header className="home-hero">
        <div className="home-topbar">
          <span className="brand">Bahn</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="lang-toggle">
              <button className={lang === 'ES' ? 'active' : ''} onClick={() => setLang('ES')}>ES</button>
              <button className={lang === 'EN' ? 'active' : ''} onClick={() => setLang('EN')}>EN</button>
            </div>
            <button className="btn-login" onClick={() => navigate(isLogged ? (isAdmin ? '/admin' : '/catalogo') : '/auth')}>
              {isLogged ? (isAdmin ? t('home.goAdmin') : t('home.goCatalog')) : t('auth.loginRegister')}
            </button>
          </div>
        </div>

        <h1>{t('home.title')}</h1>
        <p className="subtitle">{t('home.subtitle')}</p>

        <form className="home-search" onSubmit={buscar}>
          <div className="si">
            <Icon name="search" />
            <input
              placeholder={t('home.searchPlaceholder')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="si">
            <Icon name="location_on" />
            <input
              placeholder={t('search.placeholderLocation')}
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
            />
          </div>
          <button className="home-search-btn" type="submit"><Icon name="search" /></button>
        </form>
      </header>

      <main className="home-panel">
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <div key={c} className="cat-card" onClick={() => navigate('/catalogo?cat=' + encodeURIComponent(c))}>
              <div className="cat-thumb">
                <Img src={CATEGORY_IMAGE[c]} alt={c} icon={CATEGORY_ICON[c]} iconClass="msi-xl" />
              </div>
              <h3>{t('cat.' + c)}</h3>
            </div>
          ))}
        </div>

        <div className="section-head">
          <h2>{t('home.featured')}</h2>
          <span className="link-orange" style={{ cursor: 'pointer' }} onClick={() => navigate('/catalogo')}>
            {t('home.exploreCatalog')}
          </span>
        </div>

        <div className="cards-grid">
          {destacados.map((v) => (
            <VehicleCard
              key={v.id}
              v={v}
              fav={favIds.includes(v.id)}
              onDelete={(id) => setDestacados((prev) => prev.filter((x) => x.id !== id))}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
