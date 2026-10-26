import { PlotConfig } from '../types/index';

/**
 * Plot 1 configuration
 */
export const plot_1Config: PlotConfig = {
  position: { x: 4500, y: 4500 },
  width: 1500,
  height: 1000,
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
    {
      image: 'duplex_roof',
      position: { x: 100, y: 200 },
      width: 500,
      height: 400,
      hasDoor: true,
      doorPosition: { x: 0, y: 200 },
      doorImage: '',
      sceneName: 'duplex_indoor'
    },
    {
      image: 'duplex_roof2',
      position: { x: -300, y: 0 },
      width: 500,
      height: 400,
      hasDoor: true,
      doorPosition: { x: 0, y: 200 },
      doorImage: '',
      sceneName: 'duplex_indoor2'
    },
    {
      image: 'small_building_roof_1',
      position: { x: 200, y: -250 },
      width: 400,
      height: 300,
      hasDoor: true,
      doorPosition: { x: 0, y: 150 },
      doorImage: '',
      sceneName: 'small_building_indoor1'
    },
    {
      image: 'small_building_roof_2',
      position: { x: -200, y: -250 },
      width: 400,
      height: 300,
      hasDoor: true,
      doorPosition: { x: 0, y: 150 },
      doorImage: '',
      sceneName: 'small_building_indoor2'
    }
  ],
  objCollision: [true, true, true, true],
  objSounds: []
};

/**
 * Asset paths for plot 1
 */
export const plot_1Assets = {
  duplex_roof: '/src/world_one/terrain/plot_1/assets/imgs/duplex_roof.jpg',
  duplex_roof2: '/src/world_one/terrain/plot_1/assets/imgs/duplex_roof2.jpg',
  small_building_roof_1: '/src/world_one/terrain/plot_1/assets/imgs/small_building_roof_1.jpeg',
  small_building_roof_2: '/src/world_one/terrain/plot_1/assets/imgs/small_building_roof_2.jpeg',
};

/**
 * Loads all plot 1 assets into the Phaser scene
 */
export function loadPlot1Assets(scene: Phaser.Scene): void {
  Object.entries(plot_1Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
