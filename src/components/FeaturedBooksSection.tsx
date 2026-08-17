import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  ShoppingCart, 
  PartyPopper, 
  Calendar, 
  Upload, 
  Sliders, 
  Layers, 
  Flame, 
  Shield, 
  CheckCircle2, 
  Image as ImageIcon,
  BookMarked,
  ArrowRight,
  ExternalLink,
  Sparkle
} from 'lucide-react';
import { BOOKS_DATA } from '../data/authorData';
import { BookLore } from '../types';
import { BookDetailModal } from './BookDetailModal';
import { EditableImage } from './EditableImage';
import { usePhotos } from '../context/PhotoContext';

export const FeaturedBooksSection: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<BookLore | null>(null);
  const [activeVolumeTab, setActiveVolumeTab] = useState<'vol1' | 'vol2' | 'both'>('both');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { updatePhoto, openEditor } = usePhotos();

  const handleQuickUpload = (e: React.ChangeEvent<HTMLInputElement>, photoId: string, title: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          await updatePhoto(photoId, {
            imageUrl: base64,
            title: title,
            category: 'Book Cover',
          });
          setUploadSuccessMsg(`Successfully updated cover for ${title}!`);
          setTimeout(() => setUploadSuccessMsg(null), 4000);
        } catch (err) {
          console.error(err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="books" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Hidden file input for quick volume 2 upload */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => handleQuickUpload(e, 'book_cover_lost_soul_vol2', 'The Lost Soul of Throne: Volume 2')}
        />

        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Literary Works & Sagas</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            The Literary <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Universe</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Explore the flagship multi-volume saga <em className="text-amber-300 font-serif">"The Lost Soul of Throne"</em> and companion novels by Ansh Singh.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        {/* Global Upload Notification Banner */}
        <AnimatePresence>
          {uploadSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/50 text-emerald-200 flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-semibold">{uploadSuccessMsg}</span>
              </div>
              <button 
                onClick={() => setUploadSuccessMsg(null)}
                className="text-xs px-3 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-white font-medium"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* SAGA SPOTLIGHT: THE LOST SOUL OF THRONE (VOLUMES 1 & 2) */}
        {/* ========================================================================= */}
        <div className="mb-20 rounded-3xl bg-slate-900/90 border-2 border-amber-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Saga Header & Volume View Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-800 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                  Flagship High Fantasy Saga
                </span>
                <span className="text-xs text-slate-400 font-medium">Multi-Volume Series</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-100">
                The Lost Soul of Throne
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                A sweeping epic of ancient dragon bloodlines, kingdoms, betrayal, and the struggle for the cosmic throne.
              </p>
            </div>

            {/* Volume Navigation Pills */}
            <div className="flex items-center p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveVolumeTab('both')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeVolumeTab === 'both'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Volumes (1 & 2)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveVolumeTab('vol1')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeVolumeTab === 'vol1'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PartyPopper className="w-3.5 h-3.5" />
                <span>Volume 1 (Launched)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveVolumeTab('vol2')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeVolumeTab === 'vol2'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkle className="w-3.5 h-3.5" />
                <span>Volume 2 (Writing)</span>
              </button>
            </div>
          </div>

          {/* Volume Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {/* ------------------------------------------------------------- */}
            {/* VOLUME 1: THE GENESIS (OFFICIALLY LAUNCHED) */}
            {/* ------------------------------------------------------------- */}
            {(activeVolumeTab === 'both' || activeVolumeTab === 'vol1') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl bg-slate-950/80 border-2 border-emerald-500/40 p-6 sm:p-7 flex flex-col justify-between shadow-xl relative group hover:border-emerald-400/70 transition-all"
              >
                <div>
                  {/* Status & Volume Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black tracking-wide flex items-center gap-1.5 shadow-sm">
                      <PartyPopper className="w-3.5 h-3.5" />
                      🎉 Volume 1 • Officially Launched
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      Birthday Launch (16th Aug)
                    </span>
                  </div>

                  {/* Amazon Exclusive Callout Banner */}
                  <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border border-emerald-500/40 shadow-inner">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-amber-300">
                          Amazon Paperback Edition is Live!
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400">
                        Available Worldwide
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      Readers can now order the physical Paperback Edition exclusively on Amazon.
                    </p>
                  </div>

                  {/* Cover & Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start mb-5">
                    <div className="sm:col-span-5 flex justify-center">
                      <div className="relative group/cover cursor-pointer">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg group-hover/cover:blur-xl transition-all" />
                        <EditableImage
                          photoId="book_cover_lost_soul"
                          defaultSrc={BOOKS_DATA.lostSoul.coverImage}
                          defaultTitle="The Lost Soul of Throne: Volume 1 - Cover Art"
                          defaultCategory="Book Cover"
                          defaultDescription="Volume 1 Paperback Edition Cover Art"
                          alt="The Lost Soul of Throne: Volume 1"
                          className="w-40 sm:w-full h-56 rounded-xl object-cover shadow-2xl border border-emerald-500/40 group-hover/cover:scale-105 transition-transform duration-300"
                          onClick={() => setSelectedBook(BOOKS_DATA.lostSoul)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-7 flex flex-col gap-2.5">
                      <h4 className="font-serif text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                        Volume 1: The Throne of Ash
                      </h4>
                      <p className="font-serif italic text-amber-300 text-xs">
                        "{BOOKS_DATA.lostSoul.tagline}"
                      </p>
                      <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                        {BOOKS_DATA.lostSoul.description}
                      </p>

                      {/* Ready status */}
                      <div className="mt-1 pt-2 border-t border-slate-800/80">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Paperback Status</span>
                          <span className="text-emerald-400 font-bold">100% Launched</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full w-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Paperback Out Now', 'Amazon Exclusive', 'Dragon Lore', 'Valyria Kingdom Map', 'Character Profiles'].map((feat, fIdx) => (
                      <span key={fIdx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-emerald-300/90 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                  <a
                    href={BOOKS_DATA.lostSoul.amazonUrl || 'https://www.amazon.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all"
                  >
                    <ShoppingCart className="w-4 h-4 text-slate-950" />
                    <span>Order on Amazon</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedBook(BOOKS_DATA.lostSoul)}
                    className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:border-amber-400"
                  >
                    <span>Explore Vol. 1 Lore</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VOLUME 2: SEQUEL IN ACTIVE DEVELOPMENT + IMAGE UPLOAD */}
            {/* ------------------------------------------------------------- */}
            {(activeVolumeTab === 'both' || activeVolumeTab === 'vol2') && BOOKS_DATA.lostSoulVol2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl bg-slate-950/80 border-2 border-amber-500/40 p-6 sm:p-7 flex flex-col justify-between shadow-xl relative group hover:border-amber-400/80 transition-all"
              >
                <div>
                  {/* Status & Volume Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black tracking-wide flex items-center gap-1.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                      ⚡ Volume 2 • In Active Writing
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1">
                      <span>Manuscript Progress: 35%</span>
                    </span>
                  </div>

                  {/* Volume 2 Upload Cover Control Bar */}
                  <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-amber-950/40 border border-purple-500/40 shadow-inner">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-purple-200">
                          Volume 2 Cover Artwork Studio
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow transition-all hover:scale-105"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Cover</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditor('book_cover_lost_soul_vol2', {
                            title: 'The Lost Soul of Throne: Volume 2',
                            category: 'Book Cover',
                            description: 'Official cover artwork for The Lost Soul of Throne: Volume 2',
                            imageUrl: BOOKS_DATA.lostSoulVol2?.coverImage,
                          })}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all border border-slate-700 hover:border-amber-400"
                        >
                          <Sliders className="w-3 h-3 text-amber-400" />
                          <span>Filters & Crop</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">
                      Upload your own Volume 2 cover image or apply cinematic photo filters.
                    </p>
                  </div>

                  {/* Cover & Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start mb-5">
                    <div className="sm:col-span-5 flex justify-center">
                      <div className="relative group/cover cursor-pointer">
                        <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-lg group-hover/cover:blur-xl transition-all" />
                        <EditableImage
                          photoId="book_cover_lost_soul_vol2"
                          defaultSrc={BOOKS_DATA.lostSoulVol2.coverImage}
                          defaultTitle="The Lost Soul of Throne: Volume 2 - Cover Art"
                          defaultCategory="Book Cover"
                          defaultDescription="Volume 2 Sequel Artwork"
                          alt="The Lost Soul of Throne: Volume 2"
                          className="w-40 sm:w-full h-56 rounded-xl object-cover shadow-2xl border border-purple-500/40 group-hover/cover:scale-105 transition-transform duration-300"
                          onClick={() => setSelectedBook(BOOKS_DATA.lostSoulVol2)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-7 flex flex-col gap-2.5">
                      <h4 className="font-serif text-xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                        Volume 2: The Shattered Crown
                      </h4>
                      <p className="font-serif italic text-amber-300 text-xs">
                        "{BOOKS_DATA.lostSoulVol2.tagline}"
                      </p>
                      <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                        {BOOKS_DATA.lostSoulVol2.description}
                      </p>

                      {/* Writing Progress Meter */}
                      <div className="mt-1 pt-2 border-t border-slate-800/80">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Manuscript Drafting</span>
                          <span className="text-amber-400 font-bold">35% Drafted</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-amber-300 rounded-full transition-all duration-1000"
                            style={{ width: '35%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Official Sequel', 'Shadow Dragon Magic', 'Sunken Realm Lore', 'Custom Cover Upload', 'Chapter Teasers'].map((feat, fIdx) => (
                      <span key={fIdx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-amber-300/90 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-3 px-4 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/40 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <Upload className="w-3.5 h-3.5 text-purple-300" />
                    <span>Upload Custom Cover</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBook(BOOKS_DATA.lostSoulVol2)}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all"
                  >
                    <span>Read Vol. 2 Lore & Teaser</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPANION NOVEL: UNTIL DEATH FOUND US AGAIN */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-slate-900/90 border border-amber-500/20 hover:border-amber-400/50 p-6 sm:p-8 shadow-2xl transition-all duration-500">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold tracking-wide">
              {BOOKS_DATA.untilDeath.genre}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {BOOKS_DATA.untilDeath.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start mb-6">
            <div className="sm:col-span-4 flex justify-center">
              <div className="relative group/cover cursor-pointer">
                <div className="absolute inset-0 bg-rose-500/20 rounded-xl blur-lg group-hover/cover:blur-xl transition-all" />
                <EditableImage
                  photoId="book_cover_until_death"
                  defaultSrc={BOOKS_DATA.untilDeath.coverImage}
                  defaultTitle="Until Death Found Us Again - Cover Art"
                  defaultCategory="Book Cover"
                  defaultDescription={BOOKS_DATA.untilDeath.subtitle}
                  alt={BOOKS_DATA.untilDeath.title}
                  className="w-44 sm:w-full h-60 rounded-xl object-cover shadow-2xl border border-rose-500/30 group-hover/cover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedBook(BOOKS_DATA.untilDeath)}
                />
              </div>
            </div>

            <div className="sm:col-span-8 flex flex-col gap-3">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
                {BOOKS_DATA.untilDeath.title}
              </h3>
              <p className="font-serif italic text-rose-300/90 text-sm">
                "{BOOKS_DATA.untilDeath.tagline}"
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                {BOOKS_DATA.untilDeath.description}
              </p>

              {/* Progress */}
              <div className="mt-2 pt-3 border-t border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Manuscript Polish Progress</span>
                  <span className="text-rose-400 font-bold">{BOOKS_DATA.untilDeath.progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all duration-1000"
                    style={{ width: `${BOOKS_DATA.untilDeath.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setSelectedBook(BOOKS_DATA.untilDeath)}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-all"
                >
                  <span>Explore Reincarnation Lore & Excerpts</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
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
