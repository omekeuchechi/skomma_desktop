import Phaser from 'phaser';
import { PlotConfig, BuildingRoof, DoorConfig } from './types';
import { playSoundWithFallback } from '../audio/audioLoader';

export const DOOR_WIDTH = 150;
export const DOOR_HEIGHT = 20;
export const EXIT_CLEARANCE = 100;
export const PASSPORT_SIZE = 100;

export function createDoor(
  scene: Phaser.Scene,
  config: DoorConfig
): Phaser.GameObjects.Rectangle {
  const { position, width, height, sceneName, soundKey } = config as DoorConfig & { soundKey?: string };

  // Create door as a rectangle (visual representation)
  const door = scene.add.rectangle(
    position.x,
    position.y,
    width,
    height,
    0x8B4513 // Brown color for door
  );
  door.setOrigin(0.5, 0.5);
  door.setStrokeStyle(2, 0x5D3A1A);

  // Store door metadata
  door.setData('isDoor', true);
  door.setData('sceneName', sceneName);
  door.setData('soundKey', soundKey || 'opening_door');
  door.setData('hasPlayedSound', false);

  return door;
}

export function checkDoorCollision(
  passport: Phaser.GameObjects.Container,
  door: Phaser.GameObjects.Rectangle,
  scene: Phaser.Scene,
  onEnterScene: (sceneName: string) => void
): boolean {
  const passportBounds = passport.getBounds();
  const doorBounds = door.getBounds();

  // Check intersection
  const isColliding = Phaser.Geom.Intersects.RectangleToRectangle(
    passportBounds,
    doorBounds
  );

  if (isColliding) {
    const hasPlayedSound = door.getData('hasPlayedSound');
    const soundKey = door.getData('soundKey');

    // Play sound if not already played
    if (!hasPlayedSound && soundKey && !scene.sound.mute) {
      playSoundWithFallback(scene, soundKey, 0.5);
      door.setData('hasPlayedSound', true);

      // Reset sound flag after a delay
      setTimeout(() => {
        door.setData('hasPlayedSound', false);
      }, 1000);
    }

    // Load indoor scene
    const sceneName = door.getData('sceneName');
    if (sceneName) {
      onEnterScene(sceneName);
    }

    return true;
  }

  // Reset sound flag when not colliding
  door.setData('hasPlayedSound', false);

  return false;
}

export function getBuildingExitPosition(
  config: PlotConfig,
  sceneName: string,
  passportSize: number = PASSPORT_SIZE
): { x: number; y: number } | null {
  const { position, buildingRoofs } = config;
  const building = buildingRoofs.find((roof) => roof.sceneName === sceneName);

  if (!building || !building.doorPosition) return null;

  const exitPosition = {
    x: position.x + building.position.x + building.doorPosition.x,
    y: position.y + building.position.y + building.doorPosition.y + EXIT_CLEARANCE
  };

  // Check for blockers and adjust position
  const blockers = buildingRoofs.filter((roof) => roof !== building);
  const maxSteps = 12;

  for (let step = 0; step < maxSteps; step++) {
    if (!isBlocked(config, blockers, exitPosition, passportSize)) break;
    exitPosition.y += passportSize;
  }

  return exitPosition;
}

function isBlocked(
  config: PlotConfig,
  blockers: BuildingRoof[],
  position: { x: number; y: number },
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

    // Check doors too
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

