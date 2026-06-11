import { Routes, Route, Navigate } from 'react-router-dom'
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

function Protected({ children }) {
  const { isLogged } = useAuth()
  return isLogged ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/vehiculo/:id" element={<Detalle />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/reservar/:id" element={<Reserva />} />
      <Route path="/facturas" element={<Protected><Facturas /></Protected>} />
      <Route path="/mis-vehiculos" element={<Protected><MisVehiculos /></Protected>} />
      <Route path="/nuevo-vehiculo" element={<Protected><NuevoVehiculo /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
