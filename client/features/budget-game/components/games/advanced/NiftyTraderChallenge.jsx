import { useState, useEffect, useCallback } from 'react';
import GameModuleLayout from '../../shared/GameModuleLayout';

/**
 * Nifty Trader Challenge - Advanced Level Game
 * 
 * Fast-paced stock market prediction game teaching economic news impact
 */
const NiftyTraderChallenge = ({ onComplete, onBack, playerProgress, onRealtimeUpdate }) => {
  const [gameState, setGameState] = useState('intro'); // intro, playing, completed
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctPredictions, setCorrectPredictions] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // Market news questions - 10 rounds
  const questions = [
    {
      id: 1,
      news: "RBI reduces interest rates to stimulate economic growth.",
      correctAnswer: "UP",
      explanation: "Lower interest rates reduce borrowing costs for companies and consumers. This increases investment and spending, which usually pushes stock markets upward."
    },
    {
      id: 2,
      news: "Global crude oil prices surge by 30%.",
      correctAnswer: "DOWN",
      explanation: "Higher oil prices increase production and transportation costs for companies. This reduces profits and usually causes stock markets to decline."
    },
    {
      id: 3,
      news: "India reports record GDP growth of 8.5%.",
      correctAnswer: "UP",
      explanation: "Strong economic growth increases investor confidence and corporate earnings. Stock markets typically react positively to strong GDP data."
    },
    {
      id: 4,
      news: "Inflation rises sharply above RBI targets.",
      correctAnswer: "DOWN",
      explanation: "High inflation reduces purchasing power and may force RBI to raise interest rates. Higher rates usually slow economic activity and hurt stock markets."
    },
    {
      id: 5,
      news: "Government announces massive infrastructure spending program.",
      correctAnswer: "UP",
      explanation: "Infrastructure spending boosts sectors like construction, cement, steel, and banking. Investors expect higher corporate profits."
    },
    {
      id: 6,
      news: "Major global recession fears spread across international markets.",
      correctAnswer: "DOWN",
      explanation: "Recession fears cause investors to sell stocks and move money into safer assets like gold or bonds."
    },
    {
      id: 7,
      news: "Foreign investors invest billions into Indian stock markets.",
      correctAnswer: "UP",
      explanation: "Foreign Institutional Investors (FIIs) buying large amounts of stocks increases market demand and pushes prices upward."
    },
    {
      id: 8,
      news: "A large banking crisis hits several global banks.",
      correctAnswer: "DOWN",
      explanation: "Banking crises reduce confidence in financial systems and often trigger stock market sell-offs."
    },
    {
      id: 9,
      news: "India announces breakthrough technology innovation attracting global tech investment.",
      correctAnswer: "UP",
      explanation: "Technological innovation increases investor optimism and future growth expectations."
    },
    {
      id: 10,
      news: "Government increases taxes on major corporations.",
      correctAnswer: "DOWN",
      explanation: "Higher corporate taxes reduce company profits, which negatively impacts stock valuations."
    }
  ];

  // Timer countdown
  useEffect(() => {
    if (timerActive && timer > 0) {
      const interval = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(interval);
    } else if (timerActive && timer === 0) {
      handleTimeout();
    }
  }, [timer, timerActive]);

  const handleTimeout = () => {
    if (!showResult && currentQuestion) {
      setShowResult(true);
      setTimerActive(false);
      
      // Call real-time XP update for timeout
      if (onRealtimeUpdate) {
        onRealtimeUpdate({
          type: 'realtime',
          xpChange: 0,
          coinChange: 0
        });
      }
    }
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentRound(1);
    setCurrentQuestion(questions[0]);
    setTimer(10);
    setTimerActive(true);
  };

  const handleAnswer = (answer) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    setTimerActive(false);
    setAnimating(true);
    
    setTimeout(() => {
      const isCorrect = answer === currentQuestion.correctAnswer;
      if (isCorrect) {
        setScore(score + 100);
        setCorrectPredictions(correctPredictions + 1);
      }
      
      setShowResult(true);
      setAnimating(false);
      
      // Call real-time XP update
      if (onRealtimeUpdate) {
        const xpChange = isCorrect ? 100 : 0;
        const coinChange = isCorrect ? 25 : 0;
        
        onRealtimeUpdate({
          type: 'realtime',
          xpChange: xpChange,
          coinChange: coinChange
        });
      }
    }, 500);
  };

  const nextRound = () => {
    if (currentRound < questions.length) {
      setCurrentRound(currentRound + 1);
      setCurrentQuestion(questions[currentRound]);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimer(10);
      setTimerActive(true);
    } else {
      // Game completed
      const completionBonus = 200;
      const totalXP = score + completionBonus;
      const perfect = correctPredictions === questions.length;
      
      if (onRealtimeUpdate) {
        onRealtimeUpdate({
          type: 'realtime',
          xpChange: completionBonus,
          coinChange: Math.floor(completionBonus / 4)
        });
      }
      
      setGameState('completed');
    }
  };

  const getTraderRank = () => {
    if (correctPredictions >= 8) return 'Market Master';
    if (correctPredictions >= 6) return 'Smart Trader';
    if (correctPredictions >= 4) return 'Skilled Trader';
    return 'Beginner Trader';
  };

  const getRankColor = () => {
    if (correctPredictions >= 8) return 'text-yellow-400';
    if (correctPredictions >= 6) return 'text-blue-400';
    if (correctPredictions >= 4) return 'text-green-400';
    return 'text-gray-400';
  };

  const getRankIcon = () => {
    if (correctPredictions >= 8) return '👑';
    if (correctPredictions >= 6) return '📈';
    if (correctPredictions >= 4) return '📊';
    return '📉';
  };

  // Intro screen
  if (gameState === 'intro') {
    return (
      <GameModuleLayout 
        title="Nifty Trader Challenge" 
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
              <h1 className="text-5xl font-bold text-amber-300 mb-4">Nifty Trader Challenge</h1>
              <div className="text-6xl mb-6">📈</div>
            </div>

            <div className="bg-slate-700/50 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-amber-300 mb-4">You are a stock market trader.</h2>
              <p className="text-amber-100 mb-4">Every round you will see breaking financial news.</p>
              <p className="text-amber-100 mb-4">Predict how Nifty market will react.</p>
              <p className="text-amber-100 font-bold">Correct predictions earn XP and build your trader reputation.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">📰</div>
                <h3 className="text-lg font-bold text-amber-300 mb-2">10 News Events</h3>
                <p className="text-amber-100 text-sm">Real market scenarios</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">⏱️</div>
                <h3 className="text-lg font-bold text-amber-300 mb-2">10 Seconds</h3>
                <p className="text-amber-100 text-sm">Quick decision making</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="text-lg font-bold text-amber-300 mb-2">1200 XP Max</h3>
                <p className="text-amber-100 text-sm">Build your score</p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={startGame}
                className="px-12 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold text-xl hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
              >
                Start Trading
              </button>
            </div>
          </div>
        </div>
      </GameModuleLayout>
    );
  }

  // Game completed screen
  if (gameState === 'completed') {
    const totalXP = score + 200;
    const perfect = correctPredictions === questions.length;

    return (
      <GameModuleLayout 
        title="Nifty Trader Challenge - Results" 
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
              <h2 className={`text-4xl font-bold mb-4 ${getRankColor()}`}>
                {getTraderRank()}
              </h2>
              <div className="text-6xl mb-4">{getRankIcon()}</div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-amber-300 text-sm mb-2">Correct Predictions</p>
                <p className="text-3xl font-bold text-amber-100">{correctPredictions} / 10</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-amber-300 text-sm mb-2">Total XP Earned</p>
                <p className="text-3xl font-bold text-amber-100">{totalXP}</p>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">What You Learned:</h3>
              <ul className="text-amber-100 space-y-2">
                <li>• Interest rate cuts typically boost stock markets</li>
                <li>• Rising oil prices often hurt market sentiment</li>
                <li>• Strong GDP growth drives market optimism</li>
                <li>• High inflation can trigger market declines</li>
                <li>• Infrastructure spending lifts market confidence</li>
                <li>• Global recession fears trigger sell-offs</li>
                <li>• Foreign investment boosts market demand</li>
                <li>• Banking crises reduce financial confidence</li>
                <li>• Technology innovation attracts investors</li>
                <li>• Corporate tax increases hurt stock valuations</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onComplete({
                  type: 'financial',
                  score: correctPredictions * 10,
                  perfect: perfect,
                  xp: totalXP,
                  coins: Math.floor(totalXP / 4)
                })}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
              >
                Complete Game
              </button>
              <button
                onClick={() => {
                  setGameState('intro');
                  setCurrentRound(0);
                  setScore(0);
                  setCorrectPredictions(0);
                  setSelectedAnswer(null);
                  setShowResult(false);
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
      title="Nifty Trader Challenge" 
      level={playerProgress?.level || 1} 
      currentXP={playerProgress?.xp || 0} 
      maxXP={(playerProgress?.level || 1) * 100} 
      coins={playerProgress?.coins || 0} 
      streak={playerProgress?.streaks?.current || 0}
      onBack={onBack}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Top Bar */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-amber-300 font-medium">
              Round {currentRound} / {questions.length}
            </div>
            <div className="text-amber-300 font-medium">
              Score: {score} XP
            </div>
            <div className={`font-bold ${timer <= 3 ? 'text-red-400' : 'text-amber-300'}`}>
              Timer: {timer}s
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(currentRound / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* News Event Card */}
        {currentQuestion && (
          <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20 mb-6 transform transition-all duration-300 ${animating ? 'scale-95' : 'scale-100'}`}>
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">📰</div>
              <h2 className="text-2xl font-bold text-amber-300 mb-2">BREAKING MARKET NEWS</h2>
            </div>
            
            <div className="bg-slate-700/50 rounded-2xl p-6 mb-8">
              <p className="text-xl text-amber-100 text-center leading-relaxed">
                {currentQuestion.news}
              </p>
            </div>

            {/* Decision Buttons */}
            {!showResult ? (
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleAnswer("UP")}
                  disabled={selectedAnswer !== null}
                  className={`p-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                    selectedAnswer === "UP"
                      ? "bg-green-500 text-white"
                      : "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600"
                  } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="text-2xl mb-2">📈</div>
                  Market Goes UP
                </button>
                <button
                  onClick={() => handleAnswer("DOWN")}
                  disabled={selectedAnswer !== null}
                  className={`p-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                    selectedAnswer === "DOWN"
                      ? "bg-red-500 text-white"
                      : "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600"
                  } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="text-2xl mb-2">📉</div>
                  Market Goes DOWN
                </button>
                <button
                  onClick={() => handleAnswer("NEUTRAL")}
                  disabled={selectedAnswer !== null}
                  className={`p-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                    selectedAnswer === "NEUTRAL"
                      ? "bg-blue-500 text-white"
                      : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
                  } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="text-2xl mb-2">➡️</div>
                  Market Stays NEUTRAL
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className={`text-6xl mb-4 ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? '✅' : '❌'}
                </div>
                <div className={`text-2xl font-bold mb-4 ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-300' : 'text-red-300'}`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? 'Correct Prediction!' : 'Wrong Prediction!'}
                </div>
                {selectedAnswer === currentQuestion.correctAnswer && (
                  <div className="text-xl text-amber-300 font-bold mb-4">
                    +100 XP
                  </div>
                )}
                <div className="bg-slate-700/50 rounded-2xl p-6 mb-6">
                  <p className="text-amber-100 text-lg">
                    {currentQuestion.explanation}
                  </p>
                </div>
                <button
                  onClick={nextRound}
                  className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
                >
                  {currentRound < questions.length ? 'Next Round' : 'See Results'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameModuleLayout>
  );
};

export default NiftyTraderChallenge;
