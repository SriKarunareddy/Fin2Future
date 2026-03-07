import { useState, useEffect } from 'react';
import GameModuleLayout from '../../shared/GameModuleLayout';
import Timer from '../../shared/Timer';
import RewardModal from '../../shared/RewardModal';
import { calculateXP, calculateCoins, checkBadges } from '../../../utils/progressManager';
import { generateSpendingScenarios } from '../../../utils/scenarioGenerator';

/**
 * Spend Smart Sprint - Rapid decision game
 * 
 * 30-second timer, quick decisions: Smart or Wasteful?
 */
const SpendSmartSprint = ({ onComplete, onBack, playerProgress }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    // Generate scenarios
    const newScenarios = generateSpendingScenarios(20);
    setScenarios(newScenarios);
    setCurrentScenario(newScenarios[0]);
  }, []);

  useEffect(() => {
    // Increase speed every 10 seconds
    const speedInterval = setInterval(() => {
      setSpeed(prev => Math.min(prev + 0.2, 2));
    }, 10000);

    return () => clearInterval(speedInterval);
  }, []);

  const handleChoice = (choice) => {
    if (!currentScenario || gameOver) return;

    const isCorrect = choice === currentScenario.correct;

    if (isCorrect) {
      // Correct answer
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));
      
      const points = newStreak >= 3 ? 20 : 10; // Streak bonus
      setScore(score + points);
      setCoins(coins + 5);

      setFeedback({ type: 'correct', message: '+' + points });

      // Coin burst animation
      createCoinBurst();
    } else {
      // Wrong answer
      setStreak(0);
      setTimeLeft(Math.max(0, timeLeft - 2)); // Penalty
      setFeedback({ type: 'wrong', message: '-2s' });
    }

    // Clear feedback after animation
    setTimeout(() => setFeedback(null), 800);

    // Next scenario
    setTimeout(() => {
      if (scenarioIndex < scenarios.length - 1) {
        setScenarioIndex(scenarioIndex + 1);
        setCurrentScenario(scenarios[scenarioIndex + 1]);
      } else {
        handleGameEnd();
      }
    }, 600);
  };

  const createCoinBurst = () => {
    // Trigger coin animation (handled by CSS)
    const burst = document.getElementById('coin-burst');
    if (burst) {
      burst.classList.add('active');
      setTimeout(() => burst.classList.remove('active'), 1000);
    }
  };

  const handleGameEnd = () => {
    setGameOver(true);

    setTimeout(() => {
      setShowReward(true);
    }, 500);
  };

  const handleReplay = () => {
    window.location.reload();
  };

  const handleContinue = () => {
    const earnedXP = calculateXP(score, Math.floor(timeLeft / 5), maxStreak, 'Basic');
    const earnedCoins = calculateCoins(score, 'Basic');
    const newBadges = checkBadges(playerProgress, {
      difficulty: 'Basic',
      score,
      maxStreak,
      won: score > 50,
      completed: true
    });

    onComplete({
      xp: earnedXP,
      coins: earnedCoins,
      badges: newBadges
    });
  };

  if (!currentScenario) {
    return <div>Loading...</div>;
  }

  return (
    <GameModuleLayout
      title="Spend Smart Sprint"
      level={playerProgress?.level || 1}
      score={score}
      currentXP={coins * 10}
      maxXP={200}
      coins={coins}
      streak={streak}
      onBack={onBack}
    >
      <div className="max-w-3xl mx-auto">
      {/* Timer */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
        <Timer
          duration={30}
          onComplete={handleGameEnd}
          isPaused={gameOver}
        />
      </div>

      {/* Scenario card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-4 relative overflow-hidden animate-slideDown">
        {/* Feedback overlay */}
        {feedback && (
          <div className={`absolute inset-0 flex items-center justify-center z-10 ${
            feedback.type === 'correct' ? 'bg-green-500' : 'bg-red-500'
          } bg-opacity-90 animate-scaleIn`}>
            <div className="text-center">
              <div className="text-6xl mb-2">
                {feedback.type === 'correct' ? '✓' : '✗'}
              </div>
              <div className="text-3xl font-bold text-white">
                {feedback.message}
              </div>
            </div>
          </div>
        )}

        {/* Coin burst effect */}
        <div id="coin-burst" className="coin-burst"></div>

        {/* Scenario content */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{currentScenario.icon}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {currentScenario.title}
          </h2>
          <p className="text-xl text-gray-600">
            {currentScenario.description}
          </p>
        </div>

        {/* Choice buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleChoice('smart')}
            disabled={gameOver}
            className="py-6 px-8 bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white rounded-2xl font-bold text-xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-3xl mb-2">✓</div>
            Smart Choice
          </button>
          <button
            onClick={() => handleChoice('wasteful')}
            disabled={gameOver}
            className="py-6 px-8 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-2xl font-bold text-xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-3xl mb-2">✗</div>
            Wasteful Choice
          </button>
        </div>

        {/* Speed indicator */}
        {speed > 1 && (
          <div className="mt-4 text-center">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-bold animate-pulse">
              🔥 Speed x{speed.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Question {scenarioIndex + 1} of {scenarios.length}</span>
          <span>Best Streak: {maxStreak} 🔥</span>
        </div>
      </div>

      {/* Reward Modal */}
      <RewardModal
        isOpen={showReward}
        score={score}
        xp={calculateXP(score, Math.floor(timeLeft / 5), maxStreak, 'Basic')}
        coins={calculateCoins(score, 'Basic')}
        badges={checkBadges(playerProgress, {
          difficulty: 'Basic',
          score,
          maxStreak,
          won: score > 50,
          completed: true
        })}
        onBack={onBack}
        onReplay={handleReplay}
        onContinue={handleContinue}
      />
      </div>
    </GameModuleLayout>
  );
};

export default SpendSmartSprint;
