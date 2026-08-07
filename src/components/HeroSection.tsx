import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Compass, Instagram, Twitter, Github, Mail, Sparkles, Feather } from 'lucide-react';
import { AUTHOR_INFO } from '../data/authorData';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
      {/* Subtle glowing orb backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Top Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium tracking-wide shadow-lg shadow-amber-500/10 mb-8"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>Official Author Website</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        </motion.div>

        {/* Author Name Display */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-2xl mb-4"
        >
          {AUTHOR_INFO.name}
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-2xl font-serif text-amber-200/90 tracking-widest uppercase font-medium mb-8"
        >
          {AUTHOR_INFO.title}
        </motion.p>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl px-6 py-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md shadow-2xl mb-10"
        >
          <p className="font-serif italic text-lg sm:text-xl text-slate-200 leading-relaxed">
            "{AUTHOR_INFO.tagline}"
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto"
        >
          <a
            href="#journey"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold text-base tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all group"
          >
            <Compass className="w-5 h-5 text-slate-950 group-hover:rotate-45 transition-transform duration-300" />
            <span>Explore My Journey</span>
          </a>

          <a
            href="#books"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-amber-300 font-bold text-base tracking-wide border border-amber-500/30 hover:border-amber-400/60 flex items-center justify-center gap-3 shadow-xl backdrop-blur-md hover:scale-105 transition-all group"
          >
            <BookOpen className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Discover My Books</span>
          </a>
        </motion.div>

        {/* Social Links Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex items-center gap-4 sm:gap-6 pt-4 border-t border-slate-800/60"
        >
          <a
            href={AUTHOR_INFO.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 hover:scale-110 transition-all"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href={AUTHOR_INFO.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 hover:scale-110 transition-all"
            aria-label="Twitter / X"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href={AUTHOR_INFO.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 hover:scale-110 transition-all"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${AUTHOR_INFO.socials.email}`}
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 hover:scale-110 transition-all"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Scroll down indicator */}
        <div className="mt-16 animate-bounce text-slate-500 text-xs flex flex-col items-center gap-2">
          <Feather className="w-4 h-4 text-amber-400/60" />
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};
