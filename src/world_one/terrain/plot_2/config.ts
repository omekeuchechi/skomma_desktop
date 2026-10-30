import { PlotConfig } from '../plot_1/scripts/types/index';

/**
 * Plot 2 configuration
 */
export const plot_2Config: PlotConfig = {
  position: { x: -96000, y: -99080 },
  width: 1000,
  height: 800,
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
     {
      image: 'small_building_roof_1_plot_2',
      position: { x: -30, y: -30 },
      width: 500,
      height: 400,
      hasDoor: true,
      doorPosition: { x: 0, y: 200 },
      doorImage: '',
      sceneName: 'plot_2_duplex_indoor'
    },
  ],
  objCollision: [true],
  objSounds: []
};

/**
 * Asset paths for plot 2
 */
export const plot_2Assets = {
  small_building_roof_1_plot_2: '/world_one/terrain/plot_2/assets/imgs/small_building_roof_1_plot_2.jpg',
  small_building_roof_2_plot_2: '/world_one/terrain/plot_2/assets/imgs/small_building_roof_2_plot_2.jpg',
  table: '/world_one/terrain/plot_2/assets/imgs/table.png',
  tiles: '/world_one/terrain/plot_2/assets/imgs/tiles.jpeg',
};

/**
 * Loads all plot 2 assets into the Phaser scene
 */
export function loadPlot2Assets(scene: Phaser.Scene): void {
  Object.entries(plot_2Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
