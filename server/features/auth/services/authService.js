import jwt from 'jsonwebtoken';
import User from '../../../models/User.js';

class AuthService {
  generateToken(userId, role) {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  async signup(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }
    
    const user = new User(userData);
    await user.save();
    
    const token = this.generateToken(user._id, user.role);
    
    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }

  async login(email, password) {
    // Hardcoded Admin Check
    if (email === 'admin@fin2future.com' && password === 'adminpassword123') {
      // Find or create the admin user in DB to ensure it has an ID
      let admin = await User.findOne({ email: 'admin@fin2future.com', role: 'admin' });
      if (!admin) {
        admin = new User({
          email: 'admin@fin2future.com',
          password: 'adminpassword123', // This will be hashed by the model pre-save hook
          name: 'System Admin',
          role: 'admin'
        });
        await admin.save();
      }

      const token = this.generateToken(admin._id, admin.role);
      return {
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        token
      };
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }
    
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }
    
    const token = this.generateToken(user._id, user.role);
    
    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      const err = new Error('Invalid or expired token');
      err.statusCode = 401;
      throw err;
    }
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    return user;
  }
}

export default new AuthService();
