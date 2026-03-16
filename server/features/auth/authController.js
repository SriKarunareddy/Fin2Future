import authService from '../../services/authService.js';

export const signup = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    
    if (!email || !password || !name) {
      const error = new Error('Email, password, and name are required');
      error.statusCode = 400;
      throw error;
    }
    
    const result = await authService.signup({ email, password, name, role });
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }
    
    const result = await authService.login(email, password);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    // req.user is set by authMiddleware
    const user = await authService.getUserById(req.user.userId);
    
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
