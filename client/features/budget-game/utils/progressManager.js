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
 * Award XP for game completion
 */
export function awardGameXP(progress, gameName, difficulty, score, perfect = false) {
  const baseXP = {
    'Basic': 20,
    'Medium': 30,
    'Advanced': 50
  }[difficulty] || 20;

  const perfectBonus = perfect ? 10 : 0;
  const totalXP = baseXP + perfectBonus;

  const updatedProgress = {
    ...progress,
    xp: progress.xp + totalXP,
    gamesPlayed: {
      ...progress.gamesPlayed,
      [gameName]: (progress.gamesPlayed[gameName] || 0) + 1
    },
    highScores: {
      ...progress.highScores,
      [gameName]: Math.max(progress.highScores[gameName] || 0, score)
    }
  };

  return updatedProgress;
}

/**
 * Get level from XP
 */
export function getLevelFromXP(xp) {
  return Math.floor(xp / 100) + 1;
}

/**
 * Check if all medium level games are completed
 */
export function checkMediumLevelCompletion(progress) {
  const mediumGames = ['investment-garden', 'scam-detective'];
  const completedMediumGames = mediumGames.filter(gameId => progress.gamesCompleted?.includes(gameId));
  
  return {
    allCompleted: completedMediumGames.length === mediumGames.length,
    completedCount: completedMediumGames.length,
    totalCount: mediumGames.length
  };
}

/**
 * Award bonus XP for completing all medium level games
 */
export function awardMediumLevelBonus(progress) {
  const completion = checkMediumLevelCompletion(progress);
  if (completion.allCompleted && !progress.bonuses?.mediumLevelCompleted) {
    const bonusXP = 50;
    const updatedProgress = {
      ...progress,
      xp: progress.xp + bonusXP,
      bonuses: {
        ...progress.bonuses,
        mediumLevelCompleted: true
      },
      gamesCompleted: [...(progress.gamesCompleted || []), 'medium-level-bonus']
    };
    
    return updatedProgress;
  }
  return progress;
}

/**
 * Get XP needed for next level
 */
export function getXPForNextLevel(currentXP) {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevelXP = currentLevel * 100;
  return nextLevelXP - currentXP;
}
