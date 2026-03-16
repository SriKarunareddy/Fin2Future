import lessonService from '../services/lessonService.js';

export const getAllLessons = async (req, res, next) => {
  try {
    const filters = {};
    
    if (req.query.category) {
      filters.category = req.query.category;
    }
    
    const result = await lessonService.getAllLessons(filters);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getLessonById = async (req, res, next) => {
  try {
    const lesson = await lessonService.getLessonById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

export const searchLessons = async (req, res, next) => {
  try {
    const searchTerm = req.query.q || '';
    const filters = {};
    
    if (req.query.category) {
      filters.category = req.query.category;
    }
    
    const result = await lessonService.searchLessons(searchTerm, filters);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createLesson = async (req, res, next) => {
  try {
    const lesson = await lessonService.createLesson(req.body);
    
    res.status(201).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const lesson = await lessonService.updateLesson(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLesson = async (req, res, next) => {
  try {
    await lessonService.deleteLesson(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
