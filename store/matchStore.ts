import { create } from 'zustand';
import { Match, Message } from '@/types';
import { mockMatches } from '@/mocks/crews';

interface MatchState {
  matches: Match[];
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchMatches: () => Promise<void>;
  fetchMessages: (matchId: string) => Promise<void>;
  sendMessage: (matchId: string, content: string) => Promise<void>;
  clearError: () => void;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  messages: {},
  isLoading: false,
  error: null,
  
  fetchMatches: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data for now
      set({ 
        matches: mockMatches || [], 
        isLoading: false 
      });
    } catch (error) {
      console.error('MatchStore: Failed to fetch matches', error);
      set({ 
        error: 'Failed to fetch matches', 
        isLoading: false 
      });
    }
  },
  
  fetchMessages: async (matchId: string) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock messages
      const mockMessages: Message[] = [
        {
          id: '1',
          matchId,
          senderId: 'other',
          content: 'Hey there! We noticed your boat nearby.',
          sentAt: new Date(Date.now() - 3600000),
        },
        {
          id: '2',
          matchId,
          senderId: 'me',
          content: "Hi! Yes, we're anchored at the south cove.",
          sentAt: new Date(Date.now() - 3000000),
        },
        {
          id: '3',
          matchId,
          senderId: 'other',
          content: "We're heading that way. Mind if we raft up?",
          sentAt: new Date(Date.now() - 2400000),
        },
        {
          id: '4',
          matchId,
          senderId: 'me',
          content: 'Not at all! We have plenty of space.',
          sentAt: new Date(Date.now() - 1800000),
        },
      ];
      
      set(state => ({ 
        messages: { 
          ...state.messages, 
          [matchId]: mockMessages 
        }, 
        isLoading: false 
      }));
    } catch (error) {
      console.error('MatchStore: Failed to fetch messages', error);
      set({ 
        error: 'Failed to fetch messages', 
        isLoading: false 
      });
    }
  },
  
  sendMessage: async (matchId: string, content: string) => {
    try {
      if (!matchId || !content) {
        throw new Error('Match ID and content are required');
      }

      // In a real app, this would send to an API
      const newMessage: Message = {
        id: Math.random().toString(),
        matchId,
        senderId: 'me',
        content,
        sentAt: new Date(),
      };
      
      // Optimistically update UI
      set(state => {
        const currentMessages = state.messages[matchId] || [];
        return {
          messages: {
            ...state.messages,
            [matchId]: [...currentMessages, newMessage],
          },
        };
      });
      
      // Update the last message in matches
      set(state => {
        const updatedMatches = state.matches.map(match => {
          if (match.id === matchId) {
            return {
              ...match,
              lastMessage: {
                content,
                timestamp: new Date(),
              },
            };
          }
          return match;
        });
        
        return { matches: updatedMatches };
      });
      
    } catch (error) {
      console.error('MatchStore: Failed to send message', error);
      set({ error: 'Failed to send message' });
    }
  },
  
  clearError: () => {
    try {
      set({ error: null });
    } catch (error) {
      console.error('MatchStore: Error in clearError', error);
    }
  },
}));