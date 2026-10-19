import Phaser from 'phaser';
import { PlotConfig, Position, BuildingRoof } from '../types/index';
import { createDoor } from '../services/doorService';

/**
 * Door dimensions used for every building in the plot
 */
export const DOOR_WIDTH = 150;
export const DOOR_HEIGHT = 20;

/**
 * Space kept between the building and the passport when exiting indoors
 */
export const EXIT_CLEARANCE = 100;

/**
 * Passport hitbox size (100x100), used to keep it clear of other buildings
 */
export const PASSPORT_SIZE = 100;

/**
 * Creates a door for every building in the plot, positioned absolutely in the world
 * @param scene - Phaser scene instance
 * @param config - Plot configuration object
 * @returns Array of door rectangles
 */
export function createPlotDoors(
  scene: Phaser.Scene,
  config: PlotConfig
): Phaser.GameObjects.Rectangle[] {
  const { position, buildingRoofs } = config;
  const doors: Phaser.GameObjects.Rectangle[] = [];

  buildingRoofs.forEach((building) => {
    if (!building.hasDoor || !building.doorPosition) return;

    const absoluteDoorX = position.x + building.position.x + building.doorPosition.x;
    const absoluteDoorY = position.y + building.position.y + building.doorPosition.y;

    const door = createDoor(scene, {
      position: { x: absoluteDoorX, y: absoluteDoorY },
      width: DOOR_WIDTH,
      height: DOOR_HEIGHT,
      sceneName: building.sceneName as string,
      soundKey: 'opening_door'
    });
    door.setDepth(20);
    doors.push(door);
  });

  return doors;
}

/**
 * Computes the absolute outdoor position where the passport should be placed
 * after exiting a building: directly in front of the building door,
 * with EXIT_CLEARANCE space between the building and the passport.
 * If a neighbouring building sits in front of the door, the position is
 * stepped further away until the passport is free and not stuck inside a roof.
 * @param config - Plot configuration object
 * @param sceneName - Indoor scene name of the building being exited
 * @param passportSize - Passport hitbox size, used to keep it clear of roofs
 * @returns Absolute position, or null if no matching building is found
 */
export function getBuildingExitPosition(
  config: PlotConfig,
  sceneName: string,
  passportSize: number = PASSPORT_SIZE
): Position | null {
  const { position, buildingRoofs } = config;
  const building = buildingRoofs.find((roof) => roof.sceneName === sceneName);

  if (!building || !building.doorPosition) return null;

  const exitPosition: Position = {
    x: position.x + building.position.x + building.doorPosition.x,
    y: position.y + building.position.y + building.doorPosition.y + EXIT_CLEARANCE
  };

  // Other buildings placed beside/in front of this one can cover the spot in
  // front of the door, keeping the passport stuck inside a roof
  const blockers = buildingRoofs.filter((roof) => roof !== building);
  const maxSteps = 12;

  for (let step = 0; step < maxSteps; step++) {
    if (!isBlocked(config, blockers, exitPosition, passportSize)) break;
    exitPosition.y += passportSize;
  }

  return exitPosition;
}

/**
 * Checks if a passport sized rect at the given position overlaps any blocker
 * (building roof or door) in the plot
 */
function isBlocked(
  config: PlotConfig,
  blockers: BuildingRoof[],
  position: Position,
  passportSize: number
): boolean {
  const half = passportSize / 2;
  const passportRect = {
    left: position.x - half,
    right: position.x + half,
    top: position.y - half,
    bottom: position.y + half
  };

  const overlaps = (rect: { left: number; right: number; top: number; bottom: number }) =>
    passportRect.left < rect.right &&
    passportRect.right > rect.left &&
    passportRect.top < rect.bottom &&
    passportRect.bottom > rect.top;

  return blockers.some((building) => {
    const roof = {
      left: config.position.x + building.position.x - building.width / 2,
      right: config.position.x + building.position.x + building.width / 2,
      top: config.position.y + building.position.y - building.height / 2,
      bottom: config.position.y + building.position.y + building.height / 2
    };

    if (overlaps(roof)) return true;

    // Doors trigger entering a scene, so they must be clear too
    if (building.doorPosition) {
      const door = {
        left: config.position.x + building.position.x + building.doorPosition.x - DOOR_WIDTH / 2,
        right: config.position.x + building.position.x + building.doorPosition.x + DOOR_WIDTH / 2,
        top: config.position.y + building.position.y + building.doorPosition.y - DOOR_HEIGHT / 2,
        bottom: config.position.y + building.position.y + building.doorPosition.y + DOOR_HEIGHT / 2
      };

      if (overlaps(door)) return true;
    }

    return false;
  });
}
