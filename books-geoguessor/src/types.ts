export interface BookMeta {
  id: string;
  title: string;
  author: string;
  year: string;
  file: string;
  sourceName: string;
  sourceUrl: string;
  charCount: number;
  wordCount: number;
}

export interface BookExcerpt {
  text: string;
  startIndex: number;
  endIndex: number;
  actualPosition: number; // 0..1
  totalTextLength: number;
}

export interface RoundData {
  roundNumber: number;
  book: BookMeta;
  excerpt: BookExcerpt;
  guessedPosition?: number; // 0..100
  actualPositionPercent: number; // 0..100
  distance?: number; // 0..1
  accuracy?: number; // 0..100
  score?: number; // 0..5000
}

export interface MatchResultData {
  rounds: RoundData[];
  totalScore: number;
  averageAccuracy: number;
  bestRound: RoundData;
  worstRound: RoundData;
}

export type GameMode = 'random' | 'single';

export type GameScreen =
  | 'home'
  | 'select_book'
  | 'loading'
  | 'playing'
  | 'round_result'
  | 'match_result';

export interface UserProgress {
  roundsPlayed: number;
  paywallSkipped: boolean;
  bestMatchScore?: number;
}
