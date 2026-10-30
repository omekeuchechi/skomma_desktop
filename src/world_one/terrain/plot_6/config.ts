import { PlotConfig } from '../plot_1/scripts/types/index';

/**
 * Plot 6 configuration
 */
export const plot_6Config: PlotConfig = {
  position: { x: 3500, y: 1500 },
  width: 1000,
  height: 800,
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
    {
      image: 'small_building_roof_2',
      position: { x: 100, y: 100 },
      width: 350,
      height: 280,
      hasDoor: true,
      doorPosition: { x: 0, y: 140 },
      doorImage: '',
      sceneName: 'plot_6_small_1'
    }
  ],
  objCollision: [true],
  objSounds: []
};

/**
 * Asset paths for plot 6
 */
export const plot_6Assets = {
  small_building_roof_2: '/world_one/terrain/plot_1/assets/imgs/small_building_roof_2.jpeg',
};

/**
 * Loads all plot 6 assets into the Phaser scene
 */
export function loadPlot6Assets(scene: Phaser.Scene): void {
  Object.entries(plot_6Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
