import Book from '../../../models/Book.js';
import path from 'path';
import fs from 'fs';

export const uploadBook = async (req, res, next) => {
  try {
    const { title, author, description, category } = req.body;
    
    if (!req.file) {
      const error = new Error('Please upload a PDF file');
      error.statusCode = 400;
      throw error;
    }

    // If using Cloudinary, req.file.path is the URL
    const pdfUrl = req.file.path.startsWith('http') ? req.file.path : `/uploads/books/${req.file.filename}`;

    const book = new Book({
      title,
      author,
      description,
      category,
      pdfUrl
    });

    await book.save();

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

export const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ uploadDate: -1 });
    res.status(200).json({
      success: true,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }

    // Delete file from disk or Cloudinary
    if (book.pdfUrl.includes('cloudinary')) {
      const { cloudinary } = await import('../../../config/cloudinary.js');
      const publicId = book.pdfUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`fin2future/books/${publicId}`, { resource_type: 'raw' });
    } else {
      const filePath = path.join(process.cwd(), book.pdfUrl.replace(/^\//, ''));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
