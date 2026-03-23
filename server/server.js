import './config/env.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import authRoutes from './features/auth/routes/authRoutes.js';
import lessonRoutes from './features/learning-modules/routes/lessonRoutes.js';
import progressRoutes from './features/learning-modules/routes/progressRoutes.js';
import quizRoutes from './features/budget-game/routes/quiz.routes.js';
import learningRoutes from './features/learning-modules/routes/learning.routes.js';
import financeRoutes from './features/personalized-finance/routes/finance.routes.js';
import bookRoutes from './features/books/routes/bookRoutes.js';
import moduleRoutes from './features/learning-modules/routes/moduleRoutes.js';
import govRoutes from './features/gov-finance/routes/govRoutes.js';
import uploadRoutes from './features/common/routes/uploadRoutes.js';
import chatRoutes from './features/chat/routes/chatRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/gov', govRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Financial Literacy API is running' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
