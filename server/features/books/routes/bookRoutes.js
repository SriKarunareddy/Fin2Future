import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadBook, getBooks, deleteBook } from '../controllers/bookController.js';
import { authenticate, authorize } from '../../../middleware/auth.js';

import { bookStorage } from '../../../config/cloudinary.js';

const router = express.Router();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Use Cloudinary storage if configured, else fallback to disk (handled by a unified logic)
const upload = multer({ 
  storage: process.env.CLOUDINARY_API_KEY ? bookStorage : multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/books'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Public routes
router.get('/', getBooks);

// Admin only routes
router.post('/upload', authenticate, authorize('admin'), upload.single('book'), uploadBook);
router.delete('/:id', authenticate, authorize('admin'), deleteBook);

export default router;
