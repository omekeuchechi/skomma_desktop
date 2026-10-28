import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return <div className="flex items-center justify-center w-screen h-screen bg-surface-950 text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
