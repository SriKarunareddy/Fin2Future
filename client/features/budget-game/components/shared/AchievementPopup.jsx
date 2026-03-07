import { useEffect, useState } from 'react';

/**
 * AchievementPopup - Displays achievement/milestone notifications
 * 
 * Features:
 * - Animated appearance and disappearance
 * - Gold glow effects
 * - Support for different achievement types
 * - Auto-dismiss
 */
const AchievementPopup = ({ 
  isOpen, 
  type = 'achievement', // achievement, milestone, power-up, badge
  icon,
  title,
  description,
  onClose,
  autoDismissMs = 3000
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 300);
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [isOpen, autoDismissMs, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    achievement: {
      bg: 'from-blue-600 to-purple-600',
      ring: 'ring-blue-400',
      shadow: 'shadow-blue-500/40'
    },
    milestone: {
      bg: 'from-amber-500 to-orange-600',
      ring: 'ring-amber-400',
      shadow: 'shadow-amber-500/50'
    },
    'power-up': {
      bg: 'from-orange-500 to-red-600',
      ring: 'ring-orange-400',
      shadow: 'shadow-orange-500/50'
    },
    badge: {
      bg: 'from-purple-600 to-pink-600',
      ring: 'ring-purple-400',
      shadow: 'shadow-purple-500/40'
    }
  };

  const style = typeStyles[type] || typeStyles.achievement;

  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 
      z-50 pointer-events-none
      transition-all duration-300
      ${isClosing ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
      
      <div className={`
        bg-gradient-to-br ${style.bg}
        rounded-3xl p-8 
        ring-2 ${style.ring}
        shadow-2xl ${style.shadow}
        max-w-sm mx-auto
        text-center
        animate-pop-in
      `}>
        {/* Icon */}
        {icon && (
          <div className="text-7xl mb-4 animate-pulse-scale">
            {icon}
          </div>
        )}

        {/* Title */}
        <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-white/90 text-sm font-semibold">
            {description}
          </p>
        )}

        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 
          animate-pulse" style={{ pointerEvents: 'none' }} />
      </div>
    </div>
  );
};

export default AchievementPopup;
