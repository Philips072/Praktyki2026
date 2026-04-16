import { Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) return <Navigate to="/logowanie" replace />

  return children
}

export default PrivateRoute
