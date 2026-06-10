import Icon from './Icon.jsx'
import { useT } from '../i18n.js'

/**
 * Modal pequeño y estético que sigue el esquema del proyecto.
 * Sirve como confirmación (con botón cancelar) o como aviso simple.
 *
 * Props:
 *  - title: título opcional
 *  - message: texto principal
 *  - icon: nombre del ícono (material symbols), opcional
 *  - variant: 'danger' | 'info' (color del ícono y del botón de confirmar)
 *  - confirmLabel / cancelLabel: textos de los botones
 *  - onConfirm: si se pasa, muestra botón de confirmar
 *  - onClose: cierra el modal (también es el "cancelar")
 *  - loading: deshabilita el botón de confirmar
 */
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
