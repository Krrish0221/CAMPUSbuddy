// UAssist Knowledge & Tool Definitions

export const KNOWLEDGE_BASE = [
  {
    id: 'kb-001',
    content: "KU Library is located in A-Block (East). It is open 24/7 during exam season and 8 AM - 10 PM on weekdays.",
    tags: ['library', 'timing', 'location'],
    language: 'English',
    confidenceThreshold: 0.85
  },
  {
    id: 'kb-002',
    content: "The Student Mess (B-Block) serves lunch from 12 PM to 2:30 PM. Use Caffenity to check live queue status.",
    tags: ['mess', 'food', 'timing'],
    language: 'English',
    confidenceThreshold: 0.9
  },
  {
    id: 'kb-003',
    content: "KU Athletics membership is free for all current students. Registration happens at the Sports Pavilion.",
    tags: ['sports', 'membership'],
    language: 'English',
    confidenceThreshold: 0.8
  }
];

export const TOOL_REGISTRY = {
  ORDER_FOOD: {
    id: 'tool-001',
    name: 'Caffenity Ordering',
    triggers: ['order', 'food', 'coffee', 'brew', 'eat', 'hungry'],
    schema: {
      action: 'ORDER',
      parameters: { canteenId: 'string', item: 'string', eta: 'number' }
    }
  },
  NAVIGATE: {
    id: 'tool-002',
    name: 'Campus Navigation',
    triggers: ['where', 'location', 'find', 'navigate', 'take me to', 'how to reach'],
    schema: {
      action: 'OPEN_MAP',
      parameters: { destination: 'string', buildingId: 'string', floor: 'number' }
    }
  },
  LOCATE_FRIEND: {
    id: 'tool-003',
    name: 'Friend Locator',
    triggers: ['where is', 'find my friend', 'locating'],
    schema: {
       action: 'LOCATE_FRIEND',
       parameters: { friendName: 'string', openMap: true }
    }
  },
  REPORT_ISSUE: {
    id: 'tool-004',
    name: 'ProblemBox Reporter',
    triggers: ['report', 'issue', 'not working', 'leak', 'broken', 'failure', 'sparking'],
    schema: {
      action: 'RAISE_TICKET',
      parameters: { issue: 'string', location: 'string', priority: 'string' }
    }
  },
  ARENA_RSVP: {
    id: 'tool-005',
    name: 'Arena Event RSVP',
    triggers: ['register', 'rsvp', 'join', 'event', 'hackathon'],
    schema: {
       action: 'RSVP_EVENT',
       parameters: { eventId: 'string', friendIds: 'array' }
    }
  }
};

export const QUICK_ACTIONS = [
  { id: 'order', label: 'Order', icon: '🍔', prefill: 'Order me a ' },
  { id: 'navigate', label: 'Navigate', icon: '🗺', prefill: 'Take me to ' },
  { id: 'events', label: 'Events', icon: '🎫', prefill: 'Show me events ' },
  { id: 'report', label: 'Report', icon: '🔧', prefill: 'Report issue at ' },
  { id: 'friends', label: 'Friends', icon: '👥', prefill: 'Where is ' },
  { id: 'info', label: 'Info', icon: '📚', prefill: 'What is the rule for ' }
];
