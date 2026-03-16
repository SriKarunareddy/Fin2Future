import React from 'react';
import GameModuleLayout from '../shared/GameModuleLayout';
import { getLevelFromXP } from '../../utils/progressManager';

/**
 * GameSelection - Choose a game within selected level
 */
const GameSelection = ({ level, playerProgress, onSelectGame, onBack }) => {
  const currentLevel = playerProgress?.level || getLevelFromXP(playerProgress?.xp || 0);
  const currentXP = playerProgress?.xp || 0;
  const maxXP = (currentLevel * 100);
  const games = {
    Basic: [
      {
        id: 'spend-smart-sprint',
        name: 'Spend Smart Sprint',
        description: 'Race against time to make smart spending decisions',
        icon: '🏃',
        duration: '2 minutes',
        difficulty: 'Easy',
        color: 'from-blue-600 to-blue-400'
      },
      {
        id: 'needs-vs-wants',
        name: 'Needs vs Wants Swipe',
        description: 'Swipe to classify: Need or Want?',
        icon: '👆',
        duration: '2 minutes',
        difficulty: 'Easy',
        color: 'from-cyan-500 to-blue-400'
      },
      {
        id: 'savings-jar',
        name: 'Savings Jar Builder',
        description: 'Watch your savings grow visually',
        icon: '🏺',
        duration: '5 minutes',
        difficulty: 'Easy',
        color: 'from-blue-400 to-indigo-400'
      }
    ],
    Medium: [
      {
        id: 'investment-garden',
        name: 'Investment Garden',
        description: 'Grow your wealth through smart investment strategies',
        icon: '🌱',
        duration: '3 rounds',
        difficulty: 'Medium',
        color: 'from-green-600 to-emerald-600'
      },
      {
        id: 'scam-detective',
        name: 'Scam Detective',
        description: 'Identify and avoid financial scams in realistic scenarios',
        icon: '🕵️',
        duration: '7 scenarios',
        difficulty: 'Medium',
        color: 'from-purple-600 to-indigo-600'
      }
    ],
    Advanced: [
      {
        id: 'nifty-trader',
        name: 'Nifty Trader Challenge',
        description: 'Predict market movements based on economic news',
        icon: '📈',
        duration: '10 rounds',
        difficulty: 'Hard',
        color: 'from-blue-600 to-cyan-600'
      },
      {
        id: 'candlestick-master',
        name: 'Candlestick Master',
        description: 'Learn to read stock chart patterns and predict price movements',
        icon: '�',
        duration: '10 rounds',
        difficulty: 'Hard',
        color: 'from-purple-600 to-pink-600'
      }
    ]
  };

  const levelGames = games[level] || [];

  const levelTheme = {
    Basic: 'Basic',
    Medium: 'Medium',
    Advanced: 'Advanced'
  };

  return (
    <GameModuleLayout
      title={`${level} Games`}
      level={currentLevel}
      currentXP={currentXP}
      maxXP={maxXP}
      coins={playerProgress?.coins || 0}
      streak={playerProgress?.streaks?.current || 0}
      onBack={onBack}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 pb-8">
          {levelGames.map((game, index) => (
            <div
              key={game.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => onSelectGame(game.id)}
                className="w-full text-left bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-amber-300/20 hover:border-amber-300/40 transform hover:scale-105 transition-all duration-300 relative"
              >
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4`}>
                  {game.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-amber-100 mb-2">
                  {game.name}
                </h3>
                <p className="text-amber-100/70 mb-4">
                  {game.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 px-3 py-1 bg-amber-300/20 rounded-lg ring-1 ring-amber-300/30">
                    <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-amber-300 font-medium">{game.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1 bg-amber-300/20 rounded-lg ring-1 ring-amber-300/30">
                    <span className="text-amber-300 font-medium">{game.difficulty}</span>
                  </div>
                </div>

                {/* High score */}
                {playerProgress?.highScores?.[game.id] && (
                  <div className="mt-4 pt-4 border-t border-amber-300/20">
                    <p className="text-sm text-amber-100/50">Your Best Score</p>
                    <p className="text-xl font-bold text-amber-200">
                      {playerProgress.highScores[game.id]}
                    </p>
                  </div>
                )}

                {/* Play arrow */}
                <div className="absolute bottom-4 right-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </GameModuleLayout>
  );
};

export default GameSelection;
