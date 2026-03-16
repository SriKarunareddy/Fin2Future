import express from 'express';
import {
  startLesson,
  updateProgress,
  getUserProgress,
  getProgressStats
} from '../controllers/progressController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/start', authenticate, startLesson);
router.post('/update', authenticate, updateProgress);
router.get('/user/:userId', authenticate, getUserProgress);
router.get('/stats/:userId', authenticate, getProgressStats);

export default router;
