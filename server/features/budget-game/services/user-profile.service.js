/**
 * User Profile Service
 * 
 * Manages user profile data including quiz results.
 * Connects to MongoDB to persist data.
 */

import User from '../../../models/User.js';

/**
 * Save quiz results to user profile
 * @param {string} userId - User identifier
 * @param {Object} results - Quiz results object
 * @returns {Promise<void>}
 */
async function saveQuizResults(userId, results) {
  try {
    if (!userId) {
      throw new Error('userId is required');
    }

    if (!results) {
      throw new Error('results object is required');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update budget game stats
    user.budgetGame.gamesPlayed += 1;
    user.budgetGame.score = results.score;
    user.budgetGame.level = results.level;
    
    // Store the specific result
    user.budgetGame.results.push({
      responses: results.responses,
      score: results.score,
      level: results.level,
      completedAt: results.completedAt
    });

    await user.save();

    console.log(`✅ Saved quiz results for user: ${userId}, Score: ${results.score}, Level: ${results.level}`);
  } catch (error) {
    console.error('Error saving quiz results:', error);
    throw error;
  }
}

/**
 * Get user's quiz results
 * @param {string} userId - User identifier
 * @returns {Promise<Object|null>} Quiz results or null if not found
 */
async function getQuizResults(userId) {
  try {
    if (!userId) {
      throw new Error('userId is required');
    }

    const user = await User.findById(userId);
    
    if (!user || user.budgetGame.results.length === 0) {
      return null;
    }

    // Return most recent result
    return user.budgetGame.results[user.budgetGame.results.length - 1];
  } catch (error) {
    console.error('Error getting quiz results:', error);
    throw error;
  }
}

/**
 * Get user's assigned level
 * @param {string} userId - User identifier
 * @returns {Promise<string|null>} User level or null if not found
 */
async function getUserLevel(userId) {
  try {
    if (!userId) {
      throw new Error('userId is required');
    }

    const results = await getQuizResults(userId);
    
    if (!results) {
      return null;
    }

    return results.level;
  } catch (error) {
    console.error('Error getting user level:', error);
    throw error;
  }
}

/**
 * Clear all user profiles (for testing)
 * @returns {void}
 */
async function clearAllProfiles() {
  await User.updateMany({}, {
    $set: {
      budgetGame: { score: 0, level: 'Beginner', gamesPlayed: 0, results: [] }
    }
  });
  console.log('🗑️  Cleared all user budgetGame profiles');
}

/**
 * Get all user profiles (for debugging)
 * @returns {Array} Array of all user profiles
 */
async function getAllProfiles() {
  return await User.find({});
}

export {
  saveQuizResults,
  getQuizResults,
  getUserLevel,
  clearAllProfiles,
  getAllProfiles
};
