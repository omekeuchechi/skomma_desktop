import Phaser from 'phaser';

export const AVAILABLE_SOUNDS = {
  opening_door: 'opening_door.mp3',
  wall_hit: 'wall_hit.mp3',
};

export function loadWorldSounds(scene: Phaser.Scene): void {
  // For now, we'll create placeholder sounds using Phaser's audio system
  // In production, you would have actual audio files in your assets folder
  Object.entries(AVAILABLE_SOUNDS).forEach(([key, filename]) => {
    // Placeholder - in production, use:
    // scene.load.audio(key, `/assets/sounds/${filename}`);
    console.log(`[Audio] Would load sound: ${key} from ${filename}`);
  });
}

// Helper function to play sound with fallback
export function playSoundWithFallback(scene: Phaser.Scene, soundKey: string, volume: number = 0.5): void {
  try {
    if (scene.sound.get(soundKey)) {
      scene.sound.play(soundKey, { volume });
    } else {
      console.log(`[Audio] Sound ${soundKey} not loaded, skipping`);
    }
  } catch (error) {
    console.log(`[Audio] Failed to play sound ${soundKey}:`, error);
  }
}

