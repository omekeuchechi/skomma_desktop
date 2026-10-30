import { PlotConfig } from '../plot_1/scripts/types/index';

/**
 * Plot 8 configuration
 */
export const plot_8Config: PlotConfig = {
  position: { x: 2000, y: 2700 },
  width: 1000,
  height: 900,
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
    {
      image: 'duplex_roof2',
      position: { x: 100, y: 120 },
      width: 400,
      height: 300,
      hasDoor: true,
      doorPosition: { x: 0, y: 150 },
      doorImage: '',
      sceneName: 'plot_8_duplex_1'
    }
  ],
  objCollision: [true],
  objSounds: []
};

/**
 * Asset paths for plot 8
 */
export const plot_8Assets = {
  duplex_roof2: '/world_one/terrain/plot_1/assets/imgs/duplex_roof2.jpg',
};

/**
 * Loads all plot 8 assets into the Phaser scene
 */
export function loadPlot8Assets(scene: Phaser.Scene): void {
  Object.entries(plot_8Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
