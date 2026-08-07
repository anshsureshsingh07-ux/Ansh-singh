import React from 'react';
import { motion } from 'motion/react';
import { Feather, Quote } from 'lucide-react';
import { AUTHOR_INFO } from '../data/authorData';

export const WritingPhilosophy: React.FC = () => {
  return (
    <section id="philosophy" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-950/60">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {/* Subtle glowing ambient lighting */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Quote className="w-6 h-6" />
          </div>

          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">
            Writing Philosophy
          </h3>

          <blockquote className="font-serif italic text-xl sm:text-3xl text-slate-100 leading-relaxed max-w-3xl mx-auto mb-6">
            "{AUTHOR_INFO.philosophy}"
          </blockquote>

          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-amber-500/40" />
            <span className="font-serif text-amber-300 font-bold text-base tracking-wider">
              Ansh Singh
            </span>
            <div className="h-px w-12 bg-amber-500/40" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
