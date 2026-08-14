import React from 'react';
import { Feather, Heart, Instagram, Twitter, Github, Mail, Sparkles } from 'lucide-react';
import { AUTHOR_INFO } from '../data/authorData';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-amber-500/15 bg-slate-950 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-slate-400">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Brand Emblem */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-xl shadow-amber-500/20 mb-4">
          <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
            <span className="font-serif text-amber-400 font-bold text-2xl">A</span>
          </div>
        </div>

        <h3 className="font-serif text-2xl font-bold text-slate-100 mb-1">{AUTHOR_INFO.name}</h3>
        <p className="text-xs text-amber-400 uppercase tracking-widest font-semibold mb-6">
          {AUTHOR_INFO.title}
        </p>

        {/* Closing Quote */}
        <p className="font-serif italic text-slate-300 text-sm sm:text-base max-w-lg mb-8">
          "The greatest stories are not just read—they are remembered."
        </p>

        {/* Nav Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-400 mb-8 border-y border-slate-900 py-4 w-full max-w-2xl">
          <a href="#about" className="hover:text-amber-300 transition-colors">About</a>
          <a href="#journey" className="hover:text-amber-300 transition-colors">Journey</a>
          <a href="#books" className="hover:text-amber-300 transition-colors">Books</a>
          <a href="#projects" className="hover:text-amber-300 transition-colors">Projects</a>
          <a href="#gallery" className="hover:text-amber-300 transition-colors">Gallery</a>
          <a href="#philosophy" className="hover:text-amber-300 transition-colors">Philosophy</a>
          <a href="#reader-hub" className="hover:text-amber-300 transition-colors">Reader Hub</a>
          <a href="#repinsh" className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold">REPINSH™</a>
          <a href="#contact" className="hover:text-amber-300 transition-colors">Contact</a>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">Sitemap</a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4 mb-8">
          <a
            href={AUTHOR_INFO.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-400 transition-all"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href={AUTHOR_INFO.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-400 transition-all"
            aria-label="Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={AUTHOR_INFO.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-400 transition-all"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${AUTHOR_INFO.socials.email}`}
            className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-400 transition-all"
            aria-label="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* Copyright & Made with Message */}
        <div className="text-xs text-slate-500 space-y-1">
          <p>© {new Date().getFullYear()} Ansh Singh. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1.5 text-amber-400/80 font-medium">
            <span>Made with passion and imagination</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </p>
        </div>
      </div>
    </footer>
  );
};
