import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '@stores/uiStore';
import { ROUTES } from '@constants/index';
import { clamp } from '@utils/index';

export function WorldLoading() {
  const navigate = useNavigate();
  const { world, setWorldState } = useUiStore();
  const [progress, setProgress] = useState(world.loadingProgress);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setWorldState({ status: 'generating' });
    intervalRef.current = window.setInterval(() => {
      setProgress((current) => {
        const next = clamp(current + Math.random() * 6, 0, 100);
        setWorldState({ loadingProgress: next, status: next >= 100 ? 'ready' : 'generating' });
        if (next >= 100) {
          window.clearInterval(intervalRef.current);
          window.setTimeout(() => navigate(ROUTES.world, { replace: true }), 600);
        }
        return next;
      });
    }, 160);
    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [navigate, setWorldState]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 bg-surface-950 text-surface-100">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-gradient">Generating your world</h1>
        <p className="mt-2 text-sm text-surface-400">
          Streaming chunks · chunk {world.currentChunk}
        </p>
      </div>

      <div className="w-80">
        <div className="mb-2 flex justify-between text-xs text-surface-400">
          <span>{world.status}</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
