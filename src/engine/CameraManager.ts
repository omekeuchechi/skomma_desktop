import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';

export interface CameraConfig {
  alpha?: number;
  beta?: number;
  radius?: number;
  target?: Vector3;
  minZ?: number;
  maxZ?: number;
}

export class CameraManager {
  readonly camera: ArcRotateCamera;

  constructor(scene: Scene, canvas: HTMLCanvasElement, config: CameraConfig = {}) {
    this.camera = new ArcRotateCamera(
      'worldCamera',
      config.alpha ?? -Math.PI / 2,
      config.beta ?? Math.PI / 2.6,
      config.radius ?? 14,
      config.target ?? Vector3.Zero(),
      scene,
    );
    this.camera.minZ = config.minZ ?? 0.1;
    this.camera.maxZ = config.maxZ ?? 1000;
    this.camera.attachControl(canvas, true);
    this.camera.wheelDeltaPercentage = 0.02;
    this.camera.pinchDeltaPercentage = 0.02;
  }

  lookAt(target: Vector3): void {
    this.camera.setTarget(target);
  }

  dispose(): void {
    this.camera.dispose();
  }
}
