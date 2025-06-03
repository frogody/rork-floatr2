import { create } from 'zustand';
import { Crew, SwipeAction } from '@/types';
import { mockCrews } from '@/mocks/crews';

interface SwipeState {
  crews: Crew[];
  swipeHistory: SwipeAction[];
  isLoading: boolean;
  error: string | null;
  isAnchored: boolean;
  boostsRemaining: number;
  
  // Actions
  fetchCrews: () => Promise<void>;
  swipeLeft: (crewId: string) => void;
  swipeRight: (crewId: string) => void;
  undoLastSwipe: () => void;
  setAnchor: (anchored: boolean) => void;
  boostProfile: (crewId: string) => void;
  clearHistory: () => void;
}

export const useSwipeStore = create<SwipeState>((set, get) => ({
  crews: [],
  swipeHistory: [],
  isLoading: false,
  error: null,
  isAnchored: false,
  boostsRemaining: 3, // Free users get 3 boosts
  
  fetchCrews: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter out crews that have been swiped on
      const swipedCrewIds = get().swipeHistory.map(action => action.crewId);
      const availableCrews = mockCrews.filter(crew => !swipedCrewIds.includes(crew.id));
      
      set({ crews: availableCrews, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load crews', isLoading: false });
    }
  },
  
  swipeLeft: (crewId) => {
    const swipeAction: SwipeAction = {
      id: Math.random().toString(36).substring(7),
      crewId,
      action: 'pass',
      timestamp: new Date(),
    };
    
    set(state => ({
      swipeHistory: [...state.swipeHistory, swipeAction],
    }));
  },
  
  swipeRight: (crewId) => {
    const swipeAction: SwipeAction = {
      id: Math.random().toString(36).substring(7),
      crewId,
      action: 'like',
      timestamp: new Date(),
    };
    
    set(state => ({
      swipeHistory: [...state.swipeHistory, swipeAction],
    }));
  },
  
  undoLastSwipe: () => {
    set(state => {
      if (state.swipeHistory.length === 0) return state;
      
      const newHistory = [...state.swipeHistory];
      newHistory.pop();
      
      return { swipeHistory: newHistory };
    });
  },
  
  setAnchor: (anchored) => {
    set({ isAnchored: anchored });
  },
  
  boostProfile: (crewId) => {
    set(state => {
      if (state.boostsRemaining <= 0) return state;
      
      const swipeAction: SwipeAction = {
        id: Math.random().toString(36).substring(7),
        crewId,
        action: 'boost',
        timestamp: new Date(),
      };
      
      return {
        swipeHistory: [...state.swipeHistory, swipeAction],
        boostsRemaining: state.boostsRemaining - 1,
      };
    });
  },
  
  clearHistory: () => {
    set({ swipeHistory: [] });
  },
}));