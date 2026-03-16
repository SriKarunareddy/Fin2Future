import { useState, useEffect } from 'react';
import GameModuleLayout from '../../shared/GameModuleLayout';
import RewardModal from '../../shared/RewardModal';
import ConfettiEffect from '../../shared/ConfettiEffect';
import XPIncrementAnimation from '../../shared/XPIncrementAnimation';
import AchievementPopup from '../../shared/AchievementPopup';

/**
 * Investment Garden - Interactive investment learning game
 * 
 * Players plant different investment "plants" and watch them grow based on market conditions.
 * Teaches risk vs reward, diversification, and market volatility through visual gameplay.
 * 
 * Features:
 * - 4 garden plots for different investments
 * - 3 rounds of growth with market events
 * - Visual plant growth animations
 * - Market event system affecting investments
 * - Educational feedback on investment strategies
 */

const InvestmentGarden = ({ onComplete, onBack, playerProgress = {}, onRealtimeUpdate }) => {
  const [gameState, setGameState] = useState('intro'); // intro, ready, planting, growing, harvestDecision, reinvesting, finalHarvest, gameOver
  const [startingMoney] = useState(10000);
  const [currentCash, setCurrentCash] = useState(10000);
  const [gardenPlots, setGardenPlots] = useState([
    { id: 1, crop: null, invested: 0, currentValue: 0, growthStage: 0, rounds: 0 },
    { id: 2, crop: null, invested: 0, currentValue: 0, growthStage: 0, rounds: 0 },
    { id: 3, crop: null, invested: 0, currentValue: 0, growthStage: 0, rounds: 0 }
  ]);
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [marketEvent, setMarketEvent] = useState(null);
  const [totalWealth, setTotalWealth] = useState(10000);
  const [profit, setProfit] = useState(0);
  const [score, setScore] = useState(0);
  const [currentXP, setCurrentXP] = useState(playerProgress.currentXP || 0);
  const [coins, setCoins] = useState(playerProgress.coins || 0);
  const [achievement, setAchievement] = useState(null);
  const [xpAnimations, setXpAnimations] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bestCrop, setBestCrop] = useState(null);
  const [playerRank, setPlayerRank] = useState('');
  const [harvestDecision, setHarvestDecision] = useState(null);

  const TOTAL_ROUNDS = 5;
  const LEVEL = playerProgress.level || 1;

  // Crop types (investments)
  const CROP_TYPES = [
    {
      id: 'sunflower',
      name: 'Sunflower',
      icon: '🌻',
      cost: 2000,
      risk: 'Low',
      baseReturn: 2400,
      growthMultiplier: 1.20,
      color: 'from-yellow-400 to-orange-400'
    },
    {
      id: 'strawberry',
      name: 'Strawberry',
      icon: '🍓',
      cost: 3000,
      risk: 'Medium',
      baseReturn: 4200,
      growthMultiplier: 1.40,
      color: 'from-red-400 to-pink-400'
    },
    {
      id: 'mango',
      name: 'Mango Tree',
      icon: '🥭',
      cost: 5000,
      risk: 'High',
      baseReturn: 9000,
      growthMultiplier: 1.80,
      color: 'from-green-400 to-emerald-400'
    }
  ];

  // Growth stages (visual progression)
  const GROWTH_STAGES = ['🌱', '🌿', '🌻', '🍓', '🧺'];

  // Market events
  const MARKET_EVENTS = [
    {
      id: 'good-rain',
      name: '🌧 Good Rain',
      description: 'Crops grow faster',
      effect: '+10% growth to all crops',
      multiplier: 1.10
    },
    {
      id: 'pest-attack',
      name: '🐛 Pest Attack',
      description: 'Some crops lose value',
      effect: '-15% to medium/high risk crops',
      multiplier: 0.85,
      targetRisk: ['Medium', 'High']
    },
    {
      id: 'perfect-weather',
      name: '☀ Perfect Weather',
      description: 'Bonus growth for all',
      effect: '+15% growth to all crops',
      multiplier: 1.15
    },
    {
      id: 'drought',
      name: '🏜 Drought',
      description: 'Crops struggle to grow',
      effect: '-10% growth to all crops',
      multiplier: 0.90
    },
    {
      id: 'bumper-harvest',
      name: '🎉 Bumper Harvest',
      description: 'Exceptional growth',
      effect: '+25% growth to high risk crops',
      multiplier: 1.25,
      targetRisk: ['High']
    }
  ];

  const startGame = () => {
    setGameState('planting');
    setCurrentCash(startingMoney);
    setGardenPlots([
      { id: 1, crop: null, invested: 0, currentValue: 0, growthStage: 0, rounds: 0 },
      { id: 2, crop: null, invested: 0, currentValue: 0, growthStage: 0, rounds: 0 },
      { id: 3, crop: null, invested: 0, currentValue: 0, growthStage: 0, rounds: 0 }
    ]);
    setCurrentRound(1);
    setTotalWealth(startingMoney);
    setProfit(0);
    setScore(0);
    setBestCrop(null);
    setPlayerRank('');
    setHarvestDecision(null);
  };

  const selectPlot = (plotId) => {
    if (gameState !== 'planting' && gameState !== 'reinvesting') return;
    setSelectedPlot(plotId);
  };

  const plantCrop = (cropType) => {
    if (!selectedPlot || currentCash < cropType.cost) return;

    const updatedPlots = gardenPlots.map(plot => {
      if (plot.id === selectedPlot && !plot.crop) {
        return {
          ...plot,
          crop: cropType,
          invested: cropType.cost,
          currentValue: cropType.cost,
          growthStage: 0,
          rounds: 0
        };
      }
      return plot;
    });

    setGardenPlots(updatedPlots);
    setCurrentCash(currentCash - cropType.cost);
    setSelectedPlot(null);
  };

  const startGrowth = () => {
    setGameState('growing');
    setMarketEvent(null);

    // Apply market event
    setTimeout(() => {
      const event = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
      setMarketEvent(event);

      let updatedPlots = gardenPlots.map(plot => {
        if (!plot.crop) return plot;

        let multiplier = event.multiplier;
        // Apply targeted effects
        if (event.targetRisk && !event.targetRisk.includes(plot.crop.risk)) {
          multiplier = 1.0;
        }

        const growthBonus = (plot.crop.growthMultiplier - 1) * multiplier;
        const newValue = plot.currentValue * (1 + growthBonus);
        const newStage = Math.min(4, plot.growthStage + 1);

        return {
          ...plot,
          currentValue: newValue,
          growthStage: newStage,
          rounds: plot.rounds + 1
        };
      });

      setGardenPlots(updatedPlots);
      
      // Calculate total wealth
      const cropValue = updatedPlots.reduce((sum, plot) => sum + plot.currentValue, 0);
      const total = currentCash + cropValue;
      setTotalWealth(total);
      setProfit(total - startingMoney);

      // Continue to next phase
      setTimeout(() => {
        if (currentRound === 2 || currentRound === 4) {
          setGameState('harvestDecision');
        } else if (currentRound === 5) {
          endGame();
        } else {
          setCurrentRound(currentRound + 1);
          setGameState('planting');
        }
      }, 3000);
    }, 2000);
  };

  const makeHarvestDecision = (decision) => {
    setHarvestDecision(decision);
    
    if (decision === 'harvest') {
      // Harvest all crops
      const harvestedValue = gardenPlots.reduce((sum, plot) => sum + plot.currentValue, 0);
      setCurrentCash(currentCash + harvestedValue);
      setGardenPlots([
        { id: 1, crop: null, invested: 0, currentValue: 0, growthStage: 0, rounds: 0 },
        { id: 2, crop: null, invested: 0, currentValue: 0, growthStage: 0, rounds: 0 },
        { id: 3, crop: null, invested: 0, currentValue: 0, growthStage: 0, rounds: 0 }
      ]);
      
      if (currentRound === 2) {
        setCurrentRound(3);
        setGameState('reinvesting');
      } else {
        endGame();
      }
    } else {
      // Continue growing
      if (currentRound === 2) {
        setCurrentRound(3);
        setGameState('planting');
      } else {
        endGame();
      }
    }
  };

  const endGame = () => {
    setGameState('finalHarvest');
    
    // Final harvest
    const finalCropValue = gardenPlots.reduce((sum, plot) => sum + plot.currentValue, 0);
    const finalCash = currentCash + finalCropValue;
    const finalProfit = finalCash - startingMoney;
    
    // Find best performing crop
    let bestPerformer = null;
    let bestReturn = -Infinity;
    
    gardenPlots.forEach(plot => {
      if (plot.crop && plot.currentValue > bestReturn) {
        bestReturn = plot.currentValue;
        bestPerformer = plot.crop;
      }
    });
    
    // Calculate rank
    let rank = '';
    if (finalProfit < 2000) rank = 'Beginner Farmer';
    else if (finalProfit < 5000) rank = 'Smart Gardener';
    else if (finalProfit < 8000) rank = 'Expert Farmer';
    else rank = 'Master Gardener';
    
    setBestCrop(bestPerformer);
    setTotalWealth(finalCash);
    setProfit(finalProfit);
    setPlayerRank(rank);
    
    // Calculate score
    const baseScore = Math.floor(finalProfit / 10);
    const profitBonus = finalProfit > 0 ? 50 : 0;
    const diversificationBonus = new Set(gardenPlots.map(p => p.crop?.id)).size > 1 ? 30 : 0;
    const rankBonus = rank === 'Master Gardener' ? 100 : rank === 'Expert Farmer' ? 50 : 0;
    const finalScore = Math.max(0, baseScore + profitBonus + diversificationBonus + rankBonus);
    
    setScore(finalScore);
    setCurrentXP(prev => prev + finalScore);
    setCoins(prev => prev + Math.floor(finalProfit / 100));
    
    // Call real-time XP update
    if (onRealtimeUpdate) {
      onRealtimeUpdate({
        type: 'realtime',
        xpChange: finalScore,
        coinChange: Math.floor(finalProfit / 100)
      });
    }
    
    // Show achievement
    if (finalProfit > 0) {
      setShowConfetti(true);
      setAchievement({
        type: 'success',
        icon: rank === 'Master Gardener' ? '👑' : '🌱',
        title: `${rank}!`,
        description: `You earned ₹${finalProfit.toLocaleString()} profit!`,
        autoDismissMs: 3000
      });
    }
    
    setTimeout(() => {
      setGameState('gameOver');
      setShowConfetti(false);
    }, 3000);
  };

  const calculateRewards = () => {
    const badges = [];
    
    if (profit > 8000) badges.push({ icon: '👑', name: 'Master Gardener' });
    else if (profit > 5000) badges.push({ icon: '🏆', name: 'Expert Farmer' });
    else if (profit > 2000) badges.push({ icon: '🎯', name: 'Smart Gardener' });
    else if (profit > 0) badges.push({ icon: '🌱', name: 'Green Thumb' });
    
    if (new Set(gardenPlots.map(p => p.crop?.id)).size > 1) badges.push({ icon: '🔄', name: 'Diversified Farmer' });
    
    return { 
      xp: currentXP, 
      coins: coins, 
      badges,
      score,
      profit,
      totalWealth,
      bestCrop,
      playerRank
    };
  };

  const restartGame = () => {
    setGameState('ready');
    setCurrentCash(startingMoney);
    setGardenPlots([
      { id: 1, crop: null, invested: 0, currentValue: 0, growthStage: 0, rounds: 0 },
      { id: 2, crop: null, invested: 0, currentValue: 0, growthStage: 0, rounds: 0 },
      { id: 3, crop: null, invested: 0, currentValue: 0, growthStage: 0, rounds: 0 }
    ]);
    setCurrentRound(1);
    setTotalWealth(startingMoney);
    setProfit(0);
    setScore(0);
    setBestCrop(null);
    setPlayerRank('');
    setHarvestDecision(null);
  };

  if (gameState === 'intro') {
    return (
      <GameModuleLayout
        title="Investment Garden"
        level={LEVEL}
        score={score}
        currentXP={currentXP}
        maxXP={800}
        nextLevelXP={800}
        coins={coins}
        onBack={onBack}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-3xl p-12 shadow-2xl border-2 border-amber-600/30">
            <div className="text-center">
              <div className="text-8xl mb-8 animate-pulse">🌱</div>
              <h1 className="text-5xl font-black text-amber-300 mb-8">Welcome to Investment Garden</h1>
              
              <div className="space-y-6 text-xl text-amber-100 max-w-2xl mx-auto">
                <p className="leading-relaxed">
                  Your money is like seeds.
                </p>
                <p className="leading-relaxed">
                  Plant them wisely.
                </p>
                <p className="leading-relaxed">
                  Good weather helps your investments grow.
                </p>
                <p className="leading-relaxed">
                  Bad events can damage them.
                </p>
                <p className="leading-relaxed font-bold text-amber-200">
                  Choose when to harvest to earn profit.
                </p>
              </div>
              
              <div className="mt-12">
                <button
                  onClick={() => setGameState('ready')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  🌱 Start Garden
                </button>
              </div>
            </div>
          </div>
        </div>
      </GameModuleLayout>
    );
  }

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
        title="Investment Garden"
        level={LEVEL}
        score={score}
        currentXP={currentXP}
        maxXP={800}
        nextLevelXP={800}
        coins={coins}
        onBack={onBack}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl border-2 border-amber-600/30">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6">🌱</div>
              <h1 className="text-4xl font-black text-amber-300 mb-4">Investment Garden</h1>
              <p className="text-xl text-amber-100 mb-6">Grow your wealth through smart investments!</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-700 rounded-xl p-6">
                <h3 className="text-amber-300 font-bold mb-4 text-lg">🎯 How to Play:</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Start with ₹10,000 cash</li>
                  <li>• 3 garden plots for crops</li>
                  <li>• 5 rounds of growth (seasons)</li>
                  <li>• Keep cash or invest strategically</li>
                  <li>• Market events affect crop growth</li>
                  <li>• Decide when to harvest or keep growing</li>
                </ul>
              </div>
              
              <div className="bg-slate-700 rounded-xl p-6">
                <h3 className="text-amber-300 font-bold mb-4 text-lg">� Crop Types:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>�</span>
                    <div>
                      <div className="text-yellow-300 font-semibold">Sunflower</div>
                      <div className="text-gray-400 text-xs">Low Risk, ₹2000 → ₹2400</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>�</span>
                    <div>
                      <div className="text-red-300 font-semibold">Strawberry</div>
                      <div className="text-gray-400 text-xs">Medium Risk, ₹3000 → ₹4200</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🥭</span>
                    <div>
                      <div className="text-green-300 font-semibold">Mango Tree</div>
                      <div className="text-gray-400 text-xs">High Risk, ₹5000 → ₹9000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-700 rounded-xl p-6 mb-8">
              <h3 className="text-amber-300 font-bold mb-4 text-lg">📈 Growth Stages:</h3>
              <div className="flex justify-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-3xl mb-1">�</div>
                  <div className="text-gray-400">Seed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">🌿</div>
                  <div className="text-gray-400">Sprout</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">🌻</div>
                  <div className="text-gray-400">Growing</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">🍓</div>
                  <div className="text-gray-400">Fruit</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">🧺</div>
                  <div className="text-gray-400">Harvest</div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                🌱 Start Planting
              </button>
            </div>
          </div>
        </div>
      </GameModuleLayout>
    );
  }

  return (
    <GameModuleLayout
      title="Investment Garden"
      level={LEVEL}
      score={score}
      currentXP={currentXP}
      maxXP={800}
      nextLevelXP={800}
      coins={coins}
      onBack={onBack}
    >
      <div className="max-w-6xl mx-auto">
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

        {/* Game Stats */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6 shadow-2xl border-2 border-amber-600/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-gray-400 text-sm">Round</div>
              <div className="text-amber-300 font-bold text-lg">{currentRound}/{TOTAL_ROUNDS}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Cash</div>
              <div className="text-amber-300 font-bold text-lg">₹{currentCash.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Total Wealth</div>
              <div className="text-amber-300 font-bold text-lg">₹{totalWealth.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Profit/Loss</div>
              <div className={`font-bold text-lg ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profit >= 0 ? '+' : ''}₹{profit.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Garden Plots */}
        <div className="bg-slate-800 rounded-2xl p-8 mb-6 shadow-2xl border-2 border-amber-600/30">
          <h3 className="text-2xl font-bold text-amber-300 mb-6 text-center">
            {gameState === 'planting' || gameState === 'reinvesting' ? 'Your Garden - Plant Crops' : 'Your Garden'}
          </h3>
          <div className="grid grid-cols-3 gap-6">
            {gardenPlots.map(plot => (
              <div
                key={plot.id}
                onClick={() => selectPlot(plot.id)}
                className={`relative bg-gradient-to-br from-amber-700 to-amber-800 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105
                  ${selectedPlot === plot.id ? 'ring-4 ring-amber-400 scale-105' : ''}
                  ${plot.crop ? 'opacity-100' : 'opacity-70'}`}
              >
                {plot.crop ? (
                  <div className="text-center">
                    <div className={`text-6xl mb-2 ${plot.growthStage > 0 ? 'animate-pulse' : ''}`}>
                      {GROWTH_STAGES[plot.growthStage]}
                    </div>
                    <div className="text-amber-100 font-bold text-sm mb-1">
                      {plot.crop.name}
                    </div>
                    <div className="text-xs text-amber-200/80 mb-2">
                      {plot.crop.risk} Risk
                    </div>
                    <div className={`text-sm font-bold ${plot.currentValue >= plot.invested ? 'text-green-400' : 'text-red-400'}`}>
                      ₹{plot.currentValue.toLocaleString()}
                    </div>
                    <div className="text-amber-300 text-xs mt-1">
                      Round {plot.rounds}/5
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-2 opacity-50">🌱</div>
                    <div className="text-amber-200/70 text-sm">Empty Plot</div>
                    {(gameState === 'planting' || gameState === 'reinvesting') && (
                      <div className="text-amber-300 text-xs mt-2">Click to plant</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Crop Selection */}
        {(gameState === 'planting' || gameState === 'reinvesting') && selectedPlot && (
          <div className="bg-slate-800 rounded-2xl p-6 mb-6 shadow-2xl border-2 border-amber-600/30">
            <h3 className="text-xl font-bold text-amber-300 mb-4">Choose Crop for Plot {selectedPlot}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CROP_TYPES.map(crop => (
                <button
                  key={crop.id}
                  onClick={() => plantCrop(crop)}
                  disabled={currentCash < crop.cost}
                  className={`bg-gradient-to-r ${crop.color} text-white p-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="text-3xl mb-2">{crop.icon}</div>
                  <div className="text-sm">{crop.name}</div>
                  <div className="text-xs opacity-90">{crop.risk} Risk</div>
                  <div className="text-xs opacity-90 mt-1">Cost: ₹{crop.cost.toLocaleString()}</div>
                  <div className="text-xs opacity-90">Return: ₹{crop.baseReturn.toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Market Event */}
        {gameState === 'growing' && marketEvent && (
          <div className="bg-slate-800 rounded-2xl p-6 mb-6 shadow-2xl border-2 border-amber-600/30 animate-bounce">
            <div className="text-center">
              <div className="text-4xl mb-4">{marketEvent.name}</div>
              <div className="text-amber-300 font-bold text-lg mb-2">{marketEvent.description}</div>
              <div className="text-gray-300">{marketEvent.effect}</div>
            </div>
          </div>
        )}

        {/* Growing Animation */}
        {gameState === 'growing' && !marketEvent && (
          <div className="bg-slate-800 rounded-2xl p-8 mb-6 shadow-2xl border-2 border-amber-600/30">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-spin">🌱</div>
              <div className="text-amber-300 font-bold text-xl">Your crops are growing...</div>
            </div>
          </div>
        )}

        {/* Harvest Decision */}
        {gameState === 'harvestDecision' && (
          <div className="bg-slate-800 rounded-2xl p-8 mb-6 shadow-2xl border-2 border-amber-600/30">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-amber-300 mb-6">Harvest Decision - Round {currentRound}</h3>
              <div className="mb-6">
                <div className="text-amber-200 mb-4">Current crops are worth:</div>
                <div className="text-3xl font-bold text-green-400">
                  ₹{gardenPlots.reduce((sum, plot) => sum + plot.currentValue, 0).toLocaleString()}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => makeHarvestDecision('harvest')}
                  className="bg-green-600 text-white p-6 rounded-xl font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105"
                >
                  🧺 Harvest Now
                  <div className="text-sm opacity-90 mt-2">Take profits and reinvest</div>
                </button>
                <button
                  onClick={() => makeHarvestDecision('continue')}
                  className="bg-blue-600 text-white p-6 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                >
                  🌱 Keep Growing
                  <div className="text-sm opacity-90 mt-2">Risk bigger returns</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Final Harvest */}
        {gameState === 'finalHarvest' && (
          <div className="bg-slate-800 rounded-2xl p-8 mb-6 shadow-2xl border-2 border-amber-600/30">
            <div className="text-center">
              <div className="text-6xl mb-4">🧺</div>
              <div className="text-amber-300 font-bold text-xl mb-2">Final Harvest!</div>
              <div className="text-gray-300">Calculating your garden's total value...</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(gameState === 'planting' || gameState === 'reinvesting') && !selectedPlot && (
          <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl border-2 border-amber-600/30">
            <div className="text-center">
              <div className="text-amber-300 font-bold mb-4">
                {gameState === 'reinvesting' ? 'Reinvestment Phase' : 'Planting Phase'}
              </div>
              <div className="text-amber-200/80 mb-4">
                You have ₹{currentCash.toLocaleString()} available to invest
              </div>
              <button
                onClick={startGrowth}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                Continue to Growth Phase →
              </button>
            </div>
          </div>
        )}
      </div>
    </GameModuleLayout>
  );
};

export default InvestmentGarden;
