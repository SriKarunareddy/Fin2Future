import React from 'react';
import GameLayout from './shared/GameLayout';
import ConfettiEffect from './shared/ConfettiEffect';

/**
 * ResultScreen Component (refactored)
 * Uses GameLayout for consistent header/xp/coins and ConfettiEffect on high scores
 */
const ResultScreen = ({ results = { score: 0, level: 'Basic' }, onRetake }) => {
  // If financial game passed structured results, show custom layout
  if (results.type === 'financial') {
    const { won, netWorth, state } = results;
    const status = won ? 'Success' : 'Try Again';
    const color = won ? 'from-green-400 to-emerald-500' : 'from-gray-400 to-gray-600';
    const message = won
      ? 'You built a stable financial life! Keep growing your wealth.'
      : 'Work on your expenses and emergency fund to win next time.';

    return (
      <GameLayout title="Financial Life Builder" level={1} score={0} currentXP={0} maxXP={100} coins={0} streak={0}>
        <div className="w-full max-w-2xl mx-auto">
          <ConfettiEffect trigger={won} />

          <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 animate-popIn ring-1 ring-amber-300/10">
            <h1 className="text-3xl font-bold text-center text-amber-200 mb-4">{status}</h1>
            <p className="text-center text-amber-200 mb-6">{message}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-700/50 rounded-xl p-4 text-center ring-1 ring-amber-300/10">
                <p className="text-amber-200 font-bold text-2xl">₹{netWorth}</p>
                <p className="text-amber-100 text-sm font-medium">Net Worth</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 text-center ring-1 ring-amber-300/10">
                <p className="text-amber-200 font-bold text-2xl">₹{state.emergencyFund}</p>
                <p className="text-amber-100 text-sm font-medium">Emergency Fund</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-700/40 rounded-xl p-4 text-center ring-1 ring-amber-300/10">
                <p className="text-amber-200 font-bold text-2xl">{state.stress}%</p>
                <p className="text-amber-100 text-sm font-medium">Stress</p>
              </div>
              <div className="bg-slate-700/40 rounded-xl p-4 text-center ring-1 ring-amber-300/10">
                <p className="text-amber-200 font-bold text-2xl">{state.risk}%</p>
                <p className="text-amber-100 text-sm font-medium">Risk Level</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onRetake} className="flex-1 py-4 px-6 bg-amber-200 text-slate-900 rounded-xl font-bold text-lg hover:brightness-95 transition-colors duration-300">Try Again</button>
              <button onClick={() => window.location.href = '/games'} className={`flex-1 py-4 px-6 bg-gradient-to-r ${color} text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}>Back to Hub</button>
            </div>
          </div>
        </div>
      </GameLayout>
    );
  }

  const { score = 0, level = 'Basic' } = results;

  // Level-specific configurations (kept for visual variants)
  const levelConfig = {
    Basic: {
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      icon: '🌱',
      title: 'Getting Started!',
      message: "Great first step! Keep learning and you'll master financial literacy in no time.",
      badge: 'Beginner'
    },
    Medium: {
      color: 'from-blue-400 to-purple-500',
      bgColor: 'from-blue-50 to-purple-50',
      icon: '⚡',
      title: 'Well Done!',
      message: "You're on the right track! Your financial knowledge is growing strong.",
      badge: 'Intermediate'
    },
    Advanced: {
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      icon: '🏆',
      title: 'Excellent!',
      message: 'Outstanding! You have a strong grasp of financial concepts. Keep it up!',
      badge: 'Expert'
    }
  };

  const config = levelConfig[level] || levelConfig.Basic;
  const percentage = Math.round((score / 10) * 100);

  return (
    <GameLayout title="Quiz Results" level={level} score={score} currentXP={percentage} maxXP={100} coins={0} streak={0}>
      <div className="w-full max-w-2xl mx-auto">
        <ConfettiEffect trigger={percentage >= 70} />

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 animate-popIn ring-1 ring-amber-300/10">
          <div className="flex justify-center mb-6">
            <div className={`w-24 h-24 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center text-5xl shadow-lg animate-bounce-slow ring-2 ring-amber-400/20`}>
              {config.icon}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-center text-amber-200 mb-2">{config.title}</h1>

          <div className="flex justify-center mb-6">
            <div className={`px-6 py-2 bg-gradient-to-r ${config.color} text-white rounded-full font-bold text-lg shadow-md ring-1 ring-amber-300/20`}>
              {config.badge} Level
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-700/60 to-slate-700/30 rounded-2xl p-8 mb-6">
            <div className="text-center">
              <p className="text-amber-200/80 font-medium mb-2">Your Score</p>
              <div className="flex items-center justify-center space-x-2">
                <span className={`text-6xl md:text-7xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>{score}</span>
                <span className="text-3xl md:text-4xl text-amber-100 font-medium">/ 10</span>
              </div>
              <p className="text-2xl font-semibold text-amber-200 mt-2">{percentage}%</p>
            </div>

            <div className="flex justify-center mt-6">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700/20" />
                  <circle cx="64" cy="64" r="56" stroke="url(#gradient)" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 56}`} strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" className={`${level === 'Basic' ? 'text-orange-400' : level === 'Medium' ? 'text-blue-400' : 'text-green-400'}`} stopColor="currentColor" />
                      <stop offset="100%" className={`${level === 'Basic' ? 'text-red-500' : level === 'Medium' ? 'text-purple-500' : 'text-emerald-500'}`} stopColor="currentColor" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-amber-200">{percentage}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-r ${config.bgColor} rounded-2xl p-6 mb-6`}>
            <p className="text-center text-amber-200 text-lg leading-relaxed">{config.message}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-700/50 rounded-xl p-4 text-center ring-1 ring-amber-300/10">
              <p className="text-amber-200 font-bold text-2xl">{score}</p>
              <p className="text-amber-100 text-sm font-medium">Correct</p>
            </div>
            <div className="bg-slate-700/40 rounded-xl p-4 text-center ring-1 ring-amber-300/10">
              <p className="text-amber-200 font-bold text-2xl">{10 - score}</p>
              <p className="text-amber-100 text-sm font-medium">Incorrect</p>
            </div>
            <div className={`bg-slate-700/50 rounded-xl p-4 text-center ring-1 ring-amber-300/10`}>
              <p className={`bg-gradient-to-r ${config.color} bg-clip-text text-transparent font-bold text-2xl`}>{level}</p>
              <p className="text-amber-100 text-sm font-medium">Level</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onRetake} className="flex-1 py-4 px-6 bg-amber-200 text-slate-900 rounded-xl font-bold text-lg hover:brightness-95 transition-colors duration-300">Retake Quiz</button>
            <button onClick={() => window.location.href = '/games'} className={`flex-1 py-4 px-6 bg-gradient-to-r ${config.color} text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}>Play Games 🎮</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-slate-800/60 rounded-2xl p-4 text-center shadow-md ring-1 ring-amber-300/10">
            <p className="text-3xl mb-1">🎯</p>
            <p className="text-amber-200 text-sm font-medium">Accuracy</p>
            <p className="text-xl font-bold text-amber-200">{percentage}%</p>
          </div>
          <div className="bg-slate-800/60 rounded-2xl p-4 text-center shadow-md ring-1 ring-amber-300/10">
            <p className="text-3xl mb-1">⭐</p>
            <p className="text-amber-200 text-sm font-medium">Questions</p>
            <p className="text-xl font-bold text-amber-200">10/10</p>
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default ResultScreen;
