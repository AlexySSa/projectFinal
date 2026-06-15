import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Detalle from './pages/Detalle.jsx'
import MisVehiculos from './pages/MisVehiculos.jsx'
import NuevoVehiculo from './pages/NuevoVehiculo.jsx'
import Favoritos from './pages/Favoritos.jsx'
import Reserva from './pages/Reserva.jsx'
import Facturas from './pages/Facturas.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function Protected({ children, adminOnly = false, arrendadorOnly = false, nonAdminOnly = false }) {
  const { isLogged, isAdmin, isArrendador } = useAuth()

  if (!isLogged) return <Navigate to="/auth" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/catalogo" replace />
  if (arrendadorOnly && !isArrendador) {
    return <Navigate to={isAdmin ? '/admin' : '/catalogo'} replace />
  }
  if (nonAdminOnly && isAdmin) return <Navigate to="/admin" replace />

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/vehiculo/:id" element={<Detalle />} />
      <Route path="/favoritos" element={<Protected nonAdminOnly><Favoritos /></Protected>} />
      <Route path="/reservar/:id" element={<Reserva />} />
      <Route path="/facturas" element={<Protected nonAdminOnly><Facturas /></Protected>} />
      <Route path="/mis-vehiculos" element={<Protected arrendadorOnly><MisVehiculos /></Protected>} />
      <Route path="/nuevo-vehiculo" element={<Protected arrendadorOnly><NuevoVehiculo /></Protected>} />
      <Route path="/admin" element={<Protected adminOnly><AdminDashboard /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
