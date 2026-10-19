import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorldPositionStore } from '@stores/worldPositionStore';
import { useAuthStore } from '@stores/authStore';
import PassportWithMode from '@components/PassportWithMode';
import { loadWorldSounds, playSoundWithFallback } from '@world/audio/audioLoader';

export default function InnerBuilding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { sceneName } = useParams<{ sceneName: string }>();
  const { setCurrentScene, doorPosition, setOutdoorPosition } = useWorldPositionStore();
  const { user } = useAuthStore();
  const [passportPosition, setPassportPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });
  const [isLoading, setIsLoading] = useState(false);
  const setIsLoadingRef = useRef(setIsLoading);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    setIsLoadingRef.current = setIsLoading;
  }, [setIsLoading]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !sceneName) return;

    // Clean up previous game if exists
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      parent: container,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#ffffff',
      autoFocus: true,
      audio: {
        disableWebAudio: true,
      },
      scene: {
        preload: function(this: Phaser.Scene) {
          // Load audio assets
          loadWorldSounds(this);
        },
        create: function(this: Phaser.Scene) {
          // Create floor
          const floor = this.add.rectangle(
            window.innerWidth / 2,
            window.innerHeight / 2,
            window.innerWidth,
            window.innerHeight,
            0xffffff
          );
          floor.setOrigin(0.5, 0.5);

          // Add passport for indoor scene
          const passportSize = 100;
          const startX = window.innerWidth - 125;
          const startY = window.innerHeight / 2;
          const passport = this.add.container(startX, startY);
          passport.setDepth(1000);

          // Store passport reference globally
          (window as { passport?: Phaser.GameObjects.Container }).passport = passport;

          // Create exit door
          const exitDoor = this.add.rectangle(
            window.innerWidth - 75,
            window.innerHeight / 2,
            150,
            20,
            0x8B4513
          );
          exitDoor.setOrigin(0.5, 0.5);
          exitDoor.setStrokeStyle(2, 0x5D3A1A);
          exitDoor.setDepth(100);
          (window as { exitDoor?: Phaser.GameObjects.Rectangle }).exitDoor = exitDoor;

          // Movement settings
          const speed = 20;
          const clickSpeed = 15;
          const minX = passportSize / 2;
          const maxX = window.innerWidth - passportSize / 2;
          const minY = passportSize / 2;
          const maxY = window.innerHeight - passportSize / 2;

          let targetX: number | null = null;
          let targetY: number | null = null;

          // Keyboard controls
          const cursors = this.input.keyboard!.createCursorKeys();

          // Create target line for click-to-move
          const targetLine = this.add.graphics();
          targetLine.setDepth(999);

          // Click-to-move handler
          this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
              targetX = Phaser.Math.Clamp(pointer.x, minX, maxX);
              targetY = Phaser.Math.Clamp(pointer.y, minY, maxY);
            }
          });

          // Scroll wheel handler for passport movement
          this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number, deltaZ: number) => {
            const scrollSpeed = 10;
            // Clear any existing click-to-move target
            targetX = null;
            targetY = null;
            // Apply scroll movement
            passport.x = Phaser.Math.Clamp(passport.x - deltaX * scrollSpeed, minX, maxX);
            passport.y = Phaser.Math.Clamp(passport.y - deltaY * scrollSpeed, minY, maxY);
          });

          // Update loop for movement
          this.events.on('update', () => {
            let dx = 0;
            let dy = 0;

            // Arrow key movement
            if (cursors.left!.isDown) dx -= speed;
            if (cursors.right!.isDown) dx += speed;
            if (cursors.up!.isDown) dy -= speed;
            if (cursors.down!.isDown) dy += speed;

            // Click-to-move
            if (targetX !== null && targetY !== null) {
              const diffX = targetX - passport.x;
              const diffY = targetY - passport.y;
              const distance = Math.sqrt(diffX * diffX + diffY * diffY);

              if (distance > clickSpeed) {
                dx = (diffX / distance) * clickSpeed;
                dy = (diffY / distance) * clickSpeed;
              } else {
                passport.x = targetX;
                passport.y = targetY;
                targetX = null;
                targetY = null;
                dx = 0;
                dy = 0;
              }
            }

            if (dx !== 0 || dy !== 0) {
              const newX = Phaser.Math.Clamp(passport.x + dx, minX, maxX);
              const newY = Phaser.Math.Clamp(passport.y + dy, minY, maxY);

              passport.x = newX;
              passport.y = newY;

              // Update React state
              const positionUpdate = new CustomEvent('passportPositionUpdate', {
                detail: { x: newX, y: newY }
              });
              window.dispatchEvent(positionUpdate);

              // Check exit door collision
              const exitDoorRef = (window as { exitDoor?: Phaser.GameObjects.Rectangle }).exitDoor;
              if (exitDoorRef) {
                const doorBounds = exitDoorRef.getBounds();
                if (Phaser.Geom.Rectangle.Contains(doorBounds, passport.x, passport.y)) {
                  // Play door sound
                  playSoundWithFallback(this, 'opening_door', 0.5);

                  // Show loading overlay
                  const setIsLoadingRef = (window as { setIsLoadingRef?: { current: (loading: boolean) => void } }).setIsLoadingRef;
                  if (setIsLoadingRef) setIsLoadingRef.current(true);

                  setCurrentScene('outdoor');
                  // Return in front of the building (position saved on entry)
                  if (doorPosition) {
                    setOutdoorPosition({
                      x: doorPosition.x,
                      y: doorPosition.y
                    });
                  } else {
                    // Fallback to default if no door position saved
                    setOutdoorPosition({ x: 5000, y: 5000 });
                  }

                  setTimeout(() => {
                    navigate('/world');
                  }, 500);
                }
              }
            }

            // Draw target line
            if (targetX !== null && targetY !== null) {
              targetLine.clear();
              targetLine.lineStyle(2, 0xffff00, 0.5);
              targetLine.beginPath();
              targetLine.moveTo(passport.x, passport.y);
              targetLine.lineTo(targetX, targetY);
              targetLine.strokePath();
            } else {
              targetLine.clear();
            }
          });
        }
      }
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [sceneName, navigate, setCurrentScene, doorPosition, setOutdoorPosition, user]);

  // Listen for passport position updates
  useEffect(() => {
    const handlePositionUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ x: number; y: number }>;
      setPassportPosition(customEvent.detail);
    };

    window.addEventListener('passportPositionUpdate', handlePositionUpdate);
    return () => {
      window.removeEventListener('passportPositionUpdate', handlePositionUpdate);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
      <div ref={containerRef} className="block" />
      <PassportWithMode
        x={passportPosition.x - 50}
        y={passportPosition.y - 50}
        size={100}
        displayName={user?.displayName || user?.username}
      />
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      )}
    </div>
  );
}
