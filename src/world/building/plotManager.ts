import Phaser from 'phaser';
import { loadPlot1Assets, plot_1Config } from '@world_one/terrain/plot_1/scripts/plots_scripts/plot_1.config';
import { createPlot } from '@world_one/terrain/plot_1/scripts/plots_scripts/plot';
import { createPlotDoors, getBuildingExitPosition } from '@world_one/terrain/plot_1/scripts/plots_scripts/doors';
import { checkDoorCollision } from '@world_one/terrain/plot_1/scripts/services/doorService';
import { allPlotConfigs } from '@world_one/terrain/plots/plots.config';
import { PlotConfig } from '@world_one/terrain/plot_1/scripts/types/index';
import { loadPlot2Assets } from '@world_one/terrain/plot_2/config';
import { loadPlot3Assets } from '@world_one/terrain/plot_3/config';
import { loadPlot4Assets } from '@world_one/terrain/plot_4/config';
import { loadPlot5Assets } from '@world_one/terrain/plot_5/config';
import { loadPlot6Assets } from '@world_one/terrain/plot_6/config';
import { loadPlot7Assets } from '@world_one/terrain/plot_7/config';
import { loadPlot8Assets } from '@world_one/terrain/plot_8/config';
import { loadPlot9Assets } from '@world_one/terrain/plot_9/config';
import { loadPlot10Assets } from '@world_one/terrain/plot_10/config';
import { loadPlot11Assets } from '@world_one/terrain/plot_11/config';

/**
 * All plot configurations including plot 1
 */
const allConfigsIncludingPlot1: PlotConfig[] = [
  plot_1Config,
  ...allPlotConfigs,
];

export interface PlotPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlotManagerCallbacks {
  onDoorEnter: (sceneName: string) => void;
  onLoadingStart: () => void;
  onPositionUpdate: (x: number, y: number) => void;
}

export class PlotManager {
  private scene: Phaser.Scene;
  private plots: Phaser.GameObjects.Container[] = [];
  private doors: Phaser.GameObjects.Rectangle[] = [];
  private buildingRoofs: (Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle)[] = [];
  private decorativeObjects: Phaser.GameObjects.GameObject[] = [];
  private fountainObjects: Phaser.GameObjects.GameObject[] = [];
  private activeDoor: Phaser.GameObjects.Rectangle | null = null;
  private wasRoofCollision = false;
  private passport: Phaser.GameObjects.Container;
  private passportSize: number;
  private callbacks: PlotManagerCallbacks;
  private waterfallSound?: any;
  private lastCollisionTime: number = 0;
  private collisionCooldown: number = 500; // 500ms cooldown between collision sounds

  constructor(
    scene: Phaser.Scene,
    passport: Phaser.GameObjects.Container,
    passportSize: number,
    callbacks: PlotManagerCallbacks
  ) {
    this.scene = scene;
    this.passport = passport;
    this.passportSize = passportSize;
    this.callbacks = callbacks;
  }

  /**
   * Load plot assets in the preload phase
   */
  public static preloadAssets(scene: Phaser.Scene): void {
    loadPlot1Assets(scene);
    loadPlot2Assets(scene);
    loadPlot3Assets(scene);
    loadPlot4Assets(scene);
    loadPlot5Assets(scene);
    loadPlot6Assets(scene);
    loadPlot7Assets(scene);
    loadPlot8Assets(scene);
    loadPlot9Assets(scene);
    loadPlot10Assets(scene);
    loadPlot11Assets(scene);

    // Load plot_1 sounds
    scene.load.audio('opening_door', '/world_one/terrain/plot_1/assets/sounds/opening_door.mp3');
    scene.load.audio('wall_hit', '/world_one/terrain/plot_1/assets/sounds/wall_hit.mp3');
    // Load additional sounds
    scene.load.audio('wood_hit', '/world_one/sounds/wood-hit.mp3');
    scene.load.audio('waterfall', '/world_one/sounds/waterfall.mp3');
  }

  /**
   * Create plot and initialize buildings
   */
  public create(): void {
    // --- Plot 1 with buildings ---
    const plot1 = createPlot(this.scene, plot_1Config);
    plot1.setDepth(10);
    this.plots.push(plot1);

    // Store building roofs for collision detection from plot 1
    this.collectBuildingRoofs(plot1);

    // --- Doors from plot 1 ---
    this.doors = createPlotDoors(this.scene, plot_1Config);

    // --- Create additional plots (2-11) ---
    allPlotConfigs.forEach((config: PlotConfig) => {
      const plot = createPlot(this.scene, config);
      plot.setDepth(10);

      // Only add default ground if plot doesn't have a custom groundShape
      if (!config.groundShape) {
        const ground = this.scene.add.rectangle(
          config.position.x,
          config.position.y,
          config.width,
          config.height,
          0x707070 // Gray color for plot ground
        );
        ground.setOrigin(0.5, 0.5);
        ground.setDepth(0);
        plot.add(ground);
      }

      // Store building roofs for collision detection
      this.collectBuildingRoofs(plot);

      // Create doors for this plot
      const plotDoors = createPlotDoors(this.scene, config);
      this.doors.push(...plotDoors);

      this.plots.push(plot);
    });
  }

  /**
   * Collect building roofs from a plot for collision detection
   */
  private collectBuildingRoofs(plot: Phaser.GameObjects.Container): void {
    plot.list.forEach((child: Phaser.GameObjects.GameObject) => {
      if (child instanceof Phaser.GameObjects.Container) {
        child.list.forEach((roofChild: Phaser.GameObjects.GameObject) => {
          // Collect building roofs and invisible collision rectangles
          if (
            roofChild instanceof Phaser.GameObjects.Image ||
            roofChild instanceof Phaser.GameObjects.Rectangle
          ) {
            // Check if this rectangle has collision data
            if (roofChild.getData && roofChild.getData('hasCollision') === true) {
              const objectType = roofChild.getData('objectType');
              if (objectType === 'fountain') {
                this.fountainObjects.push(roofChild);
                this.decorativeObjects.push(roofChild); // Also add to decorative objects for collision blocking
              } else {
                this.decorativeObjects.push(roofChild);
              }
            } else {
              this.buildingRoofs.push(roofChild);
            }
          }
        });
      }
    });
  }

  /**
   * Check roof collision and prevent movement if colliding
   * @param newX - Target X position
   * @param newY - Target Y position
   * @returns true if movement should be blocked
   */
  public checkRoofCollision(newX: number, newY: number): boolean {
    let roofCollision = false;
    const tempBounds = new Phaser.Geom.Rectangle(
      newX - this.passportSize / 2,
      newY - this.passportSize / 2,
      this.passportSize,
      this.passportSize
    );

    // Check building roof collisions
    if (this.buildingRoofs.length > 0) {
      for (const roof of this.buildingRoofs) {
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(tempBounds, roof.getBounds())
        ) {
          roofCollision = true;
          break;
        }
      }
    }

    // Check decorative object collisions
    if (!roofCollision && this.decorativeObjects.length > 0) {
      for (const obj of this.decorativeObjects) {
        try {
          if (
            Phaser.Geom.Intersects.RectangleToRectangle(tempBounds, (obj as any).getBounds())
          ) {
            roofCollision = true;
            break;
          }
        } catch (e) {
          // Skip objects that don't have valid bounds
          continue;
        }
      }
    }

    if (roofCollision) {
      if (!this.wasRoofCollision) {
        const now = this.scene.time.now;
        if (now - this.lastCollisionTime > this.collisionCooldown) {
          this.scene.sound.play('wood_hit', { volume: 0.5 });
          this.lastCollisionTime = now;
        }
      }
      this.wasRoofCollision = true;
    } else {
      this.wasRoofCollision = false;
    }

    return roofCollision;
  }

  /**
   * Update fountain proximity sound based on distance
   * Call this in the update loop
   */
  public updateFountainSound(passportX: number, passportY: number): void {
    if (this.fountainObjects.length === 0) return;

    let closestDistance = Infinity;

    // Find closest fountain (use center-to-center distance)
    for (const fountain of this.fountainObjects) {
      try {
        const fountainBounds = (fountain as any).getBounds();
        const fountainCenterX = fountainBounds.x + fountainBounds.width / 2;
        const fountainCenterY = fountainBounds.y + fountainBounds.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(passportX - fountainCenterX, 2) +
          Math.pow(passportY - fountainCenterY, 2)
        );
        
        if (distance < closestDistance) {
          closestDistance = distance;
        }
      } catch (e) {
        continue;
      }
    }

    // Play or adjust waterfall sound based on distance
    const maxDistance = 800; // Distance at which sound is inaudible
    
    if (closestDistance < maxDistance) {
      // Calculate volume: 1.0 at distance 0, fades to 0.2 at maxDistance
      // Increased to 1.0 for maximum volume when very close
      const volume = Math.max(0.2, 1.0 - (closestDistance / maxDistance));
      
      if (!this.waterfallSound) {
        try {
          this.waterfallSound = this.scene.sound.play('waterfall', { volume, loop: true });
        } catch (e) {
          console.error('Failed to play waterfall sound:', e);
        }
      } else {
        try {
          if ((this.waterfallSound as any).setVolume) {
            (this.waterfallSound as any).setVolume(volume);
          }
        } catch (e) {
          console.error('Failed to set waterfall sound volume:', e);
        }
      }
    } else {
      // Mute the sound instead of stopping it (more reliable)
      if (this.waterfallSound) {
        try {
          if ((this.waterfallSound as any).setVolume) {
            (this.waterfallSound as any).setVolume(0);
          }
        } catch (e) {
          console.error('Failed to mute waterfall sound:', e);
        }
      }
    }
  }

  /**
   * Check door collision and trigger door entry
   * Call this in the update loop
   */
  public checkDoorCollision(): void {
    const passportBounds = this.passport.getBounds();
    let overlappingDoor: Phaser.GameObjects.Rectangle | null = null;
    for (const doorRef of this.doors) {
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

    if (overlappingDoor && overlappingDoor !== this.activeDoor) {
      this.activeDoor = overlappingDoor;

      checkDoorCollision(this.passport, overlappingDoor, this.scene, (sceneName: string) => {
        this.callbacks.onLoadingStart();

        // Find the plot config that contains this scene name
        const config = allConfigsIncludingPlot1.find((plotConfig) =>
          plotConfig.buildingRoofs.some((roof) => roof.sceneName === sceneName)
        );

        if (config) {
          const exitPosition = getBuildingExitPosition(config, sceneName);
          if (exitPosition) {
            this.callbacks.onPositionUpdate(exitPosition.x, exitPosition.y);
          }
        }

        this.callbacks.onDoorEnter(sceneName);
      });
    } else if (!overlappingDoor) {
      this.activeDoor = null;
    }
  }

  /**
   * Get all plot positions for mini-map
   */
  public getPlotPositions(): PlotPosition[] {
    return allConfigsIncludingPlot1.map((config) => ({
      x: config.position.x,
      y: config.position.y,
      width: config.width,
      height: config.height,
    }));
  }

  /**
   * Clean up plot resources
   */
  public destroy(): void {
    this.plots.forEach((plot) => plot.destroy());
    this.plots = [];
    this.doors.forEach((door) => door.destroy());
    this.doors = [];
    this.buildingRoofs = [];
    this.activeDoor = null;
  }
}
