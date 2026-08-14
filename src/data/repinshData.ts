import { RepinshSpace, RepinshTopic, RepinshComment, RepinshUserProfile } from '../types';

export const REPINSH_DEFAULT_USER: RepinshUserProfile = {
  id: 'usr_guest_seed',
  displayName: 'Guest Explorer',
  handle: 'explorer_92',
  avatarSeed: 'indigo',
  bio: 'Exploring AI & modern web innovations in REPINSH Community.',
  badges: ['Guest Identity', 'Early Explorer'],
  joinedAt: 'Today',
  isGuest: true,
};

export const REPINSH_ADMIN_USER: RepinshUserProfile = {
  id: 'usr_ansh_singh',
  displayName: 'Ansh Singh',
  handle: 'anshsingh',
  avatarSeed: 'amber',
  bio: 'Founder of REPINSH™ • Author & Technologist',
  badges: ['Founder', 'Author', 'Lead Architect'],
  joinedAt: 'August 2024',
  isGuest: false,
};

export const REPINSH_COMMUNITY_SPACES: RepinshSpace[] = [
  {
    id: 'space-ai-ml',
    name: 'AI & Machine Learning Hub',
    slug: 'ai-ml',
    description: 'Discussions on neural architectures, LLMs, generative creative tooling, and intelligent agent workflows.',
    icon: 'Brain',
    category: 'Artificial Intelligence',
    memberCount: 428,
    topicCount: 34,
    rules: [
      'Share authentic research and technical benchmarks.',
      'Be respectful when debating architectures and models.',
      'Clearly disclose automated or AI-assisted content.',
    ],
    isPrivate: false,
    tags: ['AI', 'LLMs', 'Agents', 'NeuralNetworks'],
    createdAt: 'August 2025',
    moderator: 'Ansh Singh',
  },
  {
    id: 'space-web-innovators',
    name: 'Web Innovation & UI/UX',
    slug: 'web-innovation',
    description: 'Crafting responsive user interfaces, reactive state paradigms, and performance-first web applications.',
    icon: 'Globe',
    category: 'Web Development',
    memberCount: 365,
    topicCount: 28,
    rules: [
      'Focus on clean, accessible, and fast web design.',
      'Include live demos or code snippets when possible.',
      'Constructive critique only.',
    ],
    isPrivate: false,
    tags: ['React', 'TypeScript', 'Tailwind', 'Performance'],
    createdAt: 'September 2025',
    moderator: 'Ansh Singh',
  },
  {
    id: 'space-creative-tech',
    name: 'Creative Tech & Digital Worlds',
    slug: 'creative-tech',
    description: 'Where narrative storytelling meets interactive technology, procedural world-building, and digital art.',
    icon: 'Sparkles',
    category: 'Creative Tech',
    memberCount: 290,
    topicCount: 19,
    rules: [
      'Celebrate interdisciplinary creativity across writing and coding.',
      'Encourage original fiction and interactive experiments.',
      'No spam or unauthorized promotional materials.',
    ],
    isPrivate: false,
    tags: ['Storytelling', 'GenerativeArt', 'WorldBuilding', 'Interactive'],
    createdAt: 'October 2025',
    moderator: 'Ansh Singh',
  },
  {
    id: 'space-open-lab',
    name: 'Open Discussion Lab',
    slug: 'open-lab',
    description: 'A freeform collaborative exchange space for ideas, casual questions, and open tech exploration.',
    icon: 'Users',
    category: 'General Discourse',
    memberCount: 512,
    topicCount: 45,
    rules: [
      'Keep interactions constructive, welcoming, and civil.',
      'No hate speech, harassment, or malicious links.',
      'Enjoy learning and sharing discoveries.',
    ],
    isPrivate: false,
    tags: ['Discussions', 'Ideas', 'Collaboration', 'Community'],
    createdAt: 'August 2025',
    moderator: 'Ansh Singh',
  },
];

export const INITIAL_REPINSH_TOPICS: RepinshTopic[] = [
  {
    id: 'topic-1',
    communityId: 'space-ai-ml',
    communityName: 'AI & Machine Learning Hub',
    title: 'Building Intelligent Guides: How LORE AI balances fast contextual retrieval and natural conversation',
    content: `When architecting LORE AI for the REPINSH platform, the core design objective was ensuring fast client-side assistance while keeping user privacy fully intact. Instead of harvesting cookies or demanding sensitive login credentials, LORE AI operates with a structured, client-side semantic routing engine.

Key architectural considerations:
1. Instant zero-latency responses for common navigation and community workflows.
2. Privacy-first architecture with zero persistent telemetry tracking.
3. Natural tone suitable for both technical readers and literature enthusiasts exploring Ansh Singh's ecosystem.

What features or integrations would you love to see LORE AI support next?`,
    category: 'Artificial Intelligence',
    tags: ['LORE-AI', 'Architecture', 'Privacy', 'SemanticSearch'],
    author: REPINSH_ADMIN_USER,
    createdAt: '2 hours ago',
    likes: 38,
    likedBy: [],
    views: 240,
    isPinned: true,
    commentsCount: 3,
  },
  {
    id: 'topic-2',
    communityId: 'space-web-innovators',
    communityName: 'Web Innovation & UI/UX',
    title: 'Why we prioritized Guest Identity over traditional cumbersome sign-up walls',
    content: `Traditional social platforms often erect massive barriers just to read or reply to a quick thought: email verifications, passwords, third-party trackers, and credential leaks.

In REPINSH Community, we implemented a lightweight Guest Identity model. Visitors pick a handle and avatar, and their session state is stored safely in local device storage.

Benefits:
- Instant participation without credential fatigue.
- Complete user control: clearing browser storage resets your identity instantly.
- Transparent security model with zero deceptive promises.

We'd love your thoughts on this friction-free onboarding approach!`,
    category: 'Web Development',
    tags: ['UI/UX', 'GuestIdentity', 'Privacy', 'WebInnovation'],
    author: {
      id: 'usr_sarah_tech',
      displayName: 'Sarah Lin',
      handle: 'sarah_dev',
      avatarSeed: 'cyan',
      bio: 'Frontend enthusiast & UX researcher',
      badges: ['Community Contributor'],
      joinedAt: 'October 2025',
      isGuest: false,
    },
    createdAt: '5 hours ago',
    likes: 29,
    likedBy: [],
    views: 185,
    isPinned: false,
    commentsCount: 2,
  },
  {
    id: 'topic-3',
    communityId: 'space-creative-tech',
    communityName: 'Creative Tech & Digital Worlds',
    title: 'Connecting Storytelling and Coding: How writing novels sharpens systems design',
    content: `Many people ask how writing epic fantasy novels like *The Lost Soul of Throne* or emotional journeys like *Until Death Found Us Again* connects with software architecture in REPINSH™.

The truth is that world-building and software engineering share identical foundational principles:
- **Consistency of Rules**: Magic systems and software protocols both collapse if internal logic is violated.
- **Pacing & Flow**: A responsive user interface requires the same rhythmic pacing as a gripping novel chapter.
- **Empathy for the Audience**: Readers and users both need clarity, warmth, and deliberate craftsmanship.

Do any other creators here balance writing with software development?`,
    category: 'Creative Tech',
    tags: ['WorldBuilding', 'Storytelling', 'SoftwareDesign', 'Creativity'],
    author: REPINSH_ADMIN_USER,
    createdAt: '1 day ago',
    likes: 54,
    likedBy: [],
    views: 410,
    isPinned: true,
    commentsCount: 4,
  },
  {
    id: 'topic-4',
    communityId: 'space-open-lab',
    communityName: 'Open Discussion Lab',
    title: 'Welcome to REPINSH Community! Introduce yourself and share what you are building',
    content: `Welcome to the official REPINSH™ Community discussion board! This space is open to everyone—developers, readers of Ansh Singh's novels, AI tinkerers, and designers.

Drop a comment below with:
1. Your favorite technology stack or creative hobby.
2. What brought you to Ansh Singh's website today!`,
    category: 'General Discourse',
    tags: ['Welcome', 'Introductions', 'Community', 'REPINSH'],
    author: REPINSH_ADMIN_USER,
    createdAt: '3 days ago',
    likes: 67,
    likedBy: [],
    views: 520,
    isPinned: false,
    commentsCount: 3,
  },
];

export const INITIAL_REPINSH_COMMENTS: RepinshComment[] = [
  {
    id: 'comm-1',
    topicId: 'topic-1',
    author: {
      id: 'usr_marcus_ai',
      displayName: 'Marcus Vance',
      handle: 'marcus_v',
      avatarSeed: 'emerald',
      badges: ['AI Enthusiast'],
      joinedAt: 'January 2026',
      isGuest: false,
    },
    content: 'The response latency of LORE AI is remarkably snappy. Having the assistance integrated directly without external popups makes exploring the ecosystem very seamless.',
    createdAt: '1 hour ago',
    likes: 12,
    likedBy: [],
  },
  {
    id: 'comm-2',
    topicId: 'topic-1',
    parentId: 'comm-1',
    author: REPINSH_ADMIN_USER,
    content: 'Thank you Marcus! Keeping the retrieval lightweight on the client-side while delivering instant contextual guidance was our top engineering priority.',
    createdAt: '45 mins ago',
    likes: 8,
    likedBy: [],
  },
  {
    id: 'comm-3',
    topicId: 'topic-1',
    author: {
      id: 'usr_elena_r',
      displayName: 'Elena Rostova',
      handle: 'elena_r',
      avatarSeed: 'purple',
      badges: ['Member'],
      joinedAt: 'February 2026',
      isGuest: false,
    },
    content: 'Would love to see LORE AI also provide lore lookups for characters from "The Lost Soul of Throne" in future updates!',
    createdAt: '30 mins ago',
    likes: 15,
    likedBy: [],
  },
  {
    id: 'comm-4',
    topicId: 'topic-2',
    author: {
      id: 'usr_dev_alex',
      displayName: 'Alex Thorne',
      handle: 'alex_t',
      avatarSeed: 'rose',
      badges: ['Web Developer'],
      joinedAt: 'Yesterday',
      isGuest: false,
    },
    content: 'Love this! Not having to deal with another "verify your email" code makes dropping a comment so much more natural.',
    createdAt: '3 hours ago',
    likes: 9,
    likedBy: [],
  },
  {
    id: 'comm-5',
    topicId: 'topic-2',
    parentId: 'comm-4',
    author: {
      id: 'usr_sarah_tech',
      displayName: 'Sarah Lin',
      handle: 'sarah_dev',
      avatarSeed: 'cyan',
      badges: ['Community Contributor'],
      joinedAt: 'October 2025',
      isGuest: false,
    },
    content: 'Exactly! And having full local control over the pseudonym and avatar gives users agency without privacy invasiveness.',
    createdAt: '2 hours ago',
    likes: 6,
    likedBy: [],
  },
  {
    id: 'comm-6',
    topicId: 'topic-3',
    author: {
      id: 'usr_reader_clara',
      displayName: 'Clara Bennett',
      handle: 'clara_books',
      avatarSeed: 'amber',
      badges: ['Avid Reader'],
      joinedAt: 'Last week',
      isGuest: false,
    },
    content: 'This philosophy makes so much sense! Both reading your books and exploring this website show that same meticulous attention to atmosphere and structure.',
    createdAt: '18 hours ago',
    likes: 21,
    likedBy: [],
  },
];

export const REPINSH_FEATURE_PILLARS = [
  {
    title: 'AI Solutions',
    subtitle: 'Intelligent Systems',
    description: 'Exploring intelligent and AI-powered experiences, generative workflows, and helpful contextual assistants.',
    icon: 'Brain',
    accentColor: 'from-cyan-500 to-blue-600',
    tag: 'Artificial Intelligence',
  },
  {
    title: 'Web Applications',
    subtitle: 'Modern Architecture',
    description: 'Creating modern, interactive web applications focused on performance, fluid accessibility, and responsive aesthetics.',
    icon: 'Layout',
    accentColor: 'from-blue-500 to-indigo-600',
    tag: 'Web Engineering',
  },
  {
    title: 'Digital Communities',
    subtitle: 'Connected Spaces',
    description: 'Building spaces for people and ideas to connect, share discussions, and collaborate without traditional login friction.',
    icon: 'Users',
    accentColor: 'from-amber-500 to-orange-600',
    tag: 'Community Tech',
  },
  {
    title: 'Innovation Lab',
    subtitle: 'Exploratory Projects',
    description: 'Experimenting with emerging concepts, local-first state paradigms, interactive story engines, and digital tools.',
    icon: 'Zap',
    accentColor: 'from-emerald-500 to-teal-600',
    tag: 'R&D Lab',
  },
];

export const REPINSH_TECH_STACK = [
  {
    name: 'Artificial Intelligence',
    description: 'Intelligent tools and AI-powered experiences.',
    highlights: ['LORE AI Context Engine', 'Semantic Search', 'Automated Content Structuring'],
    icon: 'BrainCircuit',
  },
  {
    name: 'Web Innovation',
    description: 'Modern applications designed around creativity and usability.',
    highlights: ['TypeScript & React 18', 'Tailwind CSS Micro-Interactions', 'Motion Engine'],
    icon: 'Layers',
  },
  {
    name: 'Real-Time Technology',
    description: 'Interactive experiences and connected communities.',
    highlights: ['Local-First State Sync', 'Reactive Topic Threads', 'Zero-Tracking Privacy Guard'],
    icon: 'Activity',
  },
  {
    name: 'Future Ideas',
    description: 'Experimental projects currently being explored.',
    highlights: ['Decentralized Space Federation (Coming Soon)', 'Interactive Lore Codex', 'Multi-Modal Creation'],
    icon: 'Compass',
  },
];

// LORE AI Knowledge Engine
export function queryLoreAi(question: string): string {
  const q = question.toLowerCase().trim();

  if (q.includes('what is repinsh') || q.includes('who created repinsh') || q.includes('about repinsh') || q.includes('meaning')) {
    return `REPINSH™ is the technology and innovation initiative founded and developed by Ansh Singh. It focuses on exploring artificial intelligence, building modern web applications, and creating interactive digital platforms where technology and creativity converge.`;
  }

  if (q.includes('create a topic') || q.includes('how to post') || q.includes('new topic') || q.includes('start discussion')) {
    return `To create a topic in the REPINSH Community:
1. Click the "Start a Discussion" button in the community section.
2. Choose your target Space (e.g., AI & Machine Learning, Web Innovation, Creative Tech).
3. Enter your topic title, write your thoughts, and add relevant tags.
4. Hit "Publish Topic" to share it instantly with the community!`;
  }

  if (q.includes('guest') || q.includes('login') || q.includes('account') || q.includes('privacy') || q.includes('anonymity') || q.includes('safe')) {
    return `REPINSH Community features a privacy-safe Guest Identity system. You do not need to register with passwords or provide personal emails. Your display handle and avatar are stored locally in your browser, keeping your experience private, secure, and completely friction-free.`;
  }

  if (q.includes('create community') || q.includes('create space') || q.includes('my own space') || q.includes('spaces')) {
    return `You can create your own Space by clicking "Create Space" inside the REPINSH Community area. You can define a Space Name, description, category, custom community rules, and moderation controls. (Note: Interconnected worldwide federated servers are currently in active development / coming soon!)`;
  }

  if (q.includes('rule') || q.includes('guidelines') || q.includes('moderation') || q.includes('conduct')) {
    return `The REPINSH Community Guidelines are simple and constructive:
1. Treat everyone with respect and empathy.
2. Share authentic technical, creative, and literary insights.
3. No harassment, spam, hate speech, or malicious links.
4. Keep discussions relevant to the community space.`;
  }

  if (q.includes('like') || q.includes('comment') || q.includes('reply') || q.includes('interact')) {
    return `Interacting is instantaneous:
- Click the Heart icon on any topic or comment to express appreciation.
- Click "Reply" to start a direct nested conversation under any comment.
- Use the search bar to discover topics by keyword, author, or tag!`;
  }

  if (q.includes('book') || q.includes('lost soul') || q.includes('until death') || q.includes('novel') || q.includes('author')) {
    return `Ansh Singh is both an author and a technologist! Alongside leading REPINSH™, he has authored "The Lost Soul of Throne" (an epic fantasy saga) and "Until Death Found Us Again" (a profound romance/drama). You can explore full book details and character lore in the Books section above.`;
  }

  // Fallback smart response
  return `Thank you for asking! LORE AI is here to guide you across REPINSH™. You can explore AI solutions, participate in discussions in the REPINSH Community without traditional login friction, create custom community spaces, and discover how technology connects with Ansh Singh's creative journey. Feel free to ask more specific questions!`;
}
