import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, Clapperboard, PenTool, Library, GraduationCap, Globe, Compass } from 'lucide-react';
import { TIMELINE_EVENTS } from '../data/authorData';

export const TimelineSection: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return Sparkles;
      case 'BookOpen': return BookOpen;
      case 'Clapperboard': return Clapperboard;
      case 'PenTool': return PenTool;
      case 'Library': return Library;
      case 'GraduationCap': return GraduationCap;
      case 'Globe': return Globe;
      default: return Compass;
    }
  };

  return (
    <section id="journey" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-950/40">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Milestones</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Journey</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            The evolution of a young author—from early dreams to epic fantasy sagas.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Golden Connecting Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-yellow-500/50 to-amber-800 -translate-x-1/2" />

          <div className="space-y-12">
            {TIMELINE_EVENTS.map((event, idx) => {
              const IconComponent = getIcon(event.iconName);
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge Node */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 z-20 shadow-lg shadow-amber-500/20">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Content Card */}
                  <div className={`ml-12 sm:ml-0 sm:w-1/2 ${isEven ? 'sm:pr-12' : 'sm:pl-12'}`}>
                    <div className={`p-6 rounded-2xl bg-slate-900/80 border transition-all duration-300 hover:scale-[1.02] shadow-xl ${
                      event.highlight ? 'border-amber-500/50 bg-slate-900/90 shadow-amber-500/10' : 'border-slate-800/80 hover:border-amber-500/30'
                    }`}>
                      <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold font-serif mb-2 border border-amber-500/20">
                        {event.year}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-slate-100 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed font-sans">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
