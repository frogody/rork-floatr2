import { create } from 'zustand';
import { Crew } from '@/mocks/crews';
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
      // In a real app, this would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Shuffle the crews for variety in matching
      const shuffledCrews = [...mockCrews].sort(() => Math.random() - 0.5);
      
      set({ 
        crews: shuffledCrews, 
        currentIndex: 0,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch crews', 
        isLoading: false 
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
    });
  },
  
  clearError: () => {
    set({ error: null });
  },
}));