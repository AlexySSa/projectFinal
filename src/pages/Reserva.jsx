import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { PayPalScriptProvider, PayPalButtons as PayPalSDKButtons } from '@paypal/react-paypal-js'
import Navbar from '../components/Navbar.jsx'
import Icon from '../components/Icon.jsx'
import Img from '../components/Img.jsx'
import PayPalButtons from '../components/PayPalButtons.jsx'
import SuccessModal from '../components/SuccessModal.jsx'
import { api } from '../api.js'
import { CATEGORY_ICON } from '../constants.js'
import { useT } from '../i18n.js'

const DAY = 86400000
const toInput = (d) => new Date(d).toISOString().slice(0, 10)
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID

const fmt = (d) => {
  const [y, m, day] = d.slice(0, 10).split('-')
  return `${day}/${m}/${y}`
}

export default function Reserva() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, tErr } = useT()
  const [v, setV] = useState(null)
  const [loading, setLoading] = useState(true)

  const [inicio, setInicio] = useState(toInput(Date.now()))
  const [fin, setFin] = useState(toInput(Date.now() + DAY))
  const [nombre, setNombre] = useState('')
  const [success, setSuccess] = useState(false)
  const [factura, setFactura] = useState(null)
  const [error, setError] = useState('')
  const [ocupadas, setOcupadas] = useState([])

  useEffect(() => {
    api.getVehiculo(id).then(setV).catch(() => setV(null)).finally(() => setLoading(false))
  }, [id])

  const cargarOcupadas = () => {
    const hoy = toInput(Date.now())
    return api.getOcupadas(id)
      .then((r) =>
        setOcupadas(
          r
            .map((x) => ({ inicio: x.inicio.slice(0, 10), fin: x.fin.slice(0, 10) }))
            .filter((x) => x.fin >= hoy)
        )
      )
      .catch(() => setOcupadas([]))
  }

  useEffect(() => {
    cargarOcupadas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const dias = useMemo(() => {
    const d = Math.round((new Date(fin) - new Date(inicio)) / DAY)
    return d > 0 ? d : 0
  }, [inicio, fin])

  const ocupado = useMemo(() => {
    const s = new Date(inicio).getTime()
    const e = new Date(fin).getTime()
    return ocupadas.some((r) => {
      const rs = new Date(r.inicio).getTime()
      const re = new Date(r.fin).getTime()
      return rs < e && s < re
    })
  }, [inicio, fin, ocupadas])

  if (loading) {
    return (
      <>
        <Navbar variant="titled" title={t('reserva.title')} />
        <div className="empty-state">{t('common.loading')}</div>
      </>
    )
  }

  if (!v) {
    return (
      <>
        <Navbar variant="titled" title={t('reserva.title')} />
        <div className="empty-state">{t('common.vehicleNotFound')}</div>
      </>
    )
  }

  const tarifa = Number(v.tarifa) || 0
  const subtotal = tarifa * dias
  const servicio = Math.round(subtotal * 0.1 * 100) / 100
  const total = subtotal + servicio
  const fechasValidas = dias > 0
  const disponible = fechasValidas && !ocupado

  const datosReserva = () => ({
    vehiculoId: v.id,
    inicio,
    fin,
    dias,
    total,
    nombre,
  })

  const finalizar = async (orderId) => {
    const r = await api.paypalCapture(orderId, { reserva: datosReserva() })
    if (r?.facturaId) setFactura({ id: r.facturaId, numero: r.numeroFactura })
    setSuccess(true)
  }

  const descargarFactura = async () => {
    if (!factura) return
    try {
      const blob = await api.downloadFactura(factura.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `factura-${factura.numero}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
    }
  }

  const pagarSimulado = async () => {
    if (!disponible) return
    setError('')
    try {
      const order = await api.paypalCreateOrder({ total, reserva: datosReserva() })
      await finalizar(order.id)
    } catch (e) {
      setError(tErr(e.message))
      cargarOcupadas()
    }
  }

  const cover = v.fotos && v.fotos.length ? v.fotos[0] : null

  return (
    <>
      <Navbar variant="titled" title={t('reserva.title')} />
      <div className="back-bar">
        <button className="back-link" onClick={() => navigate(-1)}>
          <Icon name="arrow_back" className="msi-sm" /> {t('common.back')}
        </button>
      </div>

      <div className="reserva-wrap">
        <div className="reserva-grid">
          <div className="reserva-left">
            <div className="res-vehicle">
              <div className="res-vehicle-thumb">
                <Img src={cover} alt={v.titulo} icon={CATEGORY_ICON[v.categoria] || 'directions_car'} iconClass="msi-xl" />
              </div>
              <div>
                <h3>{v.titulo}</h3>
                <p className="res-meta">{t('common.brand')}: {v.marca} · {t('common.model')}: {v.modelo}</p>
                <p className="res-meta"><Icon name="location_on" className="msi-sm" /> {v.direccion}</p>
                <p className="res-price">${tarifa}/{t('common.perDay')}</p>
              </div>
            </div>

            <div className="reserva-card">
              <h3>{t('reserva.details')}</h3>
              <div className="two-col">
                <div>
                  <label className="field-label">{t('reserva.startDate')}</label>
                  <input type="date" className="field" value={inicio} min={toInput(Date.now())} onChange={(e) => setInicio(e.target.value)} />
                </div>
                <div>
                  <label className="field-label">{t('reserva.endDate')}</label>
                  <input type="date" className="field" value={fin} min={inicio} onChange={(e) => setFin(e.target.value)} />
                </div>
              </div>

              <label className="field-label">{t('reserva.bookerName')}</label>
              <input className="field" placeholder={t('auth.fullName')} value={nombre} onChange={(e) => setNombre(e.target.value)} />

              <label className="field-label">{t('reserva.deliveryPlace')}</label>
              <input className="field" defaultValue={v.direccionCompleta || v.direccion} />

              {!fechasValidas && (
                <p className="res-warning"><Icon name="error" className="msi-sm" /> {t('reserva.dateError')}</p>
              )}
              {fechasValidas && ocupado && (
                <p className="res-warning"><Icon name="event_busy" className="msi-sm" /> {t('reserva.overlapError')}</p>
              )}

              {ocupadas.length > 0 && (
                <div className="ocupadas-box">
                  <span className="ocupadas-title"><Icon name="event_busy" className="msi-sm" /> {t('reserva.unavailableDates')}</span>
                  <ul>
                    {ocupadas.map((r, i) => (
                      <li key={i}>{fmt(r.inicio)} → {fmt(r.fin)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <aside className="reserva-summary">
            <h3>{t('reserva.paymentSummary')}</h3>

            <div className="summary-row">
              <span>${tarifa} × {dias} {dias === 1 ? t('common.day') : t('common.days')}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>{t('reserva.serviceFee')}</span>
              <span>${servicio.toFixed(2)}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row summary-total">
              <span>{t('reserva.total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="summary-pay-label">{t('reserva.paymentMethod')}</div>

            {error && <div className="auth-error" style={{ marginBottom: 10 }}>{error}</div>}

            {!disponible ? (
              <button className="btn btn-block" style={{ background: '#c2cad8', color: '#fff' }} disabled>
                {ocupado ? t('reserva.datesUnavailable') : t('reserva.selectValidDates')}
              </button>
            ) : PAYPAL_CLIENT_ID ? (
              <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD' }}>
                <PayPalSDKButtons
                  forceReRender={[total, inicio, fin]}
                  style={{ layout: 'vertical', shape: 'pill' }}
                  createOrder={() =>
                    api.paypalCreateOrder({ total, reserva: datosReserva() })
                      .then((o) => o.id)
                      .catch((e) => {
                        setError(tErr(e.message))
                        cargarOcupadas()
                        throw e
                      })
                  }
                  onApprove={(data) => finalizar(data.orderID)}
                  onError={() => setError(t('reserva.paypalError'))}
                />
              </PayPalScriptProvider>
            ) : (
              <PayPalButtons onPay={pagarSimulado} />
            )}
          </aside>
        </div>
      </div>

      {success && (
        <SuccessModal
          message={t('reserva.success')}
          invoice={factura ? { numero: factura.numero, onDownload: descargarFactura } : null}
          onClose={() => {
            setSuccess(false)
            navigate('/catalogo')
          }}
        />
      )}
    </>
  )
}
