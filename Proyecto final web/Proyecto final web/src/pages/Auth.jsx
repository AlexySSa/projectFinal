import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useT } from '../i18n.js'
import PasswordField from '../components/PasswordField.jsx'

export default function Auth() {
  const { login, register } = useAuth()
  const { t, tErr } = useT()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // login
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  // register
  const [nombre, setNombre] = useState('')
  const [remail, setREmail] = useState('')
  const [rpass, setRPass] = useState('')
  const [tel, setTel] = useState('')
  const [rol, setRol] = useState('arrendador')

  const doLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password: pass })
      navigate('/catalogo')
    } catch (err) {
      setError(tErr(err.message))
    } finally {
      setLoading(false)
    }
  }

  const doRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ nombre, email: remail, password: rpass, telefono: tel, rol })
      navigate('/catalogo')
    } catch (err) {
      setError(tErr(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-visual">
          <div className="auth-visual-overlay" />
          <div className="brand-lg">Bahn</div>
          <div className="tagline">{t('auth.tagline')}</div>
        </div>

        <div className="auth-form">
          <div className="auth-tabs">
            <button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setError('') }}>
              {t('auth.login')}
            </button>
            <button className={tab === 'register' ? 'active' : ''} onClick={() => { setTab('register'); setError('') }}>
              {t('auth.register')}
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {tab === 'login' ? (
            <form onSubmit={doLogin}>
              <input
                className="field"
                type="email"
                placeholder={t('auth.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordField
                placeholder={t('auth.password')}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              <button className="btn btn-orange btn-block btn-lg" style={{ marginTop: 16 }} type="submit" disabled={loading}>
                {loading ? t('auth.loggingIn') : t('auth.login')}
              </button>
            </form>
          ) : (
            <form onSubmit={doRegister}>
              <input className="field" placeholder={t('auth.fullName')} value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <input className="field" type="email" placeholder={t('auth.email')} value={remail} onChange={(e) => setREmail(e.target.value)} />
              <PasswordField placeholder={t('auth.password')} value={rpass} onChange={(e) => setRPass(e.target.value)} />
              <input className="field" placeholder={t('auth.phone')} value={tel} onChange={(e) => setTel(e.target.value)} />

              <label className="field-label" style={{ fontWeight: 700, marginTop: 6 }}>{t('auth.selectRole')}</label>
              <select className="field" value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="arrendador">{t('role.arrendador')}</option>
                <option value="cliente">{t('role.cliente')}</option>
              </select>

              <button className="btn btn-orange btn-block btn-lg" style={{ marginTop: 16 }} type="submit" disabled={loading}>
                {loading ? t('auth.creating') : t('auth.createAccount')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
