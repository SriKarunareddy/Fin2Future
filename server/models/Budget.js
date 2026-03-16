import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  monthlyIncome: {
    type: Number,
    required: true
  },
  savingsGoal: {
    type: Number,
    required: true
  },
  expenseLimits: {
    Food: { type: Number, default: 0 },
    Travel: { type: Number, default: 0 },
    Shopping: { type: Number, default: 0 },
    Bills: { type: Number, default: 0 },
    Education: { type: Number, default: 0 },
    Entertainment: { type: Number, default: 0 },
    Others: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model('Budget', budgetSchema);
