import { PlotConfig } from '../plot_1/scripts/types/index';

/**
 * Plot 3 configuration
 */
export const plot_3Config: PlotConfig = {
  position: { x: 3500, y: 500 },
  width: 1200,
  height: 900,
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
    {
      image: 'duplex_roof',
      position: { x: 100, y: 100 },
      width: 400,
      height: 300,
      hasDoor: true,
      doorPosition: { x: 0, y: 150 },
      doorImage: '',
      sceneName: 'plot_3_duplex_1'
    }
  ],
  objCollision: [true],
  objSounds: []
};

/**
 * Asset paths for plot 3
 */
export const plot_3Assets = {
  duplex_roof: '/world_one/terrain/plot_1/assets/imgs/duplex_roof.jpg',
};

/**
 * Loads all plot 3 assets into the Phaser scene
 */
export function loadPlot3Assets(scene: Phaser.Scene): void {
  Object.entries(plot_3Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
