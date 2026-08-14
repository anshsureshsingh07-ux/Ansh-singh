import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, BookOpen, Compass, Sparkles, Feather, Send, User, Shield, Cpu, Clock, Image as ImageIcon, Bot, ShieldAlert, Edit3 } from 'lucide-react';
import { useUserIdentity } from '../context/UserIdentityContext';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ soundEnabled, onToggleSound, onOpenAdmin }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, openEditProfileModal, openSafetyLogModal, isCurrentUserBanned } = useUserIdentity();

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
    { name: 'Projects', href: '#projects', icon: Clock },
    { name: 'Gallery', href: '#gallery', icon: ImageIcon },
    { name: 'Philosophy', href: '#philosophy', icon: Feather },
    { name: 'Reader Hub', href: '#reader-hub', icon: Sparkles },
    { name: 'REPINSH™', href: '#repinsh', icon: Cpu, isHighlight: true },
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
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-2.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  link.isHighlight
                    ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/40 hover:text-cyan-200'
                    : 'text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20'
                }`}
              >
                <link.icon className={`w-3.5 h-3.5 ${link.isHighlight ? 'text-cyan-400' : 'text-amber-400/80'}`} />
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions: User Identity / Edit Name, Safety Logs, Admin Portal, Sound Toggle & Mobile Menu Trigger */}
          <div className="flex items-center gap-2">
            {/* Edit Name / Profile Button */}
            <button
              onClick={openEditProfileModal}
              id="navbar-edit-profile-btn"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/60 text-slate-200 hover:text-amber-300 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm group"
              title="Edit your display name and safe profile"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                {currentUser.displayName.charAt(0) || 'U'}
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate font-medium">
                {currentUser.displayName}
              </span>
              <Edit3 className="w-3 h-3 text-amber-400 group-hover:rotate-12 transition-transform" />
            </button>

            {/* LORE AI Safety Logs Button */}
            <button
              onClick={openSafetyLogModal}
              id="navbar-safety-logs-btn"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-red-400/50 text-slate-300 hover:text-red-300 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              title="LORE AI Safety Guardian & Moderation Logs"
            >
              <Bot className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline text-[11px]">LORE AI Safety</span>
            </button>

            <button
              onClick={onOpenAdmin}
              id="admin-portal-btn"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all text-xs font-bold flex items-center gap-1.5 shadow-md"
              title="Supabase & Admin Control Panel"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Admin / SQL</span>
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
          {/* User profile quick action */}
          <div className="mb-4 pb-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                {currentUser.displayName.charAt(0) || 'U'}
              </div>
              <div>
                <span className="font-bold text-sm text-slate-100 block">{currentUser.displayName}</span>
                <span className="text-[11px] text-slate-400">@{currentUser.handle}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openEditProfileModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
            >
              Edit Name
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 flex items-center gap-3"
              >
                <link.icon className="w-4 h-4 text-amber-400" />
                {link.name}
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSafetyLogModal();
              }}
              className="mt-2 text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-950/30 border border-red-500/20 flex items-center gap-3"
            >
              <Bot className="w-4 h-4 text-red-400" />
              <span>LORE AI Safety & Ban Log</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
