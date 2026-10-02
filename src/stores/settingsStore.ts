import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light' | 'system';

interface SettingsState {
  theme: ThemeMode;
  language: string;
  showFps: boolean;
  graphicsQuality: 'low' | 'medium' | 'high' | 'ultra';
  viewDistance: number;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: string) => void;
  setShowFps: (show: boolean) => void;
  setGraphicsQuality: (quality: SettingsState['graphicsQuality']) => void;
  setViewDistance: (distance: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'en',
      showFps: false,
      graphicsQuality: 'medium',
      viewDistance: 4,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setShowFps: (showFps) => set({ showFps }),
      setGraphicsQuality: (graphicsQuality) => set({ graphicsQuality }),
      setViewDistance: (viewDistance) => set({ viewDistance }),
    }),
    { name: 'skomma-settings' },
  ),
);
