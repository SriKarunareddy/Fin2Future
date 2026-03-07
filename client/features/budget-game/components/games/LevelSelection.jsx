import React from 'react';
import GameModuleLayout from '../shared/GameModuleLayout';

/**
 * LevelSelection - Choose difficulty level
 * 
 * Displays available levels based on user's quiz result
 */
const LevelSelection = ({ userLevel, playerProgress, onSelectLevel }) => {
  const currentLevel = playerProgress?.level || 1;
  const levels = [
    {
      id: 'Basic',
      name: 'Basic Level',
      description: 'Learn the fundamentals of smart spending',
      icon: '🌱',
      color: 'from-blue-500 to-blue-400',
      bgColor: 'from-slate-800/60 to-slate-800/40',
      unlocked: true
    },
    {
      id: 'Medium',
      name: 'Medium Level',
      description: 'Master budgeting and financial decisions',
      icon: '⚡',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-slate-800/60 to-slate-800/40',
      unlocked: ['Medium', 'Advanced'].includes(userLevel)
    },
    {
      id: 'Advanced',
      name: 'Advanced Level',
      description: 'Build wealth through strategic planning',
      icon: '🏆',
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'from-slate-800/60 to-slate-800/40',
      unlocked: userLevel === 'Advanced'
    }
  ];

  return (
    <GameModuleLayout title="Choose Level" level={currentLevel} currentXP={playerProgress?.xp || 0} maxXP={playerProgress?.nextLevelXP || 100} coins={playerProgress?.coins || 0} streak={playerProgress?.streak || 0}>
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-slideDown text-white">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Level
          </h1>
          <p className="text-xl text-gray-300">
            Select a difficulty level to start playing
          </p>

          {/* Player stats */}
          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="bg-slate-800/70 rounded-2xl px-6 py-3 shadow-md ring-1 ring-amber-300/20">
              <p className="text-sm text-gray-400">Level</p>
              <p className="text-2xl font-bold text-white">
                {playerProgress?.level || 1}
              </p>
            </div>
            <div className="bg-slate-800/70 rounded-2xl px-6 py-3 shadow-md ring-1 ring-amber-300/20">
              <p className="text-sm text-gray-400">XP</p>
              <p className="text-2xl font-bold text-white">
                {playerProgress?.xp || 0}
              </p>
            </div>
            <div className="bg-slate-800/70 rounded-2xl px-6 py-3 shadow-md ring-1 ring-amber-300/20">
              <p className="text-sm text-gray-400">Coins</p>
              <p className="text-2xl font-bold text-white">
                {playerProgress?.coins || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Level cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {levels.map((level, index) => (
            <div
              key={level.id}
              className={`animate-fadeIn h-full`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => level.unlocked && onSelectLevel(level.id)}
                disabled={!level.unlocked}
                className={`relative w-full text-left transition-all duration-300 ${
                  level.unlocked
                    ? 'transform hover:scale-105 hover:shadow-2xl cursor-pointer ring-2 ring-amber-300 hover:ring-amber-400 animate-goldGlow'
                    : 'opacity-50 cursor-not-allowed ring-2 ring-gray-400/50'
                }`}
              >
                <div className="bg-slate-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[24rem]">
                  {/* Lock overlay */}
                  {!level.unlocked && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center backdrop-blur-sm rounded-3xl">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-white mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <p className="text-white font-bold">Locked</p>
                        <p className="text-white text-sm">Complete quiz to unlock</p>
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${level.color} rounded-2xl flex items-center justify-center text-4xl shadow-xl mb-4 ring-2 ring-amber-400`}> 
                    {level.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-amber-200 mb-2">
                    {level.name}
                  </h3>
                  <p className="text-amber-300 mb-4">
                    {level.description}
                  </p>

                  {/* Stats */}
                  {level.unlocked && (
                    <>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <span>🎮</span>
                          <span className="text-amber-200">
                            {playerProgress?.gamesPlayed?.[level.id] || 0} played
                          </span>
                        </div>
                      </div>
                      {/* progress bar at bottom */}
                      <div className="mt-4">
                        <p className="text-xs text-white">Progress {playerProgress?.progress?.[level.id] || 0}%</p>
                        <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                          <div className={`h-2 rounded-full bg-gradient-to-r ${level.color}`} style={{ width: `${playerProgress?.progress?.[level.id] || 0}%` }} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Arrow */}
                  {level.unlocked && (
                    <div className="absolute bottom-4 right-4">
                      <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                  {/* Completed badge for unlocked */}
                  {level.unlocked && (
                    <div className="absolute top-4 right-4 bg-amber-400 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                      ✓
                    </div>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Badges section */}
        {playerProgress?.badges && playerProgress.badges.length > 0 && (
          <div className="mt-12 bg-slate-800/70 rounded-3xl p-8 shadow-xl ring-1 ring-amber-300/20">
            <h2 className="text-2xl font-bold text-amber-200 mb-6">Your Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {playerProgress.badges.map((badge, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="font-bold text-gray-800">{badge.name}</p>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameModuleLayout>
  );
};

export default LevelSelection;
