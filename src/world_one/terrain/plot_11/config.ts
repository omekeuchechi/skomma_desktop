import { PlotConfig } from '../plot_1/scripts/types/index';

/**
 * Plot 11 configuration
 */
export const plot_11Config: PlotConfig = {
  position: { x: 2000, y: 3900 },
  width: 1000,
  height: 800,
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
    {
      image: 'duplex_roof2',
      position: { x: 110, y: 130 },
      width: 390,
      height: 290,
      hasDoor: true,
      doorPosition: { x: 0, y: 145 },
      doorImage: '',
      sceneName: 'plot_11_duplex_1'
    },
    {
      image: 'small_building_roof_1',
      position: { x: -260, y: 120 },
      width: 330,
      height: 250,
      hasDoor: true,
      doorPosition: { x: 0, y: 125 },
      doorImage: '',
      sceneName: 'plot_11_small_1'
    }
  ],
  objCollision: [true, true],
  objSounds: []
};

/**
 * Asset paths for plot 11
 */
export const plot_11Assets = {
  duplex_roof2: '/world_one/terrain/plot_1/assets/imgs/duplex_roof2.jpg',
  small_building_roof_1: '/world_one/terrain/plot_1/assets/imgs/small_building_roof_1.jpeg',
};

/**
 * Loads all plot 11 assets into the Phaser scene
 */
export function loadPlot11Assets(scene: Phaser.Scene): void {
  Object.entries(plot_11Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
