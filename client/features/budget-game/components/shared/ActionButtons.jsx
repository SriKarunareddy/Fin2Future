/**
 * ActionButtons - Premium CTA buttons with gold styling
 * 
 * Features:
 * - Primary gold buttons
 * - Secondary buttons
 * - Hover and active animations
 * - Button press feedback
 */
const ActionButtons = ({ 
  buttons = [],
  vertical = false,
  className = ''
}) => {
  return (
    <div className={`flex gap-4 justify-center flex-wrap 
      ${vertical ? 'flex-col' : 'flex-row'}
      ${className}`}>
      {buttons.map((btn, index) => (
        <button
          key={index}
          onClick={btn.onClick}
          disabled={btn.disabled}
          className={`
            px-8 py-4 rounded-2xl font-black text-base md:text-lg
            transition-all duration-300
            transform active:scale-95 
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
            ring-2
            ${
              btn.variant === 'secondary'
                ? 'bg-slate-700 hover:bg-slate-600 text-amber-300 ring-slate-600 hover:ring-amber-500/50 shadow-lg shadow-slate-900/50'
                : btn.variant === 'danger'
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white ring-red-500/30 shadow-lg shadow-red-600/20'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 ring-amber-300 shadow-xl shadow-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/60'
            }
            ${!btn.disabled ? 'hover:scale-110' : ''}
          `}
        >
          {btn.icon && <span className="text-xl">{btn.icon}</span>}
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
