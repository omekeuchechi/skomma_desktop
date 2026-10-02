import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@utils/index';
import { Spinner } from '@components/Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 disabled:bg-primary-800',
  secondary:
    'bg-surface-800 text-surface-100 border border-surface-600/50 hover:bg-surface-700 active:bg-surface-900',
  ghost: 'text-surface-300 hover:text-white hover:bg-surface-800',
  danger: 'bg-danger-600 text-white hover:bg-danger-500 active:bg-danger-700',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer focus-ring',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  );
});
