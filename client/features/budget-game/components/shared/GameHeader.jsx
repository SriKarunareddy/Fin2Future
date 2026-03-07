/**
 * GameHeader - Premium game header with title and level badge
 * 
 * Displays game title, current level, and back button
 * Features dark royal blue with gold accents
 */
const GameHeader = ({ 
  title, 
  level = 1, 
  onBack 
}) => {
  const getLevelColor = (lvl) => {
    if (lvl <= 3) return 'from-emerald-400 to-teal-500';
    if (lvl <= 6) return 'from-blue-400 to-indigo-500';
    return 'from-purple-400 to-pink-500';
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2.5 
          bg-slate-700 hover:bg-slate-600 
          text-amber-300 rounded-xl transition-all duration-300
          hover:scale-105 active:scale-95
          font-semibold text-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-black text-amber-300 
        text-center flex-1 px-4
        drop-shadow-lg">
        {title}
      </h1>

      {/* Level Badge */}
      <div className={`px-5 py-2.5 bg-gradient-to-r ${getLevelColor(level)} 
        rounded-2xl shadow-lg shadow-amber-500/50
        font-black text-white text-sm
        ring-2 ring-amber-300/50
        flex items-center gap-2`}>
        <span className="text-lg">⭐</span>
        <span>Level {level}</span>
      </div>
    </div>
  );
};

export default GameHeader;
