export interface TerrainSample {
  height: number;
  moisture: number;
}

export interface TerrainNoiseConfig {
  seed: number;
  scale: number;
  octaves: number;
  persistence: number;
}

export function sampleTerrain(x: number, z: number, config: TerrainNoiseConfig): TerrainSample {
  const noise = (value: number): number => {
    const s = Math.sin(value * 12.9898) * 43758.5453;
    return s - Math.floor(s);
  };

  let amplitude = 1;
  let frequency = 1;
  let height = 0;
  let maxValue = 0;

  for (let i = 0; i < config.octaves; i++) {
    height += noise((x + config.seed * 0.1) * config.scale * frequency + z * 0.017 * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= config.persistence;
    frequency *= 2;
  }

  return {
    height: (height / maxValue) * 0.5 + 0.5,
    moisture: noise(x * 0.05 + z * 0.05 + config.seed),
  };
}
