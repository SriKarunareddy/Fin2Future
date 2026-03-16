/**
 * Scoring Engine Service
 * 
 * This service handles quiz scoring by comparing user responses to correct answers.
 * It validates response format and calculates the total score.
 */

import { getCorrectAnswer } from '../data/questions.js';

/**
 * Validate the format of a single response
 * @param {Object} response - The response object to validate
 * @returns {Object} Validation result with isValid and error properties
 */
function validateResponseFormat(response) {
  // Check if response is an object
  if (!response || typeof response !== 'object') {
    return {
      isValid: false,
      error: 'Response must be an object'
    };
  }

  // Check if questionId exists and is a number
  if (!response.questionId || typeof response.questionId !== 'number') {
    return {
      isValid: false,
      error: 'Response must have a valid questionId (number)'
    };
  }

  // Check if questionId is in valid range (1-10)
  if (response.questionId < 1 || response.questionId > 10) {
    return {
      isValid: false,
      error: 'questionId must be between 1 and 10'
    };
  }

  // Check if selectedOption exists and is a string
  if (!response.selectedOption || typeof response.selectedOption !== 'string') {
    return {
      isValid: false,
      error: 'Response must have a valid selectedOption (string)'
    };
  }

  // Check if selectedOption is one of A, B, C, D
  const validOptions = ['A', 'B', 'C', 'D'];
  if (!validOptions.includes(response.selectedOption)) {
    return {
      isValid: false,
      error: 'selectedOption must be one of: A, B, C, D'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Validate an array of responses
 * @param {Array} responses - Array of response objects
 * @returns {Object} Validation result with isValid, error, and invalidResponse properties
 */
function validateResponses(responses) {
  // Check if responses is an array
  if (!Array.isArray(responses)) {
    return {
      isValid: false,
      error: 'Responses must be an array',
      invalidResponse: null
    };
  }

  // Check if we have exactly 10 responses
  if (responses.length !== 10) {
    return {
      isValid: false,
      error: `Expected 10 responses, but received ${responses.length}`,
      invalidResponse: null
    };
  }

  // Validate each response
  for (let i = 0; i < responses.length; i++) {
    const validation = validateResponseFormat(responses[i]);
    if (!validation.isValid) {
      return {
        isValid: false,
        error: `Invalid response at index ${i}: ${validation.error}`,
        invalidResponse: responses[i]
      };
    }
  }

  // Check for duplicate question IDs
  const questionIds = responses.map(r => r.questionId);
  const uniqueIds = new Set(questionIds);
  if (uniqueIds.size !== questionIds.length) {
    return {
      isValid: false,
      error: 'Duplicate question IDs found in responses',
      invalidResponse: null
    };
  }

  // Check that all question IDs from 1-10 are present
  for (let id = 1; id <= 10; id++) {
    if (!questionIds.includes(id)) {
      return {
        isValid: false,
        error: `Missing response for question ${id}`,
        invalidResponse: null
      };
    }
  }

  return {
    isValid: true,
    error: null,
    invalidResponse: null
  };
}

/**
 * Check if a single answer is correct
 * @param {number} questionId - The ID of the question
 * @param {string} selectedOption - The user's selected option ("A", "B", "C", or "D")
 * @returns {boolean} True if the answer is correct, false otherwise
 */
function isAnswerCorrect(questionId, selectedOption) {
  // Validate inputs
  if (typeof questionId !== 'number' || questionId < 1 || questionId > 10) {
    throw new Error('Invalid questionId: must be a number between 1 and 10');
  }

  const validOptions = ['A', 'B', 'C', 'D'];
  if (typeof selectedOption !== 'string' || !validOptions.includes(selectedOption)) {
    throw new Error('Invalid selectedOption: must be one of A, B, C, D');
  }

  // Get the correct answer for this question
  const correctAnswer = getCorrectAnswer(questionId);
  
  if (!correctAnswer) {
    throw new Error(`No correct answer found for question ${questionId}`);
  }

  // Compare selected option to correct answer
  return selectedOption === correctAnswer;
}

/**
 * Calculate the total score for a set of quiz responses
 * @param {Array} responses - Array of response objects with questionId and selectedOption
 * @returns {number} The total score (0-10)
 * @throws {Error} If responses are invalid
 */
function calculateScore(responses) {
  // Validate responses format
  const validation = validateResponses(responses);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Calculate score by counting correct answers
  let score = 0;
  
  for (const response of responses) {
    try {
      if (isAnswerCorrect(response.questionId, response.selectedOption)) {
        score += 1;
      }
    } catch (error) {
      // If there's an error checking a specific answer, throw with context
      throw new Error(`Error checking answer for question ${response.questionId}: ${error.message}`);
    }
  }

  // Ensure score is in valid range (0-10)
  if (score < 0 || score > 10) {
    throw new Error(`Invalid score calculated: ${score}. Score must be between 0 and 10.`);
  }

  return score;
}

export {
  calculateScore,
  isAnswerCorrect,
  validateResponseFormat,
  validateResponses
};
