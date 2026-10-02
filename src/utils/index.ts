import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | number | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function debounce<A extends unknown[]>(fn: (...args: A) => void, wait = 250): (...args: A) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}
