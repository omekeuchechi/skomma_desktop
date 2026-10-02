import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { APP_NAME, ROUTES } from '@constants/index';

export function SplashScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const duration = 2400;
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const next = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(next);
      if (next >= 100) {
        window.clearInterval(interval);
        navigate(isAuthenticated ? ROUTES.home : ROUTES.login, { replace: true });
      }
    }, 60);
    return () => window.clearInterval(interval);
  }, [navigate, isAuthenticated]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-surface-950 text-surface-100">
      <div className="relative">
        <div className="size-5 rounded-full bg-accent-500 shadow-glow" />
        <div className="absolute inset-0 animate-ping rounded-full bg-accent-500/40" />
      </div>
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-gradient">{APP_NAME}</h1>
        <p className="mt-2 text-sm text-surface-400">Loading the 3D commerce world...</p>
      </div>
      <div className="h-1 w-56 overflow-hidden rounded-full bg-surface-800">
        <div
          className="h-full rounded-full bg-accent-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
