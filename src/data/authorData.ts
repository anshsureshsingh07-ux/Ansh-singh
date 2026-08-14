import { BookLore, Character, Friend, GalleryItem, GuestbookEntry, QuizQuestion, Quote, TimelineEvent } from '../types';

import lostSoulCoverImg from '../assets/images/lost_soul_cover_1786097505761.jpg';
import untilDeathCoverImg from '../assets/images/until_death_cover_1786097518804.jpg';
import authorPortraitImg from '../assets/images/author_portrait_1786097530540.jpg';
import tonnyRabbitImg from '../assets/images/tonny_rabbit_1786097544491.jpg';

export const AUTHOR_INFO = {
  name: "Ansh Singh",
  title: "Student • Author • Storyteller",
  tagline: "Every story begins as a dream. Mine are written to be remembered.",
  dob: "16 August 2010",
  nationality: "Indian",
  occupation: "Student & Aspiring Novelist",
  school: "Shree Gurukrupa Vidya Sankul, Udhna, Surat, Gujarat",
  family: {
    father: "Suresh Singh",
    mother: "Pushpa Singh",
    brother: "Krish Singh",
    pet: "Tonny 🐇 (Rabbit)",
    petImage: tonnyRabbitImg,
  },
  authorImage: authorPortraitImg,
  biography: "Hello! I'm Ansh Singh, a passionate student and aspiring author from Surat, India. I love creating imaginative worlds, compelling characters, and emotionally driven stories. Alongside my education, I spend my time learning new skills, writing novels, and constantly improving my craft. My goal is to create stories that readers remember long after they turn the final page.",
  philosophy: "Stories have the power to outlive their creators. I write worlds where readers can laugh, cry, dream, and believe in the impossible.",
  socials: {
    instagram: "https://instagram.com",
    twitter: "https://x.com",
    github: "https://github.com",
    email: "anshsureshsingh07@gmail.com",
  }
};

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "16 August 2010",
    title: "The Genesis",
    description: "Born in India, marking the start of a lifelong curiosity for imagination and discovery.",
    iconName: "Sparkles",
    highlight: true,
  },
  {
    year: "Early Years",
    title: "Exploring Stories & Fiction",
    description: "Began diving into books, fables, and ancient myths that laid the groundwork for narrative structure.",
    iconName: "BookOpen",
  },
  {
    year: "Formative Era",
    title: "Passion for Anime, Cinema & Fantasy",
    description: "Immersed in cinematic storytelling, epic world-building, and complex character arcs from global cinema.",
    iconName: "Clapperboard",
  },
  {
    year: "Creative Breakthrough",
    title: "Penned First Original Manuscripts",
    description: "Started drafting original fantasy universes and romantic reincarnation sagas.",
    iconName: "PenTool",
    highlight: true,
  },
  {
    year: "Current Chapter",
    title: "Building Flagship Literary Collection",
    description: "Actively writing 'The Lost Soul of Throne' and 'Until Death Found Us Again'.",
    iconName: "Library",
  },
  {
    year: "16 August (Birthday Edition)",
    title: "Paperback Release: The Lost Soul of Throne (Vol. 1)",
    description: "Big milestone: Volume 1 of 'The Lost Soul of Throne' officially releases as a paperback edition on Ansh's birthday (16th August), exclusively on Amazon!",
    iconName: "Sparkles",
    highlight: true,
  },
  {
    year: "Ongoing Goal",
    title: "Refining Craft & World Building",
    description: "Continuing to balance academics at Shree Gurukrupa Vidya Sankul while mastering storytelling techniques.",
    iconName: "GraduationCap",
  },
  {
    year: "Future Horizon",
    title: "Globally Recognized Author",
    description: "Working tirelessly toward publishing novels that inspire readers around the globe.",
    iconName: "Globe",
    highlight: true,
  },
];

export const BOOKS_DATA: Record<string, BookLore> = {
  lostSoul: {
    title: "The Lost Soul of Throne",
    genre: "Epic Fantasy",
    status: "Paperback Releasing Aug 16",
    subtitle: "A vast fantasy saga of kingdoms, ancient magic, and political destiny",
    tagline: "Every decision changes the fate of an entire world.",
    coverImage: lostSoulCoverImg,
    progressPercent: 100,
    releaseAnnouncement: {
      isAnnounced: true,
      format: "Paperback Edition",
      volume: "Volume 1",
      releaseDate: "16th August (Author's Birthday)",
      exclusivePlatform: "Exclusive Only on Amazon",
      badgeText: "🎉 Big News • Birthday Release",
      details: "Volume 1 of 'The Lost Soul of Throne' is officially making its debut as a physical Paperback Edition on Ansh's birthday, 16th August, exclusively available on Amazon!"
    },
    description: "A vast fantasy saga filled with kingdoms, political intrigue, ancient powers, legendary warriors, dragons, gods, betrayal, sacrifice, and the struggle for the throne. Every decision changes the fate of an entire world.",
    featuresList: [
      "Paperback Release (Vol. 1)",
      "Amazon Exclusive",
      "Character Encyclopedia",
      "Kingdom Map",
      "Timeline & Lore",
      "Family Trees",
      "Magic System"
    ],
    magicSystem: {
      name: "The Aetherium Resonance",
      description: "Magic in the realm is drawn from primal dragon bloodlines and celestial alignment. Wielders harness ambient energy through sacred runes.",
      elements: [
        { name: "Solar Blaze", power: "Destructive elemental flame forged in stellar cores", color: "#F59E0B" },
        { name: "Void Weaving", power: "Bending shadow, space, and memory to slip past defenses", color: "#8B5CF6" },
        { name: "Dragon-Bond", power: "Telepathic synergy with legendary apex wyrms", color: "#EF4444" },
        { name: "Celestial Aegis", power: "Unbreakable barrier forged from starlight and ancient vows", color: "#3B82F6" },
      ]
    },
    kingdomMap: {
      regions: [
        { name: "Valyria Dominion", ruler: "High Sovereign Aurelius", climate: "Volcanic Crags & Floating Spires", description: "Heartland of dragon lords and ancient rune smiths." },
        { name: "Aethelgard Reach", ruler: "Queen Valeriana", climate: "Borealis Glaciers & Frostwood", description: "Fortified northern bastion guarding against shadow behemoths." },
        { name: "Solaris Citadel", ruler: "Council of the Seven Sun Warlords", climate: "Golden Dunes & Oasis Palaces", description: "Trade capital rich in magic crystals and political secrets." },
        { name: "The Sunken Marches", ruler: "Forgotten Siren King", climate: "Mist-shrouded wetlands", description: "Untamed wildlands housing submerged temples and forbidden archives." },
      ]
    },
    familyTrees: [
      { houseName: "House Aurelius", motto: "Through Fire, We Prevail", members: ["High Sovereign Aurelius", "Lord Kaelen the Unyielding", "Lady Lyra of the Eclipse"] },
      { houseName: "House Frostfang", motto: "Winter Remembers All", members: ["Queen Valeriana", "Prince Eric the Shieldbearer", "Commander Bryn"] },
    ],
    chapterExcerpts: [
      {
        title: "Chapter 1: The Throne of Ash and Starlight",
        excerpt: "The obsidian throne radiated an eerie warmth, as if the dragon imprisoned beneath its stone still breathed. Kaelen touched his hand to the gold-inlaid crest. 'If I sit upon this chair,' he whispered into the silent hall, 'I seal the fate of every living soul in Valyria.'"
      },
      {
        title: "Chapter 4: Shadows over Solaris",
        excerpt: "Beneath the golden domes of the oasis city, shadows danced with dagger precision. The prophecy was no longer a whispered warning; it was knocking at the citadel gates."
      }
    ]
  },
  untilDeath: {
    title: "Until Death Found Us Again",
    genre: "Fantasy Romance • Reincarnation • Drama",
    status: "In Development",
    subtitle: "A sweeping tale of love, tragedy, reincarnation, and hope across lifetimes",
    tagline: "Separated by destiny, reunited by fate.",
    coverImage: untilDeathCoverImg,
    progressPercent: 82,
    description: "Ren Takahashi and Yuki Aizawa never confessed their love before tragedy separated them forever. Reborn into a new world, destiny gives them another chance—but fate refuses to make it easy. A sweeping tale of love, sacrifice, reincarnation, and hope across lifetimes.",
    featuresList: [
      "Character Profiles",
      "Story Timeline",
      "Artwork Gallery",
      "Chapter Archive",
      "Quotes",
      "Reader Community"
    ],
    chapterExcerpts: [
      {
        title: "Prologue: The Unspoken Promise",
        excerpt: "The rain fell heavily against the Tokyo pavement. Yuki reached out her hand, her fingertips brushing Ren's damp uniform sleeve. 'In the next life,' she whispered as the light began to fade, 'find me first.'"
      },
      {
        title: "Chapter 3: Memory of Cherry Blossoms",
        excerpt: "In the magical academy of Aethelgard, the new student stood under the blooming sakura trees. Ren froze—the familiar fragrance, the cadence of her laughter. Across two lives and a thousand miles, his heart knew her instantly."
      }
    ]
  }
};

export const CHARACTERS_DATA: Character[] = [
  {
    id: "kaelen",
    name: "Kaelen Aurelius",
    role: "Crown Heir & Dragon Wielder",
    bookTitle: "The Lost Soul of Throne",
    affinity: "Fire & Starlight",
    quote: "A crown is not a symbol of power, but a heavy vow to protect those who cannot stand.",
    description: "Determined, honorable, and burdened by an ancient bloodline, Kaelen seeks to unite shattered kingdoms before darkness consumes them.",
    traits: ["Leader", "Dragon Rider", "Strategic", "Honorable"]
  },
  {
    id: "ren",
    name: "Ren Takahashi",
    role: "Reincarnated Swordmaster",
    bookTitle: "Until Death Found Us Again",
    affinity: "Memories & Wind Blade",
    quote: "I searched through a thousand silent nights just to hear your voice once more.",
    description: "Carrying memories of his past life, Ren navigates a foreign fantasy world with one burning mission: protecting Yuki.",
    traits: ["Protective", "Devoted", "Master Swordsman", "Resilient"]
  },
  {
    id: "yuki",
    name: "Yuki Aizawa",
    role: "Celestial Weaver",
    bookTitle: "Until Death Found Us Again",
    affinity: "Light & Starlight Harmony",
    quote: "Fate may pull us apart, but love is the one bond even death cannot break.",
    description: "Gentle yet fierce when protecting loved ones, Yuki awakens ancient celestial magic as her memories slowly return.",
    traits: ["Empathetic", "Celestial Mage", "Courageous", "Gentle"]
  },
  {
    id: "lyra",
    name: "Lady Lyra of Eclipse",
    role: "High Spymaster of Solaris",
    bookTitle: "The Lost Soul of Throne",
    affinity: "Shadow Void",
    quote: "In the court of kings, secrets are sharper than any Valyrian steel blade.",
    description: "A brilliant strategist operating in the shadows to protect the realm from silent betrayals.",
    traits: ["Cunning", "Loyal", "Infiltrator", "Brilliant"]
  }
];

export const INTERESTS_DATA = [
  { name: "Writing Novels", icon: "Feather", desc: "Crafting original plotlines and emotional arcs" },
  { name: "Learning New Skills", icon: "Sparkles", desc: "Expanding knowledge across writing, design, and tech" },
  { name: "Anime", icon: "Tv", desc: "Drawing inspiration from Japanese animation and narrative pacing" },
  { name: "Hollywood Movies", icon: "Film", desc: "Studying cinematography, lighting, and score dynamics" },
  { name: "Web Series", icon: "PlaySquare", desc: "Analyzing episodic storytelling and cliffhanger techniques" },
  { name: "Fantasy Literature", icon: "BookOpen", desc: "Reading legendary authors and immersive world-building" },
  { name: "World Building", icon: "Globe", desc: "Designing original magic rules, maps, and cultural lore" },
  { name: "Technology", icon: "Cpu", desc: "Utilizing modern digital tools and AI to enhance creativity" },
  { name: "Creative Design", icon: "Palette", desc: "Designing visual concepts, book covers, and aesthetics" },
];

export const FRIENDS_DATA: Friend[] = [
  { name: "Devbrat Dhal", role: "Best Friend & Primary Confidant", trait: "Best Friend & Analytical Mind", avatarColor: "from-amber-400 via-yellow-500 to-amber-600", quote: "Ansh's closest best friend—sharpening logic, stories, and sharing every major milestone!" },
  { name: "Shivang Thakur", role: "Creative Companion", trait: "Inspirational Thinker", avatarColor: "from-amber-500 to-yellow-600", quote: "Always pushing creative limits!" },
  { name: "Aanchal Dakua", role: "Literary Reader", trait: "Perceptive Feedback", avatarColor: "from-rose-500 to-pink-600", quote: "First to read and encourage new chapters!" },
  { name: "Kamal Gupta", role: "Tech Explorer", trait: "Innovative Strategist", avatarColor: "from-emerald-500 to-teal-600", quote: "Building future-forward ideas." },
  { name: "Abhir Khare", role: "Story Enthusiast", trait: "Vibrant Imagination", avatarColor: "from-purple-500 to-violet-600", quote: "Fueling epic story debates!" },
  { name: "Ishika Yadav", role: "Creative Advisor", trait: "Artistic Vision", avatarColor: "from-fuchsia-500 to-purple-600", quote: "Bringing warmth and creative energy." },
  { name: "Payal Pandey", role: "Classmate & Supporter", trait: "Warm & Encouraging", avatarColor: "from-pink-500 to-rose-600", quote: "Always spreading positive vibes and literary support!" },
  { name: "Mayank Gandhi", role: "Trusted Companion", trait: "Steadfast Friend", avatarColor: "from-cyan-500 to-blue-600", quote: "Standing strong through every chapter of life." },
  { name: "Dev Solanki", role: "Fellow Explorer", trait: "Adventurous Mind", avatarColor: "from-orange-500 to-amber-600", quote: "Exploring new horizons and bold ideas." },
  { name: "Ashutosh Pratap", role: "Academic & Creative Supporter", trait: "Keen Mind & Loyalty", avatarColor: "from-teal-500 to-emerald-600", quote: "Bringing sharp insights and great conversation." },
  { name: "Manveer", role: "Memorable Friend", trait: "Valued Connection", avatarColor: "from-indigo-500 to-purple-600", quote: "Last conversation: January 2026 — a bond that stays strong across time." },
  { name: "Kkrishna Yadav", role: "Enthusiastic Peer", trait: "Energetic Supporter", avatarColor: "from-lime-500 to-green-600", quote: "Cheering on every new story milestone!" },
  { name: "Aryan (manjiro.fx)", role: "Digital Creator & Friend", trait: "Creative Visual Style", avatarColor: "from-violet-500 to-fuchsia-600", quote: "Bringing visual flair and creative aesthetics." },
  { name: "Ayush (chad_blahblahblah)", role: "Good Friend & Companion", trait: "Unfiltered Humor & Energy", avatarColor: "from-red-500 to-orange-600", quote: "Bringing legendary banter and non-stop good energy." },
];

export const SKILLS_DATA = [
  { name: "Storytelling", percent: 92, desc: "Plot architecture, emotional pacing, and narrative hooks" },
  { name: "World Building", percent: 88, desc: "Geography, magic systems, mythology, and political structure" },
  { name: "Character Development", percent: 90, desc: "Flawed, relatable protagonists with deep internal motivations" },
  { name: "Creative Thinking", percent: 95, desc: "Original twists, atmospheric themes, and imaginative concepts" },
  { name: "Continuous Learning", percent: 96, desc: "Constant self-improvement across literature, science, and tech" },
  { name: "Website Development", percent: 85, desc: "Building modern interactive digital presences with modern tools" },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Author Desk & Writing Setup",
    category: "Writing setup",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    description: "Where worlds come alive—fountain pens, notebook drafts, and late-night tea."
  },
  {
    id: "g2",
    title: "Throne of Valyria - Concept Art",
    category: "Book concepts",
    imageUrl: lostSoulCoverImg,
    description: "Initial visual artwork for 'The Lost Soul of Throne'."
  },
  {
    id: "g3",
    title: "Cherry Blossom Reincarnation Shrine",
    category: "Artwork",
    imageUrl: untilDeathCoverImg,
    description: "Atmospheric artwork for 'Until Death Found Us Again'."
  },
  {
    id: "g4",
    title: "Surat Sunsets & Quiet Horizons",
    category: "Nature",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Inspiring evening skies that spark calm contemplation."
  },
  {
    id: "g5",
    title: "Ancient Library Archives",
    category: "Inspirations",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80",
    description: "Endless rows of classic books that motivate the journey."
  },
  {
    id: "g6",
    title: "Shree Gurukrupa Vidya Sankul Memories",
    category: "School life",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    description: "Campus paths where stories are brainstormed during quiet breaks."
  },
  {
    id: "g7",
    title: "Tonny the Rabbit 🐇",
    category: "Inspirations",
    imageUrl: tonnyRabbitImg,
    description: "Ansh's companion rabbit Tonny keeping watch over writing sessions."
  }
];

export const INITIAL_GUESTBOOK: GuestbookEntry[] = [
  {
    id: "gb1",
    name: "Rohan V.",
    location: "Mumbai, India",
    message: "The concept for 'The Lost Soul of Throne' sounds incredible! Can't wait to read about dragon wielders!",
    date: "2026-08-01",
    likes: 14,
    badge: "Early Reader"
  },
  {
    id: "gb2",
    name: "Ananya Sharma",
    location: "Delhi, India",
    message: "Reincarnation romance is my absolute favorite genre! Ren and Yuki's story looks so emotional. Wishing Ansh all success!",
    date: "2026-08-04",
    likes: 22,
    badge: "Fantasy Lover"
  },
  {
    id: "gb3",
    name: "Karan Patel",
    location: "Surat, India",
    message: "Proud to see a young author from Surat building such an ambitious literary universe. Keep shining Ansh!",
    date: "2026-08-06",
    likes: 19,
    badge: "Local Supporter"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "When faced with an impossible conflict, what is your instinct?",
    options: [
      { text: "Stand firm at the forefront and take responsibility.", characterId: "kaelen", description: "You embody leadership and ancient honor." },
      { text: "Protect the ones I love, regardless of personal cost.", characterId: "ren", description: "Your devotion burns brighter than any obstacle." },
      { text: "Harmonize the situation through empathy and starlight intuition.", characterId: "yuki", description: "You bring hope and healing to dark times." },
      { text: "Analyze the hidden motives behind the scene and outsmart the challenge.", characterId: "lyra", description: "Your mind is your deadliest weapon." },
    ]
  },
  {
    id: 2,
    question: "Which magical environment speaks most to your soul?",
    options: [
      { text: "Volcanic spires beneath a star-filled tempest.", characterId: "kaelen", description: "You thrive in high-stakes grandeur." },
      { text: "A wind-swept cliff under moonlight.", characterId: "ren", description: "You find strength in quiet resolve." },
      { text: "A cherry blossom sanctuary glowing with celestial light.", characterId: "yuki", description: "You radiate beauty and serenity." },
      { text: "A hidden vaulted archive under golden domes.", characterId: "lyra", description: "You value ancient wisdom and secret lore." },
    ]
  },
  {
    id: 3,
    question: "What core value defines your journey?",
    options: [
      { text: "Unwavering duty and justice.", characterId: "kaelen", description: "You carry the weight of crowns with grace." },
      { text: "Unconditional loyalty and love across time.", characterId: "ren", description: "Your heart remembers promises across lives." },
      { text: "Hope, light, and spiritual harmony.", characterId: "yuki", description: "You restore faith where hope was lost." },
      { text: "Wisdom, strategy, and vigilant protection.", characterId: "lyra", description: "You guard the future from unseen threats." },
    ]
  }
];

export const QUOTES_COLLECTION: Quote[] = [
  {
    id: "q1",
    text: "Stories have the power to outlive their creators. I write worlds where readers can laugh, cry, dream, and believe in the impossible.",
    source: "Ansh Singh (Writing Philosophy)",
    category: "Author Wisdom"
  },
  {
    id: "q2",
    text: "Every story begins as a dream. Mine are written to be remembered.",
    source: "Ansh Singh (Official Tagline)",
    category: "Author Wisdom"
  },
  {
    id: "q3",
    text: "A crown is not a symbol of power, but a heavy vow to protect those who cannot stand.",
    source: "The Lost Soul of Throne",
    category: "Book Quote"
  },
  {
    id: "q4",
    text: "Fate may pull us apart, but love is the one bond even death cannot break.",
    source: "Until Death Found Us Again",
    category: "Book Quote"
  },
  {
    id: "q5",
    text: "The greatest stories are not just read—they are remembered.",
    source: "Ansh Singh",
    category: "Author Wisdom"
  },
  {
    id: "q6",
    text: "In the court of kings, secrets are sharper than any Valyrian steel blade.",
    source: "The Lost Soul of Throne",
    category: "Book Quote"
  }
];
