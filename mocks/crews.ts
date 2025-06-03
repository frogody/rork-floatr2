import { Crew } from '@/types';

export const mockCrews: Crew[] = [
  {
    id: '1',
    name: 'Ocean Explorers',
    description: 'We love exploring hidden coves and snorkeling in crystal clear waters. Our crew is all about adventure and discovering new spots along the coast.',
    location: 'Marina Bay',
    distance: 2.3,
    photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2340&auto=format&fit=crop',
    photoUrls: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2340&auto=format&fit=crop'
    ],
    tags: ['Adventure', 'Snorkeling', 'Exploration'],
    crewSize: 4,
    boatType: 'Sailboat',
    boatLength: 32,
  },
  {
    id: '2',
    name: 'Sunset Sailors',
    description: 'Join us for peaceful evening sails and breathtaking sunsets. We enjoy wine, good conversation, and the serenity of being on the water.',
    location: 'Harbor Point',
    distance: 1.8,
    photoUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2340&auto=format&fit=crop',
    photoUrls: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2340&auto=format&fit=crop'
    ],
    tags: ['Relaxing', 'Sunset', 'Wine'],
    crewSize: 2,
    boatType: 'Yacht',
    boatLength: 45,
  },
  {
    id: '3',
    name: 'Fishing Fanatics',
    description: 'Early morning fishing trips and sharing the best spots. We are serious about our fishing but also love to have fun and share stories.',
    location: 'Deep Water Dock',
    distance: 4.1,
    photoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2340&auto=format&fit=crop',
    photoUrls: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2340&auto=format&fit=crop'
    ],
    tags: ['Fishing', 'Early Bird', 'Stories'],
    crewSize: 3,
    boatType: 'Sport Fisher',
    boatLength: 28,
  },
  {
    id: '4',
    name: 'Party Crew',
    description: 'Weekend party boat with great music, dancing, and fun people. We love to celebrate life on the water with good vibes and great energy.',
    location: 'Party Cove',
    distance: 3.7,
    photoUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2340&auto=format&fit=crop',
    photoUrls: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527519135413-1e146b552e10?q=80&w=2340&auto=format&fit=crop'
    ],
    tags: ['Party', 'Music', 'Dancing'],
    crewSize: 8,
    boatType: 'Pontoon',
    boatLength: 24,
  },
  {
    id: '5',
    name: 'Island Hoppers',
    description: 'We specialize in island hopping adventures, beach picnics, and exploring remote locations. Perfect for those who love discovery and beach life.',
    location: 'Island Marina',
    distance: 5.2,
    photoUrl: 'https://images.unsplash.com/photo-1527519135413-1e146b552e10?q=80&w=2340&auto=format&fit=crop',
    photoUrls: [
      'https://images.unsplash.com/photo-1527519135413-1e146b552e10?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2340&auto=format&fit=crop'
    ],
    tags: ['Island Hopping', 'Beach', 'Picnic'],
    crewSize: 6,
    boatType: 'Catamaran',
    boatLength: 38,
  },
];