export interface Position {
  x: number;
  y: number;
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

export interface DoorConfig {
  position: Position;
  width: number;
  height: number;
  sceneName: string;
  soundKey?: string;
}

export interface PlotConfig {
  position: Position;
  width: number;
  height: number;
  shapes: any[];
  shapesPositions: any[];
  buildingRoofs: BuildingRoof[];
  objCollision: boolean[];
  objSounds: string[];
}
