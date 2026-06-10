import Icon from './Icon.jsx'

export default function PayPalButtons({ onPay, disabled }) {
  return (
    <div className="pp-buttons">
      <button className="pp-btn pp-btn-yellow" onClick={onPay} disabled={disabled}>
        <span className="pp-logo">
          <span className="pp-pay">Pay</span><span className="pp-pal">Pal</span>
        </span>
      </button>
      <button className="pp-btn pp-btn-black" onClick={onPay} disabled={disabled}>
        Tarjeta de débito o crédito
      </button>
      <div className="pp-secure">
        <Icon name="lock" className="msi-sm" /> Pago seguro procesado por PayPal
      </div>
    </div>
  )
}
