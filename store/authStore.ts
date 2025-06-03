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
  
  // Actions
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
  checkAuth: () => void;
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
      
      signIn: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Mock authentication delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Authentication failed', 
            isLoading: false 
          });
        }
      },
      
      signUp: async (email, password, displayName) => {
        set({ isLoading: true, error: null });
        try {
          // Mock registration
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: Math.random().toString(36).substring(7),
            email,
            displayName,
            isPremium: false,
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Registration failed', 
            isLoading: false 
          });
        }
      },
      
      signOut: () => {
        set({ 
          user: null, 
          boat: null,
          isAuthenticated: false,
          isOnboarded: false,
          hasSeenTutorial: false,
        });
      },
      
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { ...currentUser, ...userData } 
          });
        }
      },
      
      updateBoat: (boatData) => {
        const currentBoat = get().boat;
        if (currentBoat) {
          set({ 
            boat: { ...currentBoat, ...boatData } 
          });
        } else {
          // Create new boat if none exists
          const newBoat: Boat = {
            name: boatData.name || 'My Boat',
            type: boatData.type || 'Other',
            length: boatData.length || 0,
            capacity: boatData.capacity || 0,
            verified: false,
            ...boatData,
          };
          set({ boat: newBoat });
        }
      },
      
      setOnboarded: (value) => {
        set({ isOnboarded: value });
      },
      
      setHasSeenTutorial: (value) => {
        set({ hasSeenTutorial: value });
      },
      
      blockUser: (userId) => {
        const blockedUsers = get().blockedUsers;
        if (!blockedUsers.includes(userId)) {
          set({ blockedUsers: [...blockedUsers, userId] });
        }
      },
      
      unblockUser: (userId) => {
        const blockedUsers = get().blockedUsers;
        set({ blockedUsers: blockedUsers.filter(id => id !== userId) });
      },
      
      deleteAccount: async () => {
        set({ isLoading: true });
        try {
          // Mock account deletion
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ 
            user: null, 
            boat: null,
            isAuthenticated: false,
            isOnboarded: false,
            hasSeenTutorial: false,
            blockedUsers: [],
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Failed to delete account', 
            isLoading: false 
          });
        }
      },
      
      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          // Mock password change
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: 'Failed to change password', 
            isLoading: false 
          });
        }
      },
      
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          // Mock password reset
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: 'Failed to send reset email', 
            isLoading: false 
          });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      checkAuth: () => {
        // This would typically check for a valid token or session
        // For now, we'll just use the persisted state
        const { user } = get();
        set({ isAuthenticated: !!user });
      },
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