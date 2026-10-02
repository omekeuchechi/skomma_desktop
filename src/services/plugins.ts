import { config } from '@config/index';
import { load } from '@tauri-apps/plugin-store';
import { ask } from '@tauri-apps/plugin-dialog';
import { Command } from '@tauri-apps/plugin-shell';
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';
import { check } from '@tauri-apps/plugin-updater';

function isTauri(): boolean {
  return config.isTauri;
}

export async function notify(title: string, body?: string): Promise<void> {
  if (!isTauri()) return;
  try {
    let granted = await isPermissionGranted();
    if (!granted) {
      granted = (await requestPermission()) === 'granted';
    }
    if (granted) sendNotification({ title, body });
  } catch {
    // Notifications are optional; never block the caller.
  }
}

export async function confirmAction(message: string, title = 'Skomma'): Promise<boolean> {
  if (!isTauri()) return window.confirm(message);
  try {
    return await ask(message, { title, kind: 'warning' });
  } catch {
    return false;
  }
}

export async function persistSetting<T>(key: string, value: T): Promise<void> {
  if (!isTauri()) {
    localStorage.setItem(`skomma:${key}`, JSON.stringify(value));
    return;
  }
  try {
    const store = await load('settings.json', { autoSave: true });
    await store.set(key, value);
    await store.save();
  } catch {
    localStorage.setItem(`skomma:${key}`, JSON.stringify(value));
  }
}

export async function openExternal(url: string): Promise<void> {
  if (!isTauri()) {
    window.open(url, '_blank', 'noopener');
    return;
  }
  try {
    const command = Command.create('open', [url]);
    await command.execute();
  } catch {
    window.open(url, '_blank', 'noopener');
  }
}

export async function checkForUpdates(): Promise<string | null> {
  if (!isTauri()) return null;
  try {
    const update = await check();
    if (update) {
      await update.downloadAndInstall();
      return update.version;
    }
    return null;
  } catch {
    return null;
  }
}
