import express from 'express';
import {
  addTransaction,
  getTransactions,
  updateBudget,
  getBudget,
  addGoal,
  getGoals,
  updateGoalProgress,
  getAnalytics,
  getPrediction,
  getInsights
} from '../controllers/finance.controller.js';

const router = express.Router();

router.post('/transaction', addTransaction);
router.get('/transactions/:userId', getTransactions);
router.post('/budget', updateBudget);
router.get('/budget/:userId', getBudget);
router.post('/goal', addGoal);
router.get('/goals/:userId', getGoals);
router.post('/goal/progress', updateGoalProgress);
router.get('/analytics/:userId', getAnalytics);
router.get('/prediction/:userId', getPrediction);
router.get('/insights/:userId', getInsights);

export default router;
