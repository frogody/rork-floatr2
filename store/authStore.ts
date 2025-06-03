import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Boat } from '@/types';

interface SignUpParams {
  email: string;
  password: string;
  displayName: string;
}

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
  checkAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: SignUpParams) => Promise<void>;
  signOut: () => Promise<void>;
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
  refreshUser: () => Promise<void>;
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
      
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const { user } = get();
          // Simulate auth check delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({ 
            isAuthenticated: !!user,
            isLoading: false,
            isInitialized: true
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ 
            error: 'Authentication check failed',
            isLoading: false,
            isInitialized: true,
            isAuthenticated: false,
            user: null,
          });
        }
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Basic email validation
          if (!email.includes('@')) {
            throw new Error('Invalid email format');
          }
          
          if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
          }
          
          const newUser: User = {
            id: `user_${Date.now()}`,
            email: email.toLowerCase().trim(),
            displayName: email.split('@')[0],
            createdAt: new Date(),
            lastActive: new Date(),
          };
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      signUp: async ({ email, password, displayName }: SignUpParams) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1200));
          
          // Validation
          if (!email.includes('@')) {
            throw new Error('Invalid email format');
          }
          
          if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
          }
          
          if (displayName.trim().length < 2) {
            throw new Error('Display name must be at least 2 characters');
          }
          
          const newUser: User = {
            id: `user_${Date.now()}`,
            email: email.toLowerCase().trim(),
            displayName: displayName.trim(),
            createdAt: new Date(),
            lastActive: new Date(),
          };
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set({
            user: null,
            boat: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            isOnboarded: false,
          });
        } catch (error) {
          console.error('Sign out error:', error);
          // Force sign out even if API fails
          set({
            user: null,
            boat: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { 
            ...user, 
            ...userData,
            lastActive: new Date(),
          };
          set({ user: updatedUser });
        }
      },

      updateBoat: (boatData: Partial<Boat>) => {
        const { boat } = get();
        const updatedBoat = boat ? { ...boat, ...boatData } : boatData as Boat;
        set({ boat: updatedBoat });
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
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({
            user: null,
            boat: null,
            isAuthenticated: false,
            isLoading: false,
            isOnboarded: false,
            hasSeenTutorial: false,
            blockedUsers: [],
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete account';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          if (newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters');
          }
          
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 600));
          
          if (!email.includes('@')) {
            throw new Error('Invalid email format');
          }
          
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      refreshUser: async () => {
        const { user } = get();
        if (!user) return;
        
        try {
          // Simulate API call to refresh user data
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const updatedUser = {
            ...user,
            lastActive: new Date(),
          };
          
          set({ user: updatedUser });
        } catch (error) {
          console.error('Failed to refresh user:', error);
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
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true;
          state.isLoading = false;
        }
      },
    }
  )
);