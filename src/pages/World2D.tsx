import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import { useWorldPositionStore } from '@stores/worldPositionStore';
import { useAuthStore } from '@stores/authStore';
import { createPlot, createDoor, checkDoorCollision, getBuildingExitPosition, samplePlotConfig, BuildingRoof } from '@world/building';
import PassportWithMode from '@components/PassportWithMode';
import { loadWorldSounds, playSoundWithFallback } from '@world/audio/audioLoader';

export default function World2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { outdoorPosition, setOutdoorPosition, setCurrentScene, setDoorPosition } = useWorldPositionStore();
  const { user } = useAuthStore();
  const [passportPosition, setPassportPosition] = useState(outdoorPosition);
  const [isLoading, setIsLoading] = useState(false);
  const setIsLoadingRef = useRef(setIsLoading);
  const gameRef = useRef<Phaser.Game | null>(null);
  const gameInitializedRef = useRef(false);
  const initialPositionRef = useRef(outdoorPosition);

  // Update ref when setIsLoading changes
  useEffect(() => {
    setIsLoadingRef.current = setIsLoading;
  }, [setIsLoading]);

  // Set initial position once when component mounts
  useEffect(() => {
    initialPositionRef.current = outdoorPosition;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!container || !scrollContainer || gameInitializedRef.current) return;

    gameInitializedRef.current = true;

    // Store scroll container in window for Phaser to access
    (window as { scrollContainer?: HTMLDivElement }).scrollContainer = scrollContainer;
    (window as { setIsLoadingRef?: { current: (loading: boolean) => void } }).setIsLoadingRef = setIsLoadingRef;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      parent: container,
      width: 10000,
      height: 10000,
      backgroundColor: '#000000',
      audio: {
        disableWebAudio: false,
      },
      scene: {
        preload: function(this: Phaser.Scene) {
          // Load audio assets
          loadWorldSounds(this);
        },
        create: function(this: Phaser.Scene) {
          // Create green ground
          const greenGround = this.add.rectangle(5000, 5000, 10000, 10000, 0x218727);
          greenGround.setOrigin(0.5, 0.5);
          greenGround.setDepth(0);

          // Create passport container at stored position
          const passport = this.add.container(initialPositionRef.current.x, initialPositionRef.current.y);
          passport.setDepth(1000);

          // Add invisible rectangle for collision detection
          const passportHitbox = this.add.rectangle(0, 0, 100, 100, 0x000000, 0);
          passport.add(passportHitbox);

          // Store passport reference globally
          (window as { passport?: Phaser.GameObjects.Container }).passport = passport;

          // Create a sample plot with building
          const plot = createPlot(this, samplePlotConfig);
          plot.setDepth(10);

          // Store building roofs for collision detection
          const buildingRoofs: (Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle)[] = [];
          plot.list.forEach((child: Phaser.GameObjects.GameObject) => {
            if (child instanceof Phaser.GameObjects.Container) {
              child.list.forEach((roofChild: Phaser.GameObjects.GameObject) => {
                if (roofChild instanceof Phaser.GameObjects.Image || roofChild instanceof Phaser.GameObjects.Rectangle) {
                  buildingRoofs.push(roofChild);
                }
              });
            }
          });
          (window as { buildingRoofs?: (Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle)[] }).buildingRoofs = buildingRoofs;

          // Add doors for each building in the plot
          const doors: Phaser.GameObjects.Rectangle[] = [];
          samplePlotConfig.buildingRoofs.forEach((building: BuildingRoof) => {
            if (!building.hasDoor || !building.doorPosition) return;

            const absoluteDoorX = samplePlotConfig.position.x + building.position.x + building.doorPosition.x;
            const absoluteDoorY = samplePlotConfig.position.y + building.position.y + building.doorPosition.y;

            const door = createDoor(this, {
              position: { x: absoluteDoorX, y: absoluteDoorY },
              width: 150,
              height: 20,
              sceneName: building.sceneName || '',
              soundKey: 'opening_door'
            });
            door.setDepth(20);
            doors.push(door);
          });
          (window as { doors?: Phaser.GameObjects.Rectangle[] }).doors = doors;

          // Movement settings
          const speed = 20;
          const clickSpeed = 15;
          const passportSize = 100;
          const margin = 50;
          const minX = margin + passportSize / 2;
          const maxX = 10000 - margin - passportSize / 2;
          const minY = margin + passportSize / 2;
          const maxY = 10000 - margin - passportSize / 2;

          let targetX: number | null = null;
          let targetY: number | null = null;
          let wasRoofCollision = false;

          // Keyboard controls
          const cursors = this.input.keyboard!.createCursorKeys();

          // Create target line for click-to-move
          const targetLine = this.add.graphics();

          // Click-to-move handler
          this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
              // Set target to clicked position
              targetX = Phaser.Math.Clamp(pointer.worldX, minX, maxX);
              targetY = Phaser.Math.Clamp(pointer.worldY, minY, maxY);
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

            // Click-to-move (takes priority if target is set)
            if (targetX !== null && targetY !== null) {
              const diffX = targetX - passport.x;
              const diffY = targetY - passport.y;
              const distance = Math.sqrt(diffX * diffX + diffY * diffY);

              if (distance > clickSpeed) {
                dx = (diffX / distance) * clickSpeed;
                dy = (diffY / distance) * clickSpeed;
              } else {
                // Reached target
                passport.x = targetX;
                passport.y = targetY;
                targetX = null;
                targetY = null;
                dx = 0;
                dy = 0;
              }
            }

            if (dx !== 0 || dy !== 0) {
              // Calculate new position
              const newX = Phaser.Math.Clamp(passport.x + dx, minX, maxX);
              const newY = Phaser.Math.Clamp(passport.y + dy, minY, maxY);

              // Check roof collision before moving (prevent moving on top of roofs)
              const buildingRoofsRef = (window as { buildingRoofs?: (Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle)[] }).buildingRoofs;
              let roofCollision = false;

              if (buildingRoofsRef && buildingRoofsRef.length > 0) {
                const tempPassportBounds = new Phaser.Geom.Rectangle(
                  newX - 50,
                  newY - 50,
                  100,
                  100
                );

                buildingRoofsRef.forEach((roof: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle) => {
                  const roofBounds = roof.getBounds();
                  if (Phaser.Geom.Intersects.RectangleToRectangle(tempPassportBounds, roofBounds)) {
                    roofCollision = true;
                  }
                });

                if (roofCollision) {
                  // Play wall hit sound only once per roof contact
                  if (!wasRoofCollision) {
                    playSoundWithFallback(this, 'wall_hit', 0.3);
                  }
                  wasRoofCollision = true;

                  // Don't move if roof collision detected
                  return;
                }

                wasRoofCollision = false;
              }

              passport.x = newX;
              passport.y = newY;

              // Save position to store
              setOutdoorPosition({ x: newX, y: newY });

              // Update React state with passport position
              const positionUpdate = new CustomEvent('passportPositionUpdate', {
                detail: { x: newX, y: newY }
              });
              window.dispatchEvent(positionUpdate);

              // Check door collision for all doors
              const doorsRef = (window as { doors?: Phaser.GameObjects.Rectangle[] }).doors;
              if (doorsRef && doorsRef.length > 0) {
                const passportBounds = passport.getBounds();

                doorsRef.forEach((doorRef) => {
                  const doorBounds = doorRef.getBounds();
                  const isColliding = Phaser.Geom.Intersects.RectangleToRectangle(passportBounds, doorBounds);

                  if (isColliding) {
                    checkDoorCollision(passport, doorRef, this, (sceneName: string) => {
                      // Show loading overlay
                      const setIsLoadingRef = (window as { setIsLoadingRef?: { current: (loading: boolean) => void } }).setIsLoadingRef;
                      if (setIsLoadingRef) setIsLoadingRef.current(true);
                      // Save current scene state
                      setCurrentScene('indoor');
                      // Save the spot in front of the building to return to on exit
                      const exitPosition = getBuildingExitPosition(samplePlotConfig, sceneName);
                      if (exitPosition) {
                        setDoorPosition(exitPosition);
                        setOutdoorPosition(exitPosition);
                      }
                      // Navigate to inner building scene after short delay
                      setTimeout(() => {
                        navigate(`/inner-building/${sceneName}`);
                      }, 500);
                    });
                  }
                });
              }
            }

            // Draw target line if moving towards target
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
      delete (window as { scrollContainer?: HTMLDivElement }).scrollContainer;
      gameInitializedRef.current = false;
    };
  }, [navigate, setOutdoorPosition, setCurrentScene, setDoorPosition, user]);

  // Listen for passport position updates from Phaser
  useEffect(() => {
    const handlePositionUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ x: number; y: number }>;
      setPassportPosition(customEvent.detail);

      // Scroll the container to follow the passport (camera-like movement)
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const offsetX = customEvent.detail.x - window.innerWidth / 2;
        const offsetY = customEvent.detail.y - window.innerHeight / 2;
        scrollContainer.scrollLeft = offsetX;
        scrollContainer.scrollTop = offsetY;
      }
    };

    window.addEventListener('passportPositionUpdate', handlePositionUpdate);
    return () => {
      window.removeEventListener('passportPositionUpdate', handlePositionUpdate);
    };
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full h-full overflow-auto"
    >
      <div
        ref={containerRef}
        className="block"
        style={{ width: '10000px', height: '10000px' }}
      />
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
