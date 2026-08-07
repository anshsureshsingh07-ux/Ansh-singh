import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Calendar, Flag, Briefcase, GraduationCap, Heart, Sparkles, X } from 'lucide-react';
import { AUTHOR_INFO } from '../data/authorData';
import { EditableImage } from './EditableImage';

export const AboutSection: React.FC = () => {
  const [petModalOpen, setPetModalOpen] = useState(false);

  const bioDetails = [
    { label: 'Name', value: AUTHOR_INFO.name, icon: User },
    { label: 'Date of Birth', value: AUTHOR_INFO.dob, icon: Calendar },
    { label: 'Nationality', value: AUTHOR_INFO.nationality, icon: Flag },
    { label: 'Occupation', value: AUTHOR_INFO.occupation, icon: Briefcase },
    { label: 'School', value: AUTHOR_INFO.school, icon: GraduationCap },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Biography</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Ansh Singh</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Author Image / Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col items-center"
          >
            <div className="relative group max-w-sm w-full">
              {/* Decorative aura border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-700 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />
              
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-amber-500/30 p-2 shadow-2xl">
                <EditableImage
                  photoId="author_portrait"
                  defaultSrc={AUTHOR_INFO.authorImage}
                  defaultTitle="Ansh Singh - Author Portrait"
                  defaultCategory="Portrait"
                  defaultDescription="Official author portrait for Ansh Singh"
                  alt={AUTHOR_INFO.name}
                  className="w-full h-96 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="p-4 bg-slate-950/90 text-center">
                  <h3 className="font-serif text-xl font-bold text-amber-300">{AUTHOR_INFO.name}</h3>
                  <p className="text-xs text-slate-400 font-sans tracking-wide mt-1">Surat, Gujarat, India</p>
                </div>
              </div>
            </div>

            {/* Pet Rabbit Badge Card */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={() => setPetModalOpen(true)}
              className="mt-6 w-full max-w-sm p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 hover:border-amber-400/50 flex items-center justify-between text-left transition-all shadow-lg group"
            >
              <div className="flex items-center gap-3">
                <EditableImage
                  photoId="tonny_rabbit"
                  defaultSrc={AUTHOR_INFO.family.petImage}
                  defaultTitle="Tonny the Rabbit 🐇"
                  defaultCategory="Pet Mascot"
                  defaultDescription="Ansh's writing companion rabbit Tonny"
                  alt={AUTHOR_INFO.family.pet}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50"
                  showEditBadge={false}
                />
                <div>
                  <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">Beloved Companion</span>
                  <h4 className="font-serif font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                    {AUTHOR_INFO.family.pet}
                  </h4>
                </div>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-amber-400 underline">Meet Tonny →</span>
            </motion.button>
          </motion.div>

          {/* Biography Content & Quick Facts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col gap-8"
          >
            {/* Narrative text */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-2xl relative">
              <div className="absolute top-4 right-4 text-amber-500/20 font-serif text-6xl">"</div>
              <h3 className="font-serif text-2xl font-bold text-amber-300 mb-4 flex items-center gap-2">
                <span>The Storyteller Behind The Words</span>
              </h3>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 font-sans">
                {AUTHOR_INFO.biography}
              </p>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-sm text-amber-400/90 font-serif italic">
                <span>"Creating worlds to be remembered."</span>
                <span>— Ansh Singh</span>
              </div>
            </div>

            {/* Quick Facts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bioDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-amber-500/30 transition-colors flex items-start gap-3"
                >
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <detail.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">{detail.label}</span>
                    <p className="text-sm font-semibold text-slate-200 mt-0.5">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Family Card */}
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <h4 className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Family & Support System</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-500">Father</span>
                  <p className="font-medium text-slate-200">{AUTHOR_INFO.family.father}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Mother</span>
                  <p className="font-medium text-slate-200">{AUTHOR_INFO.family.mother}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Brother</span>
                  <p className="font-medium text-slate-200">{AUTHOR_INFO.family.brother}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pet Tonny Modal */}
      {petModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-center">
            <button
              onClick={() => setPetModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={AUTHOR_INFO.family.petImage}
              alt="Tonny the Rabbit"
              referrerPolicy="no-referrer"
              className="w-48 h-48 rounded-2xl object-cover mx-auto border-2 border-amber-400 shadow-xl mb-4"
            />

            <h3 className="font-serif text-2xl font-bold text-amber-300 mb-1">Tonny 🐇</h3>
            <p className="text-xs text-amber-400 uppercase tracking-widest mb-3">Ansh's Writing Companion & Mascot</p>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Tonny is Ansh's beloved white rabbit who sits silently during late-night writing sessions as ideas turn into original chapters.
            </p>

            <button
              onClick={() => setPetModalOpen(false)}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
