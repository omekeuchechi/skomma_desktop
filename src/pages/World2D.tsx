import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import { useWorldPositionStore } from '@stores/worldPositionStore';
import { useAuthStore } from '@stores/authStore';
import { loadWorldSounds } from '@world/audio/audioLoader';
import { PlotManager } from '@world/building/plotManager';
import PassportWithMode from '@components/PassportWithMode';
import MiniMap from '@components/MiniMap';

const PASSPORT_SIZE = 100;

export default function World2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Narrow store subscriptions — component only re-renders when these change.
  const setOutdoorPosition = useWorldPositionStore((s) => s.setOutdoorPosition);
  const setCurrentScene = useWorldPositionStore((s) => s.setCurrentScene);
  const setDoorPosition = useWorldPositionStore((s) => s.setDoorPosition);
  const outdoorPosition = useWorldPositionStore((s) => s.outdoorPosition);
  const user = useAuthStore((s) => s.user);

  const [passportPosition, setPassportPosition] = useState({ x: 2000, y: 2000 });
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 });
  const [plotPositions, setPlotPositions] = useState<Array<{ x: number; y: number; width: number; height: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const setIsLoadingRef = useRef(setIsLoading);
  const gameRef = useRef<Phaser.Game | null>(null);
  const gameInitializedRef = useRef(false);
  const initialPositionRef = useRef({ x: 2000, y: 2000 });
  const plotManagerRef = useRef<any>(null);

  // Keep setIsLoading ref fresh
  useEffect(() => {
    setIsLoadingRef.current = setIsLoading;
  }, [setIsLoading]);

  // Update spawn position when the stored outdoor position changes
  // (e.g., after returning from a building).
  useEffect(() => {
    if (outdoorPosition.x !== 0 || outdoorPosition.y !== 0) {
      initialPositionRef.current = outdoorPosition;
    }
  }, [outdoorPosition]);

  // Listen for live position updates from Phaser to track passport position
  useEffect(() => {
    const handlePositionUpdate = (event: Event) => {
      const { detail } = event as CustomEvent<{ x: number; y: number; cameraX: number; cameraY: number }>;
      setPassportPosition({ x: detail.x, y: detail.y });
      setCameraPosition({ x: detail.cameraX, y: detail.cameraY });
    };

    const handlePlotPositionsUpdate = (event: Event) => {
      const { detail } = event as CustomEvent<Array<{ x: number; y: number; width: number; height: number }>>;
      setPlotPositions(detail);
    };

    window.addEventListener('passportPositionUpdate', handlePositionUpdate);
    window.addEventListener('plotPositionsUpdate', handlePlotPositionsUpdate);
    return () => {
      window.removeEventListener('passportPositionUpdate', handlePositionUpdate);
      window.removeEventListener('plotPositionsUpdate', handlePlotPositionsUpdate);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (gameInitializedRef.current) return;
    gameInitializedRef.current = true;

    console.log('Container dimensions:', container.offsetWidth, container.offsetHeight);

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      parent: container,
      width: container.offsetWidth,
      height: container.offsetHeight,
      backgroundColor: '#218727', // Green background as fallback
      audio: { disableWebAudio: false },
      scene: {
        preload: function (this: Phaser.Scene) {
          loadWorldSounds(this);
          PlotManager.preloadAssets(this);
        },
        create: function (this: Phaser.Scene) {
          console.log('Scene create called');
          // --- World bounds & camera (no bounds - free movement) ---
          // this.cameras.main.setBounds is removed to allow free movement

          // --- Movement bounds (very large to allow free movement) ---
          const MIN_X = -100000;
          const MAX_X = 100000;
          const MIN_Y = -100000;
          const MAX_Y = 100000;

          // --- Ground (large ground for free movement) ---
          const greenGround = this.add.rectangle(
            5000,
            5000,
            200000,
            200000,
            0x218727
          );
          greenGround.setOrigin(0.5, 0.5);
          greenGround.setDepth(0);
          console.log('Green ground created at:', greenGround.x, greenGround.y);

          // --- Add grid lines to visualize movement ---
          const graphics = this.add.graphics();
          graphics.setDepth(1);
          graphics.lineStyle(2, 0x1a6b1f, 0.5);

          // Draw horizontal lines every 500 units
          for (let y = -100000; y <= 100000; y += 500) {
            graphics.beginPath();
            graphics.moveTo(-100000, y);
            graphics.lineTo(100000, y);
            graphics.strokePath();
          }

          // Draw vertical lines every 500 units just for texting
          for (let x = -100000; x <= 100000; x += 500) {
            graphics.beginPath();
            graphics.moveTo(x, -100000);
            graphics.lineTo(x, 100000);
            graphics.strokePath();
          }

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

          // Camera setup - allow passport to move freely, camera follows with bounds
          this.cameras.main.setZoom(1);
          // Set camera bounds to the movement area
          this.cameras.main.setBounds(MIN_X, MIN_Y, MAX_X - MIN_X, MAX_Y - MIN_Y);
          // Camera follows passport but with lerp for smooth movement
          this.cameras.main.startFollow(passport, true, 0.1, 0.1); // 0.1 lerp = smooth follow with delay

          // --- Plot Manager ---
          const plotManager = new PlotManager(
            this,
            passport,
            PASSPORT_SIZE,
            {
              onDoorEnter: (sceneName: string) => {
                setTimeout(() => {
                  navigate(`/inner-building/${sceneName}`);
                }, 500);
              },
              onLoadingStart: () => {
                setIsLoadingRef.current(true);
                setCurrentScene('indoor');
              },
              onPositionUpdate: (x: number, y: number) => {
                setDoorPosition({ x, y });
                setOutdoorPosition({ x, y });
              },
            }
          );
          plotManager.create();

          // Store plot manager reference for mini-map
          plotManagerRef.current = plotManager;

          // Broadcast plot positions to React
          const plotPositions = plotManager.getPlotPositions();
          window.dispatchEvent(
            new CustomEvent('plotPositionsUpdate', {
              detail: plotPositions,
            })
          );

          // --- Movement config ---
          const speed = 20;
          const clickSpeed = 15;
          let targetX: number | null = null;
          let targetY: number | null = null;

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

              // --- Roof collision ---
              const roofCollision = plotManager.checkRoofCollision(newX, newY);
              if (!roofCollision) {
                passport.x = newX;
                passport.y = newY;
              }
            }

            // --- Persist & broadcast current position ---
            const currentX = passport.x;
            const currentY = passport.y;
            setOutdoorPosition({ x: currentX, y: currentY });

            // Broadcast position update to React component with camera position
            window.dispatchEvent(
              new CustomEvent('passportPositionUpdate', {
                detail: {
                  x: currentX,
                  y: currentY,
                  cameraX: this.cameras.main.scrollX,
                  cameraY: this.cameras.main.scrollY,
                },
              })
            );

            // --- Door collision ---
            plotManager.checkDoorCollision();

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
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/*
        Passport positioned at screen coordinates (world position - camera position).
        pointer-events-none lets clicks reach the canvas.
      */}
      <div
        className="pointer-events-none absolute z-50"
        style={{
          left: `${passportPosition.x - cameraPosition.x}px`,
          top: `${passportPosition.y - cameraPosition.y}px`,
          transform: 'translate(-50%, -50%)',
          width: PASSPORT_SIZE,
          height: PASSPORT_SIZE,
        }}
      >
        <PassportWithMode
          x={0}
          y={0}
          size={PASSPORT_SIZE}
          displayName={user?.displayName || user?.username}
        />
      </div>

      {/* Mini-Map */}
      <MiniMap
        playerPosition={passportPosition}
        plotPositions={plotPositions}
        worldBounds={{ minX: -100000, maxX: 100000, minY: -100000, maxY: 100000 }}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      )}
    </div>
  );
}
