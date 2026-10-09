import Phaser from 'phaser';
import { BuildingSceneConfig, IndoorObject } from '../types/index';

/**
 * Creates an indoor building scene
 * @param scene - Phaser scene instance
 * @param config - Building scene configuration
 * @returns Container with all indoor elements
 */
export function createBuildingScene(
  scene: Phaser.Scene,
  config: BuildingSceneConfig
): Phaser.GameObjects.Container {
  const { sceneName, width, height, floorTexture, objects, background } = config;

  // Create scene container
  const sceneContainer = scene.add.container(0, 0);

  // Add background if specified
  if (background) {
    const bg = scene.add.rectangle(0, 0, width, height, parseInt(background.replace('#', '0x'), 16));
    bg.setOrigin(0.5, 0.5);
    sceneContainer.add(bg);
  }

  // Add floor texture if specified
  if (floorTexture) {
    const floor = scene.add.image(0, 0, floorTexture);
    floor.setOrigin(0.5, 0.5);
    floor.displayWidth = width;
    floor.displayHeight = height;
    sceneContainer.add(floor);
  }

  // Add indoor objects
  objects.forEach((obj) => {
    const indoorObj = createIndoorObject(scene, obj);
    if (indoorObj) {
      sceneContainer.add(indoorObj);
    }
  });

  // Store scene metadata
  sceneContainer.setData('sceneName', sceneName);
  sceneContainer.setData('width', width);
  sceneContainer.setData('height', height);

  return sceneContainer;
}

/**
 * Creates an indoor object
 */
function createIndoorObject(
  scene: Phaser.Scene,
  obj: IndoorObject
): Phaser.GameObjects.GameObject | null {
  const { image, position, width, height, collision } = obj;

  const indoorObj = scene.add.image(position.x, position.y, image);
  indoorObj.setOrigin(0.5, 0.5);
  indoorObj.displayWidth = width;
  indoorObj.displayHeight = height;

  // Store collision data
  if (collision) {
    indoorObj.setData('hasCollision', true);
  }

  return indoorObj;
}

/**
 * Check if passport is at door position and trigger scene load
 */
export function checkDoorEntry(
  passportPosition: { x: number; y: number },
  doorPosition: { x: number; y: number },
  threshold: number = 50
): boolean {
  const distance = Math.sqrt(
    Math.pow(passportPosition.x - doorPosition.x, 2) +
    Math.pow(passportPosition.y - doorPosition.y, 2)
  );
  return distance < threshold;
}
