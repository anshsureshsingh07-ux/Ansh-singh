import React from 'react';
import { motion } from 'motion/react';
import { Clock, Sparkles, BookOpen, ChevronRight, Zap } from 'lucide-react';
import { BOOKS_DATA } from '../data/authorData';
import { EditableImage } from './EditableImage';

export const CurrentProjectsSection: React.FC = () => {
  const projects = [
    {
      id: 'book_cover_lost_soul',
      title: BOOKS_DATA.lostSoul.title,
      genre: BOOKS_DATA.lostSoul.genre,
      progress: BOOKS_DATA.lostSoul.progressPercent,
      stage: '🎉 Volume 1 Paperback Release on Author\'s Birthday (16th August) — Amazon Exclusive',
      eta: '16th August (Birthday)',
      cover: BOOKS_DATA.lostSoul.coverImage,
      description: 'Big News! Volume 1 is debuting as a physical Paperback Edition on 16th August, exclusively available on Amazon.',
    },
    {
      id: 'book_cover_until_death',
      title: BOOKS_DATA.untilDeath.title,
      genre: BOOKS_DATA.untilDeath.genre,
      progress: BOOKS_DATA.untilDeath.progressPercent,
      stage: 'Manuscript Editing & Character Dialogue Polish',
      eta: 'Mid 2026',
      cover: BOOKS_DATA.untilDeath.coverImage,
      description: 'Refining the emotional core of Ren and Yuki’s reincarnation journey.',
    },
    {
      id: 'project_zero_cover',
      title: 'Project Zero (Unannounced)',
      genre: 'Sci-Fi Fantasy Thriller',
      progress: 25,
      stage: 'Concept Phase & World Lore Outline',
      eta: 'Future Release',
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      description: 'An upcoming secret project exploring artificial consciousness and starships.',
    }
  ];

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-950/40">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Active Desk</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
            Current & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Upcoming Projects</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Real-time writing progress tracker across Ansh's active manuscripts. Hover over any cover image to edit.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        {/* Projects Cards */}
        <div className="space-y-8">
          {projects.map((proj) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/20 hover:border-amber-400/50 shadow-2xl transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <EditableImage
                  photoId={proj.id}
                  defaultSrc={proj.cover}
                  defaultTitle={proj.title}
                  defaultCategory={proj.genre}
                  defaultDescription={proj.description}
                  alt={proj.title}
                  containerClassName="md:col-span-3 w-full h-44 rounded-2xl overflow-hidden border border-slate-800 shadow-xl"
                  className="w-full h-full object-cover"
                />

                <div className="md:col-span-9 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                      {proj.genre}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Target ETA: <span className="text-slate-200 font-bold">{proj.eta}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-slate-100">{proj.title}</h3>
                  <p className="text-xs text-amber-400 font-medium">Stage: {proj.stage}</p>
                  <p className="text-sm text-slate-300">{proj.description}</p>

                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                      <span>Completion</span>
                      <span className="text-amber-400">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800 p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${proj.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-md shadow-amber-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
