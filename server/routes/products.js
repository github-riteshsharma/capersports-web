const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, admin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Build aggregation pipeline for better performance
    const pipeline = [];
    
    // Match stage - combine all filters
    const matchStage = { isActive: true };
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      matchStage.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Filter by category
    if (req.query.category) {
      matchStage.category = req.query.category;
    }

    // Filter by brand
    if (req.query.brand) {
      matchStage.brand = req.query.brand;
    }

    // Filter by gender
    if (req.query.gender) {
      matchStage.gender = req.query.gender;
    }

    // Filter by age group
    if (req.query.ageGroup) {
      matchStage.ageGroup = req.query.ageGroup;
    }

    // Filter by sub category
    if (req.query.subCategory) {
      matchStage.subCategory = req.query.subCategory;
    }

    // Filter by size
    if (req.query.size) {
      matchStage['sizes.size'] = req.query.size;
    }

    // Filter by color
    if (req.query.color) {
      matchStage['colors.name'] = new RegExp(req.query.color, 'i');
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = parseInt(req.query.maxPrice);
      matchStage.price = priceFilter;
    }

    // Filter by rating
    if (req.query.minRating) {
      matchStage['ratings.average'] = { $gte: parseFloat(req.query.minRating) };
    }

    // Filter by availability
    if (req.query.inStock === 'true') {
      matchStage.totalStock = { $gt: 0 };
    }

    // Filter by featured
    if (req.query.featured === 'true') {
      matchStage.isFeatured = true;
    }

    // Filter by sale
    if (req.query.onSale === 'true') {
      matchStage.isOnSale = true;
    }

    // Filter by creation date (for new arrivals)
    if (req.query.createdAfter) {
      matchStage.createdAt = { $gte: new Date(req.query.createdAfter) };
    }

    pipeline.push({ $match: matchStage });

    // Sort options
    let sortOption = {};
    switch (req.query.sortBy || req.query.sort) {
      case 'price':
      case 'price_low':
        sortOption = { price: 1 };
        break;
      case '-price':
      case 'price_high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { 'ratings.average': -1 };
        break;
      case 'name':
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case '-name':
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      case 'createdAt':
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case '-createdAt':
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    pipeline.push({ $sort: sortOption });

    // Exclude reviews for better performance
    pipeline.push({
      $project: {
        reviews: 0
      }
    });

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Get total count efficiently
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: "total" });
    const countResult = await Product.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Add pagination to main pipeline
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Execute the main query
    const products = await Product.aggregate(pipeline);

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-reviews');

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured products',
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get all categories with product counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
    });
  }
});

// @route   GET /api/products/brands
// @desc    Get all brands with product counts
// @access  Public
router.get('/brands', async (req, res) => {
  try {
    const brands = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      brands,
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching brands',
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'firstName lastName avatar')
      .populate('createdBy', 'firstName lastName');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product is not available',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
    });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Add a review to a product
// @access  Private
router.post('/:id/reviews', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),
  body('title').optional().trim().isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
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

    const { rating, comment, title } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user has already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    // Add review (without adminResponse - let frontend handle it)
    const review = {
      user: req.user.id,
      rating,
      comment,
      title,
      createdAt: new Date(),
    };

    product.reviews.push(review);
    
    // Recalculate product rating
    const ratings = product.reviews.map(r => r.rating);
    const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
    
    product.ratings = {
      average: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      count: ratings.length
    };
    
    // Also set the rating field for backward compatibility
    product.rating = product.ratings.average;
    product.numReviews = ratings.length;
    
    await product.save();

    // Populate the new review with user data
    await product.populate('reviews.user', 'firstName lastName avatar');

    // Get the newly added review
    const newReview = product.reviews[product.reviews.length - 1];

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: newReview,
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review',
    });
  }
});

// @route   PUT /api/products/:id/reviews/:reviewId
// @desc    Update a review
// @access  Private
router.put('/:id/reviews/:reviewId', protect, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().notEmpty().withMessage('Comment cannot be empty'),
  body('title').optional().trim().isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
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

    const { rating, comment, title } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review',
      });
    }

    // Update review
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (title) review.title = title;

    await product.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review',
    });
  }
});

// @route   DELETE /api/products/:id/reviews/:reviewId
// @desc    Delete a review
// @access  Private
router.delete('/:id/reviews/:reviewId', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    // Remove review
    product.reviews.pull({ _id: req.params.reviewId });
    await product.save();

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review',
    });
  }
});

module.exports = router;
