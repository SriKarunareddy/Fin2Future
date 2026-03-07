/**
 * XPBar - Animated experience point progress bar
 * 
 * Features:
 * - Gold animated progress fill
 * - Glow effects
 * - Current/Max XP display
 */
const XPBar = ({ 
  currentXP = 0, 
  maxXP = 100, 
  nextLevelXP = 500,
  animated = true 
}) => {
  const percentage = Math.min((currentXP / maxXP) * 100, 100);
  
  return (
    <div className="w-full">
      {/* Label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-amber-300 font-bold text-sm">EXPERIENCE</span>
        <span className="text-amber-400 font-bold text-sm">
          {currentXP} / {maxXP} XP
        </span>
      </div>

      {/* Bar Background */}
      <div className="relative h-6 bg-slate-700 rounded-full overflow-hidden 
        ring-2 ring-amber-600/30 shadow-lg shadow-slate-900/50">
        
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-amber-500/20" />
        
        {/* Animated progress fill */}
        <div
          className={`h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200
            transition-all duration-500 ease-out
            shadow-lg shadow-amber-400/60
            relative overflow-hidden
            ${animated ? 'animate-goldGlow' : ''}`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
            animate-shimmer" />
        </div>
      </div>

      {/* XP text in center */}
      <div className="text-center mt-1 text-xs text-amber-300/80 font-semibold">
        Next Level: {nextLevelXP - currentXP > 0 ? nextLevelXP - currentXP : 0} XP remaining
      </div>
    </div>
  );
};

export default XPBar;
