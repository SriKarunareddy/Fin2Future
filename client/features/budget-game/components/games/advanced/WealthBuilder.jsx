import React from 'react';
import GameModuleLayout from '../../shared/GameModuleLayout';

const WealthBuilder = ({ onComplete, onBack, playerProgress = {} }) => {
  return (
    <GameModuleLayout
      title="5-Year Wealth Builder"
      level={playerProgress?.level || 1}
      currentXP={playerProgress?.currentXP || 0}
      maxXP={playerProgress?.maxXP || 100}
      coins={playerProgress?.coins || 0}
      streak={playerProgress?.streak || 0}
      onBack={onBack}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-96">
        <div className="bg-slate-800/80 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center ring-1 ring-amber-300/20">
          <h1 className="text-3xl font-bold text-amber-200 mb-4">5-Year Wealth Builder</h1>
          <p className="text-amber-100 mb-6">Coming Soon!</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-amber-400 text-slate-900 rounded-xl font-bold hover:brightness-95 transition-colors"
          >
            Back to Games
          </button>
        </div>
      </div>
    </GameModuleLayout>
  );
};

export default WealthBuilder;
