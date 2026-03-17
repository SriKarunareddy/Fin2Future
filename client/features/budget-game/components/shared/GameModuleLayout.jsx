import React from 'react';
import GameHeader from './GameHeader';
import XPBar from './XPBar';

/**
 * GameModuleLayout
 *
 * A higher-level wrapper for game screens that provides:
 * - consistent royal-blue/gold background and ambient glows
 * - sticky header area with `GameHeader`, `XPBar`, and `RewardCounter`
 * - scrollable content area for the game body/results
 */
const GameModuleLayout = ({
  title,
  level = 1,
  currentXP = 0,
  maxXP = 100,
  nextLevelXP = 500,
  coins = 0,
  streak = 0,
  score = 0,
  onBack,
  children,
  stickyHeader = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 overflow-x-auto">
      {/* Ambient glows (subtle, non-obstructive) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-600 to-transparent rounded-full opacity-10" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-600 to-transparent rounded-full opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col min-h-screen px-2 sm:px-4">
        {stickyHeader && (
          <div className="sticky top-0 z-20"> 
            <div className="bg-slate-900/80 rounded-b-2xl px-8 py-4">
              <GameHeader title={title} level={level} onBack={onBack} />
              <div className="mt-4">
                <XPBar currentXP={currentXP} maxXP={maxXP} nextLevelXP={nextLevelXP} animated={true} />
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 mt-6 overflow-y-auto overflow-x-hidden pb-8">
          <div className="animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GameModuleLayout;
