import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SuccessModal from '../components/SuccessModal.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../api.js'

const CATEGORIES = ['Motocicletas', 'Autos', 'Maquinaria Pesada', 'Agrícola']

export default function NuevoVehiculo() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    titulo: '',
    categoria: 'Motocicletas',
    marca: '',
    modelo: '',
    tarifa: '',
    descripcion: '',
    direccion: '',
    placa: '',
    titular: '',
  })
  const [fotos, setFotos] = useState([])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const onFiles = (files) => {
    const arr = Array.from(files).slice(0, 6)
    Promise.all(
      arr.map(
        (file) =>
          new Promise((res) => {
            const reader = new FileReader()
            reader.onload = () => res(reader.result)
            reader.readAsDataURL(file)
          })
      )
    ).then((urls) => setFotos((prev) => [...prev, ...urls].slice(0, 6)))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files)
  }

  const publicar = async () => {
    setError('')
    setSaving(true)
    try {
      await api.addVehiculo({
        ...form,
        tarifa: Number(String(form.tarifa).replace(/[^0-9.]/g, '')) || 0,
        fotos,
      })
      setSuccess(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Navbar variant="titled" title="Nuevo vehículo" />
      <div className="back-bar">
        <button className="back-link" onClick={() => (step === 2 ? setStep(1) : navigate(-1))}>
          <Icon name="arrow_back" className="msi-sm" /> Regresar
        </button>
      </div>

      {step === 1 ? (
        <div className="form-panel">
          <h2 style={{ fontSize: 22 }}>Datos del vehículo</h2>
          <p style={{ color: '#8a93a3', fontWeight: 600, marginTop: -8 }}>
            No todos los datos serán compartidos al público
          </p>

          <div className="section-title">Datos compartidos</div>
          <div className="two-col">
            <div>
              <label className="field-label">Categoría</label>
              <select className="field" value={form.categoria} onChange={(e) => set('categoria', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>

              <label className="field-label">Título de publicación</label>
              <input className="field" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Yamaha-R7 2025" />

              <label className="field-label">Tarifa diaria (USD)</label>
              <input className="field" value={form.tarifa} onChange={(e) => set('tarifa', e.target.value)} placeholder="$25" />

              <label className="field-label">Descripción</label>
              <textarea className="field" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} placeholder="Motocicleta 700cc, excelente para tardes de rodadas y aventuras" />

              <label className="field-label">Dirección</label>
              <input className="field" value={form.direccion} onChange={(e) => set('direccion', e.target.value)} placeholder="San Miguel centro, San Miguel" />
            </div>

            <div>
              <label className="field-label">Marca</label>
              <input className="field" value={form.marca} onChange={(e) => set('marca', e.target.value)} placeholder="Yamaha" />

              <label className="field-label">Modelo</label>
              <input className="field" value={form.modelo} onChange={(e) => set('modelo', e.target.value)} placeholder="R7 2025" />

              <div className="section-title" style={{ marginTop: 28 }}>Datos no compartidos</div>

              <label className="field-label">Número de placa</label>
              <input className="field" value={form.placa} onChange={(e) => set('placa', e.target.value)} placeholder="P 859 623" />

              <label className="field-label">Nombre del titular</label>
              <input className="field" value={form.titular} onChange={(e) => set('titular', e.target.value)} placeholder="Nombre completo del titular" />
            </div>
          </div>

          <button className="btn btn-orange btn-lg btn-icon" style={{ marginTop: 26 }} onClick={() => setStep(2)}>
            Siguiente <Icon name="arrow_forward" className="msi-sm" />
          </button>
        </div>
      ) : (
        <div className="form-panel">
          <h2>Crear publicación</h2>
          <div className="publish-layout">
            <div
              className="dropzone"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => onFiles(e.target.files)}
              />
              {fotos.length === 0 ? (
                <>
                  <Icon name="cloud_upload" className="cloud" />
                  <div>Arrastra tus fotos aquí</div>
                  <div className="hint">O haz click para explorar tus archivos</div>
                </>
              ) : (
                <div className="preview-grid">
                  {fotos.map((f, i) => <img key={i} src={f} alt="" />)}
                </div>
              )}
            </div>

            <div className="publish-form">
              <label className="field-label">Título de publicación</label>
              <input className="field" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Yamaha-R7 2025" />

              <label className="field-label">Categoría</label>
              <select className="field" value={form.categoria} onChange={(e) => set('categoria', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>

              <label className="field-label">Tarifa diaria (USD)</label>
              <input className="field" value={form.tarifa} onChange={(e) => set('tarifa', e.target.value)} placeholder="$25" />

              <label className="field-label">Descripción</label>
              <textarea className="field" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />

              <label className="field-label">Dirección</label>
              <input className="field" value={form.direccion} onChange={(e) => set('direccion', e.target.value)} />

              {error && <div className="auth-error" style={{ marginTop: 12 }}>{error}</div>}

              <button className="btn btn-green btn-block" style={{ marginTop: 18 }} onClick={publicar} disabled={saving}>
                {saving ? 'Publicando…' : 'Crear publicación'}
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <SuccessModal
          message="Publicación creada con éxito!"
          onClose={() => {
            setSuccess(false)
            navigate('/mis-vehiculos')
          }}
        />
      )}
    </>
  )
}
