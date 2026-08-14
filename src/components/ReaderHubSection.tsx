import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Quote as QuoteIcon, HelpCircle, Mail, Send, ThumbsUp, ThumbsDown, Copy, Check, Bot, User, Clock, Heart, Volume2, VolumeX, RotateCcw, Flame, Swords, Shield, Feather, BookOpen, Sparkle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_GUESTBOOK, QUIZ_QUESTIONS, QUOTES_COLLECTION, CHARACTERS_DATA } from '../data/authorData';
import { GuestbookEntry, Quote, Character } from '../types';

type PersonaType = 'lore_concierge' | 'kaelen' | 'ren' | 'yuki' | 'ansh_author';

interface PersonaConfig {
  id: PersonaType;
  name: string;
  role: string;
  badge: string;
  avatarBg: string;
  avatarText: string;
  welcomeMsg: string;
  prompts: string[];
}

const PERSONAS: Record<PersonaType, PersonaConfig> = {
  lore_concierge: {
    id: 'lore_concierge',
    name: 'Lore Archivist',
    role: 'Official World & Book Guide',
    badge: 'Master Archivist',
    avatarBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    avatarText: '📜',
    welcomeMsg: "Greetings, Traveler! I am the Master Lore Archivist for Ansh Singh's literary realms. Ask me anything about 'The Lost Soul of Throne', 'Until Death Found Us Again', dragon bloodlines, Aetherium magic, kingdom geography, or Ansh's story!",
    prompts: [
      "🐉 Explain the Aetherium Resonance magic system",
      "🏰 Tell me about Valyria Dominion & Solaris Citadel",
      "💖 What is the story of 'Until Death Found Us Again'?",
      "👑 Who is Prince Kaelen Aurelius?",
      "🐇 Tell me about Ansh's pet rabbit Tonny!"
    ]
  },
  kaelen: {
    id: 'kaelen',
    name: 'Prince Kaelen',
    role: 'Crown Heir & Dragon Wielder',
    badge: 'The Lost Soul of Throne',
    avatarBg: 'bg-red-500/20 text-red-400 border-red-500/40',
    avatarText: '👑',
    welcomeMsg: "By the fire of House Aurelius, I greet you! I am Crown Prince Kaelen Aurelius, rider of apex dragons. Ask me of our sacred vows, dragon mounts, or the obsidian throne of Valyria.",
    prompts: [
      "🐉 How do you bond with an apex dragon?",
      "👑 What is your vow regarding the obsidian throne?",
      "⚔️ Tell me about House Aurelius & House Frostfang",
      "🔥 What is Solar Blaze magic?"
    ]
  },
  ren: {
    id: 'ren',
    name: 'Ren Takahashi',
    role: 'Reincarnated Swordmaster',
    badge: 'Until Death Found Us Again',
    avatarBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    avatarText: '⚔️',
    welcomeMsg: "I'm Ren Takahashi. Though a new world of magic surrounds me at Aethelgard Academy, my past memories in Tokyo and my oath to protect Yuki remain unbroken across lifetimes. What would you ask of me?",
    prompts: [
      "🌸 How did you find Yuki across lifetimes?",
      "⚔️ How does your Wind Blade affinity work?",
      "🏫 What is life like at Aethelgard Magic Academy?",
      "🌧️ Tell me about that rainy day in Tokyo"
    ]
  },
  yuki: {
    id: 'yuki',
    name: 'Yuki Aizawa',
    role: 'Celestial Weaver',
    badge: 'Until Death Found Us Again',
    avatarBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    avatarText: '✨',
    welcomeMsg: "Greetings. I am Yuki Aizawa, Celestial Weaver of Starlight. Fate may pull us apart, but love is the one bond even death cannot diminish. Ask me of starlight harmony, memories, or our destiny.",
    prompts: [
      "✨ How does Celestial Starlight Magic work?",
      "💖 What memories returned from your past life?",
      "🌸 Tell me about your bond with Ren"
    ]
  },
  ansh_author: {
    id: 'ansh_author',
    name: 'Ansh Singh (AI)',
    role: 'Student & Author',
    badge: 'Author Q&A',
    avatarBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    avatarText: '✍️',
    welcomeMsg: "Hey there! I'm AI Ansh Singh! 🎉 Huge announcement: Volume 1 of 'The Lost Soul of Throne' is officially releasing as a physical Paperback Edition on my birthday, 16th August, exclusively on Amazon! Ask me about the release, my writing routine, or Tonny my pet rabbit!",
    prompts: [
      "🎉 Tell me about the 16th August Paperback release on Amazon!",
      "✍️ How do you balance school and writing novels?",
      "🐇 Tell me all about your pet rabbit Tonny!",
      "🌟 Who inspired you to become an author?",
      "👑 What can readers expect in Volume 1 of The Lost Soul of Throne?"
    ]
  }
};

export const ReaderHubSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'aiChat' | 'guestbook' | 'quiz' | 'quotes' | 'newsletter'>('aiChat');

  // AI Chat State
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('lore_concierge');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string; id: string; liked?: boolean }[]>([
    {
      id: 'init_msg',
      role: 'model',
      text: PERSONAS['lore_concierge'].welcomeMsg
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  // Guestbook & Review State
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(INITIAL_GUESTBOOK);
  const [gbName, setGbName] = useState('');
  const [gbEmail, setGbEmail] = useState('');
  const [gbLocation, setGbLocation] = useState('');
  const [gbMessage, setGbMessage] = useState('');
  const [gbBadge, setGbBadge] = useState('Fantasy Lover');
  const [gbRating, setGbRating] = useState('5');
  const [gbBookTitle, setGbBookTitle] = useState('The Lost Soul of Throne');
  const [gbSubmitting, setGbSubmitting] = useState(false);
  const [gbSentNotice, setGbSentNotice] = useState<string | null>(null);

  // Quote Generator State
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<Character | null>(null);

  // Newsletter State
  const [nlEmail, setNlEmail] = useState('');
  const [nlSubscribed, setNlSubscribed] = useState(false);

  // Handle Persona Change
  const handleSelectPersona = (pId: PersonaType) => {
    setCurrentPersona(pId);
    setChatMessages([
      {
        id: `msg_${Date.now()}`,
        role: 'model',
        text: PERSONAS[pId].welcomeMsg
      }
    ]);
  };

  // AI Chat Handler
  const handleSendChatMessage = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const userText = (customMsg || inputMsg).trim();
    if (!userText || isTyping) return;

    setInputMsg('');
    const userMsgId = `usr_${Date.now()}`;
    const newChatList = [...chatMessages, { id: userMsgId, role: 'user' as const, text: userText }];
    setChatMessages(newChatList);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: newChatList.slice(-6).map(m => ({ role: m.role, text: m.text })),
          persona: currentPersona,
        })
      });

      const data = await res.json();
      const replyText = data.reply || "Ansh's stories are unfolding! Ask me about character backstories or dragon lore.";
      setChatMessages((prev) => [...prev, { id: `mod_${Date.now()}`, role: 'model', text: replyText }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `mod_${Date.now()}`,
          role: 'model',
          text: "Thank you for asking! 'The Lost Soul of Throne' features epic dragon lords and ancient thrones, while 'Until Death Found Us Again' explores reincarnation across lifetimes!"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Text-To-Speech Read Aloud
  const handleToggleSpeak = (msgId: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingMsgId === msgId) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setSpeakingMsgId(null);
        utterance.onerror = () => setSpeakingMsgId(null);
        setSpeakingMsgId(msgId);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Copy Message
  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Toggle Like Message
  const handleToggleLike = (msgId: string) => {
    setChatMessages(chatMessages.map(m => m.id === msgId ? { ...m, liked: !m.liked } : m));
  };

  // Clear Chat History
  const handleClearChat = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setChatMessages([
      {
        id: `msg_${Date.now()}`,
        role: 'model',
        text: PERSONAS[currentPersona].welcomeMsg
      }
    ]);
  };

  // Formatted Text Renderer (Markdown-like formatting)
  const renderFormattedText = (text: string) => {
    const paragraphs = text.split('\n\n');
    return paragraphs.map((para, pIdx) => {
      const lines = para.split('\n');
      return (
        <div key={pIdx} className="mb-2.5 last:mb-0">
          {lines.map((line, lIdx) => {
            const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ') || line.trim().startsWith('• ');
            let cleanLine = line.trim();
            if (isBullet) {
              cleanLine = cleanLine.replace(/^[*•-]\s*/, '');
            }

            const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

            return (
              <div key={lIdx} className={`${isBullet ? 'flex items-start gap-2 my-1 pl-2' : ''}`}>
                {isBullet && <span className="text-amber-400 font-bold">•</span>}
                <span className="flex-1">
                  {parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className="font-bold text-amber-300">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </span>
              </div>
            );
          })}
        </div>
      );
    });
  };

  // Guestbook & Review Handler
  const handleSignGuestbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gbName.trim() || !gbMessage.trim() || gbSubmitting) return;

    setGbSubmitting(true);
    setGbSentNotice(null);

    const newEntry: GuestbookEntry = {
      id: `gb_${Date.now()}`,
      name: gbName.trim(),
      location: gbLocation.trim() || 'Global Reader',
      message: gbMessage.trim(),
      date: new Date().toISOString().split('T')[0],
      likes: 1,
      badge: `${gbBadge} • ${'★'.repeat(Number(gbRating))}`
    };

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: gbName.trim(),
          email: gbEmail.trim() || 'anshsureshsingh07@gmail.com',
          bookTitle: gbBookTitle,
          rating: gbRating,
          reviewText: gbMessage.trim(),
          badge: gbBadge,
          location: gbLocation.trim() || 'Global Reader',
        })
      });
      setGbSentNotice('Your review & message was dispatched directly to Ansh Singh (anshsureshsingh07@gmail.com)!');
    } catch (err) {
      setGbSentNotice('Review saved locally and prepped for anshsureshsingh07@gmail.com.');
    } finally {
      setGbSubmitting(false);
      setGuestbook([newEntry, ...guestbook]);
      setGbName('');
      setGbEmail('');
      setGbLocation('');
      setGbMessage('');

      confetti({ particleCount: 75, spread: 65, origin: { y: 0.7 } });
    }
  };

  const handleLikeMessage = (id: string) => {
    setGuestbook(guestbook.map(entry => entry.id === id ? { ...entry, likes: entry.likes + 1 } : entry));
  };

  // Random Quote
  const handleRandomQuote = () => {
    let nextIdx = Math.floor(Math.random() * QUOTES_COLLECTION.length);
    if (nextIdx === currentQuoteIdx) nextIdx = (nextIdx + 1) % QUOTES_COLLECTION.length;
    setCurrentQuoteIdx(nextIdx);
  };

  const handleCopyQuote = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quiz Handler
  const handleSelectQuizOption = (qId: number, charId: string) => {
    setQuizAnswers({ ...quizAnswers, [qId]: charId });
  };

  const handleCalculateQuiz = () => {
    const tally: Record<string, number> = {};
    Object.values(quizAnswers).forEach((cId: string) => {
      tally[cId] = (tally[cId] || 0) + 1;
    });

    let topCharId = 'kaelen';
    let maxVotes = 0;
    Object.entries(tally).forEach(([cId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        topCharId = cId;
      }
    });

    const matchChar = CHARACTERS_DATA.find(c => c.id === topCharId) || CHARACTERS_DATA[0];
    setQuizResult(matchChar);
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
  };

  // Newsletter Handler
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail.trim()) return;
    setNlSubscribed(true);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <section id="reader-hub" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Sanctuary</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
            Reader <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Hub</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Engage with AI book lore, converse with character personas, take quizzes, sign the guestbook, and explore.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        {/* Hub Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('aiChat')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'aiChat' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Lore Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('guestbook')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'guestbook' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Visitor Guestbook</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'quiz' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Character Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'quotes' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <QuoteIcon className="w-4 h-4" />
            <span>Random Quote Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'newsletter' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Newsletter</span>
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="rounded-3xl bg-slate-900/90 border border-amber-500/20 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* TAB 1: AI Chat About My Books */}
          {activeTab === 'aiChat' && (
            <div className="flex flex-col h-[600px]">
              {/* Header & Persona Selector Bar */}
              <div className="pb-4 border-b border-slate-800 mb-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border flex items-center justify-center text-lg ${PERSONAS[currentPersona].avatarBg}`}>
                      <span>{PERSONAS[currentPersona].avatarText}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-lg text-slate-100">{PERSONAS[currentPersona].name}</h3>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                          {PERSONAS[currentPersona].badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{PERSONAS[currentPersona].role}</p>
                    </div>
                  </div>

                  {/* Clear Chat Button */}
                  <button
                    onClick={handleClearChat}
                    title="Clear chat history"
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Reset Conversation</span>
                  </button>
                </div>

                {/* Persona Mode Switcher Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex-shrink-0 mr-1">
                    Persona:
                  </span>
                  {(Object.keys(PERSONAS) as PersonaType[]).map((pKey) => {
                    const personaItem = PERSONAS[pKey];
                    const isActive = currentPersona === pKey;
                    return (
                      <button
                        key={pKey}
                        onClick={() => handleSelectPersona(pKey)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                            : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span>{personaItem.avatarText}</span>
                        <span>{personaItem.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat Message Window */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 mb-3 scrollbar-thin scrollbar-thumb-amber-500/20">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`p-2 rounded-xl flex-shrink-0 flex items-center justify-center text-sm ${
                      msg.role === 'user' ? 'bg-amber-500 text-slate-950 font-bold' : PERSONAS[currentPersona].avatarBg
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <span>{PERSONAS[currentPersona].avatarText}</span>}
                    </div>

                    <div className={`p-4 rounded-2xl max-w-xl text-sm leading-relaxed relative group ${
                      msg.role === 'user'
                        ? 'bg-amber-500/20 border border-amber-500/30 text-slate-100'
                        : 'bg-slate-950 border border-slate-800/90 text-slate-200 shadow-lg'
                    }`}>
                      {renderFormattedText(msg.text)}

                      {/* AI Response Tools */}
                      {msg.role === 'model' && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            title="Copy response"
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-all flex items-center gap-1"
                          >
                            {copiedMsgId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="text-[10px]">{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => handleToggleSpeak(msg.id, msg.text)}
                            title="Read response aloud"
                            className={`p-1 rounded hover:bg-slate-800 transition-all flex items-center gap-1 ${
                              speakingMsgId === msg.id ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-amber-400'
                            }`}
                          >
                            {speakingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5 animate-pulse text-amber-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                            <span className="text-[10px]">{speakingMsgId === msg.id ? 'Stop' : 'Listen'}</span>
                          </button>

                          <button
                            onClick={() => handleToggleLike(msg.id)}
                            title="Like this response"
                            className={`p-1 rounded hover:bg-slate-800 transition-all flex items-center gap-1 ${
                              msg.liked ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-amber-400'
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${msg.liked ? 'fill-amber-400' : ''}`} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-amber-400 italic p-2 bg-slate-950/50 rounded-xl border border-slate-800/50 w-fit">
                    <Bot className="w-4 h-4 animate-spin text-amber-400" />
                    <span>{PERSONAS[currentPersona].name} is drafting a response from ancient archives...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 flex-shrink-0">
                  Try asking:
                </span>
                {PERSONAS[currentPersona].prompts.map((promptText, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendChatMessage(undefined, promptText)}
                    disabled={isTyping}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 text-slate-300 hover:text-amber-300 text-[11px] font-medium whitespace-nowrap transition-all flex-shrink-0"
                  >
                    {promptText}
                  </button>
                ))}
              </div>

              {/* Chat Form Input */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder={`Ask ${PERSONAS[currentPersona].name} a question...`}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim() || isTyping}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Visitor Guestbook & Reviews */}
          {activeTab === 'guestbook' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-bold text-lg text-amber-300">Submit Review & Message</h3>
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    To: anshsureshsingh07@gmail.com
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Share your book review or guestbook entry. Submissions are saved and dispatched directly to Ansh Singh!
                </p>

                {gbSentNotice && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                    <span>{gbSentNotice}</span>
                  </div>
                )}

                <form onSubmit={handleSignGuestbook} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={gbName}
                        onChange={(e) => setGbName(e.target.value)}
                        placeholder="e.g. Maya Lin"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Your Email</label>
                      <input
                        type="email"
                        value={gbEmail}
                        onChange={(e) => setGbEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Select Book</label>
                      <select
                        value={gbBookTitle}
                        onChange={(e) => setGbBookTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      >
                        <option value="The Lost Soul of Throne">The Lost Soul of Throne</option>
                        <option value="Until Death Found Us Again">Until Death Found Us Again</option>
                        <option value="General Author Review">General Author Review</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Rating</label>
                      <select
                        value={gbRating}
                        onChange={(e) => setGbRating(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      >
                        <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                        <option value="4">★★★★☆ (4 Stars - Great Read)</option>
                        <option value="3">★★★☆☆ (3 Stars - Good)</option>
                        <option value="2">★★☆☆☆ (2 Stars)</option>
                        <option value="1">★☆☆☆☆ (1 Star)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Location</label>
                      <input
                        type="text"
                        value={gbLocation}
                        onChange={(e) => setGbLocation(e.target.value)}
                        placeholder="e.g. Surat / London"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Reader Badge</label>
                      <select
                        value={gbBadge}
                        onChange={(e) => setGbBadge(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Fantasy Lover">Fantasy Lover</option>
                        <option value="Dragon Wielder">Dragon Wielder</option>
                        <option value="Romance Dreamer">Romance Dreamer</option>
                        <option value="Early Reader">Early Reader</option>
                        <option value="Fellow Student">Fellow Student</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Review & Message *</label>
                    <textarea
                      required
                      rows={3}
                      value={gbMessage}
                      onChange={(e) => setGbMessage(e.target.value)}
                      placeholder="Write your review or note for Ansh..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={gbSubmitting}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all"
                  >
                    {gbSubmitting ? 'Dispatching Review...' : 'Post & Send Review to Ansh'}
                  </button>
                </form>
              </div>

              {/* Guestbook Stream */}
              <div className="lg:col-span-7 space-y-4 max-h-[460px] overflow-y-auto pr-2">
                {guestbook.map((entry) => (
                  <div key={entry.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-amber-500/30 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-serif font-bold text-slate-100 text-base">{entry.name}</h4>
                        <p className="text-xs text-slate-400">{entry.location} • {entry.date}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold">
                        {entry.badge}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-3 font-sans">
                      "{entry.message}"
                    </p>
                    <button
                      onClick={() => handleLikeMessage(entry.id)}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-semibold"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{entry.likes} Likes</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Character Quiz */}
          {activeTab === 'quiz' && (
            <div className="max-w-2xl mx-auto text-center">
              {!quizResult ? (
                <div>
                  <h3 className="font-serif text-2xl font-bold text-amber-300 mb-2">
                    Which Character Are You?
                  </h3>
                  <p className="text-xs text-slate-400 mb-8">
                    Answer 3 questions to uncover your destiny in Ansh Singh's book realms.
                  </p>

                  <div className="space-y-8 text-left">
                    {QUIZ_QUESTIONS.map((q) => (
                      <div key={q.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                        <h4 className="font-serif text-base font-bold text-slate-100 mb-4">
                          {q.id}. {q.question}
                        </h4>
                        <div className="space-y-2.5">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectQuizOption(q.id, opt.characterId)}
                              className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${
                                quizAnswers[q.id] === opt.characterId
                                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleCalculateQuiz}
                    disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                    className="mt-8 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20"
                  >
                    Discover Your Character Result
                  </button>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-slate-950 border border-amber-400/50 shadow-2xl text-center animate-in zoom-in-95">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase">
                    Your Character Match
                  </span>
                  <h3 className="font-serif text-3xl font-extrabold text-slate-100 mt-3 mb-1">
                    {quizResult.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-bold mb-4">{quizResult.role} • {quizResult.bookTitle}</p>

                  <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto mb-6">
                    {quizResult.description}
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-serif italic text-amber-300 text-xs mb-6">
                    "{quizResult.quote}"
                  </div>

                  <button
                    onClick={() => { setQuizResult(null); setQuizAnswers({}); }}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Random Quote Generator */}
          {activeTab === 'quotes' && (
            <div className="max-w-xl mx-auto text-center py-6">
              <div className="p-8 rounded-3xl bg-slate-950 border border-amber-500/30 shadow-2xl relative mb-6">
                <QuoteIcon className="w-8 h-8 text-amber-500/20 absolute top-4 left-4" />
                <span className="text-xs text-amber-400 font-bold uppercase tracking-widest block mb-4">
                  {QUOTES_COLLECTION[currentQuoteIdx].category}
                </span>

                <blockquote className="font-serif italic text-xl sm:text-2xl text-slate-100 leading-relaxed mb-6">
                  "{QUOTES_COLLECTION[currentQuoteIdx].text}"
                </blockquote>

                <p className="text-xs text-amber-300/90 font-bold">
                  — {QUOTES_COLLECTION[currentQuoteIdx].source}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleRandomQuote}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate New Quote</span>
                </button>

                <button
                  onClick={() => handleCopyQuote(QUOTES_COLLECTION[currentQuoteIdx].text)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center gap-2 border border-slate-700"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Quote'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Newsletter */}
          {activeTab === 'newsletter' && (
            <div className="max-w-xl mx-auto text-center py-6">
              {!nlSubscribed ? (
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-100 mb-2">
                    Subscribe to Book Launch Alerts
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
                    Receive early chapter previews, character concept art releases, and official publication announcements straight to your inbox.
                  </p>

                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      value={nlEmail}
                      onChange={(e) => setNlEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-slate-950 border border-emerald-500/40 text-center animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-100 mb-2">You're on the Reader List!</h3>
                  <p className="text-xs text-slate-300">
                    Thank you for joining Ansh Singh's literary inner circle. Look out for secret chapter excerpts!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
