/// <reference lib="webworker" />

export interface GenerateChunkRequest {
  type: 'generate';
  chunkX: number;
  chunkZ: number;
  size: number;
  seed: number;
}

export interface ChunkGeneratedMessage {
  type: 'chunk';
  chunkX: number;
  chunkZ: number;
  heights: number[];
}

type WorkerSelf = {
  postMessage: (message: ChunkGeneratedMessage) => void;
  addEventListener: (type: 'message', listener: (event: MessageEvent<GenerateChunkRequest>) => void) => void;
};

const workerSelf = self as unknown as WorkerSelf;

workerSelf.addEventListener('message', (event) => {
  const { chunkX, chunkZ, size, seed } = event.data;
  const heights: number[] = [];

  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      heights.push(sampleNoise(chunkX * size + x, chunkZ * size + z, seed));
    }
  }

  workerSelf.postMessage({ type: 'chunk', chunkX, chunkZ, heights });
});

function sampleNoise(x: number, z: number, seed: number): number {
  const value = Math.sin(x * 12.9898 + z * 78.233 + seed) * 43758.5453;
  const fractional = value - Math.floor(value);
  return fractional * 2 - 1;
}

export {};
