import { useEffect, useState } from 'react';

/**
 * XPIncrementAnimation - Floating XP animation when earned
 * 
 * Shows floating "+XP" text with glow effect
 */
const XPIncrementAnimation = ({ 
  amount, 
  x = 50, 
  y = 50,
  onComplete 
}) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed pointer-events-none text-3xl font-black
        text-amber-300 drop-shadow-2xl
        transition-all duration-1500
        ${isAnimating ? 'opacity-100' : 'opacity-0'}
        animate-float-up`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: isAnimating ? 'translateY(0)' : 'translateY(-100px)'
      }}
    >
      <div className="relative">
        <span className="animate-pulse">+{amount} XP</span>
        <div className="absolute inset-0 blur-md text-amber-400 opacity-50">
          +{amount} XP
        </div>
      </div>
    </div>
  );
};

export default XPIncrementAnimation;
