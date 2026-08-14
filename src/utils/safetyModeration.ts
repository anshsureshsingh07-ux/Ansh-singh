import { UserBanRecord, ContentReport } from '../types';

// List of prohibited terms, slurs, toxic phrases, and harassment triggers for client-side instant detection
const ABUSIVE_PATTERNS = [
  // Profanity & Vulgar Harassment
  /\b(fuck|shit|bitch|bastard|asshole|dickhead|cunt|motherfucker|whore|slut)\b/i,
  // Slurs & Hate Speech
  /\b(nigger|nigga|faggot|retard|chink|kike|spic|tranny)\b/i,
  // Violent threats & harassment
  /\b(kill yourself|die in a fire|hope you die|go die|burn in hell|murder you|threaten to kill)\b/i,
  // Severe Harassment & Toxicity
  /\b(useless piece of shit|hate you so much|disgusting animal|trash human|worthless scum)\b/i,
  // Spam & Scams
  /\b(free crypto|earn 10000 daily|click this link now|buy followers|telegram crypto)\b/i,
];

// Mild or questionable words that might be filtered or flagged
const OFFENSIVE_NAME_TERMS = [
  'admin', 'administrator', 'moderator', 'official', 'system', 'root',
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'nazi', 'hitler'
];

/**
 * Strips script tags, HTML tags, and unsafe characters to protect against XSS
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Validates a display name and handle for safety, appropriate length, and non-abusive content
 */
export function validateSafeName(
  displayName: string,
  handle: string
): { isValid: boolean; error?: string; sanitizedName: string; sanitizedHandle: string } {
  const sanitizedName = sanitizeString(displayName);
  const sanitizedHandle = sanitizeString(handle).replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();

  if (!sanitizedName || sanitizedName.length < 2) {
    return { isValid: false, error: 'Display name must be at least 2 characters long.', sanitizedName, sanitizedHandle };
  }

  if (sanitizedName.length > 32) {
    return { isValid: false, error: 'Display name cannot exceed 32 characters.', sanitizedName, sanitizedHandle };
  }

  if (!sanitizedHandle || sanitizedHandle.length < 2) {
    return { isValid: false, error: 'Handle must be at least 2 alphanumeric characters.', sanitizedName, sanitizedHandle };
  }

  if (sanitizedHandle.length > 24) {
    return { isValid: false, error: 'Handle cannot exceed 24 characters.', sanitizedName, sanitizedHandle };
  }

  // Check against reserved / abusive name terms
  const lowerName = sanitizedName.toLowerCase();
  const lowerHandle = sanitizedHandle.toLowerCase();

  for (const term of OFFENSIVE_NAME_TERMS) {
    if (lowerName.includes(term) || lowerHandle.includes(term)) {
      return {
        isValid: false,
        error: `The name contains reserved or prohibited term "${term}". Please choose a respectful identity.`,
        sanitizedName,
        sanitizedHandle,
      };
    }
  }

  // Check if matches severe abusive pattern
  for (const pattern of ABUSIVE_PATTERNS) {
    if (pattern.test(sanitizedName) || pattern.test(sanitizedHandle)) {
      return {
        isValid: false,
        error: 'Name violates community safety guidelines. Please choose a safe display name.',
        sanitizedName,
        sanitizedHandle,
      };
    }
  }

  return { isValid: true, sanitizedName, sanitizedHandle };
}

export interface ScanAnalysisResult {
  isAbusive: boolean;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedPatterns: string[];
  summary: string;
  suggestedBanDays: number;
}

/**
 * Scans content for abusive language, toxic insults, slurs, harassment, and threats.
 * LORE AI Safety Guardian Scan Engine.
 */
export function scanTextForAbusiveLanguage(text: string, reportReason?: string): ScanAnalysisResult {
  const clean = text.trim();
  const detectedPatterns: string[] = [];
  let severityScore = 0;

  for (const regex of ABUSIVE_PATTERNS) {
    const match = clean.match(regex);
    if (match) {
      detectedPatterns.push(match[0]);
      severityScore += 3;
    }
  }

  // Additional heuristics for aggressive caps / punctuation
  if (clean.length > 10 && clean === clean.toUpperCase() && /[!?]{2,}/.test(clean)) {
    severityScore += 1;
  }

  if (reportReason === 'hate_speech' || reportReason === 'threat') {
    severityScore += 4;
  } else if (reportReason === 'abusive_language' || reportReason === 'harassment') {
    severityScore += 2;
  }

  const isAbusive = detectedPatterns.length > 0 || severityScore >= 3;
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let suggestedBanDays = 3; // Default temporary ban of 3 days

  if (severityScore >= 6 || detectedPatterns.some(p => /nigger|faggot|kill yourself|murder/i.test(p))) {
    severity = 'critical';
    suggestedBanDays = 7;
  } else if (severityScore >= 4) {
    severity = 'high';
    suggestedBanDays = 5;
  } else if (severityScore >= 2 || isAbusive) {
    severity = 'medium';
    suggestedBanDays = 3;
  }

  let summary = '';
  if (isAbusive) {
    summary = `LORE AI Safety Scan detected ${detectedPatterns.length > 0 ? `violations matching [${detectedPatterns.join(', ')}]` : 'abusive conduct & harassment'}. Temporary suspension of ${suggestedBanDays} days recommended.`;
  } else {
    summary = 'LORE AI Safety Scan completed: No critical policy violations detected. Content is currently clean.';
  }

  return {
    isAbusive,
    confidence: isAbusive ? Math.min(0.98, 0.75 + detectedPatterns.length * 0.1) : 0.2,
    severity,
    detectedPatterns,
    summary,
    suggestedBanDays,
  };
}

/**
 * Storage helpers for Banned Users
 */
export const BANNED_USERS_KEY = 'repinsh_banned_users';
export const REPORTS_LOG_KEY = 'repinsh_moderation_reports';

export function getStoredBannedUsers(): UserBanRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BANNED_USERS_KEY);
    if (!raw) return [];
    const list: UserBanRecord[] = JSON.parse(raw);
    return list;
  } catch {
    return [];
  }
}

export function saveBannedUserRecord(ban: UserBanRecord): void {
  if (typeof window === 'undefined') return;
  const current = getStoredBannedUsers().filter(b => b.userId !== ban.userId && b.handle !== ban.handle);
  current.unshift(ban);
  localStorage.setItem(BANNED_USERS_KEY, JSON.stringify(current));
}

export function pardonBannedUser(userId: string): void {
  if (typeof window === 'undefined') return;
  const current = getStoredBannedUsers().map(b => {
    if (b.userId === userId) {
      return { ...b, status: 'pardoned' as const, bannedUntil: Date.now() - 1000 };
    }
    return b;
  });
  localStorage.setItem(BANNED_USERS_KEY, JSON.stringify(current));
}

export function checkIsUserBanned(userId: string, handle?: string): { isBanned: boolean; record?: UserBanRecord } {
  const bans = getStoredBannedUsers();
  const now = Date.now();

  const activeBan = bans.find(
    b => (b.userId === userId || (handle && b.handle.toLowerCase() === handle.toLowerCase())) &&
         b.status === 'active' &&
         b.bannedUntil > now
  );

  if (activeBan) {
    return { isBanned: true, record: activeBan };
  }
  return { isBanned: false };
}

export function formatTimeRemaining(bannedUntil: number): { days: number; hours: number; minutes: number; formatted: string } {
  const diff = Math.max(0, bannedUntil - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, formatted: 'Expired / Restored' };
  }

  if (days > 0) {
    return { days, hours, minutes, formatted: `${days} day${days > 1 ? 's' : ''}, ${hours} hr${hours > 1 ? 's' : ''}` };
  }
  if (hours > 0) {
    return { days: 0, hours, minutes, formatted: `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} min` };
  }
  return { days: 0, hours: 0, minutes, formatted: `${minutes} minute${minutes > 1 ? 's' : ''}` };
}

export function getStoredReports(): ContentReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REPORTS_LOG_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveReportRecord(report: ContentReport): void {
  if (typeof window === 'undefined') return;
  const current = getStoredReports().filter(r => r.id !== report.id);
  current.unshift(report);
  localStorage.setItem(REPORTS_LOG_KEY, JSON.stringify(current));
}
