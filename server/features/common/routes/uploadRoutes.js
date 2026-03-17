import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate, authorize } from '../../../middleware/auth.js';

import { mediaStorage } from '../../../config/cloudinary.js';

const router = express.Router();

const upload = multer({ 
  storage: process.env.CLOUDINARY_API_KEY ? mediaStorage : multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/lessons'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  })
});

router.post('/', authenticate, authorize('admin'), upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = req.file.path.startsWith('http') ? req.file.path : `/uploads/lessons/${req.file.filename}`;
  res.status(200).json({ success: true, url: fileUrl });
});

export default router;
