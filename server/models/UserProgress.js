import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Lesson ID is required']
  },
  progress: {
    type: Number,
    required: true,
    min: [0, 'Progress cannot be less than 0'],
    max: [100, 'Progress cannot be greater than 100'],
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to ensure one progress record per user per lesson
userProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

// Index for querying user progress
userProgressSchema.index({ userId: 1 });

// Pre-save hook: Set completed = true when progress = 100
userProgressSchema.pre('save', function(next) {
  if (this.progress === 100) {
    this.completed = true;
  }
  next();
});

// Pre-save hook: Update lastAccessed timestamp
userProgressSchema.pre('save', function(next) {
  this.lastAccessed = Date.now();
  next();
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;
