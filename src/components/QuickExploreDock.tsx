import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  X,
  ChevronUp,
  User,
  BookOpen,
  Feather,
  Sparkles,
  Heart,
  Award,
  Users,
  Brain,
  Image as ImageIcon,
  Clock,
  Cpu,
  Send,
  Home,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SectionItem {
  id: string;
  name: string;
  category: 'Profile' | 'Works' | 'Community' | 'Connect';
  icon: React.ElementType;
  description: string;
}

const SECTIONS: SectionItem[] = [
  { id: 'hero', name: 'Home & News', category: 'Profile', icon: Home, description: 'Author introduction & paperback announcement' },
  { id: 'about', name: 'Biography', category: 'Profile', icon: User, description: 'Background, school, and personal details' },
  { id: 'journey', name: 'Journey & Milestones', category: 'Profile', icon: Compass, description: 'Literary evolution & key moments' },
  { id: 'books', name: 'Featured Books & Lore', category: 'Works', icon: BookOpen, description: 'The Lost Soul of Throne & Until Death' },
  { id: 'projects', name: 'Active Desk', category: 'Works', icon: Clock, description: 'Current manuscripts & writing status' },
  { id: 'gallery', name: 'Visual Archive', category: 'Works', icon: ImageIcon, description: 'Book concept art & writing gallery' },
  { id: 'philosophy', name: 'Writing Philosophy', category: 'Works', icon: Feather, description: 'Core storytelling principles' },
  { id: 'skills', name: 'Craft & Skills', category: 'Profile', icon: Brain, description: 'Worldbuilding & narrative proficiency' },
  { id: 'interests', name: 'Interests & Media', category: 'Profile', icon: Heart, description: 'Favorite games, anime, books & cinema' },
  { id: 'mentors', name: 'Inspiration & Mentors', category: 'Community', icon: Award, description: 'Bindu Ma’am & George R.R. Martin' },
  { id: 'friends', name: 'Friends & Companions', category: 'Community', icon: Users, description: 'Supporters & school friends' },
  { id: 'reader-hub', name: 'Reader Hub & AI Concierge', category: 'Community', icon: Sparkles, description: 'Interactive AI chat & lore archives' },
  { id: 'repinsh', name: 'REPINSH™ Platform', category: 'Works', icon: Cpu, description: 'Tech ecosystem & community spaces' },
  { id: 'contact', name: 'Direct Contact', category: 'Connect', icon: Send, description: 'Send messages to author email' },
];

export const QuickExploreDock: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      // Determine active section based on viewport position
      const scrollPos = window.scrollY + 200;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Exploration Bar at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
        {/* Back to top button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              onClick={scrollToTop}
              className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 shadow-xl backdrop-blur-md transition-all hover:scale-105 group"
              title="Scroll to Top"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Master Explore Trigger Pill */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpen(!isOpen)}
          id="explore-site-trigger-btn"
          className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border font-semibold text-sm transition-all ${
            isOpen
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/30'
              : 'bg-slate-900/90 text-amber-300 border-amber-500/40 hover:border-amber-400 shadow-black/60 hover:bg-slate-900'
          }`}
        >
          <Compass className={`w-5 h-5 ${isOpen ? 'animate-spin-slow text-slate-950' : 'text-amber-400'}`} />
          <span className="hidden sm:inline">Explore Website</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-amber-950/60 text-amber-300 border border-amber-500/30">
            {SECTIONS.length} Sections
          </span>
        </motion.button>
      </div>

      {/* Explore Navigation Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 transition-opacity"
            />

            {/* Modal Drawer */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-20 right-4 sm:right-6 max-w-xl w-[calc(100vw-2rem)] max-h-[80vh] bg-slate-900/95 border border-amber-500/30 rounded-3xl shadow-2xl backdrop-blur-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-amber-500/20 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                      <span>Explore & Cross Website</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Jump seamlessly to any chapter, archive, or interactive hub
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  aria-label="Close explore menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sections Grid */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 max-h-[calc(80vh-140px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    const isRepinsh = section.id === 'repinsh';

                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 group relative overflow-hidden ${
                          isActive
                            ? 'bg-amber-500/15 border-amber-400/80 shadow-md shadow-amber-500/10'
                            : isRepinsh
                            ? 'bg-cyan-950/30 border-cyan-500/30 hover:border-cyan-400/70 hover:bg-cyan-950/50'
                            : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/50'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            isActive
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : isRepinsh
                              ? 'bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950'
                              : 'bg-slate-800 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`font-semibold text-xs sm:text-sm truncate ${
                                isActive
                                  ? 'text-amber-300 font-bold'
                                  : isRepinsh
                                  ? 'text-cyan-200 group-hover:text-cyan-100'
                                  : 'text-slate-200 group-hover:text-amber-300'
                              }`}
                            >
                              {section.name}
                            </span>
                            {isActive && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {section.description}
                          </p>
                        </div>

                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all self-center opacity-0 group-hover:opacity-100 flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Bar */}
              <div className="p-3.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ansh Singh Official Author Web</span>
                </span>
                <span className="text-[11px] text-amber-400/80 font-medium">
                  Instant Navigation
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
