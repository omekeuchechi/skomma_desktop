import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { WORLD } from '@constants/index';

export interface NpcState {
  id: string;
  role: string;
  position: Vector3;
  velocity: Vector3;
}

export interface NpcConfig {
  cap?: number;
}

export class NPCManager {
  private readonly scene: Scene;
  private readonly cap: number;
  private readonly npcs = new Map<string, NpcState>();

  constructor(scene: Scene, config: NpcConfig = {}) {
    this.scene = scene;
    this.cap = config.cap ?? WORLD.npcCap;
  }

  spawn(id: string, role: string, position: Vector3): NpcState | null {
    if (this.npcs.size >= this.cap) return null;
    if (this.npcs.has(id)) return this.npcs.get(id) ?? null;

    const mesh = MeshBuilder.CreateBox(`npc_${id}`, { size: 0.7 }, this.scene);
    mesh.position = position;
    const material = new StandardMaterial(`npcMat_${id}`, this.scene);
    material.diffuseColor = new Color3(0.85, 0.7, 0.5);
    mesh.material = material;

    const state: NpcState = {
      id,
      role,
      position: position.clone(),
      velocity: Vector3.Zero(),
    };
    this.npcs.set(id, state);
    return state;
  }

  update(_deltaSeconds: number): void {
    for (const state of this.npcs.values()) {
      state.position.addInPlace(state.velocity);
    }
  }

  list(): NpcState[] {
    return Array.from(this.npcs.values());
  }

  getCount(): number {
    return this.npcs.size;
  }
}
