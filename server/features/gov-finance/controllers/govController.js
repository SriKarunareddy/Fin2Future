import GovPost from '../../../models/GovPost.js';
import govApiService from '../services/govApiService.js';
import Transaction from '../../../models/Transaction.js';

export const getAllGovPosts = async (req, res, next) => {
  try {
    const posts = await GovPost.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

export const createGovPost = async (req, res, next) => {
  try {
    const post = new GovPost(req.body);
    await post.save();
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const deleteGovPost = async (req, res, next) => {
  try {
    const post = await GovPost.findByIdAndDelete(req.params.id);
    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

export const getGovFinancialData = async (req, res, next) => {
  try {
    const trends = await govApiService.getEconomicTrends();
    
    // Fetch user's data for comparison if userId is present
    let personalizedInsights = null;
    if (req.user) {
      const userTransactions = await Transaction.find({ userId: req.user._id });
      // Calculate basic comparison (e.g., user vs headline inflation)
      // This is a simplified logic
      const totalSpent = userTransactions.reduce((acc, curr) => acc + curr.amount, 0);
      personalizedInsights = {
        spendingVsInflation: `Inflation is at ${trends.inflation.headline}%. Based on your recent transactions, your spending trend is ${totalSpent > 0 ? 'active' : 'stable'}.`,
        taxImpact: 'The 2024 budget standard deduction of ₹75,000 could benefit your taxable income profile.',
        recommendation: totalSpent > 50000 ? 'Consider Diversified Index Funds as investing trends show growth in the infra sector.' : 'Focus on building your emergency fund alongside saving schemes like PPF.'
      };
    }

    res.status(200).json({
      success: true,
      data: {
        trends,
        personalizedInsights
      }
    });
  } catch (error) {
    next(error);
  }
};
