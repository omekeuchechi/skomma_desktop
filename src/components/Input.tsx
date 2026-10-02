import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@utils/index';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-surface-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'rounded-lg border border-surface-600/50 bg-surface-800/70 px-3 py-2 text-sm text-surface-100 placeholder:text-surface-500 focus-ring',
          error && 'border-danger-500',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-danger-500">{error}</span>}
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, ...props },
  ref,
) {
  const textareaId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-surface-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          'rounded-lg border border-surface-600/50 bg-surface-800/70 px-3 py-2 text-sm text-surface-100 placeholder:text-surface-500 focus-ring',
          error && 'border-danger-500',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-danger-500">{error}</span>}
    </div>
  );
});
