import { useT } from '../i18n.js'

export default function FilterSidebar({ filters, setFilters }) {
  const { t } = useT()
  const set = (key, value) => setFilters((f) => ({ ...f, [key]: value }))

  return (
    <aside className="filter-card">
      <h2>{t('filter.title')}</h2>

      <h4>{t('filter.categories')}</h4>
      {['Liviano', 'Mediano', 'Pesado'].map((c) => (
        <label key={c} className="radio-row">
          <input
            type="radio"
            name="peso"
            checked={filters.peso === c}
            onChange={() => set('peso', c)}
          />
          {t('weight.' + c)}
        </label>
      ))}

      <h4>{t('filter.brand')}</h4>
      <select className="field" value={filters.marca} onChange={(e) => set('marca', e.target.value)}>
        <option value="">{t('filter.brand')}</option>
        <option>Yamaha</option>
        <option>Honda</option>
        <option>Toyota</option>
        <option>Chevrolet</option>
        <option>John Deere</option>
      </select>

      <h4>{t('filter.model')}</h4>
      <select className="field" value={filters.modelo} onChange={(e) => set('modelo', e.target.value)}>
        <option value="">{t('filter.model')}</option>
        <option>R7</option>
        <option>CBR</option>
        <option>Corolla</option>
      </select>

      <h4>{t('filter.priceRange')}</h4>
      <input
        type="range"
        min="50"
        max="150"
        value={filters.precio}
        onChange={(e) => set('precio', Number(e.target.value))}
      />
      <div className="range-row">
        <span>$50</span>
        <span>$75-$100</span>
        <span>$150</span>
      </div>

      <h4>{t('filter.address')}</h4>
      <select className="field" value={filters.direccion} onChange={(e) => set('direccion', e.target.value)}>
        <option value="">{t('filter.addressPlaceholder')}</option>
        <option>San Miguel, San Miguel</option>
        <option>San Salvador, San Salvador</option>
        <option>Santa Ana, Santa Ana</option>
      </select>

      <h4>{t('filter.condition')}</h4>
      <select className="field" value={filters.condicion} onChange={(e) => set('condicion', e.target.value)}>
        <option value="">{t('filter.any')}</option>
        <option value="Excelente">{t('cond.Excelente')}</option>
        <option value="Buena">{t('cond.Buena')}</option>
        <option value="Regular">{t('cond.Regular')}</option>
      </select>
    </aside>
  )
}
