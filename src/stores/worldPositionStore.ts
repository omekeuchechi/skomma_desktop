import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorldPositionState {
  currentScene: 'outdoor' | 'indoor';
  indoorSceneName: string | null;
  outdoorPosition: { x: number; y: number };
  doorPosition: { x: number; y: number } | null;
  setCurrentScene: (scene: 'outdoor' | 'indoor') => void;
  setIndoorSceneName: (name: string | null) => void;
  setOutdoorPosition: (position: { x: number; y: number }) => void;
  setDoorPosition: (position: { x: number; y: number } | null) => void;
  resetToDefault: () => void;
}

export const useWorldPositionStore = create<WorldPositionState>()(
  persist(
    (set) => ({
      currentScene: 'outdoor',
      indoorSceneName: null,
      outdoorPosition: { x: 5000, y: 5000 },
      doorPosition: null,
      setCurrentScene: (scene) => set({ currentScene: scene }),
      setIndoorSceneName: (name) => set({ indoorSceneName: name }),
      setOutdoorPosition: (position) => set({ outdoorPosition: position }),
      setDoorPosition: (position) => set({ doorPosition: position }),
      resetToDefault: () => set({
        currentScene: 'outdoor',
        indoorSceneName: null,
        outdoorPosition: { x: 5000, y: 5000 },
        doorPosition: null
      })
    }),
    {
      name: 'world-position-storage',
    }
  )
);
