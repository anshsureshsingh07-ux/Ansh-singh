import React, { useState, useEffect } from 'react';
import { X, BookOpen, Shield, Flame, MapPin, Users, Sparkles, Quote as QuoteIcon, Feather, FileText, ShoppingCart, PartyPopper, Calendar } from 'lucide-react';
import { BookLore } from '../types';
import { CHARACTERS_DATA } from '../data/authorData';
import { EditableImage } from './EditableImage';

interface BookDetailModalProps {
  book: BookLore | null;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'map' | 'magic' | 'excerpts'>('overview');

  useEffect(() => {
    if (!book) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [book, onClose]);

  if (!book) return null;

  const bookCharacters = CHARACTERS_DATA.filter(c => c.bookTitle === book.title);
  const photoId = book.title.includes('Throne') ? 'book_cover_lost_soul' : 'book_cover_until_death';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border-2 border-amber-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl my-auto overflow-y-auto custom-scrollbar"
      >
        {/* Ambient background aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-amber-400 transition-all z-20 flex items-center gap-1.5 text-xs font-semibold"
          aria-label="Close book details"
        >
          <X className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Close</span>
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-8 relative z-10">
          <EditableImage
            photoId={photoId}
            defaultSrc={book.coverImage}
            defaultTitle={`${book.title} - Cover Art`}
            defaultCategory="Book Cover"
            defaultDescription={book.subtitle}
            alt={book.title}
            className="w-32 sm:w-44 h-44 sm:h-60 rounded-2xl object-cover shadow-2xl border border-amber-500/40 flex-shrink-0"
          />

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                {book.genre}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${book.releaseAnnouncement ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                {book.status}
              </span>
              {book.releaseAnnouncement && (
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold flex items-center gap-1">
                  <PartyPopper className="w-3.5 h-3.5" />
                  Birthday Release • 16th Aug
                </span>
              )}
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-100 mt-1">
              {book.title}
            </h2>

            <p className="font-serif italic text-amber-300/90 text-sm sm:text-base">
              "{book.tagline}"
            </p>

            <p className="text-slate-300 text-sm leading-relaxed mt-2">
              {book.description}
            </p>
          </div>
        </div>

        {/* Interactive Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-6 relative z-10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'characters' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Characters ({bookCharacters.length})</span>
          </button>

          {book.magicSystem && (
            <button
              onClick={() => setActiveTab('magic')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'magic' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Magic System</span>
            </button>
          )}

          {book.kingdomMap && (
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'map' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Kingdom Map</span>
            </button>
          )}

          {book.chapterExcerpts && (
            <button
              onClick={() => setActiveTab('excerpts')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'excerpts' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Excerpts</span>
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <div className="relative z-10 min-h-[220px]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Release announcement box if available */}
              {book.releaseAnnouncement && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-orange-500/10 border-2 border-amber-400/50 shadow-xl">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider">
                      <PartyPopper className="w-3.5 h-3.5" />
                      Paperback Release Announcement
                    </span>
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      16th August (Birthday Edition)
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-slate-100 mt-2 mb-1">
                    Volume 1 of "The Lost Soul of Throne" Releasing in Paperback
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed mb-3">
                    {book.releaseAnnouncement.details}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-amber-400/50 text-amber-300 text-xs font-bold">
                      <ShoppingCart className="w-4 h-4 text-amber-400" />
                      <span>Platform: Exclusive Only on Amazon</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium">
                      <span>Format: Premium Physical Paperback Edition</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-3">Key Literary Elements</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {book.featuresList.map((feature, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-semibold text-slate-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {book.familyTrees && (
                <div>
                  <h3 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-3">Major Houses & Bloodlines</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {book.familyTrees.map((house, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20">
                        <h4 className="font-serif font-bold text-slate-100">{house.houseName}</h4>
                        <p className="text-xs italic text-amber-300 mb-2">"{house.motto}"</p>
                        <div className="flex flex-wrap gap-1.5">
                          {house.members.map((m, mIdx) => (
                            <span key={mIdx} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Characters Tab */}
          {activeTab === 'characters' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookCharacters.map((char) => (
                <div key={char.id} className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif text-lg font-bold text-slate-100">{char.name}</h4>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-semibold">
                        {char.affinity}
                      </span>
                    </div>
                    <p className="text-xs text-amber-400/90 font-medium mb-2">{char.role}</p>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{char.description}</p>
                  </div>
                  <p className="text-xs italic text-slate-400 border-t border-slate-800/80 pt-2">
                    "{char.quote}"
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Magic System Tab */}
          {activeTab === 'magic' && book.magicSystem && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20">
                <h4 className="font-serif text-xl font-bold text-amber-300 mb-2">{book.magicSystem.name}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{book.magicSystem.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {book.magicSystem.elements.map((elem, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${elem.color}20`, color: elem.color }}>
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-serif text-sm font-bold text-slate-100">{elem.name}</h5>
                      <p className="text-xs text-slate-400 mt-1">{elem.power}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kingdom Map Tab */}
          {activeTab === 'map' && book.kingdomMap && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {book.kingdomMap.regions.map((region, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif font-bold text-slate-100">{region.name}</h4>
                  </div>
                  <p className="text-xs text-amber-400 mb-1">Ruler: <span className="text-slate-200">{region.ruler}</span></p>
                  <p className="text-xs text-slate-400 mb-2">Climate: {region.climate}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{region.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Chapter Excerpts Tab */}
          {activeTab === 'excerpts' && book.chapterExcerpts && (
            <div className="space-y-4">
              {book.chapterExcerpts.map((excerpt, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/20 relative">
                  <QuoteIcon className="w-6 h-6 text-amber-500/20 absolute top-4 right-4" />
                  <h4 className="font-serif font-bold text-amber-300 mb-3">{excerpt.title}</h4>
                  <p className="font-serif italic text-slate-200 text-sm leading-relaxed">
                    "{excerpt.excerpt}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
