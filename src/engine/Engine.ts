import { Engine } from '@babylonjs/core/Engines/engine';

export interface EngineOptions {
  antialias?: boolean;
  powerPreference?: 'high-performance' | 'low-power';
  adaptive?: boolean;
}

export class SkommaEngine {
  readonly engine: Engine;

  constructor(canvas: HTMLCanvasElement, options: EngineOptions = {}) {
    this.engine = new Engine(canvas, options.antialias ?? true, {
      antialias: options.antialias ?? true,
      powerPreference: options.powerPreference ?? 'high-performance',
      adaptToDeviceRatio: options.adaptive ?? true,
      stencil: true,
    });
  }

  get native(): Engine {
    return this.engine;
  }

  run(renderLoop: () => void): void {
    this.engine.runRenderLoop(renderLoop);
  }

  resize(): void {
    this.engine.resize();
  }

  dispose(): void {
    this.engine.dispose();
  }
}
