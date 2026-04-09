export const BUILDINGS = [
  {
    id: 'b1',
    name: 'I-Block Engineering',
    shortCode: 'I-BLOCK',
    coordinates: { x: 350, y: 400 },
    shape: 'M 300 350 L 500 350 L 500 550 L 300 550 Z', // Block shape
    floors: ['GF', '1F', '2F', '3F'],
    facilities: ['WiFi', 'AC', 'Projectors', 'Labs'],
    accessLevel: 'Students Only',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    occupancy: '75%',
    status: 'high-traffic'
  },
  {
    id: 'b2',
    name: 'Unitedworld Design (UID)',
    shortCode: 'UID',
    coordinates: { x: 700, y: 150 },
    shape: 'M 650 100 L 850 100 L 850 300 L 650 300 Z',
    floors: ['GF', '1F', '2F'],
    facilities: ['Design Studios', '3D Printers', 'Gallery'],
    accessLevel: 'Restricted',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    occupancy: '40%',
    status: 'available'
  },
  {
    id: 'b3',
    name: 'BBA New Campus',
    shortCode: 'BBA',
    coordinates: { x: 400, y: 1300 }, // Positioned in Extended section
    shape: 'M 350 1200 L 550 1200 L 550 1400 L 350 1400 Z',
    floors: ['GF', '1F', '2F', '3F', '4F'],
    facilities: ['Seminar Hall', 'Library', 'Startup Hub'],
    accessLevel: 'Public',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800&q=80',
    occupancy: '20%',
    status: 'available'
  },
  {
    id: 'b4',
    name: 'Faculty Hostels',
    shortCode: 'F-HOSTEL',
    coordinates: { x: 350, y: 750 },
    shape: 'M 300 700 L 450 700 L 450 850 L 300 850 Z',
    floors: ['GF', '1F', '2F', '3F'],
    facilities: ['Residential', 'Dining', 'Garden'],
    accessLevel: 'Restricted',
    image: 'https://images.unsplash.com/photo-1555854817-40e073a0a544?auto=format&fit=crop&w=800&q=80',
    occupancy: '90%',
    status: 'high-traffic'
  }
];

export const ROOMS = {
  'b1': [ // I-Block
    { id: 'I-101', name: 'Lecture Hall 1', floor: '1F', capacity: 60, status: 'Occupied', amenities: ['Projector', 'AC'], bookedBy: 'Intro to AI' },
    { id: 'I-102', name: 'Physics Lab', floor: '1F', capacity: 30, status: 'Available', amenities: ['Lab Equipment', 'WiFi'], nextAvailable: 'Now' },
    { id: 'I-201', name: 'AI/ML Research Lab', floor: '2F', capacity: 25, status: 'Live Event', amenities: ['GPU Servers', 'Projector'], bookedBy: 'CodePulse Hackathon' },
    { id: 'I-301', name: 'Seminar Hall', floor: '3F', capacity: 120, status: 'Occupied', amenities: ['Stage', 'Sound System'], nextAvailable: '4 PM' }
  ],
  'b3': [ // BBA
    { id: 'B-101', name: 'Main Library', floor: 'GF', capacity: 200, status: 'Available', amenities: ['WiFi', 'Quiet Zone'], nextAvailable: 'Now' },
    { id: 'B-201', name: 'Incubation Center', floor: '2F', capacity: 40, status: 'Occupied', amenities: ['Coffee', 'Whiteboards'], bookedBy: 'Pitch Deck Review' }
  ]
};

export const MARKERS = [
  { id: 'm1', type: 'cafeteria', buildingId: 'b1', name: 'Main Cafeteria', coordinates: { x: 420, y: 560 }, status: 'high-traffic', pulseColor: 'red' },
  { id: 'm2', type: 'event', buildingId: 'b1', name: 'CodePulse Hackathon', coordinates: { x: 400, y: 480 }, status: 'live-event', pulseColor: 'orange' },
  { id: 'm3', type: 'shop', buildingId: 'b3', name: 'Morn Brew Cafe', coordinates: { x: 600, y: 1250 }, status: 'available', pulseColor: 'blue' },
  { id: 'm4', type: 'problem', buildingId: 'b4', name: 'AC Leakage Reported', coordinates: { x: 380, y: 800 }, status: 'alert', pulseColor: 'red' }
];

export const FRIEND_LOCATIONS = [
  { studentId: 'f1', name: 'Krish', coordinates: { x: 380, y: 420 }, buildingId: 'b1', floor: '2F', lastUpdated: '2 min ago', avatarColor: 'purple' },
  { studentId: 'f3', name: 'Rahul', coordinates: { x: 720, y: 180 }, buildingId: 'b2', floor: 'GF', lastUpdated: 'Just now', avatarColor: 'blue' }
];
