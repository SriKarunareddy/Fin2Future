import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Wallet, Target, AlertCircle, Plus, 
  ArrowUpRight, ArrowDownRight, IndianRupee, 
  ShoppingBag, Coffee, Car, BookOpen, Film, List, 
  PieChart as PieChartIcon, BarChart3, Activity, 
  Sparkles, Calendar, ChevronRight
} from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Entertainment', 'Others'];

export default function PersonalizedFinance({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [insights, setInsights] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budget, setBudget] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Form states
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    type: 'gadget'
  });

  const [showUpdateBudget, setShowUpdateBudget] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    monthlyIncome: '',
    savingsGoal: '',
    expenseLimits: {
        Food: 0, Travel: 0, Shopping: 0, Bills: 0, Education: 0, Entertainment: 0, Others: 0
    }
  });

  useEffect(() => {
    if (user?._id) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [anaRes, preRes, insRes, golRes, budRes, traRes] = await Promise.all([
        fetch(`/api/finance/analytics/${user._id}`).then(res => res.json()),
        fetch(`/api/finance/prediction/${user._id}`).then(res => res.json()),
        fetch(`/api/finance/insights/${user._id}`).then(res => res.json()),
        fetch(`/api/finance/goals/${user._id}`).then(res => res.json()),
        fetch(`/api/finance/budget/${user._id}`).then(res => res.json()),
        fetch(`/api/finance/transactions/${user._id}`).then(res => res.json())
      ]);

      if (anaRes.success) setAnalytics(anaRes.data);
      if (preRes.success) setPrediction(preRes.data);
      if (insRes.success) setInsights(insRes.data);
      if (golRes.success) setGoals(golRes.data);
      if (traRes.success) setTransactions(traRes.data);
      if (budRes.success && budRes.data) {
          setBudget(budRes.data);
          setBudgetForm({
              monthlyIncome: budRes.data.monthlyIncome || '',
              savingsGoal: budRes.data.savingsGoal || '',
              expenseLimits: budRes.data.expenseLimits || budgetForm.expenseLimits
          });
      }
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/finance/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTransaction, userId: user._id })
      });
      const data = await response.json();
      if (data.success) {
        setShowAddTransaction(false);
        setNewTransaction({ type: 'expense', category: 'Food', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
        fetchAllData();
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/finance/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newGoal, userId: user._id })
      });
      const data = await response.json();
      if (data.success) {
        setShowAddGoal(false);
        setNewGoal({ name: '', targetAmount: '', deadline: '', type: 'gadget' });
        fetchAllData();
      }
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/finance/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...budgetForm, userId: user._id })
      });
      const data = await response.json();
      if (data.success) {
        setShowUpdateBudget(false);
        fetchAllData();
      }
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const updateGoalProgress = async (goalId, amount) => {
    try {
      const response = await fetch('/api/finance/goal/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, amount: parseFloat(amount) })
      });
      const data = await response.json();
      if (data.success) {
        fetchAllData();
      }
    } catch (error) {
      console.error("Error updating goal progress:", error);
    }
  };

  // Prepare Chart Data
  const pieData = analytics ? Object.keys(analytics.categoryData).map((cat, i) => ({
    name: cat,
    value: analytics.categoryData[cat],
    color: COLORS[i % COLORS.length]
  })) : [];

  const barData = analytics ? Object.keys(analytics.monthlyData).map(month => ({
    name: month,
    amount: analytics.monthlyData[month]
  })) : [];

  const lineData = analytics ? Object.keys(analytics.dailyData).sort().map(day => ({
    name: day,
    amount: analytics.dailyData[day]
  })) : [];

  const predictionData = prediction ? prediction.forecast.map(f => ({
      name: `Day ${f.day}`,
      amount: Math.round(f.value)
  })) : [];

  if (loading && !analytics) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Personalized Finance
            </h1>
            <p className="text-slate-400 font-medium">Manage your money, reach your goals, and master your future.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowUpdateBudget(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-semibold text-sm"
            >
              <Wallet size={18} /> Budget Limits
            </button>
            <button 
              onClick={() => setShowAddTransaction(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-semibold text-sm"
            >
              <Plus size={18} /> Add Transaction
            </button>
          </div>
        </header>

        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 group hover:bg-white/[0.08] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                <IndianRupee size={24} />
              </div>
              <TrendingUp className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Income</p>
            <h3 className="text-3xl font-black">₹{analytics?.summary?.totalIncome?.toLocaleString() || '0'}</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 group hover:bg-white/[0.08] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl">
                <ShoppingBag size={24} />
              </div>
              <ArrowDownRight className="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Expenses</p>
            <h3 className="text-3xl font-black">₹{analytics?.summary?.totalExpense?.toLocaleString() || '0'}</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 group hover:bg-white/[0.08] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl">
                <Target size={24} />
              </div>
              <ArrowUpRight className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Savings</p>
            <h3 className="text-3xl font-black">₹{analytics?.summary?.savings?.toLocaleString() || '0'}</h3>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 w-full md:w-fit overflow-x-auto">
          {[
            { id: 'overview', icon: <PieChartIcon size={18} />, label: 'Analytics' },
            { id: 'prediction', icon: <Activity size={18} />, label: 'Predictions' },
            { id: 'goals', icon: <Target size={18} />, label: 'Saved Goals' },
            { id: 'insights', icon: <Sparkles size={18} />, label: 'AI Insights' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {activeTab === 'overview' && (
            <>
              {/* Category Breakdown */}
              <div className="lg:col-span-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-black mb-6">Category Breakdown</h3>
                <div className="h-64">
                   {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                   ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500">
                        <AlertCircle size={40} className="mb-2 opacity-20" />
                        <p>No expense data yet</p>
                    </div>
                   )}
                </div>
              </div>

              {/* Monthly Spending */}
              <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-black mb-6">Monthly Spending</h3>
                <div className="h-64">
                    {barData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                             <BarChart3 size={40} className="mb-2 opacity-20" />
                             <p>Monthly data will appear here</p>
                        </div>
                    )}
                </div>
              </div>

              {/* Daily Trend */}
              <div className="lg:col-span-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-black mb-6">Daily Expense Trend</h3>
                <div className="h-64">
                    {lineData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                            <AreaChart data={lineData}>
                                <defs>
                                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                             <Activity size={40} className="mb-2 opacity-20" />
                             <p>Daily trends will appear here after more logs</p>
                        </div>
                    )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'prediction' && (
            <>
              <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black">Future Expense Forecast</h3>
                    <div className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase">Predicted</div>
                </div>
                <div className="h-80">
                    {predictionData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                            <LineChart data={predictionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                             <Calendar size={60} className="mb-4 opacity-20 text-slate-600" />
                             <p className="text-lg">Need at least 2 days of transactions for forecasting</p>
                        </div>
                    )}
                </div>
              </div>

              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl">
                    <h4 className="text-lg font-bold mb-2">Next Month Prediction</h4>
                    <p className="text-white/70 mb-4">Based on your spending habits, we expect your expenses to be:</p>
                    <h2 className="text-5xl font-black mb-6">₹{(prediction?.predicted || 0).toLocaleString()}</h2>
                    <div className="bg-white/20 rounded-2xl p-4 flex items-start gap-4">
                        <Sparkles className="text-yellow-300 shrink-0" />
                        <p className="text-sm font-medium">Recommended monthly budget: ₹{((prediction?.predicted || 0) * 1.1).toFixed(0)}</p>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h4 className="font-bold mb-4 flex items-center gap-2"><Calendar size={20} className="text-slate-400" /> Recent Prediction Log</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition-all cursor-default">
                            <span className="text-slate-400 text-sm">Monthly Variance</span>
                            <span className="text-emerald-400 font-bold">+2.4%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition-all cursor-default">
                            <span className="text-slate-400 text-sm">Confidence Level</span>
                            <span className="text-indigo-400 font-bold">High</span>
                        </div>
                    </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'insights' && (
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {insights.length > 0 ? insights.map((insight, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles size={24} />
                        </div>
                        <p className="text-lg font-medium leading-relaxed mb-6 italic">"{insight}"</p>
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                            Learn more <ChevronRight size={16} />
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center">
                        <Sparkles size={60} className="mx-auto mb-4 text-slate-700" />
                        <h3 className="text-2xl font-bold text-slate-500">No AI insights generated yet.</h3>
                        <p className="text-slate-600">Start logging your daily expenses to see personalized patterns.</p>
                    </div>
                )}
            </div>
          )}

          {activeTab === 'goals' && (
            <>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        const remaining = goal.targetAmount - goal.currentAmount;
                        const deadline = new Date(goal.deadline);
                        const now = new Date();
                        const monthsLeft = Math.max(1, (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth()));
                        const recSaving = remaining / monthsLeft;

                        return (
                            <div key={goal._id} className="bg-white/5 border border-white/10 rounded-3xl p-8 border-l-4 border-l-indigo-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="text-xl font-black mb-1">{goal.name}</h4>
                                        <div className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-[10px] font-black uppercase inline-block">
                                            {goal.type}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-xs font-bold uppercase">Target</p>
                                        <p className="text-lg font-black italic">₹{goal.targetAmount?.toLocaleString() || '0'}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400 font-medium">Progress</span>
                                        <span className="text-white font-bold">{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
                                            style={{ width: `${Math.min(100, progress)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white/5 p-3 rounded-2xl">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Time Left</p>
                                        <p className="text-sm font-bold">{monthsLeft} Months</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-2xl">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Rec. Saving</p>
                                        <p className="text-sm font-bold text-emerald-400">₹{recSaving.toFixed(0)}/mo</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        placeholder="Add amt"
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                updateGoalProgress(goal._id, e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    />
                                    <button 
                                        onClick={() => setShowAddGoal(true)}
                                        className="bg-indigo-600/20 text-indigo-400 p-2 rounded-xl"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    
                    <button 
                         onClick={() => setShowAddGoal(true)}
                         className="bg-white/5 border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 group hover:border-indigo-500/50 hover:bg-white/[0.08] transition-all min-h-[300px]"
                    >
                        <div className="w-16 h-16 bg-white/5 text-slate-400 rounded-full flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                            <Plus size={32} />
                        </div>
                        <div className="text-center">
                            <h4 className="text-lg font-black mb-1">New Goal</h4>
                            <p className="text-slate-500 text-sm">Add a new financial milestone</p>
                        </div>
                    </button>
                </div>
            </>
          )}

        </div>

        {/* Transaction History (Small bottom section) */}
        <div className="mt-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">Recent Activity</h3>
                <button className="text-indigo-400 font-bold text-sm hover:underline">View All History</button>
            </div>
            <div className="space-y-4">
                {transactions.slice(0, 5).map(t => (
                    <div key={t._id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                            </div>
                            <div>
                                <p className="font-bold">{t.description || t.category}</p>
                                <p className="text-xs text-slate-500 font-medium">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-black ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                                {t.type === 'income' ? '+' : '-'} ₹{t.amount?.toLocaleString() || '0'}
                            </p>
                            <p className="text-[10px] text-slate-500 uppercase font-black">{t.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Modals */}
        {showAddTransaction && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddTransaction(false)}></div>
             <form onSubmit={handleAddTransaction} className="relative bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
               <h3 className="text-2xl font-black mb-6">Add Transaction</h3>
               <div className="space-y-4">
                 <div className="flex bg-white/5 p-1 rounded-xl">
                    <button 
                        type="button"
                        onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${newTransaction.type === 'expense' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
                    >Expense</button>
                    <button 
                        type="button"
                        onClick={() => setNewTransaction({...newTransaction, type: 'income', category: 'Income'})}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${newTransaction.type === 'income' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
                    >Income</button>
                 </div>
                 
                 {newTransaction.type === 'expense' && (
                    <div>
                        <label className="text-xs font-black uppercase text-slate-500 block mb-2">Category</label>
                        <select 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            value={newTransaction.category}
                            onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                        >
                            {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat}</option>)}
                        </select>
                    </div>
                 )}

                 <div>
                    <label className="text-xs font-black uppercase text-slate-500 block mb-2">Amount (₹)</label>
                    <input 
                        required
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                        placeholder="0.00"
                    />
                 </div>

                 <div>
                    <label className="text-xs font-black uppercase text-slate-500 block mb-2">Description</label>
                    <input 
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        placeholder="What was this for?"
                    />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                        type="button"
                        onClick={() => setShowAddTransaction(false)}
                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all"
                    >Cancel</button>
                    <button 
                        type="submit"
                        className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                    >Save</button>
                 </div>
               </div>
             </form>
           </div>
        )}

        {showAddGoal && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddGoal(false)}></div>
             <form onSubmit={handleAddGoal} className="relative bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
               <h3 className="text-2xl font-black mb-6">New Savings Goal</h3>
               <div className="space-y-4">
                 <div>
                    <label className="text-xs font-black uppercase text-slate-500 block mb-2">Goal Name</label>
                    <input 
                        required
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                        placeholder="Buying a Tesla, iPhone, etc."
                    />
                 </div>

                 <div>
                    <label className="text-xs font-black uppercase text-slate-500 block mb-2">Target Amount (₹)</label>
                    <input 
                        required
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        value={newGoal.targetAmount}
                        onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                        placeholder="0.00"
                    />
                 </div>

                 <div>
                    <label className="text-xs font-black uppercase text-slate-500 block mb-2">Deadline</label>
                    <input 
                        required
                        type="date"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    />
                 </div>

                 <div>
                    <label className="text-xs font-black uppercase text-slate-500 block mb-2">Type</label>
                    <select 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        value={newGoal.type}
                        onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                    >
                        <option value="gadget" className="bg-slate-900">Gadget</option>
                        <option value="travel" className="bg-slate-900">Travel</option>
                        <option value="emergency" className="bg-slate-900">Emergency Fund</option>
                        <option value="other" className="bg-slate-900">Other</option>
                    </select>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                        type="button"
                        onClick={() => setShowAddGoal(false)}
                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all"
                    >Cancel</button>
                    <button 
                        type="submit"
                        className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 font-bold hover:bg-indigo-700 transition-all"
                    >Create</button>
                 </div>
               </div>
             </form>
           </div>
        )}

        {showUpdateBudget && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowUpdateBudget(false)}></div>
             <form onSubmit={handleUpdateBudget} className="relative bg-slate-900 border border-white/10 p-8 rounded-[3rem] w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
               <h3 className="text-2xl font-black mb-6">Financial Setup</h3>
               <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-black uppercase text-slate-500 block mb-2">Monthly Income</label>
                        <input 
                            required
                            type="number"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            value={budgetForm.monthlyIncome}
                            onChange={(e) => setBudgetForm({...budgetForm, monthlyIncome: e.target.value})}
                            placeholder="Income"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase text-slate-500 block mb-2">Savings Goal</label>
                        <input 
                            required
                            type="number"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            value={budgetForm.savingsGoal}
                            onChange={(e) => setBudgetForm({...budgetForm, savingsGoal: e.target.value})}
                            placeholder="Goal"
                        />
                    </div>
                 </div>

                 <div>
                    <p className="text-xs font-black uppercase text-slate-500 mb-4">Expense Limits Per Category</p>
                    <div className="grid grid-cols-2 gap-4">
                        {CATEGORIES.map(cat => (
                            <div key={cat}>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{cat}</label>
                                <input 
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    value={budgetForm.expenseLimits[cat]}
                                    onChange={(e) => setBudgetForm({
                                        ...budgetForm, 
                                        expenseLimits: { ...budgetForm.expenseLimits, [cat]: e.target.value } 
                                    })}
                                    placeholder="Limit"
                                />
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                        type="button"
                        onClick={() => setShowUpdateBudget(false)}
                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all"
                    >Cancel</button>
                    <button 
                        type="submit"
                        className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 font-bold hover:bg-indigo-700 transition-all font-black"
                    >Update Financials</button>
                 </div>
               </div>
             </form>
           </div>
        )}

      </div>
    </div>
  );
}
