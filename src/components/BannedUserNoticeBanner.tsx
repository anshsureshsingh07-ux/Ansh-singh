import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertOctagon, Clock, ShieldAlert, X, Info, Bot, UserX, RefreshCw } from 'lucide-react';
import { useUserIdentity } from '../context/UserIdentityContext';
import { formatTimeRemaining } from '../utils/safetyModeration';

export const BannedUserNoticeBanner: React.FC = () => {
  const { isCurrentUserBanned, currentUserBanRecord, pardonUserById, currentUser } = useUserIdentity();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; formatted: string }>({
    days: 0,
    hours: 0,
    minutes: 0,
    formatted: '',
  });
  const [showAppealInfo, setShowAppealInfo] = useState(false);

  useEffect(() => {
    if (!isCurrentUserBanned || !currentUserBanRecord) return;

    const updateTimer = () => {
      setTimeLeft(formatTimeRemaining(currentUserBanRecord.bannedUntil));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 10000);
    return () => clearInterval(interval);
  }, [isCurrentUserBanned, currentUserBanRecord]);

  if (!isCurrentUserBanned || !currentUserBanRecord) return null;

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-red-950 via-slate-950 to-red-950 border-b-2 border-red-500 shadow-2xl text-slate-100 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold flex-shrink-0 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2 py-0.5 rounded bg-red-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                  Account Temporarily Suspended
                </span>
                <span className="text-xs font-bold text-red-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  Time Remaining: {timeLeft.formatted}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <strong className="text-red-300">{currentUser.displayName}</strong>, your posting access is temporarily locked due to: <em className="text-slate-100">"{currentUserBanRecord.reason}"</em>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAppealInfo(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-500/50 text-red-300 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              <span>View Ban Details</span>
            </button>
            <button
              onClick={() => pardonUserById(currentUser.id)}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-1"
              title="Reset ban for testing / self-review"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Pardon (Reset)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appeal & Details Modal */}
      <AnimatePresence>
        {showAppealInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAppealInfo(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-slate-900 border-2 border-red-500/50 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                    <UserX className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-100">
                      LORE AI Safety Suspension Record
                    </h3>
                    <p className="text-xs text-slate-400">
                      Incident ID: {currentUserBanRecord.incidentId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAppealInfo(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">Violation Reason</span>
                  <p className="text-red-300 font-semibold">{currentUserBanRecord.reason}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">Flagged Content Snippet</span>
                  <p className="text-slate-300 italic font-mono text-[11px]">"{currentUserBanRecord.flaggedContentSnippet}"</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">Duration</span>
                    <span className="font-bold text-slate-100">{currentUserBanRecord.banDurationDays} Days</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">Unban ETA</span>
                    <span className="font-bold text-amber-400">{timeLeft.formatted}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-slate-200">Community Safety Pledge:</strong> To ensure a welcoming, respectful environment for book discussions and creative exchanges, abusive and vulgar language is not tolerated. Once the suspension period passes, full posting access will automatically restore.
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    pardonUserById(currentUser.id);
                    setShowAppealInfo(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Clear Ban (Dev / Test Pardon)
                </button>
                <button
                  onClick={() => setShowAppealInfo(false)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
