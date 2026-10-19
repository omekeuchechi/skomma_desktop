import Phaser from 'phaser';

export interface DoorConfig {
  position: { x: number; y: number };
  width: number;
  height: number;
  sceneName: string; // Indoor scene to load
  soundKey?: string; // Sound to play on entry
}

/**
 * Creates a door object with collision detection
 */
export function createDoor(
  scene: Phaser.Scene,
  config: DoorConfig
): Phaser.GameObjects.Rectangle {
  const { position, width, height, sceneName, soundKey } = config;

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

/**
 * Checks if passport collides with door and triggers action
 */
export function checkDoorCollision(
  passport: Phaser.GameObjects.Container,
  door: Phaser.GameObjects.Rectangle,
  scene: Phaser.Scene,
  onEnterScene: (sceneName: string, doorPosition?: { x: number; y: number }) => void
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

    // Play sound if not already played (only if audio is enabled)
    if (!hasPlayedSound && soundKey && !scene.sound.mute) {
      try {
        scene.sound.play(soundKey, { volume: 0.5 });
        door.setData('hasPlayedSound', true);

        // Reset sound flag after a delay (sound plays asynchronously)
        setTimeout(() => {
          door.setData('hasPlayedSound', false);
        }, 1000);
      } catch (error) {
        // Sound playback failed (e.g., interrupted), continue without sound
        console.log('Sound playback skipped:', error);
        // Still set the flag to prevent retrying
        door.setData('hasPlayedSound', true);
        setTimeout(() => {
          door.setData('hasPlayedSound', false);
        }, 1000);
      }
    }

    // Load indoor scene
    const sceneName = door.getData('sceneName');
    if (sceneName) {
      onEnterScene(sceneName, { x: door.x, y: door.y });
    }

    return true;
  }

  // Reset sound flag when not colliding
  door.setData('hasPlayedSound', false);

  return false;
}

/**
 * Get all doors in a container
 */
export function getDoorsInContainer(
  container: Phaser.GameObjects.Container
): Phaser.GameObjects.Rectangle[] {
  const doors: Phaser.GameObjects.Rectangle[] = [];
  
  container.list.forEach((child) => {
    if (child instanceof Phaser.GameObjects.Rectangle) {
      const isDoor = child.getData('isDoor');
      if (isDoor) {
        doors.push(child);
      }
    }
  });

  return doors;
}
