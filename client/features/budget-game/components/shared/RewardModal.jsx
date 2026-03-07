import { useEffect, useState } from 'react';
import ConfettiEffect from './ConfettiEffect';
import ActionButtons from './ActionButtons';

/**
 * RewardModal - Premium game completion reward display
 * 
 * Shows earned XP, coins, badges with confetti animations
 * Dark royal blue theme with gold accents
 */
const RewardModal = ({ 
  isOpen, 
  score = 0, 
  xp = 0, 
  coins = 0, 
  badges = [], 
  onReplay, 
  onContinue,
  onBack,
  reward = null // Alternative format: { xp, coins, badges }
}) => {
  const [animateRewards, setAnimateRewards] = useState(false);

  const displayXP = reward?.xp || xp;
  const displayCoins = reward?.coins || coins;
  const displayBadges = reward?.badges || badges;

  useEffect(() => {
    if (isOpen) {
      setAnimateRewards(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const buttons = [
    {
      label: 'Back to Games',
      icon: '🔙',
      variant: 'tertiary',
      onClick: onBack,
      hidden: !onBack
    },
    {
      label: 'Play Again',
      icon: '🔄',
      variant: 'secondary',
      onClick: onReplay
    },
    {
      label: 'Continue',
      icon: '➜',
      onClick: onContinue
    }
  ].filter(btn => !btn.hidden);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <ConfettiEffect trigger={isOpen} intensity="intense" />
      
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 
        rounded-3xl shadow-2xl shadow-amber-500/30 p-6 md:p-8 lg:p-12 
        max-w-md md:max-w-lg lg:max-w-xl w-full animate-popIn
        ring-2 ring-amber-500/50 mx-4">
        
        {/* Celebration icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 
            rounded-full flex items-center justify-center text-5xl 
            shadow-2xl shadow-amber-500/50
            animate-bounce-celebration">
            🎉
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-black text-center text-amber-300 mb-2 drop-shadow-lg">
          Game Complete!
        </h2>
        <p className="text-center text-amber-200/80 mb-8 text-base font-semibold">
          Awesome performance! Here's what you earned:
        </p>

        {/* Rewards */}
        <div className="space-y-4 mb-8">
          {/* Score */}
          <div className={`bg-gradient-to-r from-blue-900/40 to-purple-900/40 
            rounded-2xl p-5 border-2 border-blue-500/50
            transform transition-all duration-700
            ${animateRewards ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-spin-slow">⭐</span>
                <div>
                  <p className="text-blue-300/70 text-xs font-bold uppercase tracking-wider">Score</p>
                  <p className="text-blue-300 font-black text-2xl">{score}</p>
                </div>
              </div>
            </div>
          </div>

          {/* XP */}
          <div className={`bg-gradient-to-r from-amber-900/40 to-orange-900/40 
            rounded-2xl p-5 border-2 border-amber-500/50
            transform transition-all duration-700 delay-100
            ${animateRewards ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-pulse">✨</span>
                <div>
                  <p className="text-amber-300/70 text-xs font-bold uppercase tracking-wider">XP Earned</p>
                  <p className="text-amber-300 font-black text-2xl">+{displayXP}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coins */}
          <div className={`bg-gradient-to-r from-yellow-900/40 to-amber-900/40 
            rounded-2xl p-5 border-2 border-amber-400/50
            transform transition-all duration-700 delay-150
            ${animateRewards ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-bobbing">🪙</span>
                <div>
                  <p className="text-amber-300/70 text-xs font-bold uppercase tracking-wider">Coins Earned</p>
                  <p className="text-amber-300 font-black text-2xl">+{displayCoins}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          {displayBadges.length > 0 && (
            <div className={`bg-gradient-to-r from-purple-900/40 to-pink-900/40 
              rounded-2xl p-5 border-2 border-purple-500/50
              transform transition-all duration-700 delay-200
              ${animateRewards ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
              <p className="text-purple-300 text-sm font-bold mb-3 uppercase tracking-wider">
                🏆 New Badges Unlocked!
              </p>
              <div className="flex flex-wrap gap-3">
                {displayBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl 
                      border-2 border-purple-400/50 shadow-lg shadow-purple-500/20"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="font-bold text-purple-300 text-sm">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <ActionButtons 
          buttons={buttons}
          vertical={true}
        />
      </div>
    </div>
  );
};

export default RewardModal;
