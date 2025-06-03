import { create } from 'zustand';
import { Crew } from '@/types';
import { mockCrews } from '@/mocks/crews';

interface SwipeState {
  crews: Crew[];
  currentIndex: number;
  swipedCrews: Set<string>;
  likedCrews: Set<string>;
  swipeHistory: string[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCrews: () => Promise<void>;
  swipeLeft: (crewId: string) => void;
  swipeRight: (crewId: string) => void;
  undoLastSwipe: () => void;
  resetSwipes: () => void;
  setAnchor: (value: boolean) => void;
  isAnchored: boolean;
}

export const useSwipeStore = create<SwipeState>((set, get) => ({
  crews: [],
  currentIndex: 0,
  swipedCrews: new Set<string>(),
  likedCrews: new Set<string>(),
  swipeHistory: [],
  isLoading: false,
  error: null,
  isAnchored: false,
  
  fetchCrews: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data for now
      set({ 
        crews: mockCrews, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch crews', 
        isLoading: false 
      });
    }
  },
  
  swipeLeft: (crewId: string) => {
    const { swipedCrews, currentIndex, crews, swipeHistory } = get();
    const newSwiped = new Set(swipedCrews);
    newSwiped.add(crewId);
    
    set({ 
      swipedCrews: newSwiped,
      currentIndex: Math.min(currentIndex + 1, crews.length - 1),
      swipeHistory: [...swipeHistory, crewId]
    });
  },
  
  swipeRight: (crewId: string) => {
    const { swipedCrews, likedCrews, currentIndex, crews, swipeHistory } = get();
    const newSwiped = new Set(swipedCrews);
    const newLiked = new Set(likedCrews);
    
    newSwiped.add(crewId);
    newLiked.add(crewId);
    
    set({ 
      swipedCrews: newSwiped,
      likedCrews: newLiked,
      currentIndex: Math.min(currentIndex + 1, crews.length - 1),
      swipeHistory: [...swipeHistory, crewId]
    });
  },
  
  undoLastSwipe: () => {
    const { swipeHistory, swipedCrews, likedCrews, currentIndex } = get();
    
    if (swipeHistory.length === 0) return;
    
    const lastSwipedId = swipeHistory[swipeHistory.length - 1];
    const newSwiped = new Set(swipedCrews);
    const newLiked = new Set(likedCrews);
    const newHistory = swipeHistory.slice(0, -1);
    
    newSwiped.delete(lastSwipedId);
    newLiked.delete(lastSwipedId);
    
    set({
      swipedCrews: newSwiped,
      likedCrews: newLiked,
      swipeHistory: newHistory,
      currentIndex: Math.max(currentIndex - 1, 0)
    });
  },
  
  resetSwipes: () => {
    set({ 
      swipedCrews: new Set(),
      likedCrews: new Set(),
      swipeHistory: [],
      currentIndex: 0
    });
  },
  
  setAnchor: (value: boolean) => {
    set({ isAnchored: value });
  },
}));