import { useState, useEffect } from 'react';
import GameModuleLayout from '../../shared/GameModuleLayout';

/**
 * Candlestick Master - Advanced Level Game
 * 
 * Learn to read stock market candlestick patterns and predict price movements
 */
const CandlestickMaster = ({ onComplete, onBack, playerProgress, onRealtimeUpdate }) => {
  const [gameState, setGameState] = useState('intro'); // intro, learning, rules, playing, completed
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [currentPattern, setCurrentPattern] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState('');
  
  // Trading simulation states
  const [portfolio, setPortfolio] = useState(10000);
  const [streak, setStreak] = useState(0);
  const [showProfitUpdate, setShowProfitUpdate] = useState(false);
  const [profitAmount, setProfitAmount] = useState(0);
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [marketNews, setMarketNews] = useState('');
  const [showMarketNews, setShowMarketNews] = useState(false);
  
  // Animation states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showNextCandle, setShowNextCandle] = useState(false);
  const [nextCandleType, setNextCandleType] = useState('green');
  const [showLearningTip, setShowLearningTip] = useState(false);

  const TOTAL_ROUNDS = 10;

  // Candlestick patterns data
  const candlestickPatterns = [
    {
      id: 1,
      name: "Hammer",
      type: "bullish",
      description: "A hammer appears after a price drop. It shows that buyers are entering the market.",
      signal: "Bullish",
      explanation: "Hammer pattern signals bullish reversal as buyers step in after price decline."
    },
    {
      id: 2,
      name: "Shooting Star",
      type: "bearish", 
      description: "Appears after prices rise. Shows sellers pushing price down from highs.",
      signal: "Bearish",
      explanation: "Shooting star indicates bearish reversal as sellers take control at highs."
    },
    {
      id: 3,
      name: "Bullish Engulfing",
      type: "bullish",
      description: "A large green candle completely covers the previous red candle.",
      signal: "Bullish", 
      explanation: "Bullish engulfing shows strong buying momentum overpowering sellers."
    },
    {
      id: 4,
      name: "Bearish Engulfing",
      type: "bearish",
      description: "A large red candle completely covers the previous green candle.",
      signal: "Bearish",
      explanation: "Bearish engulfing indicates strong selling pressure taking over buyers."
    },
    {
      id: 5,
      name: "Doji",
      type: "neutral",
      description: "Open and close prices are almost the same. Shows market indecision.",
      signal: "Neutral",
      explanation: "Doji represents market uncertainty between buyers and sellers."
    }
  ];

  // Generate trading game rounds with proper scenarios
  const generateGameRounds = () => {
    const rounds = [
      {
        round: 1,
        pattern: "Hammer",
        context: "downtrend",
        marketResult: "UP",
        news: "Market finds support at key levels"
      },
      {
        round: 2,
        pattern: "Shooting Star",
        context: "uptrend",
        marketResult: "DOWN",
        news: "Resistance levels hold strong"
      },
      {
        round: 3,
        pattern: "Bullish Engulfing",
        context: "downtrend",
        marketResult: "UP",
        news: "Buyers step in with strong momentum"
      },
      {
        round: 4,
        pattern: "Bearish Engulfing",
        context: "uptrend",
        marketResult: "DOWN",
        news: "Sellers take control of the market"
      },
      {
        round: 5,
        pattern: "Doji",
        context: "sideways",
        marketResult: "NEUTRAL",
        news: "Market uncertainty dominates trading"
      },
      {
        round: 6,
        pattern: "Hammer",
        context: "downtrend",
        marketResult: "UP",
        news: "Technical indicators show reversal potential"
      },
      {
        round: 7,
        pattern: "Shooting Star",
        context: "uptrend",
        marketResult: "DOWN",
        news: "Profit taking pushes prices lower"
      },
      {
        round: 8,
        pattern: "Bullish Engulfing",
        context: "downtrend",
        marketResult: "UP",
        news: "Institutional buying detected"
      },
      {
        round: 9,
        pattern: "Bearish Engulfing",
        context: "uptrend",
        marketResult: "DOWN",
        news: "Market sentiment turns bearish"
      },
      {
        round: 10,
        pattern: "Doji",
        context: "sideways",
        marketResult: "NEUTRAL",
        news: "Market awaits next catalyst"
      }
    ];

    return rounds;
  };

  const [gameRounds] = useState(generateGameRounds());

  // Start game
  const startGame = () => {
    setGameState('playing');
    setCurrentRound(1);
    setScore(0);
    setCorrectAnswers(0);
    setPortfolio(10000);
    setStreak(0);
    setCurrentPattern(gameRounds[0]);
    setShowMarketNews(gameRounds[0].round % 3 === 1); // Show news for rounds 1, 4, 7, 10
    setMarketNews(gameRounds[0].round % 3 === 1 ? gameRounds[0].news : '');
  };

  // Handle trading decision with suspense animation
  const handleAnswer = (decision) => {
    setSelectedAnswer(decision);
    setIsAnalyzing(true); // Start suspense phase

    // Determine the next candle type based on market result
    const candleType = currentPattern.marketResult === 'UP' ? 'green' : 
                      currentPattern.marketResult === 'DOWN' ? 'red' : 'gray';
    setNextCandleType(candleType);

    // Start suspense animation (1.2 seconds)
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowNextCandle(true); // Start candle reveal animation
      
      // After candle animation (900ms), show result and update portfolio
      setTimeout(() => {
        // Calculate profit/loss based on decision and market result
        let profit = 0;
        let isCorrect = false;

        if (decision === 'Buy' && currentPattern.marketResult === 'UP') {
          profit = 700;
          isCorrect = true;
        } else if (decision === 'Sell' && currentPattern.marketResult === 'DOWN') {
          profit = 700;
          isCorrect = true;
        } else if (decision === 'Wait' && currentPattern.marketResult === 'NEUTRAL') {
          profit = 300;
          isCorrect = true;
        } else if (decision === 'Wait') {
          profit = 100; // Small reward for waiting
          isCorrect = false;
        } else {
          profit = -400; // Loss for wrong trade
          isCorrect = false;
        }

        // Update portfolio
        setPortfolio(prev => prev + profit);
        setProfitAmount(profit);
        setShowProfitUpdate(true);

        // Update streak
        if (isCorrect) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          
          // Check for streak bonus
          if (newStreak >= 3) {
            setShowStreakBonus(true);
            setScore(prev => prev + 20); // Streak bonus
            
            // Real-time XP update for streak bonus
            if (onRealtimeUpdate) {
              onRealtimeUpdate({
                type: 'realtime',
                xpChange: 20,
                coinChange: 10
              });
            }
          }
          
          setCorrectAnswers(prev => prev + 1);
          setScore(prev => prev + 10);
          
          // Real-time XP update for correct trade
          if (onRealtimeUpdate) {
            onRealtimeUpdate({
              type: 'realtime',
              xpChange: 10,
              coinChange: 5
            });
          }
        } else {
          setStreak(0); // Reset streak on wrong decision
        }

        // Set explanation and show result
        const pattern = candlestickPatterns.find(p => p.name === currentPattern.pattern);
        setCurrentExplanation(pattern.explanation);
        setShowResult(true);
        setShowExplanation(true);
        setShowLearningTip(true);
      }, 900);
    }, 1200);
  };

  // Next round
  const nextRound = () => {
    setShowResult(false);
    setShowExplanation(false);
    setShowLearningTip(false);
    setShowProfitUpdate(false);
    setShowStreakBonus(false);
    setSelectedAnswer(null);
    setCurrentExplanation('');
    setIsAnalyzing(false);
    setShowNextCandle(false);
    setNextCandleType('green');

    if (currentRound >= TOTAL_ROUNDS) {
      endGame();
    } else {
      const nextRoundIndex = currentRound;
      setCurrentRound(prev => prev + 1);
      const nextPattern = gameRounds[nextRoundIndex];
      setCurrentPattern(nextPattern);
      
      // Show market news for certain rounds
      const shouldShowNews = nextPattern.round % 3 === 1;
      setShowMarketNews(shouldShowNews);
      setMarketNews(shouldShowNews ? nextPattern.news : '');
    }
  };

  // End game
  const endGame = () => {
    setGameState('completed');
  };

  // Get trader title based on performance
  const getTraderTitle = () => {
    const accuracy = (correctAnswers / TOTAL_ROUNDS) * 100;
    if (accuracy >= 90) return { title: "Candlestick Master", color: "text-green-400", icon: "🏆" };
    if (accuracy >= 70) return { title: "Chart Reader", color: "text-blue-400", icon: "📊" };
    if (accuracy >= 50) return { title: "Market Explorer", color: "text-yellow-400", icon: "📈" };
    return { title: "Beginner Trader", color: "text-red-400", icon: "📚" };
  };

  // Get accuracy
  const getAccuracy = () => {
    return Math.round((correctAnswers / TOTAL_ROUNDS) * 100);
  };

  // Render candlestick component
  const renderCandlestick = (type, isHighlighted = false) => {
    const colors = {
      green: 'bg-green-500',
      red: 'bg-red-500',
      gray: 'bg-gray-400',
      wick: 'bg-gray-400'
    };

    return (
      <div className={`flex flex-col items-center ${isHighlighted ? 'scale-110' : ''} transition-transform duration-300`}>
        {/* Top wick */}
        <div className={`w-1 h-4 ${colors.wick}`}></div>
        
        {/* Candle body */}
        {type === 'green' && (
          <div className={`w-8 h-12 ${colors.green} relative`}>
            <div className={`absolute -top-2 w-1 h-2 ${colors.wick}`}></div>
          </div>
        )}
        
        {type === 'red' && (
          <div className={`w-8 h-12 ${colors.red} relative`}>
            <div className={`absolute -bottom-2 w-1 h-2 ${colors.wick}`}></div>
          </div>
        )}

        {type === 'gray' && (
          <div className={`w-8 h-12 ${colors.gray} relative`}>
            <div className={`absolute -top-2 w-1 h-2 ${colors.wick}`}></div>
            <div className={`absolute -bottom-2 w-1 h-2 ${colors.wick}`}></div>
          </div>
        )}
        
        {/* Bottom wick */}
        <div className={`w-1 h-4 ${colors.wick}`}></div>
      </div>
    );
  };

  // Render animated candlestick for reveal
  const renderAnimatedCandlestick = (type) => {
    const colors = {
      green: 'bg-green-500',
      red: 'bg-red-500',
      gray: 'bg-gray-400',
      wick: 'bg-gray-400'
    };

    return (
      <div className="flex flex-col items-center">
        {/* Top wick with animation */}
        <div 
          className={`w-1 bg-gray-400 transition-all duration-1000 ease-out`}
          style={{ height: showNextCandle ? '16px' : '0px' }}
        ></div>
        
        {/* Candle body with grow animation */}
        <div 
          className={`relative transition-all duration-1000 ease-out`}
          style={{ 
            width: showNextCandle ? '32px' : '0px',
            height: showNextCandle ? '48px' : '0px'
          }}
        >
          <div className={`w-full h-full ${colors[type]}`}></div>
          {type === 'green' && (
            <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-2 ${colors.wick} transition-opacity duration-1000`} 
                 style={{ opacity: showNextCandle ? 1 : 0 }}></div>
          )}
          {type === 'red' && (
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-2 ${colors.wick} transition-opacity duration-1000`} 
                 style={{ opacity: showNextCandle ? 1 : 0 }}></div>
          )}
          {type === 'gray' && (
            <>
              <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-2 ${colors.wick} transition-opacity duration-1000`} 
                   style={{ opacity: showNextCandle ? 1 : 0 }}></div>
              <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-2 ${colors.wick} transition-opacity duration-1000`} 
                   style={{ opacity: showNextCandle ? 1 : 0 }}></div>
            </>
          )}
        </div>
        
        {/* Bottom wick with animation */}
        <div 
          className={`w-1 bg-gray-400 transition-all duration-1000 ease-out`}
          style={{ height: showNextCandle ? '16px' : '0px' }}
        ></div>
      </div>
    );
  };

  // Render pattern chart
  const renderPatternChart = (patternName, context) => {
    switch (patternName) {
      case "Hammer":
        return (
          <div className="flex items-center space-x-2">
            {renderCandlestick('red')}
            {renderCandlestick('red')}
            <div className="scale-125">
              {renderCandlestick('green', true)}
            </div>
          </div>
        );
      
      case "Shooting Star":
        return (
          <div className="flex items-center space-x-2">
            {renderCandlestick('green')}
            {renderCandlestick('green')}
            <div className="scale-125">
              <div className="flex flex-col items-center">
                <div className="w-1 h-8 bg-gray-400"></div>
                <div className="w-8 h-4 bg-red-500"></div>
                <div className="w-1 h-4 bg-gray-400"></div>
              </div>
            </div>
          </div>
        );
      
      case "Bullish Engulfing":
        return (
          <div className="flex items-center space-x-2">
            {renderCandlestick('red')}
            <div className="scale-125">
              {renderCandlestick('green', true)}
            </div>
          </div>
        );
      
      case "Bearish Engulfing":
        return (
          <div className="flex items-center space-x-2">
            {renderCandlestick('green')}
            <div className="scale-125">
              {renderCandlestick('red', true)}
            </div>
          </div>
        );
      
      case "Doji":
        return (
          <div className="flex items-center space-x-2">
            {renderCandlestick('green')}
            <div className="scale-125">
              <div className="flex flex-col items-center">
                <div className="w-1 h-6 bg-gray-400"></div>
                <div className="w-8 h-1 bg-gray-400"></div>
                <div className="w-1 h-6 bg-gray-400"></div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Pattern not available</div>;
    }
  };

  // Intro screen
  if (gameState === 'intro') {
    return (
      <GameModuleLayout 
        title="Candlestick Master" 
        level={playerProgress?.level || 1} 
        currentXP={playerProgress?.xp || 0} 
        maxXP={(playerProgress?.level || 1) * 100} 
        coins={playerProgress?.coins || 0} 
        streak={playerProgress?.streaks?.current || 0}
        onBack={onBack}
      >
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-amber-300 mb-4">Candlestick Master</h1>
              <div className="text-6xl mb-6">📊</div>
            </div>

            <div className="bg-slate-700/50 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-amber-300 mb-4">Learn Stock Chart Patterns</h2>
              <p className="text-amber-100 mb-4">Learn how traders read stock charts using candlestick patterns.</p>
              <p className="text-amber-100 font-bold">Predict whether price will go UP or DOWN based on pattern!</p>
            </div>

            {/* Simple candlestick diagram */}
            <div className="bg-slate-700/50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-amber-300 mb-4 text-center">What is a Candlestick?</h3>
              <div className="flex justify-center items-center space-x-8 mb-6">
                <div className="text-center">
                  {renderCandlestick('green')}
                  <p className="text-amber-100 mt-2">Bullish</p>
                </div>
                <div className="text-center">
                  {renderCandlestick('red')}
                  <p className="text-amber-100 mt-2">Bearish</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-amber-100 text-sm">
                <div className="text-center">
                  <p className="font-bold">Open Price</p>
                  <p>Starting price</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">Close Price</p>
                  <p>Ending price</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">High Price</p>
                  <p>Highest point</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">Low Price</p>
                  <p>Lowest point</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setGameState('learning')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
              >
                Learn Patterns
              </button>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </GameModuleLayout>
    );
  }

  // Learning guide screen
  if (gameState === 'learning') {
    return (
      <GameModuleLayout 
        title="Candlestick Patterns" 
        level={playerProgress?.level || 1} 
        currentXP={playerProgress?.xp || 0} 
        maxXP={(playerProgress?.level || 1) * 100} 
        coins={playerProgress?.coins || 0} 
        streak={playerProgress?.streaks?.current || 0}
        onBack={onBack}
      >
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20">
            <h2 className="text-3xl font-bold text-amber-300 mb-8 text-center">Important Candlestick Patterns</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {candlestickPatterns.map((pattern) => (
                <div key={pattern.id} className="bg-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-amber-300 mb-3">{pattern.name}</h3>
                  
                  <div className="flex justify-center mb-4">
                    {renderPatternChart(pattern.name)}
                  </div>
                  
                  <p className="text-amber-100 text-sm mb-3">{pattern.description}</p>
                  
                  <div className={`text-center font-bold ${
                    pattern.type === 'bullish' ? 'text-green-400' : 
                    pattern.type === 'bearish' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    Signal: {pattern.signal}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setGameState('rules')}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
              >
                Continue to Rules
              </button>
            </div>
          </div>
        </div>
      </GameModuleLayout>
    );
  }

  // Game rules screen
  if (gameState === 'rules') {
    return (
      <GameModuleLayout 
        title="How to Play" 
        level={playerProgress?.level || 1} 
        currentXP={playerProgress?.xp || 0} 
        maxXP={(playerProgress?.level || 1) * 100} 
        coins={playerProgress?.coins || 0} 
        streak={playerProgress?.streaks?.current || 0}
        onBack={onBack}
      >
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20">
            <h2 className="text-3xl font-bold text-amber-300 mb-8 text-center">Game Rules</h2>
            
            <div className="bg-slate-700/50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">How to Play</h3>
              <p className="text-amber-100 mb-4">You will see a candlestick chart pattern.</p>
              <p className="text-amber-100 font-bold">Your task is to predict what will happen next!</p>
            </div>

            <div className="bg-slate-700/50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">Your Options</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-amber-100">Price will go UP</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-amber-100">Price will go DOWN</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-amber-100">Market will stay NEUTRAL</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">Scoring</h3>
              <p className="text-amber-100 mb-2">✅ Correct answer = +10 XP</p>
              <p className="text-amber-100">❌ Wrong answer = Explanation will appear</p>
            </div>

            <div className="bg-slate-700/50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-amber-300 mb-4">Game Details</h3>
              <p className="text-amber-100">The game has {TOTAL_ROUNDS} rounds.</p>
              <p className="text-amber-100 font-bold">Try to get the highest score!</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={startGame}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
              >
                Start Challenge
              </button>
            </div>
          </div>
        </div>
      </GameModuleLayout>
    );
  }

  // Game completed screen
  if (gameState === 'completed') {
    const traderTitle = getTraderTitle();
    const accuracy = getAccuracy();
    const totalXP = score;

    return (
      <GameModuleLayout 
        title="Candlestick Master - Results" 
        level={playerProgress?.level || 1} 
        currentXP={playerProgress?.xp || 0} 
        maxXP={(playerProgress?.level || 1) * 100} 
        coins={playerProgress?.coins || 0} 
        streak={playerProgress?.streaks?.current || 0}
        onBack={onBack}
      >
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20">
            <div className="text-center mb-8">
              <h2 className={`text-4xl font-bold mb-4 ${traderTitle.color}`}>
                {traderTitle.title}
              </h2>
              <div className="text-6xl mb-4">{traderTitle.icon}</div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-amber-300 text-sm mb-2">Final Portfolio</p>
                <p className="text-3xl font-bold text-amber-100">₹{portfolio.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-amber-300 text-sm mb-2">Accuracy</p>
                <p className="text-3xl font-bold text-amber-100">{accuracy}%</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-amber-300 text-sm mb-2">Correct Trades</p>
                <p className="text-3xl font-bold text-amber-100">{correctAnswers}/{TOTAL_ROUNDS}</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-amber-300 text-sm mb-2">Trader Title</p>
                <p className="text-3xl font-bold text-amber-100">{traderTitle.title}</p>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">Trading Experience:</h3>
              <ul className="text-amber-100 space-y-2">
                <li>• Learned to identify key candlestick patterns</li>
                <li>• Made trading decisions based on technical analysis</li>
                <li>• Managed portfolio through market volatility</li>
                <li>• Built streak bonuses with consistent performance</li>
                <li>• Understood market psychology and sentiment</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onComplete({
                  type: 'trading',
                  score: totalXP,
                  perfect: accuracy >= 90,
                  xp: totalXP,
                  coins: Math.floor(totalXP / 2)
                })}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
              >
                Complete Game
              </button>
              <button
                onClick={() => {
                  setGameState('intro');
                }}
                className="px-8 py-3 bg-slate-700 text-amber-200 rounded-xl font-bold hover:bg-slate-600 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="px-8 py-3 bg-slate-700 text-amber-200 rounded-xl font-bold hover:bg-slate-600 transition-colors"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      </GameModuleLayout>
    );
  }

  // Main game screen
  return (
    <GameModuleLayout 
      title="Candlestick Master" 
      level={playerProgress?.level || 1} 
      currentXP={playerProgress?.xp || 0} 
      maxXP={(playerProgress?.level || 1) * 100} 
      coins={playerProgress?.coins || 0} 
      streak={playerProgress?.streaks?.current || 0}
      onBack={onBack}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Trading dashboard */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="text-amber-300">
              <span className="font-bold">Round {currentRound} / {TOTAL_ROUNDS}</span>
            </div>
            <div className="text-amber-300">
              <span className="font-bold">Portfolio: ₹{portfolio.toLocaleString()}</span>
            </div>
            <div className="text-amber-300">
              <span className="font-bold">Streak: {streak > 0 ? `🔥 ${streak}` : '0'}</span>
            </div>
          </div>
        </div>

        {/* Market News Card */}
        {showMarketNews && (
          <div className="bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl p-4 mb-6 border border-blue-500/30">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📰</div>
              <div>
                <p className="text-blue-300 font-bold">Market News</p>
                <p className="text-blue-100">{marketNews}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pattern display */}
        {currentPattern && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-amber-300 mb-4">Identify the Pattern</h2>
              <p className="text-amber-100 mb-2">Context: {currentPattern.context}</p>
              <p className="text-amber-100">What will happen next?</p>
            </div>

            {/* Chart display with next candle */}
            <div className="bg-slate-700/50 rounded-2xl p-8 mb-8 flex justify-center items-center">
              <div className="flex items-center space-x-2">
                {renderPatternChart(currentPattern.pattern, currentPattern.context)}
                
                {/* Animated next candle */}
                {(showNextCandle || isAnalyzing) && (
                  <div className="ml-4 pl-4 border-l-2 border-gray-600">
                    {renderAnimatedCandlestick(nextCandleType)}
                  </div>
                )}
              </div>
            </div>

            {/* Suspense animation */}
            {isAnalyzing && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 text-amber-300">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-300 border-t-transparent"></div>
                  <span className="text-lg font-medium">Analyzing market movement...</span>
                </div>
              </div>
            )}

            {/* Trading decision buttons */}
            {!showResult && !isAnalyzing && (
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleAnswer('Buy')}
                  disabled={selectedAnswer !== null}
                  className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-2xl mb-2">📈</div>
                  Buy
                </button>
                <button
                  onClick={() => handleAnswer('Sell')}
                  disabled={selectedAnswer !== null}
                  className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-2xl mb-2">📉</div>
                  Sell
                </button>
                <button
                  onClick={() => handleAnswer('Wait')}
                  disabled={selectedAnswer !== null}
                  className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-2xl mb-2">⏳</div>
                  Wait
                </button>
              </div>
            )}
          </div>
        )}

        {/* Trading result popup */}
        {showResult && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20 mb-6 animate-fadeIn">
            <div className="text-center">
              {/* Profit/Loss update */}
              {showProfitUpdate && (
                <div className={`text-2xl font-bold mb-4 ${profitAmount > 0 ? 'text-green-400' : 'text-red-400'} animate-bounce`}>
                  {profitAmount > 0 ? `+₹${profitAmount} Profit` : `₹${Math.abs(profitAmount)} Loss`}
                </div>
              )}

              {/* Portfolio update */}
              {showProfitUpdate && (
                <div className="text-amber-300 mb-4">
                  New Balance: ₹{portfolio.toLocaleString()}
                </div>
              )}

              {/* Streak bonus */}
              {showStreakBonus && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 mb-4 animate-pulse">
                  <p className="text-white font-bold text-lg">🔥 Pattern Streak!</p>
                  <p className="text-white">+20 XP Bonus</p>
                </div>
              )}
              
              {/* Result message */}
              <div className={`text-4xl mb-4 ${profitAmount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profitAmount > 0 ? '✅ Successful Trade!' : '❌ Trade Result'}
              </div>
              
              <h3 className="text-xl font-bold text-amber-300 mb-4">
                {currentPattern.pattern} Pattern
              </h3>
              
              <p className="text-amber-100 mb-6">
                Market moved {currentPattern.marketResult.toLowerCase()}
                {selectedAnswer === 'Buy' && currentPattern.marketResult === 'UP' && " - Your Buy trade was profitable!"}
                {selectedAnswer === 'Sell' && currentPattern.marketResult === 'DOWN' && " - Your Sell trade was profitable!"}
                {selectedAnswer === 'Wait' && " - You waited for market clarity."}
              </p>

              {/* Learning tip */}
              {showLearningTip && (
                <div className="bg-gradient-to-r from-blue-800/50 to-blue-700/50 rounded-xl p-6 mb-6 border border-blue-500/30">
                  <p className="text-blue-300 font-medium mb-2">💡 Tip:</p>
                  <p className="text-blue-100">
                    {currentPattern.pattern === 'Hammer' && "Hammer patterns often signal that buyers are stepping in after sellers pushed the price down. However, patterns are not guaranteed signals and should be used with other indicators."}
                    {currentPattern.pattern === 'Shooting Star' && "Shooting stars indicate bearish reversal as sellers take control at the high prices. Always confirm with additional technical analysis before making trading decisions."}
                    {currentPattern.pattern === 'Bullish Engulfing' && "Bullish engulfing shows strong buying momentum that completely overpowers previous selling pressure. This pattern often signals significant trend changes."}
                    {currentPattern.pattern === 'Bearish Engulfing' && "Bearish engulfing indicates strong selling pressure that completely overcomes previous buying momentum. Consider taking profits or setting stop-losses."}
                    {currentPattern.pattern === 'Doji' && "Doji represents market indecision where neither buyers nor sellers can gain control. This often precedes significant price movements in either direction."}
                  </p>
                </div>
              )}

              <button
                onClick={nextRound}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
              >
                {currentRound >= TOTAL_ROUNDS ? 'View Results' : 'Next Round'}
              </button>
            </div>
          </div>
        )}
      </div>
    </GameModuleLayout>
  );
};

export default CandlestickMaster;
