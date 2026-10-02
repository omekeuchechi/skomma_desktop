import type { HTMLAttributes } from 'react';
import { cn } from '@utils/index';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function Card({ title, description, className, children, ...props }: CardProps) {
  return (
    <div className={cn('glass-panel p-5', className)} {...props}>
      {title && (
        <div className="mb-3">
          <h3 className="font-display text-lg font-semibold text-surface-100">{title}</h3>
          {description && <p className="mt-1 text-sm text-surface-400">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
