import React, { createContext, useContext, useState, useEffect } from 'react';
import { AUTHOR_INFO, BOOKS_DATA, GALLERY_ITEMS } from '../data/authorData';
import { GalleryItem } from '../types';
import { supabase, isSupabaseConfigured, ADMIN_EMAIL } from '../lib/supabase';

export interface EditablePhoto {
  id: string;
  title: string;
  category?: string;
  description?: string;
  imageUrl: string;
  filterPreset?: string; // e.g. 'none', 'warm', 'cinematic', 'vintage', 'noir', 'vibrant', 'soft'
  storagePath?: string;
}

interface PhotoContextType {
  photos: Record<string, EditablePhoto>;
  galleryList: EditablePhoto[];
  editingPhoto: EditablePhoto | null;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  openEditor: (id: string, defaultData?: Partial<EditablePhoto>) => void;
  closeEditor: () => void;
  updatePhoto: (id: string, updatedData: Partial<EditablePhoto>) => Promise<void>;
  addPhoto: (newPhoto: Omit<EditablePhoto, 'id'>) => Promise<EditablePhoto>;
  deletePhoto: (id: string) => Promise<void>;
  resetPhoto: (id: string) => void;
  getFilterCss: (preset?: string) => string;
}

const STORAGE_KEY = 'ANSH_AUTHOR_PHOTOS_V1';

// Initial default photos map
const initialPhotosMap: Record<string, EditablePhoto> = {
  author_portrait: {
    id: 'author_portrait',
    title: 'Ansh Singh - Author Portrait',
    category: 'Portrait',
    description: 'Official author portrait for Ansh Singh.',
    imageUrl: AUTHOR_INFO.authorImage,
    filterPreset: 'none',
  },
  tonny_rabbit: {
    id: 'tonny_rabbit',
    title: 'Tonny the Rabbit 🐇',
    category: 'Pet Mascot',
    description: "Ansh's companion rabbit Tonny keeping watch over writing sessions.",
    imageUrl: AUTHOR_INFO.family.petImage,
    filterPreset: 'none',
  },
  book_cover_lost_soul: {
    id: 'book_cover_lost_soul',
    title: 'The Lost Soul of Throne - Cover Art',
    category: 'Book Cover',
    description: 'Official cover artwork for The Lost Soul of Throne.',
    imageUrl: BOOKS_DATA.lostSoul.coverImage,
    filterPreset: 'none',
  },
  book_cover_until_death: {
    id: 'book_cover_until_death',
    title: 'Until Death Found Us Again - Cover Art',
    category: 'Book Cover',
    description: 'Official cover artwork for Until Death Found Us Again.',
    imageUrl: BOOKS_DATA.untilDeath.coverImage,
    filterPreset: 'none',
  },
};

// Populate initial gallery items
GALLERY_ITEMS.forEach((item) => {
  initialPhotosMap[item.id] = {
    id: item.id,
    title: item.title,
    category: item.category,
    description: item.description,
    imageUrl: item.imageUrl,
    filterPreset: 'none',
  };
});

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('ANSH_ADMIN_AUTH') === 'true';
  });

  const [photos, setPhotos] = useState<Record<string, EditablePhoto>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialPhotosMap, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load photos from storage', e);
    }
    return initialPhotosMap;
  });

  const [editingPhoto, setEditingPhoto] = useState<EditablePhoto | null>(null);

  // Check Supabase session & storage periodically for admin status
  useEffect(() => {
    const checkAdmin = () => {
      const localAuth = localStorage.getItem('ANSH_ADMIN_AUTH') === 'true';
      if (localAuth) {
        setIsAdmin(true);
        return;
      }
      if (isSupabaseConfigured) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session && session.user.email === ADMIN_EMAIL) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        });
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    window.addEventListener('admin-auth-changed', checkAdmin);
    window.addEventListener('focus', checkAdmin);
    return () => {
      window.removeEventListener('storage', checkAdmin);
      window.removeEventListener('admin-auth-changed', checkAdmin);
      window.removeEventListener('focus', checkAdmin);
    };
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch (e) {
      console.error('Failed to save photos to storage', e);
    }
  }, [photos]);

  // Load photos from Server API on mount
  useEffect(() => {
    const fetchServerPhotos = async () => {
      try {
        const res = await fetch('/api/photos');
        if (res.ok) {
          const data = await res.json();
          if (data.photos && Object.keys(data.photos).length > 0) {
            setPhotos((prev) => ({ ...prev, ...data.photos }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch photos from server:', err);
      }
    };
    fetchServerPhotos();
  }, []);

  // Load photos from Supabase if available
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase
        .from('photos')
        .select('*')
        .then(({ data, error }) => {
          if (data && data.length > 0) {
            setPhotos((prev) => {
              const updated = { ...prev };
              data.forEach((p) => {
                updated[p.id] = {
                  id: p.id,
                  title: p.title,
                  category: p.category,
                  description: p.description,
                  imageUrl: p.image_url,
                  storagePath: p.storage_path,
                  filterPreset: 'none',
                };
              });
              return updated;
            });
          }
        });
    }
  }, []);

  const openEditor = (id: string, defaultData?: Partial<EditablePhoto>) => {
    const existing = photos[id] || {
      id,
      title: defaultData?.title || 'Photo Item',
      category: defaultData?.category || 'General',
      description: defaultData?.description || '',
      imageUrl: defaultData?.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      filterPreset: 'none',
    };
    setEditingPhoto(existing);
  };

  const closeEditor = () => {
    setEditingPhoto(null);
  };

  const getFilterCss = (preset?: string): string => {
    switch (preset) {
      case 'warm':
        return 'sepia(0.2) contrast(1.05) saturate(1.2) brightness(1.02)';
      case 'cinematic':
        return 'contrast(1.2) saturate(0.9) brightness(0.95)';
      case 'vintage':
        return 'sepia(0.4) contrast(0.95) saturate(0.8) brightness(0.95)';
      case 'noir':
        return 'grayscale(1) contrast(1.25) brightness(0.9)';
      case 'vibrant':
        return 'saturate(1.4) contrast(1.1)';
      case 'soft':
        return 'brightness(1.08) contrast(0.92) saturate(1.05)';
      default:
        return 'none';
    }
  };

  const updatePhoto = async (id: string, updatedData: Partial<EditablePhoto>) => {
    const current = photos[id] || {
      id,
      title: 'Untitled Photo',
      imageUrl: '',
    };
    const updatedItem = { ...current, ...updatedData };

    // Optimistic update locally
    setPhotos((prev) => ({ ...prev, [id]: updatedItem }));

    // Send to Server backend
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', photo: updatedItem }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.photo) {
          setPhotos((prev) => ({ ...prev, [id]: data.photo }));
        }
      }
    } catch (err) {
      console.error('Error saving photo to server:', err);
    }

    // Update in Supabase if configured
    if (isSupabaseConfigured) {
      try {
        await supabase.from('photos').upsert({
          id,
          title: updatedData.title || photos[id]?.title || 'Photo',
          category: updatedData.category || photos[id]?.category || 'General',
          description: updatedData.description || photos[id]?.description || '',
          image_url: updatedData.imageUrl || photos[id]?.imageUrl || '',
          uploaded_by: ADMIN_EMAIL,
        });
      } catch (err) {
        console.error('Supabase update error:', err);
      }
    }
  };

  const addPhoto = async (newPhotoData: Omit<EditablePhoto, 'id'>) => {
    const id = `photo_${Date.now()}`;
    const newPhoto: EditablePhoto = { ...newPhotoData, id };

    setPhotos((prev) => ({ [id]: newPhoto, ...prev }));

    // Send to Server backend
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', photo: newPhoto }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.photo) {
          setPhotos((prev) => ({ ...prev, [id]: data.photo }));
          return data.photo;
        }
      }
    } catch (err) {
      console.error('Error adding photo to server:', err);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('photos').insert({
          id,
          title: newPhoto.title,
          category: newPhoto.category || 'Artwork',
          description: newPhoto.description || '',
          image_url: newPhoto.imageUrl,
          uploaded_by: ADMIN_EMAIL,
        });
      } catch (err) {
        console.error('Supabase insert error:', err);
      }
    }

    return newPhoto;
  };

  const deletePhoto = async (id: string) => {
    setPhotos((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    try {
      await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
    } catch (err) {
      console.error('Error deleting photo on server:', err);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('photos').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete error:', err);
      }
    }
  };

  const resetPhoto = async (id: string) => {
    if (initialPhotosMap[id]) {
      const defaultItem = initialPhotosMap[id];
      setPhotos((prev) => ({
        ...prev,
        [id]: defaultItem,
      }));
      try {
        await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update', photo: defaultItem }),
        });
      } catch (err) {
        console.error('Error resetting photo on server:', err);
      }
    }
  };

  // Extract gallery list items (excluding non-gallery items like author_portrait, etc unless added to gallery)
  const galleryList = (Object.values(photos) as EditablePhoto[]).filter(
    (p) => !['author_portrait', 'tonny_rabbit', 'book_cover_lost_soul', 'book_cover_until_death'].includes(p.id)
  );

  return (
    <PhotoContext.Provider
      value={{
        photos,
        galleryList,
        editingPhoto,
        isAdmin,
        setIsAdmin,
        openEditor,
        closeEditor,
        updatePhoto,
        addPhoto,
        deletePhoto,
        resetPhoto,
        getFilterCss,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};
