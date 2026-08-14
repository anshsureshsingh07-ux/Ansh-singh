import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Award, Sparkles, Feather } from 'lucide-react';

export const InspirationMentorSection: React.FC = () => {
  return (
    <section id="mentors" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-950/40">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Guiding Lights</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
            Inspiration & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Mentorship</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Honoring the master storytellers and dedicated mentors guiding Ansh's literary path.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inspiration Card: George R. R. Martin */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400/60 shadow-2xl transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-serif text-2xl font-bold">
                GRM
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">Literary Inspiration</span>
                <h3 className="font-serif text-2xl font-bold text-slate-100">George R. R. Martin</h3>
              </div>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans mb-6">
              George R. R. Martin's monumental world-building, intricate political intrigue, and unforgettable character depth serve as a major inspiration. While drawing motivation from his epic scope, Ansh is dedicated to shaping a distinct voice, fresh magic mechanics, and original emotional narratives.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs italic text-amber-300">
              "A reader lives a thousand lives before he dies. The man who never reads lives only one."
            </div>
          </motion.div>

          {/* Mentor Card: Bindu Ma'am */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400/60 shadow-2xl transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-serif text-2xl font-bold">
                BM
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">Teacher • Mentor • Guide</span>
                <h3 className="font-serif text-2xl font-bold text-slate-100">Bindu Ma'am</h3>
              </div>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans mb-6">
              A guiding pillar at Shree Gurukrupa Vidya Sankul. Bindu Ma'am has constantly encouraged Ansh's creative writing, intellectual growth, and academic discipline. Her unwavering belief in his potential inspires him to strive for excellence every single day.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs italic text-amber-300">
              "A true mentor does not just teach; they awaken the lifelong passion within."
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
