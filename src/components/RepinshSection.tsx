import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Globe,
  Sparkles,
  Zap,
  Users,
  Search,
  MessageSquare,
  Heart,
  Share2,
  PlusCircle,
  Shield,
  Bot,
  Layers,
  ArrowRight,
  Check,
  Send,
  X,
  ExternalLink,
  Lock,
  Compass,
  Cpu,
  Feather,
  BookOpen,
  Info,
  Radio,
  Sliders,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  UserCheck,
  Flag,
  ShieldAlert,
  AlertTriangle,
  Edit3,
  UserX,
  LockKeyhole
} from 'lucide-react';
import {
  RepinshSpace,
  RepinshTopic,
  RepinshComment,
  RepinshUserProfile,
  LoreAiMessage,
} from '../types';
import {
  REPINSH_DEFAULT_USER,
  REPINSH_ADMIN_USER,
  REPINSH_COMMUNITY_SPACES,
  INITIAL_REPINSH_TOPICS,
  INITIAL_REPINSH_COMMENTS,
  REPINSH_FEATURE_PILLARS,
  REPINSH_TECH_STACK,
  queryLoreAi,
} from '../data/repinshData';
import { useUserIdentity } from '../context/UserIdentityContext';
import { scanTextForAbusiveLanguage } from '../utils/safetyModeration';

export const RepinshSection: React.FC = () => {
  const {
    currentUser,
    openEditProfileModal,
    openReportModal,
    openSafetyLogModal,
    isCurrentUserBanned,
    currentUserBanRecord,
    autoEnforceAbusiveContent,
  } = useUserIdentity();

  // Navigation & Sub-section Tab
  const [activeCommunityTab, setActiveCommunityTab] = useState<'topics' | 'spaces' | 'network'>('topics');
  const [selectedSpaceFilter, setSelectedSpaceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Topics & Comments State
  const [topics, setTopics] = useState<RepinshTopic[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('repinsh_topics');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return INITIAL_REPINSH_TOPICS;
  });

  const [comments, setComments] = useState<RepinshComment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('repinsh_comments');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return INITIAL_REPINSH_COMMENTS;
  });

  const [spaces, setSpaces] = useState<RepinshSpace[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('repinsh_spaces');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return REPINSH_COMMUNITY_SPACES;
  });

  // Selected Topic for Detail / Discussion Modal
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);

  // Modals State
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
  const [showLoreAiModal, setShowLoreAiModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New Topic Form State
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicSpaceId, setNewTopicSpaceId] = useState('space-ai-ml');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicTags, setNewTopicTags] = useState('');

  // New Space Form State
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [newSpaceCategory, setNewSpaceCategory] = useState('Artificial Intelligence');
  const [newSpaceRules, setNewSpaceRules] = useState('');
  const [newSpaceIsPrivate, setNewSpaceIsPrivate] = useState(false);

  // LORE AI Chat State
  const [loreMessages, setLoreMessages] = useState<LoreAiMessage[]>([
    {
      id: 'lore-msg-init',
      sender: 'lore',
      text: "Hello, I'm LORE AI. I'm here to help you explore REPINSH™. What would you like to know?",
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'How does REPINSH work?', action: 'How does REPINSH work?' },
        { label: 'How can I create a topic?', action: 'How can I create a topic?' },
        { label: 'How do I join without a password?', action: 'How does guest identity and privacy work?' },
        { label: 'What are the community rules?', action: 'What are the community rules?' },
      ],
    },
  ]);
  const [loreInput, setLoreInput] = useState('');
  const [isLoreTyping, setIsLoreTyping] = useState(false);
  const loreScrollRef = useRef<HTMLDivElement>(null);

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('repinsh_user_profile', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('repinsh_topics', JSON.stringify(topics));
    }
  }, [topics]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('repinsh_comments', JSON.stringify(comments));
    }
  }, [comments]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('repinsh_spaces', JSON.stringify(spaces));
    }
  }, [spaces]);

  useEffect(() => {
    if (loreScrollRef.current) {
      loreScrollRef.current.scrollTop = loreScrollRef.current.scrollHeight;
    }
  }, [loreMessages, isLoreTyping]);

  // Global Escape key listener & body scroll locking for modals
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      activeTopicId ||
      showCreateTopicModal ||
      showCreateSpaceModal ||
      showLoreAiModal ||
      showPrivacyModal
    );

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeTopicId) setActiveTopicId(null);
        if (showCreateTopicModal) setShowCreateTopicModal(false);
        if (showCreateSpaceModal) setShowCreateSpaceModal(false);
        if (showLoreAiModal) setShowLoreAiModal(false);
        if (showPrivacyModal) setShowPrivacyModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeTopicId,
    showCreateTopicModal,
    showCreateSpaceModal,
    showLoreAiModal,
    showPrivacyModal,
  ]);

  const showToast = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Filtered Topics
  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchSpace = selectedSpaceFilter === 'all' || topic.communityId === selectedSpaceFilter;
      const matchQuery =
        searchQuery.trim() === '' ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        topic.author.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSpace && matchQuery;
    });
  }, [topics, selectedSpaceFilter, searchQuery]);

  const activeTopic = useMemo(() => {
    return topics.find((t) => t.id === activeTopicId) || null;
  }, [topics, activeTopicId]);

  const activeTopicComments = useMemo(() => {
    if (!activeTopicId) return [];
    return comments.filter((c) => c.topicId === activeTopicId);
  }, [comments, activeTopicId]);

  // Handle Like Topic
  const handleToggleLikeTopic = (topicId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const alreadyLiked = t.likedBy.includes(currentUser.id);
          const nextLikedBy = alreadyLiked
            ? t.likedBy.filter((id) => id !== currentUser.id)
            : [...t.likedBy, currentUser.id];
          return {
            ...t,
            likes: alreadyLiked ? t.likes - 1 : t.likes + 1,
            likedBy: nextLikedBy,
          };
        }
        return t;
      })
    );
  };

  // Handle Like Comment
  const handleToggleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const alreadyLiked = c.likedBy.includes(currentUser.id);
          const nextLikedBy = alreadyLiked
            ? c.likedBy.filter((id) => id !== currentUser.id)
            : [...c.likedBy, currentUser.id];
          return {
            ...c,
            likes: alreadyLiked ? c.likes - 1 : c.likes + 1,
            likedBy: nextLikedBy,
          };
        }
        return c;
      })
    );
  };

  // Handle Add Comment / Reply with Safety Guard
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopicId || !newCommentText.trim()) return;

    // 1. Suspension verification
    if (isCurrentUserBanned) {
      showToast('Posting blocked: Your account is suspended due to abusive behavior.');
      return;
    }

    // 2. Real-time LORE AI Abusive Language Pre-check
    const scan = scanTextForAbusiveLanguage(newCommentText);
    if (scan.isAbusive) {
      // Auto enforce temporary suspension
      autoEnforceAbusiveContent(newCommentText, currentUser);
      showToast(`Warning: LORE AI detected abusive language. Account suspended for ${scan.suggestedBanDays} days.`);
      return;
    }

    const newComment: RepinshComment = {
      id: `comm-${Date.now()}`,
      topicId: activeTopicId,
      parentId: replyingToCommentId || undefined,
      author: currentUser,
      content: newCommentText.trim(),
      createdAt: 'Just now',
      likes: 0,
      likedBy: [],
    };

    setComments((prev) => [...prev, newComment]);

    // Update topic comment count
    setTopics((prev) =>
      prev.map((t) => (t.id === activeTopicId ? { ...t, commentsCount: t.commentsCount + 1 } : t))
    );

    setNewCommentText('');
    setReplyingToCommentId(null);
    showToast('Your comment was posted to the discussion!');
  };

  // Handle Create New Topic with Safety Guard
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;

    // 1. Suspension verification
    if (isCurrentUserBanned) {
      showToast('Posting blocked: Your account is suspended due to abusive behavior.');
      return;
    }

    // 2. Real-time LORE AI Abusive Language Pre-check
    const fullText = `${newTopicTitle} ${newTopicContent}`;
    const scan = scanTextForAbusiveLanguage(fullText);
    if (scan.isAbusive) {
      autoEnforceAbusiveContent(fullText, currentUser);
      showToast(`Topic blocked: LORE AI detected abusive language. Account suspended for ${scan.suggestedBanDays} days.`);
      setShowCreateTopicModal(false);
      return;
    }

    const targetSpace = spaces.find((s) => s.id === newTopicSpaceId) || spaces[0];

    const tagsArray = newTopicTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const newTopic: RepinshTopic = {
      id: `topic-${Date.now()}`,
      communityId: targetSpace.id,
      communityName: targetSpace.name,
      title: newTopicTitle.trim(),
      content: newTopicContent.trim(),
      category: targetSpace.category,
      tags: tagsArray.length > 0 ? tagsArray : ['Discussion', 'REPINSH'],
      author: currentUser,
      createdAt: 'Just now',
      likes: 1,
      likedBy: [currentUser.id],
      views: 1,
      isPinned: false,
      commentsCount: 0,
    };

    setTopics([newTopic, ...topics]);

    // Increment space topic count
    setSpaces((prev) =>
      prev.map((s) => (s.id === targetSpace.id ? { ...s, topicCount: s.topicCount + 1 } : s))
    );

    // Reset Form
    setNewTopicTitle('');
    setNewTopicContent('');
    setNewTopicTags('');
    setShowCreateTopicModal(false);
    showToast('New topic published successfully to REPINSH Community!');
  };

  // Handle Create New Community Space
  const handleCreateSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim() || !newSpaceDescription.trim()) return;

    const rulesList = newSpaceRules
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const slug = newSpaceName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newSpace: RepinshSpace = {
      id: `space-${Date.now()}`,
      name: newSpaceName.trim(),
      slug: slug || 'custom-space',
      description: newSpaceDescription.trim(),
      icon: 'Users',
      category: newSpaceCategory,
      memberCount: 1,
      topicCount: 0,
      rules: rulesList.length > 0 ? rulesList : ['Be respectful and follow community guidelines.'],
      isPrivate: newSpaceIsPrivate,
      tags: [newSpaceCategory.replace(/\s+/g, ''), 'CommunitySpace'],
      createdAt: 'August 2026',
      moderator: currentUser.displayName,
    };

    setSpaces([...spaces, newSpace]);
    setNewSpaceName('');
    setNewSpaceDescription('');
    setNewSpaceRules('');
    setShowCreateSpaceModal(false);
    showToast('Community Space created! Added to the REPINSH ecosystem.');
  };

  // Handle LORE AI Question
  const handleSendLoreQuestion = (textToSend?: string) => {
    const queryText = (textToSend || loreInput).trim();
    if (!queryText) return;

    const userMsg: LoreAiMessage = {
      id: `msg-usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: 'Just now',
    };

    setLoreMessages((prev) => [...prev, userMsg]);
    setLoreInput('');
    setIsLoreTyping(true);

    setTimeout(() => {
      const answer = queryLoreAi(queryText);
      const loreMsg: LoreAiMessage = {
        id: `msg-lore-${Date.now()}`,
        sender: 'lore',
        text: answer,
        timestamp: 'Just now',
        suggestedActions: [
          { label: 'Explore Topics', action: 'How can I create a topic?' },
          { label: 'Community Guidelines', action: 'What are the community rules?' },
        ],
      };
      setLoreMessages((prev) => [...prev, loreMsg]);
      setIsLoreTyping(false);
    }, 450);
  };

  return (
    <section
      id="repinsh"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-slate-950 text-slate-100 overflow-hidden"
    >
      {/* Background Decorative Mesh / Neural Constellation */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 left-1/2 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        {/* Toast / Notification Banner */}
        <AnimatePresence>
          {actionNotice && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-sm shadow-2xl shadow-cyan-500/40 flex items-center gap-2 border border-cyan-300"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{actionNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. HERO SECTION: REPINSH™ INTRODUCTION */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-xl"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>A Technology Initiative by Ansh Singh</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-blue-400"
          >
            REPINSH™
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg sm:text-2xl font-sans font-semibold tracking-wide text-cyan-400"
          >
            AI Experts. Web Innovators.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto font-sans"
          >
            REPINSH™ is my technology and innovation initiative focused on exploring artificial intelligence, creating modern web applications, and building interactive digital experiences. It represents my interest in technology, creativity, and learning something new beyond the worlds I create through writing.
          </motion.p>

          {/* Action Callouts */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#repinsh-community"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm sm:text-base tracking-wide shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center gap-2"
            >
              <span>Explore REPINSH™</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => setShowLoreAiModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white font-bold text-sm sm:text-base tracking-wide transition-all flex items-center gap-2 shadow-lg"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Ask LORE AI</span>
            </button>
          </div>
        </div>

        {/* 2. ABOUT REPINSH™ & 4 CORE FEATURE PILLARS */}
        <div className="space-y-10">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>About the Organization</span>
            </h3>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-sans">
              Founded as a creative technology initiative, REPINSH™ focuses on experimenting with AI, developing innovative web applications, and creating digital platforms that bring ideas and people together. From intelligent tools to interactive communities, REPINSH™ is where technology and creativity meet.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REPINSH_FEATURE_PILLARS.map((pillar, idx) => {
              const IconComp =
                pillar.icon === 'Brain'
                  ? Brain
                  : pillar.icon === 'Layout'
                  ? Layers
                  : pillar.icon === 'Users'
                  ? Users
                  : Zap;

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-slate-950 p-2.5 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                      {pillar.tag}
                    </span>
                    <h4 className="text-lg font-serif font-bold text-slate-100">{pillar.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{pillar.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3. FEATURED PROJECT: REPINSH COMMUNITY (LIVE INTERACTIVE SHOWCASE) */}
        <div id="repinsh-community" className="space-y-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>Featured Showcase</span>
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif font-black text-slate-100">
                A New Way to Connect.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                REPINSH Community is a real-time platform designed for people to share ideas, create discussions, interact with others, and discover conversations from across the community.
              </p>
            </div>

            {/* Actions: Start Topic & Guest Profile */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowCreateTopicModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Start a Discussion</span>
              </button>

              <button
                onClick={() => setShowCreateSpaceModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Create Space</span>
              </button>

              {/* Guest Profile Chip */}
              <button
                onClick={openEditProfileModal}
                id="repinsh-profile-chip-btn"
                className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 cursor-pointer flex items-center gap-2.5 text-xs transition-colors group"
                title="Click to safely edit your display name and handle"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-[10px] group-hover:scale-105 transition-transform">
                  {currentUser.displayName[0] || 'U'}
                </div>
                <div className="text-left leading-tight">
                  <div className="font-bold text-slate-200 flex items-center gap-1">
                    <span>{currentUser.displayName}</span>
                    <Edit3 className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[10px] text-cyan-400">@{currentUser.handle} (Safe Name)</div>
                </div>
              </button>
            </div>
          </div>

          {/* Transparent Privacy & LORE AI Safety Notice Banner */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>
                <strong>Privacy-Safe & AI Guarded:</strong> Join discussions freely. LORE AI continuously scans for abusive language and enforces temporary suspensions to keep our community welcoming.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openSafetyLogModal}
                className="text-amber-300 hover:text-amber-100 font-semibold text-[11px] flex items-center gap-1"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Safety Logs</span>
              </button>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-cyan-300 hover:text-cyan-100 underline text-[11px] whitespace-nowrap"
              >
                How it works
              </button>
            </div>
          </div>

          {/* Community Navigation & Search Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* View Sub-Tabs */}
            <div className="flex items-center gap-2">
              {[
                { id: 'topics', label: 'Discussions', icon: MessageSquare },
                { id: 'spaces', label: 'Explore Spaces', icon: Users },
                { id: 'network', label: 'Network Ecosystem', icon: Radio },
              ].map((tab) => {
                const isActive = activeCommunityTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCommunityTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/30'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics, tags, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          {activeCommunityTab === 'topics' && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Filter:</span>
              <button
                onClick={() => setSelectedSpaceFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedSpaceFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                All Topics ({topics.length})
              </button>
              {spaces.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => setSelectedSpaceFilter(sp.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                    selectedSpaceFilter === sp.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{sp.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* TAB 1: TOPICS LIST */}
          {activeCommunityTab === 'topics' && (
            <div className="space-y-4">
              {filteredTopics.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">No discussions match your query.</p>
                  <p className="text-xs text-slate-500">Be the first to start a conversation in this space!</p>
                  <button
                    onClick={() => setShowCreateTopicModal(true)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Start a Discussion
                  </button>
                </div>
              ) : (
                filteredTopics.map((topic) => {
                  const isLikedByMe = topic.likedBy.includes(currentUser.id);

                  return (
                    <motion.div
                      key={topic.id}
                      onClick={() => setActiveTopicId(topic.id)}
                      whileHover={{ y: -2 }}
                      className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer space-y-4 shadow-lg group"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-slate-950 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
                            {topic.author.displayName[0]}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                              <span>{topic.author.displayName}</span>
                              {topic.author.badges?.includes('Founder') && (
                                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[9px] font-bold">
                                  FOUNDER
                                </span>
                              )}
                              {topic.isPinned && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-bold">
                                  PINNED
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">{topic.createdAt} • in {topic.communityName}</span>
                          </div>
                        </div>

                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{topic.commentsCount} replies</span>
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-lg sm:text-xl font-serif font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {topic.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                          {topic.content}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {topic.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openReportModal({
                                targetType: 'topic',
                                targetId: topic.id,
                                targetContent: `${topic.title} - ${topic.content}`,
                                authorId: topic.author.id,
                                authorName: topic.author.displayName,
                                authorHandle: topic.author.handle,
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs text-slate-500 hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-500/30 transition-all flex items-center gap-1"
                            title="Report abusive content to LORE AI Guardian"
                          >
                            <Flag className="w-3 h-3" />
                            <span className="hidden sm:inline text-[11px]">Report</span>
                          </button>

                          <button
                            onClick={(e) => handleToggleLikeTopic(topic.id, e)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                              isLikedByMe
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLikedByMe ? 'fill-rose-400 text-rose-400' : ''}`} />
                            <span>{topic.likes}</span>
                          </button>

                          <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>Open Thread</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: SPACES LIST */}
          {activeCommunityTab === 'spaces' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spaces.map((sp) => (
                <div
                  key={sp.id}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-serif font-bold text-slate-100">{sp.name}</h4>
                          <span className="text-[10px] text-cyan-400">/{sp.slug} • {sp.category}</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                        {sp.topicCount} discussions
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{sp.description}</p>

                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Space Guidelines:
                      </span>
                      <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px]">
                        {sp.rules.slice(0, 2).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">Moderator: {sp.moderator}</span>
                    <button
                      onClick={() => {
                        setSelectedSpaceFilter(sp.id);
                        setActiveCommunityTab('topics');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold transition-all"
                    >
                      View Space Topics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: NETWORK ECOSYSTEM & VISUAL NODE ILLUSTRATION */}
          {activeCommunityTab === 'network' && (
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl text-center">
              <div className="space-y-2 max-w-2xl mx-auto">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider inline-block">
                  Federated Architecture
                </span>
                <h4 className="text-2xl font-serif font-bold text-slate-100">
                  The REPINSH Distributed Space Network
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Independent community spaces connect to the core REPINSH hub through local-first state channels.
                </p>
              </div>

              {/* Visual Connected Network Diagram */}
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative overflow-hidden my-4 min-h-[300px] flex items-center justify-center">
                <div className="relative w-full max-w-lg h-64">
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 flex flex-col items-center justify-center text-slate-950 font-black shadow-2xl shadow-cyan-500/50 z-20">
                    <Brain className="w-6 h-6 text-slate-950 animate-pulse" />
                    <span className="text-[11px] tracking-tight">REPINSH™ HUB</span>
                  </div>

                  {/* Outer Nodes */}
                  {[
                    { title: 'AI & ML Hub', pos: 'top-2 left-4', icon: Cpu },
                    { title: 'Web Innovators', pos: 'top-2 right-4', icon: Globe },
                    { title: 'Creative Tech', pos: 'bottom-2 left-4', icon: Sparkles },
                    { title: 'Open Lab', pos: 'bottom-2 right-4', icon: Users },
                  ].map((node, i) => (
                    <div
                      key={i}
                      className={`absolute ${node.pos} p-3 rounded-2xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-2 shadow-xl z-20`}
                    >
                      <node.icon className="w-4 h-4 text-cyan-400" />
                      <span>{node.title}</span>
                    </div>
                  ))}

                  {/* Connecting SVG lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                </div>
              </div>

              {/* Status Callout */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-300 text-xs font-semibold max-w-xl mx-auto flex items-center justify-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>
                  Worldwide decentralized server clustering status: <strong>In Active Development / Coming Soon</strong>.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4. TECHNOLOGY & INNOVATION SHOWCASE */}
        <div className="space-y-8 pt-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Core Tech Stack
            </span>
            <h3 className="text-3xl font-serif font-black text-slate-100">
              Technology & Innovation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              The technical foundations empowering REPINSH™ intelligent tools, reactive interfaces, and digital communities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REPINSH_TECH_STACK.map((tech, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h4 className="text-base font-serif font-bold text-cyan-300">{tech.name}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{tech.description}</p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-[11px]">
                  {tech.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. DUAL CREATIVE JOURNEY INTEGRATION */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-6 shadow-2xl">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              The Dual Journey
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
              Connecting Stories & Technology
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Writing and technology are two sides of the same creative vision by Ansh Singh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Storytelling Side */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Author & Storytelling</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Epic fantasy sagas and deep romantic fiction exploring human emotion, sacrifice, and vast mythical realms (*The Lost Soul of Throne*, *Until Death Found Us Again*).
              </p>
              <a
                href="#books"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
              >
                <span>Explore Books</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* REPINSH Side */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Cpu className="w-4 h-4" />
                <span>REPINSH™ Technology</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Artificial intelligence exploration, interactive web architectures, digital community hubs, and future digital experiences.
              </p>
              <a
                href="#repinsh-community"
                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
              >
                <span>Participate in Discussions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 6. FINAL POSITIONING FOOTER */}
        <div className="text-center pt-10 border-t border-slate-900 space-y-3">
          <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-100 tracking-tight">
            REPINSH™
          </h3>
          <p className="text-xs sm:text-sm font-bold text-cyan-400 tracking-widest uppercase">
            AI Experts. Web Innovators.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 italic font-serif">
            "Exploring ideas. Building experiences. Innovating for what's next."
          </p>
          <div className="pt-2 text-xs font-bold text-slate-300">
            A Technology Initiative by Ansh Singh.
          </div>
        </div>
      </div>

      {/* MODAL 1: DISCUSSION THREAD DETAIL */}
      <AnimatePresence>
        {activeTopic && (
          <div
            onClick={() => setActiveTopicId(null)}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[88vh] rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden my-auto"
            >
              {/* Modal Header (Sticky) */}
              <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md flex items-start justify-between gap-4 sticky top-0 z-20">
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                      {activeTopic.communityName}
                    </span>
                    <span className="text-[10px] text-slate-500 hidden sm:inline">• Press Esc to close</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 leading-snug">
                    {activeTopic.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>By <strong className="text-slate-300">{activeTopic.author.displayName}</strong></span>
                    <span>• {activeTopic.createdAt}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTopicId(null)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold flex-shrink-0 shadow-sm"
                  title="Close discussion (Esc)"
                  aria-label="Close discussion"
                >
                  <X className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>

              {/* Modal Scroll Content */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                {/* Topic Body */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                  {activeTopic.content}
                </div>

                {/* Tags, Topic Likes & Report Trigger */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {activeTopic.tags.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-900 text-[10px] text-cyan-400 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        openReportModal({
                          targetType: 'topic',
                          targetId: activeTopic.id,
                          targetContent: `${activeTopic.title} - ${activeTopic.content}`,
                          authorId: activeTopic.author.id,
                          authorName: activeTopic.author.displayName,
                          authorHandle: activeTopic.author.handle,
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-950/30 border border-slate-800 hover:border-red-500/30 transition-all flex items-center gap-1.5"
                      title="Report abusive content"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Report Thread</span>
                    </button>

                    <button
                      onClick={() => handleToggleLikeTopic(activeTopic.id)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        activeTopic.likedBy.includes(currentUser.id)
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-slate-900 text-slate-300 border border-slate-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${activeTopic.likedBy.includes(currentUser.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
                      <span>{activeTopic.likes} Likes</span>
                    </button>
                  </div>
                </div>

                {/* Comments Thread */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Replies ({activeTopicComments.length})</span>
                  </h4>

                  {activeTopicComments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No replies yet. Share your thoughts below!</p>
                  ) : (
                    activeTopicComments.map((comm) => {
                      const isCommLiked = comm.likedBy.includes(currentUser.id);
                      return (
                        <div
                          key={comm.id}
                          className={`p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 ${
                            comm.parentId ? 'ml-6 border-l-2 border-l-cyan-500/50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-200">{comm.author.displayName}</span>
                              {comm.author.badges?.includes('Founder') && (
                                <span className="px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                                  FOUNDER
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">• {comm.createdAt}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  openReportModal({
                                    targetType: 'comment',
                                    targetId: comm.id,
                                    targetContent: comm.content,
                                    authorId: comm.author.id,
                                    authorName: comm.author.displayName,
                                    authorHandle: comm.author.handle,
                                  });
                                }}
                                className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                                title="Report this reply"
                              >
                                <Flag className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => handleToggleLikeComment(comm.id)}
                                className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 ${
                                  isCommLiked ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                <Heart className={`w-3 h-3 ${isCommLiked ? 'fill-rose-400' : ''}`} />
                                <span>{comm.likes}</span>
                              </button>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{comm.content}</p>

                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => {
                                setReplyingToCommentId(comm.id);
                                setNewCommentText(`@${comm.author.handle} `);
                              }}
                              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Modal Footer / Add Comment Input Bar */}
              {isCurrentUserBanned ? (
                <div className="p-4 border-t border-red-500/30 bg-red-950/40 flex items-center justify-between text-xs text-red-300">
                  <span className="flex items-center gap-2">
                    <LockKeyhole className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>Commenting is temporarily suspended on your account.</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openSafetyLogModal}
                      className="underline text-red-200 font-bold"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setActiveTopicId(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 text-xs font-semibold ml-2"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <form onSubmit={handleAddComment} className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder={replyingToCommentId ? 'Writing reply...' : 'Post a respectful comment...'}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-colors flex-shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </form>
                  <button
                    type="button"
                    onClick={() => setActiveTopicId(null)}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors border border-slate-800 flex items-center justify-center gap-1 flex-shrink-0"
                  >
                    <span>Close Discussion</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: START A TOPIC */}
      <AnimatePresence>
        {showCreateTopicModal && (
          <div
            onClick={() => setShowCreateTopicModal(false)}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg w-full rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl p-6 space-y-5 my-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-serif font-bold text-slate-100 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-cyan-400" />
                  <span>Create Discussion Topic</span>
                </h3>
                <button
                  onClick={() => setShowCreateTopicModal(false)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Target Community Space</label>
                  <select
                    value={newTopicSpaceId}
                    onChange={(e) => setNewTopicSpaceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {spaces.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name} ({sp.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Topic Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How to structure reactive state in Web apps"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Discussion Body</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your perspective, question, or research..."
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="AI, WebDev, Innovation"
                    value={newTopicTags}
                    onChange={(e) => setNewTopicTags(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateTopicModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                  >
                    Publish Topic
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CREATE COMMUNITY SPACE */}
      <AnimatePresence>
        {showCreateSpaceModal && (
          <div
            onClick={() => setShowCreateSpaceModal(false)}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg w-full rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl p-6 space-y-5 my-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-serif font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>Create Your Own Space</span>
                </h3>
                <button
                  onClick={() => setShowCreateSpaceModal(false)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSpace} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Space Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next-Gen Generative Audio"
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={newSpaceCategory}
                    onChange={(e) => setNewSpaceCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Creative Tech">Creative Tech</option>
                    <option value="General Discourse">General Discourse</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what conversations happen in this space..."
                    value={newSpaceDescription}
                    onChange={(e) => setNewSpaceDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Community Rules (one per line)</label>
                  <textarea
                    rows={2}
                    placeholder="1. Keep discussions constructive&#10;2. Share code examples when possible"
                    value={newSpaceRules}
                    onChange={(e) => setNewSpaceRules(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateSpaceModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                  >
                    Launch Space
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: LORE AI ASSISTANT CHAT */}
      <AnimatePresence>
        {showLoreAiModal && (
          <div
            onClick={() => setShowLoreAiModal(false)}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-xl w-full h-[620px] max-h-[90vh] rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden my-auto"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-slate-100 flex items-center gap-1.5">
                      <span>LORE AI</span>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                        GUIDE
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400">Your Intelligent Guide, Powered by REPINSH™</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowLoreAiModal(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-900"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Message Stream */}
              <div ref={loreScrollRef} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
                {loreMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
                  >
                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                        msg.sender === 'user'
                          ? 'bg-cyan-500 text-slate-950 font-medium'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 whitespace-pre-line'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Suggested Prompt Chips */}
                    {msg.suggestedActions && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendLoreQuestion(action.action)}
                            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-[11px] transition-colors"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isLoreTyping && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400 italic">
                    <Bot className="w-3.5 h-3.5 animate-spin" />
                    <span>LORE AI is formulating answer...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendLoreQuestion();
                }}
                className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask anything about REPINSH, topics, spaces, rules..."
                  value={loreInput}
                  onChange={(e) => setLoreInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 6: TRANSPARENT PRIVACY EXPLANATION */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div
            onClick={() => setShowPrivacyModal(false)}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg w-full rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl p-6 space-y-4 my-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-serif font-bold text-slate-100 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span>How Privacy & Guest Mode Work</span>
                </h3>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  In REPINSH Community, we believe digital participation should not require surrendering personal data, phone numbers, or passwords.
                </p>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                  <span className="font-bold text-cyan-400">Our Privacy Principles:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>Zero third-party advertising cookies or trackers.</li>
                    <li>No email address or password verification required to read or post.</li>
                    <li>All guest identities reside in your browser's local sandbox.</li>
                    <li>You have 100% control to reset your pseudonym whenever you choose.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Ask LORE AI Quick Launcher */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setShowLoreAiModal(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl shadow-cyan-500/50 flex items-center gap-2 border border-cyan-300 cursor-pointer"
        title="Open LORE AI Assistant"
      >
        <Bot className="w-4 h-4 text-slate-950" />
        <span>Ask LORE AI</span>
      </motion.button>
    </section>
  );
};
