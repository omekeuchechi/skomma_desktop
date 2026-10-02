import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthTokens, User } from '@types';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setTokens: (tokens: AuthTokens | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isHydrated: false,
      setTokens: (tokens) => set({ tokens, isAuthenticated: Boolean(tokens) }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, tokens: null, isAuthenticated: false }),
    }),
    {
      name: 'skomma-auth',
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;
      },
    },
  ),
);
