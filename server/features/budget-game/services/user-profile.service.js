/**
 * User Profile Service
 * 
 * Manages user profile data including quiz results.
 * Uses in-memory storage for demo purposes.
 * In production, this would connect to a database.
 */

// In-memory storage (replace with database in production)
const userProfiles = new Map();

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

    // Get existing profile or create new one
    let profile = userProfiles.get(userId) || {
      userId,
      quizResults: null
    };

    // Update quiz results
    profile.quizResults = {
      responses: results.responses,
      score: results.score,
      level: results.level,
      completedAt: results.completedAt
    };

    // Save profile
    userProfiles.set(userId, profile);

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

    const profile = userProfiles.get(userId);
    
    if (!profile || !profile.quizResults) {
      return null;
    }

    return profile.quizResults;
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
function clearAllProfiles() {
  userProfiles.clear();
  console.log('🗑️  Cleared all user profiles');
}

/**
 * Get all user profiles (for debugging)
 * @returns {Array} Array of all user profiles
 */
function getAllProfiles() {
  return Array.from(userProfiles.values());
}

module.exports = {
  saveQuizResults,
  getQuizResults,
  getUserLevel,
  clearAllProfiles,
  getAllProfiles
};
