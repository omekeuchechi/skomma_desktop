import { invoke } from '@tauri-apps/api/core';

export interface WebcamFrame {
  data: Uint8Array;
  width: number;
  height: number;
}

export async function processWebcamFrame(frameData: Uint8Array, width: number, height: number): Promise<Uint8Array> {
  try {
    const result = await invoke<number[]>('process_webcam_frame', {
      frameData: Array.from(frameData),
      width,
      height,
    });
    return new Uint8Array(result);
  } catch (error) {
    console.error('Failed to process webcam frame in Rust:', error);
    // Fallback: return original frame data
    return frameData;
  }
}
