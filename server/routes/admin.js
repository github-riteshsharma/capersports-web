const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect, admin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Get total counts
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    
    // Get monthly stats
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    
    const monthlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // Get yearly revenue
    const yearlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfYear }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { _id: 1, totalSold: 1, name: '$product.name', price: '$product.price', images: '$product.images' } }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email');

    // Get low stock products
    const lowStockProducts = await Product.find({
      isActive: true,
      $expr: { $lte: ['$totalStock', '$lowStockThreshold'] }
    }).limit(10);

    // Get order status distribution
    const orderStatusStats = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get monthly sales chart data
    const monthlySales = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfYear }, paymentStatus: 'paid' } },
      { $group: { 
        _id: { $month: '$createdAt' }, 
        revenue: { $sum: '$total' },
        orders: { $sum: 1 }
      } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      dashboard: {
        totalProducts,
        totalUsers,
        totalOrders,
        monthlyOrders,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        yearlyRevenue: yearlyRevenue[0]?.total || 0,
        topProducts,
        recentOrders,
        lowStockProducts,
        orderStatusStats,
        monthlySales,
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data',
    });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products for admin
// @access  Private/Admin
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = {
        $or: [
          { name: searchRegex },
          { brand: searchRegex },
          { sku: searchRegex },
        ],
      };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'firstName lastName');

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
    });
  }
});

// @route   POST /api/admin/products
// @desc    Create new product
// @access  Private/Admin
router.post('/products', [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('sizes').isArray({ min: 1 }).withMessage('At least one size is required'),
  body('colors').isArray({ min: 1 }).withMessage('At least one color is required'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: req.body.sku });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'SKU already exists',
      });
    }

    const productData = {
      ...req.body,
      createdBy: req.user.id,
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
    });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if SKU is being changed and if it already exists
    if (req.body.sku && req.body.sku !== product.sku) {
      const existingProduct = await Product.findOne({ sku: req.body.sku });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'SKU already exists',
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
    });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
    });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders for admin
// @access  Private/Admin
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = {
        $or: [
          { orderNumber: searchRegex },
          { 'shippingAddress.email': searchRegex },
          { 'shippingAddress.phone': searchRegex },
        ],
      };
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstName lastName email');

    res.json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
    });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/orders/:id/status', [
  body('status').notEmpty().withMessage('Status is required'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { status, trackingNumber, carrier, estimatedDelivery, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
    if (status === 'delivered') order.actualDelivery = new Date();

    order.addStatusToHistory(status, note, req.user.id);
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for admin
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = {
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
        ],
      };
    }

    if (req.query.role) {
      query.role = req.query.role;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
    });
  }
});

module.exports = router;
