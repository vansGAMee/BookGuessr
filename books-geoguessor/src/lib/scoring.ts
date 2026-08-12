export interface ScoreCalculation {
  distanceRatio: number; // 0..1
  distancePercent: number; // 0..100
  accuracyPercent: number; // 0..100
  score: number; // 0..5000
  reaction: {
    label: string;
    color: string;
    emoji: string;
  };
}

/**
 * Calculates score non-linearly based on distance (0..1).
 * Small distance errors are penalized mildly, large distance errors heavily.
 */
export function calculateScore(guessedPercent: number, actualPercent: number): ScoreCalculation {
  const guessRatio = guessedPercent / 100;
  const actualRatio = actualPercent / 100;
  const distanceRatio = Math.abs(guessRatio - actualRatio); // 0..1
  const distancePercent = Math.round(distanceRatio * 1000) / 10; // e.g. 4.7%

  // K factor = 8 gives nice spread:
  // 0% -> 5000
  // 1% -> 4615
  // 3% -> 3933
  // 5% -> 3351
  // 10% -> 2246
  // 20% -> 1009
  // 40% -> 203
  // 50% -> 91
  const K = 8.0;
  const rawScore = 5000 * Math.exp(-K * distanceRatio);
  const score = Math.max(0, Math.min(5000, Math.round(rawScore)));

  const accuracyPercent = Math.max(0, Math.min(100, Math.round((1 - distanceRatio) * 1000) / 10));

  let reaction = { label: 'Мимо', color: '#E53E3E', emoji: '🎯' };

  if (distanceRatio < 0.02) {
    reaction = { label: 'Почти в точку!', color: '#2F855A', emoji: '🎯' };
  } else if (distanceRatio < 0.05) {
    reaction = { label: 'Отлично!', color: '#38A169', emoji: '🌟' };
  } else if (distanceRatio < 0.10) {
    reaction = { label: 'Близко!', color: '#319795', emoji: '👏' };
  } else if (distanceRatio < 0.20) {
    reaction = { label: 'Неплохо', color: '#D69E2E', emoji: '📖' };
  } else if (distanceRatio < 0.40) {
    reaction = { label: 'Далековато', color: '#DD6B20', emoji: '🧭' };
  } else {
    reaction = { label: 'Мимо', color: '#E53E3E', emoji: '💨' };
  }

  return {
    distanceRatio,
    distancePercent,
    accuracyPercent,
    score,
    reaction
  };
}

export function formatScore(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num);
}
