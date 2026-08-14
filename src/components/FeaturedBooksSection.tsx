import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Shield, Flame, Heart, ChevronRight, ShoppingCart, PartyPopper, Calendar, CheckCircle2 } from 'lucide-react';
import { BOOKS_DATA } from '../data/authorData';
import { BookLore } from '../types';
import { BookDetailModal } from './BookDetailModal';
import { EditableImage } from './EditableImage';

export const FeaturedBooksSection: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<BookLore | null>(null);

  const booksList = [BOOKS_DATA.lostSoul, BOOKS_DATA.untilDeath];

  return (
    <section id="books" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bibliotheca</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Books</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Step into original fantasy realms created by Ansh Singh.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        {/* 3D Bookshelf Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {booksList.map((book, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className={`group relative rounded-3xl bg-slate-900/90 border ${
                book.releaseAnnouncement?.isAnnounced
                  ? 'border-amber-400/60 shadow-amber-500/10'
                  : 'border-amber-500/20 hover:border-amber-400/50'
              } p-6 sm:p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between`}
            >
              {/* Glowing Aura Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-blue-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

              <div>
                {/* Top Header: Genre & Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
                    {book.genre}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${book.releaseAnnouncement?.isAnnounced ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                    {book.status}
                  </span>
                </div>

                {/* Release Announcement Spotlight for Lost Soul */}
                {book.releaseAnnouncement && (
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/40 border border-amber-400/50 shadow-inner">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider shadow-sm">
                        <PartyPopper className="w-3.5 h-3.5" />
                        Big News • Birthday Release
                      </span>
                      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        16th August
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-slate-100 mb-1">
                      Volume 1 Paperback Edition Releasing on My Birthday!
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {book.releaseAnnouncement.details}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-slate-950 px-3 py-1 rounded-lg border border-amber-500/30">
                        <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                        <span>Exclusive Only on Amazon</span>
                      </div>
                      <span className="text-[11px] text-amber-400/90 font-medium">
                        Physical Paperback Copy 📖
                      </span>
                    </div>
                  </div>
                )}

                {/* Cover & Main Info Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start mb-6">
                  {/* Book Cover with 3D shadow hover effect */}
                  <div className="sm:col-span-5 flex justify-center">
                    <div className="relative group/cover cursor-pointer">
                      <div className="absolute inset-0 bg-amber-500/20 rounded-xl blur-lg group-hover/cover:blur-xl transition-all" />
                      <EditableImage
                        photoId={idx === 0 ? 'book_cover_lost_soul' : 'book_cover_until_death'}
                        defaultSrc={book.coverImage}
                        defaultTitle={`${book.title} - Cover Art`}
                        defaultCategory="Book Cover"
                        defaultDescription={book.subtitle}
                        alt={book.title}
                        className="relative w-44 sm:w-full h-60 sm:h-64 rounded-xl object-cover shadow-2xl border border-amber-500/30 group-hover/cover:scale-105 transition-transform duration-300"
                        onClick={() => setSelectedBook(book)}
                      />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="sm:col-span-7 flex flex-col gap-3">
                    <h3 className="font-serif text-2xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {book.title}
                    </h3>

                    <p className="font-serif italic text-amber-300/90 text-xs leading-relaxed">
                      "{book.tagline}"
                    </p>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans line-clamp-4">
                      {book.description}
                    </p>

                    {/* Progress Bar preview */}
                    <div className="mt-2 pt-3 border-t border-slate-800">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>{book.releaseAnnouncement ? 'Volume 1 Ready Status' : 'Development Progress'}</span>
                        <span className="text-amber-400 font-bold">{book.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000"
                          style={{ width: `${book.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Pills */}
                <div className="pt-4 border-t border-slate-800/80 mb-6">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-2">
                    Included Lore Archives
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {book.featuresList.map((feature, fIdx) => (
                      <span
                        key={fIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-medium text-amber-300/90 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Explore Button */}
              <button
                onClick={() => setSelectedBook(book)}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all group/btn"
              >
                <span>{book.releaseAnnouncement ? 'Explore Volume 1 & Book Lore' : 'Explore Book Lore'}</span>
                <ChevronRight className="w-4 h-4 text-slate-950 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </section>
  );
};
