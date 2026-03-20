import { useState, useEffect } from 'react';
import GameModuleLayout from '../../shared/GameModuleLayout';
import RewardModal from '../../shared/RewardModal';
import ConfettiEffect from '../../shared/ConfettiEffect';

/**
 * Savings Jar Builder - Visual saving simulation
 * 
 * Users allocate money toward different savings goals and watch progress grow
 * visually in different jars. Each jar represents a savings goal.
 * 
 * Features:
 * - Multiple savings jars with different goals
 * - Visual progress representation
 * - Drag and drop or click to allocate money
 * - Achievement milestones
 * - Animated jar filling effects
 */

const SavingsJarBuilder = ({ onComplete, onBack, playerProgress = {} }) => {
  const [gameState, setGameState] = useState('playing'); // playing, completed
  const [score, setScore] = useState(0);
  const [currentXP, setCurrentXP] = useState(playerProgress.currentXP || 0);
  const [coins, setCoins] = useState(playerProgress.coins || 0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);
  const [availableMoney, setAvailableMoney] = useState(5000);
  const [totalSaved, setTotalSaved] = useState(0);
  const [selectedJar, setSelectedJar] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [allocationAmount, setAllocationAmount] = useState(100);

  // Savings goals with jars
  const savingsJars = [
    {
      id: 'emergency',
      name: 'Emergency Fund',
      icon: '🚨',
      goal: 10000,
      current: 0,
      color: 'from-red-500 to-red-600',
      description: 'For unexpected expenses'
    },
    {
      id: 'vacation',
      name: 'Vacation Fund',
      icon: '✈️',
      goal: 8000,
      current: 0,
      color: 'from-blue-500 to-blue-600',
      description: 'Dream holiday savings'
    },
    {
      id: 'gadget',
      name: 'New Gadget',
      icon: '📱',
      goal: 5000,
      current: 0,
      color: 'from-purple-500 to-purple-600',
      description: 'Latest tech device'
    },
    {
      id: 'education',
      name: 'Education',
      icon: '📚',
      goal: 6000,
      current: 0,
      color: 'from-green-500 to-green-600',
      description: 'Courses and learning'
    },
    {
      id: 'investment',
      name: 'Investment',
      icon: '📈',
      goal: 12000,
      current: 0,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Future investments'
    }
  ];

  const [jars, setJars] = useState(savingsJars);

  useEffect(() => {
    // Initialize round money
    setAvailableMoney(5000 + (round - 1) * 1000);
  }, [round]);

  const allocateToJar = (jarId, amount) => {
    if (amount > availableMoney) return;
    
    const newJars = jars.map(jar => {
      if (jar.id === jarId) {
        const newCurrent = Math.min(jar.goal, jar.current + amount);
        return { ...jar, current: newCurrent };
      }
      return jar;
    });
    
    setJars(newJars);
    setAvailableMoney(prev => prev - amount);
    setTotalSaved(prev => prev + amount);
    setScore(prev => prev + Math.floor(amount / 100));
    setCurrentXP(prev => prev + Math.floor(amount / 200));
    setCoins(prev => prev + Math.floor(amount / 500));
    
    // Check for jar completion
    const completedJar = newJars.find(jar => jar.current === jar.goal && jar.current - amount < jar.goal);
    if (completedJar) {
      handleJarCompletion(completedJar);
    }
  };

  const handleJarCompletion = (jar) => {
    setScore(prev => prev + 500);
    setCurrentXP(prev => prev + 100);
    setCoins(prev => prev + 50);
    
    setAchievements(prev => [...prev, {
      icon: jar.icon,
      name: `${jar.name} Complete!`,
      description: `Reached goal of ₹${jar.goal.toLocaleString()}`
    }]);
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleQuickAllocate = (jarId, percentage) => {
    const amount = Math.floor(availableMoney * (percentage / 100));
    allocateToJar(jarId, amount);
  };

  const nextRound = () => {
    if (round >= totalRounds) {
      setGameState('completed');
    } else {
      setRound(prev => prev + 1);
      setSelectedJar(null);
    }
  };

  const calculateRewards = () => {
    const completedJars = jars.filter(jar => jar.current >= jar.goal).length;
    const totalGoalProgress = jars.reduce((sum, jar) => sum + (jar.current / jar.goal), 0);
    const efficiency = Math.floor((totalSaved / (totalRounds * 5000)) * 100);
    
    const badges = [];
    if (completedJars >= 3) badges.push({ icon: '🏆', name: 'Super Saver' });
    if (completedJars >= 5) badges.push({ icon: '👑', name: 'Savings Master' });
    if (efficiency >= 80) badges.push({ icon: '⚡', name: 'Efficient Saver' });
    
    return {
      type: 'financial',
      xp: currentXP,
      coins: coins,
      badges,
      score,
      totalSaved,
      completedJars,
      efficiency
    };
  };

  const restartGame = () => {
    setGameState('playing');
    setScore(0);
    setCurrentXP(playerProgress.currentXP || 0);
    setCoins(playerProgress.coins || 0);
    setRound(1);
    setTotalSaved(0);
    setAchievements([]);
    setJars(savingsJars.map(jar => ({ ...jar, current: 0 })));
  };

  if (gameState === 'completed') {
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

  return (
    <GameModuleLayout
      title="Savings Jar Builder"
      level={1}
      score={score}
      currentXP={currentXP}
      maxXP={500}
      nextLevelXP={500}
      coins={coins}
      onBack={onBack}
    >
      <div className="max-w-6xl mx-auto">
        <ConfettiEffect trigger={showConfetti} intensity="normal" />
        
        {/* Round and Money Info */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6 shadow-2xl border-2 border-amber-600/30">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-amber-300 font-bold text-lg">Round {round} of {totalRounds}</h3>
              <p className="text-gray-300 text-sm">Allocate your money wisely!</p>
            </div>
            <div className="text-right">
              <div className="text-amber-400 font-bold text-2xl">₹{availableMoney.toLocaleString()}</div>
              <div className="text-gray-300 text-sm">Available to save</div>
            </div>
          </div>
        </div>
        
        {/* Savings Jars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {jars.map((jar) => {
            const progress = (jar.current / jar.goal) * 100;
            const isCompleted = progress >= 100;
            
            return (
              <div
                key={jar.id}
                className={`bg-slate-800 rounded-2xl p-6 shadow-2xl border-2 transition-all duration-300 cursor-pointer
                  ${selectedJar === jar.id ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-amber-600/30'}
                  ${isCompleted ? 'ring-2 ring-green-400/50' : ''}
                  hover:border-amber-400/50`}
                onClick={() => setSelectedJar(jar.id)}
              >
                {/* Jar Icon and Name */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`text-4xl ${isCompleted ? 'animate-pulse' : ''}`}>
                      {jar.icon}
                    </div>
                    <div>
                      <h4 className="text-amber-300 font-bold">{jar.name}</h4>
                      <p className="text-gray-400 text-xs">{jar.description}</p>
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="text-green-400 text-xl">✓</div>
                  )}
                </div>
                
                {/* Visual Jar */}
                <div className="mb-4">
                  <div className="relative h-32 bg-slate-700 rounded-2xl overflow-hidden">
                    <div 
                      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${jar.color} transition-all duration-500`}
                      style={{ height: `${progress}%` }}
                    >
                      {/* Jar fill effect */}
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                    
                    {/* Jar content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">
                          ₹{jar.current.toLocaleString()}
                        </div>
                        <div className="text-gray-300 text-sm">
                          / ₹{jar.goal.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${jar.color}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-center text-gray-400 text-sm mt-1">
                    {progress.toFixed(1)}% Complete
                  </div>
                </div>
                
                {/* Quick Allocate Buttons */}
                {selectedJar === jar.id && availableMoney > 0 && (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAllocate(jar.id, 25);
                        }}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-bold hover:bg-blue-700"
                      >
                        25%
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAllocate(jar.id, 50);
                        }}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-bold hover:bg-blue-700"
                      >
                        50%
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAllocate(jar.id, 100);
                        }}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-bold hover:bg-green-700"
                      >
                        All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Custom Allocation */}
        {selectedJar && availableMoney > 0 && (
          <div className="bg-slate-800 rounded-2xl p-6 mb-6 shadow-2xl border-2 border-amber-600/30">
            <h3 className="text-amber-300 font-bold text-lg mb-4">Custom Allocation</h3>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="100"
                max={availableMoney}
                step="100"
                value={allocationAmount}
                onChange={(e) => setAllocationAmount(parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="bg-slate-700 px-4 py-2 rounded-lg min-w-32 text-center">
                <div className="text-amber-400 font-bold">₹{allocationAmount.toLocaleString()}</div>
              </div>
              <button
                onClick={() => allocateToJar(selectedJar, allocationAmount)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700"
              >
                Allocate
              </button>
            </div>
          </div>
        )}
        
        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="bg-slate-800 rounded-2xl p-6 mb-6 shadow-2xl border-2 border-amber-600/30">
            <h3 className="text-amber-300 font-bold text-lg mb-4">Achievements</h3>
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 bg-slate-700 rounded-lg p-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <div className="text-amber-300 font-bold">{achievement.name}</div>
                    <div className="text-gray-400 text-sm">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Next Round Button */}
        <div className="text-center">
          <button
            onClick={nextRound}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg"
          >
            {round >= totalRounds ? 'Complete Game' : `Next Round →`}
          </button>
        </div>
      </div>
    </GameModuleLayout>
  );
};

export default SavingsJarBuilder;
