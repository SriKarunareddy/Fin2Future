import { useState, useEffect } from 'react';
import GameModuleLayout from '../../shared/GameModuleLayout';
import RewardModal from '../../shared/RewardModal';
import GameCard from '../../shared/GameCard';
import ActionButtons from '../../shared/ActionButtons';
import AchievementPopup from '../../shared/AchievementPopup';
import ConfettiEffect from '../../shared/ConfettiEffect';
import XPIncrementAnimation from '../../shared/XPIncrementAnimation';
import { generateScenario } from '../../../utils/scenarioGenerator';

/**
 * Needs vs Wants Swipe Rush
 * Swipe classification game - swipe left for needs, right for wants
 * 
 * Features:
 * - Premium dark blue and gold UI
 * - Animated progress and rewards
 * - Celebration effects on achievements
 * - XP and coin rewards with animations
 */
const NeedsVsWantsSwipe = ({ onComplete, onBack, playerProgress = {} }) => {
  const [score, setScore] = useState(0);
  const [currentXP, setCurrentXP] = useState(playerProgress.currentXP || 0);
  const [coins, setCoins] = useState(playerProgress.coins || 0);
  const [streak, setStreak] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [cardsPlayed, setCardsPlayed] = useState(0);
  const [powerMode, setPowerMode] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [xpAnimations, setXpAnimations] = useState([]);

  const TOTAL_CARDS = 15;
  const POWER_MODE_THRESHOLD = 5;
  const LEVEL = playerProgress.level || 1;
  const MAX_XP = 500;
  const NEXT_LEVEL_XP = LEVEL * 500;

  useEffect(() => {
    loadNextCard();
  }, []);

  const loadNextCard = () => {
    const scenario = generateScenario('needs-vs-wants');
    setCurrentCard(scenario);
    setSwipeDirection(null);
  };

  const triggerXPAnimation = (amount) => {
    const id = Date.now();
    setXpAnimations(prev => [...prev, { id, amount }]);
  };

  const handleSwipe = (direction) => {
    if (!currentCard || gameOver) return;

    setSwipeDirection(direction);
    
    setTimeout(() => {
      const isCorrect = 
        (direction === 'left' && currentCard.correctAnswer === 'need') ||
        (direction === 'right' && currentCard.correctAnswer === 'want');

      if (isCorrect) {
        const newStreak = streak + 1;
        const basePoints = powerMode ? 20 : 10;
        const xpReward = powerMode ? 50 : 25;
        const coinReward = powerMode ? 10 : 5;
        
        setScore(score + basePoints);
        setCurrentXP(currentXP + xpReward);
        setCoins(coins + coinReward);
        setStreak(newStreak);

        // Trigger XP animation
        triggerXPAnimation(xpReward);

        // Show feedback
        setFeedback({ 
          type: 'correct', 
          message: `+${basePoints} points!`,
          xpGain: xpReward
        });

        // Check for power mode activation
        if (newStreak === POWER_MODE_THRESHOLD && !powerMode) {
          setPowerMode(true);
          setAchievement({
            type: 'power-up',
            icon: '🔥',
            title: 'POWER MODE!',
            description: 'You\'re on fire! Answers worth double points!',
            autoDismissMs: 1500
          });
        }

        // Check for milestone achievements
        if (newStreak === 10) {
          setAchievement({
            type: 'milestone',
            icon: '⚡',
            title: '10 In a Row!',
            description: 'Amazing streak achieved!',
            autoDismissMs: 1500
          });
        }
      } else {
        setStreak(0);
        setPowerMode(false);
        setFeedback({ type: 'wrong', message: 'Not quite right. Keep learning!' });
        setAchievement(null);
      }

      const newCardsPlayed = cardsPlayed + 1;
      setCardsPlayed(newCardsPlayed);

      if (newCardsPlayed >= TOTAL_CARDS) {
        setTimeout(() => setGameOver(true), 1000);
      } else {
        setTimeout(() => {
          setFeedback(null);
          loadNextCard();
        }, 1000);
      }
    }, 300);
  };

  const calculateRewards = () => {
    const totalXP = currentXP;
    const totalCoins = coins;
    const badges = [];

    if (streak >= 10) {
      badges.push({ icon: '⚡', name: 'Streak Master' });
    }
    if (score >= TOTAL_CARDS * 15) {
      badges.push({ icon: '👑', name: 'Perfect Score' });
    }

    return { xp: totalXP, coins: totalCoins, badges };
  };

  if (gameOver) {
    return (
      <RewardModal
        isOpen={true}
        score={score}
        reward={calculateRewards()}
        onContinue={() => onComplete(calculateRewards())}
        onBack={onBack}
        onReplay={() => {
          setScore(0);
          setCurrentXP(playerProgress.currentXP || 0);
          setCoins(playerProgress.coins || 0);
          setStreak(0);
          setCardsPlayed(0);
          setPowerMode(false);
          setGameOver(false);
          loadNextCard();
        }}
      />
    );
  }

  const buttons = [
    {
      label: 'NEED',
      icon: '👈',
      onClick: () => handleSwipe('left'),
      disabled: swipeDirection !== null
    },
    {
      label: 'WANT',
      icon: '👉',
      onClick: () => handleSwipe('right'),
      disabled: swipeDirection !== null
    }
  ];

  return (
    <GameModuleLayout
      title="Needs vs Wants"
      level={LEVEL}
      score={score}
      currentXP={currentXP}
      maxXP={MAX_XP}
      nextLevelXP={NEXT_LEVEL_XP}
      coins={coins}
      streak={streak}
      onBack={onBack}
    >
      <div className="max-w-4xl mx-auto overflow-x-hidden px-4">
      <ConfettiEffect trigger={feedback?.type === 'correct'} intensity="normal" />

      {/* XP Increment Animations */}
      {xpAnimations.map(anim => (
        <XPIncrementAnimation
          key={anim.id}
          amount={anim.amount}
          x={50}
          y={50}
          onComplete={() => {
            setXpAnimations(prev => prev.filter(a => a.id !== anim.id));
          }}
        />
      ))}

      {/* Achievement Popup */}
      <AchievementPopup
        isOpen={achievement !== null}
        type={achievement?.type}
        icon={achievement?.icon}
        title={achievement?.title}
        description={achievement?.description}
        autoDismissMs={achievement?.autoDismissMs || 3000}
        onClose={() => setAchievement(null)}
      />

      {/* Game Progress */}
      <div className="mb-6 text-center">
        <p className="text-amber-300 font-bold text-sm mb-2">
          Card {cardsPlayed + 1} of {TOTAL_CARDS}
        </p>
        <div className="w-full max-w-md mx-auto h-2 bg-slate-700 rounded-full overflow-hidden ring-1 ring-amber-600/30">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-300"
            style={{ width: `${((cardsPlayed) / TOTAL_CARDS) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Game Card */}
      {currentCard && (
        <div className="flex justify-center mb-8 relative">
          <div className={`w-full max-w-xl transition-all duration-300 transform
            ${swipeDirection === 'left' ? '-translate-x-96 opacity-0' : ''}
            ${swipeDirection === 'right' ? 'translate-x-96 opacity-0' : ''}`}>
            <GameCard
              icon={currentCard.icon}
              title={currentCard.title}
              description={currentCard.description}
              powerMode={powerMode}
              className="min-h-80"
            />
          </div>
        </div>
      )}

      {/* Feedback Message */}
      {feedback && (
        <div className={`text-center mb-6 animate-popIn`}>
          <div className={`inline-block px-8 py-4 rounded-2xl text-white font-black text-xl
            ${feedback.type === 'correct' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50' 
              : 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/50'}
          `}>
            {feedback.message}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center">
        <ActionButtons 
          buttons={buttons}
        />
      </div>

      {/* Instructions */}
      <p className="text-center text-amber-300/70 text-sm mt-8 font-semibold">
        👈 Tap NEED for essentials • 👉 Tap WANT for nice-to-have
      </p>
      </div>
    </GameModuleLayout>
  );
};

export default NeedsVsWantsSwipe;
