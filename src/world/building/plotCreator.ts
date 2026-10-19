import Phaser from 'phaser';
import { PlotConfig, BuildingRoof } from './types';

export function createPlot(
  scene: Phaser.Scene,
  config: PlotConfig
): Phaser.GameObjects.Container {
  const { position, width, height, buildingRoofs } = config;

  // Create plot container
  const plotContainer = scene.add.container(position.x, position.y);

  // Create plot ground (gray)
  const plotGround = scene.add.rectangle(0, 0, width, height, 0x707070);
  plotGround.setOrigin(0.5, 0.5);
  plotContainer.add(plotGround);

  // Add building roofs
  buildingRoofs.forEach((building) => {
    const buildingObj = createBuilding(scene, building);
    if (buildingObj) {
      plotContainer.add(buildingObj);
    }
  });

  return plotContainer;
}

function createBuilding(
  scene: Phaser.Scene,
  building: BuildingRoof
): Phaser.GameObjects.Container | null {
  const { image, position, width, height, hasDoor, doorPosition, doorImage, sceneName } = building;

  const buildingContainer = scene.add.container(position.x, position.y);

  // Create building roof (rectangle for now, will be image later)
  const roof = scene.add.rectangle(0, 0, width, height, 0x8B4513);
  roof.setOrigin(0.5, 0.5);
  buildingContainer.add(roof);

  // Add door if specified
  if (hasDoor && doorPosition) {
    if (doorImage) {
      const door = scene.add.image(doorPosition.x, doorPosition.y, doorImage);
      door.setOrigin(0.5, 0.5);
      buildingContainer.add(door);
    }

    // Store door position for collision detection
    buildingContainer.setData('doorPosition', doorPosition);
    buildingContainer.setData('doorImage', doorImage || '');
    buildingContainer.setData('sceneName', sceneName || '');
  }

  return buildingContainer;
}
