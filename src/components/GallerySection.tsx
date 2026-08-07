import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Sparkles, X, Maximize2, Plus, Edit3 } from 'lucide-react';
import { usePhotos, EditablePhoto } from '../context/PhotoContext';
import { EditableImage } from './EditableImage';

export const GallerySection: React.FC = () => {
  const { galleryList, openEditor, isAdmin } = usePhotos();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [zoomedImage, setZoomedImage] = useState<EditablePhoto | null>(null);

  const categories = ['All', 'Writing setup', 'Book concepts', 'Artwork', 'Nature', 'Inspirations', 'School life'];

  const filteredItems = selectedCategory === 'All'
    ? galleryList
    : galleryList.filter(item => item.category === selectedCategory);

  const handleAddNewPhoto = () => {
    const newId = `photo_${Date.now()}`;
    openEditor(newId, {
      title: 'New Gallery Photo',
      category: selectedCategory === 'All' ? 'Artwork' : selectedCategory,
      description: 'Uploaded by author',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    });
  };

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Visual Archive</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
            Author <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Gallery</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            A glimpse into writing desks, book concept artwork, travel inspirations, and school memories. Hover over any photo to edit or style it.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter Tabs & Add Photo Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-2 mx-auto sm:mx-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105 font-bold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isAdmin && (
            <button
              onClick={handleAddNewPhoto}
              className="mx-auto sm:mx-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Photo</span>
            </button>
          )}
        </div>

        {/* Masonry / Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/50 shadow-xl"
              >
                <div className="aspect-w-16 aspect-h-12 w-full h-64 overflow-hidden relative">
                  <EditableImage
                    photoId={item.id}
                    defaultSrc={item.imageUrl}
                    defaultTitle={item.title}
                    defaultCategory={item.category}
                    defaultDescription={item.description}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                    containerClassName="w-full h-full"
                    onClick={() => setZoomedImage(item)}
                  />

                  {/* Overlay Info */}
                  <div
                    onClick={() => setZoomedImage(item)}
                    className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 cursor-pointer pointer-events-none group-hover:pointer-events-auto"
                  >
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold tracking-wider uppercase w-fit mb-2">
                      {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-slate-100 text-base">{item.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">{item.description}</p>
                    <div className="mt-3 text-amber-400 text-xs font-semibold flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View Full Image</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-3xl w-full bg-slate-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              {isAdmin ? (
                <button
                  onClick={() => {
                    setZoomedImage(null);
                    openEditor(zoomedImage.id, {
                      title: zoomedImage.title,
                      category: zoomedImage.category,
                      description: zoomedImage.description,
                      imageUrl: zoomedImage.imageUrl,
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold flex items-center gap-1.5 border border-amber-500/30"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit This Photo</span>
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={() => setZoomedImage(null)}
                className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={zoomedImage.imageUrl}
              alt={zoomedImage.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[65vh] object-contain rounded-2xl mb-4 border border-slate-800"
            />

            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase">
                {zoomedImage.category}
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-100 mt-2">{zoomedImage.title}</h3>
              <p className="text-sm text-slate-300 mt-1 max-w-xl mx-auto">{zoomedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
