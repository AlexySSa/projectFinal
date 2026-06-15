import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useT } from '../i18n.js'
import Icon from './Icon.jsx'

export default function UserMenu({ onClose }) {
  const { user, isAdmin, canManageVehicles, logout, lang, setLang } = useAuth()
  const { t } = useT()
  const navigate = useNavigate()

  const go = (path) => {
    onClose?.()
    navigate(path)
  }

  return (
    <div className="user-menu" onClick={(e) => e.stopPropagation()}>
      <div className="um-user">
        <span>{user?.nombre || t('common.user')}</span>
        <Icon name="account_circle" className="msi-lg" style={{ marginLeft: 'auto' }} />
      </div>

      <div className="um-lang">
        <button className={lang === 'ES' ? 'active' : ''} onClick={() => setLang('ES')}>ES</button>
        <button className={lang === 'EN' ? 'active' : ''} onClick={() => setLang('EN')}>EN</button>
      </div>

      {isAdmin ? (
        <button className="um-item btn-indigo um-item-icon" onClick={() => go('/admin')}>
          <Icon name="monitoring" className="msi-sm" /> {t('menu.adminPanel')}
        </button>
      ) : (
        <>
          {canManageVehicles && (
            <>
              <button className="um-item btn-green um-item-icon" onClick={() => go('/nuevo-vehiculo')}>
                <Icon name="add" className="msi-sm" /> {t('menu.addVehicle')}
              </button>
              <button className="um-item um-item-icon" style={{ background: '#6b7280' }} onClick={() => go('/mis-vehiculos')}>
                <Icon name="directions_car" className="msi-sm" /> {t('menu.myVehicles')}
              </button>
            </>
          )}

          <button className="um-item um-item-icon" style={{ background: '#3a4a8e' }} onClick={() => go('/facturas')}>
            <Icon name="receipt_long" className="msi-sm" /> {t('menu.invoices')}
          </button>
        </>
      )}

      <button
        className="um-item btn-red um-item-icon"
        onClick={() => {
          logout()
          onClose?.()
          navigate('/')
        }}
      >
        <Icon name="logout" className="msi-sm" /> {t('menu.logout')}
      </button>
    </div>
  )
}
