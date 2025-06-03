export interface User {
  id: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Boat {
  id: string;
  ownerId: string;
  name: string;
  type: string;
  length: number;
  capacity: number;
  verified: boolean;
  photoUrl?: string;
  createdAt: Date;
}

export interface Crew {
  id: string;
  name: string;
  bio: string;
  location: string;
  distance: number;
  photoUrls: string[];
  tags: string[];
  memberCount: number;
  boatType: string;
  boatLength: number;
  boatCapacity: number;
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
  matchId: string;
  senderId: string;
  content: string;
  sentAt: Date;
}

export type BoostDuration = '1h' | '2h' | '4h' | '24h';

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}