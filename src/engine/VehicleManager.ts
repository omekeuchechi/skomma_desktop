import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { WORLD } from '@constants/index';

export interface VehicleState {
  id: string;
  kind: string;
  position: Vector3;
  heading: number;
}

export interface VehicleConfig {
  cap?: number;
}

export class VehicleManager {
  private readonly scene: Scene;
  private readonly cap: number;
  private readonly vehicles = new Map<string, VehicleState>();

  constructor(scene: Scene, config: VehicleConfig = {}) {
    this.scene = scene;
    this.cap = config.cap ?? WORLD.vehicleCap;
  }

  spawn(id: string, kind: string, position: Vector3): VehicleState | null {
    if (this.vehicles.size >= this.cap) return null;
    if (this.vehicles.has(id)) return this.vehicles.get(id) ?? null;

    const mesh = MeshBuilder.CreateBox(`vehicle_${id}`, { width: 1.6, height: 0.7, depth: 3 }, this.scene);
    mesh.position = position;
    const material = new StandardMaterial(`vehicleMat_${id}`, this.scene);
    material.diffuseColor = new Color3(0.3, 0.5, 0.9);
    mesh.material = material;

    const state: VehicleState = { id, kind, position: position.clone(), heading: 0 };
    this.vehicles.set(id, state);
    return state;
  }

  update(deltaSeconds: number): void {
    for (const state of this.vehicles.values()) {
      state.position.x += deltaSeconds * state.heading;
    }
  }

  list(): VehicleState[] {
    return Array.from(this.vehicles.values());
  }

  getCount(): number {
    return this.vehicles.size;
  }
}
