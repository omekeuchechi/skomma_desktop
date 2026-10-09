/**
 * Barrel file for services
 * Exports all service functions
 */

export { loadPlotAssets, getImagePath, getSoundPath, ASSET_PATHS, AVAILABLE_IMAGES, AVAILABLE_SOUNDS } from './assetLoader';
export { createDoor, checkDoorCollision, getDoorsInContainer } from './doorService';
export type { DoorConfig } from './doorService';
