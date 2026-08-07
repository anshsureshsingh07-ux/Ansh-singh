import React, { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import {
  X,
  Edit3,
  Crop,
  RotateCcw,
  RotateCw,
  Trash2,
  Check,
  Sliders,
  AlertCircle,
  Lock,
  Shield,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  SlidersHorizontal,
  Image as ImageIcon
} from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getCroppedImg, PixelCrop } from '../utils/cropUtils';

export const PhotoEditModal: React.FC = () => {
  const { editingPhoto, closeEditor, updatePhoto, deletePhoto, resetPhoto, getFilterCss, isAdmin } = usePhotos();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Book concepts');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [filterPreset, setFilterPreset] = useState('none');

  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Cropper State
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1); // Default 1:1 square
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [isProcessingCrop, setIsProcessingCrop] = useState(false);

  useEffect(() => {
    if (editingPhoto) {
      setTitle(editingPhoto.title || '');
      setCategory(editingPhoto.category || 'Artwork');
      setDescription(editingPhoto.description || '');
      setImageUrl(editingPhoto.imageUrl || '');
      setFilterPreset(editingPhoto.filterPreset || 'none');
      setSelectedFile(null);
      setFilePreview(null);
      setStatusMessage(null);
      setIsCropping(false);
      setZoom(1);
      setRotation(0);
      setCrop({ x: 0, y: 0 });
    }
  }, [editingPhoto]);

  if (!editingPhoto) return null;

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFilePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Crop callback
  const onCropComplete = useCallback((_croppedArea: any, croppedPixels: PixelCrop) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Apply crop
  const handleApplyCrop = async () => {
    const currentSrc = filePreview || imageUrl || editingPhoto.imageUrl;
    if (!currentSrc || !croppedAreaPixels) return;

    setIsProcessingCrop(true);
    setStatusMessage('Processing cropped image...');

    try {
      const croppedImageBase64 = await getCroppedImg(currentSrc, croppedAreaPixels, rotation);
      setFilePreview(croppedImageBase64);
      setImageUrl(croppedImageBase64);
      setIsCropping(false);
      setStatusMessage('Crop applied successfully!');
    } catch (err: any) {
      console.error('Crop error:', err);
      setStatusMessage(`Crop error: ${err?.message || 'Could not crop image. Check CORS or source.'}`);
    } finally {
      setIsProcessingCrop(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setStatusMessage('Please provide a photo title.');
      return;
    }

    setIsUploading(true);
    setStatusMessage('Saving photo changes...');

    try {
      let finalUrl = imageUrl;

      // If a file was selected and Supabase is configured, upload to storage bucket "photos"
      if (selectedFile && isSupabaseConfigured) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `edited/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
          .from('photos')
          .upload(filePath, selectedFile, { cacheControl: '3600', upsert: true });

        if (!uploadErr) {
          const { data: publicData } = supabase.storage.from('photos').getPublicUrl(filePath);
          if (publicData?.publicUrl) {
            finalUrl = publicData.publicUrl;
          }
        }
      }

      await updatePhoto(editingPhoto.id, {
        title,
        category,
        description,
        imageUrl: finalUrl,
        filterPreset,
      });

      setStatusMessage('Photo updated successfully!');
      setTimeout(() => {
        closeEditor();
      }, 500);
    } catch (err: any) {
      setStatusMessage(`Updated locally: ${err.message || 'Saved'}`);
      setTimeout(() => {
        closeEditor();
      }, 600);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    resetPhoto(editingPhoto.id);
    setStatusMessage('Reset to original default image.');
    setTimeout(() => {
      closeEditor();
    }, 600);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${editingPhoto.title}"?`)) {
      await deletePhoto(editingPhoto.id);
      closeEditor();
    }
  };

  const openAdminPortal = () => {
    closeEditor();
    window.dispatchEvent(new Event('open-admin-portal'));
  };

  const filterPresets = [
    { id: 'none', label: 'Original' },
    { id: 'warm', label: 'Warm Amber' },
    { id: 'cinematic', label: 'Cinematic Dark' },
    { id: 'vintage', label: 'Vintage Sepia' },
    { id: 'noir', label: 'Monochrome Noir' },
    { id: 'vibrant', label: 'Vibrant Boost' },
    { id: 'soft', label: 'Soft Glow' },
  ];

  const aspectPresets = [
    { label: 'Free', value: undefined },
    { label: '1:1 Square', value: 1 },
    { label: '4:3 Standard', value: 4 / 3 },
    { label: '16:9 Wide', value: 16 / 9 },
    { label: '3:4 Portrait', value: 3 / 4 },
    { label: '2:3 Cover', value: 2 / 3 },
  ];

  const currentPreviewUrl = filePreview || imageUrl || editingPhoto.imageUrl;

  // Render Admin Lock Screen if user is NOT admin
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
        <div className="relative max-w-md w-full bg-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <button
            onClick={closeEditor}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-100">Admin Privileges Required</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Editing photos, artwork covers, and gallery items is restricted to author <span className="text-amber-400 font-semibold">Ansh Singh</span> and site administrators.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-3">
            <button
              type="button"
              onClick={openAdminPortal}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Log In via Admin Portal</span>
            </button>

            <button
              type="button"
              onClick={closeEditor}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative max-w-4xl w-full max-h-[92vh] bg-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-slate-100">Edit Photo Details & Style</h2>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  Admin Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Photo ID: <span className="font-mono text-amber-400">{editingPhoto.id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={closeEditor}
            className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        {statusMessage && (
          <div className="mb-6 p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Cropping Mode Modal Overlay View */}
        {isCropping ? (
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Crop className="w-4 h-4" />
                <span>Crop & Frame Photo</span>
              </div>
              <span className="text-xs text-slate-400">
                Drag frame to reposition or scroll/slider to zoom
              </span>
            </div>

            {/* Interactive Cropper Area */}
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-900 border border-amber-500/30 shadow-2xl">
              <Cropper
                image={currentPreviewUrl}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Aspect Ratio Presets */}
            <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold uppercase block mb-1.5">
                  Aspect Ratio Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {aspectPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setAspect(preset.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        aspect === preset.value
                          ? 'bg-amber-500 text-slate-950 font-bold scale-105'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom & Rotation Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8 flex items-center gap-3">
                  <ZoomOut className="w-4 h-4 text-slate-400" />
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <ZoomIn className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-mono text-amber-400 w-10">{zoom.toFixed(1)}x</span>
                </div>

                <div className="sm:col-span-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate ({rotation}°)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Crop Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCropping(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApplyCrop}
                disabled={isProcessingCrop}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isProcessingCrop ? 'Cropping...' : 'Apply Crop Result'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Photo Form View */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-1">
            {/* Left Column: Preview, Crop Trigger & Filters */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden bg-slate-900 border border-amber-500/30 p-2 relative group shadow-xl">
                <div className="aspect-w-16 aspect-h-12 w-full h-56 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center relative">
                  <img
                    src={currentPreviewUrl}
                    alt={title || 'Preview'}
                    referrerPolicy="no-referrer"
                    style={{ filter: getFilterCss(filterPreset) }}
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {/* Crop Trigger Button on Image Hover */}
                  <button
                    type="button"
                    onClick={() => setIsCropping(true)}
                    className="absolute inset-0 m-auto w-fit h-fit px-4 py-2 rounded-xl bg-slate-950/90 border border-amber-500/50 text-amber-300 hover:text-white hover:bg-amber-500 hover:scale-105 transition-all text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-sm"
                  >
                    <Crop className="w-4 h-4 text-amber-400" />
                    <span>Crop Image</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-950/90 rounded-b-xl text-center">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block">
                    {category}
                  </span>
                  <h4 className="font-serif font-bold text-slate-100 text-sm mt-0.5 line-clamp-1">
                    {title || 'Untitled Photo'}
                  </h4>
                </div>
              </div>

              {/* Crop Trigger Primary Button */}
              <button
                type="button"
                onClick={() => setIsCropping(true)}
                className="w-full py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Crop className="w-4 h-4" />
                <span>Crop & Re-frame Photo</span>
              </button>

              {/* Filter Presets */}
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase block mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preset Filter Effects</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {filterPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setFilterPreset(preset.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        filterPreset === preset.id
                          ? 'bg-amber-500 text-slate-950 shadow-md scale-105 font-bold'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Edit Form */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <form onSubmit={handleSave} className="space-y-4">
                {/* Photo Title */}
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase block mb-1">
                    Photo Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title of this photograph or illustration"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Input Mode Selector: Local File vs Image URL */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-slate-400 font-semibold uppercase">
                      Change Image Source
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInputMode('upload')}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                          inputMode === 'upload' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-500'
                        }`}
                      >
                        Upload Local File
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMode('url')}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                          inputMode === 'url' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-500'
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {inputMode === 'upload' ? (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-600 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Supports JPG, PNG, WEBP, GIF, SVG (Uploads to bucket <code className="text-amber-400">photos</code>)
                      </span>
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setFilePreview(null);
                      }}
                      placeholder="https://images.unsplash.com/... or Supabase public image URL"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                    />
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Book concepts">Book concepts</option>
                    <option value="Writing setup">Writing setup</option>
                    <option value="Artwork">Artwork</option>
                    <option value="Nature">Nature</option>
                    <option value="Inspirations">Inspirations</option>
                    <option value="School life">School life</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Pet Mascot">Pet Mascot</option>
                    <option value="Book Cover">Book Cover</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase block mb-1">
                    Description / Caption
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details, story behind the artwork, or inspiration..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                      title="Reset to default image"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={closeEditor}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isUploading ? 'Saving...' : 'Save Photo Changes'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
