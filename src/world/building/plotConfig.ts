import { PlotConfig } from './types';

export const samplePlotConfig: PlotConfig = {
  position: { x: 500, y: 500 },
  width: 1500,
  height: 1000,
  buildingRoofs: [
    {
      image: 'building1',
      position: { x: 100, y: 200 },
      width: 500,
      height: 400,
      hasDoor: true,
      doorPosition: { x: 0, y: 200 },
      doorImage: '',
      sceneName: 'indoor1'
    },
    {
      image: 'building2',
      position: { x: -300, y: 0 },
      width: 500,
      height: 400,
      hasDoor: true,
      doorPosition: { x: 0, y: 200 },
      doorImage: '',
      sceneName: 'indoor2'
    }
  ]
};
