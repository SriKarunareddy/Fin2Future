import GameHeader from './GameHeader';
import XPBar from './XPBar';
import RewardCounter from './RewardCounter';

/**
 * GameLayout - Premium reusable game wrapper
 * 
 * Provides consistent layout for all games with:
 * - Dark royal blue gradient background
 * - Header with back button and level badge
 * - XP progress bar with animated fill
 * - Coin, streak, and score counters
 * - Game content area with smooth animations
 */
const GameLayout = ({ 
  title, 
  level = 1,
  score = 0, 
  currentXP = 0,
  maxXP = 100,
  nextLevelXP = 500,
  coins = 0, 
  streak = 0,
  onBack, 
  children
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 md:p-6">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 
          bg-gradient-radial from-amber-600/10 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 
          bg-gradient-radial from-blue-600/10 to-transparent rounded-full blur-3xl opacity-20" />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <GameHeader 
          title={title}
          level={level}
          onBack={onBack}
        />

        {/* XP Bar */}
        <div className="mb-6">
          <XPBar 
            currentXP={currentXP}
            maxXP={maxXP}
            nextLevelXP={nextLevelXP}
            animated={true}
          />
        </div>

        {/* Stats Row */}
        <div className="mb-8">
          <RewardCounter 
            coins={coins}
            streak={streak}
            score={score}
            showScore={true}
          />
        </div>

        {/* Game content */}
        <div className="animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
