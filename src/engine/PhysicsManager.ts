import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HavokPlugin } from '@babylonjs/core/Physics/v2/Plugins/havokPlugin';
import type { Scene } from '@babylonjs/core/scene';
import HavokPhysics from '@babylonjs/havok';
import { WORLD } from '@constants/index';

export class PhysicsManager {
  private readonly scene: Scene;
  private plugin: HavokPlugin | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  async init(): Promise<void> {
    const havok = await HavokPhysics();
    this.plugin = new HavokPlugin(true, havok);
    this.scene.enablePhysics(new Vector3(0, WORLD.gravity, 0), this.plugin);
  }

  get isReady(): boolean {
    return this.plugin !== null;
  }
}
