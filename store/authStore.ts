import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Boat } from '@/types';

interface AuthState {
  user: User | null;
  boat: Boat | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  error: string | null;
  hasSeenTutorial: boolean;
  blockedUsers: string[];
  isInitialized: boolean;
  
  // Actions
  checkAuth: () => void;
  signIn: (userData: User) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateBoat: (boatData: Partial<Boat>) => void;
  setOnboarded: (value: boolean) => void;
  setHasSeenTutorial: (value: boolean) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  deleteAccount: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      boat: null,
      isAuthenticated: false,
      isOnboarded: false,
      isLoading: false,
      error: null,
      hasSeenTutorial: false,
      blockedUsers: [],
      isInitialized: false,
      
      checkAuth: () => {
        const { user } = get();
        set({ 
          isAuthenticated: !!user,
          isInitialized: true,
          isLoading: false
        });
      },

      signIn: async (userData: User) => {
        set({ isLoading: true, error: null });
        try {
          set({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
            isInitialized: true
          });
        } catch (error) {
          set({ error: 'Sign in failed', isLoading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string, displayName: string) => {
        set({ isLoading: true, error: null });
        try {
          const newUser: User = {
            id: Math.random().toString(),
            email,
            displayName,
            createdAt: new Date()
          };
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
            isInitialized: true,
            isOnboarded: false
          });
        } catch (error) {
          set({ error: 'Sign up failed', isLoading: false });
          throw error;
        }
      },

      signOut: () => {
        set({
          user: null,
          boat: null,
          isAuthenticated: false,
          error: null,
          isInitialized: true,
          isLoading: false
        });
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },

      updateBoat: (boatData: Partial<Boat>) => {
        const { boat } = get();
        if (boat) {
          set({ boat: { ...boat, ...boatData } });
        }
      },

      setOnboarded: (value: boolean) => {
        set({ isOnboarded: value });
      },

      setHasSeenTutorial: (value: boolean) => {
        set({ hasSeenTutorial: value });
      },

      blockUser: (userId: string) => {
        const { blockedUsers } = get();
        if (!blockedUsers.includes(userId)) {
          set({ blockedUsers: [...blockedUsers, userId] });
        }
      },

      unblockUser: (userId: string) => {
        const { blockedUsers } = get();
        set({ blockedUsers: blockedUsers.filter(id => id !== userId) });
      },

      deleteAccount: async () => {
        set({ isLoading: true, error: null });
        try {
          set({
            user: null,
            boat: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            isInitialized: true
          });
        } catch (error) {
          set({ error: 'Failed to delete account', isLoading: false });
          throw error;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Failed to change password', isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Failed to reset password', isLoading: false });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'floatr-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        boat: state.boat,
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        hasSeenTutorial: state.hasSeenTutorial,
        blockedUsers: state.blockedUsers,
      }),
    }
  )
);