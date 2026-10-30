import { PlotConfig } from '../plot_1/scripts/types/index';

/**
 * Plot 4 configuration
 */
export const plot_4Config: PlotConfig = {
  position: { x: 500, y: 1500 },
  width: 1100,
  height: 1000,
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
    {
      image: 'small_building_roof_1',
      position: { x: 150, y: 200 },
      width: 300,
      height: 250,
      hasDoor: true,
      doorPosition: { x: 0, y: 125 },
      doorImage: '',
      sceneName: 'plot_4_small_1'
    }
  ],
  objCollision: [true],
  objSounds: []
};

/**
 * Asset paths for plot 4
 */
export const plot_4Assets = {
  small_building_roof_1: '/world_one/terrain/plot_1/assets/imgs/small_building_roof_1.jpeg',
};

/**
 * Loads all plot 4 assets into the Phaser scene
 */
export function loadPlot4Assets(scene: Phaser.Scene): void {
  Object.entries(plot_4Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
