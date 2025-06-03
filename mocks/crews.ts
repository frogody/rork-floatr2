export const boatTypes = [
  'Sailboat',
  'Center Console',
  'Motor Yacht',
  'Sport Fisherman',
  'Bowrider',
  'Catamaran',
  'Pontoon',
  'Cabin Cruiser',
  'Trawler',
  'Speedboat'
] as const;

export type BoatType = typeof boatTypes[number];

export interface Crew {
  id: string;
  name: string;
  description: string;
  location: string;
  distance: number;
  photoUrl: string;
  photoUrls: string[];
  tags: string[];
  crewSize: number;
  boatType: BoatType;
  boatLength: number;
  boatCapacity: number;
  bio: string;
}

export interface Match {
  id: string;
  crewId: string;
  matchedAt: string;
  lastMessage?: {
    text: string;
    timestamp: string;
  };
}

export const mockCrews: Crew[] = [
  {
    id: '1',
    name: 'Sunset Sailors',
    description: 'Friendly group looking for weekend raft-ups and sunset cruises',
    location: 'Miami Beach Marina',
    distance: 1.2,
    photoUrl: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop',
    photoUrls: [
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop',
    ],
    tags: ['Sunset Cruises', 'Raft-ups', 'BBQ', 'Drinks'],
    crewSize: 4,
    boatType: 'Sailboat',
    boatLength: 38,
    boatCapacity: 8,
    bio: 'We are a group of friends who love sailing and meeting new people on the water. We usually anchor at the sandbar on weekends and are always up for a raft-up party!',
  },
  // Add more mock crews here as needed
];

export const mockMatches: Match[] = [
  // Add mock matches here as needed
];