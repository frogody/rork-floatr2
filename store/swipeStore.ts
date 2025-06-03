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
    console.log('SwipeStore: fetchCrews called');
    set({ isLoading: true, error: null });
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('SwipeStore: Mock crews available:', mockCrews?.length || 0);
      
      // Use mock data for now
      if (mockCrews && mockCrews.length > 0) {
        console.log('SwipeStore: Setting crews data');
        set({ 
          crews: mockCrews, 
          currentIndex: 0,
          isLoading: false,
          error: null,
        });
      } else {
        console.log('SwipeStore: No crews available');
        set({ 
          crews: [],
          currentIndex: 0,
          isLoading: false,
          error: 'No crews available in your area',
        });
      }
    } catch (error) {
      console.error('SwipeStore: Failed to fetch crews:', error);
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
    console.log('SwipeStore: likeCrewAtIndex', index, crews.length);
    
    if (index >= crews.length) {
      console.log('SwipeStore: Index out of bounds');
      return;
    }
    
    const crewId = crews[index].id;
    console.log('SwipeStore: Liking crew', crewId);
    
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
    console.log('SwipeStore: dislikeCrewAtIndex', index, crews.length);
    
    if (index >= crews.length) {
      console.log('SwipeStore: Index out of bounds');
      return;
    }
    
    const crewId = crews[index].id;
    console.log('SwipeStore: Disliking crew', crewId);
    
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
    console.log('SwipeStore: superlikeCrewAtIndex', index, crews.length);
    
    if (index >= crews.length) {
      console.log('SwipeStore: Index out of bounds');
      return;
    }
    
    const crewId = crews[index].id;
    console.log('SwipeStore: Superliking crew', crewId);
    
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
    console.log('SwipeStore: undoLastAction', lastAction, currentIndex);
    
    if (!lastAction.type || !lastAction.crewId || currentIndex <= 0) {
      console.log('SwipeStore: Cannot undo - no valid last action');
      return;
    }
    
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
    console.log('SwipeStore: resetSwipes');
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