/**
 * Progress Manager
 * 
 * Handles player progress persistence using localStorage.
 * Ready for future database integration.
 */

const STORAGE_KEY = 'financial_literacy_progress';

/**
 * Get player progress from storage
 */
export function getPlayerProgress(userId) {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    if (!stored) {
      return initializeProgress();
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading progress:', error);
    return initializeProgress();
  }
}

/**
 * Save player progress to storage
 */
export function savePlayerProgress(userId, progress) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
}

/**
 * Initialize new player progress
 */
function initializeProgress() {
  return {
    xp: 0,
    coins: 0,
    level: 1,
    badges: [],
    gamesPlayed: {},
    highScores: {},
    streaks: {
      current: 0,
      best: 0
    },
    achievements: []
  };
}

/**
 * Calculate XP for game performance
 */
export function calculateXP(score, timeBonus, streakMultiplier, difficulty) {
  const baseXP = score * 10;
  const timeBonusXP = timeBonus * 5;
  const streakBonusXP = streakMultiplier * 20;
  
  const difficultyMultiplier = {
    'Basic': 1,
    'Medium': 1.5,
    'Advanced': 2
  }[difficulty] || 1;

  return Math.floor((baseXP + timeBonusXP + streakBonusXP) * difficultyMultiplier);
}

/**
 * Calculate coins earned
 */
export function calculateCoins(score, difficulty) {
  const baseCoins = score * 5;
  
  const difficultyMultiplier = {
    'Basic': 1,
    'Medium': 2,
    'Advanced': 3
  }[difficulty] || 1;

  return Math.floor(baseCoins * difficultyMultiplier);
}

/**
 * Check and award badges
 */
export function checkBadges(progress, gameResult) {
  const newBadges = [];

  // Smart Starter - 100 XP in Basic
  if (progress.xp >= 100 && !progress.badges.includes('smart-starter')) {
    newBadges.push({
      id: 'smart-starter',
      name: 'Smart Starter',
      description: 'Earned 100 XP',
      icon: '🌟'
    });
  }

  // Decision Maker - Win a Medium game
  if (gameResult.difficulty === 'Medium' && gameResult.won && !progress.badges.includes('decision-maker')) {
    newBadges.push({
      id: 'decision-maker',
      name: 'Decision Maker',
      description: 'Won a Medium level game',
      icon: '⚡'
    });
  }

  // Wealth Strategist - Complete Advanced game
  if (gameResult.difficulty === 'Advanced' && gameResult.completed && !progress.badges.includes('wealth-strategist')) {
    newBadges.push({
      id: 'wealth-strategist',
      name: 'Wealth Strategist',
      description: 'Completed Advanced game',
      icon: '🏆'
    });
  }

  // Streak Master - 10 correct in a row
  if (gameResult.maxStreak >= 10 && !progress.badges.includes('streak-master')) {
    newBadges.push({
      id: 'streak-master',
      name: 'Streak Master',
      description: '10 correct answers in a row',
      icon: '🔥'
    });
  }

  return newBadges;
}

/**
 * Update game statistics
 */
export function updateGameStats(progress, gameName, result) {
  const updatedProgress = { ...progress };

  // Update games played count
  updatedProgress.gamesPlayed[gameName] = (updatedProgress.gamesPlayed[gameName] || 0) + 1;

  // Update high score
  if (!updatedProgress.highScores[gameName] || result.score > updatedProgress.highScores[gameName]) {
    updatedProgress.highScores[gameName] = result.score;
  }

  // Update streak
  if (result.streak > updatedProgress.streaks.best) {
    updatedProgress.streaks.best = result.streak;
  }

  return updatedProgress;
}

/**
 * Get level from XP
 */
export function getLevelFromXP(xp) {
  return Math.floor(xp / 100) + 1;
}

/**
 * Get XP needed for next level
 */
export function getXPForNextLevel(currentXP) {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevelXP = currentLevel * 100;
  return nextLevelXP - currentXP;
}
