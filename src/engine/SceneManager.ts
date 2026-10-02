import { Scene } from '@babylonjs/core/scene';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import type { Engine } from '@babylonjs/core/Engines/engine';

export class SceneManager {
  readonly scene: Scene;

  constructor(engine: Engine) {
    this.scene = new Scene(engine);
    this.scene.clearColor = new Color4(0.02, 0.03, 0.08, 1);
    this.scene.ambientColor = new Color3(0.2, 0.25, 0.3);
  }

  dispose(): void {
    this.scene.dispose();
  }
}
