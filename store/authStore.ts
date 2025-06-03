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
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateBoat: (boatData: Partial<Boat>) => void;
  setOnboarded: (value: boolean) => void;
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
      
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Mock authentication for now
          // In a real app, this would call an API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const user: User = {
            id: '1',
            displayName: 'John Doe',
            bio: 'Passionate boater looking for adventure',
            avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000',
            createdAt: new Date(),
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Invalid email or password', 
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
            id: '1',
            displayName,
            createdAt: new Date(),
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
          isAuthenticated: false 
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
            id: Math.random().toString(36).substring(7),
            ownerId: get().user?.id || '',
            name: boatData.name || 'My Boat',
            type: boatData.type || 'Other',
            length: boatData.length || 0,
            capacity: boatData.capacity || 0,
            verified: false,
            createdAt: new Date(),
            ...boatData,
          };
          set({ boat: newBoat });
        }
      },
      
      setOnboarded: (value) => {
        set({ isOnboarded: value });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'floatr-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);