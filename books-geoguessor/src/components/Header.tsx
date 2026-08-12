import React from 'react';
import { BookOpen, Home, Info, Trophy } from 'lucide-react';
import { GameScreen } from '../types';
import { formatScore } from '../lib/scoring';

interface HeaderProps {
  screen: GameScreen;
  roundNumber?: number;
  totalScore?: number;
  roundsPlayed: number;
  onGoHome: () => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  screen,
  roundNumber,
  totalScore = 0,
  roundsPlayed,
  onGoHome,
  onOpenAbout
}) => {
  const isPlayingMode = screen === 'playing' || screen === 'round_result';

  return (
    <header className="game-header">
      <div className="header-container">
        <div className="brand-group" onClick={onGoHome} title="На главную">
          <div className="brand-icon">
            <BookOpen size={22} className="brand-svg" />
          </div>
          <div className="brand-text">
            <span className="brand-title">BookGuessr</span>
            <span className="brand-tag">Классика</span>
          </div>
        </div>

        {isPlayingMode && (
          <div className="match-tracker">
            <div className="tracker-pill round-pill">
              <span className="pill-label">Раунд</span>
              <span className="pill-val">{roundNumber} / 5</span>
            </div>
            <div className="tracker-pill score-pill">
              <Trophy size={16} className="score-icon" />
              <span className="pill-val">{formatScore(totalScore)}</span>
              <span className="pill-max">/ 25 000</span>
            </div>
          </div>
        )}

        <div className="header-actions">
          <div className="lifetime-badge" title="Сыграно раундов за всё время">
            <span className="badge-dot"></span>
            <span className="badge-text">{roundsPlayed} раунд{roundsPlayed === 1 ? '' : roundsPlayed > 1 && roundsPlayed < 5 ? 'а' : 'ов'}</span>
          </div>

          {screen !== 'home' && (
            <button className="icon-btn" onClick={onGoHome} title="Вернуться на главную">
              <Home size={18} />
            </button>
          )}

          <button className="icon-btn" onClick={onOpenAbout} title="О проекте и источниках">
            <Info size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
