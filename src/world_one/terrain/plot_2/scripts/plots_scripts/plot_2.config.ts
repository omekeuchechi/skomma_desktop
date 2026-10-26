import { PlotConfig } from './plot_2.types';

/**
 * Plot 2 configuration
 */
export const plot_2Config: PlotConfig = {
  position: { x: 6500, y: 4500 },
  width: 1500,
  height: 1000,
  shapes: [],
  shapesPositions: [],
  buildingRoofs: [
    {
      image: 'office_building',
      position: { x: 0, y: 0 },
      width: 600,
      height: 500,
      hasDoor: true,
      doorPosition: { x: 0, y: 250 },
      doorImage: '',
      sceneName: 'office_indoor'
    },
    {
      image: 'warehouse',
      position: { x: -400, y: -200 },
      width: 400,
      height: 300,
      hasDoor: true,
      doorPosition: { x: 0, y: 150 },
      doorImage: '',
      sceneName: 'warehouse_indoor'
    }
  ],
  objCollision: [true, true],
  objSounds: []
};

/**
 * Asset paths for plot 2
 */
export const plot_2Assets = {
  office_building: '/src/world_one/terrain/plot_2/assets/imgs/office_building.jpg',
  warehouse: '/src/world_one/terrain/plot_2/assets/imgs/warehouse.jpg',
};

/**
 * Loads all plot 2 assets into the Phaser scene
 */
export function loadPlot2Assets(scene: Phaser.Scene): void {
  Object.entries(plot_2Assets).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
