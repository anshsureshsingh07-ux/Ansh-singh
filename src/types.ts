export interface Character {
  id: string;
  name: string;
  role: string;
  bookTitle: string;
  affinity: string;
  quote: string;
  description: string;
  traits: string[];
  avatarUrl?: string;
}

export interface BookLore {
  id?: string;
  volumeNumber?: number;
  title: string;
  genre: string;
  status: string;
  subtitle: string;
  tagline: string;
  description: string;
  coverImage: string;
  progressPercent: number;
  featuresList: string[];
  amazonUrl?: string;
  releaseAnnouncement?: {
    isAnnounced: boolean;
    isLaunched?: boolean;
    format: string; // e.g. "Paperback Edition (Out Now)"
    volume: string; // e.g. "Volume 1"
    releaseDate: string; // e.g. "Launched 16th August (Birthday Launch)"
    exclusivePlatform: string; // e.g. "Amazon Exclusive"
    badgeText: string;
    details: string;
    amazonUrl?: string;
  };
  magicSystem?: {
    name: string;
    description: string;
    elements: { name: string; power: string; color: string }[];
  };
  kingdomMap?: {
    regions: { name: string; description: string; ruler: string; climate: string }[];
  };
  familyTrees?: {
    houseName: string;
    motto: string;
    members: string[];
  }[];
  chapterExcerpts?: {
    title: string;
    excerpt: string;
  }[];
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  iconName: string;
  highlight?: boolean;
}

export interface Friend {
  name: string;
  role: string;
  trait: string;
  avatarColor: string;
  quote?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Writing setup' | 'Book concepts' | 'Artwork' | 'Nature' | 'Travel' | 'Inspirations' | 'School life';
  imageUrl: string;
  description: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  location: string;
  message: string;
  date: string;
  likes: number;
  badge?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    characterId: string;
    description: string;
  }[];
}

export interface Quote {
  id: string;
  text: string;
  source: string;
  category: string;
}

export interface AbsurdMeme {
  id: string;
  characterName: string;
  title: string;
  category: string;
  categoryIcon: string;
  description: string;
  dialogue: string;
  brainrotLevel: string;
  chaosEnergy: string;
  logicRemaining: string;
  powerLevel: string;
  plotTwist: string;
  themeGradient: string;
  emojiAvatar: string;
  isForbidden?: boolean;
}

export interface CharacterBattle {
  id: string;
  fighter1: {
    name: string;
    title: string;
    emoji: string;
    power: string;
  };
  fighter2: {
    name: string;
    title: string;
    emoji: string;
    power: string;
  };
  rounds: {
    round: number;
    text: string;
  }[];
  winner: string;
  winnerReason: string;
}

export interface DailyChallenge {
  id: string;
  prompt: string;
  exampleAnswer: string;
  badge: string;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  author: string;
  text: string;
  upvotes: number;
  createdAt: string;
}

export interface RepinshUserProfile {
  id: string;
  displayName: string;
  handle: string;
  avatarSeed: string;
  bio?: string;
  badges: string[];
  joinedAt: string;
  isGuest: boolean;
}

export interface UserBanRecord {
  userId: string;
  handle: string;
  displayName: string;
  bannedAt: number; // timestamp ms
  bannedUntil: number; // timestamp ms
  banDurationDays: number;
  reason: string;
  flaggedContentSnippet: string;
  reportedBy: string;
  incidentId: string;
  status: 'active' | 'expired' | 'pardoned';
}

export interface ContentReport {
  id: string;
  targetType: 'topic' | 'comment' | 'guestbook' | 'message';
  targetId: string;
  targetTitle?: string;
  targetContent: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  reportedBy: string;
  reason: 'abusive_language' | 'hate_speech' | 'harassment' | 'threat' | 'spam' | 'other';
  customNotes?: string;
  reportedAt: string;
  status: 'pending' | 'resolved_banned' | 'dismissed';
  scanResult?: {
    isAbusive: boolean;
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    detectedPatterns: string[];
    summary: string;
    suggestedBanDays: number;
  };
}

export interface RepinshComment {
  id: string;
  topicId: string;
  parentId?: string; // for nested replies
  author: RepinshUserProfile;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[]; // user IDs
  isQuarantined?: boolean;
  moderationReason?: string;
  reportCount?: number;
}

export interface RepinshTopic {
  id: string;
  communityId: string;
  communityName: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: RepinshUserProfile;
  createdAt: string;
  likes: number;
  likedBy: string[]; // user IDs
  views: number;
  isPinned?: boolean;
  commentsCount: number;
  isQuarantined?: boolean;
  moderationReason?: string;
  reportCount?: number;
}

export interface RepinshSpace {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  memberCount: number;
  topicCount: number;
  rules: string[];
  isPrivate: boolean;
  tags: string[];
  createdAt: string;
  moderator: string;
}

export interface LoreAiMessage {
  id: string;
  sender: 'user' | 'lore';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}
