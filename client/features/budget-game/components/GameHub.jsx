import { useState, useEffect } from 'react';
import LevelSelection from './games/LevelSelection';
import GameSelection from './games/GameSelection';
import SpendSmartSprint from './games/basic/SpendSmartSprint';
import NeedsVsWantsSwipe from './games/basic/NeedsVsWantsSwipe';
import FlashFinanceLightning from './games/basic/FlashFinanceLightning';
import SavingsJarBuilder from './games/basic/SavingsJarBuilder';
import InvestmentGarden from './games/medium/InvestmentGarden';
import WealthBuilder from './games/advanced/WealthBuilder';
import ResultScreen from './ResultScreen';
import { getPlayerProgress, savePlayerProgress } from '../utils/progressManager';

/**
 * GameHub - Main game orchestrator
 * 
 * Manages navigation between:
 * - Level selection
 * - Game selection
 * - Individual games
 * - Progress tracking
 */
const GameHub = ({ userLevel = 'Basic', userId = 'demo-user' }) => {
  const [currentView, setCurrentView] = useState('level-selection');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [playerProgress, setPlayerProgress] = useState(null);
  const [gameResults, setGameResults] = useState(null);

  useEffect(() => {
    // Load player progress
    const progress = getPlayerProgress(userId);
    setPlayerProgress(progress);
  }, [userId]);

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setCurrentView('game-selection');
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setCurrentView('playing');
  };

  const handleGameComplete = (rewards) => {
    if (rewards && rewards.type === 'financial') {
      // convert financial result into progress rewards
      const xpGain = rewards.won ? 50 : 20;
      const coinsGain = Math.max(0, Math.floor(rewards.netWorth / 1000));
      const updatedProgress = {
        ...playerProgress,
        xp: (playerProgress?.xp || 0) + xpGain,
        coins: (playerProgress?.coins || 0) + coinsGain,
        badges: rewards.won
          ? [...(playerProgress?.badges || []), { name: 'Life Builder', icon: '🏗️' }]
          : [...(playerProgress?.badges || [])]
      };
      setPlayerProgress(updatedProgress);
      savePlayerProgress(userId, updatedProgress);

      setGameResults(rewards);
      setCurrentView('results');
    } else {
      // existing quiz or other game rewards
      const updatedProgress = {
        ...playerProgress,
        xp: (playerProgress?.xp || 0) + (rewards.xp || 0),
        coins: (playerProgress?.coins || 0) + (rewards.coins || 0),
        badges: [...(playerProgress?.badges || []), ...(rewards.badges || [])]
      };

      setPlayerProgress(updatedProgress);
      savePlayerProgress(userId, updatedProgress);

      // Return to game selection
      setCurrentView('game-selection');
    }
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setSelectedGame(null);
    setCurrentView('level-selection');
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
    setCurrentView('game-selection');
  };

  // Placeholder component for games not yet implemented
  const ComingSoon = ({ gameName }) => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-3xl font-bold text-blue-900 mb-4">{gameName}</h1>
        <p className="text-gray-600 mb-6">This game is coming soon!</p>
        <button
          onClick={handleBackToGames}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          Back to Games
        </button>
      </div>
    </div>
  );

  // Render current view
  if (currentView === 'level-selection') {
    return (
      <LevelSelection
        userLevel={userLevel}
        playerProgress={playerProgress}
        onSelectLevel={handleLevelSelect}
      />
    );
  }

  if (currentView === 'game-selection') {
    return (
      <GameSelection
        level={selectedLevel}
        playerProgress={playerProgress}
        onSelectGame={handleGameSelect}
        onBack={handleBackToLevels}
      />
    );
  }

  if (currentView === 'results') {
    return <ResultScreen results={gameResults} onRetake={handleBackToGames} />;
  }

  if (currentView === 'playing') {
    // Render selected game
    const gameProps = {
      onComplete: handleGameComplete,
      onBack: handleBackToGames,
      playerProgress
    };

    switch (selectedGame) {
      // Basic Level Games
      case 'spend-smart-sprint':
        return <SpendSmartSprint {...gameProps} />;
      case 'budget-tetris':
        return <FlashFinanceLightning {...gameProps} />;
      case 'needs-vs-wants':
        return <NeedsVsWantsSwipe {...gameProps} />;
      case 'savings-jar':
        return <SavingsJarBuilder {...gameProps} />;

      // Medium Level Games
      case 'investment-garden':
        return <InvestmentGarden {...gameProps} />;

      // Advanced Level Games
      case 'wealth-builder':
        return <WealthBuilder {...gameProps} />;
      case 'market-crash':
        return <ComingSoon gameName="Market Crash Mode" />;
      case 'business-tycoon':
        return <ComingSoon gameName="Mini Business Tycoon" />;
      case 'master-tournament':
        return <ComingSoon gameName="Financial Master Tournament" />;

      default:
        return <ComingSoon gameName="Unknown Game" />;
    }
  }

  return null;
};

export default GameHub;
