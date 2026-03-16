/**
 * Express Server for Financial Literacy Quiz
 * 
 * Main entry point for the backend API server.
 */

require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const quizRoutes = require('./features/budget-game/routes/quiz.routes');
const authRoutes = require('../routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB for auth
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected for auth'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGO_URI not set; auth routes will fail if used');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Financial Literacy Quiz API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      questions: 'GET /api/quiz/questions',
      submit: 'POST /api/quiz/submit',
      results: 'GET /api/quiz/results/:userId'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Quiz API available at http://localhost:${PORT}/api/quiz`);
});

module.exports = app;
