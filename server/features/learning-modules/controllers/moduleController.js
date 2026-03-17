import Module from '../../../models/Module.js';
import Lesson from '../../../models/Lesson.js';

export const createModule = async (req, res, next) => {
  try {
    const module = new Module(req.body);
    await module.save();
    res.status(201).json({ success: true, data: module });
  } catch (error) {
    next(error);
  }
};

export const getAllModules = async (req, res, next) => {
  try {
    const modules = await Module.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    next(error);
  }
};

export const getModuleById = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      const error = new Error('Module not found');
      error.statusCode = 404;
      throw error;
    }
    const lessons = await Lesson.find({ moduleId: module._id }).sort({ order: 1 });
    res.status(200).json({ success: true, data: { ...module._doc, lessons } });
  } catch (error) {
    next(error);
  }
};

export const updateModule = async (req, res, next) => {
  try {
    const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: module });
  } catch (error) {
    next(error);
  }
};

export const deleteModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      const error = new Error('Module not found');
      error.statusCode = 404;
      throw error;
    }
    // Delete associated lessons
    await Lesson.deleteMany({ moduleId: module._id });
    await module.deleteOne();
    res.status(200).json({ success: true, message: 'Module and its lessons deleted' });
  } catch (error) {
    next(error);
  }
};
