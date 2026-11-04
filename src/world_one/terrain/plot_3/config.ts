import { PlotConfig } from '../plot_1/scripts/types/index';

/**
 * Plot 3 configuration
 */
export const plot_3Config: PlotConfig = {
  position: { x: -98590, y: -96900 },
  width: 1500,
  height: 1500,
  groundShape: 'hexagon', // this have the following 'rectangle' | 'circle' | 'triangle' | 'ellipse' | 'star' | 'diamond' | 'hexagon' | 'custom'
  groundRadius: 750,
  groundColor: '#707070',
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
    {
      image: 'old_building_roof',
      position: { x: 20, y: -440 },
      width: 400,
      height: 300,
      hasDoor: true,
      doorPosition: { x: 0, y: 150 },
      doorImage: '',
      sceneName: 'plot_3_duplex_1'
    },
    {
      image: 'npc_building_roof',
      position: { x: 20, y: 440 },
      width: 400,
      height: 300,
      hasDoor: true,
      doorPosition: { x: 0, y: 150 },
      doorImage: '',
      sceneName: 'plot_3_duplex_2'
    }
  ],
  objCollision: [true, true],
  objSounds: [],
  decorativeObjects: [
    {
      type: 'sign',
      position: { x: 300, y: 0 },
      width: 120,
      height: 80,
      color: '#ffffff',
      text: 'Welcome',
      fontSize: 18,
      hasCollision: false
    },
    {
      type: 'fountain',
      position: { x: 20, y: 0 },
      radius: 40,
      size: 1.3,
      hasCollision: true
    },
    {
      type: 'tree',
      position: { x: 400, y: -200 },
      radius: 35,
      hasCollision: true
    },
    {
      type: 'bench',
      position: { x: -200, y: -300 },
      width: 60,
      height: 20,
      color: '#8d6e63',
      hasCollision: true
    }
  ]
};

/**
 * Asset paths for plot 3
 */
export const plot_3Assets = {
  old_building_roof: '/world_one/terrain/plot_3/assets/imgs/old_building_roof.jpg',
  npc_building_roof: '/world_one/terrain/plot_3/assets/imgs/npc_building_roof.jpg'
};

/**
 * Loads all plot 3 assets into the Phaser scene
 */
export function loadPlot3Assets(scene: Phaser.Scene): void {
  Object.entries(plot_3Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
