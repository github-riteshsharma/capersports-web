const jwt = require('jsonwebtoken');

// Protect routes - Authentication middleware (Azure version)
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get Azure Cosmos service
      const azureCosmosService = req.app.locals.azureCosmosService;
      if (!azureCosmosService) {
        return res.status(500).json({
          success: false,
          message: 'Database service not available',
        });
      }

      const usersCollection = await azureCosmosService.getCollection('users');
      const { ObjectId } = require('mongodb');

      // Get user from token using Azure Cosmos DB
      const user = await usersCollection.findOne({ 
        _id: new ObjectId(decoded.id) 
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated',
        });
      }

      // Remove password from user object
      delete user.password;
      req.user = user;

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, invalid token',
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, token expired',
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized as admin',
    });
  }
};

// Optional auth middleware (for routes that work with or without auth) - Azure version
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get Azure Cosmos service
      const azureCosmosService = req.app.locals.azureCosmosService;
      if (azureCosmosService) {
        const usersCollection = await azureCosmosService.getCollection('users');
        const { ObjectId } = require('mongodb');
        
        const user = await usersCollection.findOne({ 
          _id: new ObjectId(decoded.id) 
        });
        
        if (user && user.isActive) {
          delete user.password;
          req.user = user;
        }
      }
    } catch (error) {
      // If token is invalid, just continue without user
      req.user = null;
    }
  }

  next();
};

module.exports = { protect, admin, optionalAuth };
