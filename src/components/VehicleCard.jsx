import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORY_ICON } from '../constants.js'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useT } from '../i18n.js'
import Img from './Img.jsx'
import Icon from './Icon.jsx'
import Modal from './Modal.jsx'

export default function VehicleCard({ v, fav = false, onToggle, onDelete }) {
  const navigate = useNavigate()
  const { isLogged, isAdmin, user } = useAuth()
  const { t, tErr } = useT()
  const [isFav, setIsFav] = useState(fav)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const cover = v.fotos && v.fotos.length ? v.fotos[0] : null
  const isOwner = isLogged && user && v.owner === user.id

  useEffect(() => setIsFav(fav), [fav])

  const toggle = async (e) => {
    e.stopPropagation()
    if (!isLogged) {
      navigate('/auth')
      return
    }
    try {
      const { favorito } = await api.toggleFavorito(v.id)
      setIsFav(favorito)
      onToggle?.(v.id, favorito)
    } catch {
    }
  }

  const eliminar = async () => {
    setDeleting(true)
    try {
      await api.deleteVehiculo(v.id)
      setConfirmOpen(false)
      onDelete?.(v.id)
    } catch (e) {
      setConfirmOpen(false)
      setDeleting(false)
      setErrorMsg(tErr(e.message))
    }
  }

  return (
    <div className="v-card" onClick={() => navigate('/vehiculo/' + v.id)}>
      <div className="v-thumb">
        <Img src={cover} alt={v.titulo} icon={CATEGORY_ICON[v.categoria] || 'directions_car'} iconClass="msi-xl" />
        {isOwner && (
          <button
            className="v-del"
            onClick={(e) => { e.stopPropagation(); setConfirmOpen(true) }}
            disabled={deleting}
            title={t('detail.delete')}
          >
            <Icon name="delete" className="msi-sm" />
          </button>
        )}
        {!isAdmin && (
          <button
            className={'v-fav' + (isFav ? ' v-fav-active' : '')}
            onClick={toggle}
            title={isFav ? t('fav.remove') : t('fav.add')}
          >
            <Icon name="favorite" className="msi-sm" fill={isFav} />
          </button>
        )}
      </div>
      <div className="v-body">
        <p className="v-title">{v.titulo}</p>
        <p className="v-meta">{t('common.brand')}: {v.marca} &nbsp; {t('common.model')}: {v.modelo}</p>
        <div className="v-foot">
          <span className="v-price">${v.tarifa}/{t('common.perDay')}</span>
          <span className="v-loc"><Icon name="location_on" className="msi-sm" /> {v.direccion}</span>
        </div>
      </div>

      {confirmOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <Modal
            variant="danger"
            icon="delete"
            title={t('detail.delete')}
            message={t('detail.deleteConfirm')}
            confirmLabel={t('common.delete')}
            cancelLabel={t('common.cancel')}
            onConfirm={eliminar}
            onClose={() => setConfirmOpen(false)}
            loading={deleting}
          />
        </div>
      )}

      {errorMsg && (
        <div onClick={(e) => e.stopPropagation()}>
          <Modal
            variant="danger"
            icon="error"
            title={t('common.errorTitle')}
            message={errorMsg}
            confirmLabel={t('common.accept')}
            onClose={() => setErrorMsg('')}
          />
        </div>
      )}
    </div>
  )
}
