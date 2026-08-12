import { UserProgress } from '../types';

const STORAGE_KEYS = {
  ROUNDS_PLAYED: 'bookguessr.roundsPlayed',
  PAYWALL_SKIPPED: 'bookguessr.paywallSkipped',
  BEST_SCORE: 'bookguessr.bestMatchScore',
};

// In-memory fallback if localStorage is disabled/restricted
let inMemoryStorage: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return inMemoryStorage[key] || null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    inMemoryStorage[key] = value;
  }
}

export function getUserProgress(): UserProgress {
  const roundsStr = safeGetItem(STORAGE_KEYS.ROUNDS_PLAYED);
  const paywallStr = safeGetItem(STORAGE_KEYS.PAYWALL_SKIPPED);
  const bestScoreStr = safeGetItem(STORAGE_KEYS.BEST_SCORE);

  const roundsPlayed = roundsStr ? parseInt(roundsStr, 10) : 0;
  const paywallSkipped = paywallStr === 'true';
  const bestMatchScore = bestScoreStr ? parseInt(bestScoreStr, 10) : 0;

  return {
    roundsPlayed: isNaN(roundsPlayed) ? 0 : roundsPlayed,
    paywallSkipped,
    bestMatchScore: isNaN(bestMatchScore) ? 0 : bestMatchScore,
  };
}

export function incrementRoundsPlayed(): number {
  const current = getUserProgress();
  const nextCount = current.roundsPlayed + 1;
  safeSetItem(STORAGE_KEYS.ROUNDS_PLAYED, nextCount.toString());
  return nextCount;
}

export function setPaywallSkipped(skipped: boolean = true): void {
  safeSetItem(STORAGE_KEYS.PAYWALL_SKIPPED, skipped ? 'true' : 'false');
}

export function updateBestMatchScore(score: number): boolean {
  const current = getUserProgress();
  if (score > (current.bestMatchScore || 0)) {
    safeSetItem(STORAGE_KEYS.BEST_SCORE, score.toString());
    return true;
  }
  return false;
}
