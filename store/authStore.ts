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
        try {
          const state = get();
          const isAuthenticated = !!state.user;
          
          set({ 
            isAuthenticated,
            isInitialized: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ 
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
            error: 'Failed to check authentication status'
          });
        }
      },

      signIn: async (userData: User) => {
        set({ isLoading: true, error: null });
        
        try {
          if (!userData || !userData.email) {
            throw new Error('Invalid user data provided');
          }

          set({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
            isInitialized: true
          });
        } catch (error) {
          console.error('Sign in failed:', error);
          set({ 
            error: 'Sign in failed. Please try again.', 
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      signUp: async (email: string, password: string, displayName: string) => {
        set({ isLoading: true, error: null });
        
        try {
          if (!email || !password || !displayName) {
            throw new Error('All fields are required');
          }

          const newUser: User = {
            id: `user_${Date.now()}_${Math.random().toString(36).substring(2)}`,
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
          console.error('Sign up failed:', error);
          set({ 
            error: 'Sign up failed. Please try again.', 
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      signOut: () => {
        try {
          set({
            user: null,
            boat: null,
            isAuthenticated: false,
            error: null,
            isInitialized: true,
            isLoading: false
          });
        } catch (error) {
          console.error('Sign out failed:', error);
        }
      },

      updateUser: (userData: Partial<User>) => {
        try {
          const { user } = get();
          if (!user) {
            throw new Error('No user to update');
          }
          
          set({ user: { ...user, ...userData } });
        } catch (error) {
          console.error('Update user failed:', error);
          set({ error: 'Failed to update user profile' });
        }
      },

      updateBoat: (boatData: Partial<Boat>) => {
        try {
          const { boat } = get();
          if (!boat) {
            set({ boat: boatData as Boat });
            return;
          }
          
          set({ boat: { ...boat, ...boatData } });
        } catch (error) {
          console.error('Update boat failed:', error);
          set({ error: 'Failed to update boat information' });
        }
      },

      setOnboarded: (value: boolean) => {
        try {
          set({ isOnboarded: value });
        } catch (error) {
          console.error('Set onboarded failed:', error);
        }
      },

      setHasSeenTutorial: (value: boolean) => {
        try {
          set({ hasSeenTutorial: value });
        } catch (error) {
          console.error('Set tutorial failed:', error);
        }
      },

      blockUser: (userId: string) => {
        try {
          const { blockedUsers } = get();
          if (!blockedUsers.includes(userId)) {
            set({ blockedUsers: [...blockedUsers, userId] });
          }
        } catch (error) {
          console.error('Block user failed:', error);
          set({ error: 'Failed to block user' });
        }
      },

      unblockUser: (userId: string) => {
        try {
          const { blockedUsers } = get();
          set({ blockedUsers: blockedUsers.filter(id => id !== userId) });
        } catch (error) {
          console.error('Unblock user failed:', error);
          set({ error: 'Failed to unblock user' });
        }
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
          console.error('Delete account failed:', error);
          set({ error: 'Failed to delete account', isLoading: false });
          throw error;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        
        try {
          if (!currentPassword || !newPassword) {
            throw new Error('Both current and new passwords are required');
          }
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Change password failed:', error);
          set({ error: 'Failed to change password', isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          if (!email) {
            throw new Error('Email is required');
          }
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Reset password failed:', error);
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