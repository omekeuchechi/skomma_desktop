import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return null; // or return a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
