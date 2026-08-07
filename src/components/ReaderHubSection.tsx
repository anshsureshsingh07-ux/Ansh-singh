import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageSquare, Quote as QuoteIcon, HelpCircle, Mail, Send, ThumbsUp, Copy, Check, Bot, User, Clock, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_GUESTBOOK, QUIZ_QUESTIONS, QUOTES_COLLECTION, CHARACTERS_DATA } from '../data/authorData';
import { GuestbookEntry, Quote, Character } from '../types';

export const ReaderHubSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'aiChat' | 'guestbook' | 'quiz' | 'quotes' | 'newsletter'>('aiChat');

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hello! I am Ansh's Literary Lore AI. Ask me anything about 'The Lost Soul of Throne', 'Until Death Found Us Again', character backgrounds, magic systems, or Ansh's writing journey!" }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Guestbook State
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(INITIAL_GUESTBOOK);
  const [gbName, setGbName] = useState('');
  const [gbLocation, setGbLocation] = useState('');
  const [gbMessage, setGbMessage] = useState('');
  const [gbBadge, setGbBadge] = useState('Fantasy Lover');

  // Quote Generator State
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<Character | null>(null);

  // Newsletter State
  const [nlEmail, setNlEmail] = useState('');
  const [nlSubscribed, setNlSubscribed] = useState(false);

  // AI Chat Handler
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isTyping) return;

    const userText = inputMsg.trim();
    setInputMsg('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatMessages.slice(-6),
        })
      });

      const data = await res.json();
      const replyText = data.reply || "Ansh's stories are unfolding! Ask me about character backstories or dragon lore.";
      setChatMessages((prev) => [...prev, { role: 'model', text: replyText }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'model', text: "Thank you for asking! 'The Lost Soul of Throne' features epic dragon lords and ancient thrones, while 'Until Death Found Us Again' explores reincarnation across lifetimes!" }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Guestbook Handler
  const handleSignGuestbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gbName.trim() || !gbMessage.trim()) return;

    const newEntry: GuestbookEntry = {
      id: `gb_${Date.now()}`,
      name: gbName.trim(),
      location: gbLocation.trim() || 'Global Reader',
      message: gbMessage.trim(),
      date: new Date().toISOString().split('T')[0],
      likes: 1,
      badge: gbBadge
    };

    setGuestbook([newEntry, ...guestbook]);
    setGbName('');
    setGbLocation('');
    setGbMessage('');

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
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
            Engage with AI book lore, take character quizzes, sign the visitor guestbook, and stay connected.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        {/* Hub Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('aiChat')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'aiChat' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-900/80 text-slate-400 border border-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Lore Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('guestbook')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'guestbook' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-900/80 text-slate-400 border border-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Visitor Guestbook</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'quiz' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-900/80 text-slate-400 border border-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Character Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'quotes' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-900/80 text-slate-400 border border-slate-800'
            }`}
          >
            <QuoteIcon className="w-4 h-4" />
            <span>Random Quote Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'newsletter' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-900/80 text-slate-400 border border-slate-800'
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
            <div className="flex flex-col h-[520px]">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-100">AI Book Lore Concierge</h3>
                  <p className="text-xs text-slate-400">Ask anything about Kaelen, Ren & Yuki, Magic Systems, or Ansh's universe!</p>
                </div>
              </div>

              {/* Chat Message Window */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-amber-500/20">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`p-2 rounded-xl flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className={`p-4 rounded-2xl max-w-lg text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-500/20 border border-amber-500/30 text-slate-100'
                        : 'bg-slate-950 border border-slate-800 text-slate-200'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-amber-400 italic">
                    <Bot className="w-4 h-4 animate-spin" />
                    <span>Lore Assistant is searching ancient scrolls...</span>
                  </div>
                )}
              </div>

              {/* Chat Form Input */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Ask a question about Ansh's books or characters..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim() || isTyping}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Visitor Guestbook */}
          {activeTab === 'guestbook' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 border border-slate-800">
                <h3 className="font-serif font-bold text-lg text-amber-300 mb-4">Sign the Visitor Guestbook</h3>
                <form onSubmit={handleSignGuestbook} className="space-y-4">
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
                    <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Location (Optional)</label>
                    <input
                      type="text"
                      value={gbLocation}
                      onChange={(e) => setGbLocation(e.target.value)}
                      placeholder="e.g. London, UK"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Reader Badge</label>
                    <select
                      value={gbBadge}
                      onChange={(e) => setGbBadge(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Fantasy Lover">Fantasy Lover</option>
                      <option value="Dragon Wielder">Dragon Wielder</option>
                      <option value="Romance Dreamer">Romance Dreamer</option>
                      <option value="Early Reader">Early Reader</option>
                      <option value="Fellow Student">Fellow Student</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Message *</label>
                    <textarea
                      required
                      rows={3}
                      value={gbMessage}
                      onChange={(e) => setGbMessage(e.target.value)}
                      placeholder="Leave a message or encouragement for Ansh..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20"
                  >
                    Post Message
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
