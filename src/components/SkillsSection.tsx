import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain } from 'lucide-react';
import { SKILLS_DATA } from '../data/authorData';

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-950/40">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Brain className="w-3.5 h-3.5" />
            <span>Proficiency</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
            Craft & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Skills</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Continuous development in narrative theory, design, and world-building precision.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SKILLS_DATA.map((skill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all shadow-xl"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="font-serif font-bold text-slate-100 text-base">{skill.name}</h3>
                </div>
                <span className="font-serif font-bold text-amber-400 text-sm">{skill.percent}%</span>
              </div>

              <p className="text-xs text-slate-400 mb-4">{skill.desc}</p>

              {/* Animated Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800 p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.2 + idx * 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-md shadow-amber-500/30"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
