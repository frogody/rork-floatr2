import { Crew, Match } from '@/types';

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
  {
    id: '2',
    name: 'Island Hoppers',
    description: 'Adventure seekers exploring the keys and sandbars',
    location: 'Key Biscayne',
    distance: 3.5,
    photoUrl: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2048&auto=format&fit=crop',
    photoUrls: [
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2048&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2048&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2048&auto=format&fit=crop',
    ],
    tags: ['Island Hopping', 'Snorkeling', 'Music', 'Adventure'],
    crewSize: 6,
    boatType: 'Center Console',
    boatLength: 32,
    boatCapacity: 12,
    bio: 'We love exploring new islands and sandbars every weekend. Always looking for new spots and new friends to join our adventures. Bring your snorkel gear!',
  },
  {
    id: '3',
    name: 'Yacht Life Crew',
    description: 'Luxury yacht enthusiasts hosting weekend parties',
    location: 'Fort Lauderdale',
    distance: 8.7,
    photoUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop',
    photoUrls: [
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop',
    ],
    tags: ['Luxury', 'Parties', 'Champagne', 'Networking'],
    crewSize: 8,
    boatType: 'Motor Yacht',
    boatLength: 65,
    boatCapacity: 20,
    bio: 'Luxury yacht enthusiasts hosting the best parties on the water. We anchor at the hottest spots and always have cold champagne ready. Looking for like-minded boaters to join our weekend gatherings.',
  },
  {
    id: '4',
    name: 'Fishing Fanatics',
    description: 'Passionate anglers looking for fishing buddies',
    location: 'Haulover Inlet',
    distance: 5.3,
    photoUrl: 'https://images.unsplash.com/photo-1564762861003-0e8c17d43c56?q=80&w=2070&auto=format&fit=crop',
    photoUrls: [
      'https://images.unsplash.com/photo-1564762861003-0e8c17d43c56?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564762861003-0e8c17d43c56?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564762861003-0e8c17d43c56?q=80&w=2070&auto=format&fit=crop',
    ],
    tags: ['Fishing', 'Offshore', 'Reef', 'Catch & Release'],
    crewSize: 3,
    boatType: 'Sport Fisherman',
    boatLength: 42,
    boatCapacity: 6,
    bio: 'Serious anglers looking for fishing buddies. We go out every weekend for offshore and reef fishing. Always catch our limit and know all the best spots. Bring your own gear and let\'s catch some big ones!',
  },
  {
    id: '5',
    name: 'Sandbar Squad',
    description: 'Fun-loving group that anchors at the popular sandbars',
    location: 'Nixon Beach',
    distance: 2.1,
    photoUrl: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=2070&auto=format&fit=crop',
    photoUrls: [
      'https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=2070&auto=format&fit=crop',
    ],
    tags: ['Sandbar', 'Swimming', 'Music', 'Games'],
    crewSize: 5,
    boatType: 'Bowrider',
    boatLength: 28,
    boatCapacity: 10,
    bio: 'We\'re all about the sandbar life! We anchor at Nixon Beach every weekend with our floating coolers and waterproof speakers. Looking for fun crews to raft up with and enjoy the day.',
  },
];

export const mockMatches: Match[] = [
  {
    id: 'm1',
    crewId: '1',
    crewName: 'Sunset Sailors',
    location: 'Miami Beach Marina',
    matchedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    lastMessage: {
      content: "We're heading to the sandbar around 2pm, want to join?",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
    photoUrl: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop',
    unreadCount: 2,
  },
  {
    id: 'm2',
    crewId: '3',
    crewName: 'Yacht Life Crew',
    location: 'Fort Lauderdale',
    matchedAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
    lastMessage: {
      content: "Thanks for the invite! We'll bring some extra drinks.",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
    },
    photoUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop',
    unreadCount: 0,
  },
  {
    id: 'm3',
    crewId: '5',
    crewName: 'Sandbar Squad',
    location: 'Nixon Beach',
    matchedAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
    photoUrl: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=2070&auto=format&fit=crop',
    unreadCount: 1,
  },
];