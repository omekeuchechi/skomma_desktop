import Phaser from 'phaser';

/**
 * Asset paths for Plot_1
 */
export const ASSET_PATHS = {
  imgs: '/src/world_one/terrain/plot_1/assets/imgs/',
  sounds: '/src/world_one/terrain/plot_1/assets/sounds/',
};

/**
 * Available images in Plot_1
 */
export const AVAILABLE_IMAGES = {
  duplex_roof: 'duplex_roof.jpg',
  duplex_roof2: 'duplex_roof2.jpg',
  small_building_roof_1: 'small_building_roof_1.jpeg',
  small_building_roof_2: 'small_building_roof_2.jpeg',
  table: 'table.png',
  tiles: 'tiles.jpeg',
};

/**
 * Available sounds in Plot_1
 */
export const AVAILABLE_SOUNDS = {
  opening_door: 'opening_door.mp3',
  wall_hit: 'wall_hit.mp3',
};

/**
 * Load all plot assets into Phaser scene
 */
export function loadPlotAssets(scene: Phaser.Scene): void {
  // Load images
  Object.entries(AVAILABLE_IMAGES).forEach(([key, filename]) => {
    scene.load.image(key, ASSET_PATHS.imgs + filename);
  });

  // Load sounds
  Object.entries(AVAILABLE_SOUNDS).forEach(([key, filename]) => {
    scene.load.audio(key, ASSET_PATHS.sounds + filename);
  });
}

/**
 * Get full path for an image asset
 */
export function getImagePath(imageName: string): string {
  return ASSET_PATHS.imgs + imageName;
}

/**
 * Get full path for a sound asset
 */
export function getSoundPath(soundName: string): string {
  return ASSET_PATHS.sounds + soundName;
}
