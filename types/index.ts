export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  isPremium?: boolean;
  createdAt?: Date;
  lastActive?: Date;
  preferences?: UserPreferences;
  settings?: UserSettings;
  location?: {
    latitude: number;
    longitude: number;
    lastUpdated: Date;
  };
}

export interface UserPreferences {
  maxDistance?: number;
  ageRange?: {
    min: number;
    max: number;
  };
  boatTypes?: string[];
  crewSizes?: {
    min: number;
    max: number;
  };
  activities?: string[];
}

export interface UserSettings {
  notifications: {
    matches: boolean;
    messages: boolean;
    likes: boolean;
    nearbyBoats: boolean;
    marketing: boolean;
  };
  privacy: {
    showDistance: boolean;
    showActivity: boolean;
    showBoatDetails: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface Boat {
  id?: string;
  name: string;
  type: string;
  length: number;
  capacity: number;
  photoUrl?: string;
  photoUrls?: string[];
  verified?: boolean;
  registrationNumber?: string;
  year?: number;
  manufacturer?: string;
  amenities?: string[];
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
  verified?: boolean;
  lastActive?: Date;
  amenities?: string[];
  activities?: string[];
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
  isRead?: boolean;
  isSuperMatch?: boolean;
  unreadCount?: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  isRead?: boolean;
  type?: 'text' | 'image' | 'location' | 'audio';
  metadata?: {
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
    audioUrl?: string;
    duration?: number;
  };
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
  activities?: string[];
  amenities?: string[];
  verified?: boolean;
}

export interface Meetup {
  id: string;
  title: string;
  description: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  date: Date;
  endDate?: Date;
  hostId: string;
  hostName: string;
  hostPhotoUrl: string;
  attendees: {
    id: string;
    name: string;
    photoUrl: string;
  }[];
  maxAttendees?: number;
  isPublic: boolean;
  tags: string[];
  photoUrl?: string;
}

export interface Notification {
  id: string;
  type: 'match' | 'message' | 'like' | 'nearby' | 'meetup' | 'system';
  title: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  data?: {
    matchId?: string;
    crewId?: string;
    messageId?: string;
    meetupId?: string;
    userId?: string;
  };
}

export interface Report {
  id: string;
  reportedUserId: string;
  reporterId: string;
  reason: string;
  details?: string;
  timestamp: Date;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}