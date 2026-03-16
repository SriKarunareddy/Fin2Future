import UserProgress from '../../../models/UserProgress.js';
import Lesson from '../../../models/Lesson.js';
import lessonService from './lessonService.js';

class ProgressService {
  async startLesson(userId, lessonId) {
    const isUnlocked = await lessonService.checkPrerequisite(lessonId, userId);
    
    if (!isUnlocked) {
      const lesson = await Lesson.findById(lessonId);
      const error = new Error('Lesson is locked. Complete the prerequisite first.');
      error.statusCode = 403;
      error.prerequisiteId = lesson.prerequisiteLessonId;
      throw error;
    }
    
    const existingProgress = await UserProgress.findOne({ userId, lessonId });
    if (existingProgress) {
      return existingProgress;
    }
    
    const progress = new UserProgress({
      userId,
      lessonId,
      progress: 0,
      completed: false
    });
    
    await progress.save();
    return progress;
  }

  async updateProgress(userId, lessonId, progressValue) {
    if (progressValue < 0 || progressValue > 100) {
      const error = new Error('Progress must be between 0 and 100');
      error.statusCode = 400;
      throw error;
    }
    
    const isUnlocked = await lessonService.checkPrerequisite(lessonId, userId);
    
    if (!isUnlocked) {
      const error = new Error('Cannot update progress for locked lesson');
      error.statusCode = 403;
      throw error;
    }
    
    const progress = await UserProgress.findOneAndUpdate(
      { userId, lessonId },
      { progress: progressValue },
      { new: true, upsert: true, runValidators: true }
    );
    
    return progress;
  }

  async getUserProgress(userId) {
    const progressRecords = await UserProgress.find({ userId })
      .populate('lessonId')
      .sort({ lastAccessed: -1 });
    
    return progressRecords;
  }

  async getProgressStats(userId) {
    const allLessons = await Lesson.countDocuments();
    const progressRecords = await UserProgress.find({ userId });
    
    const completed = progressRecords.filter(p => p.completed).length;
    const inProgress = progressRecords.filter(p => p.progress > 0 && p.progress < 100).length;
    const overallPercentage = allLessons > 0 ? Math.round((completed / allLessons) * 100) : 0;
    
    return {
      completed,
      inProgress,
      available: allLessons,
      overallPercentage
    };
  }

  async isLessonCompleted(userId, lessonId) {
    const progress = await UserProgress.findOne({ userId, lessonId });
    return progress && progress.completed;
  }

  async getLessonStatus(userId, lessonId) {
    const isUnlocked = await lessonService.checkPrerequisite(lessonId, userId);
    
    if (!isUnlocked) {
      return 'Locked';
    }
    
    const progress = await UserProgress.findOne({ userId, lessonId });
    
    if (!progress) {
      return 'Start';
    }
    
    if (progress.completed) {
      return 'Review';
    }
    
    if (progress.progress > 0) {
      return 'Continue';
    }
    
    return 'Start';
  }
}

export default new ProgressService();
