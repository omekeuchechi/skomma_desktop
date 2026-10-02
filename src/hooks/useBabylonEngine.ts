import { useEffect, useRef } from 'react';
import { WorldEngine } from '@engine/index';

export interface BabylonHookOptions {
  viewDistance?: number;
}

export function useBabylonEngine(options: BabylonHookOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<WorldEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const world = new WorldEngine({ canvas, viewDistance: options.viewDistance });
    engineRef.current = world;
    void world.start();

    const onResize = () => world.engine.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      world.stop();
      engineRef.current = null;
    };
  }, [options.viewDistance]);

  return { canvasRef, engineRef };
}
