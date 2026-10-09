/**
 * Types for Plot_1 System
 */

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
  sceneName?: string; // Scene to load when entering through door
}

export interface SoundConfig {
  file: string;
  trigger: 'collision' | 'proximity' | 'click';
  target: string; // shape name or building name
  volume?: number;
  loop?: boolean;
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

export interface Door {
  image: string;
  position: Position;
  width: number;
  height: number;
  targetScene: string; // Scene to load when entering
}

export interface IndoorObject {
  image: string;
  position: Position;
  width: number;
  height: number;
  collision?: boolean;
}

export interface BuildingSceneConfig {
  sceneName: string;
  width: number;
  height: number;
  floorTexture?: string;
  objects: IndoorObject[];
  background?: string;
  exitDoor?: {
    position: Position;
    width: number;
    height: number;
  };
}
