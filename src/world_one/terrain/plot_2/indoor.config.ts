import type { BuildingSceneConfig } from '../plot_1/scripts/types/index';

export const plot2DuplexIndoorConfig: BuildingSceneConfig = {
  sceneName: 'plot_2_duplex_indoor',
  width: window.innerWidth,
  height: window.innerHeight,
  floorTexture: 'plot_2_tiles',
  objects: [
    {
      image: 'plot_2_table',
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      width: 200,
      height: 120,
      collision: true
    }
  ],
  background: '#ffffff',
  exitDoor: {
    position: { x: window.innerWidth - 75, y: window.innerHeight / 2 },
    width: 150,
    height: 20
  }
};
