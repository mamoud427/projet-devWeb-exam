import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAppSelector(s => s.auth)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}