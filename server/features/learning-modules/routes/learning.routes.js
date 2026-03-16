import express from 'express';
const router = express.Router();
import * as learningController from '../controllers/learning.controller.js';

// Skeleton route for learning modules progress
router.get('/progress/:userId', learningController.getProgress);
router.post('/complete', learningController.completeModule);

export default router;
