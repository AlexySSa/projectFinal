import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Icon from '../components/Icon.jsx'
import Modal from '../components/Modal.jsx'
import { api } from '../api.js'
import { useT } from '../i18n.js'

export default function Facturas() {
  const { t } = useT()
  const [lista, setLista] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getFacturas().then(setLista).catch(() => setLista([])).finally(() => setLoading(false))
  }, [])

  const descargar = async (f) => {
    try {
      const blob = await api.downloadFactura(f.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `factura-${f.numero}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      setError(t('invoices.downloadError'))
    }
  }

  return (
    <>
      <Navbar variant="app" showFavorites />
      <div className="invoices-wrap">
        <section className="results-card">
          <h2>{t('invoices.title')}</h2>

          {loading ? (
            <div className="empty-state">{t('common.loading')}</div>
          ) : lista.length === 0 ? (
            <div className="empty-state">
              <Icon name="receipt_long" className="msi-xl" style={{ color: '#c2cad8' }} />
              <p style={{ marginTop: 12 }}>{t('invoices.empty')}</p>
            </div>
          ) : (
            <div className="invoice-list">
              {lista.map((f) => (
                <div key={f.id} className="invoice-row">
                  <div className="invoice-main">
                    <span className="invoice-number">
                      <Icon name="receipt_long" className="msi-sm" /> {f.numero}
                    </span>
                    <span className="invoice-meta">{t('invoices.date')}: {f.fecha} · {f.metodoPago}</span>
                  </div>
                  <div className="invoice-side">
                    <span className={'invoice-badge badge-' + f.estado}>
                      {t('invoices.status.' + f.estado)}
                    </span>
                    <span className="invoice-total">{f.moneda} {f.total.toFixed(2)}</span>
                    <button className="btn btn-orange btn-icon" onClick={() => descargar(f)}>
                      <Icon name="download" className="msi-sm" /> {t('invoices.download')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {error && (
        <Modal
          variant="danger"
          icon="error"
          title={t('common.errorTitle')}
          message={error}
          confirmLabel={t('common.accept')}
          onClose={() => setError('')}
        />
      )}
    </>
  )
}
