import { PlotConfig } from '../plot_1/scripts/types/index';

/**
 * Plot 10 configuration
 */
export const plot_10Config: PlotConfig = {
  position: { x: 500, y: 3900 },
  width: 1100,
  height: 1200,
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
    {
      image: 'duplex_roof',
      position: { x: 100, y: 160 },
      width: 410,
      height: 310,
      hasDoor: true,
      doorPosition: { x: 0, y: 155 },
      doorImage: '',
      sceneName: 'plot_10_duplex_1'
    }
  ],
  objCollision: [true],
  objSounds: []
};

/**
 * Asset paths for plot 10
 */
export const plot_10Assets = {
  duplex_roof: '/world_one/terrain/plot_1/assets/imgs/duplex_roof.jpg',
};

/**
 * Loads all plot 10 assets into the Phaser scene
 */
export function loadPlot10Assets(scene: Phaser.Scene): void {
  Object.entries(plot_10Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
