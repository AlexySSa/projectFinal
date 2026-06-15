import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../api.js'
import { useT } from '../i18n.js'

function money(value) {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(value || 0))
}

export default function AdminDashboard() {
  const { t, tErr, lang } = useT()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
  }, [lang])

  const maxTrendRevenue = useMemo(() => {
    const values = stats?.monthlyTrend?.map((item) => item.revenue) || []
    return Math.max(1, ...values)
  }, [stats])

  const maxCategoryRevenue = useMemo(() => {
    const values = stats?.categoryBreakdown?.map((item) => item.revenue) || []
    return Math.max(1, ...values)
  }, [stats])

  const getWindowLabel = (item) => {
    const key = `admin.window.${item.key}`
    const translated = t(key)
    return translated === key ? item.label : translated
  }

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
                <strong>{t('admin.activeRentals')}: {stats.overview.activeRentals}</strong>
              </div>
            </section>

            <section className="admin-window-grid">
              {stats.windows.map((item) => (
                <article key={item.key} className="admin-window-card">
                  <div className="admin-window-top">
                    <span>{getWindowLabel(item)}</span>
                    <small>{item.range}</small>
                  </div>
                  <strong>{item.reservations} {t('admin.bookings')}</strong>
                  <p>{money(item.revenue)}</p>
                  <div className="admin-window-meta">
                    <span>{t('admin.confirmed')}: {item.confirmed}</span>
                    <span>{t('admin.clients')}: {item.uniqueClients}</span>
                  </div>
                </article>
              ))}
            </section>

            <section className="admin-overview-grid">
              <AdminStatCard icon="event_available" label={t('admin.totalReservations')} value={stats.overview.totalReservations} />
              <AdminStatCard icon="paid" label={t('admin.totalRevenue')} value={money(stats.overview.totalRevenue)} />
              <AdminStatCard icon="groups" label={t('admin.totalClients')} value={stats.overview.totalClients} />
              <AdminStatCard icon="directions_car" label={t('admin.totalVehicles')} value={stats.overview.totalVehicles} />
              <AdminStatCard icon="storefront" label={t('admin.totalOwners')} value={stats.overview.totalOwners} />
              <AdminStatCard icon="group" label={t('admin.uniqueRenters')} value={stats.overview.uniqueClients} />
            </section>

            <div className="admin-grid">
              <section className="admin-panel">
                <div className="admin-panel-head">
                  <h2>{t('admin.monthlyTrend')}</h2>
                  <span>{t('admin.last12Months')}</span>
                </div>
                <div className="admin-bars">
                  {stats.monthlyTrend.map((item) => (
                    <div key={item.label} className="admin-bar-row">
                      <div className="admin-bar-label">
                        <strong>{item.label}</strong>
                        <span>{item.reservations} {t('admin.bookings')}</span>
                      </div>
                      <div className="admin-bar-track">
                        <div className="admin-bar-fill" style={{ width: `${(item.revenue / maxTrendRevenue) * 100}%` }} />
                      </div>
                      <div className="admin-bar-value">{money(item.revenue)}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="admin-panel">
                <div className="admin-panel-head">
                  <h2>{t('admin.statusAndCategories')}</h2>
                  <span>{t('admin.completeView')}</span>
                </div>

                <div className="admin-mini-grid">
                  {stats.statusBreakdown.map((item) => (
                    <div key={item.status} className="admin-pill-card">
                      <strong>{t('admin.status.' + item.status)}</strong>
                      <span>{item.count} {t('admin.bookings')}</span>
                    </div>
                  ))}
                </div>

                <div className="admin-category-list">
                  {stats.categoryBreakdown.map((item) => (
                    <div key={item.name} className="admin-category-row">
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.reservations} {t('admin.bookings')}</span>
                      </div>
                      <div className="admin-category-track">
                        <div className="admin-category-fill" style={{ width: `${(item.revenue / maxCategoryRevenue) * 100}%` }} />
                      </div>
                      <span>{money(item.revenue)}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="admin-grid">
              <section className="admin-panel">
                <div className="admin-panel-head">
                  <h2>{t('admin.topVehicles')}</h2>
                  <span>{t('admin.mostRequested')}</span>
                </div>
                <div className="admin-list">
                  {stats.topVehicles.length ? (
                    stats.topVehicles.map((item) => (
                      <div key={item.id} className="admin-list-row">
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.category}</span>
                        </div>
                        <div className="admin-list-side">
                          <span>{item.reservations} {t('admin.bookings')}</span>
                          <strong>{money(item.revenue)}</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">{t('admin.empty')}</div>
                  )}
                </div>
              </section>

              <section className="admin-panel">
                <div className="admin-panel-head">
                  <h2>{t('admin.topClients')}</h2>
                  <span>{t('admin.bestCustomers')}</span>
                </div>
                <div className="admin-list">
                  {stats.topClients.length ? (
                    stats.topClients.map((item) => (
                      <div key={item.key} className="admin-list-row">
                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.email}</span>
                        </div>
                        <div className="admin-list-side">
                          <span>{item.reservations} {t('admin.bookings')}</span>
                          <strong>{money(item.revenue)}</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">{t('admin.empty')}</div>
                  )}
                </div>
              </section>
            </div>

            <div className="admin-grid">
              <section className="admin-panel">
                <div className="admin-panel-head">
                  <h2>{t('admin.recentReservations')}</h2>
                  <span>{t('admin.latestActivity')}</span>
                </div>
                <div className="admin-table">
                  {stats.recentReservations.length ? (
                    stats.recentReservations.map((item) => (
                      <div key={item.id} className="admin-table-row">
                        <div>
                          <strong>{item.vehicleTitle}</strong>
                          <span>{item.clientName} - {item.clientEmail}</span>
                        </div>
                        <div>
                          <strong>{item.startDate}</strong>
                          <span>{item.endDate}</span>
                        </div>
                        <div>
                          <strong>{money(item.total)}</strong>
                          <span>{t('admin.status.' + item.status)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">{t('admin.empty')}</div>
                  )}
                </div>
              </section>

              <section className="admin-panel">
                <div className="admin-panel-head">
                  <h2>{t('admin.upcomingReservations')}</h2>
                  <span>{t('admin.nextToDeliver')}</span>
                </div>
                <div className="admin-table">
                  {stats.upcomingReservations.length ? (
                    stats.upcomingReservations.map((item) => (
                      <div key={item.id} className="admin-table-row">
                        <div>
                          <strong>{item.vehicleTitle}</strong>
                          <span>{item.clientName}</span>
                        </div>
                        <div>
                          <strong>{item.startDate}</strong>
                          <span>{item.endDate}</span>
                        </div>
                        <div>
                          <strong>{item.days} {t('common.days')}</strong>
                          <span>{money(item.total)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">{t('admin.empty')}</div>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </>
  )
}

function AdminStatCard({ icon, label, value }) {
  return (
    <article className="admin-stat-card">
      <span className="admin-stat-icon">
        <Icon name={icon} className="msi-lg" />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </article>
  )
}
