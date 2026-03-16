import Lesson from '../../../models/Lesson.js';
import UserProgress from '../../../models/UserProgress.js';

class LessonService {
  async getAllLessons(filters = {}) {
    const query = {};
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    const lessons = await Lesson.find(query).sort({ createdAt: -1 });
    const total = await Lesson.countDocuments(query);
    
    return { lessons, total };
  }

  async getLessonById(lessonId) {
    const lesson = await Lesson.findById(lessonId);
    
    if (!lesson) {
      const error = new Error('Lesson not found');
      error.statusCode = 404;
      throw error;
    }
    
    return lesson;
  }

  async searchLessons(searchTerm, filters = {}) {
    const query = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    };
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    const lessons = await Lesson.find(query).sort({ createdAt: -1 });
    const total = lessons.length;
    
    return { lessons, total };
  }

  async filterByCategory(category) {
    const lessons = await Lesson.find({ category }).sort({ createdAt: -1 });
    return lessons;
  }

  async checkPrerequisite(lessonId, userId) {
    const lesson = await Lesson.findById(lessonId);
    
    if (!lesson) {
      const error = new Error('Lesson not found');
      error.statusCode = 404;
      throw error;
    }
    
    if (!lesson.prerequisiteLessonId) {
      return true;
    }
    
    const prerequisiteProgress = await UserProgress.findOne({
      userId,
      lessonId: lesson.prerequisiteLessonId
    });
    
    return prerequisiteProgress && prerequisiteProgress.completed;
  }

  async createLesson(lessonData) {
    if (lessonData.prerequisiteLessonId) {
      await Lesson.validatePrerequisite(lessonData.prerequisiteLessonId);
    }
    
    const lesson = new Lesson(lessonData);
    await lesson.save();
    return lesson;
  }

  async updateLesson(lessonId, updateData) {
    if (updateData.prerequisiteLessonId) {
      await Lesson.validatePrerequisite(updateData.prerequisiteLessonId);
    }
    
    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!lesson) {
      const error = new Error('Lesson not found');
      error.statusCode = 404;
      throw error;
    }
    
    return lesson;
  }

  async deleteLesson(lessonId) {
    const lesson = await Lesson.findByIdAndDelete(lessonId);
    
    if (!lesson) {
      const error = new Error('Lesson not found');
      error.statusCode = 404;
      throw error;
    }
    
    return lesson;
  }
}

export default new LessonService();
