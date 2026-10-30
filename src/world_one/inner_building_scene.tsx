import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate, useParams } from 'react-router-dom';
import { createBuildingScene } from '@world_one/terrain/plot_1/scripts/buildings_scenes/index';
import { createDoor } from '@world_one/terrain/plot_1/scripts/services/index';
import type { BuildingSceneConfig } from '@world_one/terrain/plot_1/scripts/types/index';
import { useWorldPositionStore } from '@stores/worldPositionStore';
import { useAuthStore } from '@stores/authStore';
import PassportWithMode from '@components/PassportWithMode';

// Import indoor scene configurations from each plot
import {
  duplexIndoorConfig,
  duplexIndoor2Config,
  smallBuildingIndoor1Config,
  smallBuildingIndoor2Config,
} from '@world_one/terrain/plot_1/indoor.config';
import { plot2DuplexIndoorConfig } from '@world_one/terrain/plot_2/indoor.config';
import { plot3Duplex1Config } from '@world_one/terrain/plot_3/indoor.config';
import { plot4Small1Config } from '@world_one/terrain/plot_4/indoor.config';
import { plot5Duplex1Config } from '@world_one/terrain/plot_5/indoor.config';
import { plot6Small1Config } from '@world_one/terrain/plot_6/indoor.config';
import { plot7Duplex1Config, plot7Small1Config } from '@world_one/terrain/plot_7/indoor.config';
import { plot8Duplex1Config } from '@world_one/terrain/plot_8/indoor.config';
import { plot9Small1Config, plot9Small2Config } from '@world_one/terrain/plot_9/indoor.config';
import { plot10Duplex1Config } from '@world_one/terrain/plot_10/indoor.config';
import { plot11Duplex1Config, plot11Small1Config } from '@world_one/terrain/plot_11/indoor.config';

// Combine all building scene configurations
const buildingScenes: Record<string, BuildingSceneConfig> = {
  [duplexIndoorConfig.sceneName]: duplexIndoorConfig,
  [duplexIndoor2Config.sceneName]: duplexIndoor2Config,
  [smallBuildingIndoor1Config.sceneName]: smallBuildingIndoor1Config,
  [smallBuildingIndoor2Config.sceneName]: smallBuildingIndoor2Config,
  [plot2DuplexIndoorConfig.sceneName]: plot2DuplexIndoorConfig,
  [plot3Duplex1Config.sceneName]: plot3Duplex1Config,
  [plot4Small1Config.sceneName]: plot4Small1Config,
  [plot5Duplex1Config.sceneName]: plot5Duplex1Config,
  [plot6Small1Config.sceneName]: plot6Small1Config,
  [plot7Duplex1Config.sceneName]: plot7Duplex1Config,
  [plot7Small1Config.sceneName]: plot7Small1Config,
  [plot8Duplex1Config.sceneName]: plot8Duplex1Config,
  [plot9Small1Config.sceneName]: plot9Small1Config,
  [plot9Small2Config.sceneName]: plot9Small2Config,
  [plot10Duplex1Config.sceneName]: plot10Duplex1Config,
  [plot11Duplex1Config.sceneName]: plot11Duplex1Config,
  [plot11Small1Config.sceneName]: plot11Small1Config,
};

export default function InnerBuildingScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { sceneName } = useParams<{ sceneName: string }>();
  const { setCurrentScene, doorPosition, setOutdoorPosition } = useWorldPositionStore();
  const { user } = useAuthStore();
  const [passportPosition, setPassportPosition] = useState({
    x: 5000,
    y: 5000
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize passport position based on scene config
  useEffect(() => {
    if (sceneName) {
      const config = buildingScenes[sceneName];
      if (config && config.exitDoor) {
        setPassportPosition({
          x: 5000 + config.exitDoor.position.x - config.width / 2 - 100,
          y: 5000 + config.exitDoor.position.y - config.height / 2
        });
      }
    }
  }, [sceneName]);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!container || !scrollContainer || !sceneName) return;

    const config = buildingScenes[sceneName];
    if (!config) {
      console.error('Scene not found:', sceneName);
      return;
    }

    const phaserConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      parent: scrollContainer,
      width: 10000,
      height: 10000,
      backgroundColor: '#000000',
      autoFocus: true,
      audio: {
        disableWebAudio: true,
      },
      scene: {
        preload: function(this: Phaser.Scene) {
          // Load plot_1 assets
          this.load.image('tiles', '/world_one/terrain/plot_1/assets/imgs/tiles.jpeg');
          this.load.image('table', '/world_one/terrain/plot_1/assets/imgs/table.png');
          // Load plot_2 assets (using different keys)
          this.load.image('plot_2_tiles', '/world_one/terrain/plot_2/assets/imgs/tiles.jpeg');
          this.load.image('plot_2_table', '/world_one/terrain/plot_2/assets/imgs/table.png');
        },
        create: function(this: Phaser.Scene) {
          const indoorScene = createBuildingScene(this, config);

          if (config.exitDoor) {
            const exitDoor = createDoor(this, {
              position: { x: 5000 + config.exitDoor.position.x - config.width / 2, y: 5000 + config.exitDoor.position.y - config.height / 2 },
              width: config.exitDoor.width,
              height: config.exitDoor.height,
              sceneName: 'outdoor',
              soundKey: 'opening_door'
            });
            exitDoor.setDepth(100);
            (window as { exitDoor?: Phaser.GameObjects.Rectangle }).exitDoor = exitDoor;
          }

          // Store building scene at center of world
          const buildingContainer = this.add.container(5000, 5000);
          buildingContainer.add(indoorScene);
          buildingContainer.setDepth(10);

          // Add passport for indoor scene (invisible, used for position tracking)
          const passportSize = 100;
          // Position passport in the center of the world
          const startX = 5000;
          const startY = 5000;
          const passport = this.add.container(startX, startY);
          passport.setDepth(1000);

          // Store passport reference globally
          (window as { passport?: Phaser.GameObjects.Container }).passport = passport;

          // Movement settings
          const speed = 20;
          const clickSpeed = 15;
          let targetX: number | null = null;
          let targetY: number | null = null;
          const minX = passportSize / 2;
          const maxX = 10000 - passportSize / 2;
          const minY = passportSize / 2;
          const maxY = 10000 - passportSize / 2;

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

          // Scroll wheel handler for passport movement
          this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number, _deltaZ: number) => {
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
  }, [sceneName, navigate, setCurrentScene, doorPosition, setOutdoorPosition, user]);

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

    // Initial scroll to center of world
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollLeft = 5000 - window.innerWidth / 2;
      scrollContainer.scrollTop = 5000 - window.innerHeight / 2;
    }

    return () => {
      window.removeEventListener('passportPositionUpdate', handlePositionUpdate);
    };
  }, [scrollContainerRef]);

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full h-full overflow-auto bg-gray-900"
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
