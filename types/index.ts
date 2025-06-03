export interface User {
  id: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  verified?: boolean;
  isPremium?: boolean;
}

export interface Boat {
  id: string;
  ownerId: string;
  name: string;
  type: string;
  length: number;
  capacity: number;
  photoUrl?: string;
  verified?: boolean;
  createdAt: Date;
}

export interface Crew {
  id: string;
  name: string;
  description: string;
  bio: string;
  photoUrl: string;
  photoUrls: string[];
  location: string;
  distance: number;
  boatType: string;
  boatLength: number;
  boatCapacity: number;
  memberCount: number;
  crewSize: number;
  tags: string[];
  verified?: boolean;
  lastActive?: Date;
}

export interface Match {
  id: string;
  crewId: string;
  crewName: string;
  photoUrl: string;
  location: string;
  matchedAt: Date;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  lastMessageAt?: Date;
  unreadCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  sentAt: Date;
  readAt?: Date;
  type?: 'text' | 'image' | 'location';
}

export interface SwipeAction {
  id: string;
  crewId: string;
  action: 'like' | 'pass' | 'boost';
  timestamp: Date;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
}

export interface Meetup {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  maxAttendees?: number;
  currentAttendees: number;
  tags: string[];
  organizerId: string;
  attendeeIds: string[];
  createdAt: Date;
}