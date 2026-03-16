/**
 * Express Server for Financial Literacy Quiz
 * 
 * Main entry point for the backend API server.
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./features/budget-game/routes/quiz.routes');
const learningRoutes = require('./features/learning-modules/routes/learning.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/learning', learningRoutes);

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

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/fin2future")
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 Quiz API available at http://localhost:${PORT}/api/quiz`);
      console.log(`🧠 Learning API available at http://localhost:${PORT}/api/learning`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

module.exports = app;
