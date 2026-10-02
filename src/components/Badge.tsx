import type { HTMLAttributes } from 'react';
import { cn } from '@utils/index';

type Tone = 'neutral' | 'primary' | 'accent' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-700/60 text-surface-200 border-surface-600/50',
  primary: 'bg-primary-900/60 text-primary-300 border-primary-700/50',
  accent: 'bg-accent-900/60 text-accent-300 border-accent-700/50',
  danger: 'bg-danger-700/60 text-red-200 border-danger-600/50',
};

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
