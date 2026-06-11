const BASE = '/api'
const TOKEN_KEY = 'bahn_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}

async function req(path, { method = 'GET', body } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers.Authorization = 'Bearer ' + token

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let message = 'Error ' + res.status
    try {
      const data = await res.json()
      if (data.error) message = data.error
    } catch {
      message = 'Error ' + res.status
    }
    throw new Error(message)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  register: (data) => req('/auth/register', { method: 'POST', body: data }),
  login: (data) => req('/auth/login', { method: 'POST', body: data }),
  me: () => req('/auth/me'),

  getVehiculos: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString()
    return req('/vehiculos' + (qs ? '?' + qs : ''))
  },
  getVehiculo: (id) => req('/vehiculos/' + id),
  getMisVehiculos: () => req('/vehiculos/mios'),
  addVehiculo: (data) => req('/vehiculos', { method: 'POST', body: data }),
  deleteVehiculo: (id) => req('/vehiculos/' + id, { method: 'DELETE' }),

  getFavoritos: () => req('/favoritos'),
  getFavoritoIds: () => req('/favoritos/ids'),
  toggleFavorito: (id) => req('/favoritos/' + id, { method: 'POST' }),

  getReservas: () => req('/reservas'),
  getOcupadas: (vehiculoId) => req('/reservas/ocupadas/' + vehiculoId),

  paypalConfig: () => req('/paypal/config'),
  paypalCreateOrder: (data) => req('/paypal/create-order', { method: 'POST', body: data }),
  paypalCapture: (orderId, data) => req('/paypal/capture/' + orderId, { method: 'POST', body: data }),

  getFacturas: () => req('/facturas'),
  downloadFactura: async (id) => {
    const token = getToken()
    const res = await fetch(BASE + '/facturas/' + id + '/pdf', {
      headers: token ? { Authorization: 'Bearer ' + token } : {},
    })
    if (!res.ok) throw new Error('No se pudo descargar la factura')
    return res.blob()
  },
}
