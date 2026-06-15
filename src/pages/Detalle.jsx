import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Icon from '../components/Icon.jsx'
import Modal from '../components/Modal.jsx'
import { api } from '../api.js'
import { CATEGORY_ICON } from '../constants.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useT } from '../i18n.js'

export default function Detalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLogged, user } = useAuth()
  const { t, tErr } = useT()
  const [v, setV] = useState(null)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)
  const [fav, setFav] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    api.getVehiculo(id).then(setV).catch(() => setV(null)).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (isLogged) {
      api.getFavoritoIds().then((ids) => setFav(ids.includes(Number(id)))).catch(() => {})
    }
  }, [id, isLogged])

  const toggleFav = async () => {
    if (!isLogged) {
      navigate('/auth')
      return
    }
    try {
      const { favorito } = await api.toggleFavorito(id)
      setFav(favorito)
    } catch {
    }
  }

  const eliminar = async () => {
    setDeleting(true)
    try {
      await api.deleteVehiculo(id)
      navigate('/catalogo')
    } catch (e) {
      setConfirmOpen(false)
      setDeleting(false)
      setErrorMsg(tErr(e.message))
    }
  }

  if (loading) {
    return (
      <>
        <Navbar variant="app" />
        <div className="empty-state">{t('common.loading')}</div>
      </>
    )
  }

  if (!v) {
    return (
      <>
        <Navbar variant="app" />
        <div className="empty-state">{t('common.vehicleNotFound')}</div>
      </>
    )
  }

  const icon = CATEGORY_ICON[v.categoria] || 'directions_car'
  const fotos = v.fotos && v.fotos.length ? v.fotos : []
  const main = fotos[active]
  const hasMultiple = fotos.length > 1
  const prevFoto = () => setActive((i) => (i - 1 + fotos.length) % fotos.length)
  const nextFoto = () => setActive((i) => (i + 1) % fotos.length)

  return (
    <>
      <Navbar variant="app" />
      <div className="detail-grid">
        <div className="detail-main">
          <div className="detail-image-wrap">
            {main ? (
              <img src={main} alt={v.titulo} />
            ) : (
              <div className="detail-hero"><Icon name={icon} className="msi-xl" /></div>
            )}
            {hasMultiple && (
              <>
                <button className="img-nav img-nav-prev" onClick={prevFoto} aria-label={t('detail.prevPhoto')}>
                  <Icon name="chevron_left" className="msi-lg" />
                </button>
                <button className="img-nav img-nav-next" onClick={nextFoto} aria-label={t('detail.nextPhoto')}>
                  <Icon name="chevron_right" className="msi-lg" />
                </button>
              </>
            )}
          </div>

          <div className="thumbs">
            {hasMultiple && (
              <button className="thumb-nav" onClick={prevFoto} aria-label={t('detail.prevPhoto')}>
                <Icon name="chevron_left" className="msi-lg" />
              </button>
            )}
            {(fotos.length ? fotos : [null, null, null, null]).map((f, i) => (
              <div
                key={i}
                className={'thumb' + (i === active ? ' thumb-active' : '')}
                onClick={() => f && setActive(i)}
              >
                {f ? <img src={f} alt="" /> : <Icon name={icon} className="msi-lg" />}
              </div>
            ))}
            {hasMultiple && (
              <button className="thumb-nav" onClick={nextFoto} aria-label={t('detail.nextPhoto')}>
                <Icon name="chevron_right" className="msi-lg" />
              </button>
            )}
          </div>

          <div className="detail-cols">
            <div className="spec-block">
              <h3>{t('detail.specs')}</h3>
              <p>{t('common.brand')}: {v.marca}</p>
              <p>{t('common.model')}: {v.modelo}</p>
              <p>{t('detail.year')}: {v.anio}</p>
              <p>{t('detail.km')}: {v.km}km</p>
              <p>{t('detail.visualCondition')}: {v.condicion}</p>
              <p>{t('detail.color')}: {v.color}</p>
            </div>
            <div className="spec-block">
              <h3>{t('detail.description')}</h3>
              <p>{v.descripcion}</p>
            </div>
          </div>
        </div>

        <aside>
          <div className="detail-side">
            <h1>{v.titulo}</h1>
            <p><strong>{t('detail.price')}</strong> ${v.tarifa}/{t('common.perDay')}</p>
            <p><strong>{t('detail.address')}</strong> {v.direccion}</p>
            {v.ownerNombre && (
              <p className="detail-owner">
                <Icon name="account_circle" className="msi-sm" />
                <span><strong>{t('detail.publishedBy')}</strong> {v.ownerNombre}</span>
              </p>
            )}
            <button
              className={'btn btn-block btn-icon ' + (fav ? 'btn-fav-active' : 'btn-outline')}
              style={{ marginTop: 14 }}
              onClick={toggleFav}
            >
              <Icon name="favorite" className="msi-sm" fill={fav} />
              {fav ? t('detail.inWishlist') : t('detail.addWishlist')}
            </button>
            <button
              className="btn btn-blue btn-block btn-icon"
              style={{ marginTop: 10 }}
              onClick={() => navigate('/reservar/' + id)}
            >
              <Icon name="credit_card" className="msi-sm" /> {t('detail.makeReservation')}
            </button>
            {isLogged && user && v.owner === user.id && (
              <button
                className="btn btn-red btn-block btn-icon"
                style={{ marginTop: 10 }}
                onClick={() => setConfirmOpen(true)}
                disabled={deleting}
              >
                <Icon name="delete" className="msi-sm" /> {deleting ? t('detail.deleting') : t('detail.delete')}
              </button>
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            <h3>{t('detail.fullAddress')}</h3>
            <p style={{ fontWeight: 700, lineHeight: 1.5 }}>{v.direccionCompleta || v.direccion}</p>
          </div>
        </aside>
      </div>

      {confirmOpen && (
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
      )}

      {errorMsg && (
        <Modal
          variant="danger"
          icon="error"
          title={t('common.errorTitle')}
          message={errorMsg}
          confirmLabel={t('common.accept')}
          onClose={() => setErrorMsg('')}
        />
      )}
    </>
  )
}
