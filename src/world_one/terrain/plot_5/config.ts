import { PlotConfig } from '../plot_1/scripts/types/index';

/**
 * Plot 5 configuration
 */
export const plot_5Config: PlotConfig = {
  position: { x: 2000, y: 1500 },
  width: 1300,
  height: 1200,
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
    {
      image: 'duplex_roof2',
      position: { x: 200, y: 150 },
      width: 450,
      height: 350,
      hasDoor: true,
      doorPosition: { x: 0, y: 175 },
      doorImage: '',
      sceneName: 'plot_5_duplex_1'
    }
  ],
  objCollision: [true],
  objSounds: []
};

/**
 * Asset paths for plot 5
 */
export const plot_5Assets = {
  duplex_roof2: '/world_one/terrain/plot_1/assets/imgs/duplex_roof2.jpg',
};

/**
 * Loads all plot 5 assets into the Phaser scene
 */
export function loadPlot5Assets(scene: Phaser.Scene): void {
  Object.entries(plot_5Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
