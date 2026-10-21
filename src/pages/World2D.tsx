import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import { useWorldPositionStore } from '@stores/worldPositionStore';
import { useAuthStore } from '@stores/authStore';
import {
  createPlot,
  createDoor,
  checkDoorCollision,
  getBuildingExitPosition,
  samplePlotConfig,
  BuildingRoof,
} from '@world/building';
import PassportWithMode from '@components/PassportWithMode';
import { loadWorldSounds, playSoundWithFallback } from '@world/audio/audioLoader';

const WORLD_SIZE = 10000;
const PASSPORT_SIZE = 100;
const MARGIN = 0;
const MIN_X = MARGIN + PASSPORT_SIZE / 2;
const MAX_X = WORLD_SIZE - MARGIN - PASSPORT_SIZE / 2;
const MIN_Y = MARGIN + PASSPORT_SIZE / 2;
const MAX_Y = WORLD_SIZE - MARGIN - PASSPORT_SIZE / 2;

export default function World2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Narrow store subscriptions — component only re-renders when these change.
  const setOutdoorPosition = useWorldPositionStore((s) => s.setOutdoorPosition);
  const setCurrentScene = useWorldPositionStore((s) => s.setCurrentScene);
  const setDoorPosition = useWorldPositionStore((s) => s.setDoorPosition);
  const outdoorPosition = useWorldPositionStore((s) => s.outdoorPosition);
  const user = useAuthStore((s) => s.user);

  const [passportPosition, setPassportPosition] = useState(outdoorPosition);

  const [isLoading, setIsLoading] = useState(false);
  const setIsLoadingRef = useRef(setIsLoading);
  const gameRef = useRef<Phaser.Game | null>(null);
  const gameInitializedRef = useRef(false);
  const initialPositionRef = useRef(outdoorPosition);

  // Keep setIsLoading ref fresh
  useEffect(() => {
    setIsLoadingRef.current = setIsLoading;
  }, [setIsLoading]);

  // Update spawn position when the stored outdoor position changes
  // (e.g., after returning from a building).
  useEffect(() => {
    initialPositionRef.current = outdoorPosition;
  }, [outdoorPosition]);

  // Listen for live position updates from Phaser to track passport position
  useEffect(() => {
    const handlePositionUpdate = (event: Event) => {
      const { detail } = event as CustomEvent<{ x: number; y: number }>;
      setPassportPosition(detail);
    };

    window.addEventListener('passportPositionUpdate', handlePositionUpdate);
    return () => window.removeEventListener('passportPositionUpdate', handlePositionUpdate);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (gameInitializedRef.current) return;
    gameInitializedRef.current = true;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      parent: container,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#000000',
      audio: { disableWebAudio: false },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        preload: function (this: Phaser.Scene) {
          loadWorldSounds(this);
        },
        create: function (this: Phaser.Scene) {
          // --- World bounds & camera ---
          this.cameras.main.setBounds(0, 0, WORLD_SIZE, WORLD_SIZE);

          // --- Ground ---
          const greenGround = this.add.rectangle(
            WORLD_SIZE / 2,
            WORLD_SIZE / 2,
            WORLD_SIZE,
            WORLD_SIZE,
            0x218727
          );
          greenGround.setOrigin(0.5, 0.5);
          greenGround.setDepth(0);

          // --- Passport (player container) ---
          const passport = this.add.container(
            initialPositionRef.current.x,
            initialPositionRef.current.y
          );
          passport.setDepth(1000);

          const passportHitbox = this.add.rectangle(
            0,
            0,
            PASSPORT_SIZE,
            PASSPORT_SIZE,
            0x000000,
            0
          );
          passport.add(passportHitbox);

          // Camera follows the passport (instant snap, no lerp)
          this.cameras.main.startFollow(passport, false, 1, 1);

          // --- Plot & roofs ---
          const plot = createPlot(this, samplePlotConfig);
          plot.setDepth(10);

          // Roof collision detection disabled for free movement
          // const buildingRoofs: (Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle)[] = [];
          // plot.list.forEach((child: Phaser.GameObjects.GameObject) => {
          //   if (child instanceof Phaser.GameObjects.Container) {
          //     child.list.forEach((roofChild: Phaser.GameObjects.GameObject) => {
          //       if (
          //         roofChild instanceof Phaser.GameObjects.Image ||
          //         roofChild instanceof Phaser.GameObjects.Rectangle
          //       ) {
          //         buildingRoofs.push(roofChild);
          //       }
          //     });
          //   }
          // });

          // --- Doors ---
          const doors: Phaser.GameObjects.Rectangle[] = [];
          samplePlotConfig.buildingRoofs.forEach((building: BuildingRoof) => {
            if (!building.hasDoor || !building.doorPosition) return;
            const absoluteDoorX =
              samplePlotConfig.position.x + building.position.x + building.doorPosition.x;
            const absoluteDoorY =
              samplePlotConfig.position.y + building.position.y + building.doorPosition.y;

            const door = createDoor(this, {
              position: { x: absoluteDoorX, y: absoluteDoorY },
              width: 150,
              height: 20,
              sceneName: building.sceneName || '',
              soundKey: 'opening_door',
            });
            door.setDepth(20);
            doors.push(door);
          });

          // --- Movement config ---
          const speed = 20;
          const clickSpeed = 15;
          let targetX: number | null = null;
          let targetY: number | null = null;
          let activeDoor: Phaser.GameObjects.Rectangle | null = null;

          const cursors = this.input.keyboard!.createCursorKeys();
          const targetLine = this.add.graphics();
          targetLine.setDepth(999);

          // Click-to-move — worldX/worldY are camera-aware
          this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
              targetX = Phaser.Math.Clamp(pointer.worldX, MIN_X, MAX_X);
              targetY = Phaser.Math.Clamp(pointer.worldY, MIN_Y, MAX_Y);
            }
          });

          // Handle viewport resize (Scale.RESIZE mode)
          this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
            this.cameras.main.setSize(gameSize.width, gameSize.height);
          });

          this.events.on('update', () => {
            let dx = 0;
            let dy = 0;

            if (cursors.left!.isDown) dx -= speed;
            if (cursors.right!.isDown) dx += speed;
            if (cursors.up!.isDown) dy -= speed;
            if (cursors.down!.isDown) dy += speed;

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
                targetLine.clear();
              }
            }

            if (dx !== 0 || dy !== 0) {
              const newX = Phaser.Math.Clamp(passport.x + dx, MIN_X, MAX_X);
              const newY = Phaser.Math.Clamp(passport.y + dy, MIN_Y, MAX_Y);

              // --- Roof collision (disabled for free movement) ---
              // let roofCollision = false;
              // if (buildingRoofs.length > 0) {
              //   const tempBounds = new Phaser.Geom.Rectangle(
              //     newX - PASSPORT_SIZE / 2,
              //     newY - PASSPORT_SIZE / 2,
              //     PASSPORT_SIZE,
              //     PASSPORT_SIZE
              //   );
              //   for (const roof of buildingRoofs) {
              //     if (
              //       Phaser.Geom.Intersects.RectangleToRectangle(tempBounds, roof.getBounds())
              //     ) {
              //       roofCollision = true;
              //       break;
              //     }
              //   }
              // }

              // if (roofCollision) {
              //   if (!wasRoofCollision) {
              //     playSoundWithFallback(this, 'wall_hit', 0.3);
              //   }
              //   wasRoofCollision = true;
              // } else {
              //   wasRoofCollision = false;
                passport.x = newX;
                passport.y = newY;
              // }
            }

            // --- Persist & broadcast current position ---
            const currentX = passport.x;
            const currentY = passport.y;
            setOutdoorPosition({ x: currentX, y: currentY });

            // Broadcast position update to React component
            window.dispatchEvent(
              new CustomEvent('passportPositionUpdate', {
                detail: { x: currentX, y: currentY },
              })
            );

            // --- Door collision (debounced) ---
            const passportBounds = passport.getBounds();
            let overlappingDoor: Phaser.GameObjects.Rectangle | null = null;
            for (const doorRef of doors) {
              if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                  passportBounds,
                  doorRef.getBounds()
                )
              ) {
                overlappingDoor = doorRef;
                break;
              }
            }

            if (overlappingDoor && overlappingDoor !== activeDoor) {
              activeDoor = overlappingDoor;

              checkDoorCollision(passport, overlappingDoor, this, (sceneName: string) => {
                // Lazy auth read — never closes over a stale `user`.
                const currentUser = useAuthStore.getState().user;
                if (!currentUser) return;

                setIsLoadingRef.current(true);
                setCurrentScene('indoor');

                const exitPosition = getBuildingExitPosition(samplePlotConfig, sceneName);
                if (exitPosition) {
                  setDoorPosition(exitPosition);
                  setOutdoorPosition(exitPosition);
                }

                setTimeout(() => {
                  navigate(`/inner-building/${sceneName}`);
                }, 500);
              });
            } else if (!overlappingDoor) {
              activeDoor = null;
            }

            // --- Target line ---
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
        },
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      gameInitializedRef.current = false;
    };
    // `user` intentionally not in deps — read via useAuthStore.getState().
  }, [navigate, setOutdoorPosition, setCurrentScene, setDoorPosition]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Phaser canvas fills the viewport */}
      <div ref={containerRef} className="absolute inset-0" />

      {/*
        Overlay passport pinned to viewport center (camera keeps the
        passport centered). pointer-events-none lets clicks reach the canvas.
      */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: PASSPORT_SIZE,
          height: PASSPORT_SIZE,
        }}
      >
        <PassportWithMode
          x={passportPosition.x}
          y={passportPosition.y}
          size={PASSPORT_SIZE}
          displayName={user?.displayName || user?.username}
        />
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      )}
    </div>
  );
}