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
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
    try {
      const { crews } = get();
      
      if (index >= crews.length || index < 0) {
        return;
      }
      
      const crewId = crews[index]?.id;
      if (!crewId) {
        return;
      }
      
      set(state => ({
        likedCrews: [...state.likedCrews, crewId],
        currentIndex: state.currentIndex + 1,
        lastAction: {
          type: 'like',
          crewId,
        },
      }));
    } catch (error) {
      console.error('Error in likeCrewAtIndex:', error);
    }
  },
  
  dislikeCrewAtIndex: (index: number) => {
    try {
      const { crews } = get();
      
      if (index >= crews.length || index < 0) {
        return;
      }
      
      const crewId = crews[index]?.id;
      if (!crewId) {
        return;
      }
      
      set(state => ({
        dislikedCrews: [...state.dislikedCrews, crewId],
        currentIndex: state.currentIndex + 1,
        lastAction: {
          type: 'dislike',
          crewId,
        },
      }));
    } catch (error) {
      console.error('Error in dislikeCrewAtIndex:', error);
    }
  },
  
  superlikeCrewAtIndex: (index: number) => {
    try {
      const { crews } = get();
      
      if (index >= crews.length || index < 0) {
        return;
      }
      
      const crewId = crews[index]?.id;
      if (!crewId) {
        return;
      }
      
      set(state => ({
        superlikedCrews: [...state.superlikedCrews, crewId],
        currentIndex: state.currentIndex + 1,
        lastAction: {
          type: 'superlike',
          crewId,
        },
      }));
    } catch (error) {
      console.error('Error in superlikeCrewAtIndex:', error);
    }
  },
  
  undoLastAction: () => {
    try {
      const { lastAction, currentIndex } = get();
      
      if (!lastAction.type || !lastAction.crewId || currentIndex <= 0) {
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
    } catch (error) {
      console.error('Error in undoLastAction:', error);
    }
  },
  
  resetSwipes: () => {
    try {
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
    } catch (error) {
      console.error('Error in resetSwipes:', error);
    }
  },
  
  clearError: () => {
    try {
      set({ error: null });
    } catch (error) {
      console.error('Error in clearError:', error);
    }
  },
}));