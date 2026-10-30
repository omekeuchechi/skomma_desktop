import { PlotConfig } from '../plot_1/scripts/types/index';

/**
 * Plot 9 configuration
 */
export const plot_9Config: PlotConfig = {
  position: { x: 3500, y: 2700 },
  width: 1300,
  height: 1000,
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
    {
      image: 'small_building_roof_1',
      position: { x: 120, y: 140 },
      width: 380,
      height: 260,
      hasDoor: true,
      doorPosition: { x: 0, y: 130 },
      doorImage: '',
      sceneName: 'plot_9_small_1'
    },
    {
      image: 'small_building_roof_2',
      position: { x: -280, y: 150 },
      width: 340,
      height: 280,
      hasDoor: true,
      doorPosition: { x: 0, y: 140 },
      doorImage: '',
      sceneName: 'plot_9_small_2'
    }
  ],
  objCollision: [true, true],
  objSounds: []
};

/**
 * Asset paths for plot 9
 */
export const plot_9Assets = {
  small_building_roof_1: '/world_one/terrain/plot_1/assets/imgs/small_building_roof_1.jpeg',
  small_building_roof_2: '/world_one/terrain/plot_1/assets/imgs/small_building_roof_2.jpeg',
};

/**
 * Loads all plot 9 assets into the Phaser scene
 */
export function loadPlot9Assets(scene: Phaser.Scene): void {
  Object.entries(plot_9Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
