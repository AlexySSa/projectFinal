import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useT } from '../i18n.js'
import UserMenu from './UserMenu.jsx'
import Icon from './Icon.jsx'

export default function Navbar({ variant = 'app', title, search, location, onSearch, showFavorites = false }) {
  const { isLogged, lang, setLang } = useAuth()
  const { t } = useT()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [q, setQ] = useState(search || '')
  const [loc, setLoc] = useState(location || '')

  useEffect(() => { setQ(search || '') }, [search])
  useEffect(() => { setLoc(location || '') }, [location])

  const closeMenu = () => setMenuOpen(false)

  const submitSearch = (e) => {
    e.preventDefault()
    if (onSearch) { onSearch(q, loc); return }
    const sp = new URLSearchParams()
    if (q.trim()) sp.set('q', q.trim())
    if (loc.trim()) sp.set('loc', loc.trim())
    const qs = sp.toString()
    navigate('/catalogo' + (qs ? '?' + qs : ''))
  }

  if (variant === 'titled') {
    return (
      <div className="navbar" onClick={closeMenu}>
        <Link to="/" className="brand">Bahn</Link>
        <div className="navbar-title">{title}</div>
        <UserArea isLogged={isLogged} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} closeMenu={closeMenu} />
      </div>
    )
  }

  return (
    <div className="navbar" onClick={closeMenu}>
      <Link to="/" className="brand">Bahn</Link>

      <form className="search-group" onSubmit={submitSearch}>
        <span className="search-lead"><Icon name="search" className="msi-sm" /></span>
        <input
          className="search-input"
          placeholder={t('search.placeholderVehicle')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="search-divider" />
        <span className="search-lead"><Icon name="location_on" className="msi-sm" /></span>
        <input
          className="search-input"
          placeholder={t('search.placeholderLocation')}
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
        />
        <button className="search-btn" type="submit"><Icon name="search" className="msi-sm" /></button>
      </form>

      <div className="nav-spacer" />

      {showFavorites && (
        <Link to="/favoritos" className="icon-btn" title={t('favorites.title')}><Icon name="favorite" /></Link>
      )}

      <div className="lang-toggle">
        <button className={lang === 'ES' ? 'active' : ''} onClick={() => setLang('ES')} type="button">ES</button>
        <button className={lang === 'EN' ? 'active' : ''} onClick={() => setLang('EN')} type="button">EN</button>
      </div>

      <UserArea isLogged={isLogged} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} closeMenu={closeMenu} />
    </div>
  )
}

function UserArea({ isLogged, navigate, menuOpen, setMenuOpen, closeMenu }) {
  const { t } = useT()
  if (!isLogged) {
    return (
      <button className="btn-login" onClick={() => navigate('/auth')}>
        {t('auth.loginRegister')}
      </button>
    )
  }
  return (
    <>
      <button
        className="user-chip"
        onClick={(e) => {
          e.stopPropagation()
          setMenuOpen((o) => !o)
        }}
      >
        {t('common.user')} <Icon name="account_circle" className="msi-lg" />
      </button>
      <button className="hamburger" onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o) }}>
        <Icon name="menu" />
      </button>
      {menuOpen && <UserMenu onClose={closeMenu} />}
    </>
  )
}
