/**
 * Scenario Generator
 * 
 * Generates randomized scenarios for all games
 */

// Helper function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Random number generator
export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Spend Smart Sprint scenarios
export function generateSpendingScenarios(count = 20) {
  const scenarios = [
    { title: 'Coffee Shop', description: 'Daily $5 coffee', correct: 'wasteful', icon: '☕' },
    { title: 'Emergency Fund', description: 'Save $50/month', correct: 'smart', icon: '💰' },
    { title: 'Designer Shoes', description: '$200 sneakers on sale', correct: 'wasteful', icon: '👟' },
    { title: 'Health Insurance', description: 'Monthly premium payment', correct: 'smart', icon: '🏥' },
    { title: 'Streaming Services', description: '5 subscriptions at once', correct: 'wasteful', icon: '📺' },
    { title: 'Grocery Shopping', description: 'Weekly food budget', correct: 'smart', icon: '🛒' },
    { title: 'Impulse Buy', description: 'Random gadget online', correct: 'wasteful', icon: '📱' },
    { title: 'Retirement Savings', description: '401k contribution', correct: 'smart', icon: '🏦' },
    { title: 'Fast Food Daily', description: 'Lunch out every day', correct: 'wasteful', icon: '🍔' },
    { title: 'Education Course', description: 'Skill development class', correct: 'smart', icon: '📚' },
    { title: 'Luxury Car', description: 'Brand new sports car', correct: 'wasteful', icon: '🚗' },
    { title: 'Home Maintenance', description: 'Fix leaking roof', correct: 'smart', icon: '🏠' },
    { title: 'Casino Trip', description: 'Weekend gambling', correct: 'wasteful', icon: '🎰' },
    { title: 'Bike for Commute', description: 'Save on gas', correct: 'smart', icon: '🚲' },
    { title: 'Brand Clothes', description: 'Designer outfit', correct: 'wasteful', icon: '👔' },
    { title: 'Meal Prep', description: 'Cook at home', correct: 'smart', icon: '🍳' },
    { title: 'Lottery Tickets', description: 'Weekly lottery', correct: 'wasteful', icon: '🎫' },
    { title: 'Emergency Repair', description: 'Fix broken appliance', correct: 'smart', icon: '🔧' },
    { title: 'Expensive Phone', description: 'Latest flagship model', correct: 'wasteful', icon: '📱' },
    { title: 'Budget Planning', description: 'Track expenses', correct: 'smart', icon: '📊' }
  ];

  return shuffleArray(scenarios).slice(0, count);
}

// Needs vs Wants items
export function generateNeedsWantsItems(count = 30) {
  const items = [
    { name: 'Rent Payment', type: 'need', icon: '🏠' },
    { name: 'Designer Handbag', type: 'want', icon: '👜' },
    { name: 'Groceries', type: 'need', icon: '🛒' },
    { name: 'Gaming Console', type: 'want', icon: '🎮' },
    { name: 'Electricity Bill', type: 'need', icon: '💡' },
    { name: 'Vacation Trip', type: 'want', icon: '✈️' },
    { name: 'Medicine', type: 'need', icon: '💊' },
    { name: 'Luxury Watch', type: 'want', icon: '⌚' },
    { name: 'Water Bill', type: 'need', icon: '💧' },
    { name: 'Concert Tickets', type: 'want', icon: '🎵' },
    { name: 'School Supplies', type: 'need', icon: '📚' },
    { name: 'Spa Treatment', type: 'want', icon: '💆' },
    { name: 'Car Insurance', type: 'need', icon: '🚗' },
    { name: 'Jewelry', type: 'want', icon: '💎' },
    { name: 'Internet Bill', type: 'need', icon: '🌐' },
    { name: 'Premium Subscription', type: 'want', icon: '⭐' },
    { name: 'Work Clothes', type: 'need', icon: '👔' },
    { name: 'Collectible Toys', type: 'want', icon: '🧸' },
    { name: 'Phone Bill', type: 'need', icon: '📱' },
    { name: 'Fine Dining', type: 'want', icon: '🍽️' },
    { name: 'Transportation', type: 'need', icon: '🚌' },
    { name: 'Hobby Equipment', type: 'want', icon: '🎨' },
    { name: 'Dental Care', type: 'need', icon: '🦷' },
    { name: 'Latest Gadget', type: 'want', icon: '📱' },
    { name: 'Heating/Cooling', type: 'need', icon: '🌡️' },
    { name: 'Luxury Car', type: 'want', icon: '🏎️' },
    { name: 'Basic Clothing', type: 'need', icon: '👕' },
    { name: 'Brand Sneakers', type: 'want', icon: '👟' },
    { name: 'Health Insurance', type: 'need', icon: '🏥' },
    { name: 'Theme Park', type: 'want', icon: '🎢' }
  ];

  return shuffleArray(items).slice(0, count);
}

// Life Month Simulator events
export function generateLifeEvents(count = 10) {
  const events = [
    {
      title: 'Medical Emergency',
      description: 'Unexpected hospital visit',
      icon: '🏥',
      options: [
        { text: 'Use emergency fund', savings: -200, happiness: 0, stress: -10 },
        { text: 'Skip treatment', savings: 0, happiness: -20, stress: 30 }
      ]
    },
    {
      title: 'Flash Sale',
      description: '50% off electronics',
      icon: '💻',
      options: [
        { text: 'Buy the deal', savings: -150, happiness: 15, stress: 5 },
        { text: 'Skip it', savings: 0, happiness: -5, stress: 0 }
      ]
    },
    {
      title: 'Friend\'s Wedding',
      description: 'Gift and travel costs',
      icon: '💒',
      options: [
        { text: 'Attend with gift', savings: -100, happiness: 20, stress: 0 },
        { text: 'Send regrets', savings: 0, happiness: -15, stress: 10 }
      ]
    },
    {
      title: 'Gadget Repair',
      description: 'Phone screen cracked',
      icon: '📱',
      options: [
        { text: 'Repair it', savings: -80, happiness: 10, stress: -5 },
        { text: 'Live with it', savings: 0, happiness: -10, stress: 15 }
      ]
    },
    {
      title: 'Bonus at Work',
      description: 'Unexpected $300 bonus',
      icon: '💰',
      options: [
        { text: 'Save it all', savings: 300, happiness: 10, stress: -10 },
        { text: 'Spend on fun', savings: 0, happiness: 25, stress: 0 }
      ]
    },
    {
      title: 'Gym Membership',
      description: 'Annual renewal due',
      icon: '💪',
      options: [
        { text: 'Renew membership', savings: -120, happiness: 15, stress: -15 },
        { text: 'Exercise at home', savings: 0, happiness: 5, stress: 5 }
      ]
    },
    {
      title: 'Car Maintenance',
      description: 'Oil change needed',
      icon: '🚗',
      options: [
        { text: 'Get service', savings: -60, happiness: 0, stress: -10 },
        { text: 'Delay it', savings: 0, happiness: 0, stress: 20 }
      ]
    },
    {
      title: 'Online Course',
      description: 'Career development opportunity',
      icon: '📚',
      options: [
        { text: 'Enroll now', savings: -200, happiness: 20, stress: 10 },
        { text: 'Maybe later', savings: 0, happiness: -5, stress: 5 }
      ]
    },
    {
      title: 'Concert Tickets',
      description: 'Favorite band in town',
      icon: '🎵',
      options: [
        { text: 'Buy tickets', savings: -100, happiness: 30, stress: 0 },
        { text: 'Watch online', savings: 0, happiness: 10, stress: 0 }
      ]
    },
    {
      title: 'Utility Bill Spike',
      description: 'Higher than usual',
      icon: '💡',
      options: [
        { text: 'Pay in full', savings: -150, happiness: 0, stress: 5 },
        { text: 'Payment plan', savings: -50, happiness: 0, stress: 15 }
      ]
    }
  ];

  return shuffleArray(events).slice(0, count);
}

// Investment options
export function getInvestmentOptions() {
  return [
    {
      id: 'savings',
      name: 'Savings Account',
      icon: '🏦',
      risk: 'Low',
      return: { min: 1, max: 3 },
      description: 'Safe but low returns'
    },
    {
      id: 'fixed-deposit',
      name: 'Fixed Deposit',
      icon: '📊',
      risk: 'Low',
      return: { min: 4, max: 6 },
      description: 'Stable guaranteed returns'
    },
    {
      id: 'mutual-fund',
      name: 'Mutual Fund',
      icon: '📈',
      risk: 'Medium',
      return: { min: 6, max: 12 },
      description: 'Balanced risk and reward'
    },
    {
      id: 'stocks',
      name: 'High Risk Stocks',
      icon: '🚀',
      risk: 'High',
      return: { min: -10, max: 25 },
      description: 'High risk, high reward'
    }
  ];
}

// Market events for Investment Race
export function generateMarketEvents() {
  return [
    { type: 'bull', name: 'Bull Run', effect: 1.2, icon: '📈' },
    { type: 'bear', name: 'Market Crash', effect: 0.7, icon: '📉' },
    { type: 'stable', name: 'Stable Market', effect: 1.0, icon: '➡️' },
    { type: 'inflation', name: 'Inflation Rise', effect: 0.9, icon: '💸' },
    { type: 'boom', name: 'Economic Boom', effect: 1.3, icon: '💰' }
  ];
}

// Scam scenarios
export function generateScamScenarios(count = 15) {
  const scams = [
    {
      title: 'Email from "Bank"',
      description: 'Urgent: Verify your account now!',
      isScam: true,
      icon: '📧',
      explanation: 'Banks never ask for verification via email'
    },
    {
      title: 'Investment Opportunity',
      description: 'Guaranteed 50% returns in 1 month!',
      isScam: true,
      icon: '💰',
      explanation: 'No legitimate investment guarantees such high returns'
    },
    {
      title: 'Official Tax Notice',
      description: 'IRS letter with payment instructions',
      isScam: false,
      icon: '📄',
      explanation: 'Official government correspondence is legitimate'
    },
    {
      title: 'Prize Winner!',
      description: 'You won $10,000! Pay $500 processing fee',
      isScam: true,
      icon: '🎁',
      explanation: 'Real prizes never require upfront payment'
    },
    {
      title: 'Credit Card Statement',
      description: 'Monthly statement from your bank',
      isScam: false,
      icon: '💳',
      explanation: 'Regular statements are normal'
    },
    {
      title: 'Crypto Giveaway',
      description: 'Send 1 BTC, get 2 BTC back!',
      isScam: true,
      icon: '₿',
      explanation: 'Classic doubling scam'
    },
    {
      title: 'Job Offer',
      description: 'Work from home, $5000/week guaranteed!',
      isScam: true,
      icon: '💼',
      explanation: 'Too good to be true offers are usually scams'
    },
    {
      title: 'Utility Bill',
      description: 'Monthly electricity payment due',
      isScam: false,
      icon: '💡',
      explanation: 'Regular bills are legitimate'
    },
    {
      title: 'Tech Support Call',
      description: 'Microsoft detected virus on your PC',
      isScam: true,
      icon: '☎️',
      explanation: 'Tech companies don\'t make unsolicited calls'
    },
    {
      title: 'Insurance Renewal',
      description: 'Annual policy renewal notice',
      isScam: false,
      icon: '🏥',
      explanation: 'Regular insurance notices are normal'
    },
    {
      title: 'Romance Scam',
      description: 'Online date needs money for emergency',
      isScam: true,
      icon: '💕',
      explanation: 'Never send money to people you haven\'t met'
    },
    {
      title: 'Charity Donation',
      description: 'Registered non-profit seeking support',
      isScam: false,
      icon: '🤝',
      explanation: 'Verified charities are legitimate'
    },
    {
      title: 'Phishing Link',
      description: 'Click here to claim your refund',
      isScam: true,
      icon: '🔗',
      explanation: 'Suspicious links are often phishing attempts'
    },
    {
      title: 'Subscription Service',
      description: 'Netflix monthly charge',
      isScam: false,
      icon: '📺',
      explanation: 'Known subscription charges are normal'
    },
    {
      title: 'Pyramid Scheme',
      description: 'Recruit 5 friends, earn passive income!',
      isScam: true,
      icon: '🔺',
      explanation: 'Pyramid schemes are illegal'
    }
  ];

  return shuffleArray(scams).slice(0, count);
}

// Calculate investment return
export function calculateInvestmentReturn(investment, marketEvent) {
  const baseReturn = randomBetween(investment.return.min, investment.return.max);
  return Math.floor(baseReturn * marketEvent.effect);
}

// Unified scenario generator for all games
export function generateScenario(gameType) {
  switch (gameType) {
    case 'spend-smart-sprint': {
      const scenarios = generateSpendingScenarios(1);
      return scenarios[0];
    }
    
    case 'needs-vs-wants': {
      const items = generateNeedsWantsItems(1);
      const item = items[0];
      return {
        title: item.name,
        description: item.type === 'need' ? 'Essential for daily life' : 'Nice to have but not essential',
        icon: item.icon,
        correctAnswer: item.type
      };
    }
    
    case 'life-month-simulator': {
      const events = generateLifeEvents(1);
      return events[0];
    }
    
    case 'investment-race': {
      const options = getInvestmentOptions();
      const marketEvents = generateMarketEvents();
      return {
        investments: options,
        marketEvent: marketEvents[randomBetween(0, marketEvents.length - 1)]
      };
    }
    
    case 'scam-detector': {
      const scams = generateScamScenarios(1);
      return scams[0];
    }
    
    default:
      return null;
  }
}
