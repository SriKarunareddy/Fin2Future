/**
 * Quiz API Client
 * 
 * Handles all HTTP requests to the quiz backend API.
 * Uses fetch API for making RESTful API calls.
 */

const API_BASE_URL = '/api/quiz';

function authHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = token;
  }
  return headers;
}

/**
 * Handle API response and errors
 * @param {Response} response - Fetch API response object
 * @returns {Promise<Object>} Parsed JSON data
 * @throws {Error} If response is not ok
 */
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred while processing your request'
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * Quiz API methods
 */
export const quizApi = {
  /**
   * Fetch all quiz questions (without correct answers)
   * @returns {Promise<Object>} Response with questions array
   */
  async getQuestions() {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'GET',
        headers: authHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  /**
   * Submit quiz responses and get results
   * @param {string} userId - User identifier
   * @param {Array} responses - Array of response objects with questionId and selectedOption
   * @returns {Promise<Object>} Response with score, level, and completion data
   */
  async submitQuiz(userId, responses) {
    try {
      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userId,
          responses
        })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  },

  /**
   * Get user's previous quiz results
   * @param {string} userId - User identifier
   * @returns {Promise<Object>} Response with user's quiz results
   */
  async getResults(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/results/${userId}`, {
        method: 'GET',
        headers: authHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  }
};

export default quizApi;
