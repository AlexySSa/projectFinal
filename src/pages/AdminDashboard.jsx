import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../api.js'
import { useT } from '../i18n.js'

const STATUS_COLORS = {
  confirmada: '#1f9d69',
  pendiente: '#e8722d',
  cancelada: '#425a86',
}

const SECTION_STYLES = {
  overview: { color: '#3a4a8e', soft: '#eef2fd', gradient: 'linear-gradient(90deg, #3a4a8e, #6d83d3)' },
  revenue: { color: '#d96a28', soft: '#fff1e7', gradient: 'linear-gradient(90deg, #d96a28, #f2a23c)' },
  clients: { color: '#1f8f6a', soft: '#e9f7f1', gradient: 'linear-gradient(90deg, #1f8f6a, #43c28b)' },
  fleet: { color: '#0f6c8a', soft: '#e9f6fb', gradient: 'linear-gradient(90deg, #0f6c8a, #42b3d5)' },
  agenda: { color: '#0f766e', soft: '#e7f8f5', gradient: 'linear-gradient(90deg, #0f766e, #2fb0a4)' },
}

const EMPTY_OVERVIEW = {
  totalReservations: 0,
  confirmedReservations: 0,
  pendingReservations: 0,
  totalRevenue: 0,
  uniqueClients: 0,
  totalUsers: 0,
  totalClients: 0,
  totalOwners: 0,
  totalVehicles: 0,
  activeOwners: 0,
  activeRentals: 0,
}

const EMPTY_WINDOW = {
  key: '',
  label: '',
  range: '',
  reservations: 0,
  confirmed: 0,
  pending: 0,
  revenue: 0,
  uniqueClients: 0,
  averageTicket: 0,
}

function normalizeSection(value) {
  const next = String(value || '').replace('#', '').trim().toLowerCase()
  if (['overview', 'revenue', 'clients', 'fleet', 'agenda'].includes(next)) return next
  return 'overview'
}

function getLocale(lang) {
  return lang === 'EN' ? 'en-US' : 'es-SV'
}

function money(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(value || 0))
}

function percent(value, total) {
  if (!total) return 0
  return Math.round((Number(value || 0) / Number(total || 1)) * 100)
}

function buildTrendGeometry(items) {
  const width = 640
  const height = 260
  const left = 26
  const right = 18
  const top = 18
  const bottom = 42
  const innerWidth = width - left - right
  const innerHeight = height - top - bottom
  const maxRevenue = Math.max(1, ...items.map((item) => Number(item.revenue || 0)))
  const maxReservations = Math.max(1, ...items.map((item) => Number(item.reservations || 0)))
  const step = items.length > 1 ? innerWidth / (items.length - 1) : 0

  const points = items.map((item, index) => {
    const revenue = Number(item.revenue || 0)
    const reservations = Number(item.reservations || 0)
    const x = items.length === 1 ? left + innerWidth / 2 : left + step * index
    const y = top + innerHeight - (revenue / maxRevenue) * innerHeight
    const barHeight = (reservations / maxReservations) * innerHeight

    return {
      ...item,
      x,
      y,
      barHeight,
    }
  })

  return {
    width,
    height,
    baseY: top + innerHeight,
    points,
    areaPoints: points.length
      ? `${points[0].x},${top + innerHeight} ${points.map((point) => `${point.x},${point.y}`).join(' ')} ${points[points.length - 1].x},${top + innerHeight}`
      : '',
    linePoints: points.map((point) => `${point.x},${point.y}`).join(' '),
  }
}

export default function AdminDashboard() {
  const { t, tErr, lang } = useT()
  const locale = getLocale(lang)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [section, setSection] = useState(() => normalizeSection(typeof window !== 'undefined' ? window.location.hash : ''))

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    api.getAdminStats()
      .then((data) => {
        if (active) setStats(data)
      })
      .catch((err) => {
        if (active) setError(tErr(err.message))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const syncWithHash = () => {
      setSection(normalizeSection(window.location.hash))
    }

    window.addEventListener('hashchange', syncWithHash)
    syncWithHash()

    return () => {
      window.removeEventListener('hashchange', syncWithHash)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const nextHash = `#${section}`
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`)
    }
  }, [section])

  const overview = stats?.overview || EMPTY_OVERVIEW
  const windows = stats?.windows || []
  const monthlyTrend = stats?.monthlyTrend || []
  const statusBreakdown = stats?.statusBreakdown || []
  const categoryBreakdown = stats?.categoryBreakdown || []
  const topVehicles = stats?.topVehicles || []
  const topClients = stats?.topClients || []
  const recentReservations = stats?.recentReservations || []
  const upcomingReservations = stats?.upcomingReservations || []

  const windowMap = useMemo(() => (
    windows.reduce((acc, item) => {
      acc[item.key] = item
      return acc
    }, {})
  ), [windows])

  const monthWindow = windowMap.month || EMPTY_WINDOW
  const weekWindow = windowMap.week || EMPTY_WINDOW
  const yearWindow = windowMap.year || EMPTY_WINDOW
  const todayWindow = windowMap.today || EMPTY_WINDOW
  const confirmedRate = percent(overview.confirmedReservations, overview.totalReservations)
  const ownerCoverage = percent(overview.activeOwners, overview.totalOwners)

  const getWindowLabel = (item) => {
    const key = `admin.window.${item.key}`
    const translated = t(key)
    return translated === key ? item.label : translated
  }

  const statusItems = statusBreakdown.map((item) => ({
    key: item.status,
    label: t('admin.status.' + item.status),
    value: item.count,
    color: STATUS_COLORS[item.status] || '#9aa5b5',
  }))

  const sectionItems = [
    {
      key: 'overview',
      icon: 'dashboard_customize',
      title: t('admin.nav.overview'),
      hint: t('admin.nav.overviewHint'),
      metric: String(overview.totalReservations),
      ...SECTION_STYLES.overview,
    },
    {
      key: 'revenue',
      icon: 'monitoring',
      title: t('admin.nav.revenue'),
      hint: t('admin.nav.revenueHint'),
      metric: money(monthWindow.revenue, locale),
      ...SECTION_STYLES.revenue,
    },
    {
      key: 'clients',
      icon: 'groups_3',
      title: t('admin.nav.clients'),
      hint: t('admin.nav.clientsHint'),
      metric: String(overview.uniqueClients),
      ...SECTION_STYLES.clients,
    },
    {
      key: 'fleet',
      icon: 'local_shipping',
      title: t('admin.nav.fleet'),
      hint: t('admin.nav.fleetHint'),
      metric: String(overview.totalVehicles),
      ...SECTION_STYLES.fleet,
    },
    {
      key: 'agenda',
      icon: 'event_upcoming',
      title: t('admin.nav.agenda'),
      hint: t('admin.nav.agendaHint'),
      metric: String(upcomingReservations.length),
      ...SECTION_STYLES.agenda,
    },
  ]

  const activeSection = sectionItems.find((item) => item.key === section) || sectionItems[0]

  const stageCards = useMemo(() => {
    if (section === 'revenue') {
      return [
        {
          icon: 'paid',
          label: t('admin.monthRevenue'),
          value: money(monthWindow.revenue, locale),
          hint: `${monthWindow.confirmed} ${t('admin.confirmed').toLowerCase()}`,
          tone: SECTION_STYLES.revenue,
        },
        {
          icon: 'finance_mode',
          label: t('admin.yearRevenue'),
          value: money(yearWindow.revenue, locale),
          hint: `${yearWindow.reservations} ${t('admin.bookings')}`,
          tone: SECTION_STYLES.overview,
        },
        {
          icon: 'receipt_long',
          label: t('admin.averageTicket'),
          value: money(monthWindow.averageTicket, locale),
          hint: `${monthWindow.reservations} ${t('admin.bookings')}`,
          tone: SECTION_STYLES.clients,
        },
        {
          icon: 'check_circle',
          label: t('admin.confirmationRate'),
          value: `${confirmedRate}%`,
          hint: `${overview.confirmedReservations}/${overview.totalReservations}`,
          tone: SECTION_STYLES.agenda,
        },
      ]
    }

    if (section === 'clients') {
      return [
        {
          icon: 'groups',
          label: t('admin.totalClients'),
          value: overview.totalClients,
          hint: `${overview.uniqueClients} ${t('admin.uniqueRenters').toLowerCase()}`,
          tone: SECTION_STYLES.clients,
        },
        {
          icon: 'group',
          label: t('admin.uniqueRenters'),
          value: overview.uniqueClients,
          hint: `${monthWindow.uniqueClients} ${t('admin.clientsThisMonth').toLowerCase()}`,
          tone: SECTION_STYLES.overview,
        },
        {
          icon: 'calendar_month',
          label: t('admin.clientsThisMonth'),
          value: monthWindow.uniqueClients,
          hint: `${monthWindow.reservations} ${t('admin.bookings')}`,
          tone: SECTION_STYLES.agenda,
        },
        {
          icon: 'payments',
          label: t('admin.averageTicket'),
          value: money(monthWindow.averageTicket, locale),
          hint: money(overview.totalRevenue, locale),
          tone: SECTION_STYLES.revenue,
        },
      ]
    }

    if (section === 'fleet') {
      return [
        {
          icon: 'directions_car',
          label: t('admin.totalVehicles'),
          value: overview.totalVehicles,
          hint: `${topVehicles.length} ${t('admin.topVehicles').toLowerCase()}`,
          tone: SECTION_STYLES.fleet,
        },
        {
          icon: 'storefront',
          label: t('admin.totalOwners'),
          value: overview.totalOwners,
          hint: `${overview.activeOwners} ${t('admin.activeOwners').toLowerCase()}`,
          tone: SECTION_STYLES.overview,
        },
        {
          icon: 'domain',
          label: t('admin.activeOwners'),
          value: overview.activeOwners,
          hint: `${ownerCoverage}% ${t('admin.ownerCoverage').toLowerCase()}`,
          tone: SECTION_STYLES.clients,
        },
        {
          icon: 'monitoring',
          label: t('admin.totalRevenue'),
          value: money(overview.totalRevenue, locale),
          hint: `${overview.totalReservations} ${t('admin.bookings')}`,
          tone: SECTION_STYLES.revenue,
        },
      ]
    }

    if (section === 'agenda') {
      return [
        {
          icon: 'event_available',
          label: t('admin.activeRentals'),
          value: overview.activeRentals,
          hint: `${upcomingReservations.length} ${t('admin.upcomingCount').toLowerCase()}`,
          tone: SECTION_STYLES.agenda,
        },
        {
          icon: 'schedule',
          label: t('admin.upcomingCount'),
          value: upcomingReservations.length,
          hint: `${todayWindow.reservations} ${t('admin.window.today').toLowerCase()}`,
          tone: SECTION_STYLES.revenue,
        },
        {
          icon: 'today',
          label: t('admin.window.today'),
          value: todayWindow.reservations,
          hint: money(todayWindow.revenue, locale),
          tone: SECTION_STYLES.overview,
        },
        {
          icon: 'view_week',
          label: t('admin.reservationsThisWeek'),
          value: weekWindow.reservations,
          hint: money(weekWindow.revenue, locale),
          tone: SECTION_STYLES.fleet,
        },
      ]
    }

    return [
      {
        icon: 'event_available',
        label: t('admin.totalReservations'),
        value: overview.totalReservations,
        hint: `${overview.confirmedReservations} ${t('admin.confirmed').toLowerCase()}`,
        tone: SECTION_STYLES.overview,
      },
      {
        icon: 'paid',
        label: t('admin.totalRevenue'),
        value: money(overview.totalRevenue, locale),
        hint: `${monthWindow.reservations} ${t('admin.reservationsThisMonth').toLowerCase()}`,
        tone: SECTION_STYLES.revenue,
      },
      {
        icon: 'groups',
        label: t('admin.totalClients'),
        value: overview.totalClients,
        hint: `${monthWindow.uniqueClients} ${t('admin.clientsThisMonth').toLowerCase()}`,
        tone: SECTION_STYLES.clients,
      },
      {
        icon: 'event_upcoming',
        label: t('admin.activeRentals'),
        value: overview.activeRentals,
        hint: `${upcomingReservations.length} ${t('admin.upcomingCount').toLowerCase()}`,
        tone: SECTION_STYLES.agenda,
      },
    ]
  }, [
    section,
    t,
    locale,
    monthWindow.revenue,
    monthWindow.confirmed,
    monthWindow.averageTicket,
    monthWindow.reservations,
    monthWindow.uniqueClients,
    yearWindow.revenue,
    yearWindow.reservations,
    overview.totalRevenue,
    overview.totalReservations,
    overview.confirmedReservations,
    overview.totalClients,
    overview.uniqueClients,
    overview.totalVehicles,
    overview.totalOwners,
    overview.activeOwners,
    overview.activeRentals,
    confirmedRate,
    ownerCoverage,
    topVehicles.length,
    upcomingReservations.length,
    todayWindow.reservations,
    todayWindow.revenue,
    weekWindow.reservations,
    weekWindow.revenue,
  ])

  return (
    <>
      <Navbar variant="titled" title={t('admin.title')} />
      <div className="admin-wrap">
        {loading ? (
          <section className="results-card">
            <div className="empty-state">{t('common.loading')}</div>
          </section>
        ) : error ? (
          <section className="results-card">
            <div className="empty-state">
              <Icon name="monitoring" className="msi-xl" style={{ color: '#c2cad8' }} />
              <p style={{ marginTop: 12 }}>{error}</p>
            </div>
          </section>
        ) : (
          <>
            <section className="admin-hero">
              <div>
                <span className="admin-eyebrow">{t('admin.panelLabel')}</span>
                <h1>{t('admin.heroTitle')}</h1>
                <p>{t('admin.heroSubtitle')}</p>
              </div>
              <div className="admin-hero-meta">
                <span>{t('admin.updatedAt')}: {stats.generatedAt}</span>
                <strong>{t('admin.activeRentals')}: {overview.activeRentals}</strong>
              </div>
            </section>

            <section className="admin-shell">
              <aside className="admin-sidebar">
                <div className="admin-sidebar-card">
                  <span className="admin-eyebrow">{t('admin.workspaceLabel')}</span>
                  <h2>{t('admin.workspaceTitle')}</h2>
                  <p>{t('admin.workspaceSubtitle')}</p>
                </div>

                <nav className="admin-nav">
                  {sectionItems.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={`admin-nav-btn${section === item.key ? ' active' : ''}`}
                      onClick={() => setSection(item.key)}
                    >
                      <span className="admin-nav-icon" style={{ background: item.soft, color: item.color }}>
                        <Icon name={item.icon} className="msi-lg" />
                      </span>
                      <span className="admin-nav-copy">
                        <strong>{item.title}</strong>
                        <span>{item.hint}</span>
                      </span>
                      <span className="admin-nav-metric">{item.metric}</span>
                    </button>
                  ))}
                </nav>
              </aside>

              <div className="admin-stage">
                <section className="admin-stage-head">
                  <div>
                    <span className="admin-stage-kicker">{t('admin.currentSection')}</span>
                    <h2>{activeSection.title}</h2>
                    <p>{activeSection.hint}</p>
                  </div>
                  <div className="admin-stage-badge" style={{ background: activeSection.soft, color: activeSection.color }}>
                    <Icon name={activeSection.icon} className="msi-lg" />
                    <span>{activeSection.metric}</span>
                  </div>
                </section>

                <section className="admin-overview-grid">
                  {stageCards.map((item) => (
                    <AdminStatCard key={item.label} {...item} />
                  ))}
                </section>

                {section === 'overview' && (
                  <OverviewSection
                    t={t}
                    locale={locale}
                    overview={overview}
                    windows={windows}
                    monthlyTrend={monthlyTrend}
                    statusItems={statusItems}
                    monthWindow={monthWindow}
                    ownerCoverage={ownerCoverage}
                    getWindowLabel={getWindowLabel}
                  />
                )}

                {section === 'revenue' && (
                  <RevenueSection
                    t={t}
                    locale={locale}
                    monthlyTrend={monthlyTrend}
                    windows={windows}
                    statusItems={statusItems}
                    categoryBreakdown={categoryBreakdown}
                    getWindowLabel={getWindowLabel}
                  />
                )}

                {section === 'clients' && (
                  <ClientsSection
                    t={t}
                    locale={locale}
                    topClients={topClients}
                    recentReservations={recentReservations}
                    statusItems={statusItems}
                  />
                )}

                {section === 'fleet' && (
                  <FleetSection
                    t={t}
                    locale={locale}
                    topVehicles={topVehicles}
                    categoryBreakdown={categoryBreakdown}
                    overview={overview}
                  />
                )}

                {section === 'agenda' && (
                  <AgendaSection
                    t={t}
                    locale={locale}
                    windows={windows}
                    recentReservations={recentReservations}
                    upcomingReservations={upcomingReservations}
                    getWindowLabel={getWindowLabel}
                  />
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  )
}

function OverviewSection({ t, locale, overview, windows, monthlyTrend, statusItems, monthWindow, ownerCoverage, getWindowLabel }) {
  return (
    <>
      <div className="admin-section-grid">
        <section className="admin-panel">
          <PanelHead title={t('admin.monthlyTrend')} subtitle={t('admin.last12Months')} />
          <TrendChart items={monthlyTrend} locale={locale} accent={SECTION_STYLES.overview} t={t} />
        </section>

        <section className="admin-panel">
          <PanelHead title={t('admin.businessPulse')} subtitle={t('admin.healthSnapshot')} />
          <DonutChart
            items={statusItems}
            centerLabel={t('admin.totalReservations')}
            centerValue={overview.totalReservations}
            t={t}
          />
          <div className="admin-insight-grid">
            <InsightCard
              label={t('admin.confirmationRate')}
              value={`${percent(overview.confirmedReservations, overview.totalReservations)}%`}
              tone={SECTION_STYLES.revenue}
            />
            <InsightCard
              label={t('admin.averageTicket')}
              value={money(monthWindow.averageTicket, locale)}
              tone={SECTION_STYLES.overview}
            />
            <InsightCard
              label={t('admin.ownerCoverage')}
              value={`${ownerCoverage}%`}
              tone={SECTION_STYLES.clients}
            />
            <InsightCard
              label={t('admin.activeOwners')}
              value={overview.activeOwners}
              tone={SECTION_STYLES.agenda}
            />
          </div>
        </section>
      </div>

      <section className="admin-window-grid">
        {windows.map((item) => (
          <article key={item.key} className="admin-window-card">
            <div className="admin-window-top">
              <span>{getWindowLabel(item)}</span>
              <small>{item.range}</small>
            </div>
            <strong>{item.reservations} {t('admin.bookings')}</strong>
            <p>{money(item.revenue, locale)}</p>
            <div className="admin-window-meta">
              <span>{t('admin.confirmed')}: {item.confirmed}</span>
              <span>{t('admin.clients')}: {item.uniqueClients}</span>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}

function RevenueSection({ t, locale, monthlyTrend, windows, statusItems, categoryBreakdown, getWindowLabel }) {
  return (
    <>
      <div className="admin-section-grid">
        <section className="admin-panel">
          <PanelHead title={t('admin.monthlyTrend')} subtitle={t('admin.last12Months')} />
          <TrendChart items={monthlyTrend} locale={locale} accent={SECTION_STYLES.revenue} t={t} />
        </section>

        <section className="admin-panel">
          <PanelHead title={t('admin.periodComparison')} subtitle={t('admin.revenueByWindow')} />
          <WindowColumns windows={windows} locale={locale} getWindowLabel={getWindowLabel} t={t} />
        </section>
      </div>

      <div className="admin-section-grid">
        <section className="admin-panel">
          <PanelHead title={t('admin.categoryPerformance')} subtitle={t('admin.mostRequested')} />
          <CategoryRows items={categoryBreakdown} locale={locale} t={t} accent={SECTION_STYLES.revenue} />
        </section>

        <section className="admin-panel">
          <PanelHead title={t('admin.reservationStatus')} subtitle={t('admin.completeView')} />
          <DonutChart
            items={statusItems}
            centerLabel={t('admin.totalRevenue')}
            centerValue={money(
              categoryBreakdown.reduce((sum, item) => sum + Number(item.revenue || 0), 0),
              locale
            )}
            t={t}
          />
        </section>
      </div>
    </>
  )
}

function ClientsSection({ t, locale, topClients, recentReservations, statusItems }) {
  return (
    <>
      <div className="admin-section-grid">
        <section className="admin-panel">
          <PanelHead title={t('admin.clientActivity')} subtitle={t('admin.bestCustomers')} />
          <RankingRows
            items={topClients}
            accent={SECTION_STYLES.clients}
            t={t}
            emptyLabel={t('admin.empty')}
            getTitle={(item) => item.name}
            getSubtitle={(item) => item.email}
            getMeta={(item) => `${item.reservations} ${t('admin.bookings')}`}
            getValue={(item) => Number(item.revenue || item.reservations || 0)}
            getFormattedValue={(item) => money(item.revenue, locale)}
          />
        </section>

        <section className="admin-panel">
          <PanelHead title={t('admin.reservationStatus')} subtitle={t('admin.recentClients')} />
          <DonutChart
            items={statusItems}
            centerLabel={t('admin.uniqueRenters')}
            centerValue={topClients.length}
            t={t}
          />
        </section>
      </div>

      <section className="admin-panel">
        <PanelHead title={t('admin.recentReservations')} subtitle={t('admin.latestActivity')} />
        <ReservationTable items={recentReservations} locale={locale} emptyLabel={t('admin.empty')} t={t} />
      </section>
    </>
  )
}

function FleetSection({ t, locale, topVehicles, categoryBreakdown, overview }) {
  return (
    <>
      <div className="admin-section-grid">
        <section className="admin-panel">
          <PanelHead title={t('admin.vehicleLeaderboard')} subtitle={t('admin.mostRequested')} />
          <RankingRows
            items={topVehicles}
            accent={SECTION_STYLES.fleet}
            t={t}
            emptyLabel={t('admin.empty')}
            getTitle={(item) => item.title}
            getSubtitle={(item) => item.category}
            getMeta={(item) => `${item.reservations} ${t('admin.bookings')}`}
            getValue={(item) => Number(item.revenue || item.reservations || 0)}
            getFormattedValue={(item) => money(item.revenue, locale)}
          />
        </section>

        <section className="admin-panel">
          <PanelHead title={t('admin.fleetPerformance')} subtitle={t('admin.completeView')} />
          <div className="admin-insight-grid">
            <InsightCard label={t('admin.totalVehicles')} value={overview.totalVehicles} tone={SECTION_STYLES.fleet} />
            <InsightCard label={t('admin.totalOwners')} value={overview.totalOwners} tone={SECTION_STYLES.overview} />
            <InsightCard label={t('admin.activeOwners')} value={overview.activeOwners} tone={SECTION_STYLES.clients} />
            <InsightCard label={t('admin.totalRevenue')} value={money(overview.totalRevenue, locale)} tone={SECTION_STYLES.revenue} />
          </div>
          <CategoryRows items={categoryBreakdown} locale={locale} t={t} accent={SECTION_STYLES.fleet} />
        </section>
      </div>
    </>
  )
}

function AgendaSection({ t, locale, windows, recentReservations, upcomingReservations, getWindowLabel }) {
  return (
    <>
      <div className="admin-section-grid">
        <section className="admin-panel">
          <PanelHead title={t('admin.deliveryFlow')} subtitle={t('admin.nextToDeliver')} />
          <UpcomingTimeline items={upcomingReservations} locale={locale} emptyLabel={t('admin.empty')} t={t} />
        </section>

        <section className="admin-panel">
          <PanelHead title={t('admin.timeline')} subtitle={t('admin.latestActivity')} />
          <ReservationTable items={recentReservations.slice(0, 6)} locale={locale} emptyLabel={t('admin.empty')} t={t} compact />
        </section>
      </div>

      <section className="admin-window-grid">
        {windows.map((item) => (
          <article key={item.key} className="admin-window-card">
            <div className="admin-window-top">
              <span>{getWindowLabel(item)}</span>
              <small>{item.range}</small>
            </div>
            <strong>{item.reservations} {t('admin.bookings')}</strong>
            <p>{money(item.revenue, locale)}</p>
            <div className="admin-window-meta">
              <span>{t('admin.confirmed')}: {item.confirmed}</span>
              <span>{t('admin.clients')}: {item.uniqueClients}</span>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}

function PanelHead({ title, subtitle }) {
  return (
    <div className="admin-panel-head">
      <h2>{title}</h2>
      <span>{subtitle}</span>
    </div>
  )
}

function AdminStatCard({ icon, label, value, hint, tone }) {
  const palette = tone || SECTION_STYLES.overview

  return (
    <article className="admin-stat-card">
      <span className="admin-stat-icon" style={{ background: palette.soft, color: palette.color }}>
        <Icon name={icon} className="msi-lg" />
      </span>
      <div className="admin-stat-copy">
        <small>{label}</small>
        <strong>{value}</strong>
        {hint ? <span>{hint}</span> : null}
      </div>
    </article>
  )
}

function InsightCard({ label, value, tone }) {
  return (
    <article className="admin-insight-card" style={{ background: tone.soft }}>
      <small>{label}</small>
      <strong style={{ color: tone.color }}>{value}</strong>
    </article>
  )
}

function TrendChart({ items, locale, accent, t }) {
  if (!items.length) return <AdminEmptyPanel label={t('admin.empty')} />

  const geometry = buildTrendGeometry(items)
  const footerItems = items.slice(-3)

  return (
    <div className="admin-chart">
      <div className="admin-chart-frame">
        <svg viewBox={`0 0 ${geometry.width} ${geometry.height}`} className="admin-chart-svg" role="img">
          <defs>
            <linearGradient id="adminChartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accent.color} />
              <stop offset="100%" stopColor="#e8722d" />
            </linearGradient>
            <linearGradient id="adminAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={accent.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={accent.color} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((level) => {
            const y = geometry.baseY - level * (geometry.baseY - 18)
            return <line key={level} x1="18" y1={y} x2="622" y2={y} stroke="#e9edf4" strokeWidth="1" />
          })}

          {geometry.areaPoints ? <polygon points={geometry.areaPoints} fill="url(#adminAreaGradient)" /> : null}

          {geometry.points.map((point) => (
            <rect
              key={point.label + '-bar'}
              x={point.x - 12}
              y={geometry.baseY - point.barHeight}
              width="24"
              height={point.barHeight}
              rx="10"
              fill={accent.color}
              opacity="0.12"
            />
          ))}

          {geometry.linePoints ? (
            <polyline
              points={geometry.linePoints}
              fill="none"
              stroke="url(#adminChartGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {geometry.points.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="5.5" fill="#fff" stroke={accent.color} strokeWidth="3" />
              <text x={point.x} y="244" textAnchor="middle" fontSize="10" fill="#7b8597">
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="admin-chart-footer">
        {footerItems.map((item) => (
          <div key={item.label} className="admin-chart-mini">
            <small>{item.label}</small>
            <strong>{money(item.revenue, locale)}</strong>
            <span>{item.reservations} {t('admin.bookings')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DonutChart({ items, centerLabel, centerValue, t }) {
  if (!items.length) return <AdminEmptyPanel label={t('admin.empty')} />

  const total = items.reduce((sum, item) => sum + Number(item.value || 0), 0)
  let cursor = 0
  const background = `conic-gradient(${items.map((item) => {
    const size = total ? (Number(item.value || 0) / total) * 100 : 0
    const start = cursor
    cursor += size
    return `${item.color} ${start}% ${cursor}%`
  }).join(', ')})`

  return (
    <div className="admin-donut-wrap">
      <div className="admin-donut-shell">
        <div className="admin-donut" style={{ background }} />
        <div className="admin-donut-center">
          <small>{centerLabel}</small>
          <strong>{centerValue}</strong>
        </div>
      </div>

      <div className="admin-legend">
        {items.map((item) => (
          <div key={item.key || item.label} className="admin-legend-row">
            <div className="admin-legend-main">
              <span className="admin-legend-dot" style={{ background: item.color }} />
              <strong>{item.label}</strong>
            </div>
            <div className="admin-legend-side">
              <span>{item.value}</span>
              <small>{percent(item.value, total)}% {t('admin.ofTotal')}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WindowColumns({ windows, locale, getWindowLabel, t }) {
  if (!windows.length) return <AdminEmptyPanel label={t('admin.empty')} />

  const maxRevenue = Math.max(1, ...windows.map((item) => Number(item.revenue || 0)))

  return (
    <div className="admin-columns">
      {windows.map((item) => (
        <article key={item.key} className="admin-column-card">
          <div className="admin-column-track">
            <div className="admin-column-fill" style={{ height: `${Math.max(12, (Number(item.revenue || 0) / maxRevenue) * 100)}%` }} />
          </div>
          <strong>{getWindowLabel(item)}</strong>
          <span>{money(item.revenue, locale)}</span>
          <small>{item.reservations} {t('admin.bookings')}</small>
        </article>
      ))}
    </div>
  )
}

function CategoryRows({ items, locale, t, accent }) {
  if (!items.length) return <AdminEmptyPanel label={t('admin.empty')} />

  const maxRevenue = Math.max(1, ...items.map((item) => Number(item.revenue || 0)))

  return (
    <div className="admin-rank-list">
      {items.map((item) => (
        <article key={item.name} className="admin-rank-row">
          <div className="admin-rank-top">
            <div>
              <strong>{item.name}</strong>
              <span>{item.reservations} {t('admin.bookings')}</span>
            </div>
            <div className="admin-rank-side">
              <span>{money(item.revenue, locale)}</span>
            </div>
          </div>
          <div className="admin-rank-track">
            <div
              className="admin-rank-fill"
              style={{
                width: `${(Number(item.revenue || 0) / maxRevenue) * 100}%`,
                background: accent.gradient,
              }}
            />
          </div>
        </article>
      ))}
    </div>
  )
}

function RankingRows({ items, accent, t, emptyLabel, getTitle, getSubtitle, getMeta, getValue, getFormattedValue }) {
  if (!items.length) return <AdminEmptyPanel label={emptyLabel} />

  const maxValue = Math.max(1, ...items.map((item) => Number(getValue(item) || 0)))

  return (
    <div className="admin-rank-list">
      {items.map((item) => (
        <article key={item.key || item.id || getTitle(item)} className="admin-rank-row">
          <div className="admin-rank-top">
            <div>
              <strong>{getTitle(item)}</strong>
              <span>{getSubtitle(item)}</span>
            </div>
            <div className="admin-rank-side">
              <span>{getFormattedValue(item)}</span>
              <small>{getMeta(item)}</small>
            </div>
          </div>
          <div className="admin-rank-track">
            <div
              className="admin-rank-fill"
              style={{
                width: `${(Number(getValue(item) || 0) / maxValue) * 100}%`,
                background: accent.gradient,
              }}
            />
          </div>
        </article>
      ))}
    </div>
  )
}

function ReservationTable({ items, locale, emptyLabel, t, compact = false }) {
  if (!items.length) return <AdminEmptyPanel label={emptyLabel} />

  return (
    <div className={`admin-table${compact ? ' compact' : ''}`}>
      {items.map((item) => (
        <div key={item.id} className="admin-table-row">
          <div>
            <strong>{item.vehicleTitle}</strong>
            <span>{item.clientName}{item.clientEmail ? ` - ${item.clientEmail}` : ''}</span>
          </div>
          <div>
            <strong>{item.startDate}</strong>
            <span>{item.endDate}</span>
          </div>
          <div>
            <strong>{money(item.total, locale)}</strong>
            <span>{t('admin.status.' + item.status)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function UpcomingTimeline({ items, locale, emptyLabel, t }) {
  if (!items.length) return <AdminEmptyPanel label={emptyLabel} />

  return (
    <div className="admin-timeline">
      {items.map((item) => (
        <article key={item.id} className="admin-timeline-row">
          <div className="admin-timeline-date">
            <strong>{item.startDate}</strong>
            <span>{item.days} {t('common.days')}</span>
          </div>
          <div className="admin-timeline-copy">
            <strong>{item.vehicleTitle}</strong>
            <span>{item.clientName}</span>
          </div>
          <div className="admin-timeline-total">
            <strong>{money(item.total, locale)}</strong>
            <span>{item.endDate}</span>
          </div>
        </article>
      ))}
    </div>
  )
}

function AdminEmptyPanel({ label }) {
  return (
    <div className="admin-empty-panel">
      <Icon name="monitoring" className="msi-lg" style={{ color: '#c7d0de' }} />
      <span>{label || 'Sin datos todavia'}</span>
    </div>
  )
}
