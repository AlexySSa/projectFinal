import { pool } from '../db.js'

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function round2(value) {
  return Math.round(toNumber(value) * 100) / 100
}

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

function addMonths(date, amount) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + amount)
  return next
}

function addYears(date, amount) {
  const next = new Date(date)
  next.setFullYear(next.getFullYear() + amount)
  return next
}

function startOfWeek(date) {
  const next = startOfDay(date)
  const day = (next.getDay() + 6) % 7
  next.setDate(next.getDate() - day)
  return next
}

function startOfMonth(date) {
  const next = startOfDay(date)
  next.setDate(1)
  return next
}

function startOfYear(date) {
  const next = startOfDay(date)
  next.setMonth(0, 1)
  return next
}

function inRange(date, start, end) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return false
  const time = date.getTime()
  return time >= start.getTime() && time < end.getTime()
}

function formatDate(date) {
  return new Intl.DateTimeFormat('es-SV', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatMonth(date) {
  return new Intl.DateTimeFormat('es-SV', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatWindowLabel(date) {
  return new Intl.DateTimeFormat('es-SV', {
    day: '2-digit',
    month: 'short',
  }).format(date)
}

function normalizeClient(row) {
  const name = row.usuarioNombre || row.facturaNombre || row.reservaNombre || 'Cliente sin cuenta'
  const email = row.usuarioEmail || row.facturaEmail || 'Sin correo'
  const key = row.usuarioId
    ? `user:${row.usuarioId}`
    : row.usuarioEmail
      ? `mail:${String(row.usuarioEmail).toLowerCase()}`
      : row.facturaEmail
        ? `mail:${String(row.facturaEmail).toLowerCase()}`
        : `guest:${name}`

  return { key, name, email }
}

function reservationStatus(status) {
  return status || 'pendiente'
}

function buildWindowSummary(key, label, reservations, start, end) {
  const scoped = reservations.filter((item) => inRange(item.createdAt, start, end))
  const confirmed = scoped.filter((item) => item.status === 'confirmada')
  const revenue = round2(confirmed.reduce((sum, item) => sum + item.total, 0))
  const uniqueClients = new Set(scoped.map((item) => item.client.key)).size
  return {
    key,
    label,
    range: `${formatWindowLabel(start)} - ${formatWindowLabel(addDays(end, -1))}`,
    reservations: scoped.length,
    confirmed: confirmed.length,
    pending: scoped.filter((item) => item.status !== 'confirmada').length,
    revenue,
    uniqueClients,
    averageTicket: confirmed.length ? round2(revenue / confirmed.length) : 0,
  }
}

export async function getAdminStats() {
  const [reservationRows] = await pool.query(
    `SELECT
        r.id AS reservaId,
        r.usuario_id AS usuarioId,
        r.inicio,
        r.fin,
        r.dias,
        r.total,
        r.nombre AS reservaNombre,
        r.metodo,
        r.estado,
        r.creado_en AS creadoEn,
        v.id AS vehiculoId,
        v.titulo AS vehiculoTitulo,
        v.categoria AS vehiculoCategoria,
        u.nombre AS usuarioNombre,
        u.email AS usuarioEmail,
        f.numero AS facturaNumero,
        f.nombre_cliente AS facturaNombre,
        f.email_cliente AS facturaEmail
      FROM reservas r
      LEFT JOIN vehiculos v ON v.id = r.vehiculo_id
      LEFT JOIN usuarios u ON u.id = r.usuario_id
      LEFT JOIN facturas f ON f.reserva_id = r.id
      ORDER BY r.creado_en DESC`
  )

  const [[userCounts]] = await pool.query(
    `SELECT
        COUNT(*) AS usuarios,
        SUM(rol = 'cliente') AS clientes,
        SUM(rol = 'arrendador') AS arrendadores
      FROM usuarios`
  )

  const [[vehicleCounts]] = await pool.query(
    'SELECT COUNT(*) AS totalVehiculos, COUNT(DISTINCT owner_id) AS propietariosActivos FROM vehiculos'
  )

  const reservations = reservationRows.map((row) => {
    const client = normalizeClient(row)
    return {
      id: row.reservaId,
      userId: row.usuarioId,
      vehicleId: row.vehiculoId,
      vehicleTitle: row.vehiculoTitulo || 'Vehiculo sin titulo',
      category: row.vehiculoCategoria || 'Sin categoria',
      startDate: new Date(row.inicio),
      endDate: new Date(row.fin),
      createdAt: new Date(row.creadoEn),
      days: toNumber(row.dias),
      total: round2(row.total),
      paymentMethod: row.metodo || 'PayPal',
      status: reservationStatus(row.estado),
      invoiceNumber: row.facturaNumero || null,
      client,
      reservaNombre: row.reservaNombre || '',
    }
  })

  const now = new Date()
  const todayStart = startOfDay(now)
  const tomorrow = addDays(todayStart, 1)
  const weekStart = startOfWeek(now)
  const nextWeek = addDays(weekStart, 7)
  const monthStart = startOfMonth(now)
  const nextMonth = addMonths(monthStart, 1)
  const yearStart = startOfYear(now)
  const nextYear = addYears(yearStart, 1)

  const windows = [
    buildWindowSummary('today', 'Hoy', reservations, todayStart, tomorrow),
    buildWindowSummary('week', 'Semana', reservations, weekStart, nextWeek),
    buildWindowSummary('month', 'Mes', reservations, monthStart, nextMonth),
    buildWindowSummary('year', 'Ano', reservations, yearStart, nextYear),
  ]

  const totalRevenue = round2(
    reservations
      .filter((item) => item.status === 'confirmada')
      .reduce((sum, item) => sum + item.total, 0)
  )

  const activeRentals = reservations.filter((item) => (
    item.status === 'confirmada' &&
    item.startDate.getTime() <= now.getTime() &&
    now.getTime() < item.endDate.getTime()
  )).length

  const overview = {
    totalReservations: reservations.length,
    confirmedReservations: reservations.filter((item) => item.status === 'confirmada').length,
    pendingReservations: reservations.filter((item) => item.status !== 'confirmada').length,
    totalRevenue,
    uniqueClients: new Set(reservations.map((item) => item.client.key)).size,
    totalUsers: toNumber(userCounts?.usuarios),
    totalClients: toNumber(userCounts?.clientes),
    totalOwners: toNumber(userCounts?.arrendadores),
    totalVehicles: toNumber(vehicleCounts?.totalVehiculos),
    activeOwners: toNumber(vehicleCounts?.propietariosActivos),
    activeRentals,
  }

  const statusMap = reservations.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {})
  const statusBreakdown = Object.entries(statusMap)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count)

  const categoryMap = new Map()
  for (const item of reservations) {
    const current = categoryMap.get(item.category) || {
      name: item.category,
      reservations: 0,
      revenue: 0,
    }
    current.reservations += 1
    if (item.status === 'confirmada') current.revenue = round2(current.revenue + item.total)
    categoryMap.set(item.category, current)
  }
  const categoryBreakdown = [...categoryMap.values()].sort((a, b) => (
    b.revenue - a.revenue || b.reservations - a.reservations
  ))

  const vehicleMap = new Map()
  for (const item of reservations) {
    const current = vehicleMap.get(item.vehicleId) || {
      id: item.vehicleId,
      title: item.vehicleTitle,
      category: item.category,
      reservations: 0,
      revenue: 0,
      days: 0,
    }
    current.reservations += 1
    current.days += item.days
    if (item.status === 'confirmada') current.revenue = round2(current.revenue + item.total)
    vehicleMap.set(item.vehicleId, current)
  }
  const topVehicles = [...vehicleMap.values()]
    .sort((a, b) => b.reservations - a.reservations || b.revenue - a.revenue)
    .slice(0, 6)

  const clientMap = new Map()
  for (const item of reservations) {
    const current = clientMap.get(item.client.key) || {
      key: item.client.key,
      name: item.client.name,
      email: item.client.email,
      reservations: 0,
      revenue: 0,
      lastReservationAt: item.createdAt,
    }
    current.reservations += 1
    current.lastReservationAt = current.lastReservationAt > item.createdAt ? current.lastReservationAt : item.createdAt
    if (item.status === 'confirmada') current.revenue = round2(current.revenue + item.total)
    clientMap.set(item.client.key, current)
  }
  const topClients = [...clientMap.values()]
    .sort((a, b) => b.reservations - a.reservations || b.revenue - a.revenue)
    .slice(0, 8)
    .map((item) => ({
      ...item,
      lastReservation: formatDate(item.lastReservationAt),
    }))

  const monthlyTrend = []
  for (let offset = 11; offset >= 0; offset -= 1) {
    const start = addMonths(monthStart, -offset)
    const end = addMonths(start, 1)
    const scoped = reservations.filter((item) => inRange(item.createdAt, start, end))
    monthlyTrend.push({
      label: formatMonth(start),
      reservations: scoped.length,
      revenue: round2(
        scoped
          .filter((item) => item.status === 'confirmada')
          .reduce((sum, item) => sum + item.total, 0)
      ),
    })
  }

  const recentReservations = reservations
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10)
    .map((item) => ({
      id: item.id,
      vehicleTitle: item.vehicleTitle,
      clientName: item.client.name,
      clientEmail: item.client.email,
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
      createdAt: formatDate(item.createdAt),
      total: item.total,
      status: item.status,
      days: item.days,
      invoiceNumber: item.invoiceNumber,
    }))

  const upcomingReservations = reservations
    .filter((item) => item.startDate.getTime() >= todayStart.getTime())
    .sort((a, b) => a.startDate - b.startDate)
    .slice(0, 10)
    .map((item) => ({
      id: item.id,
      vehicleTitle: item.vehicleTitle,
      clientName: item.client.name,
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
      total: item.total,
      status: item.status,
      days: item.days,
    }))

  return {
    generatedAt: formatDate(now),
    overview,
    windows,
    statusBreakdown,
    categoryBreakdown,
    topVehicles,
    topClients,
    monthlyTrend,
    recentReservations,
    upcomingReservations,
  }
}
