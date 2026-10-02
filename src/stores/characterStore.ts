import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

export interface CharacterPosition {
  x: number;
  y: number;
}

interface CharacterState {
  positions: Record<string, CharacterPosition>;
  setPosition: (userId: string, position: CharacterPosition) => void;
  getPosition: (userId: string) => CharacterPosition;
  resetPosition: (userId: string) => void;
}

const DEFAULT_POSITION: CharacterPosition = {
  x: 100, // Top left side of green ground
  y: 100
};

// User-specific character store
export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      positions: {},
      setPosition: (userId, position) => set((state) => ({
        positions: { ...state.positions, [userId]: position }
      })),
      getPosition: (userId) => {
        const state = get();
        return state.positions[userId] || DEFAULT_POSITION;
      },
      resetPosition: (userId) => set((state) => ({
        positions: { ...state.positions, [userId]: DEFAULT_POSITION }
      })),
    }),
    {
      name: 'skomma-character-positions',
    },
  ),
);

// Hook to get current user's character position
export const useUserCharacterPosition = () => {
  const { user } = useAuthStore();
  const { setPosition, getPosition, resetPosition } = useCharacterStore();
  
  const userId = user?.id || 'guest';
  const currentPosition = getPosition(userId);
  
  const updatePosition = (position: CharacterPosition) => {
    setPosition(userId, position);
  };
  
  const resetCurrentPosition = () => {
    resetPosition(userId);
  };
  
  return { 
    position: currentPosition, 
    setPosition: updatePosition, 
    resetPosition: resetCurrentPosition,
    userId 
  };
};
