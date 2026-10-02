import { APP_NAME, DEFAULT_API_URL, DEFAULT_WS_URL } from '@constants/index';

const resolveUrl = (value: string | undefined, fallback: string): string =>
  value && value.trim().length > 0 ? value.trim() : fallback;

export const config = {
  appName: APP_NAME,
  apiUrl: resolveUrl(import.meta.env.VITE_API_URL, DEFAULT_API_URL),
  wsUrl: resolveUrl(import.meta.env.VITE_WS_URL, DEFAULT_WS_URL),
  isTauri: typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window,
} as const;
