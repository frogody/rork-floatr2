import { create } from 'zustand';
import { Crew } from '@/types';
import { mockCrews } from '@/mocks/crews';

interface SwipeState {
  crews: Crew[];
  currentIndex: number;
  likedCrews: string[];
  dislikedCrews: string[];
  superlikedCrews: string[];
  lastAction: {
    type: 'like' | 'dislike' | 'superlike' | null;
    crewId: string | null;
  };
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCrews: () => Promise<void>;
  likeCrewAtIndex: (index: number) => void;
  dislikeCrewAtIndex: (index: number) => void;
  superlikeCrewAtIndex: (index: number) => void;
  undoLastAction: () => void;
  resetSwipes: () => void;
  clearError: () => void;
}

export const useSwipeStore = create<SwipeState>((set, get) => ({
  crews: [],
  currentIndex: 0,
  likedCrews: [],
  dislikedCrews: [],
  superlikedCrews: [],
  lastAction: {
    type: null,
    crewId: null,
  },
  isLoading: false,
  error: null,
  
  fetchCrews: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for now
      if (mockCrews && mockCrews.length > 0) {
        set({ 
          crews: mockCrews, 
          currentIndex: 0,
          isLoading: false,
          error: null,
        });
      } else {
        set({ 
          crews: [],
          currentIndex: 0,
          isLoading: false,
          error: 'No crews available in your area',
        });
      }
    } catch (error) {
      console.error('Failed to fetch crews:', error);
      set({ 
        error: 'Failed to load crews. Please try again.', 
        isLoading: false,
        crews: [],
        currentIndex: 0,
      });
    }
  },
  
  likeCrewAtIndex: (index: number) => {
    const { crews } = get();
    if (index >= crews.length) return;
    
    const crewId = crews[index].id;
    
    set(state => ({
      likedCrews: [...state.likedCrews, crewId],
      currentIndex: state.currentIndex + 1,
      lastAction: {
        type: 'like',
        crewId,
      },
    }));
  },
  
  dislikeCrewAtIndex: (index: number) => {
    const { crews } = get();
    if (index >= crews.length) return;
    
    const crewId = crews[index].id;
    
    set(state => ({
      dislikedCrews: [...state.dislikedCrews, crewId],
      currentIndex: state.currentIndex + 1,
      lastAction: {
        type: 'dislike',
        crewId,
      },
    }));
  },
  
  superlikeCrewAtIndex: (index: number) => {
    const { crews } = get();
    if (index >= crews.length) return;
    
    const crewId = crews[index].id;
    
    set(state => ({
      superlikedCrews: [...state.superlikedCrews, crewId],
      currentIndex: state.currentIndex + 1,
      lastAction: {
        type: 'superlike',
        crewId,
      },
    }));
  },
  
  undoLastAction: () => {
    const { lastAction, currentIndex } = get();
    if (!lastAction.type || !lastAction.crewId || currentIndex <= 0) return;
    
    set(state => {
      const newState = { ...state, currentIndex: state.currentIndex - 1 };
      
      switch (lastAction.type) {
        case 'like':
          newState.likedCrews = state.likedCrews.filter(id => id !== lastAction.crewId);
          break;
        case 'dislike':
          newState.dislikedCrews = state.dislikedCrews.filter(id => id !== lastAction.crewId);
          break;
        case 'superlike':
          newState.superlikedCrews = state.superlikedCrews.filter(id => id !== lastAction.crewId);
          break;
      }
      
      newState.lastAction = { type: null, crewId: null };
      return newState;
    });
  },
  
  resetSwipes: () => {
    set({
      currentIndex: 0,
      likedCrews: [],
      dislikedCrews: [],
      superlikedCrews: [],
      lastAction: {
        type: null,
        crewId: null,
      },
      error: null,
    });
  },
  
  clearError: () => {
    set({ error: null });
  },
}));