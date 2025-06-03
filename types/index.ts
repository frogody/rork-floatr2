// Keep all existing types and add unreadCount to Match interface
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
  unreadCount?: number; // Added this property
}

// Rest of the types remain unchanged