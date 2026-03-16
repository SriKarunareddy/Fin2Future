import { useState, useEffect } from 'react';
import GameModuleLayout from '../../shared/GameModuleLayout';

/**
 * Life Budget Crisis - Advanced Level Game
 * 
 * 6-month financial survival simulator teaching budgeting, debt management, and financial stability
 */
const LifeBudgetCrisis = ({ onComplete, onBack, playerProgress, onRealtimeUpdate }) => {
  const [gameState, setGameState] = useState('intro'); // intro, playing, monthSummary, completed
  const [currentMonth, setCurrentMonth] = useState(1);
  const [walletBalance, setWalletBalance] = useState(0);
  const [savings, setSavings] = useState(10000);
  const [creditCardDebt, setCreditCardDebt] = useState(8000);
  const [loanEMI, setLoanEMI] = useState(5000);
  const [stressLevel, setStressLevel] = useState(30);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [showInsight, setShowInsight] = useState(false);
  const [currentInsight, setCurrentInsight] = useState('');
  const [monthPhase, setMonthPhase] = useState('salary'); // salary, expenses, decisions, events, summary
  const [showDeductions, setShowDeductions] = useState(false);
  const [financialHealthScore, setFinancialHealthScore] = useState(0);

  const MONTHLY_SALARY = 40000;
  const TOTAL_MONTHS = 6;
  const CREDIT_CARD_INTEREST_RATE = 0.03; // 3% per month
  const CREDIT_CARD_MIN_PAYMENT = 2000;

  // Fixed monthly expenses
  const FIXED_EXPENSES = [
    { name: 'Rent', amount: 12000, icon: '🏠' },
    { name: 'Food', amount: 5000, icon: '🍔' },
    { name: 'Transport', amount: 3000, icon: '🚗' },
    { name: 'Loan EMI', amount: 5000, icon: '💳' },
    { name: 'Credit Card Minimum', amount: 2000, icon: '💳' }
  ];

  // Random financial events
  const financialEvents = [
    {
      id: 1,
      title: "Medical Emergency",
      description: "Unexpected medical bill for treatment.",
      cost: 8000,
      choices: [
        { text: "Use savings", action: "use_savings", stressImpact: -10 },
        { text: "Use credit card", action: "use_credit", stressImpact: 5 },
        { text: "Ignore treatment", action: "ignore", stressImpact: 20 }
      ],
      insight: "Emergency funds prevent financial stress during health crises."
    },
    {
      id: 2,
      title: "Laptop Repair",
      description: "Your laptop suddenly stopped working.",
      cost: 7000,
      choices: [
        { text: "Pay from wallet", action: "pay_wallet", stressImpact: 0 },
        { text: "Use credit card", action: "use_credit", stressImpact: 5 },
        { text: "Delay repair", action: "delay", stressImpact: 10 }
      ],
      insight: "Unexpected expenses are common. Planning helps avoid debt traps."
    },
    {
      id: 3,
      title: "Wedding Invitation",
      description: "Close friend's wedding invitation arrived.",
      cost: 5000,
      choices: [
        { text: "Attend and spend", action: "spend_full", stressImpact: 5 },
        { text: "Send small gift ₹1000", action: "small_gift", stressImpact: -5 },
        { text: "Skip event", action: "skip", stressImpact: 0 }
      ],
      insight: "Social spending should match your financial situation."
    },
    {
      id: 4,
      title: "Car Repair",
      description: "Your car needs urgent repair.",
      cost: 9000,
      choices: [
        { text: "Pay from savings", action: "use_savings", stressImpact: -10 },
        { text: "Use credit card", action: "use_credit", stressImpact: 5 },
        { text: "Delay repair", action: "delay", stressImpact: 15 }
      ],
      insight: "Delaying essential repairs can increase costs later."
    },
    {
      id: 5,
      title: "Flash Sale",
      description: "Amazing 50% off on latest smartphone!",
      cost: 15000,
      choices: [
        { text: "Buy phone ₹15000", action: "buy_phone", stressImpact: 10 },
        { text: "Ignore sale", action: "ignore", stressImpact: -5 }
      ],
      insight: "Discounts are not savings if you didn't plan the purchase."
    },
    {
      id: 6,
      title: "Home Repair",
      description: "Water pipe burst needs immediate fixing.",
      cost: 6000,
      choices: [
        { text: "Use savings", action: "use_savings", stressImpact: -10 },
        { text: "Use credit card", action: "use_credit", stressImpact: 5 },
        { text: "DIY repair", action: "diy", stressImpact: 0 }
      ],
      insight: "Home maintenance costs should be budgeted as regular expenses."
    },
    {
      id: 7,
      title: "Salary Bonus",
      description: "Unexpected performance bonus!",
      cost: -5000, // Positive
      choices: [
        { text: "Add to savings", action: "save_bonus", stressImpact: -15 },
        { text: "Pay credit card debt", action: "pay_debt", stressImpact: -10 },
        { text: "Spend on self", action: "spend_bonus", stressImpact: 5 }
      ],
      insight: "Using unexpected income wisely builds financial security."
    },
    {
      id: 8,
      title: "Travel Opportunity",
      description: "Weekend trip with friends.",
      cost: 4000,
      choices: [
        { text: "Go for trip", action: "go_trip", stressImpact: 5 },
        { text: "Budget version", action: "budget_trip", stressImpact: 0 },
        { text: "Skip trip", action: "skip", stressImpact: 0 }
      ],
      insight: "Budgeting allows enjoying experiences without harming finances."
    }
  ];

  // Initialize game
  const startGame = () => {
    setGameState('playing');
    setCurrentMonth(1);
    setWalletBalance(0);
    setSavings(10000);
    setCreditCardDebt(8000);
    setLoanEMI(5000);
    setStressLevel(30);
    setMonthPhase('salary');
    generateMonthEvents();
  };

  // Generate random events for current month
  const generateMonthEvents = () => {
    const shuffled = [...financialEvents].sort(() => Math.random() - 0.5);
    const selectedEvents = shuffled.slice(0, 2);
    setCurrentEvents(selectedEvents);
    setCurrentEventIndex(0);
  };

  // Apply credit card interest
  const applyCreditCardInterest = () => {
    if (creditCardDebt > 0) {
      const interest = Math.floor(creditCardDebt * CREDIT_CARD_INTEREST_RATE);
      setCreditCardDebt(prev => prev + interest);
      
      if (interest > 0) {
        setCurrentInsight(`💡 Paying only the minimum on credit cards causes interest to accumulate. This month's interest: ₹${interest}`);
        setShowInsight(true);
        setStressLevel(prev => Math.min(100, prev + 5));
      }
    }
  };

  // Credit salary
  const creditSalary = () => {
    setWalletBalance(prev => prev + MONTHLY_SALARY);
    setMonthPhase('expenses');
    setTimeout(() => {
      setShowDeductions(true);
      setTimeout(() => {
        deductFixedExpenses();
      }, 1000);
    }, 1000);
  };

  // Deduct fixed expenses
  const deductFixedExpenses = () => {
    let remainingBalance = walletBalance;
    let totalDeducted = 0;

    FIXED_EXPENSES.forEach(expense => {
      remainingBalance -= expense.amount;
      totalDeducted += expense.amount;
    });

    setWalletBalance(remainingBalance);
    setShowDeductions(false);
    setMonthPhase('decisions');
  };

  // Handle player decision
  const handleDecision = (choice) => {
    const event = currentEvents[currentEventIndex];
    let newWallet = walletBalance;
    let newSavings = savings;
    let newCreditCardDebt = creditCardDebt;
    let newStress = stressLevel;

    switch (choice.action) {
      case "use_savings":
        newSavings = Math.max(0, savings - event.cost);
        newStress += choice.stressImpact;
        break;
      case "use_credit":
        newCreditCardDebt += event.cost;
        newStress += choice.stressImpact;
        break;
      case "pay_wallet":
        newWallet = Math.max(0, walletBalance - event.cost);
        newStress += choice.stressImpact;
        break;
      case "pay_debt":
        const paymentAmount = Math.min(event.cost > 0 ? Math.abs(event.cost) : 5000, creditCardDebt);
        newCreditCardDebt = Math.max(0, creditCardDebt - paymentAmount);
        newStress += choice.stressImpact;
        break;
      case "save_bonus":
        newSavings += Math.abs(event.cost);
        newStress += choice.stressImpact;
        break;
      case "spend_full":
      case "buy_phone":
      case "go_trip":
      case "spend_bonus":
        newWallet = Math.max(0, walletBalance - event.cost);
        newStress += choice.stressImpact;
        break;
      case "small_gift":
      case "budget_trip":
        newWallet = Math.max(0, walletBalance - 1000);
        newStress += choice.stressImpact;
        break;
      case "ignore":
      case "skip":
      case "delay":
      case "diy":
        newStress += choice.stressImpact;
        break;
    }

    setWalletBalance(newWallet);
    setSavings(newSavings);
    setCreditCardDebt(newCreditCardDebt);
    setStressLevel(Math.max(0, Math.min(100, newStress)));

    // Show insight
    setCurrentInsight(`💡 ${event.insight}`);
    setShowInsight(true);

    // Real-time XP update
    if (onRealtimeUpdate) {
      const xpChange = choice.stressImpact < 0 ? 20 : 5;
      const coinChange = choice.stressImpact < 0 ? 15 : 0;
      
      onRealtimeUpdate({
        type: 'realtime',
        xpChange: xpChange,
        coinChange: coinChange
      });
    }
  };

  // Next event or move to decisions
  const nextEvent = () => {
    setShowInsight(false);
    setCurrentInsight('');
    
    if (currentEventIndex < currentEvents.length - 1) {
      setCurrentEventIndex(prev => prev + 1);
    } else {
      setMonthPhase('decisions');
    }
  };

  // Handle monthly decision
  const handleMonthlyDecision = (decision) => {
    let newWallet = walletBalance;
    let newSavings = savings;
    let newCreditCardDebt = creditCardDebt;
    let newStress = stressLevel;

    switch (decision) {
      case "save":
        const saveAmount = Math.min(2000, newWallet);
        newWallet -= saveAmount;
        newSavings += saveAmount;
        newStress = Math.max(0, newStress - 10);
        break;
      case "pay_debt":
        const debtPayment = Math.min(3000, newWallet, newCreditCardDebt);
        newWallet -= debtPayment;
        newCreditCardDebt -= debtPayment;
        newStress = Math.max(0, newStress - 5);
        break;
      case "invest":
        const investAmount = Math.min(2000, newWallet);
        newWallet -= investAmount;
        newStress = Math.max(0, newStress - 5);
        break;
      // "keep_cash" does nothing
    }

    setWalletBalance(newWallet);
    setSavings(newSavings);
    setCreditCardDebt(newCreditCardDebt);
    setStressLevel(newStress);

    // Move to month summary
    setMonthPhase('summary');
  };

  // Next month
  const nextMonth = () => {
    if (currentMonth >= TOTAL_MONTHS) {
      endGame();
    } else {
      setCurrentMonth(prev => prev + 1);
      setMonthPhase('salary');
      generateMonthEvents();
      applyCreditCardInterest();
    }
  };

  // End game
  const endGame = () => {
    const score = calculateFinancialHealthScore();
    setFinancialHealthScore(score);
    setGameState('completed');
  };

  // Calculate financial health score
  const calculateFinancialHealthScore = () => {
    const savingsScore = Math.min(40, Math.floor((savings / 20000) * 40));
    const debtScore = creditCardDebt === 0 ? 30 : Math.max(0, 30 - Math.floor((creditCardDebt / 10000) * 30));
    const stressScore = stressLevel < 30 ? 30 : Math.max(0, 30 - Math.floor((stressLevel / 100) * 30));
    
    return savingsScore + debtScore + stressScore;
  };

  // Get financial health rating
  const getFinancialHealthRating = () => {
    const score = financialHealthScore;
    if (score >= 90) return { title: "Financial Genius", color: "text-green-400", icon: "🏆" };
    if (score >= 70) return { title: "Smart Saver", color: "text-blue-400", icon: "💎" };
    if (score >= 50) return { title: "Needs Improvement", color: "text-yellow-400", icon: "📚" };
    return { title: "Financial Crisis", color: "text-red-400", icon: "⚠️" };
  };

  // Get stress color
  const getStressColor = () => {
    if (stressLevel < 30) return 'bg-green-500';
    if (stressLevel < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Intro screen
  if (gameState === 'intro') {
    return (
      <GameModuleLayout 
        title="Life Budget Crisis" 
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
              <h1 className="text-5xl font-bold text-amber-300 mb-4">Life Budget Crisis</h1>
              <div className="text-6xl mb-6">💰</div>
            </div>

            <div className="bg-slate-700/50 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-amber-300 mb-4">6-Month Financial Survival Challenge!</h2>
              <p className="text-amber-100 mb-4">Manage salary, pay debts, handle emergencies, and build savings.</p>
              <p className="text-amber-100 font-bold">Learn budgeting, debt management, and financial stability!</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">📅</div>
                <h3 className="text-lg font-bold text-amber-300 mb-2">6 Months</h3>
                <p className="text-amber-100 text-sm">Financial survival</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">💳</div>
                <h3 className="text-lg font-bold text-amber-300 mb-2">Debt Management</h3>
                <p className="text-amber-100 text-sm">Credit card interest</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="text-lg font-bold text-amber-300 mb-2">Financial Lessons</h3>
                <p className="text-amber-100 text-sm">Real-life scenarios</p>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-amber-300 mb-4">Starting Conditions:</h3>
              <div className="grid grid-cols-2 gap-4 text-amber-100">
                <div>💰 Monthly Salary: ₹40,000</div>
                <div>🏦 Savings: ₹10,000</div>
                <div>💳 Credit Card Debt: ₹8,000 (3% interest)</div>
                <div>📄 Loan EMI: ₹5,000/month</div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={startGame}
                className="px-12 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold text-xl hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
              >
                Start Survival
              </button>
            </div>
          </div>
        </div>
      </GameModuleLayout>
    );
  }

  // Game completed screen
  if (gameState === 'completed') {
    const rating = getFinancialHealthRating();
    const totalXP = financialHealthScore * 12;

    return (
      <GameModuleLayout 
        title="Life Budget Crisis - Results" 
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
              <h2 className={`text-4xl font-bold mb-4 ${rating.color}`}>
                {rating.title}
              </h2>
              <div className="text-6xl mb-4">{rating.icon}</div>
              <div className="text-2xl text-amber-300 mb-2">
                Financial Health Score: {financialHealthScore}%
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-amber-300 text-sm mb-2">Final Savings</p>
                <p className="text-3xl font-bold text-amber-100">₹{savings.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-amber-300 text-sm mb-2">Credit Card Debt</p>
                <p className="text-3xl font-bold text-amber-100">₹{creditCardDebt.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-amber-300 text-sm mb-2">Stress Level</p>
                <p className="text-3xl font-bold text-amber-100">{stressLevel}%</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
                <p className="text-amber-300 text-sm mb-2">Total XP Earned</p>
                <p className="text-3xl font-bold text-amber-100">{totalXP}</p>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">Key Financial Lessons Learned:</h3>
              <ul className="text-amber-100 space-y-2">
                <li>• Budgeting helps control monthly expenses</li>
                <li>• Credit card interest accumulates quickly</li>
                <li>• Emergency funds prevent financial stress</li>
                <li>• Paying more than minimum reduces debt faster</li>
                <li>• Regular savings build financial security</li>
                <li>• Smart spending choices matter long-term</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onComplete({
                  type: 'financial',
                  score: financialHealthScore,
                  perfect: financialHealthScore >= 90,
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
      title="Life Budget Crisis" 
      level={playerProgress?.level || 1} 
      currentXP={playerProgress?.xp || 0} 
      maxXP={(playerProgress?.level || 1) * 100} 
      coins={playerProgress?.coins || 0} 
      streak={playerProgress?.streaks?.current || 0}
      onBack={onBack}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Top Dashboard */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl mb-1">💰</div>
              <p className="text-amber-300 text-xs">Wallet</p>
              <p className="text-amber-100 font-bold">₹{walletBalance.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🏦</div>
              <p className="text-amber-300 text-xs">Savings</p>
              <p className="text-amber-100 font-bold">₹{savings.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💳</div>
              <p className="text-amber-300 text-xs">CC Debt</p>
              <p className="text-amber-100 font-bold">₹{creditCardDebt.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">😰</div>
              <p className="text-amber-300 text-xs">Stress</p>
              <p className="text-amber-100 font-bold">{stressLevel}%</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">📅</div>
              <p className="text-amber-300 text-xs">Month</p>
              <p className="text-amber-100 font-bold">{currentMonth}/{TOTAL_MONTHS}</p>
            </div>
          </div>
          
          {/* Stress Meter */}
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getStressColor()}`}
              style={{ width: `${stressLevel}%` }}
            />
          </div>
        </div>

        {/* Salary Phase */}
        {monthPhase === 'salary' && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-8 mb-6 text-center animate-fadeIn">
            <div className="text-4xl mb-4">💰</div>
            <h2 className="text-3xl font-bold text-white mb-4">Salary Credited!</h2>
            <p className="text-xl text-white mb-6">+₹{MONTHLY_SALARY.toLocaleString()}</p>
            <button
              onClick={creditSalary}
              className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Continue to Expenses
            </button>
          </div>
        )}

        {/* Expenses Phase */}
        {monthPhase === 'expenses' && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20 mb-6">
            <h2 className="text-2xl font-bold text-amber-300 mb-6 text-center">Monthly Expenses</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {FIXED_EXPENSES.map((expense, index) => (
                <div 
                  key={expense.name}
                  className={`bg-slate-700/50 rounded-xl p-4 flex items-center justify-between transition-all duration-500 ${
                    showDeductions ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{expense.icon}</span>
                    <span className="text-amber-100 font-medium">{expense.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-400 font-bold">-₹{expense.amount.toLocaleString()}</span>
                    {showDeductions && <span className="ml-2 text-green-400">✓</span>}
                  </div>
                </div>
              ))}
            </div>

            {showDeductions && (
              <div className="text-center">
                <p className="text-xl text-amber-300 mb-4">
                  Remaining Balance: <span className="font-bold">₹{walletBalance.toLocaleString()}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Events Phase */}
        {monthPhase === 'events' && currentEvents.length > 0 && currentEventIndex < currentEvents.length && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20 mb-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-amber-300 mb-4">{currentEvents[currentEventIndex].title}</h2>
              <p className="text-amber-100 text-lg mb-4">{currentEvents[currentEventIndex].description}</p>
              <p className="text-red-400 font-bold text-xl mb-6">Cost: ₹{currentEvents[currentEventIndex].cost.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentEvents[currentEventIndex].choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleDecision(choice)}
                  className="p-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Decisions Phase */}
        {monthPhase === 'decisions' && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20 mb-6">
            <h2 className="text-2xl font-bold text-amber-300 mb-6 text-center">Financial Decision Time</h2>
            <p className="text-amber-100 text-center mb-6">Choose your financial action for this month:</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => handleMonthlyDecision('save')}
                className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
              >
                <div className="text-2xl mb-2">🏦</div>
                Save ₹2000
              </button>
              <button
                onClick={() => handleMonthlyDecision('pay_debt')}
                className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105"
              >
                <div className="text-2xl mb-2">💳</div>
                Pay CC Debt ₹3000
              </button>
              <button
                onClick={() => handleMonthlyDecision('invest')}
                className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
              >
                <div className="text-2xl mb-2">📈</div>
                Invest ₹2000
              </button>
              <button
                onClick={() => handleMonthlyDecision('keep_cash')}
                className="p-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105"
              >
                <div className="text-2xl mb-2">💰</div>
                Keep Emergency Cash
              </button>
            </div>
          </div>
        )}

        {/* Month Summary */}
        {monthPhase === 'summary' && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20 mb-6">
            <h2 className="text-2xl font-bold text-amber-300 mb-6 text-center">Month {currentMonth} Summary</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-amber-300 text-sm mb-1">Wallet Balance</p>
                <p className="text-amber-100 font-bold">₹{walletBalance.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-amber-300 text-sm mb-1">Savings</p>
                <p className="text-amber-100 font-bold">₹{savings.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-amber-300 text-sm mb-1">Credit Card Debt</p>
                <p className="text-amber-100 font-bold">₹{creditCardDebt.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-amber-300 text-sm mb-1">Stress Level</p>
                <p className="text-amber-100 font-bold">{stressLevel}%</p>
              </div>
            </div>

            <div className="bg-blue-800/50 rounded-xl p-4 mb-6 text-center">
              <p className="text-blue-300 text-lg">💡 Try to keep 3–6 months of expenses in emergency savings.</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={nextMonth}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
              >
                {currentMonth >= TOTAL_MONTHS ? 'View Results' : 'Next Month'}
              </button>
            </div>
          </div>
        )}

        {/* Financial Insight Popup */}
        {showInsight && (
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-3xl p-8 shadow-2xl border border-amber-300/20 mb-6 animate-fadeIn">
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <p className="text-amber-100 text-lg mb-6">{currentInsight}</p>
              <button
                onClick={() => {
                  if (monthPhase === 'events') {
                    nextEvent();
                  } else {
                    setShowInsight(false);
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-105"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </GameModuleLayout>
  );
};

export default LifeBudgetCrisis;
