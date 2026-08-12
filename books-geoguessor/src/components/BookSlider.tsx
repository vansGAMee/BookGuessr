import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, ArrowRight } from 'lucide-react';
import { ScoreCalculation } from '../lib/scoring';

interface BookSliderProps {
  isSubmitted: boolean;
  actualPositionPercent: number; // 0..100
  scoreResult: ScoreCalculation | null;
  onSubmitGuess: (guessedPercent: number) => void;
  onNextRound: () => void;
  isLastRound: boolean;
}

export const BookSlider: React.FC<BookSliderProps> = ({
  isSubmitted,
  actualPositionPercent,
  scoreResult,
  onSubmitGuess,
  onNextRound,
  isLastRound
}) => {
  const [guessValue, setGuessValue] = useState<number>(50);
  const [hasMoved, setHasMoved] = useState<boolean>(false);

  // Reset when starting new round
  useEffect(() => {
    if (!isSubmitted) {
      setGuessValue(50);
      setHasMoved(false);
    }
  }, [isSubmitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitted) return;
    setGuessValue(parseFloat(e.target.value));
    setHasMoved(true);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSubmitted) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    setGuessValue(Math.round(percent * 10) / 10);
    setHasMoved(true);
  };

  const handleSubmit = () => {
    if (!hasMoved) return;
    onSubmitGuess(guessValue);
  };

  return (
    <div className="book-slider-container">
      <div className="slider-card">
        <div className="slider-header-row">
          <div className="slider-instruction">
            <Target size={18} className="instruction-icon" />
            <span>Где находится эта страница внутри книги?</span>
          </div>
          {!isSubmitted && (
            <div className="guess-current-display">
              {hasMoved ? `${guessValue.toFixed(1)}%` : 'Выберите точку'}
            </div>
          )}
        </div>

        <div className="slider-track-wrapper" onClick={handleTrackClick}>
          <div className="slider-track-base">
            <span className="track-start-label">НАЧАЛО</span>

            {/* Before submit fill */}
            {!isSubmitted && (
              <div
                className="slider-track-fill"
                style={{ width: `${guessValue}%` }}
              ></div>
            )}

            {/* After submit: connection gap line */}
            {isSubmitted && (
              <div
                className="slider-gap-highlight"
                style={{
                  left: `${Math.min(guessValue, actualPositionPercent)}%`,
                  width: `${Math.abs(guessValue - actualPositionPercent)}%`
                }}
              ></div>
            )}

            {/* Range Input for accessibility & drag */}
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={guessValue}
              disabled={isSubmitted}
              onChange={handleChange}
              className={`custom-range-input ${isSubmitted ? 'disabled' : ''}`}
              aria-label="Положение страницы в книге в процентах от 0 до 100"
            />

            {/* Player Marker */}
            <div
              className={`marker player-marker ${isSubmitted ? 'locked' : ''}`}
              style={{ left: `${guessValue}%` }}
            >
              <div className="marker-pin"></div>
              <div className="marker-tooltip">
                <span className="tooltip-title">{isSubmitted ? 'Ваш выбор' : `${guessValue.toFixed(1)}%`}</span>
                {isSubmitted && <span className="tooltip-val">{guessValue.toFixed(1)}%</span>}
              </div>
            </div>

            {/* Actual Marker (Revealed after submit) */}
            {isSubmitted && (
              <div
                className="marker actual-marker reveal-anim"
                style={{ left: `${actualPositionPercent}%` }}
              >
                <div className="marker-pin actual-pin"></div>
                <div className="marker-tooltip actual-tooltip">
                  <span className="tooltip-title">Настоящее место</span>
                  <span className="tooltip-val">{actualPositionPercent.toFixed(1)}%</span>
                </div>
              </div>
            )}

            <span className="track-end-label">КОНЕЦ</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="slider-actions-row">
          {!isSubmitted ? (
            <button
              className={`btn primary-btn submit-btn ${!hasMoved ? 'disabled' : ''}`}
              disabled={!hasMoved}
              onClick={handleSubmit}
            >
              <CheckCircle size={18} />
              <span>Зафиксировать</span>
            </button>
          ) : (
            <div className="result-action-bar">
              {scoreResult && (
                <div className="quick-result-summary">
                  <span className="reaction-badge" style={{ backgroundColor: scoreResult.reaction.color }}>
                    {scoreResult.reaction.emoji} {scoreResult.reaction.label}
                  </span>
                  <div className="score-added">
                    <span className="score-num">+{scoreResult.score}</span>
                    <span className="score-unit">очков</span>
                  </div>
                </div>
              )}
              <button className="btn primary-btn next-btn" onClick={onNextRound}>
                <span>{isLastRound ? 'Финальный итог' : 'Следующий раунд'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
