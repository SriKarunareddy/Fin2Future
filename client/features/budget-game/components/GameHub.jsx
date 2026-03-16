import { useState, useEffect } from 'react';
import LevelSelection from './games/LevelSelection';
import GameSelection from './games/GameSelection';
import SpendSmartSprint from './games/basic/SpendSmartSprint';
import NeedsVsWantsSwipe from './games/basic/NeedsVsWantsSwipe';
import FlashFinanceLightning from './games/basic/FlashFinanceLightning';
import SavingsJarBuilder from './games/basic/SavingsJarBuilder';
import InvestmentGarden from './games/medium/InvestmentGarden';
import ScamDetective from './games/medium/ScamDetective';
import NiftyTraderChallenge from './games/advanced/NiftyTraderChallenge';
import CandlestickMaster from './games/advanced/CandlestickMaster';
import ResultScreen from './ResultScreen';
import { getPlayerProgress, savePlayerProgress, awardGameXP, checkMediumLevelCompletion, awardMediumLevelBonus } from '../utils/progressManager';

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
      // Award XP for game completion
      const difficulty = selectedLevel === 'Basic' ? 'Basic' : 
                      selectedLevel === 'Medium' ? 'Medium' : 'Advanced';
      
      const updatedProgress = awardGameXP(playerProgress, selectedGame, difficulty, rewards.score, rewards.perfect);
      
      // Check if medium level is completed and award bonus
      if (selectedLevel === 'Medium') {
        const finalProgress = awardMediumLevelBonus(updatedProgress);
        setPlayerProgress(finalProgress);
        savePlayerProgress(userId, finalProgress);
      } else {
        setPlayerProgress(updatedProgress);
        savePlayerProgress(userId, updatedProgress);
      }
      
      setGameResults(rewards);
      setCurrentView('results');
    } else if (rewards && rewards.type === 'realtime') {
      // Real-time XP updates during gameplay
      const updatedProgress = {
        ...playerProgress,
        xp: Math.max(0, playerProgress.xp + rewards.xpChange),
        coins: Math.max(0, playerProgress.coins + rewards.coinChange)
      };
      setPlayerProgress(updatedProgress);
      savePlayerProgress(userId, updatedProgress);
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
      playerProgress,
      onRealtimeUpdate: handleGameComplete
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
      case 'scam-detective':
        return <ScamDetective {...gameProps} />;

      // Advanced Level Games
      case 'nifty-trader':
        return <NiftyTraderChallenge {...gameProps} />;
      case 'candlestick-master':
        return <CandlestickMaster {...gameProps} />;

      default:
        return <ComingSoon gameName="Unknown Game" />;
    }
  }

  return null;
};

export default GameHub;
