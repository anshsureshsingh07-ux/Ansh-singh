import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  X,
  Bot,
  AlertTriangle,
  Clock,
  UserX,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Search,
  Sparkles,
  Ban
} from 'lucide-react';
import { useUserIdentity } from '../context/UserIdentityContext';
import { formatTimeRemaining, scanTextForAbusiveLanguage } from '../utils/safetyModeration';

export const LoreAiSafetyLogModal: React.FC = () => {
  const {
    isSafetyLogModalOpen,
    closeSafetyLogModal,
    bannedUsers,
    reports,
    pardonUserById,
    manualBanUser,
  } = useUserIdentity();

  const [activeTab, setActiveTab] = useState<'bans' | 'reports' | 'tester'>('bans');
  const [testText, setTestText] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  React.useEffect(() => {
    if (!isSafetyLogModalOpen) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSafetyLogModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSafetyLogModalOpen, closeSafetyLogModal]);

  if (!isSafetyLogModalOpen) return null;

  const handleRunTester = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testText.trim()) return;
    const res = scanTextForAbusiveLanguage(testText);
    setTestResult(res);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSafetyLogModal}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span>LORE AI Safety Guardian & Moderation Logs</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Automated scan results, temporary ban schedules, and report history
                </p>
              </div>
            </div>

            <button
              onClick={closeSafetyLogModal}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 pt-4 flex border-b border-slate-800 bg-slate-950/30 gap-2">
            <button
              onClick={() => setActiveTab('bans')}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'bans'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Active Bans ({bannedUsers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'reports'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Reported Incidents ({reports.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('tester')}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'tester'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>LORE AI Scanner Test</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {/* TAB: BANS */}
            {activeTab === 'bans' && (
              <div className="space-y-3">
                {bannedUsers.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                    <p className="font-semibold text-slate-300">Clean Community Record</p>
                    <p className="mt-1">No active temporary bans. All participants are in good standing.</p>
                  </div>
                ) : (
                  bannedUsers.map((ban) => {
                    const timeRemaining = formatTimeRemaining(ban.bannedUntil);
                    const isExpired = Date.now() >= ban.bannedUntil || ban.status !== 'active';

                    return (
                      <div
                        key={ban.incidentId}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200 text-sm">
                              {ban.displayName}
                            </span>
                            <span className="text-slate-500 font-mono text-[11px]">
                              (@{ban.handle})
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                isExpired
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-red-950 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {isExpired ? 'Restored' : `${ban.banDurationDays}-Day Suspension`}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px]">
                            <strong className="text-red-400">Violation:</strong> {ban.reason}
                          </p>
                          <p className="text-slate-500 italic text-[11px] line-clamp-1">
                            Snippet: "{ban.flaggedContentSnippet}"
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5 flex-shrink-0 self-end sm:self-center">
                          <div className="text-right">
                            <span className="text-slate-500 text-[10px] block uppercase font-bold">
                              Status
                            </span>
                            <span className="font-bold text-amber-400 text-[11px]">
                              {timeRemaining.formatted}
                            </span>
                          </div>
                          <button
                            onClick={() => pardonUserById(ban.userId)}
                            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
                            title="Pardon / Restore User"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB: REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-3">
                {reports.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                    <p className="font-semibold text-slate-300">No Reports Filed</p>
                    <p className="mt-1">Community discussions remain civil, engaging, and abuse-free.</p>
                  </div>
                ) : (
                  reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase">
                            {rep.reason.replace('_', ' ')}
                          </span>
                          <span className="text-slate-300 font-semibold">
                            Reported against {rep.authorName} (@{rep.authorHandle})
                          </span>
                        </div>
                        <span className="text-slate-500 text-[11px]">{rep.reportedAt}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 italic">
                        "{rep.targetContent}"
                      </div>

                      {rep.scanResult && (
                        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-amber-500/20 text-[11px] text-slate-300 flex items-start gap-2">
                          <Bot className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-amber-300">LORE AI Scan Result:</strong>{' '}
                            {rep.scanResult.summary}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: TESTER */}
            {activeTab === 'tester' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Test the LORE AI Safety Scanner algorithm in real-time. Enter any sample sentence or abusive phrase to observe how LORE AI classifies toxicity, computes confidence scores, and determines temporary ban days.
                </p>

                <form onSubmit={handleRunTester} className="space-y-3">
                  <textarea
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    rows={3}
                    placeholder="Type a sample test sentence here to scan (e.g. 'I really love your book!' vs abusive insults)..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-slate-100 text-xs placeholder:text-slate-600 resize-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Run LORE AI Deep Scan</span>
                  </button>
                </form>

                {testResult && (
                  <div
                    className={`p-4 rounded-2xl border ${
                      testResult.isAbusive
                        ? 'bg-red-950/40 border-red-500/50 text-red-200'
                        : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    } text-xs space-y-2`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-2">
                        {testResult.isAbusive ? (
                          <>
                            <UserX className="w-4 h-4 text-red-400" />
                            <span>Abusive Language Detected</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Safe Content Verified</span>
                          </>
                        )}
                      </span>
                      <span>Severity: {testResult.severity.toUpperCase()}</span>
                    </div>

                    <p className="text-slate-300">{testResult.summary}</p>

                    {testResult.isAbusive && (
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-300">
                        <strong>Automatic Enforcement:</strong> Offending user would receive a{' '}
                        <span className="underline font-bold">
                          {testResult.suggestedBanDays}-Day Site Suspension
                        </span>{' '}
                        and content will be quarantined.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Ansh Singh Official Lore Community Guardian</span>
            </span>
            <button
              onClick={closeSafetyLogModal}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
