import { useState, useEffect } from 'react';
import GameModuleLayout from '../../shared/GameModuleLayout';

/**
 * Scam Detective - Medium Level Game
 * 
 * Educational game to identify financial scams
 */
const ScamDetective = ({ onComplete, onBack, playerProgress, onRealtimeUpdate }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [walletBalance, setWalletBalance] = useState(5000);
  const [safetyScore, setSafetyScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [animating, setAnimating] = useState(false);

  // All scam scenarios
  const allScenarios = [
    {
      id: 1,
      type: 'SMS',
      icon: '📱',
      title: 'RBI Lottery Scam',
      content: `"Congratulations!\nYou have won ₹25,000 in the RBI Lucky Draw.\n\nClaim now:\nrbireward-claim.com"`,
      choices: ['Trust', 'Investigate', 'Ignore'],
      correctAction: 'Investigate',
      explanation: 'RBI never runs lottery programs. Suspicious external link is a major red flag.',
      safetyPoints: 15,
      walletPenalty: 1000
    },
    {
      id: 2,
      type: 'Email',
      icon: '📧',
      title: 'Fake Bank Email',
      content: `"Subject: Urgent! Your bank account will be suspended.\n\nYour account verification is pending.\n\nLogin immediately:\nhdfc-secure-login.net"`,
      choices: ['Click Link', 'Check Official Bank Website', 'Ignore'],
      correctAction: 'Check Official Bank Website',
      explanation: 'Banks do not ask customers to log in through email links. The domain is fake.',
      safetyPoints: 15,
      walletPenalty: 1000
    },
    {
      id: 3,
      type: 'Phone',
      icon: '📞',
      title: 'OTP Phone Scam',
      content: `"Hello, I am calling from SBI support.\nPlease share the OTP sent to your phone to verify your account."`,
      choices: ['Share OTP', 'Refuse and Hang Up', 'Ask for Employee ID'],
      correctAction: 'Refuse and Hang Up',
      explanation: 'Banks never ask for OTP over phone calls.',
      safetyPoints: 15,
      walletPenalty: 1000
    },
    {
      id: 4,
      type: 'Advertisement',
      icon: '📢',
      title: 'Unrealistic Investment Offer',
      content: `"Invest ₹10,000 today and earn ₹1,00,000 in just 10 days!"`,
      choices: ['Invest', 'Research Company', 'Ignore'],
      correctAction: 'Research Company',
      explanation: 'Unrealistic returns are one of the biggest scam indicators.',
      safetyPoints: 15,
      walletPenalty: 1000
    },
    {
      id: 5,
      type: 'Email',
      icon: '📧',
      title: 'Fake Job Offer Scam',
      content: `"We found your profile online.\n\nEarn ₹30,000 per week working from home.\n\nRegistration fee: ₹2000."`,
      choices: ['Pay Fee', 'Research Company', 'Ignore'],
      correctAction: 'Research Company',
      explanation: 'Legitimate companies do not charge job application fees.',
      safetyPoints: 15,
      walletPenalty: 1000
    },
    {
      id: 6,
      type: 'SMS',
      icon: '📱',
      title: 'Fake Government Subsidy',
      content: `"You are eligible for a Government Farming Subsidy of ₹15,000.\n\nSubmit Aadhaar and bank details here."`,
      choices: ['Submit Details', 'Verify on Government Website', 'Ignore'],
      correctAction: 'Verify on Government Website',
      explanation: 'Government programs are announced only through official portals.',
      safetyPoints: 15,
      walletPenalty: 1000
    },
    {
      id: 7,
      type: 'Message',
      icon: '💬',
      title: 'Fake E-Commerce Refund',
      content: `"Your Amazon order refund failed.\n\nUpdate bank details here."`,
      choices: ['Click Link', 'Check Official Amazon App', 'Ignore'],
      correctAction: 'Check Official Amazon App',
      explanation: 'Refund updates are handled through official apps only.',
      safetyPoints: 15,
      walletPenalty: 1000
    },
    {
      id: 8,
      type: 'Telegram',
      icon: '📱',
      title: 'Crypto Pump Scam',
      content: `"SECRET CRYPTO TIP 🚀\nBuy this coin now and triple your money in 24 hours."`,
      choices: ['Invest Immediately', 'Research Project', 'Ignore'],
      correctAction: 'Research Project',
      explanation: 'Pump-and-dump schemes rely on hype and urgency.',
      safetyPoints: 15,
      walletPenalty: 1000
    },
    {
      id: 9,
      type: 'Pop-up',
      icon: '⚠️',
      title: 'Fake Tech Support',
      content: `"Your computer is infected!\nCall Microsoft Support immediately."`,
      choices: ['Call Number', 'Close Pop-up', 'Download Antivirus'],
      correctAction: 'Close Pop-up',
      explanation: 'Legitimate companies do not show browser pop-up warnings like this.',
      safetyPoints: 15,
      walletPenalty: 1000
    },
    {
      id: 10,
      type: 'WhatsApp',
      icon: '💚',
      title: 'Fake Friend Emergency Scam',
      content: `"Hey, I lost my phone and wallet.\nPlease send ₹5000 urgently to this UPI ID."`,
      choices: ['Send Money', 'Call Friend to Confirm', 'Ignore'],
      correctAction: 'Call Friend to Confirm',
      explanation: 'Scammers often impersonate friends in emergencies.',
      safetyPoints: 15,
      walletPenalty: 1000
    }
  ];

  // Initialize game - select 7 random scenarios
  useEffect(() => {
    const shuffled = [...allScenarios].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 7);
    setSelectedScenarios(selected);
    setCurrentScenario(selected[0]);
  }, []);

  const handleActionClick = async (action) => {
    if (showFeedback) return;
    
    setSelectedAction(action);
    setAnimating(true);
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const isCorrect = action === currentScenario.correctAction;
    const newSafetyScore = isCorrect ? safetyScore + currentScenario.safetyPoints : safetyScore;
    const newWalletBalance = isCorrect ? walletBalance : walletBalance - currentScenario.walletPenalty;
    
    setSafetyScore(newSafetyScore);
    setWalletBalance(newWalletBalance);
    
    // Call real-time XP update
    if (onRealtimeUpdate) {
      const xpChange = isCorrect ? currentScenario.safetyPoints : -5;
      const coinChange = isCorrect ? Math.floor(currentScenario.safetyPoints / 3) : -Math.floor(currentScenario.walletPenalty / 100);
      
      onRealtimeUpdate({
        type: 'realtime',
        xpChange: xpChange,
        coinChange: coinChange
      });
    }
    
    // Show feedback
    setFeedback({
      correct: isCorrect,
      explanation: currentScenario.explanation,
      scoreChange: isCorrect ? `+${currentScenario.safetyPoints} Safety Points` : `-${currentScenario.walletPenalty} Wallet Balance`
    });
    setShowFeedback(true);
    setAnimating(false);
  };

  const handleNextScenario = async () => {
    setShowFeedback(false);
    setSelectedAction(null);
    setFeedback(null);
    
    if (currentRound >= selectedScenarios.length) {
      // Game completed
      setGameCompleted(true);
    } else {
      // Move to next scenario
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentRound(currentRound + 1);
      setCurrentScenario(selectedScenarios[currentRound]);
    }
  };

  const getResultTitle = () => {
    if (safetyScore >= 90) return 'Fraud Detective';
    if (safetyScore >= 60) return 'Scam Spotter';
    if (safetyScore >= 30) return 'Alert User';
    return 'Risky User';
  };

  const getResultColor = () => {
    if (safetyScore >= 90) return 'text-green-400';
    if (safetyScore >= 60) return 'text-blue-400';
    if (safetyScore >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Game completed screen
  if (gameCompleted) {
    const finalXP = safetyScore >= 90 ? 50 : safetyScore >= 60 ? 40 : safetyScore >= 30 ? 30 : 20;
    const perfect = safetyScore >= 90;

    return (
      <GameModuleLayout 
        title="Scam Detective - Results" 
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
              <h2 className={`text-4xl font-bold mb-4 ${getResultColor()}`}>
                {getResultTitle()}
              </h2>
              <div className="text-6xl mb-4">
                {safetyScore >= 90 ? '🕵️' : safetyScore >= 60 ? '🔍' : safetyScore >= 30 ? '⚠️' : '⚠️'}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-amber-300 text-sm mb-2">Final Safety Score</p>
                <p className="text-3xl font-bold text-amber-100">{safetyScore}</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-amber-300 text-sm mb-2">Final Wallet Balance</p>
                <p className="text-3xl font-bold text-amber-100">₹{walletBalance}</p>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">What You Learned:</h3>
              <ul className="text-amber-100 space-y-2">
                <li>• RBI never runs lottery programs</li>
                <li>• Banks never ask for OTP over phone</li>
                <li>• Unrealistic returns indicate scams</li>
                <li>• Always verify through official channels</li>
                <li>• Government programs use official portals</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onComplete({
                  type: 'financial',
                  score: safetyScore,
                  perfect: perfect,
                  xp: finalXP,
                  coins: Math.floor(walletBalance / 100)
                })}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
              >
                Complete Game
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
      title="Scam Detective" 
      level={playerProgress?.level || 1} 
      currentXP={playerProgress?.xp || 0} 
      maxXP={(playerProgress?.level || 1) * 100} 
      coins={playerProgress?.coins || 0} 
      streak={playerProgress?.streaks?.current || 0}
      onBack={onBack}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-amber-300 font-medium">Round {currentRound} / {selectedScenarios.length}</span>
            <span className="text-amber-300 font-medium">Safety Score: {safetyScore}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentRound / selectedScenarios.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-white text-sm">Wallet Balance</p>
            <p className="text-2xl font-bold text-white">₹{walletBalance}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <p className="text-white text-sm">Safety Score</p>
            <p className="text-2xl font-bold text-white">{safetyScore}</p>
          </div>
        </div>

        {/* Scenario Card */}
        {currentScenario && (
          <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20 mb-6 transform transition-all duration-300 ${animating ? 'scale-95' : 'scale-100'}`}>
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">{currentScenario.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-amber-300">{currentScenario.type} Message</h3>
                <p className="text-amber-100">{currentScenario.title}</p>
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-2xl p-6 mb-6">
              <pre className="text-amber-100 whitespace-pre-wrap font-sans text-lg leading-relaxed">
                {currentScenario.content}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentScenario.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(choice)}
                  disabled={showFeedback}
                  className={`p-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                    selectedAction === choice
                      ? choice === currentScenario.correctAction
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : showFeedback && choice === currentScenario.correctAction
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 hover:from-amber-500 hover:to-amber-600'
                  } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && feedback && (
          <div className={`bg-gradient-to-br ${feedback.correct ? 'from-green-800 to-green-900' : 'from-red-800 to-red-900'} rounded-3xl p-6 shadow-2xl border border-amber-300/20 mb-6 animate-fadeIn`}>
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">{feedback.correct ? '✅' : '❌'}</div>
              <div>
                <h3 className={`text-xl font-bold ${feedback.correct ? 'text-green-300' : 'text-red-300'}`}>
                  {feedback.correct ? 'Correct!' : 'Wrong!'}
                </h3>
                <p className="text-amber-100">{feedback.scoreChange}</p>
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-2xl p-4 mb-4">
              <p className="text-amber-100">{feedback.explanation}</p>
            </div>

            <button
              onClick={handleNextScenario}
              className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
            >
              {currentRound >= selectedScenarios.length ? 'See Results' : 'Next Scenario'}
            </button>
          </div>
        )}
      </div>
    </GameModuleLayout>
  );
};

export default ScamDetective;
