import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RepinshUserProfile, UserBanRecord, ContentReport } from '../types';
import { REPINSH_DEFAULT_USER } from '../data/repinshData';
import {
  validateSafeName,
  sanitizeString,
  getStoredBannedUsers,
  saveBannedUserRecord,
  pardonBannedUser,
  checkIsUserBanned,
  getStoredReports,
  saveReportRecord,
  scanTextForAbusiveLanguage,
  ScanAnalysisResult
} from '../utils/safetyModeration';

interface ReportTargetPayload {
  targetType: 'topic' | 'comment' | 'guestbook' | 'message';
  targetId: string;
  targetTitle?: string;
  targetContent: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
}

interface UserIdentityContextType {
  currentUser: RepinshUserProfile;
  updateUserProfile: (
    displayName: string,
    handle: string,
    avatarSeed: string,
    bio?: string
  ) => { success: boolean; error?: string };
  isEditProfileOpen: boolean;
  openEditProfileModal: () => void;
  closeEditProfileModal: () => void;
  
  // Reporting & Safety Modal State
  isReportModalOpen: boolean;
  activeReportTarget: ReportTargetPayload | null;
  openReportModal: (target: ReportTargetPayload) => void;
  closeReportModal: () => void;

  // Safety Log Modal State
  isSafetyLogModalOpen: boolean;
  openSafetyLogModal: () => void;
  closeSafetyLogModal: () => void;

  // Moderation state
  bannedUsers: UserBanRecord[];
  reports: ContentReport[];
  isCurrentUserBanned: boolean;
  currentUserBanRecord: UserBanRecord | null;
  
  // Actions
  processReportAndLoreAiScan: (
    reason: 'abusive_language' | 'hate_speech' | 'harassment' | 'threat' | 'spam' | 'other',
    customNotes?: string,
    overrideBanDays?: number
  ) => Promise<{ success: boolean; scanResult: ScanAnalysisResult; banIssued: boolean }>;
  
  pardonUserById: (userId: string) => void;
  manualBanUser: (
    userId: string,
    handle: string,
    displayName: string,
    reason: string,
    snippet: string,
    days?: number
  ) => void;
  autoEnforceAbusiveContent: (
    flaggedText: string,
    offendingUser?: RepinshUserProfile,
    reasonOverride?: string
  ) => { isBanned: boolean; banRecord?: UserBanRecord; scanResult: ScanAnalysisResult };
  refreshModerationState: () => void;
}

const UserIdentityContext = createContext<UserIdentityContextType | null>(null);

export const UserIdentityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user profile
  const [currentUser, setCurrentUser] = useState<RepinshUserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('repinsh_user_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return REPINSH_DEFAULT_USER;
  });

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeReportTarget, setActiveReportTarget] = useState<ReportTargetPayload | null>(null);
  const [isSafetyLogModalOpen, setIsSafetyLogModalOpen] = useState(false);

  // Moderation states
  const [bannedUsers, setBannedUsers] = useState<UserBanRecord[]>([]);
  const [reports, setReports] = useState<ContentReport[]>([]);

  // Load and refresh bans & reports
  const refreshModerationState = useCallback(() => {
    const storedBans = getStoredBannedUsers();
    const storedReports = getStoredReports();
    setBannedUsers(storedBans);
    setReports(storedReports);
  }, []);

  useEffect(() => {
    refreshModerationState();
    // Auto-check periodically every 30 seconds for expired bans
    const interval = setInterval(refreshModerationState, 30000);
    return () => clearInterval(interval);
  }, [refreshModerationState]);

  // Save current user to localStorage whenever changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('repinsh_user_profile', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Check if current user is banned
  const banCheck = checkIsUserBanned(currentUser.id, currentUser.handle);
  const isCurrentUserBanned = banCheck.isBanned;
  const currentUserBanRecord = banCheck.record || null;

  // Safe update user profile with sanitization & bad word prevention
  const updateUserProfile = (
    displayName: string,
    handle: string,
    avatarSeed: string,
    bio?: string
  ): { success: boolean; error?: string } => {
    const validation = validateSafeName(displayName, handle);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const cleanBio = sanitizeString(bio || '');
    if (cleanBio.length > 200) {
      return { success: false, error: 'Bio cannot exceed 200 characters.' };
    }

    const updatedUser: RepinshUserProfile = {
      ...currentUser,
      displayName: validation.sanitizedName,
      handle: validation.sanitizedHandle,
      avatarSeed: avatarSeed || currentUser.avatarSeed,
      bio: cleanBio || currentUser.bio,
      isGuest: false,
    };

    setCurrentUser(updatedUser);
    setIsEditProfileOpen(false);
    return { success: true };
  };

  const openEditProfileModal = () => setIsEditProfileOpen(true);
  const closeEditProfileModal = () => setIsEditProfileOpen(false);

  const openReportModal = (target: ReportTargetPayload) => {
    setActiveReportTarget(target);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setActiveReportTarget(null);
  };

  const openSafetyLogModal = () => setIsSafetyLogModalOpen(true);
  const closeSafetyLogModal = () => setIsSafetyLogModalOpen(false);

  // Process a report: LORE AI Scans the content, flags violations, and triggers a temporary ban
  const processReportAndLoreAiScan = async (
    reason: 'abusive_language' | 'hate_speech' | 'harassment' | 'threat' | 'spam' | 'other',
    customNotes?: string,
    overrideBanDays?: number
  ): Promise<{ success: boolean; scanResult: ScanAnalysisResult; banIssued: boolean }> => {
    if (!activeReportTarget) {
      return {
        success: false,
        scanResult: {
          isAbusive: false,
          confidence: 0,
          severity: 'low',
          detectedPatterns: [],
          summary: 'No content target specified.',
          suggestedBanDays: 3,
        },
        banIssued: false,
      };
    }

    // Perform LORE AI Deep Safety Scan
    const scan = scanTextForAbusiveLanguage(activeReportTarget.targetContent, reason);
    const banDays = overrideBanDays || scan.suggestedBanDays;
    const now = Date.now();
    const bannedUntil = now + banDays * 24 * 60 * 60 * 1000;
    const incidentId = `inc_${Date.now()}`;

    const newReport: ContentReport = {
      id: `rep_${Date.now()}`,
      targetType: activeReportTarget.targetType,
      targetId: activeReportTarget.targetId,
      targetTitle: activeReportTarget.targetTitle,
      targetContent: activeReportTarget.targetContent,
      authorId: activeReportTarget.authorId,
      authorName: activeReportTarget.authorName,
      authorHandle: activeReportTarget.authorHandle,
      reportedBy: currentUser.displayName,
      reason,
      customNotes: sanitizeString(customNotes || ''),
      reportedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: scan.isAbusive ? 'resolved_banned' : 'pending',
      scanResult: scan,
    };

    saveReportRecord(newReport);

    let banIssued = false;
    // If abusive language or violation detected, issue temporary ban to the offender
    if (scan.isAbusive || reason === 'abusive_language' || reason === 'hate_speech' || reason === 'harassment') {
      const newBan: UserBanRecord = {
        userId: activeReportTarget.authorId,
        handle: activeReportTarget.authorHandle,
        displayName: activeReportTarget.authorName,
        bannedAt: now,
        bannedUntil,
        banDurationDays: banDays,
        reason: `Violated Community Safety: ${reason.replace('_', ' ').toUpperCase()} detected by LORE AI Safety Guardian.`,
        flaggedContentSnippet: activeReportTarget.targetContent.slice(0, 140),
        reportedBy: currentUser.displayName,
        incidentId,
        status: 'active',
      };

      saveBannedUserRecord(newBan);
      banIssued = true;
    }

    refreshModerationState();
    return { success: true, scanResult: scan, banIssued };
  };

  const pardonUserById = (userId: string) => {
    pardonBannedUser(userId);
    refreshModerationState();
  };

  const manualBanUser = (
    userId: string,
    handle: string,
    displayName: string,
    reason: string,
    snippet: string,
    days: number = 3
  ) => {
    const now = Date.now();
    const bannedUntil = now + days * 24 * 60 * 60 * 1000;
    const newBan: UserBanRecord = {
      userId,
      handle,
      displayName,
      bannedAt: now,
      bannedUntil,
      banDurationDays: days,
      reason,
      flaggedContentSnippet: snippet,
      reportedBy: currentUser.displayName,
      incidentId: `man_${Date.now()}`,
      status: 'active',
    };
    saveBannedUserRecord(newBan);
    refreshModerationState();
  };

  const autoEnforceAbusiveContent = (
    flaggedText: string,
    offendingUser?: RepinshUserProfile,
    reasonOverride?: string
  ): { isBanned: boolean; banRecord?: UserBanRecord; scanResult: ScanAnalysisResult } => {
    const userToBan = offendingUser || currentUser;
    const scan = scanTextForAbusiveLanguage(flaggedText, reasonOverride as any);
    const banDays = scan.suggestedBanDays || 3;
    const now = Date.now();
    const bannedUntil = now + banDays * 24 * 60 * 60 * 1000;
    const incidentId = `auto_${Date.now()}`;

    const newReport: ContentReport = {
      id: `rep_${Date.now()}`,
      targetType: 'comment',
      targetId: `auto_${Date.now()}`,
      targetContent: flaggedText,
      authorId: userToBan.id,
      authorName: userToBan.displayName,
      authorHandle: userToBan.handle,
      reportedBy: 'LORE AI Automated Guardian',
      reason: 'abusive_language',
      customNotes: 'Automated real-time abusive language detection trigger.',
      reportedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'resolved_banned',
      scanResult: scan,
    };
    saveReportRecord(newReport);

    const newBan: UserBanRecord = {
      userId: userToBan.id,
      handle: userToBan.handle,
      displayName: userToBan.displayName,
      bannedAt: now,
      bannedUntil,
      banDurationDays: banDays,
      reason: reasonOverride || `Abusive/Inappropriate Language (${scan.severity.toUpperCase()}) flagged by LORE AI Safety Guardian`,
      flaggedContentSnippet: flaggedText.slice(0, 140),
      reportedBy: 'LORE AI Automated Guardian',
      incidentId,
      status: 'active',
    };

    saveBannedUserRecord(newBan);
    refreshModerationState();

    return { isBanned: true, banRecord: newBan, scanResult: scan };
  };

  return (
    <UserIdentityContext.Provider
      value={{
        currentUser,
        updateUserProfile,
        isEditProfileOpen,
        openEditProfileModal,
        closeEditProfileModal,
        isReportModalOpen,
        activeReportTarget,
        openReportModal,
        closeReportModal,
        isSafetyLogModalOpen,
        openSafetyLogModal,
        closeSafetyLogModal,
        bannedUsers,
        reports,
        isCurrentUserBanned,
        currentUserBanRecord,
        processReportAndLoreAiScan,
        pardonUserById,
        manualBanUser,
        autoEnforceAbusiveContent,
        refreshModerationState,
      }}
    >
      {children}
    </UserIdentityContext.Provider>
  );
};

export const useUserIdentity = () => {
  const ctx = useContext(UserIdentityContext);
  if (!ctx) {
    throw new Error('useUserIdentity must be used within a UserIdentityProvider');
  }
  return ctx;
};
