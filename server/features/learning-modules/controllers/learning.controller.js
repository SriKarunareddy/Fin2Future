const User = require('../../../models/User');

exports.getProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    res.json({ success: true, data: user.learningModules });
  } catch (error) {
    next(error);
  }
};

exports.completeModule = async (req, res, next) => {
  try {
    const { userId, moduleId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    user.learningModules.modulesCompleted += 1;
    user.learningModules.progress.push({ moduleId, completedAt: new Date() });
    await user.save();
    
    res.json({ success: true, data: user.learningModules });
  } catch (error) {
    next(error);
  }
};
