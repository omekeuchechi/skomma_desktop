export interface Position {
  x: number;
  y: number;
}

export interface Shape {
  type: 'rectangle' | 'circle' | 'custom';
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  texture?: string;
}

export interface BuildingRoof {
  image: string;
  position: Position;
  width: number;
  height: number;
  hasDoor: boolean;
  doorPosition?: Position;
  doorImage?: string;
  sceneName?: string;
}

export interface SoundConfig {
  key: string;
  path: string;
}

export interface PlotConfig {
  position: Position;
  width: number;
  height: number;
  shapes: Shape[];
  shapesPositions: Position[];
  buildingRoofs: BuildingRoof[];
  objCollision: boolean[];
  objSounds: SoundConfig[];
}
