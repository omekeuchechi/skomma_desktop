import { create } from 'zustand';
import type { WorldState } from '@types';

interface UiState {
  sidebarOpen: boolean;
  notifications: string[];
  world: WorldState;
  toggleSidebar: () => void;
  pushNotification: (message: string) => void;
  dismissNotification: (index: number) => void;
  setWorldState: (partial: Partial<WorldState>) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  sidebarOpen: true,
  notifications: [],
  world: {
    loadingProgress: 0,
    currentChunk: '0:0:0',
    status: 'idle',
  },
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  pushNotification: (message) =>
    set((state) => ({ notifications: [...state.notifications, message] })),
  dismissNotification: (index) =>
    set((state) => ({
      notifications: state.notifications.filter((_, i) => i !== index),
    })),
  setWorldState: (partial) =>
    set((state) => ({ world: { ...state.world, ...partial } })),
}));
