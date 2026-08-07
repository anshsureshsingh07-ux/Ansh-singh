import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, BookOpen, Compass, Sparkles, Feather, Send, User, Shield } from 'lucide-react';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ soundEnabled, onToggleSound, onOpenAdmin }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
      setIsScrolled(currentScroll > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about', icon: User },
    { name: 'Journey', href: '#journey', icon: Compass },
    { name: 'Books', href: '#books', icon: BookOpen },
    { name: 'Philosophy', href: '#philosophy', icon: Feather },
    { name: 'Reader Hub', href: '#reader-hub', icon: Sparkles },
    { name: 'Contact', href: '#contact', icon: Send },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Scroll Progress Bar */}
      <div className="w-full h-1 bg-slate-900/50">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className={`px-4 sm:px-6 lg:px-12 py-3 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-amber-500/15 shadow-2xl shadow-black/50' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group" id="nav-logo">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <span className="font-serif text-amber-400 font-bold text-lg tracking-widest">A</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wider text-slate-100 group-hover:text-amber-300 transition-colors">
                ANSH SINGH
              </span>
              <span className="text-[10px] tracking-widest text-amber-400/80 uppercase font-sans">
                Author & Storyteller
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <link.icon className="w-3.5 h-3.5 text-amber-400/80" />
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions: Admin Portal, Ambient Sound Toggle & Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAdmin}
              id="admin-portal-btn"
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all text-xs font-bold flex items-center gap-1.5 shadow-md"
              title="Supabase & Admin Control Panel"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin / SQL</span>
            </button>

            <button
              onClick={onToggleSound}
              id="sound-toggle-btn"
              className="p-2 rounded-full bg-slate-900/80 border border-amber-500/20 text-amber-400 hover:text-amber-200 hover:border-amber-400/40 transition-all shadow-md hover:scale-105"
              title={soundEnabled ? 'Mute ambient soundscapes' : 'Enable ambient fantasy soundscapes'}
              aria-label="Toggle ambient sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900/80 border border-amber-500/20 text-slate-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-amber-500/20 px-6 py-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-base font-medium text-slate-200 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 flex items-center gap-3"
              >
                <link.icon className="w-5 h-5 text-amber-400" />
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
