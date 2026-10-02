import Phaser from 'phaser';

export function setupMovementControls(
  scene: Phaser.Scene,
  passport: Phaser.GameObjects.Container,
  targetLine: Phaser.GameObjects.Graphics,
  onPositionChange: (x: number, y: number) => void
) {
  let isMoving = false;
  let targetX = passport.x;
  let targetY = passport.y;
  const moveSpeed = 20; // Increased for faster movement

  // World boundaries (10000x10000 world, passport is 200x200)
  const WORLD_SIZE = 10000;
  const PASSPORT_SIZE = 200;
  const MIN_BOUND = PASSPORT_SIZE / 2;
  const MAX_BOUND = WORLD_SIZE - PASSPORT_SIZE / 2;

  // Click to move
  scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    if (!pointer.rightButtonDown()) {
      // Clamp target to world boundaries
      targetX = Math.max(MIN_BOUND, Math.min(MAX_BOUND, pointer.worldX));
      targetY = Math.max(MIN_BOUND, Math.min(MAX_BOUND, pointer.worldY));
      isMoving = true;
      
      updateTargetLine(passport, targetLine, targetX, targetY);
    }
  });

  // Arrow key movement
  const cursors = scene.input.keyboard!.createCursorKeys();
  
  scene.events.on('update', () => {
    let moved = false;
    let newX = passport.x;
    let newY = passport.y;

    // Handle keyboard movement (synchronous for smoothness)
    if (cursors.left.isDown) {
      newX = Math.max(MIN_BOUND, newX - moveSpeed);
      moved = true;
    }
    if (cursors.right.isDown) {
      newX = Math.min(MAX_BOUND, newX + moveSpeed);
      moved = true;
    }
    if (cursors.up.isDown) {
      newY = Math.max(MIN_BOUND, newY - moveSpeed);
      moved = true;
    }
    if (cursors.down.isDown) {
      newY = Math.min(MAX_BOUND, newY + moveSpeed);
      moved = true;
    }

    // Handle click-to-move (synchronous for smoothness)
    if (isMoving && !moved) {
      const dx = targetX - passport.x;
      const dy = targetY - passport.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > moveSpeed) {
        newX = passport.x + (dx / distance) * moveSpeed;
        newY = passport.y + (dy / distance) * moveSpeed;
        
        // Clamp to boundaries
        newX = Math.max(MIN_BOUND, Math.min(MAX_BOUND, newX));
        newY = Math.max(MIN_BOUND, Math.min(MAX_BOUND, newY));
        
        moved = true;
      } else {
        // Reached target
        newX = targetX;
        newY = targetY;
        isMoving = false;
        clearTargetLine(targetLine);
        moved = true;
      }
    }

    if (moved) {
      passport.x = newX;
      passport.y = newY;
      onPositionChange(newX, newY);
    }
  });
}

function updateTargetLine(
  passport: Phaser.GameObjects.Container,
  line: Phaser.GameObjects.Graphics,
  targetX: number,
  targetY: number
) {
  line.clear();
  line.lineStyle(2, 0xffffff, 0.5);
  line.beginPath();
  line.moveTo(passport.x, passport.y);
  line.lineTo(targetX, targetY);
  line.strokePath();
  
  // Draw target marker
  line.fillStyle(0xffffff, 0.5);
  line.fillCircle(targetX, targetY, 5);
}

function clearTargetLine(line: Phaser.GameObjects.Graphics) {
  line.clear();
}
