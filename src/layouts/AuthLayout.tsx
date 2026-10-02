import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '@components/ThemeToggle';
import { APP_NAME } from '@constants/index';

export function AuthLayout() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-surface-950 px-4 text-surface-100">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary-700/30 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-accent-700/30 blur-3xl" />
      </div>

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mb-8 flex flex-col items-center gap-2">
        <div className="size-4 rounded-full bg-accent-500 shadow-glow" />
        <h1 className="font-display text-3xl font-bold text-gradient">{APP_NAME}</h1>
        <p className="text-sm text-surface-400">The 3D commerce world</p>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
