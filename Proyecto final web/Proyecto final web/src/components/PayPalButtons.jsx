import Icon from './Icon.jsx'
import { useT } from '../i18n.js'

export default function PayPalButtons({ onPay, disabled }) {
  const { t } = useT()
  return (
    <div className="pp-buttons">
      <button className="pp-btn pp-btn-yellow" onClick={onPay} disabled={disabled}>
        <span className="pp-logo">
          <span className="pp-pay">Pay</span><span className="pp-pal">Pal</span>
        </span>
      </button>
      <button className="pp-btn pp-btn-black" onClick={onPay} disabled={disabled}>
        {t('paypal.card')}
      </button>
      <div className="pp-secure">
        <Icon name="lock" className="msi-sm" /> {t('paypal.secure')}
      </div>
    </div>
  )
}
