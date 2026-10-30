import { PlotConfig } from '../plot_1/scripts/types/index';

/**
 * Plot 7 configuration
 */
export const plot_7Config: PlotConfig = {
  position: { x: 500, y: 2700 },
  width: 1200,
  height: 1100,
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
    {
      image: 'duplex_roof',
      position: { x: 150, y: 180 },
      width: 420,
      height: 320,
      hasDoor: true,
      doorPosition: { x: 0, y: 160 },
      doorImage: '',
      sceneName: 'plot_7_duplex_1'
    },
    {
      image: 'small_building_roof_1',
      position: { x: -250, y: 100 },
      width: 320,
      height: 240,
      hasDoor: true,
      doorPosition: { x: 0, y: 120 },
      doorImage: '',
      sceneName: 'plot_7_small_1'
    }
  ],
  objCollision: [true, true],
  objSounds: []
};

/**
 * Asset paths for plot 7
 */
export const plot_7Assets = {
  duplex_roof: '/world_one/terrain/plot_1/assets/imgs/duplex_roof.jpg',
  small_building_roof_1: '/world_one/terrain/plot_1/assets/imgs/small_building_roof_1.jpeg',
};

/**
 * Loads all plot 7 assets into the Phaser scene
 */
export function loadPlot7Assets(scene: Phaser.Scene): void {
  Object.entries(plot_7Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
