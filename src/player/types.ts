import type { PlayerInput } from '@engine/PlayerManager';

export interface PlayerSnapshot {
  id: string;
  x: number;
  y: number;
  z: number;
}

export type MovementInput = Pick<PlayerInput, 'forward' | 'backward' | 'left' | 'right' | 'sprint'>;

export const DEFAULT_MOVEMENT_INPUT: MovementInput = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  sprint: false,
};
