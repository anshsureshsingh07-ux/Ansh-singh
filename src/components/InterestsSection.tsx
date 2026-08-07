import React from 'react';
import { motion } from 'motion/react';
import { Feather, Sparkles, Tv, Film, PlaySquare, BookOpen, Globe, Cpu, Palette, Heart } from 'lucide-react';
import { INTERESTS_DATA } from '../data/authorData';

export const InterestsSection: React.FC = () => {
  const getInterestIcon = (iconName: string) => {
    switch (iconName) {
      case 'Feather': return Feather;
      case 'Sparkles': return Sparkles;
      case 'Tv': return Tv;
      case 'Film': return Film;
      case 'PlaySquare': return PlaySquare;
      case 'BookOpen': return BookOpen;
      case 'Globe': return Globe;
      case 'Cpu': return Cpu;
      case 'Palette': return Palette;
      default: return Heart;
    }
  };

  return (
    <section id="interests" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Passions</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
            Interests & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Inspirations</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            The creative influences and hobbies that fuel Ansh's storytelling universe.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        {/* Animated Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INTERESTS_DATA.map((item, idx) => {
            const Icon = getInterestIcon(item.icon);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 shadow-xl transition-all duration-300 group flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-100 group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
