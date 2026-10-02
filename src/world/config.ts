export interface WorldConfig {
  chunkSize: number;
  viewDistance: number;
  seed: number;
  streamed: boolean;
}

export const DEFAULT_WORLD_CONFIG: WorldConfig = {
  chunkSize: 16,
  viewDistance: 4,
  seed: 1337,
  streamed: true,
};

export type ChunkStatus = 'pending' | 'generating' | 'streaming' | 'ready';
