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
  title: string;
  genre: string;
  status: string;
  subtitle: string;
  tagline: string;
  description: string;
  coverImage: string;
  progressPercent: number;
  featuresList: string[];
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
