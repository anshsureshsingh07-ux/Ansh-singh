import React from 'react';
import { Edit3 } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

interface EditableImageProps {
  photoId: string;
  defaultSrc: string;
  defaultTitle?: string;
  defaultCategory?: string;
  defaultDescription?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  showEditBadge?: boolean;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  photoId,
  defaultSrc,
  defaultTitle,
  defaultCategory,
  defaultDescription,
  alt,
  className = '',
  containerClassName = '',
  style = {},
  onClick,
  showEditBadge = true,
}) => {
  const { photos, openEditor, getFilterCss, isAdmin } = usePhotos();

  const photo = photos[photoId];
  const src = photo?.imageUrl || defaultSrc;
  const title = photo?.title || defaultTitle || alt;
  const filterPreset = photo?.filterPreset || 'none';

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditor(photoId, {
      title: title,
      category: defaultCategory || photo?.category || 'Artwork',
      description: defaultDescription || photo?.description || '',
      imageUrl: src,
    });
  };

  return (
    <div className={`relative group/editable ${containerClassName}`}>
      <img
        src={src}
        alt={title}
        referrerPolicy="no-referrer"
        style={{ ...style, filter: getFilterCss(filterPreset) }}
        className={className}
        onClick={onClick}
      />

      {showEditBadge && isAdmin && (
        <button
          type="button"
          onClick={handleEditClick}
          className="absolute top-2 right-2 z-20 p-2 rounded-xl bg-slate-950/90 border border-amber-500/50 text-amber-400 hover:text-white hover:bg-amber-500 hover:scale-110 transition-all opacity-0 group-hover/editable:opacity-100 shadow-xl flex items-center gap-1.5 text-xs font-bold"
          title={`Edit photo "${title}"`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Edit Photo</span>
        </button>
      )}
    </div>
  );
};
