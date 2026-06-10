import { useState } from 'react'
import Icon from './Icon.jsx'
import { useT } from '../i18n.js'

// Campo de contraseña con botón de "ojito" para mostrar/ocultar el texto.
export default function PasswordField({ value, onChange, placeholder }) {
  const { t } = useT()
  const [show, setShow] = useState(false)

  return (
    <div className="password-field">
      <input
        className="field"
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        aria-label={show ? t('auth.hidePassword') : t('auth.showPassword')}
        title={show ? t('auth.hidePassword') : t('auth.showPassword')}
      >
        <Icon name={show ? 'visibility_off' : 'visibility'} className="msi-sm" />
      </button>
    </div>
  )
}
