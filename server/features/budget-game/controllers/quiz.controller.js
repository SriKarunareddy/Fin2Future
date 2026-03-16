/**
 * Quiz Controller
 * 
 * Handles HTTP requests for quiz operations.
 */

const { getQuestionsWithoutAnswers } = require('../data/questions');
const { calculateScore } = require('../services/scoring.service');
const { assignLevel } = require('../services/level-assignment.service');
const { saveQuizResults, getQuizResults } = require('../services/user-profile.service');

/**
 * GET /api/quiz/questions
 * Retrieve all quiz questions without correct answers
 */
async function getQuestions(req, res, next) {
  try {
    const questions = getQuestionsWithoutAnswers();
    
    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Error in getQuestions:', error);
    next(error);
  }
}

/**
 * POST /api/quiz/submit
 * Submit quiz responses and calculate results
 */
async function submitQuiz(req, res, next) {
  try {
    const { userId, responses } = req.body;

    // Validate request body
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        error: 'responses must be an array'
      });
    }

    // Calculate score
    const score = calculateScore(responses);

    // Assign level based on score
    const level = assignLevel(score);

    // Prepare results
    const results = {
      userId,
      responses,
      score,
      level,
      completedAt: new Date().toISOString()
    };

    // Save results to user profile
    await saveQuizResults(userId, results);

    // Return results
    res.json({
      success: true,
      data: {
        score,
        level,
        responses,
        completedAt: results.completedAt
      }
    });
  } catch (error) {
    console.error('Error in submitQuiz:', error);
    
    // Handle validation errors
    if (error.message.includes('Expected 10 responses') || 
        error.message.includes('Invalid') ||
        error.message.includes('Duplicate')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    next(error);
  }
}

/**
 * GET /api/quiz/results/:userId
 * Retrieve user's previous quiz results
 */
async function getResults(req, res, next) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const results = await getQuizResults(userId);

    if (!results) {
      return res.status(404).json({
        success: false,
        error: 'No quiz results found for this user'
      });
    }

    res.json({
      success: true,
      data: {
        score: results.score,
        level: results.level,
        completedAt: results.completedAt
      }
    });
  } catch (error) {
    console.error('Error in getResults:', error);
    next(error);
  }
}

/**
 * GET /api/quiz/analytics/:userId
 * Retrieve user's gamesPlayed and modulesCompleted
 */
async function getAnalytics(req, res, next) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    const User = require('../../../models/User');
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({
      success: true,
      data: {
        gamesPlayed: user.budgetGame.gamesPlayed,
        modulesCompleted: user.learningModules.modulesCompleted
      }
    });
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    next(error);
  }
}

module.exports = {
  getQuestions,
  submitQuiz,
  getResults,
  getAnalytics
};
