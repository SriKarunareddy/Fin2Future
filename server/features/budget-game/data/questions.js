/**
 * Financial Literacy Quiz Questions
 * 
 * This module contains the question data store for the financial literacy quiz.
 * Each question has:
 * - id: Unique identifier (1-10)
 * - text: The question text
 * - options: Four multiple choice options (A, B, C, D)
 * - correctAnswer: The correct option ("A", "B", "C", or "D")
 */

const quizQuestions = [
  {
    id: 1,
    text: "What is a budget?",
    options: {
      A: "A plan for spending and saving money",
      B: "A type of bank account",
      C: "A credit card limit",
      D: "A loan payment"
    },
    correctAnswer: "A"
  },
  {
    id: 2,
    text: "What does APR stand for in credit card terms?",
    options: {
      A: "Annual Payment Rate",
      B: "Annual Percentage Rate",
      C: "Average Payment Ratio",
      D: "Automatic Payment Reminder"
    },
    correctAnswer: "B"
  },
  {
    id: 3,
    text: "What is compound interest?",
    options: {
      A: "Interest paid only on the principal amount",
      B: "Interest that is paid monthly",
      C: "Interest calculated on the initial principal and accumulated interest",
      D: "Interest that compounds your debt"
    },
    correctAnswer: "C"
  },
  {
    id: 4,
    text: "What is an emergency fund?",
    options: {
      A: "Money set aside for unexpected expenses",
      B: "A government assistance program",
      C: "A type of investment account",
      D: "Money borrowed for emergencies"
    },
    correctAnswer: "A"
  },
  {
    id: 5,
    text: "What is diversification in investing?",
    options: {
      A: "Investing all your money in one stock",
      B: "Spreading investments across different assets to reduce risk",
      C: "Only investing in international markets",
      D: "Buying and selling stocks frequently"
    },
    correctAnswer: "B"
  },
  {
    id: 6,
    text: "What is a credit score used for?",
    options: {
      A: "To determine your income level",
      B: "To measure your creditworthiness for loans and credit",
      C: "To calculate your tax refund",
      D: "To track your spending habits"
    },
    correctAnswer: "B"
  },
  {
    id: 7,
    text: "What is the difference between a debit card and a credit card?",
    options: {
      A: "There is no difference",
      B: "A debit card uses your own money; a credit card borrows money",
      C: "A credit card is safer than a debit card",
      D: "A debit card can only be used online"
    },
    correctAnswer: "B"
  },
  {
    id: 8,
    text: "What is inflation?",
    options: {
      A: "The increase in the value of money over time",
      B: "The decrease in prices of goods and services",
      C: "The general increase in prices and decrease in purchasing power",
      D: "The interest rate set by banks"
    },
    correctAnswer: "C"
  },
  {
    id: 9,
    text: "What is a 401(k)?",
    options: {
      A: "A type of savings account",
      B: "A retirement savings plan sponsored by an employer",
      C: "A government bond",
      D: "A type of mortgage loan"
    },
    correctAnswer: "B"
  },
  {
    id: 10,
    text: "What does it mean to 'pay yourself first'?",
    options: {
      A: "Paying off all debts before saving",
      B: "Setting aside money for savings before paying other expenses",
      C: "Giving yourself a salary increase",
      D: "Spending money on personal items first"
    },
    correctAnswer: "B"
  }
];

/**
 * Get all quiz questions
 * @returns {Array} Array of all quiz questions
 */
function getQuestions() {
  return quizQuestions;
}

/**
 * Get all questions without correct answers (for client-side use)
 * @returns {Array} Array of questions without correctAnswer field
 */
function getQuestionsWithoutAnswers() {
  return quizQuestions.map(({ id, text, options }) => ({
    id,
    text,
    options
  }));
}

/**
 * Get a specific question by ID
 * @param {number} questionId - The ID of the question to retrieve
 * @returns {Object|null} The question object or null if not found
 */
function getQuestionById(questionId) {
  return quizQuestions.find(q => q.id === questionId) || null;
}

/**
 * Get the correct answer for a specific question (server-only)
 * @param {number} questionId - The ID of the question
 * @returns {string|null} The correct answer option ("A", "B", "C", or "D") or null if not found
 */
function getCorrectAnswer(questionId) {
  const question = getQuestionById(questionId);
  return question ? question.correctAnswer : null;
}

/**
 * Validate that all questions have the required structure
 * @returns {boolean} True if all questions are valid
 * @throws {Error} If any question is invalid
 */
function validateQuestions() {
  const validOptions = ['A', 'B', 'C', 'D'];
  
  quizQuestions.forEach(question => {
    // Check required fields
    if (!question.id || !question.text || !question.options || !question.correctAnswer) {
      throw new Error(`Question ${question.id || 'unknown'} is missing required fields`);
    }
    
    // Check that all four options exist
    if (!question.options.A || !question.options.B || !question.options.C || !question.options.D) {
      throw new Error(`Question ${question.id} is missing one or more options`);
    }
    
    // Check that correctAnswer is valid
    if (!validOptions.includes(question.correctAnswer)) {
      throw new Error(`Question ${question.id} has invalid correctAnswer: ${question.correctAnswer}`);
    }
  });
  
  // Check that we have exactly 10 questions
  if (quizQuestions.length !== 10) {
    throw new Error(`Expected 10 questions, but found ${quizQuestions.length}`);
  }
  
  return true;
}

// Validate questions on module load
validateQuestions();

module.exports = {
  quizQuestions,
  getQuestions,
  getQuestionsWithoutAnswers,
  getQuestionById,
  getCorrectAnswer,
  validateQuestions
};
