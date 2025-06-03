import { create } from 'zustand';

interface SwipeState {
  likes: string[];
  passes: string[];
  handleLike: (id: string) => void;
  handlePass: (id: string) => void;
}

export const useSwipeStore = create<SwipeState>((set) => ({
  likes: [],
  passes: [],
  handleLike: (id: string) =>
    set((state) => ({ likes: [...state.likes, id] })),
  handlePass: (id: string) =>
    set((state) => ({ passes: [...state.passes, id] })),
}));