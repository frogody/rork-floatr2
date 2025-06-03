export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  isPremium?: boolean;
}

export interface Boat {
  name: string;
  type: string;
  length: number;
  capacity: number;
  photoUrl?: string;
  verified?: boolean;
}

export interface Crew {
  id: string;
  name: string;
  description: string;
  location: string;
  distance: number;
  photoUrl: string;
  photoUrls?: string[];
  tags: string[];
  crewSize: number;
  boatType: string;
  boatLength: number;
  boatCapacity?: number;
  bio?: string;
  memberCount?: number;
}

export interface Match {
  id: string;
  crewId: string;
  crewName: string;
  location: string;
  matchedAt: Date;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  photoUrl: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'location';
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'match' | 'boost';

export interface FilterOptions {
  distance: number;
  boatTypes: string[];
  crewSize: {
    min: number;
    max: number;
  };
  tags: string[];
}