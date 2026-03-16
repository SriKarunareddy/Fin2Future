const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learning.controller');

// Skeleton route for learning modules progress
router.get('/progress/:userId', learningController.getProgress);
router.post('/complete', learningController.completeModule);

module.exports = router;
