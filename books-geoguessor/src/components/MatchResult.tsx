import React, { useState } from 'react';
import { MatchResultData } from '../types';
import { formatScore } from '../lib/scoring';
import { Trophy, Share2, RotateCcw, Check, Sparkles, Award } from 'lucide-react';

interface MatchResultProps {
  matchData: MatchResultData;
  isNewBestScore: boolean;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const MatchResult: React.FC<MatchResultProps> = ({
  matchData,
  isNewBestScore,
  onPlayAgain,
  onGoHome
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const generateShareText = () => {
    const roundLines = matchData.rounds
      .map((r, i) => `${i + 1}. 📖 ${r.score || 0} — ${r.book.title}`)
      .join('\n');

    return `BookGuessr 📚\n${formatScore(matchData.totalScore)} / 25 000\n\n${roundLines}\n\nСможешь близко угадать страницы классики?`;
  };

  const handleShare = async () => {
    const shareText = generateShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BookGuessr Result',
          text: shareText
        });
        return;
      } catch (e) {
        // User cancelled or share failed, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Ignore
    }
  };

  const avgErrorPercent = (100 - matchData.averageAccuracy).toFixed(1);

  return (
    <div className="match-result-container">
      <div className="match-result-card">
        {isNewBestScore && (
          <div className="new-record-banner">
            <Sparkles size={18} />
            <span>Новый личный рекорд!</span>
          </div>
        )}

        <div className="match-hero">
          <div className="trophy-circle">
            <Trophy size={42} className="hero-trophy-svg" />
          </div>

          <h1 className="match-title">Матч завершён!</h1>
          
          <div className="final-score-display">
            <span className="final-num">{formatScore(matchData.totalScore)}</span>
            <span className="final-max">/ 25 000</span>
          </div>

          <div className="summary-pills">
            <div className="summary-pill">
              <span className="pill-title">Средняя точность</span>
              <span className="pill-val">{matchData.averageAccuracy.toFixed(1)}%</span>
            </div>
            <div className="summary-pill">
              <span className="pill-title">Средняя ошибка</span>
              <span className="pill-val">{avgErrorPercent}%</span>
            </div>
          </div>
        </div>

        {/* Rounds Breakdown */}
        <div className="rounds-breakdown-section">
          <h3 className="section-heading">Результаты раундов</h3>
          <div className="breakdown-list">
            {matchData.rounds.map((round, idx) => (
              <div key={idx} className="breakdown-row">
                <div className="row-num">{idx + 1}</div>
                <div className="row-book">
                  <span className="row-title">{round.book.title}</span>
                  <span className="row-author">{round.book.author}</span>
                </div>
                <div className="row-details">
                  <div className="row-positions">
                    <span>Выбор: {round.guessedPosition?.toFixed(1)}%</span>
                    <span className="pos-separator">•</span>
                    <span>Факт: {round.actualPositionPercent.toFixed(1)}%</span>
                  </div>
                  <div className="row-score">
                    +{formatScore(round.score || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best / Worst Highlights */}
        {matchData.bestRound && (
          <div className="highlights-row">
            <div className="highlight-box best">
              <div className="highlight-icon">
                <Award size={18} />
              </div>
              <div className="highlight-text">
                <span className="highlight-tag">Лучший раунд</span>
                <span className="highlight-book">{matchData.bestRound.book.title}</span>
                <span className="highlight-val">+{formatScore(matchData.bestRound.score || 0)} очков ({matchData.bestRound.accuracy?.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="match-actions">
          <button className="btn secondary-btn home-nav-btn" onClick={onGoHome} title="На главную">
            <span>В меню</span>
          </button>

          <button className="btn secondary-btn share-btn" onClick={handleShare}>
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            <span>{copied ? 'Скопировано!' : 'Поделиться'}</span>
          </button>

          <button className="btn primary-btn play-again-btn" onClick={onPlayAgain}>
            <RotateCcw size={18} />
            <span>Играть ещё</span>
          </button>
        </div>
      </div>
    </div>
  );
};
