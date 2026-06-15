import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../api.js'
import { useT } from '../i18n.js'
import PasswordField from '../components/PasswordField.jsx'
import SuccessModal from '../components/SuccessModal.jsx'
import Icon from '../components/Icon.jsx'

export default function Auth() {
  const { login, register } = useAuth()
  const { t, tErr } = useT()
  const navigate = useNavigate()

  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)
  const [debugCode, setDebugCode] = useState('')

  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [nombre, setNombre] = useState('')
  const [remail, setREmail] = useState('')
  const [rpass, setRPass] = useState('')
  const [tel, setTel] = useState('')
  const [dui, setDui] = useState('')
  const [rol, setRol] = useState('arrendador')

  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const [recoveryPass, setRecoveryPass] = useState('')

  const formatDui = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 9)
    if (digits.length <= 8) return digits
    return `${digits.slice(0, 8)}-${digits.slice(8)}`
  }

  const goAfterLogin = (user) => {
    navigate(user?.rol === 'admin' ? '/admin' : '/catalogo')
  }

  const openRecovery = () => {
    setRecoveryMode(true)
    setRecoverySent(false)
    setDebugCode('')
    setInfo('')
    setError('')
    setRecoveryEmail(email || '')
    setRecoveryCode('')
    setRecoveryPass('')
  }

  const closeRecovery = () => {
    setRecoveryMode(false)
    setRecoverySent(false)
    setDebugCode('')
    setInfo('')
    setError('')
  }

  const doLogin = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      const user = await login({ email, password: pass })
      goAfterLogin(user)
    } catch (err) {
      setError(tErr(err.message))
    } finally {
      setLoading(false)
    }
  }

  const doRegister = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!/^\d{8}-\d$/.test(dui)) {
      setError(t('auth.duiInvalid'))
      return
    }
    setLoading(true)
    try {
      await register({ nombre, email: remail, password: rpass, telefono: tel, dui, rol })
      setRegistered(true)
    } catch (err) {
      setError(tErr(err.message))
    } finally {
      setLoading(false)
    }
  }

  const sendRecoveryCode = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setDebugCode('')
    setLoading(true)
    try {
      const response = await api.forgotPassword({ email: recoveryEmail })
      setRecoverySent(true)
      setDebugCode(response.debugCode || '')
      setInfo(t('auth.recoveryCodeSent'))
    } catch (err) {
      setError(tErr(err.message))
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      await api.resetPassword({
        email: recoveryEmail,
        code: recoveryCode,
        password: recoveryPass,
      })
      const successMessage = t('auth.passwordUpdated')
      setEmail(recoveryEmail)
      setPass('')
      closeRecovery()
      setTab('login')
      setInfo(successMessage)
    } catch (err) {
      setError(tErr(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <button className="auth-back" onClick={() => navigate('/')} aria-label={t('common.back')}>
        <Icon name="arrow_back" className="msi-sm" /> {t('common.back')}
      </button>
      <div className="auth-card">
        <div className="auth-visual">
          <div className="auth-visual-overlay" />
          <div className="brand-lg">Bahn</div>
          <div className="tagline">{t('auth.tagline')}</div>
        </div>

        <div className="auth-form">
          {!recoveryMode && (
            <div className="auth-tabs">
              <button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setError(''); setInfo('') }}>
                {t('auth.login')}
              </button>
              <button className={tab === 'register' ? 'active' : ''} onClick={() => { setTab('register'); setError(''); setInfo('') }}>
                {t('auth.register')}
              </button>
            </div>
          )}

          {recoveryMode && (
            <div className="auth-helper">
              <button className="auth-link" type="button" onClick={closeRecovery}>
                <Icon name="arrow_back" className="msi-sm" /> {t('auth.backToLogin')}
              </button>
              <h3 style={{ margin: '4px 0 0' }}>{t('auth.recoveryTitle')}</h3>
              <p style={{ color: '#6b7280', margin: '8px 0 18px' }}>{t('auth.recoverySubtitle')}</p>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}
          {info && <div className="auth-info">{info}</div>}

          {!recoveryMode ? (
            tab === 'login' ? (
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
                <button className="auth-link auth-link-inline" type="button" onClick={openRecovery}>
                  {t('auth.forgotPassword')}
                </button>
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
                <input
                  className="field"
                  placeholder={t('auth.dui')}
                  value={dui}
                  onChange={(e) => setDui(formatDui(e.target.value))}
                  inputMode="numeric"
                  maxLength={10}
                />

                <label className="field-label" style={{ fontWeight: 700, marginTop: 6 }}>{t('auth.selectRole')}</label>
                <select className="field" value={rol} onChange={(e) => setRol(e.target.value)}>
                  <option value="arrendador">{t('role.arrendador')}</option>
                  <option value="cliente">{t('role.cliente')}</option>
                </select>

                <button className="btn btn-orange btn-block btn-lg" style={{ marginTop: 16 }} type="submit" disabled={loading}>
                  {loading ? t('auth.creating') : t('auth.createAccount')}
                </button>
              </form>
            )
          ) : (
            <>
              {!recoverySent ? (
                <form onSubmit={sendRecoveryCode}>
                  <input
                    className="field"
                    type="email"
                    placeholder={t('auth.email')}
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                  />
                  <button className="btn btn-orange btn-block btn-lg" type="submit" disabled={loading}>
                    {loading ? t('auth.sendingCode') : t('auth.sendCode')}
                  </button>
                </form>
              ) : (
                <form onSubmit={resetPassword}>
                  <input
                    className="field"
                    type="email"
                    placeholder={t('auth.email')}
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                  />
                  <input
                    className="field"
                    placeholder={t('auth.recoveryCode')}
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputMode="numeric"
                    maxLength={6}
                  />
                  <PasswordField
                    placeholder={t('auth.newPassword')}
                    value={recoveryPass}
                    onChange={(e) => setRecoveryPass(e.target.value)}
                  />

                  {debugCode && (
                    <div className="auth-code-note">
                      <strong>{t('auth.debugCode')}</strong> {debugCode}
                    </div>
                  )}

                  <div className="auth-split">
                    <button className="btn btn-outline" type="button" onClick={sendRecoveryCode} disabled={loading}>
                      {t('auth.resendCode')}
                    </button>
                    <button className="btn btn-orange" type="submit" disabled={loading}>
                      {loading ? t('auth.updatingPassword') : t('auth.changePassword')}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {registered && (
        <SuccessModal
          message={t('auth.registerSuccess')}
          onClose={() => {
            setRegistered(false)
            navigate('/catalogo')
          }}
        />
      )}
    </div>
  )
}
