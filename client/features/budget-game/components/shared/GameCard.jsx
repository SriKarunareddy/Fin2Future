/**
 * GameCard - Premium game challenge/question card
 * 
 * Features:
 * - Dark gradient background with gold glow border
 * - Rounded corners with shadow
 * - Hover lift animation
 * - Responsive sizing
 */
const GameCard = ({ 
  icon, 
  title, 
  description, 
  highlight,
  powerMode = false,
  children,
  className = ''
}) => {
  return (
    <div className={`rounded-3xl transition-all duration-300
      transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30
      active:scale-95
      ${powerMode ? 'ring-4 ring-amber-300 shadow-2xl shadow-amber-500/50' : 'ring-2 ring-amber-600/30 shadow-xl shadow-amber-900/20'}
      ${className}`}>
      
      {/* Gradient Background */}
      <div className={`h-full rounded-3xl p-8
        bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950
        flex flex-col items-center justify-center
        relative overflow-hidden
        ${powerMode ? 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-amber-500/20 before:to-orange-500/20 before:animate-pulse' : ''}`}>
        
        {/* Glow orb background effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 
          bg-gradient-radial from-amber-500/20 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 
          bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-3xl opacity-30" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4">
          {/* Icon */}
          {icon && (
            <div className={`text-6xl md:text-7xl mb-6 
              ${powerMode ? 'animate-pulse-scale' : 'animate-gentle-float'}`}>
              {icon}
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-black text-amber-300 
            text-center mb-4 drop-shadow-lg break-words px-2">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-amber-100/80 text-center text-sm md:text-base 
              mb-6 leading-relaxed px-2">
              {description}
            </p>
          )}

          {/* Highlight */}
          {highlight && (
            <div className="mb-6 px-6 py-3 rounded-2xl 
              bg-gradient-to-r from-amber-500/20 to-orange-500/20
              border-2 border-amber-400/50
              text-amber-200 font-bold text-center text-sm">
              {highlight}
            </div>
          )}

          {/* Children */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
