/**
 * RewardCounter - Gold and coin counter display
 * 
 * Shows:
 * - Coin/Gold balance with animated counter
 * - Streak indicator with flame icon
 * - Score display
 */
const RewardCounter = ({ 
  coins = 0, 
  streak = 0, 
  score = 0,
  showScore = true 
}) => {
  return (
    <div className="flex gap-3 flex-wrap justify-center md:justify-start">
      {/* Coin Counter */}
      <div className="flex items-center gap-2 px-5 py-3 
        bg-gradient-to-r from-slate-800 to-slate-700
        rounded-2xl ring-2 ring-amber-500/50
        shadow-lg shadow-amber-600/30
        hover:ring-amber-400 transition-all duration-300">
        <span className="text-2xl animate-bobbing">🪙</span>
        <div>
          <p className="text-amber-300/70 text-xs font-bold uppercase tracking-wider">Coins</p>
          <p className="text-amber-300 font-black text-xl">{coins.toLocaleString()}</p>
        </div>
      </div>

      {/* Streak Indicator */}
      {streak > 0 && (
        <div className="flex items-center gap-2 px-5 py-3 
          bg-gradient-to-r from-orange-900/40 to-red-900/40
          rounded-2xl ring-2 ring-amber-500/50
          shadow-lg shadow-orange-600/20
          animate-pulse">
          <span className="text-2xl animate-bounce-flame">🔥</span>
          <div>
            <p className="text-amber-300/70 text-xs font-bold uppercase tracking-wider">Streak</p>
            <p className="text-amber-300 font-black text-xl">{streak}</p>
          </div>
        </div>
      )}

      {/* Score Display */}
      {showScore && (
        <div className="flex items-center gap-2 px-5 py-3 
          bg-gradient-to-r from-slate-800 to-slate-700
          rounded-2xl ring-2 ring-blue-500/50
          shadow-lg shadow-blue-600/20
          hover:ring-blue-400 transition-all duration-300">
          <span className="text-2xl animate-spin-slow">⭐</span>
          <div>
            <p className="text-blue-300/70 text-xs font-bold uppercase tracking-wider">Score</p>
            <p className="text-blue-300 font-black text-xl">{score}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardCounter;
