import { Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) return null

  if (!user) return <Navigate to="/logowanie" replace />

  // Sprawdź czy użytkownik ma rolę administratora
  if (!profile || profile.role !== 'administrator') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
