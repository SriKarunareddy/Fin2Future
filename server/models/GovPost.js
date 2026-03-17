import mongoose from 'mongoose';

const govPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    enum: ['Scheme', 'Budget', 'Taxation', 'Economic Trend', 'RBI Update'],
    default: 'Scheme'
  },
  tags: [String],
  sourceUrl: String,
  imageUrl: String,
  isHero: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const GovPost = mongoose.model('GovPost', govPostSchema);

export default GovPost;
