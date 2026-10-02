import { useEffect } from 'react';
import { useAuthStore } from '@stores/authStore';
import { fetchMe } from '@services/api';

export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchMe()
        .then(setUser)
        .catch(() => logout());
    }
  }, [isAuthenticated, user, setUser, logout]);

  return { user, isAuthenticated, logout };
}
