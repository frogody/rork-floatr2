import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Boat } from '@/types';
import { logger } from '@/utils/logger';
import { errorReporting } from '@/utils/errorReporting';

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
          logger.debug('AuthStore: checkAuth called');
          const state = get();
          const isAuthenticated = !!state.user;
          
          logger.info('AuthStore: checkAuth result', { 
            hasUser: !!state.user, 
            isAuthenticated,
            userId: state.user?.id 
          });
          
          set({ 
            isAuthenticated,
            isInitialized: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          logger.error('AuthStore: checkAuth failed', { error: error.message });
          errorReporting.captureError(error, 'error', { context: 'auth_check' });
          
          set({ 
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
            error: 'Failed to check authentication status'
          });
        }
      },

      signIn: async (userData: User) => {
        logger.info('AuthStore: signIn called', { email: userData.email });
        set({ isLoading: true, error: null });
        
        try {
          if (!userData || !userData.email) {
            throw new Error('Invalid user data provided');
          }

          logger.debug('AuthStore: Setting user data');
          set({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
            isInitialized: true
          });
          
          logger.info('AuthStore: Sign in successful', { userId: userData.id });
        } catch (error) {
          logger.error('AuthStore: Sign in failed', { error: error.message });
          errorReporting.captureError(error, 'error', { 
            context: 'sign_in',
            email: userData?.email 
          });
          
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
        logger.info('AuthStore: signUp called', { email });
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
          
          logger.debug('AuthStore: Creating new user');
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
            isInitialized: true,
            isOnboarded: false
          });
          
          logger.info('AuthStore: Sign up successful', { userId: newUser.id });
        } catch (error) {
          logger.error('AuthStore: Sign up failed', { error: error.message });
          errorReporting.captureError(error, 'error', { 
            context: 'sign_up',
            email 
          });
          
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
          logger.info('AuthStore: signOut called');
          set({
            user: null,
            boat: null,
            isAuthenticated: false,
            error: null,
            isInitialized: true,
            isLoading: false
          });
          logger.info('AuthStore: Sign out successful');
        } catch (error) {
          logger.error('AuthStore: Sign out failed', { error: error.message });
          errorReporting.captureError(error, 'error', { context: 'sign_out' });
        }
      },

      updateUser: (userData: Partial<User>) => {
        try {
          const { user } = get();
          if (!user) {
            throw new Error('No user to update');
          }
          
          logger.info('AuthStore: updateUser called');
          set({ user: { ...user, ...userData } });
        } catch (error) {
          logger.error('AuthStore: updateUser failed', { error: error.message });
          errorReporting.captureError(error, 'error', { context: 'update_user' });
          set({ error: 'Failed to update user profile' });
        }
      },

      updateBoat: (boatData: Partial<Boat>) => {
        try {
          const { boat } = get();
          if (!boat) {
            logger.warn('AuthStore: No boat to update, creating new boat data');
            set({ boat: boatData as Boat });
            return;
          }
          
          logger.info('AuthStore: updateBoat called');
          set({ boat: { ...boat, ...boatData } });
        } catch (error) {
          logger.error('AuthStore: updateBoat failed', { error: error.message });
          errorReporting.captureError(error, 'error', { context: 'update_boat' });
          set({ error: 'Failed to update boat information' });
        }
      },

      setOnboarded: (value: boolean) => {
        try {
          logger.info('AuthStore: setOnboarded', { value });
          set({ isOnboarded: value });
        } catch (error) {
          logger.error('AuthStore: setOnboarded failed', { error: error.message });
          errorReporting.captureError(error, 'error', { context: 'set_onboarded' });
        }
      },

      setHasSeenTutorial: (value: boolean) => {
        try {
          logger.info('AuthStore: setHasSeenTutorial', { value });
          set({ hasSeenTutorial: value });
        } catch (error) {
          logger.error('AuthStore: setHasSeenTutorial failed', { error: error.message });
          errorReporting.captureError(error, 'error', { context: 'set_tutorial' });
        }
      },

      blockUser: (userId: string) => {
        try {
          const { blockedUsers } = get();
          if (!blockedUsers.includes(userId)) {
            logger.info('AuthStore: blockUser', { userId });
            set({ blockedUsers: [...blockedUsers, userId] });
          }
        } catch (error) {
          logger.error('AuthStore: blockUser failed', { error: error.message });
          errorReporting.captureError(error, 'error', { context: 'block_user' });
          set({ error: 'Failed to block user' });
        }
      },

      unblockUser: (userId: string) => {
        try {
          const { blockedUsers } = get();
          logger.info('AuthStore: unblockUser', { userId });
          set({ blockedUsers: blockedUsers.filter(id => id !== userId) });
        } catch (error) {
          logger.error('AuthStore: unblockUser failed', { error: error.message });
          errorReporting.captureError(error, 'error', { context: 'unblock_user' });
          set({ error: 'Failed to unblock user' });
        }
      },

      deleteAccount: async () => {
        logger.info('AuthStore: deleteAccount called');
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
          logger.info('AuthStore: Account deleted successfully');
        } catch (error) {
          logger.error('AuthStore: Delete account failed', { error: error.message });
          errorReporting.captureError(error, 'error', { context: 'delete_account' });
          set({ error: 'Failed to delete account', isLoading: false });
          throw error;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        logger.info('AuthStore: changePassword called');
        set({ isLoading: true, error: null });
        
        try {
          if (!currentPassword || !newPassword) {
            throw new Error('Both current and new passwords are required');
          }
          
          // In a real app, you would validate the current password and update it
          set({ isLoading: false });
          logger.info('AuthStore: Password changed successfully');
        } catch (error) {
          logger.error('AuthStore: Change password failed', { error: error.message });
          errorReporting.captureError(error, 'error', { context: 'change_password' });
          set({ error: 'Failed to change password', isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        logger.info('AuthStore: resetPassword called', { email });
        set({ isLoading: true, error: null });
        
        try {
          if (!email) {
            throw new Error('Email is required');
          }
          
          // In a real app, you would send a password reset email
          set({ isLoading: false });
          logger.info('AuthStore: Password reset email sent');
        } catch (error) {
          logger.error('AuthStore: Reset password failed', { error: error.message });
          errorReporting.captureError(error, 'error', { context: 'reset_password' });
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
      onRehydrateStorage: () => (state) => {
        if (state) {
          logger.info('AuthStore: Rehydrated from storage', {
            hasUser: !!state.user,
            isAuthenticated: state.isAuthenticated
          });
        }
      },
    }
  )
);