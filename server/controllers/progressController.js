import progressService from '../services/progressService.js';

export const startLesson = async (req, res, next) => {
  try {
    const { userId, lessonId } = req.body;
    
    if (!userId || !lessonId) {
      const error = new Error('userId and lessonId are required');
      error.statusCode = 400;
      throw error;
    }
    
    const progress = await progressService.startLesson(userId, lessonId);
    
    res.status(201).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const { userId, lessonId, progress } = req.body;
    
    if (!userId || !lessonId || progress === undefined) {
      const error = new Error('userId, lessonId, and progress are required');
      error.statusCode = 400;
      throw error;
    }
    
    const updatedProgress = await progressService.updateProgress(userId, lessonId, progress);
    
    res.status(200).json({
      success: true,
      data: updatedProgress
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const progressRecords = await progressService.getUserProgress(userId);
    
    res.status(200).json({
      success: true,
      data: progressRecords
    });
  } catch (error) {
    next(error);
  }
};

export const getProgressStats = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const stats = await progressService.getProgressStats(userId);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
