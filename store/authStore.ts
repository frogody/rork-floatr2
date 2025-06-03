import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserPreferences {
  ageRange: [number, number];
  maxDistance: number;
  showMe: 'men' | 'women' | 'everyone';
  boatTypes: string[];
  experienceLevel: string[];
  activities: string[];
  onlyVerified: boolean;
  onlyWithBoats: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  bio?: string;
  photos: string[];
  location: string;
  boatType?: string;
  verified: boolean;
  preferences: UserPreferences;
  createdAt: string;
  lastActive: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  resetPassword: (email: string) => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

// Mock user data for development
const mockUser: User = {
  id: '1',
  email: 'demo@floatr.com',
  name: 'Alex Johnson',
  age: 28,
  bio: 'Passionate sailor and ocean lover. Looking for someone to share amazing adventures on the water. Love sunset cruises and discovering hidden coves.',
  photos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face',
  ],
  location: 'Miami, FL',
  boatType: 'Sailing Yacht',
  verified: true,
  preferences: {
    ageRange: [21, 35],
    maxDistance: 25,
    showMe: 'everyone',
    boatTypes: ['Sailing Yacht', 'Motor Yacht', 'Catamaran'],
    experienceLevel: ['Intermediate', 'Advanced'],
    activities: ['Sailing', 'Swimming', 'Sunset Cruises', 'Island Hopping'],
    onlyVerified: false,
    onlyWithBoats: true,
  },
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isInitialized: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock authentication - accept any email/password for demo
          if (email && password) {
            set({ 
              user: mockUser, 
              isAuthenticated: true, 
              isLoading: false,
              isInitialized: true 
            });
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      signup: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newUser: User = {
            ...mockUser,
            ...userData,
            id: Math.random().toString(36).substr(2, 9),
            email: userData.email || '',
            name: userData.name || '',
            age: userData.age || 25,
            photos: userData.photos || [],
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            preferences: {
              ageRange: [21, 35],
              maxDistance: 25,
              showMe: 'everyone',
              boatTypes: [],
              experienceLevel: [],
              activities: [],
              onlyVerified: false,
              onlyWithBoats: true,
              ...userData.preferences,
            },
          };
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false,
            isInitialized: true 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Signup failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Logout failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      updateUser: async (userData: Partial<User>) => {
        const { user } = get();
        if (!user) throw new Error('No user logged in');
        
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedUser: User = {
            ...user,
            ...userData,
            preferences: {
              ...user.preferences,
              ...userData.preferences,
            },
            lastActive: new Date().toISOString(),
          };
          
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Update failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      checkAuth: async () => {
        try {
          // Simulate checking stored auth token
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { user } = get();
          set({ 
            isAuthenticated: !!user,
            isInitialized: true 
          });
        } catch (error) {
          set({ 
            isAuthenticated: false,
            isInitialized: true,
            error: error instanceof Error ? error.message : 'Auth check failed'
          });
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock success
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Password reset failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);