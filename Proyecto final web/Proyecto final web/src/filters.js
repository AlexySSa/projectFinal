export function filtrarVehiculos(list, filters = {}, q = '') {
  const query = (q || '').toLowerCase()
  return list.filter((v) => {
    if (query && !(`${v.titulo} ${v.marca} ${v.modelo}`.toLowerCase().includes(query))) return false
    if (filters.peso && v.peso !== filters.peso) return false
    if (filters.marca && v.marca !== filters.marca) return false
    if (filters.modelo && v.modelo !== filters.modelo) return false
    if (filters.direccion && v.direccion !== filters.direccion) return false
    if (filters.condicion && v.condicion !== filters.condicion) return false
    if (filters.precio && Number(v.tarifa) > Number(filters.precio)) return false
    return true
  })
}
