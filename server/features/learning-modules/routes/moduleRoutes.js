import express from 'express';
import {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule
} from '../controllers/moduleController.js';
import { authenticate, authorize } from '../../../middleware/auth.js';

const router = express.Router();

router.get('/', getAllModules);
router.get('/:id', getModuleById);
router.post('/', authenticate, authorize('admin'), createModule);
router.put('/:id', authenticate, authorize('admin'), updateModule);
router.delete('/:id', authenticate, authorize('admin'), deleteModule);

export default router;
