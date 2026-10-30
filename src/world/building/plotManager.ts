import Phaser from 'phaser';
import { loadPlot1Assets, plot_1Config } from '@world_one/terrain/plot_1/scripts/plots_scripts/plot_1.config';
import { createPlot } from '@world_one/terrain/plot_1/scripts/plots_scripts/plot';
import { createPlotDoors, getBuildingExitPosition } from '@world_one/terrain/plot_1/scripts/plots_scripts/doors';
import { checkDoorCollision } from '@world_one/terrain/plot_1/scripts/services/doorService';
import { allPlotConfigs } from '@world_one/terrain/plots/plots.config';

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
  private activeDoor: Phaser.GameObjects.Rectangle | null = null;
  private wasRoofCollision = false;
  private passport: Phaser.GameObjects.Container;
  private passportSize: number;
  private callbacks: PlotManagerCallbacks;

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

    // Load plot_1 sounds
    scene.load.audio('opening_door', '/world_one/terrain/plot_1/assets/sounds/opening_door.mp3');
    scene.load.audio('wall_hit', '/world_one/terrain/plot_1/assets/sounds/wall_hit.mp3');
  }

  /**
   * Create plot and initialize buildings
   */
  public create(): void {
    console.log('Creating plots...');

    // --- Plot 1 with buildings ---
    const plot1 = createPlot(this.scene, plot_1Config);
    plot1.setDepth(10);
    this.plots.push(plot1);
    console.log('Plot 1 created at:', plot_1Config.position);

    // Store building roofs for collision detection from plot 1
    this.collectBuildingRoofs(plot1);

    // --- Doors from plot 1 ---
    this.doors = createPlotDoors(this.scene, plot_1Config);
    console.log('Plot 1 doors created:', this.doors.length);

    // --- Create additional empty plots (2-11) ---
    allPlotConfigs.forEach((config, index) => {
      const plot = createPlot(this.scene, config);
      plot.setDepth(10);

      // Add a visible ground rectangle for empty plots
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

      this.plots.push(plot);
      console.log(`Plot ${index + 2} created at:`, config.position);
    });

    console.log('Total plots created:', this.plots.length);
  }

  /**
   * Collect building roofs from a plot for collision detection
   */
  private collectBuildingRoofs(plot: Phaser.GameObjects.Container): void {
    plot.list.forEach((child: Phaser.GameObjects.GameObject) => {
      if (child instanceof Phaser.GameObjects.Container) {
        child.list.forEach((roofChild: Phaser.GameObjects.GameObject) => {
          if (
            roofChild instanceof Phaser.GameObjects.Image ||
            roofChild instanceof Phaser.GameObjects.Rectangle
          ) {
            this.buildingRoofs.push(roofChild);
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
    if (this.buildingRoofs.length > 0) {
      const tempBounds = new Phaser.Geom.Rectangle(
        newX - this.passportSize / 2,
        newY - this.passportSize / 2,
        this.passportSize,
        this.passportSize
      );
      for (const roof of this.buildingRoofs) {
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(tempBounds, roof.getBounds())
        ) {
          roofCollision = true;
          break;
        }
      }
    }

    if (roofCollision) {
      if (!this.wasRoofCollision) {
        this.scene.sound.play('wall_hit', { volume: 0.3 });
      }
      this.wasRoofCollision = true;
    } else {
      this.wasRoofCollision = false;
    }

    return roofCollision;
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

        const exitPosition = getBuildingExitPosition(plot_1Config, sceneName);
        if (exitPosition) {
          this.callbacks.onPositionUpdate(exitPosition.x, exitPosition.y);
        }

        this.callbacks.onDoorEnter(sceneName);
      });
    } else if (!overlappingDoor) {
      this.activeDoor = null;
    }
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
