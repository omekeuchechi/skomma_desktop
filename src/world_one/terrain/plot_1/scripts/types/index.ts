/**
 * Types for Plot_1 System
 */

export interface Position {
  x: number;
  y: number;
}

export interface Shape {
  type: 'rectangle' | 'circle' | 'triangle' | 'ellipse' | 'star' | 'diamond' | 'hexagon' | 'custom';
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  texture?: string;
  points?: number; // For star (number of points) or polygon
  innerRadius?: number; // For star (inner radius)
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
  groundShape?: 'rectangle' | 'circle' | 'triangle' | 'ellipse' | 'star' | 'diamond' | 'hexagon';
  groundRadius?: number;
  groundColor?: string;
  shapes: Shape[];
  shapesPositions: Position[];
  buildingRoofs: BuildingRoof[];
  objCollision: boolean[];
  objSounds: SoundConfig[];
  decorativeObjects?: DecorativeObject[];
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

export interface DecorativeObject {
  type: 'sign' | 'chair' | 'fountain' | 'tree' | 'bench' | 'lamp' | 'waterfall' | 'statue' | 'custom';
  position: Position;
  width?: number;
  height?: number;
  radius?: number;
  size?: number; // For fountain overall scale
  color?: string;
  texture?: string;
  rotation?: number;
  hasCollision?: boolean;
  text?: string; // For signs
  font?: string;
  fontSize?: number;
}
