import React, { useState, useEffect, useCallback } from 'react';
import { BookMeta, BookExcerpt, RoundData, MatchResultData, GameMode, GameScreen } from './types';
import { fetchManifest, fetchBookText } from './lib/bookLoader';
import { extractRandomExcerpt } from './lib/excerptExtractor';
import { calculateScore, ScoreCalculation } from './lib/scoring';
import { getUserProgress, incrementRoundsPlayed, setPaywallSkipped, updateBestMatchScore } from './lib/storage';
import { Header } from './components/Header';
import { BookPage } from './components/BookPage';
import { BookSlider } from './components/BookSlider';
import { RoundResultCard } from './components/RoundResultCard';
import { MatchResult } from './components/MatchResult';
import { BookSelect } from './components/BookSelect';
import { PaywallModal } from './components/PaywallModal';
import { AboutModal } from './components/AboutModal';
import { Shuffle, BookOpen, Loader2, Play } from 'lucide-react';

export const App: React.FC = () => {
  // State
  const [screen, setScreen] = useState<GameScreen>('home');
  const [mode, setMode] = useState<GameMode>('random');
  const [books, setBooks] = useState<BookMeta[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookMeta | null>(null);

  // Match State
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0); // 0..4
  const [roundsHistory, setRoundsHistory] = useState<RoundData[]>([]);
  const [currentBook, setCurrentBook] = useState<BookMeta | null>(null);
  const [currentExcerpt, setCurrentExcerpt] = useState<BookExcerpt | null>(null);
  const [isRoundSubmitted, setIsRoundSubmitted] = useState<boolean>(false);
  const [currentScoreResult, setCurrentScoreResult] = useState<ScoreCalculation | null>(null);

  // User Progress & Paywall
  const [userProgress, setUserProgress] = useState(getUserProgress());
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Load manifest on mount
  useEffect(() => {
    fetchManifest().then(manifest => {
      setBooks(manifest);
    }).catch(err => {
      console.error('Failed to initialize books:', err);
    });
  }, []);

  // Helper: check paywall trigger
  const checkPaywallCondition = useCallback(() => {
    const progress = getUserProgress();
    setUserProgress(progress);
    if (progress.roundsPlayed >= 20 && !progress.paywallSkipped) {
      setShowPaywall(true);
      return true;
    }
    return false;
  }, []);

  // Start a new match
  const startMatch = async (gameMode: GameMode, chosenBook?: BookMeta) => {
    if (books.length === 0) return;

    if (checkPaywallCondition()) return;

    setMode(gameMode);
    setSelectedBook(chosenBook || null);
    setRoundsHistory([]);
    setCurrentRoundIndex(0);
    setIsNewRecord(false);

    await prepareRound(0, gameMode, chosenBook);
  };

  // Prepare a single round
  const prepareRound = async (roundIdx: number, gameMode: GameMode, fixedBook?: BookMeta | null) => {
    setScreen('loading');
    setIsRoundSubmitted(false);
    setCurrentScoreResult(null);

    let targetBook: BookMeta;

    if (gameMode === 'single' && fixedBook) {
      targetBook = fixedBook;
    } else {
      // Pick random book (avoiding previous round book if possible)
      const lastBookId = roundsHistory[roundsHistory.length - 1]?.book.id;
      const available = books.filter(b => b.id !== lastBookId);
      const pool = available.length > 0 ? available : books;
      targetBook = pool[Math.floor(Math.random() * pool.length)];
    }

    try {
      const fullText = await fetchBookText(targetBook);
      const excerpt = extractRandomExcerpt(fullText);

      setCurrentBook(targetBook);
      setCurrentExcerpt(excerpt);
      setCurrentRoundIndex(roundIdx);
      setScreen('playing');
    } catch (err) {
      console.error('Error starting round:', err);
      // Retry with fallback book if available
      const fallbackBook = books[0];
      if (fallbackBook && fallbackBook.id !== targetBook.id) {
        const fullText = await fetchBookText(fallbackBook);
        const excerpt = extractRandomExcerpt(fullText);
        setCurrentBook(fallbackBook);
        setCurrentExcerpt(excerpt);
        setCurrentRoundIndex(roundIdx);
        setScreen('playing');
      }
    }
  };

  // Submit guess for current round
  const handleSubmitGuess = (guessedPercent: number) => {
    if (!currentBook || !currentExcerpt || isRoundSubmitted) return;

    const actualPercent = currentExcerpt.actualPosition * 100;
    const scoreCalc = calculateScore(guessedPercent, actualPercent);

    setCurrentScoreResult(scoreCalc);
    setIsRoundSubmitted(true);

    const roundData: RoundData = {
      roundNumber: currentRoundIndex + 1,
      book: currentBook,
      excerpt: currentExcerpt,
      guessedPosition: guessedPercent,
      actualPositionPercent: actualPercent,
      distance: scoreCalc.distanceRatio,
      accuracy: scoreCalc.accuracyPercent,
      score: scoreCalc.score
    };

    setRoundsHistory(prev => [...prev, roundData]);

    // Increment lifetime counter
    const updatedCount = incrementRoundsPlayed();
    setUserProgress(prev => ({ ...prev, roundsPlayed: updatedCount }));
  };

  // Move to next round or final screen
  const handleNextRound = async () => {
    if (currentRoundIndex < 4) {
      const nextIdx = currentRoundIndex + 1;
      await prepareRound(nextIdx, mode, selectedBook);
    } else {
      // End of match (5 rounds complete)
      finishMatch();
    }
  };

  // Finish match calculation
  const finishMatch = () => {
    setScreen('match_result');

    const totalScore = roundsHistory.reduce((sum, r) => sum + (r.score || 0), 0);
    const updatedRecord = updateBestMatchScore(totalScore);
    setIsNewRecord(updatedRecord);

    checkPaywallCondition();
  };

  // Calculate accumulated score
  const accumulatedScore = roundsHistory.reduce((sum, r) => sum + (r.score || 0), 0);

  // Prepare MatchResult object
  const getMatchResultData = (): MatchResultData => {
    const totalScore = roundsHistory.reduce((sum, r) => sum + (r.score || 0), 0);
    const avgAcc = roundsHistory.length > 0
      ? roundsHistory.reduce((sum, r) => sum + (r.accuracy || 0), 0) / roundsHistory.length
      : 0;

    const sortedByScore = [...roundsHistory].sort((a, b) => (b.score || 0) - (a.score || 0));

    return {
      rounds: roundsHistory,
      totalScore,
      averageAccuracy: avgAcc,
      bestRound: sortedByScore[0],
      worstRound: sortedByScore[sortedByScore.length - 1]
    };
  };

  const handleSkipPaywall = () => {
    setPaywallSkipped(true);
    setUserProgress(prev => ({ ...prev, paywallSkipped: true }));
    setShowPaywall(false);
  };

  return (
    <div className="app-viewport">
      <Header
        screen={screen}
        roundNumber={currentRoundIndex + 1}
        totalScore={accumulatedScore}
        roundsPlayed={userProgress.roundsPlayed}
        onGoHome={() => setScreen('home')}
        onOpenAbout={() => setShowAbout(true)}
      />

      <main className="main-content">
        {/* HOME SCREEN */}
        {screen === 'home' && (
          <div className="home-container">
            <div className="home-badge-hero">
              <BookOpen size={16} />
              <span>Литературная викторина • 5 раундов</span>
            </div>

            <h1 className="home-title">
              Насколько хорошо вы помните классику?
            </h1>

            <p className="home-subtitle">
              Получите случайную страницу из книги и укажите, где именно она находится внутри произведения.
            </p>

            <div className="mode-cards-grid">
              <div className="mode-card featured" onClick={() => startMatch('random')}>
                <div className="mode-card-icon">
                  <Shuffle size={26} />
                </div>
                <h2 className="mode-card-title">Случайная классика</h2>
                <p className="mode-card-desc">
                  5 раундов по разным произведениям. В каждом раунде вы получите новую книгу из библиотеки.
                </p>
                <div className="mode-card-btn">
                  <span>Играть</span>
                  <Play size={16} />
                </div>
              </div>

              <div className="mode-card" onClick={() => setScreen('select_book')}>
                <div className="mode-card-icon">
                  <BookOpen size={26} />
                </div>
                <h2 className="mode-card-title">Выбрать книгу</h2>
                <p className="mode-card-desc">
                  Выберите одно любимое произведение и угадывайте фрагменты только из него.
                </p>
                <div className="mode-card-btn">
                  <span>Выбрать из списка</span>
                  <Play size={16} />
                </div>
              </div>
            </div>

            <div className="library-preview-box">
              <div className="preview-title">Доступные произведения в MVP</div>
              <div className="preview-tags">
                {books.map(b => (
                  <div key={b.id} className="preview-book-tag">
                    <span>{b.title}</span>
                    <span className="preview-book-author">({b.author})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SELECT BOOK SCREEN */}
        {screen === 'select_book' && (
          <BookSelect
            books={books}
            onSelectBook={(b) => startMatch('single', b)}
            onBack={() => setScreen('home')}
          />
        )}

        {/* LOADING SCREEN */}
        {screen === 'loading' && (
          <div className="loading-container">
            <Loader2 size={36} className="spinner-icon" />
            <p className="loading-text">Выбираем страницу из книги...</p>
          </div>
        )}

        {/* PLAYING / ROUND RESULT SCREEN */}
        {(screen === 'playing' || screen === 'round_result') && currentBook && currentExcerpt && (
          <div className="game-screen-layout">
            <BookPage book={currentBook} excerpt={currentExcerpt} />

            <BookSlider
              isSubmitted={isRoundSubmitted}
              actualPositionPercent={currentExcerpt.actualPosition * 100}
              scoreResult={currentScoreResult}
              onSubmitGuess={handleSubmitGuess}
              onNextRound={handleNextRound}
              isLastRound={currentRoundIndex === 4}
            />

            {isRoundSubmitted && currentScoreResult && roundsHistory.length > 0 && (
              <RoundResultCard
                roundData={roundsHistory[roundsHistory.length - 1]}
                scoreResult={currentScoreResult}
              />
            )}
          </div>
        )}

        {/* MATCH RESULT SCREEN */}
        {screen === 'match_result' && (
          <MatchResult
            matchData={getMatchResultData()}
            isNewBestScore={isNewRecord}
            onPlayAgain={() => startMatch(mode, selectedBook || undefined)}
            onGoHome={() => setScreen('home')}
          />
        )}
      </main>

      {/* MODALS */}
      <PaywallModal
        isOpen={showPaywall}
        onSkip={handleSkipPaywall}
      />

      <AboutModal
        isOpen={showAbout}
        books={books}
        onClose={() => setShowAbout(false)}
      />
    </div>
  );
};
