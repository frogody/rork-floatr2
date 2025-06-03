export interface Crew {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  distance: number;
  imageUrl: string;
  tags: string[];
  isActive: boolean;
  lastActive: Date;
}

export const mockCrews: Crew[] = [
  {
    id: '1',
    name: 'Miami Sunset Sailors',
    description: 'Join us for evening sails around Biscayne Bay with stunning sunset views.',
    memberCount: 24,
    distance: 1.2,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    tags: ['Sailing', 'Sunset', 'Social'],
    isActive: true,
    lastActive: new Date(),
  },
  {
    id: '2',
    name: 'Key Largo Fishing Club',
    description: 'Deep sea fishing adventures in the Florida Keys. All skill levels welcome!',
    memberCount: 18,
    distance: 2.8,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400',
    tags: ['Fishing', 'Adventure', 'Keys'],
    isActive: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '3',
    name: 'Coconut Grove Yacht Club',
    description: 'Luxury yacht experiences and networking events in beautiful Coconut Grove.',
    memberCount: 42,
    distance: 0.8,
    imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400',
    tags: ['Luxury', 'Networking', 'Yacht'],
    isActive: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '4',
    name: 'South Beach Speedboat Crew',
    description: 'High-speed thrills and water sports off the coast of South Beach.',
    memberCount: 15,
    distance: 3.5,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    tags: ['Speed', 'Watersports', 'Adrenaline'],
    isActive: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: '5',
    name: 'Everglades Eco Tours',
    description: 'Explore the unique ecosystem of the Everglades by boat. Educational and fun!',
    memberCount: 31,
    distance: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    tags: ['Eco', 'Education', 'Nature'],
    isActive: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
  },
  {
    id: '6',
    name: 'Fort Lauderdale Party Boat',
    description: 'Weekend party cruises with music, drinks, and great vibes!',
    memberCount: 67,
    distance: 5.1,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    tags: ['Party', 'Music', 'Weekend'],
    isActive: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
];