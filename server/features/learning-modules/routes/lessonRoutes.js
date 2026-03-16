import express from 'express';
import {
  getAllLessons,
  getLessonById,
  searchLessons,
  createLesson,
  updateLesson,
  deleteLesson
} from '../controllers/lessonController.js';
import { authenticate, authorize } from '../../../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllLessons);
router.get('/search', authenticate, searchLessons);
router.get('/:id', authenticate, getLessonById);
router.post('/', authenticate, authorize('admin'), createLesson);
router.put('/:id', authenticate, authorize('admin'), updateLesson);
router.delete('/:id', authenticate, authorize('admin'), deleteLesson);

export default router;
