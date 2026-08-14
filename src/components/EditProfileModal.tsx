import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  X,
  Check,
  Shield,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  Feather,
  AtSign,
  Palette
} from 'lucide-react';
import { useUserIdentity } from '../context/UserIdentityContext';
import { validateSafeName } from '../utils/safetyModeration';

const AVATAR_SEEDS = [
  { id: 'amber', label: 'Amber Flame', bg: 'bg-amber-500', text: 'text-amber-950', ring: 'ring-amber-400' },
  { id: 'indigo', label: 'Indigo Void', bg: 'bg-indigo-600', text: 'text-indigo-100', ring: 'ring-indigo-400' },
  { id: 'emerald', label: 'Emerald Sage', bg: 'bg-emerald-600', text: 'text-emerald-100', ring: 'ring-emerald-400' },
  { id: 'rose', label: 'Dragon Crimson', bg: 'bg-rose-600', text: 'text-rose-100', ring: 'ring-rose-400' },
  { id: 'cyan', label: 'Aether Blue', bg: 'bg-cyan-500', text: 'text-cyan-950', ring: 'ring-cyan-400' },
  { id: 'violet', label: 'Starlight Violet', bg: 'bg-purple-600', text: 'text-purple-100', ring: 'ring-purple-400' },
];

export const EditProfileModal: React.FC = () => {
  const { currentUser, updateUserProfile, isEditProfileOpen, closeEditProfileModal } = useUserIdentity();

  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [handle, setHandle] = useState(currentUser.handle);
  const [avatarSeed, setAvatarSeed] = useState(currentUser.avatarSeed || 'amber');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Sync state when modal opens & handle Escape key / body scroll
  useEffect(() => {
    if (isEditProfileOpen) {
      setDisplayName(currentUser.displayName);
      setHandle(currentUser.handle);
      setAvatarSeed(currentUser.avatarSeed || 'amber');
      setBio(currentUser.bio || '');
      setValidationError(null);
      setIsSavedSuccess(false);
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeEditProfileModal();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isEditProfileOpen, currentUser, closeEditProfileModal]);

  // Live validation
  const validation = validateSafeName(displayName, handle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const result = updateUserProfile(displayName, handle, avatarSeed, bio);
    if (result.success) {
      setIsSavedSuccess(true);
      setTimeout(() => {
        setIsSavedSuccess(false);
        closeEditProfileModal();
      }, 900);
    } else {
      setValidationError(result.error || 'Failed to save profile.');
    }
  };

  if (!isEditProfileOpen) return null;

  const currentSeedConfig = AVATAR_SEEDS.find(s => s.id === avatarSeed) || AVATAR_SEEDS[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeEditProfileModal}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span>Edit Your Name & Profile</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Safely personalize your identity across REPINSH & Author Discussions
                </p>
              </div>
            </div>

            <button
              onClick={closeEditProfileModal}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Live Identity Card Preview */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl ${currentSeedConfig.bg} ${currentSeedConfig.text} font-bold text-xl flex items-center justify-center shadow-lg uppercase flex-shrink-0`}
              >
                {displayName.trim().charAt(0) || 'G'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-slate-100 truncate">
                    {displayName.trim() || 'Guest Explorer'}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                    Saved Locally
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <AtSign className="w-3 h-3 text-amber-400" />
                  <span>{handle.trim().replace(/^@/, '') || 'explorer'}</span>
                </p>
              </div>
            </div>

            {/* Error notice */}
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Safety Rule Violation:</strong>
                  <span>{validationError}</span>
                </div>
              </motion.div>
            )}

            {/* Success notice */}
            {isSavedSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Identity safely saved and verified by LORE AI!</span>
              </motion.div>
            )}

            {/* Display Name Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Display Name <span className="text-amber-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {displayName.length}/32 chars
                </span>
              </div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setValidationError(null);
                }}
                maxLength={32}
                placeholder="e.g. Dragon Reader, Kaelen's Ally"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-slate-100 text-sm placeholder:text-slate-600 transition-colors"
                required
              />
            </div>

            {/* Username / Handle Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Handle / Username <span className="text-amber-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  @{handle.replace(/^@/, '')}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">
                  @
                </span>
                <input
                  type="text"
                  value={handle.replace(/^@/, '')}
                  onChange={(e) => {
                    setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''));
                    setValidationError(null);
                  }}
                  maxLength={24}
                  placeholder="dragon_scholar"
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-slate-100 text-sm placeholder:text-slate-600 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            {/* Avatar Color Seed Palette */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                Avatar Theme Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_SEEDS.map((seed) => (
                  <button
                    key={seed.id}
                    type="button"
                    onClick={() => setAvatarSeed(seed.id)}
                    className={`h-11 rounded-xl ${seed.bg} flex items-center justify-center transition-transform hover:scale-105 relative ${
                      avatarSeed === seed.id ? `ring-2 ring-white shadow-lg` : 'opacity-70 hover:opacity-100'
                    }`}
                    title={seed.label}
                  >
                    {avatarSeed === seed.id && (
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Short Bio (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  About You (Bio / Reader Note)
                </label>
                <span className="text-[11px] text-slate-500">{bio.length}/200</span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={200}
                rows={2}
                placeholder="Share your favorite fantasy tropes, theories, or role in REPINSH..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-slate-100 text-xs placeholder:text-slate-600 transition-colors resize-none"
              />
            </div>

            {/* Safety Guarantee Info */}
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-300 font-semibold">Safe & Protected:</strong> Your identity is stored locally in your browser with zero tracking. Profanity, slurs, and malicious impersonations are automatically filtered by LORE AI.
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={closeEditProfileModal}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!validation.isValid || isSavedSuccess}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isSavedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-slate-950" />
                    <span>Save Safe Name</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
