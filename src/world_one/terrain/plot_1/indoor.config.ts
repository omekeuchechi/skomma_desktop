import type { BuildingSceneConfig } from './scripts/types/index';

export const duplexIndoorConfig: BuildingSceneConfig = {
  sceneName: 'duplex_indoor',
  width: window.innerWidth,
  height: window.innerHeight,
  floorTexture: 'tiles',
  objects: [
    {
      image: 'table',
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

export const duplexIndoor2Config: BuildingSceneConfig = {
  sceneName: 'duplex_indoor2',
  width: window.innerWidth,
  height: window.innerHeight,
  floorTexture: '',
  objects: [],
  background: '#ffffff',
  exitDoor: {
    position: { x: window.innerWidth - 75, y: window.innerHeight / 2 },
    width: 150,
    height: 20
  }
};

export const smallBuildingIndoor1Config: BuildingSceneConfig = {
  sceneName: 'small_building_indoor1',
  width: window.innerWidth,
  height: window.innerHeight,
  floorTexture: 'tiles',
  objects: [
    {
      image: 'table',
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

export const smallBuildingIndoor2Config: BuildingSceneConfig = {
  sceneName: 'small_building_indoor2',
  width: window.innerWidth,
  height: window.innerHeight,
  floorTexture: 'tiles',
  objects: [
    {
      image: 'table',
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
