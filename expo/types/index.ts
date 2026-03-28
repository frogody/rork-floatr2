export interface User {
  id: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  age?: number;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
  };
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  interests?: string[];
  isVerified?: boolean;
  isPremium?: boolean;
  createdAt: Date;
  lastActive: Date;
  photos?: UserPhoto[];
  preferences: UserPreferences;
}

export interface UserPhoto {
  id: string;
  url: string;
  isMain: boolean;
  order: number;
}

export interface UserPreferences {
  ageRange: [number, number];
  maxDistance: number;
  showMe: 'everyone' | 'men' | 'women';
  boatTypes: string[];
  experienceLevel: string[];
  activities: string[];
  onlyVerified: boolean;
  onlyWithBoats: boolean;
}

export interface Boat {
  id?: string;
  name: string;
  type: string;
  length: number;
  capacity: number;
  photoUrl?: string;
  description?: string;
  features?: string[];
  location?: string;
  ownerId?: string;
}

export interface Crew {
  id: string;
  name: string;
  age: number;
  distance: number;
  bio: string;
  photos: string[];
  boat?: Boat;
  experienceLevel: string;
  interests: string[];
  isOnline: boolean;
  lastActive: Date;
  isVerified?: boolean;
  isPremium?: boolean;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  createdAt: Date;
  isRead: boolean;
  lastMessage?: Message;
  user: Crew;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'location' | 'system';
  timestamp: Date;
  isRead: boolean;
  matchId: string;
}

export interface Meetup {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  date: Date;
  maxParticipants: number;
  currentParticipants: number;
  organizer: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  participants: Array<{
    id: string;
    name: string;
    avatarUrl?: string;
    joinedAt: Date;
  }>;
  category: 'sailing' | 'fishing' | 'swimming' | 'diving' | 'social' | 'racing' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requirements?: string[];
  cost?: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaterConditions {
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  temperature: number;
  waveHeight: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  tideInfo: {
    nextHigh: Date;
    nextLow: Date;
    currentLevel: number;
  };
  weather: {
    condition: string;
    icon: string;
    forecast: Array<{
      date: Date;
      high: number;
      low: number;
      condition: string;
      icon: string;
    }>;
  };
  lastUpdated: Date;
}

export interface PopularSpot {
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  category: 'marina' | 'anchorage' | 'beach' | 'restaurant' | 'fuel' | 'repair' | 'other';
  rating: number;
  reviewCount: number;
  photos: string[];
  amenities: string[];
  contact?: {
    phone?: string;
    website?: string;
    email?: string;
  };
  hours?: {
    [key: string]: string;
  };
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  distance?: number;
}

export interface Notification {
  id: string;
  type: 'match' | 'message' | 'meetup' | 'safety' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface FloatPlan {
  id: string;
  title: string;
  departure: {
    location: string;
    time: Date;
  };
  destination: {
    location: string;
    estimatedArrival: Date;
  };
  route?: Array<{
    latitude: number;
    longitude: number;
    name?: string;
  }>;
  participants: Array<{
    name: string;
    phone?: string;
  }>;
  emergencyContacts: string[];
  boatInfo: {
    name: string;
    type: string;
    registration?: string;
    color?: string;
  };
  safetyEquipment: string[];
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}