/**
 * Level Assignment Engine Service
 * 
 * This service handles assigning user levels (Basic, Medium, Advanced) based on quiz scores.
 * It uses configurable thresholds to determine the appropriate level for each score.
 */

/**
 * Level threshold configuration
 * Defines the score ranges for each proficiency level
 */
const LEVEL_THRESHOLDS = {
  BASIC: { min: 0, max: 3 },
  MEDIUM: { min: 4, max: 7 },
  ADVANCED: { min: 8, max: 10 }
};

/**
 * Assign a user level based on quiz score
 * @param {number} score - The quiz score (0-10)
 * @returns {string} The assigned level ("Basic", "Medium", or "Advanced")
 * @throws {Error} If score is invalid
 */
function assignLevel(score) {
  // Validate score input
  if (typeof score !== 'number') {
    throw new Error('Score must be a number');
  }

  if (!Number.isInteger(score)) {
    throw new Error('Score must be an integer');
  }

  if (score < 0 || score > 10) {
    throw new Error('Score must be between 0 and 10');
  }

  // Assign level based on score thresholds
  if (score >= LEVEL_THRESHOLDS.BASIC.min && score <= LEVEL_THRESHOLDS.BASIC.max) {
    return 'Basic';
  }

  if (score >= LEVEL_THRESHOLDS.MEDIUM.min && score <= LEVEL_THRESHOLDS.MEDIUM.max) {
    return 'Medium';
  }

  if (score >= LEVEL_THRESHOLDS.ADVANCED.min && score <= LEVEL_THRESHOLDS.ADVANCED.max) {
    return 'Advanced';
  }

  // This should never happen if thresholds are configured correctly
  throw new Error(`Unable to assign level for score ${score}. Check LEVEL_THRESHOLDS configuration.`);
}

/**
 * Get the level threshold configuration
 * @returns {Object} The level thresholds object
 */
function getLevelThresholds() {
  // Return a deep copy to prevent external modification
  return {
    BASIC: { ...LEVEL_THRESHOLDS.BASIC },
    MEDIUM: { ...LEVEL_THRESHOLDS.MEDIUM },
    ADVANCED: { ...LEVEL_THRESHOLDS.ADVANCED }
  };
}

export {
  assignLevel,
  getLevelThresholds,
  LEVEL_THRESHOLDS
};
