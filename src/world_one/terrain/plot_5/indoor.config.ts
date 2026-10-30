import type { BuildingSceneConfig } from '../plot_1/scripts/types/index';

export const plot5Duplex1Config: BuildingSceneConfig = {
  sceneName: 'plot_5_duplex_1',
  width: window.innerWidth,
  height: window.innerHeight,
  floorTexture: 'tiles',
  objects: [],
  background: '#ffffff',
  exitDoor: {
    position: { x: window.innerWidth - 75, y: window.innerHeight / 2 },
    width: 150,
    height: 20
  }
};
