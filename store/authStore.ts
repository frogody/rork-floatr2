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
        console.log('AuthStore: checkAuth called');
        const { user } = get();
        const isAuthenticated = !!user;
        console.log('AuthStore: checkAuth result', { user: !!user, isAuthenticated });
        
        set({ 
          isAuthenticated,
          isInitialized: true,
          isLoading: false
        });
      },

      signIn: async (userData: User) => {
        console.log('AuthStore: signIn called', userData.email);
        set({ isLoading: true, error: null });
        
        try {
          console.log('AuthStore: Setting user data');
          set({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
            isInitialized: true
          });
          console.log('AuthStore: Sign in successful');
        } catch (error) {
          console.error('AuthStore: Sign in failed', error);
          set({ error: 'Sign in failed', isLoading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string, displayName: string) => {
        console.log('AuthStore: signUp called', email);
        set({ isLoading: true, error: null });
        
        try {
          const newUser: User = {
            id: Math.random().toString(),
            email,
            displayName,
            createdAt: new Date()
          };
          
          console.log('AuthStore: Creating new user');
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
            isInitialized: true,
            isOnboarded: false
          });
          console.log('AuthStore: Sign up successful');
        } catch (error) {
          console.error('AuthStore: Sign up failed', error);
          set({ error: 'Sign up failed', isLoading: false });
          throw error;
        }
      },

      signOut: () => {
        console.log('AuthStore: signOut called');
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
          console.log('AuthStore: updateUser called');
          set({ user: { ...user, ...userData } });
        }
      },

      updateBoat: (boatData: Partial<Boat>) => {
        const { boat } = get();
        if (boat) {
          console.log('AuthStore: updateBoat called');
          set({ boat: { ...boat, ...boatData } });
        }
      },

      setOnboarded: (value: boolean) => {
        console.log('AuthStore: setOnboarded', value);
        set({ isOnboarded: value });
      },

      setHasSeenTutorial: (value: boolean) => {
        console.log('AuthStore: setHasSeenTutorial', value);
        set({ hasSeenTutorial: value });
      },

      blockUser: (userId: string) => {
        const { blockedUsers } = get();
        if (!blockedUsers.includes(userId)) {
          console.log('AuthStore: blockUser', userId);
          set({ blockedUsers: [...blockedUsers, userId] });
        }
      },

      unblockUser: (userId: string) => {
        const { blockedUsers } = get();
        console.log('AuthStore: unblockUser', userId);
        set({ blockedUsers: blockedUsers.filter(id => id !== userId) });
      },

      deleteAccount: async () => {
        console.log('AuthStore: deleteAccount called');
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
          console.error('AuthStore: Delete account failed', error);
          set({ error: 'Failed to delete account', isLoading: false });
          throw error;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        console.log('AuthStore: changePassword called');
        set({ isLoading: true, error: null });
        
        try {
          set({ isLoading: false });
        } catch (error) {
          console.error('AuthStore: Change password failed', error);
          set({ error: 'Failed to change password', isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        console.log('AuthStore: resetPassword called', email);
        set({ isLoading: true, error: null });
        
        try {
          set({ isLoading: false });
        } catch (error) {
          console.error('AuthStore: Reset password failed', error);
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