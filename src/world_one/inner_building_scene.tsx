import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate, useParams } from 'react-router-dom';
import { createBuildingScene } from '@world_one/terrain/plot_1/scripts/buildings_scenes/index';
import { createDoor } from '@world_one/terrain/plot_1/scripts/services/index';
import type { BuildingSceneConfig } from '@world_one/terrain/plot_1/scripts/types/index';
import { useWorldPositionStore } from '@stores/worldPositionStore';
import PassportWithMode from '@components/PassportWithMode';

export default function InnerBuildingScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { sceneName } = useParams<{ sceneName: string }>();
  const { setCurrentScene, doorPosition, setOutdoorPosition } = useWorldPositionStore();
  const [passportPosition, setPassportPosition] = useState({ 
    x: window.innerWidth / 2, 
    y: window.innerHeight / 2 
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !sceneName) return;

    // Define building scenes based on sceneName
    const buildingScenes: Record<string, BuildingSceneConfig> = {
      duplex_indoor: {
        sceneName: 'duplex_indoor',
        width: window.innerWidth,
        height: window.innerHeight,
        floorTexture: 'tiles',
        objects: [
          {
            image: 'table',
            position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            width: 200,
            height: 120,
            collision: true
          }
        ],
        background: '#ffffff',
        exitDoor: {
          position: { x: window.innerWidth - 75, y: window.innerHeight / 2 },
          width: 150,
          height: 20
        }
      },
      duplex_indoor2: {
        sceneName: 'duplex_indoor2',
        width: window.innerWidth,
        height: window.innerHeight,
        floorTexture: '',
        objects: [],
        background: '#ffffff',
        exitDoor: {
          position: { x: window.innerWidth - 75, y: window.innerHeight / 2 },
          width: 150,
          height: 20
        }
      },
      small_building_indoor1: {
        sceneName: 'small_building_indoor1',
        width: window.innerWidth,
        height: window.innerHeight,
        floorTexture: 'tiles',
        objects: [
          {
            image: 'table',
            position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            width: 200,
            height: 120,
            collision: true
          }
        ],
        background: '#ffffff',
        exitDoor: {
          position: { x: window.innerWidth - 75, y: window.innerHeight / 2 },
          width: 150,
          height: 20
        }
      },
      small_building_indoor2: {
        sceneName: 'small_building_indoor2',
        width: window.innerWidth,
        height: window.innerHeight,
        floorTexture: 'tiles',
        objects: [
          {
            image: 'table',
            position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            width: 200,
            height: 120,
            collision: true
          }
        ],
        background: '#ffffff',
        exitDoor: {
          position: { x: window.innerWidth - 75, y: window.innerHeight / 2 },
          width: 150,
          height: 20
        }
      },
    };

    const config = buildingScenes[sceneName];
    if (!config) {
      console.error('Scene not found:', sceneName);
      return;
    }

    const phaserConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      parent: container,
      width: config.width,
      height: config.height,
      backgroundColor: '#000000',
      autoFocus: true,
      audio: {
        disableWebAudio: true,
      },
      scene: {
        preload: function(this: Phaser.Scene) {
          this.load.image('tiles', '/src/world_one/terrain/plot_1/assets/imgs/tiles.jpeg');
          this.load.image('table', '/src/world_one/terrain/plot_1/assets/imgs/table.png');
        },
        create: function(this: Phaser.Scene) {
          const indoorScene = createBuildingScene(this, config);
          indoorScene.setPosition(config.width / 2, config.height / 2);

          if (config.exitDoor) {
            const exitDoor = createDoor(this, {
              position: config.exitDoor.position,
              width: config.exitDoor.width,
              height: config.exitDoor.height,
              sceneName: 'outdoor',
              soundKey: 'opening_door'
            });
            exitDoor.setDepth(100);
            (window as { exitDoor?: Phaser.GameObjects.Rectangle }).exitDoor = exitDoor;
          }

          // Add passport for indoor scene (invisible, used for position tracking)
          const passportSize = 100;
          // Position passport 50px to the left of the exit door
          // Exit door is at config.width - 75, so passport should be at config.width - 125
          const startX = config.width - 125;
          const startY = config.height / 2;
          const passport = this.add.container(startX, startY);
          passport.setDepth(1000);
          
          // Store passport reference globally
          (window as { passport?: Phaser.GameObjects.Container }).passport = passport;

          // Store config width/height for React to access
          (window as { configWidth?: number; configHeight?: number }).configWidth = config.width;
          (window as { configWidth?: number; configHeight?: number }).configHeight = config.height;

          // Movement settings
          const speed = 20;
          const clickSpeed = 15;
          let targetX: number | null = null;
          let targetY: number | null = null;
          const minX = passportSize / 2;
          const maxX = config.width - passportSize / 2;
          const minY = passportSize / 2;
          const maxY = config.height - passportSize / 2;

          // Keyboard controls
          const cursors = this.input.keyboard!.createCursorKeys();

          // Create target line for click-to-move
          const targetLine = this.add.graphics();
          targetLine.setDepth(999);

          // Click-to-move handler
          this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
              // Set target to clicked position
              targetX = Phaser.Math.Clamp(pointer.x, minX, maxX);
              targetY = Phaser.Math.Clamp(pointer.y, minY, maxY);
            }
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
              
              passport.x = newX;
              passport.y = newY;

              // Update React state with passport position
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
                  try {
                    this.sound.play('opening_door', { volume: 0.5 });
                  } catch (error) {
                    console.log('Sound play failed:', error);
                  }
                  
                  // Show loading overlay
                  setIsLoading(true);
                  
                  setCurrentScene('outdoor');
                  // Return in front of the building (position saved on entry)
                  if (doorPosition) {
                    setOutdoorPosition({
                      x: doorPosition.x,
                      y: doorPosition.y
                    });
                  }
                  
                  // Navigate after short delay
                  setTimeout(() => {
                    navigate('/world');
                  }, 500);
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
            }
          });
        }
      }
    };

    const game = new Phaser.Game(phaserConfig);

    return () => {
      game.destroy(true);
    };
  }, [sceneName, navigate, setCurrentScene, doorPosition, setOutdoorPosition]);

  // Listen for passport position updates from Phaser
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
      />
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      )}
    </div>
  );
}
