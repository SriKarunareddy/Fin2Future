import Transaction from '../../../models/Transaction.js';
import Goal from '../../../models/Goal.js';
import Budget from '../../../models/Budget.js';
import { generateAIInsights } from '../services/aiInsightsService.js';

export const addTransaction = async (req, res) => {
  try {
    const { userId, type, category, amount, description, date } = req.body;
    const transaction = new Transaction({
      user: userId,
      type,
      category,
      amount,
      description,
      date: date || new Date()
    });
    await transaction.save();
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { userId, monthlyIncome, savingsGoal, expenseLimits } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { user: userId },
      { monthlyIncome, savingsGoal, expenseLimits },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBudget = async (req, res) => {
  try {
    const { userId } = req.params;
    const budget = await Budget.findOne({ user: userId });
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addGoal = async (req, res) => {
  try {
    const { userId, name, targetAmount, deadline, type } = req.body;
    const goal = new Goal({
      user: userId,
      name,
      targetAmount,
      deadline,
      type
    });
    await goal.save();
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGoals = async (req, res) => {
  try {
    const { userId } = req.params;
    const goals = await Goal.find({ user: userId });
    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGoalProgress = async (req, res) => {
  try {
    const { goalId, amount } = req.body;
    const goal = await Goal.findByIdAndUpdate(
      goalId,
      { $inc: { currentAmount: amount } },
      { new: true }
    );
    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ user: userId });

    // Category-wise Pie Chart Data
    const categoryData = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {});

    // Monthly Bar Chart Data
    const monthlyData = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => {
        const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + curr.amount;
        return acc;
      }, {});

    // Daily trends (Line Chart)
    const dailyData = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => {
        const day = new Date(curr.date).toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + curr.amount;
        return acc;
      }, {});

    const budget = await Budget.findOne({ user: userId });
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        categoryData,
        monthlyData,
        dailyData,
        summary: {
          totalIncome: budget ? budget.monthlyIncome : totalIncome,
          totalExpense,
          savings: (budget ? budget.monthlyIncome : totalIncome) - totalExpense
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPrediction = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ user: userId }).sort({ date: 1 });
    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    // Group by day for simple regression
    const dailyExpenses = expenseTransactions.reduce((acc, curr) => {
      const day = new Date(curr.date).toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + curr.amount;
      return acc;
    }, {});

    const days = Object.keys(dailyExpenses).sort();
    if (days.length < 2) {
      return res.status(200).json({ success: true, data: { predicted: 0, forecast: [] } });
    }
    const values = days.map(d => dailyExpenses[d]);
    
    // Simple Linear Regression calculation
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict next 30 days
    const forecast = [];
    for (let i = n; i < n + 30; i++) {
        const predictedVal = slope * i + intercept;
        forecast.push({ day: i - n + 1, value: Math.max(0, predictedVal) });
    }

    const nextMonthPredicted = forecast.reduce((sum, f) => sum + f.value, 0);

    res.status(200).json({
      success: true,
      data: {
        predicted: Math.round(nextMonthPredicted),
        forecast
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getInsights = async (req, res) => {
  try {
    const { userId } = req.params;
    const budget = await Budget.findOne({ user: userId });
    const transactions = await Transaction.find({ user: userId });
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // 🚀 ATTEMPT REAL AI INSIGHTS FIRST
    if (process.env.GEMINI_API_KEY) {
        const aiInsights = await generateAIInsights(transactions, budget);
        if (aiInsights && Array.isArray(aiInsights) && aiInsights.length > 0) {
            return res.status(200).json({ success: true, data: aiInsights });
        }
    }

    const insights = [];
    
    // Rule-based Fallback Insights
    // 1. Savings rate
    const totalIncome = budget ? budget.monthlyIncome : 0;
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    if (totalIncome > 0) {
      const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;
      insights.push(`Your savings rate this month is ${savingsRate.toFixed(1)}%.`);
    }

    // 2. Overspending in categories
    if (budget && budget.expenseLimits) {
      const catTotals = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {});

      for (const cat in budget.expenseLimits) {
        const limit = budget.expenseLimits[cat];
        const spent = catTotals[cat] || 0;
        if (limit > 0 && spent > limit) {
          const over = ((spent - limit) / limit) * 100;
          insights.push(`You spend ${over.toFixed(0)}% more on ${cat.toLowerCase()} compared to your budget.`);
        }
      }
    }

    // 3. Shoppping/Other advice
    const shoppingExp = expenses.filter(e => e.category === 'Shopping').reduce((sum, e) => sum + e.amount, 0);
    if (shoppingExp > 0) {
        insights.push(`Reducing shopping expenses by 10% can increase savings by ₹${(shoppingExp * 0.1).toFixed(0)}.`);
    }

    // Default Tips for New Users (so it's never empty)
    if (insights.length < 2) {
        if (!budget) insights.push("Setting up your monthly budget is the first step to financial freedom.");
        insights.push("Aim to save at least 20% of your income to build a healthy emergency fund.");
        insights.push("Regularly review your subscriptions to avoid paying for services you don't use.");
    }

    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
