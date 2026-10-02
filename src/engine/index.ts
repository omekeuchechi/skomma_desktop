import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { SkommaEngine } from './Engine';
import { SceneManager } from './SceneManager';
import { CameraManager } from './CameraManager';
import { LightingManager } from './LightingManager';
import { PhysicsManager } from './PhysicsManager';
import { AssetManager } from './AssetManager';
import { PlayerManager } from './PlayerManager';
import { NPCManager } from './NPCManager';
import { VehicleManager } from './VehicleManager';

export { SkommaEngine } from './Engine';
export { SceneManager } from './SceneManager';
export { CameraManager } from './CameraManager';
export { LightingManager } from './LightingManager';
export { PhysicsManager } from './PhysicsManager';
export { AssetManager } from './AssetManager';
export { PlayerManager } from './PlayerManager';
export { NPCManager } from './NPCManager';
export { VehicleManager } from './VehicleManager';

export interface WorldEngineOptions {
  canvas: HTMLCanvasElement;
  viewDistance?: number;
}

export class WorldEngine {
  readonly engine: SkommaEngine;
  readonly scene: SceneManager;
  readonly camera: CameraManager;
  readonly lighting: LightingManager;
  readonly physics: PhysicsManager;
  readonly assets: AssetManager;
  readonly player: PlayerManager;
  readonly npcs: NPCManager;
  readonly vehicles: VehicleManager;

  private lastTick = performance.now();
  private running = false;
  private readonly viewDistance: number;

  constructor(options: WorldEngineOptions) {
    this.viewDistance = options.viewDistance ?? 3;
    this.engine = new SkommaEngine(options.canvas);
    this.scene = new SceneManager(this.engine.native);
    this.camera = new CameraManager(this.scene.scene, options.canvas);
    this.lighting = new LightingManager(this.scene.scene);
    this.physics = new PhysicsManager(this.scene.scene);
    this.assets = new AssetManager(this.scene.scene);
    this.player = new PlayerManager(this.scene.scene);
    this.npcs = new NPCManager(this.scene.scene);
    this.vehicles = new VehicleManager(this.scene.scene);
  }

  async start(): Promise<void> {
    await this.physics.init();

    this.npcs.spawn('npc-01', 'merchant', new Vector3(2, 0.5, 2));
    this.vehicles.spawn('veh-01', 'courier', new Vector3(-3, 0.35, -2));

    this.player.attachInput();
    this.running = true;

    this.engine.run(() => {
      const now = performance.now();
      const delta = Math.min((now - this.lastTick) / 1000, 0.05);
      this.lastTick = now;

      this.player.update(delta);
      this.npcs.update(delta);
      this.vehicles.update(delta);
      this.scene.scene.render();
    });
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    this.player.detachInput();
    this.assets.dispose();
    this.engine.dispose();
  }
}
