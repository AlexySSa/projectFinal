export default function SuccessModal({ message, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-success" onClick={(e) => e.stopPropagation()}>
        <h2>{message}</h2>
        <button className="btn btn-orange btn-lg" onClick={onClose}>
          Regresar
        </button>
      </div>
    </div>
  )
}
