/**
 * Quiz Routes
 * 
 * This module defines the Express router for quiz-related API endpoints.
 * 
 * Routes:
 * - GET /api/quiz/questions - Retrieve all quiz questions (without correct answers)
 * - POST /api/quiz/submit - Submit quiz responses and receive score and level
 * - GET /api/quiz/results/:userId - Retrieve user's previous quiz results
 */

const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

/**
 * GET /api/quiz/questions
 * 
 * Retrieve all quiz questions without correct answers for client-side display.
 * 
 * Response:
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: 1,
 *       text: "What is a budget?",
 *       options: {
 *         A: "A plan for spending and saving money",
 *         B: "A type of bank account",
 *         C: "A credit card limit",
 *         D: "A loan payment"
 *       }
 *     },
 *     // ... 9 more questions
 *   ]
 * }
 */
router.get('/questions', quizController.getQuestions);

/**
 * POST /api/quiz/submit
 * 
 * Submit quiz responses and receive calculated score and assigned level.
 * 
 * Request Body:
 * {
 *   userId: "string",
 *   responses: [
 *     { questionId: 1, selectedOption: "A" },
 *     { questionId: 2, selectedOption: "C" },
 *     // ... 10 responses total
 *   ]
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   data: {
 *     score: 7,
 *     level: "Medium",
 *     responses: [...],
 *     completedAt: "2026-02-10T12:00:00Z"
 *   }
 * }
 */
router.post('/submit', quizController.submitQuiz);

/**
 * GET /api/quiz/results/:userId
 * 
 * Retrieve a user's previous quiz results.
 * 
 * URL Parameters:
 * - userId: The unique identifier of the user
 * 
 * Response:
 * {
 *   success: true,
 *   data: {
 *     score: 7,
 *     level: "Medium",
 *     completedAt: "2026-02-10T12:00:00Z"
 *   }
 * }
 */
router.get('/results/:userId', quizController.getResults);

module.exports = router;
