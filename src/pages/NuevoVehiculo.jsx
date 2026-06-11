import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SuccessModal from '../components/SuccessModal.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../api.js'
import { useT } from '../i18n.js'

const CATEGORIES = ['Motocicletas', 'Autos', 'Maquinaria Pesada', 'Agrícola']

export default function NuevoVehiculo() {
  const navigate = useNavigate()
  const { t, tErr } = useT()
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
      setError(tErr(e.message))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Navbar variant="titled" title={t('newVehicle.title')} />
      <div className="back-bar">
        <button className="back-link" onClick={() => (step === 2 ? setStep(1) : navigate(-1))}>
          <Icon name="arrow_back" className="msi-sm" /> {t('common.back')}
        </button>
      </div>

      {step === 1 ? (
        <div className="form-panel">
          <h2 style={{ fontSize: 22 }}>{t('newVehicle.vehicleData')}</h2>
          <p style={{ color: '#8a93a3', fontWeight: 600, marginTop: -8 }}>
            {t('newVehicle.notAllShared')}
          </p>

          <div className="section-title">{t('newVehicle.sharedData')}</div>
          <div className="two-col">
            <div>
              <label className="field-label">{t('newVehicle.category')}</label>
              <select className="field" value={form.categoria} onChange={(e) => set('categoria', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{t('cat.' + c)}</option>)}
              </select>

              <label className="field-label">{t('newVehicle.postTitle')}</label>
              <input className="field" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Yamaha-R7 2025" />

              <label className="field-label">{t('newVehicle.dailyRate')}</label>
              <input className="field" value={form.tarifa} onChange={(e) => set('tarifa', e.target.value)} placeholder="$25" />

              <label className="field-label">{t('newVehicle.description')}</label>
              <textarea className="field" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} placeholder={t('newVehicle.descPlaceholder')} />

              <label className="field-label">{t('newVehicle.address')}</label>
              <input className="field" value={form.direccion} onChange={(e) => set('direccion', e.target.value)} placeholder="San Miguel centro, San Miguel" />
            </div>

            <div>
              <label className="field-label">{t('newVehicle.brand')}</label>
              <input className="field" value={form.marca} onChange={(e) => set('marca', e.target.value)} placeholder="Yamaha" />

              <label className="field-label">{t('newVehicle.model')}</label>
              <input className="field" value={form.modelo} onChange={(e) => set('modelo', e.target.value)} placeholder="R7 2025" />

              <div className="section-title" style={{ marginTop: 28 }}>{t('newVehicle.notSharedData')}</div>

              <label className="field-label">{t('newVehicle.plateNumber')}</label>
              <input className="field" value={form.placa} onChange={(e) => set('placa', e.target.value)} placeholder="P 859 623" />

              <label className="field-label">{t('newVehicle.holderName')}</label>
              <input className="field" value={form.titular} onChange={(e) => set('titular', e.target.value)} placeholder={t('newVehicle.holderPlaceholder')} />
            </div>
          </div>

          <button className="btn btn-orange btn-lg btn-icon" style={{ marginTop: 26 }} onClick={() => setStep(2)}>
            {t('common.next')} <Icon name="arrow_forward" className="msi-sm" />
          </button>
        </div>
      ) : (
        <div className="form-panel">
          <h2>{t('newVehicle.createPost')}</h2>
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
                  <div>{t('newVehicle.dragPhotos')}</div>
                  <div className="hint">{t('newVehicle.clickToBrowse')}</div>
                </>
              ) : (
                <div className="preview-grid">
                  {fotos.map((f, i) => <img key={i} src={f} alt="" />)}
                </div>
              )}
            </div>

            <div className="publish-form">
              <label className="field-label">{t('newVehicle.postTitle')}</label>
              <input className="field" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Yamaha-R7 2025" />

              <label className="field-label">{t('newVehicle.category')}</label>
              <select className="field" value={form.categoria} onChange={(e) => set('categoria', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{t('cat.' + c)}</option>)}
              </select>

              <label className="field-label">{t('newVehicle.dailyRate')}</label>
              <input className="field" value={form.tarifa} onChange={(e) => set('tarifa', e.target.value)} placeholder="$25" />

              <label className="field-label">{t('newVehicle.description')}</label>
              <textarea className="field" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />

              <label className="field-label">{t('newVehicle.address')}</label>
              <input className="field" value={form.direccion} onChange={(e) => set('direccion', e.target.value)} />

              {error && <div className="auth-error" style={{ marginTop: 12 }}>{error}</div>}

              <button className="btn btn-green btn-block" style={{ marginTop: 18 }} onClick={publicar} disabled={saving}>
                {saving ? t('newVehicle.publishing') : t('newVehicle.createPost')}
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <SuccessModal
          message={t('newVehicle.success')}
          onClose={() => {
            setSuccess(false)
            navigate('/mis-vehiculos')
          }}
        />
      )}
    </>
  )
}
