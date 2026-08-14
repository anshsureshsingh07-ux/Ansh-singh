import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  X,
  Shield,
  Bot,
  Sparkles,
  CheckCircle2,
  Lock,
  UserX,
  Flame,
  Radio,
  FileText,
  Clock,
  Ban
} from 'lucide-react';
import { useUserIdentity } from '../context/UserIdentityContext';
import { ScanAnalysisResult } from '../utils/safetyModeration';

const REPORT_REASONS = [
  {
    id: 'abusive_language',
    label: 'Abusive / Vulgar Language',
    desc: 'Offensive curses, profanity, toxic insults or abusive remarks.',
    defaultDays: 3,
    icon: Flame,
  },
  {
    id: 'hate_speech',
    label: 'Hate Speech & Discriminatory Slurs',
    desc: 'Attacks targeting race, religion, ethnicity, gender, or identity.',
    defaultDays: 7,
    icon: Ban,
  },
  {
    id: 'harassment',
    label: 'Harassment & Bullying',
    desc: 'Targeted hostility, intimidation, or aggressive behavior.',
    defaultDays: 5,
    icon: UserX,
  },
  {
    id: 'threat',
    label: 'Violent Threats & Harm',
    desc: 'Threats of violence, encouragement of self-harm, or dangerous conduct.',
    defaultDays: 7,
    icon: AlertTriangle,
  },
  {
    id: 'spam',
    label: 'Spam, Phishing & Malicious Scams',
    desc: 'Repetitive spam, deceptive links, or unauthorized bot traffic.',
    defaultDays: 3,
    icon: Radio,
  },
];

export const ReportContentModal: React.FC = () => {
  const {
    isReportModalOpen,
    activeReportTarget,
    closeReportModal,
    processReportAndLoreAiScan,
  } = useUserIdentity();

  const [selectedReason, setSelectedReason] = useState<
    'abusive_language' | 'hate_speech' | 'harassment' | 'threat' | 'spam' | 'other'
  >('abusive_language');
  const [customNotes, setCustomNotes] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanAnalysisResult | null>(null);
  const [banIssued, setBanIssued] = useState(false);
  const [step, setStep] = useState<'form' | 'scanning' | 'verdict'>('form');

  const handleClose = () => {
    setStep('form');
    setScanResult(null);
    setBanIssued(false);
    setCustomNotes('');
    closeReportModal();
  };

  React.useEffect(() => {
    if (!isReportModalOpen) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReportModalOpen]);

  if (!isReportModalOpen || !activeReportTarget) return null;

  const handleRunReportAndScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('scanning');
    setIsScanning(true);

    // Simulate real AI scanning progress
    setTimeout(async () => {
      const response = await processReportAndLoreAiScan(selectedReason, customNotes);
      setScanResult(response.scanResult);
      setBanIssued(response.banIssued);
      setIsScanning(false);
      setStep('verdict');
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-slate-900 border-2 border-red-500/40 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-red-950/40 via-slate-950/60 to-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span>Report Violation & LORE AI Scan</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Automated Safety Scanner will analyze content and enforce temporary bans
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body based on step */}
          {step === 'form' && (
            <form onSubmit={handleRunReportAndScan} className="p-6 space-y-5">
              {/* Target Content Snippet Preview */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <span className="text-red-400 font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-red-950/50 border border-red-500/30">
                      Flagged {activeReportTarget.targetType}
                    </span>
                    <span>by {activeReportTarget.authorName}</span>
                    <span className="text-slate-500 font-mono text-[11px]">(@{activeReportTarget.authorHandle})</span>
                  </div>
                </div>
                {activeReportTarget.targetTitle && (
                  <p className="font-serif font-bold text-sm text-slate-200">
                    "{activeReportTarget.targetTitle}"
                  </p>
                )}
                <p className="text-xs text-slate-300 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 line-clamp-3">
                  "{activeReportTarget.targetContent}"
                </p>
              </div>

              {/* Reason Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Select Violation Category <span className="text-red-400">*</span>
                </label>
                <div className="space-y-2">
                  {REPORT_REASONS.map((reason) => {
                    const Icon = reason.icon;
                    const isSelected = selectedReason === reason.id;
                    return (
                      <button
                        key={reason.id}
                        type="button"
                        onClick={() => setSelectedReason(reason.id as any)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-red-950/40 border-red-500/60 text-slate-100 shadow-md shadow-red-950/50'
                            : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isSelected ? 'bg-red-500 text-slate-950 font-bold' : 'bg-slate-800 text-red-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-100">{reason.label}</span>
                            <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                              {reason.defaultDays} Days Ban
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{reason.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                  Optional Additional Context
                </label>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  rows={2}
                  placeholder="Explain why this content or language is abusive..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-400 focus:outline-none text-slate-100 text-xs placeholder:text-slate-600 resize-none"
                />
              </div>

              {/* Notice */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
                <Bot className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300 font-semibold">LORE AI Automatic Enforcement:</strong> When you submit, LORE AI Guardian immediately scans the vocabulary and tone. If abusive language is verified, the offending user is temporarily suspended from the website for 3–7 days and content is quarantined.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-red-900/30 transition-all flex items-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  <span>Scan & Report Content</span>
                </button>
              </div>
            </form>
          )}

          {/* Scanning Animation */}
          {step === 'scanning' && (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center text-red-400 animate-pulse shadow-2xl">
                  <Bot className="w-10 h-10 animate-spin-slow" />
                </div>
                <div className="absolute -inset-2 bg-red-500/20 rounded-3xl blur-xl animate-ping opacity-30 pointer-events-none" />
              </div>

              <div>
                <h4 className="font-serif text-lg font-bold text-slate-100 mb-1">
                  LORE AI Safety Scanner Analyzing...
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Parsing lexical tokens, analyzing toxic hostility, harassment patterns, and computing ban duration...
                </p>
              </div>

              <div className="w-48 h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-red-500 animate-[pulse_1s_infinite] w-full" />
              </div>
            </div>
          )}

          {/* Verdict and Results */}
          {step === 'verdict' && scanResult && (
            <div className="p-6 space-y-5">
              {banIssued ? (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-red-950/40 border-2 border-red-500/50 shadow-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-red-500 text-slate-950 font-black text-xs uppercase flex items-center gap-1">
                      <UserX className="w-3.5 h-3.5" />
                      Abuse Confirmed • Author Banned
                    </span>
                    <span className="text-xs font-bold text-red-300">
                      Duration: {scanResult.suggestedBanDays} Days
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-slate-100">
                    LORE AI Safety Guardian Enforcement Active
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scanResult.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-red-500/20">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Suspended User</span>
                      <span className="text-slate-200 font-bold">{activeReportTarget.authorName}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Action Taken</span>
                      <span className="text-red-400 font-bold">{scanResult.suggestedBanDays}-Day Site Suspension</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Report Logged
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-slate-100">
                    Report Logged for Moderator Review
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scanResult.summary}
                  </p>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Content has been quarantined from public view</span>
                </span>
                <span className="text-amber-400 font-mono text-[10px]">
                  Incident #{Date.now().toString().slice(-6)}
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
