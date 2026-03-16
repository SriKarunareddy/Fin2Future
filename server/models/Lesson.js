import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Budgeting', 'Saving', 'Credit', 'Investing', 'Debt', 'Housing'],
      message: '{VALUE} is not a valid category'
    }
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced'],
      message: '{VALUE} is not a valid level'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be a positive number']
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  prerequisiteLessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
lessonSchema.index({ category: 1 });
lessonSchema.index({ level: 1 });
lessonSchema.index({ createdAt: -1 });

// Static method to validate prerequisite exists
lessonSchema.statics.validatePrerequisite = async function(prerequisiteId) {
  if (!prerequisiteId) return true;
  
  const prerequisite = await this.findById(prerequisiteId);
  if (!prerequisite) {
    throw new Error('Prerequisite lesson does not exist');
  }
  return true;
};

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
