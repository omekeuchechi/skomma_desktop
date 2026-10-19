import { PlotConfig } from '../types/index';

/**
 * Plot 1 configuration
 */
export const plot_1Config: PlotConfig = {
  position: { x: 500, y: 500 },
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
