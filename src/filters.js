export function filtrarVehiculos(list, filters = {}, q = '', loc = '') {
  const query = (q || '').trim().toLowerCase()
  const place = (loc || '').trim().toLowerCase()
  return list.filter((v) => {
    if (query) {
      const haystack = `${v.titulo || ''} ${v.marca || ''} ${v.modelo || ''} ${v.categoria || ''} ${v.descripcion || ''} ${v.direccion || ''} ${v.direccionCompleta || ''}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    if (place) {
      const where = `${v.direccion || ''} ${v.direccionCompleta || ''}`.toLowerCase()
      if (!where.includes(place)) return false
    }
    if (filters.peso && v.peso !== filters.peso) return false
    if (filters.marca && v.marca !== filters.marca) return false
    if (filters.modelo && v.modelo !== filters.modelo) return false
    if (filters.direccion && v.direccion !== filters.direccion) return false
    if (filters.condicion && v.condicion !== filters.condicion) return false
    if (filters.precio && Number(v.tarifa) > Number(filters.precio)) return false
    return true
  })
}
