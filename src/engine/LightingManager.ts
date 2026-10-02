import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';

export interface LightingConfig {
  intensity?: number;
  hemisphereIntensity?: number;
}

export class LightingManager {
  readonly sun: DirectionalLight;
  readonly ambient: HemisphericLight;

  constructor(scene: Scene, config: LightingConfig = {}) {
    this.sun = new DirectionalLight('sunLight', new Vector3(0.4, -1, 0.2), scene);
    this.sun.intensity = config.intensity ?? 1.6;
    this.sun.diffuse.set(1, 0.95, 0.85);
    this.sun.specular.set(0.4, 0.4, 0.4);

    this.ambient = new HemisphericLight('ambientLight', new Vector3(0, 1, 0), scene);
    this.ambient.intensity = config.hemisphereIntensity ?? 0.45;
  }

  setSunIntensity(intensity: number): void {
    this.sun.intensity = intensity;
  }

  dispose(): void {
    this.sun.dispose();
    this.ambient.dispose();
  }
}
