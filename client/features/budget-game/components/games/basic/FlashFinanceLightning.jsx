import { useState, useEffect, useCallback } from 'react';
import GameModuleLayout from '../../shared/GameModuleLayout';
import RewardModal from '../../shared/RewardModal';
import ConfettiEffect from '../../shared/ConfettiEffect';
import XPIncrementAnimation from '../../shared/XPIncrementAnimation';
import AchievementPopup from '../../shared/AchievementPopup';
import { generateScenario } from '../../../utils/scenarioGenerator';

/**
 * Flash Finance Lightning Mode - Ultra-fast quiz game
 * 
 * Players have 2 seconds per question with streak multipliers for consecutive correct answers.
 * The faster you answer, the more points you earn!
 * 
 * Features:
 * - 2-second timer per question
 * - Streak multiplier system (2x, 3x, 5x)
 * - Lightning-fast gameplay
 * - Visual countdown timer
 * - Speed bonus points
 */

const FlashFinanceLightning = ({ onComplete, onBack, playerProgress = {} }) => {
  const [gameState, setGameState] = useState('ready'); // ready, playing, paused, gameOver
  const [score, setScore] = useState(0);
  const [currentXP, setCurrentXP] = useState(playerProgress.currentXP || 0);
  const [coins, setCoins] = useState(playerProgress.coins || 0);
  const [streak, setStreak] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2);
  const [streakMultiplier, setStreakMultiplier] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const [xpAnimations, setXpAnimations] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [reactionTime, setReactionTime] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const TOTAL_QUESTIONS = 10;
  const QUESTION_TIME = 5; // seconds
  const LEVEL = playerProgress.level || 1;

  // Streak multiplier thresholds
  const STREAK_THRESHOLDS = [
    { streak: 3, multiplier: 2, name: 'Double Points!' },
    { streak: 5, multiplier: 3, name: 'Triple Points!' },
    { streak: 10, multiplier: 5, name: 'MEGA STREAK!' }
  ];

  // Flash Finance question pool
  const FLASH_FINANCE_QUESTIONS = [
    {
      id: 1,
      icon: '🏠',
      title: 'Needs vs Wants',
      question: 'Which of these is a need?',
      options: ['Pizza', 'Rent for your house', 'Video game', 'Designer shoes'],
      correctAnswer: 'Rent for your house'
    },
    {
      id: 2,
      icon: '📱',
      title: 'Needs vs Wants',
      question: 'Buying a new phone when your old one works is a:',
      options: ['Need', 'Want'],
      correctAnswer: 'Want'
    },
    {
      id: 3,
      icon: '💰',
      title: 'Saving Basics',
      question: 'Saving money means:',
      options: ['Spending it quickly', 'Keeping it for future use', 'Giving it away'],
      correctAnswer: 'Keeping it for future use'
    },
    {
      id: 4,
      icon: '🏦',
      title: 'Saving Basics',
      question: 'Which place is safest to keep your savings?',
      options: ['Under your pillow', 'In a bank', 'In your backpack'],
      correctAnswer: 'In a bank'
    },
    {
      id: 5,
      icon: '🧮',
      title: 'Spending Awareness',
      question: 'If you have ₹500 and spend ₹200, how much is left?',
      options: ['₹200', '₹300', '₹400'],
      correctAnswer: '₹300'
    },
    {
      id: 6,
      icon: '🛍️',
      title: 'Spending Awareness',
      question: 'Buying things without thinking is called:',
      options: ['Smart spending', 'Impulse buying', 'Saving'],
      correctAnswer: 'Impulse buying'
    },
    {
      id: 7,
      icon: '💳',
      title: 'Banking Basics',
      question: 'A bank account helps you:',
      options: ['Lose money', 'Store money safely', 'Hide money'],
      correctAnswer: 'Store money safely'
    },
    {
      id: 8,
      icon: '💳',
      title: 'Banking Basics',
      question: 'What card lets you use money from your bank account?',
      options: ['Debit card', 'Library card', 'ID card'],
      correctAnswer: 'Debit card'
    },
    {
      id: 9,
      icon: '📱',
      title: 'Digital Payments',
      question: 'UPI is used for:',
      options: ['Sending money online', 'Playing games', 'Watching movies'],
      correctAnswer: 'Sending money online'
    },
    {
      id: 10,
      icon: '💸',
      title: 'Digital Payments',
      question: 'Which of these is a digital payment app?',
      options: ['WhatsApp', 'Google Pay', 'YouTube'],
      correctAnswer: 'Google Pay'
    },
    {
      id: 11,
      icon: '📊',
      title: 'Budget Basics',
      question: 'A budget helps you:',
      options: ['Spend randomly', 'Plan your money', 'Lose track of money'],
      correctAnswer: 'Plan your money'
    },
    {
      id: 12,
      icon: '💰',
      title: 'Budget Basics',
      question: 'If you save ₹50 every week, after 4 weeks you will have:',
      options: ['₹100', '₹200', '₹250'],
      correctAnswer: '₹200'
    },
    {
      id: 13,
      icon: '📈',
      title: 'Intro to Investing',
      question: 'Investing means:',
      options: ['Growing money over time', 'Spending everything', 'Losing money'],
      correctAnswer: 'Growing money over time'
    },
    {
      id: 14,
      icon: '📊',
      title: 'Intro to Investing',
      question: 'The stock market is where people:',
      options: ['Buy and sell company shares', 'Buy vegetables', 'Buy clothes'],
      correctAnswer: 'Buy and sell company shares'
    },
    {
      id: 15,
      icon: '⚠️',
      title: 'Scam Awareness',
      question: 'If someone asks for your OTP, you should:',
      options: ['Share it', 'Ignore them', 'Send it later'],
      correctAnswer: 'Ignore them'
    },
    {
      id: 16,
      icon: '🚨',
      title: 'Scam Awareness',
      question: 'A message saying "You won ₹10,00,000! Click here!" is usually:',
      options: ['Real', 'A scam'],
      correctAnswer: 'A scam'
    }
  ];

  const [usedQuestions, setUsedQuestions] = useState([]);

  useEffect(() => {
    if (gameState === 'ready') {
      // Load first question when ready
      loadNextQuestion();
    }
  }, [gameState]);

  const loadNextQuestion = () => {
    const availableQuestions = FLASH_FINANCE_QUESTIONS.filter(q => !usedQuestions.includes(q.id));
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    setCurrentQuestion({
      ...randomQuestion,
      description: randomQuestion.question
    });
    setUsedQuestions(prev => [...prev, randomQuestion.id]);
    setTimeLeft(QUESTION_TIME);
    setReactionTime(Date.now());
  };

  useEffect(() => {
    if (gameState !== 'playing' || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          handleTimeout();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState, currentQuestion, timeLeft]);

  const handleTimeout = () => {
    setFeedback({ type: 'timeout', message: '⚡ Time\'s up!' });
    setStreak(0);
    setStreakMultiplier(1);
    
    setTimeout(() => {
      setFeedback(null);
      nextQuestion();
    }, 1000);
  };

  const handleAnswer = (selectedOption) => {
    if (gameState !== 'playing' || !currentQuestion) return;

    const timeTaken = (Date.now() - reactionTime) / 1000;
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      // Calculate points: +10 for correct, +5 bonus for fast answer (<3s)
      const speedBonus = timeTaken < 3 ? 5 : 0;
      const basePoints = 10;
      const totalPoints = (basePoints + speedBonus) * streakMultiplier;
      
      setScore(prev => prev + totalPoints);
      setCurrentXP(prev => prev + (5 * streakMultiplier));
      setCoins(prev => prev + (2 * streakMultiplier));
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
      
      // Check for new streak multiplier
      const newThreshold = STREAK_THRESHOLDS.find(t => t.streak === newStreak);
      if (newThreshold) {
        setStreakMultiplier(newThreshold.multiplier);
        setAchievement({
          type: 'milestone',
          icon: '⚡',
          title: newThreshold.name,
          description: `${newThreshold.multiplier}x points activated!`,
          autoDismissMs: 1500
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      
      // Trigger XP animation
      triggerXPAnimation(5 * streakMultiplier);
      
      setFeedback({ 
        type: 'correct', 
        message: `✅ +${totalPoints} points! ${speedBonus > 0 ? '(Fast bonus!)' : ''} ${streakMultiplier > 1 ? `(${streakMultiplier}x)` : ''}`,
        speedBonus: speedBonus > 0
      });
    } else {
      setFeedback({ type: 'wrong', message: '❌ Wrong answer!' });
      setStreak(0);
      setStreakMultiplier(1);
    }
    
    setQuestionsAnswered(prev => prev + 1);
    
    setTimeout(() => {
      setFeedback(null);
      nextQuestion();
    }, 800);
  };

  const nextQuestion = () => {
    if (questionsAnswered >= TOTAL_QUESTIONS - 1) {
      endGame();
    } else {
      loadNextQuestion();
    }
  };

  const triggerXPAnimation = (amount) => {
    const id = Date.now();
    setXpAnimations(prev => [...prev, { id, amount }]);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCurrentXP(playerProgress.currentXP || 0);
    setCoins(playerProgress.coins || 0);
    setStreak(0);
    setStreakMultiplier(1);
    setQuestionsAnswered(0);
    setBestStreak(0);
    setUsedQuestions([]);
    loadNextQuestion();
  };

  const endGame = () => {
    setGameState('gameOver');
  };

  const calculateRewards = () => {
    const accuracy = Math.floor((score / (TOTAL_QUESTIONS * 10)) * 100);
    const badges = [];
    
    if (bestStreak >= 5) badges.push({ icon: '⚡', name: 'Lightning Master' });
    if (accuracy >= 80) badges.push({ icon: '🎯', name: 'Sharp Shooter' });
    if (score >= 100) badges.push({ icon: '👑', name: 'Speed Champion' });
    
    return { 
      type: 'financial',
      xp: currentXP, 
      coins: coins, 
      badges,
      score,
      accuracy,
      bestStreak
    };
  };

  const restartGame = () => {
    setGameState('ready');
    setScore(0);
    setCurrentXP(playerProgress.currentXP || 0);
    setCoins(playerProgress.coins || 0);
    setStreak(0);
    setStreakMultiplier(1);
    setQuestionsAnswered(0);
    setBestStreak(0);
    setUsedQuestions([]);
  };

  if (gameState === 'gameOver') {
    return (
      <RewardModal
        isOpen={true}
        score={score}
        reward={calculateRewards()}
        onContinue={() => onComplete(calculateRewards())}
        onBack={onBack}
        onReplay={restartGame}
      />
    );
  }

  if (gameState === 'ready') {
    return (
      <GameModuleLayout
        title="Flash Finance Lightning"
        level={LEVEL}
        score={score}
        currentXP={currentXP}
        maxXP={500}
        nextLevelXP={500}
        coins={coins}
        onBack={onBack}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl border-2 border-amber-600/30">
            <div className="text-8xl mb-6 animate-pulse">⚡</div>
            <h1 className="text-4xl font-black text-amber-300 mb-4">Flash Finance</h1>
            <p className="text-xl text-amber-100 mb-6">Lightning Mode</p>
            
            <div className="space-y-4 mb-8">
              <div className="bg-slate-700 rounded-xl p-4">
                <h3 className="text-amber-300 font-bold mb-2">Game Rules:</h3>
                <ul className="text-gray-300 text-left space-y-2">
                  <li>⚡ You have <span className="text-amber-400 font-bold">5 seconds</span> per question</li>
                  <li>🔥 Build streaks for <span className="text-amber-400 font-bold">multipliers</span> (2x, 3x)</li>
                  <li>💨 Answer faster for <span className="text-amber-400 font-bold">bonus points</span> (&lt;3s)</li>
                  <li>🎯 {TOTAL_QUESTIONS} random questions total</li>
                </ul>
              </div>
              
              <div className="bg-slate-700 rounded-xl p-4">
                <h3 className="text-amber-300 font-bold mb-2">Points System:</h3>
                <div className="grid grid-cols-1 gap-2 text-center">
                  <div className="bg-green-600 rounded-lg p-2">
                    <div className="text-white font-bold">Correct Answer</div>
                    <div className="text-amber-300">+10 points</div>
                  </div>
                  <div className="bg-blue-600 rounded-lg p-2">
                    <div className="text-white font-bold">Fast Answer (&lt;3s)</div>
                    <div className="text-amber-300">+5 bonus points</div>
                  </div>
                  <div className="bg-purple-600 rounded-lg p-2">
                    <div className="text-white font-bold">Wrong Answer</div>
                    <div className="text-amber-300">0 points</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-xl p-4">
                <h3 className="text-amber-300 font-bold mb-2">Streak Multipliers:</h3>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-blue-600 rounded-lg p-2">
                    <div className="text-white font-bold">3 Streak</div>
                    <div className="text-amber-300">2x Points</div>
                  </div>
                  <div className="bg-purple-600 rounded-lg p-2">
                    <div className="text-white font-bold">5 Streak</div>
                    <div className="text-amber-300">3x Points</div>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              ⚡ START LIGHTNING ROUND
            </button>
          </div>
        </div>
      </GameModuleLayout>
    );
  }

  return (
    <GameModuleLayout
      title="Flash Finance Lightning"
      level={LEVEL}
      score={score}
      currentXP={currentXP}
      maxXP={500}
      nextLevelXP={500}
      coins={coins}
      streak={streak}
      onBack={onBack}
    >
      <div className="max-w-4xl mx-auto">
        <ConfettiEffect trigger={showConfetti} intensity="high" />
        
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

        {/* Game Stats Bar */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6 shadow-2xl border-2 border-amber-600/30">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-gray-400 text-sm">Question</div>
              <div className="text-amber-300 font-bold text-lg">{questionsAnswered + 1}/{TOTAL_QUESTIONS}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Streak</div>
              <div className="text-amber-300 font-bold text-lg">{streak} 🔥</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Multiplier</div>
              <div className={`font-bold text-lg ${streakMultiplier > 1 ? 'text-red-400 animate-pulse' : 'text-gray-300'}`}>
                {streakMultiplier}x
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Score</div>
              <div className="text-amber-300 font-bold text-lg">{score}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Best Streak</div>
              <div className="text-amber-300 font-bold text-lg">{bestStreak}</div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-6 shadow-2xl border-2 border-amber-600/30">
          <div className="text-center">
            <div className="text-amber-300 font-bold mb-2">Time Remaining</div>
            <div className={`text-6xl font-black ${timeLeft <= 0.5 ? 'text-red-500 animate-pulse' : timeLeft <= 1 ? 'text-orange-400' : 'text-amber-400'}`}>
              {timeLeft.toFixed(1)}s
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4 mt-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-100 ${
                  timeLeft <= 0.5 ? 'bg-red-500' : timeLeft <= 1 ? 'bg-orange-500' : 'bg-gradient-to-r from-amber-500 to-yellow-500'
                }`}
                style={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className="bg-slate-800 rounded-2xl p-8 mb-6 shadow-2xl border-2 border-amber-600/30">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentQuestion.icon}</div>
              <h2 className="text-3xl font-bold text-amber-300 mb-4">{currentQuestion.title}</h2>
              <p className="text-xl text-gray-300">{currentQuestion.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="text-center mb-6">
            <div className={`inline-block px-8 py-4 rounded-2xl text-white font-black text-xl animate-bounce
              ${feedback.type === 'correct' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50' 
                : feedback.type === 'timeout'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/50'
                : 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/50'}
            `}>
              {feedback.message}
            </div>
          </div>
        )}
      </div>
    </GameModuleLayout>
  );
};

export default FlashFinanceLightning;
