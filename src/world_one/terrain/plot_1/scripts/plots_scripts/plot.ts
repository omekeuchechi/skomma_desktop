import Phaser from 'phaser';
import { PlotConfig, Position, Shape, BuildingRoof, SoundConfig } from '../types/index';

/**
 * Creates a plot with specified configuration
 * @param scene - Phaser scene instance
 * @param config - Plot configuration object
 * @returns Container with all plot elements
 */
export function createPlot(
  scene: Phaser.Scene,
  config: PlotConfig
): Phaser.GameObjects.Container {
  const { position, width, height, shapes, shapesPositions, buildingRoofs, objCollision, objSounds } = config;

  // Create plot container
  const plotContainer = scene.add.container(position.x, position.y);

  // Create plot ground (gray #707070)
  const plotGround = scene.add.rectangle(0, 0, width, height, 0x707070);
  plotGround.setOrigin(0.5, 0.5);
  plotContainer.add(plotGround);

  // Add shapes to plot
  shapes.forEach((shape, index) => {
    const shapePos = shapesPositions[index] || { x: 0, y: 0 };
    const shapeObj = createShape(scene, shape, shapePos);
    if (shapeObj) {
      plotContainer.add(shapeObj);
    }
  });

  // Add building roofs
  buildingRoofs.forEach((building, index) => {
    const buildingObj = createBuilding(scene, building, objCollision[index] || false);
    if (buildingObj) {
      plotContainer.add(buildingObj);
    }
  });

  // Store sound configurations for later use
  plotContainer.setData('sounds', objSounds);

  return plotContainer;
}

/**
 * Creates a shape object based on configuration
 */
function createShape(
  scene: Phaser.Scene,
  shape: Shape,
  position: Position
): Phaser.GameObjects.GameObject | null {
  const { type, width, height, radius, color, texture } = shape;

  switch (type) {
    case 'rectangle':
      if (texture) {
        const rect = scene.add.image(position.x, position.y, texture);
        rect.setOrigin(0.5, 0.5);
        if (width && height) {
          rect.displayWidth = width;
          rect.displayHeight = height;
        }
        return rect;
      } else {
        const rect = scene.add.rectangle(position.x, position.y, width || 100, height || 100, parseInt(color.replace('#', '0x'), 16));
        rect.setOrigin(0.5, 0.5);
        return rect;
      }

    case 'circle':
      if (texture) {
        const circle = scene.add.image(position.x, position.y, texture);
        circle.setOrigin(0.5, 0.5);
        if (radius) {
          circle.displayWidth = radius * 2;
          circle.displayHeight = radius * 2;
        }
        return circle;
      } else {
        const circle = scene.add.circle(position.x, position.y, radius || 50, parseInt(color.replace('#', '0x'), 16));
        circle.setOrigin(0.5, 0.5);
        return circle;
      }

    case 'custom':
      // For custom shapes, you can add more complex logic here
      return null;

    default:
      return null;
  }
}

/**
 * Creates a building with roof and door
 */
function createBuilding(
  scene: Phaser.Scene,
  building: BuildingRoof,
  hasCollision: boolean
): Phaser.GameObjects.Container | null {
  const { image, position, width, height, hasDoor, doorPosition, doorImage, sceneName } = building;

  const buildingContainer = scene.add.container(position.x, position.y);

  // Load and add building roof image
  const roof = scene.add.image(0, 0, image);
  roof.setOrigin(0.5, 0.5);
  roof.displayWidth = width;
  roof.displayHeight = height;
  buildingContainer.add(roof);

  // Add door if specified
  if (hasDoor && doorPosition) {
    if (doorImage) {
      const door = scene.add.image(doorPosition.x, doorPosition.y, doorImage);
      door.setOrigin(0.5, 0.5);
      buildingContainer.add(door);
    }

    // Store door position for collision detection (even without door image)
    buildingContainer.setData('doorPosition', doorPosition);
    buildingContainer.setData('doorImage', doorImage || '');
    buildingContainer.setData('sceneName', sceneName || '');
  }

  // Add collision if specified
  if (hasCollision) {
    buildingContainer.setData('hasCollision', true);
  }

  return buildingContainer;
}

/**
 * Export type for barrel file
 */
export type { PlotConfig, Position, Shape, BuildingRoof, SoundConfig };
