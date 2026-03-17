import express from 'express';
import {
  getAllGovPosts,
  createGovPost,
  deleteGovPost,
  getGovFinancialData
} from '../controllers/govController.js';
import { authenticate, authorize } from '../../../middleware/auth.js';

const router = express.Router();

router.get('/posts', getAllGovPosts);
router.get('/data', authenticate, getGovFinancialData);
router.post('/posts', authenticate, authorize('admin'), createGovPost);
router.delete('/posts/:id', authenticate, authorize('admin'), deleteGovPost);

export default router;
