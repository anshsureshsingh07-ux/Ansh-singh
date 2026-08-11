import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Sparkles, Heart } from 'lucide-react';
import { FRIENDS_DATA } from '../data/authorData';

export const FriendsSection: React.FC = () => {
  const [highlightIdx, setHighlightIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIdx((prev) => (prev + 1) % FRIENDS_DATA.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Fellow Companions</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
            Friends & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Supporters</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            The extraordinary classmates and friends who inspire and cheer on Ansh's literary journey.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        {/* Friends Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FRIENDS_DATA.map((friend, idx) => {
            const isHighlighted = idx === highlightIdx;
            const isBestFriend = friend.name === 'Devbrat Dhal' || friend.role.includes('Best Friend');

            return (
              <motion.div
                key={idx}
                onMouseEnter={() => setHighlightIdx(idx)}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`p-6 rounded-2xl bg-slate-900/80 border transition-all duration-500 shadow-xl relative overflow-hidden group cursor-pointer ${
                  isBestFriend
                    ? 'border-amber-400/90 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 shadow-2xl shadow-amber-500/25 sm:col-span-2 lg:col-span-1'
                    : isHighlighted
                    ? 'border-amber-400/80 bg-slate-900 scale-105 shadow-2xl shadow-amber-500/20'
                    : 'border-slate-800 hover:border-amber-500/40'
                }`}
              >
                {/* Priority Best Friend Ribbon */}
                {isBestFriend && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
                    <span>#1 Best Friend</span>
                  </div>
                )}

                {/* Rotating Highlight Aura */}
                {isHighlighted && !isBestFriend && (
                  <div className="absolute top-0 right-0 p-3">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${friend.avatarColor} p-0.5 shadow-lg flex-shrink-0`}>
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <span className="font-serif font-bold text-amber-300 text-lg">
                        {friend.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-100 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                      {friend.name}
                    </h3>
                    <span className="text-xs text-amber-400 font-semibold">{friend.role}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <p className="text-xs text-slate-300 font-sans italic">
                    "{friend.quote || friend.trait}"
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note for friends */}
        <div className="mt-12 text-center text-xs text-slate-400 italic flex items-center justify-center gap-2">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>And many more amazing friends at Shree Gurukrupa Vidya Sankul!</span>
        </div>
      </div>
    </section>
  );
};
