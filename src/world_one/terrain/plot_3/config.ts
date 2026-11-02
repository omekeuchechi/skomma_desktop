import { PlotConfig } from '../plot_1/scripts/types/index';

/**
 * Plot 3 configuration
 */
export const plot_3Config: PlotConfig = {
  position: { x: -97500, y: -96900 },
  width: 1200,
  height: 900,
  shapes: [
    {
      type: 'circle',
      radius: 500,
      color: '#707070'
    }
  ],
  shapesPositions: [
    { x: 0, y: 0 }
  ],
  buildingRoofs: [
    {
      image: 'old_building_roof',
      position: { x: 100, y: 100 },
      width: 400,
      height: 300,
      hasDoor: true,
      doorPosition: { x: 0, y: 150 },
      doorImage: '',
      sceneName: 'plot_3_duplex_1'
    },
    {
      image: 'npc_building_roof',
      position: { x: 500, y: 100 },
      width: 400,
      height: 300,
      hasDoor: true,
      doorPosition: { x: 0, y: 150 },
      doorImage: '',
      sceneName: 'plot_3_duplex_2'
    }
  ],
  objCollision: [true, true],
  objSounds: []
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
