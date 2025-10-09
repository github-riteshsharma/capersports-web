const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, admin } = require('../middleware/auth-azure'); // Use Azure auth middleware

const router = express.Router();

// All routes are protected and require admin role
router.use(protect, admin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data - Azure version
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get collections
    const productsCollection = await azureCosmosService.getCollection('products');
    const usersCollection = await azureCosmosService.getCollection('users');
    const ordersCollection = await azureCosmosService.getCollection('orders');

    // OPTIMIZATION: Run all queries in parallel using Promise.all
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      monthlyOrders,
      yearlyOrders,
      monthlyRevenue,
      yearlyRevenue,
      recentOrders,
      topProducts,
      lowStockProducts,
      monthlySales
    ] = await Promise.all([
      // Total counts
      productsCollection.countDocuments({ isActive: true }),
      usersCollection.countDocuments(),
      ordersCollection.countDocuments(),
      
      // Monthly/Yearly stats
      ordersCollection.countDocuments({ createdAt: { $gte: startOfMonth } }),
      ordersCollection.countDocuments({ createdAt: { $gte: startOfYear } }),
      
      // Monthly revenue
      ordersCollection.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
            status: { $in: ['delivered', 'completed', 'paid'] }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]).toArray(),
      
      // Yearly revenue
      ordersCollection.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear },
            status: { $in: ['delivered', 'completed', 'paid'] }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]).toArray(),
      
      // Recent orders - with projection to limit fields
      ordersCollection.find({}, {
        projection: {
          _id: 1,
          user: 1,
          totalAmount: 1,
          status: 1,
          createdAt: 1,
          orderItems: { $slice: ['$orderItems', 3] } // Limit to first 3 items
        }
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray(),
      
      // Top products - with projection
      productsCollection.find(
        { isActive: true },
        {
          projection: {
            _id: 1,
            name: 1,
            price: 1,
            images: { $slice: ['$images', 1] }, // Only first image
            'ratings.average': 1,
            'ratings.count': 1,
            totalStock: 1,
            category: 1
          }
        }
      )
      .sort({ 'ratings.average': -1 })
      .limit(5)
      .toArray(),
      
      // Low stock products - with projection
      productsCollection.find(
        {
          isActive: true,
          totalStock: { $lt: 10 }
        },
        {
          projection: {
            _id: 1,
            name: 1,
            totalStock: 1,
            images: { $slice: ['$images', 1] }, // Only first image
            category: 1,
            price: 1
          }
        }
      )
      .sort({ totalStock: 1 })
      .limit(10)
      .toArray(),
      
      // Monthly sales chart
      ordersCollection.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
            status: { $in: ['delivered', 'completed', 'paid'] }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        },
        {
          $limit: 6 // Only last 6 months
        }
      ]).toArray()
    ]);

    res.json({
      success: true,
      dashboard: {
        totalProducts,
        totalUsers,
        totalOrders,
        monthlyOrders,
        yearlyOrders,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        yearlyRevenue: yearlyRevenue[0]?.total || 0,
        recentOrders,
        topProducts,
        lowStockProducts,
        monthlySales: monthlySales.map(item => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          revenue: item.revenue,
          orders: item.orders
        }))
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data',
      error: error.message
    });
  }
});

// @route   GET /api/admin/stats
// @desc    Get quick stats for admin dashboard
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    // Get collections
    const productsCollection = await azureCosmosService.getCollection('products');
    const usersCollection = await azureCosmosService.getCollection('users');
    const ordersCollection = await azureCosmosService.getCollection('orders');

    // Get quick stats
    const [totalProducts, totalUsers, totalOrders, pendingOrders] = await Promise.all([
      productsCollection.countDocuments({ isActive: true }),
      usersCollection.countDocuments(), // Count all users including admins
      ordersCollection.countDocuments(),
      ordersCollection.countDocuments({ status: 'pending' })
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        pendingOrders
      }
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats',
      error: error.message
    });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products for admin - Azure version
// @access  Private/Admin
router.get('/products', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const productsCollection = await azureCosmosService.getCollection('products');

    // Build query filters
    const query = {};
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { category: searchRegex }
      ];
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    // Sort options
    let sortOption = {};
    switch (req.query.sortBy) {
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'price':
        sortOption = { price: 1 };
        break;
      case 'createdAt':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Execute query
    const products = await productsCollection
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await productsCollection.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      products
    });

  } catch (error) {
    console.error('Admin get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: error.message
    });
  }
});

// @route   POST /api/admin/products
// @desc    Create new product - Azure version
// @access  Private/Admin
router.post('/products', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const productsCollection = await azureCosmosService.getCollection('products');

    // Create product data
    const productData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      rating: 0,
      numReviews: 0,
      ratings: {
        average: 0,
        count: 0
      },
      reviews: []
    };

    const result = await productsCollection.insertOne(productData);
    
    // Get the created product
    const createdProduct = await productsCollection.findOne({ _id: result.insertedId });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: createdProduct
    });

  } catch (error) {
    console.error('Admin create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update product - Azure version
// @access  Private/Admin
router.put('/products/:id', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const productsCollection = await azureCosmosService.getCollection('products');
    const { ObjectId } = require('mongodb');

    // Convert string ID to ObjectId
    let productId;
    try {
      productId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    // Update product data
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const result = await productsCollection.updateOne(
      { _id: productId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get the updated product
    const updatedProduct = await productsCollection.findOne({ _id: productId });

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Admin update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete product - Azure version
// @access  Private/Admin
router.delete('/products/:id', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const productsCollection = await azureCosmosService.getCollection('products');
    const { ObjectId } = require('mongodb');

    // Convert string ID to ObjectId
    let productId;
    try {
      productId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const result = await productsCollection.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Admin delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
      error: error.message
    });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders for admin - Azure version
// @access  Private/Admin
router.get('/orders', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const ordersCollection = await azureCosmosService.getCollection('orders');

    // Build query filters
    const query = {};
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by payment status
    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    // Sort options
    let sortOption = {};
    switch (req.query.sortBy) {
      case 'totalAmount':
        sortOption = { totalAmount: -1 };
        break;
      case 'status':
        sortOption = { status: 1 };
        break;
      case 'createdAt':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Execute query
    const orders = await ordersCollection
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await ordersCollection.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders
    });

  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/orders/:id
// @desc    Update order status - Azure version
// @access  Private/Admin
router.put('/orders/:id', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const ordersCollection = await azureCosmosService.getCollection('orders');
    const { ObjectId } = require('mongodb');

    // Convert string ID to ObjectId
    let orderId;
    try {
      orderId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    // Update order data
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const result = await ordersCollection.updateOne(
      { _id: orderId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get the updated order
    const updatedOrder = await ordersCollection.findOne({ _id: orderId });

    res.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Admin update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for admin - Azure version
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const usersCollection = await azureCosmosService.getCollection('users');

    // Build query filters
    const query = {};
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex }
      ];
    }

    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    // Sort options
    let sortOption = {};
    switch (req.query.sortBy) {
      case 'firstName':
        sortOption = { firstName: 1 };
        break;
      case 'email':
        sortOption = { email: 1 };
        break;
      case 'createdAt':
        sortOption = { createdAt: -1 };
        break;
      case 'lastLogin':
        sortOption = { lastLogin: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Execute query (exclude password field)
    const users = await usersCollection
      .find(query, { projection: { password: 0 } })
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await usersCollection.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users
    });

  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user - Azure version
// @access  Private/Admin
router.put('/users/:id', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const usersCollection = await azureCosmosService.getCollection('users');
    const { ObjectId } = require('mongodb');

    // Convert string ID to ObjectId
    let userId;
    try {
      userId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Update user data (exclude password updates for security)
    const { password, ...updateData } = req.body;
    updateData.updatedAt = new Date();

    const result = await usersCollection.updateOne(
      { _id: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get the updated user (exclude password)
    const updatedUser = await usersCollection.findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user - Azure version
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const usersCollection = await azureCosmosService.getCollection('users');
    const { ObjectId } = require('mongodb');

    // Convert string ID to ObjectId
    let userId;
    try {
      userId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Check if user exists and is not admin
    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    const result = await usersCollection.deleteOne({ _id: userId });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role - Azure version
// @access  Private/Admin
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }

    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const usersCollection = await azureCosmosService.getCollection('users');
    const { ObjectId } = require('mongodb');

    // Convert string ID to ObjectId
    let userId;
    try {
      userId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Update user role
    const result = await usersCollection.updateOne(
      { _id: userId },
      { 
        $set: { 
          role: role,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get the updated user (exclude password)
    const updatedUser = await usersCollection.findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );

    res.json({
      success: true,
      message: 'User role updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user role',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/deactivate
// @desc    Deactivate user - Azure version
// @access  Private/Admin
router.put('/users/:id/deactivate', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const usersCollection = await azureCosmosService.getCollection('users');
    const { ObjectId } = require('mongodb');

    // Convert string ID to ObjectId
    let userId;
    try {
      userId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Check if user exists and is not admin
    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot deactivate admin users'
      });
    }

    // Deactivate user
    const result = await usersCollection.updateOne(
      { _id: userId },
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date()
        }
      }
    );

    // Get the updated user (exclude password)
    const updatedUser = await usersCollection.findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );

    res.json({
      success: true,
      message: 'User deactivated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deactivating user',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/activate
// @desc    Activate user - Azure version
// @access  Private/Admin
router.put('/users/:id/activate', async (req, res) => {
  try {
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const usersCollection = await azureCosmosService.getCollection('users');
    const { ObjectId } = require('mongodb');

    // Convert string ID to ObjectId
    let userId;
    try {
      userId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Check if user exists
    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Activate user
    const result = await usersCollection.updateOne(
      { _id: userId },
      { 
        $set: { 
          isActive: true,
          updatedAt: new Date()
        }
      }
    );

    // Get the updated user (exclude password)
    const updatedUser = await usersCollection.findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );

    res.json({
      success: true,
      message: 'User activated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating user',
      error: error.message
    });
  }
});

module.exports = router;
