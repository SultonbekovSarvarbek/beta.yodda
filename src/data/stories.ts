import type { Story } from '@/types/social';

export const stories: Story[] = [
  {
    id: 's1',
    tutorId: '1',
    tutorName: 'Sarah Chen',
    tutorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=1200&fit=crop',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    viewed: false,
  },
  {
    id: 's2',
    tutorId: '2',
    tutorName: 'Marcus Johnson',
    tutorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&h=1200&fit=crop',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    viewed: false,
  },
  {
    id: 's3',
    tutorId: '3',
    tutorName: 'Emily Rodriguez',
    tutorPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=1200&fit=crop',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    viewed: true,
  },
  {
    id: 's4',
    tutorId: '4',
    tutorName: 'David Kim',
    tutorPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=1200&fit=crop',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    viewed: false,
  },
  {
    id: 's5',
    tutorId: '5',
    tutorName: 'Aisha Patel',
    tutorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    image: 'https://images.unsplash.com/photo-1522661067900-ab829854a57f?w=800&h=1200&fit=crop',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    viewed: true,
  },
  {
    id: 's6',
    tutorId: '6',
    tutorName: 'Michael O\'Brien',
    tutorPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=1200&fit=crop',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    viewed: false,
  },
  {
    id: 's7',
    tutorId: '7',
    tutorName: 'Sofia Martinez',
    tutorPhoto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=1200&fit=crop',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
    viewed: false,
  },
  {
    id: 's8',
    tutorId: '8',
    tutorName: 'James Wilson',
    tutorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=1200&fit=crop',
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
    viewed: true,
  },
];
