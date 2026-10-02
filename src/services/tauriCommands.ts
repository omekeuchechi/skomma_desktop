import { invoke } from '@tauri-apps/api/core';

export interface PathStep {
  x: number;
  z: number;
}

export interface ChunkRequest {
  chunkX: number;
  chunkZ: number;
  size: number;
  seed: number;
}

export async function computePath(fromX: number, fromZ: number, toX: number, toZ: number): Promise<PathStep[]> {
  return invoke<PathStep[]>('compute_path', { fromX, fromZ, toX, toZ });
}

export async function generateChunkHeightmap(request: ChunkRequest): Promise<number[]> {
  return invoke<number[]>('generate_chunk', {
    chunkX: request.chunkX,
    chunkZ: request.chunkZ,
    size: request.size,
    seed: request.seed,
  });
}

export async function aiDecision(state: Record<string, unknown>): Promise<Record<string, unknown>> {
  return invoke<Record<string, unknown>>('ai_decision', { state });
}

export async function physicsProjectile(
  position: [number, number, number],
  velocity: [number, number, number],
  deltaTime: number,
): Promise<[number, number, number]> {
  return invoke<[number, number, number]>('physics_projectile', { position, velocity, deltaTime });
}

export async function optimizeMesh(vertices: number[], indices: number[]): Promise<{ vertices: number[]; indices: number[] }> {
  return invoke<{ vertices: number[]; indices: number[] }>('optimize_mesh', { vertices, indices });
}

export async function proceduralHeight(
  x: number,
  z: number,
  seed: number,
  octaves: number,
): Promise<number> {
  return invoke<number>('procedural_height', { x, z, seed, octaves });
}
