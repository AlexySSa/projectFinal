export default function FilterSidebar({ filters, setFilters }) {
  const set = (key, value) => setFilters((f) => ({ ...f, [key]: value }))

  return (
    <aside className="filter-card">
      <h2>Filtro</h2>

      <h4>Categorías</h4>
      {['Liviano', 'Mediano', 'Pesado'].map((c) => (
        <label key={c} className="radio-row">
          <input
            type="radio"
            name="peso"
            checked={filters.peso === c}
            onChange={() => set('peso', c)}
          />
          {c}
        </label>
      ))}

      <h4>Marca</h4>
      <select className="field" value={filters.marca} onChange={(e) => set('marca', e.target.value)}>
        <option value="">Marca</option>
        <option>Yamaha</option>
        <option>Honda</option>
        <option>Toyota</option>
        <option>Chevrolet</option>
        <option>John Deere</option>
      </select>

      <h4>Modelo</h4>
      <select className="field" value={filters.modelo} onChange={(e) => set('modelo', e.target.value)}>
        <option value="">Modelo</option>
        <option>R7</option>
        <option>CBR</option>
        <option>Corolla</option>
      </select>

      <h4>Rango de precio</h4>
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

      <h4>Dirección</h4>
      <select className="field" value={filters.direccion} onChange={(e) => set('direccion', e.target.value)}>
        <option value="">Municipio, Departamento</option>
        <option>San Miguel, San Miguel</option>
        <option>San Salvador, San Salvador</option>
        <option>Santa Ana, Santa Ana</option>
      </select>

      <h4>Condición</h4>
      <select className="field" value={filters.condicion} onChange={(e) => set('condicion', e.target.value)}>
        <option value="">Cualquiera</option>
        <option>Excelente</option>
        <option>Buena</option>
        <option>Regular</option>
      </select>
    </aside>
  )
}
