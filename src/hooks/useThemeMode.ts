import { useTheme } from '@contexts/ThemeContext';
import type { ThemeMode } from '@stores/settingsStore';

export function useThemeMode(): ThemeMode {
  return useTheme().theme;
}
