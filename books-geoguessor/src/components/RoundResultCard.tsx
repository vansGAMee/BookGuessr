import React from 'react';
import { RoundData } from '../types';
import { ScoreCalculation, formatScore } from '../lib/scoring';
import { Compass, Percent, Trophy } from 'lucide-react';

interface RoundResultCardProps {
  roundData: RoundData;
  scoreResult: ScoreCalculation;
}

export const RoundResultCard: React.FC<RoundResultCardProps> = ({ roundData, scoreResult }) => {
  return (
    <div className="round-result-card">
      <div className="result-header">
        <div className="result-reaction" style={{ color: scoreResult.reaction.color }}>
          <span className="reaction-emoji">{scoreResult.reaction.emoji}</span>
          <span className="reaction-text">{scoreResult.reaction.label}</span>
        </div>
        <div className="round-score-hero">
          <Trophy size={20} className="trophy-gold" />
          <span className="score-main">{formatScore(scoreResult.score)}</span>
          <span className="score-max">/ 5 000</span>
        </div>
      </div>

      <div className="result-metrics-grid">
        <div className="metric-box">
          <span className="metric-label">Ваша отметка</span>
          <span className="metric-value">{roundData.guessedPosition?.toFixed(1)}%</span>
        </div>

        <div className="metric-box highlight">
          <span className="metric-label">Настоящее место</span>
          <span className="metric-value">{roundData.actualPositionPercent.toFixed(1)}%</span>
        </div>

        <div className="metric-box">
          <div className="metric-icon-label">
            <Compass size={14} />
            <span>Ошибка</span>
          </div>
          <span className="metric-value">{scoreResult.distancePercent.toFixed(1)}%</span>
        </div>

        <div className="metric-box">
          <div className="metric-icon-label">
            <Percent size={14} />
            <span>Точность</span>
          </div>
          <span className="metric-value">{scoreResult.accuracyPercent.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};
