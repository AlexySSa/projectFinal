import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Auth() {
  const { login, register } = useAuth()
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
      setError(err.message)
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
      setError(err.message)
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
          <div className="tagline">Connect with machinery and vehicles</div>
        </div>

        <div className="auth-form">
          <div className="auth-tabs">
            <button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setError('') }}>
              Iniciar sesión
            </button>
            <button className={tab === 'register' ? 'active' : ''} onClick={() => { setTab('register'); setError('') }}>
              Registrarse
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {tab === 'login' ? (
            <form onSubmit={doLogin}>
              <input
                className="field"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="field"
                type="password"
                placeholder="Contraseña"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              <button className="btn btn-orange btn-block btn-lg" style={{ marginTop: 16 }} type="submit" disabled={loading}>
                {loading ? 'Ingresando…' : 'Iniciar sesión'}
              </button>
            </form>
          ) : (
            <form onSubmit={doRegister}>
              <input className="field" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <input className="field" type="email" placeholder="Correo electrónico" value={remail} onChange={(e) => setREmail(e.target.value)} />
              <input className="field" type="password" placeholder="Contraseña" value={rpass} onChange={(e) => setRPass(e.target.value)} />
              <input className="field" placeholder="Teléfono" value={tel} onChange={(e) => setTel(e.target.value)} />

              <label className="field-label" style={{ fontWeight: 700, marginTop: 6 }}>Seleccione un rol:</label>
              <select className="field" value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="arrendador">Arrendador</option>
                <option value="cliente">Cliente</option>
              </select>

              <button className="btn btn-orange btn-block btn-lg" style={{ marginTop: 16 }} type="submit" disabled={loading}>
                {loading ? 'Creando…' : 'Crear Cuenta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
