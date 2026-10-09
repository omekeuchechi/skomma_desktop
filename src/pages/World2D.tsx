import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import { loadPlotAssets, createDoor, checkDoorCollision } from '@world_one/terrain/plot_1/scripts/services/index';
import { createPlot } from '@world_one/terrain/plot_1/scripts/plots_scripts/index';
import type { PlotConfig } from '@world_one/terrain/plot_1/scripts/types/index';
import { useWorldPositionStore } from '@stores/worldPositionStore';

export default function World2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webcamInitializedRef = useRef(false);
  const navigate = useNavigate();
  const { outdoorPosition, setOutdoorPosition, setCurrentScene } = useWorldPositionStore();

  useEffect(() => {
    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!container || !scrollContainer) return;

    // Store scroll container in window for Phaser to access
    (window as { scrollContainer?: HTMLDivElement }).scrollContainer = scrollContainer;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      parent: container,
      width: 10000,
      height: 10000,
      backgroundColor: '#000000',
      audio: {
        disableWebAudio: false, // Enable audio for door sounds
      },
      scene: {
        preload: function(this: Phaser.Scene) {
          // Load plot assets
          loadPlotAssets(this);
        },
        create: function(this: Phaser.Scene) {
          // Create green ground
          const greenGround = this.add.rectangle(5000, 5000, 10000, 10000, 0x218727);
          greenGround.setOrigin(0.5, 0.5);
          greenGround.setDepth(0); // Set ground to lowest depth

          const passportSize = 100;
          const margin = 50;
          
          // Calculate world boundaries (leaving margin for passport)
          const minX = margin + passportSize / 2;
          const maxX = 10000 - margin - passportSize / 2;
          const minY = margin + passportSize / 2;
          const maxY = 10000 - margin - passportSize / 2;

          // Create passport container at stored position
          const passport = this.add.container(outdoorPosition.x, outdoorPosition.y);
          passport.setDepth(1000); // Set passport to highest depth so it's always on top
          
          // Create passport background (100px x 100px)
          const passportBg = this.add.rectangle(0, 0, passportSize, passportSize, 0x333333);
          passportBg.setStrokeStyle(2, 0x666666);
          passport.add(passportBg);

          // Create a sample plot with building
          const plotConfig: PlotConfig = {
            position: { x: 5500, y: 5000 },
            width: 800,
            height: 800,
            shapes: [],
            shapesPositions: [],
            buildingRoofs: [
              {
                image: 'duplex_roof',
                position: { x: 0, y: 0 },
                width: 400,
                height: 300,
                hasDoor: true,
                doorPosition: { x: 0, y: 150 },
                doorImage: '', // No door image yet
                sceneName: 'duplex_indoor'
              }
            ],
            objCollision: [true],
            objSounds: []
          };

          const plot = createPlot(this, plotConfig);
          plot.setDepth(10); // Set plot depth above ground but below passport
          
          // Add door to the plot container
          const door = createDoor(this, {
            position: { x: 5500, y: 5150 },
            width: 60,
            height: 80,
            sceneName: 'duplex_indoor',
            soundKey: 'opening_door'
          });
          door.setDepth(20); // Door above plot

          // Store references for door collision
          (window as { passport?: Phaser.GameObjects.Container; door?: Phaser.GameObjects.Rectangle }).passport = passport;
          (window as { passport?: Phaser.GameObjects.Container; door?: Phaser.GameObjects.Rectangle }).door = door;

          // Movement settings
          const speed = 20;
          const clickSpeed = 15;
          let targetX: number | null = null;
          let targetY: number | null = null;

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

              // Save position to store
              setOutdoorPosition({ x: newX, y: newY });

              // Check door collision
              const doorRef = (window as { door?: Phaser.GameObjects.Rectangle }).door;
              if (doorRef) {
                checkDoorCollision(passport, doorRef, this, (sceneName) => {
                  // Save current scene state
                  setCurrentScene('indoor');
                  // Navigate to inner building scene
                  navigate(`/inner-building/${sceneName}`);
                });
              }

              // Update scroll position to follow passport
              const scrollCont = (window as { scrollContainer?: HTMLDivElement }).scrollContainer;
              if (scrollCont) {
                const scrollX = passport.x - window.innerWidth / 2;
                const scrollY = passport.y - window.innerHeight / 2;
                scrollCont.scrollLeft = scrollX;
                scrollCont.scrollTop = scrollY;
              }

              // Update video position (relative to scroll)
              if (videoRef.current) {
                const scrollX = scrollCont?.scrollLeft || 0;
                const scrollY = scrollCont?.scrollTop || 0;
                const screenX = passport.x - scrollX - passportSize / 2;
                const screenY = passport.y - scrollY - passportSize / 2;
                videoRef.current.style.left = `${screenX}px`;
                videoRef.current.style.top = `${screenY}px`;
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

          // Position camera to center
          this.cameras.main.centerOn(5000, 5000);

          // Initial scroll position to center on passport
          const scrollCont = (window as { scrollContainer?: HTMLDivElement }).scrollContainer;
          if (scrollCont) {
            scrollCont.scrollLeft = 5000 - window.innerWidth / 2;
            scrollCont.scrollTop = 5000 - window.innerHeight / 2;
          }
        }
      }
    };

    const game = new Phaser.Game(config);

    // Initialize webcam (only once)
    const initWebcam = async () => {
      if (webcamInitializedRef.current) return;
      webcamInitializedRef.current = true;

      try {
        const passportSize = 100;
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720, facingMode: 'user' } 
        });
        
        const video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.style.position = 'absolute';
        video.style.width = `${passportSize}px`;
        video.style.height = `${passportSize}px`;
        video.style.objectFit = 'cover';
        video.style.borderRadius = '8px';
        video.style.pointerEvents = 'none';
        video.style.zIndex = '1000';
        
        video.srcObject = stream;
        document.body.appendChild(video);
        videoRef.current = video;

        video.onloadedmetadata = () => {
          video.play();
        };
      } catch (error) {
        console.error('Webcam access failed:', error);
      }
    };

    initWebcam();

    return () => {
      game.destroy(true);
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        videoRef.current.remove();
      }
      delete (window as { scrollContainer?: HTMLDivElement }).scrollContainer;
    };
  }, [navigate, outdoorPosition, setOutdoorPosition, setCurrentScene]);

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
    </div>
  );
}
