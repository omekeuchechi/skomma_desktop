import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';
import { useSettingsStore, type ThemeMode } from '@stores/settingsStore';

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

function subscribePrefersDark(callback: () => void): () => void {
  darkModeMediaQuery.addEventListener('change', callback);
  return () => darkModeMediaQuery.removeEventListener('change', callback);
}

function getPrefersDark(): boolean {
  return darkModeMediaQuery.matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const prefersDark = useSyncExternalStore(subscribePrefersDark, getPrefersDark);

  const resolvedTheme: 'dark' | 'light' = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
