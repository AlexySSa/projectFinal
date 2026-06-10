import { useT } from '../i18n.js'
import Icon from './Icon.jsx'

export default function SuccessModal({ message, onClose, invoice }) {
  const { t } = useT()
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-success" onClick={(e) => e.stopPropagation()}>
        <h2>{message}</h2>

        {invoice && invoice.numero && (
          <div className="success-invoice">
            <p>{t('reserva.invoiceNumber')}: <strong>{invoice.numero}</strong></p>
            <button className="btn btn-block btn-icon success-invoice-btn" onClick={invoice.onDownload}>
              <Icon name="download" className="msi-sm" /> {t('reserva.downloadInvoice')}
            </button>
          </div>
        )}

        <button className="btn btn-orange btn-lg" onClick={onClose}>
          {t('common.back')}
        </button>
      </div>
    </div>
  )
}
