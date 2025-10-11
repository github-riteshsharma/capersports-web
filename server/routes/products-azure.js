const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filters - Azure version
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get Azure Cosmos service from app locals
    const azureCosmosService = req.app.locals.azureCosmosService;
    
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Azure Cosmos DB service not available'
      });
    }

    // Get the products collection
    const collection = await azureCosmosService.getCollection('products');
    
    // Build query filters
    const query = { isActive: true };
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by brand
    if (req.query.brand) {
      query.brand = req.query.brand;
    }

    // Filter by gender
    if (req.query.gender) {
      query.gender = req.query.gender;
    }

    // Filter by sub category
    if (req.query.subCategory) {
      query.subCategory = req.query.subCategory;
    }

    // Filter by size
    if (req.query.size) {
      query['sizes.size'] = req.query.size;
    }

    // Filter by color
    if (req.query.color) {
      query['colors.name'] = new RegExp(req.query.color, 'i');
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = parseInt(req.query.maxPrice);
      query.price = priceFilter;
    }

    // Filter by creation date (for new arrivals)
    if (req.query.createdAfter) {
      query.createdAt = { $gte: new Date(req.query.createdAfter) };
    }

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

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // OPTIMIZATION: Use projection to limit fields returned (exclude reviews)
    const projection = {
      reviews: 0, // Exclude reviews array for list view
      seoTitle: 0,
      seoDescription: 0,
      seoKeywords: 0,
      careInstructions: 0,
      barcode: 0,
      dimensions: 0,
      weight: 0
    };

    // OPTIMIZATION: Run query and count in parallel
    const [products, total] = await Promise.all([
      collection
        .find(query, { projection })
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ]);

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
      error: error.message
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get all categories - Azure version
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const azureCosmosService = req.app.locals.azureCosmosService;
    
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Azure Cosmos DB service not available'
      });
    }

    const collection = await azureCosmosService.getCollection('products');
    
    // Get distinct categories
    const categories = await collection.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      categories: categories.filter(cat => cat && cat.trim() !== '')
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: error.message
    });
  }
});

// @route   GET /api/products/brands
// @desc    Get all brands - Azure version
// @access  Public
router.get('/brands', async (req, res) => {
  try {
    const azureCosmosService = req.app.locals.azureCosmosService;
    
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Azure Cosmos DB service not available'
      });
    }

    const collection = await azureCosmosService.getCollection('products');
    
    // Get distinct brands
    const brands = await collection.distinct('brand', { isActive: true });
    
    res.json({
      success: true,
      brands: brands.filter(brand => brand && brand.trim() !== '')
    });

  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching brands',
      error: error.message
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products - Azure version
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const azureCosmosService = req.app.locals.azureCosmosService;
    
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Azure Cosmos DB service not available'
      });
    }

    const collection = await azureCosmosService.getCollection('products');
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await collection
      .find({ 
        isActive: true, 
        isFeatured: true 
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

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
      error: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID - Azure version
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const azureCosmosService = req.app.locals.azureCosmosService;
    
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Azure Cosmos DB service not available'
      });
    }

    const collection = await azureCosmosService.getCollection('products');
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
    
    const product = await collection.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      error: error.message
    });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Add review to product - Azure version
// @access  Private
router.post('/:id/reviews', async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get Azure Cosmos service
    const azureCosmosService = req.app.locals.azureCosmosService;
    if (!azureCosmosService) {
      return res.status(500).json({
        success: false,
        message: 'Database service not available'
      });
    }

    const productsCollection = await azureCosmosService.getCollection('products');
    const usersCollection = await azureCosmosService.getCollection('users');
    const { ObjectId } = require('mongodb');

    // Get user
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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
    
    const product = await productsCollection.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create review object (without adminResponse - let frontend handle it)
    const review = {
      _id: new ObjectId(),
      user: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment,
      createdAt: new Date(),
      adminResponse: `Thank you for your wonderful review! We're thrilled you love our products. - Caper Sports Team 🏃‍♂️`
    };

    // Add review to product
    await productsCollection.updateOne(
      { _id: productId },
      { 
        $push: { reviews: review },
        $inc: { numReviews: 1 }
      }
    );

    // Recalculate ratings
    const updatedProduct = await productsCollection.findOne({ _id: productId });
    const reviews = updatedProduct.reviews || [];
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // Update product with new ratings
    await productsCollection.updateOne(
      { _id: productId },
      { 
        $set: { 
          'ratings.average': averageRating,
          'ratings.count': reviews.length,
          rating: averageRating // For backward compatibility
        }
      }
    );

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review,
      ratings: {
        average: averageRating,
        count: reviews.length
      }
    });

  } catch (error) {
    console.error('Add review error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while adding review',
      error: error.message
    });
  }
});

module.exports = router;
