import Icon from './Icon.jsx'
import { useT } from '../i18n.js'

export default function Modal({
  title,
  message,
  icon,
  variant = 'info',
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  loading = false,
}) {
  const { t } = useT()
  const confirmClass = variant === 'danger' ? 'btn-red' : 'btn-orange'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {icon && (
          <div className={'modal-icon modal-icon-' + variant}>
            <Icon name={icon} className="msi-xl" />
          </div>
        )}
        {title && <h2 className="modal-title">{title}</h2>}
        {message && <p className="modal-text">{message}</p>}

        <div className="modal-actions">
          {onConfirm && (
            <button className="btn btn-outline" onClick={onClose} disabled={loading}>
              {cancelLabel || t('common.cancel')}
            </button>
          )}
          <button
            className={'btn ' + (onConfirm ? confirmClass : 'btn-orange')}
            onClick={onConfirm || onClose}
            disabled={loading}
          >
            {confirmLabel || t('common.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
