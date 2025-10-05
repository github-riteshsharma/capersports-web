const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth-azure'); // Use Azure auth middleware

const router = express.Router();

// @route   GET /api/users/cart
// @desc    Get user's cart - Azure version
// @access  Private
router.get('/cart', protect, async (req, res) => {
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

    // Get user with cart
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user._id) });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get cart items with product details
    const cart = user.cart || [];
    const productsCollection = await azureCosmosService.getCollection('products');
    
    // Populate product details for cart items
    const populatedCart = [];
    for (const item of cart) {
      try {
        const product = await productsCollection.findOne({ _id: new ObjectId(item.productId) });
        if (product) {
          populatedCart.push({
            _id: item._id,
            product: product,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            addedAt: item.addedAt
          });
        }
      } catch (error) {
        console.error('Error populating cart item:', error);
      }
    }

    // Calculate totals
    let totalItems = 0;
    let totalPrice = 0;
    
    populatedCart.forEach(item => {
      if (item.product && item.quantity) {
        totalItems += item.quantity;
        const price = item.product.salePrice || item.product.price || 0;
        totalPrice += price * item.quantity;
      }
    });

    res.json({
      success: true,
      cart: populatedCart,
      totalItems,
      totalPrice,
      itemCount: populatedCart.length
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart',
      error: error.message
    });
  }
});

// @route   POST /api/users/cart
// @desc    Add item to cart - Azure version
// @access  Private
router.post('/cart', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
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
    const productsCollection = await azureCosmosService.getCollection('products');
    const { ObjectId } = require('mongodb');

    // Verify product exists
    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get user
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user._id) });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cart = user.cart || [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
      item.productId.toString() === productId && 
      item.size === size && 
      item.color === color
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        _id: new ObjectId(),
        productId: new ObjectId(productId),
        quantity,
        size,
        color,
        addedAt: new Date()
      });
    }

    // Update user's cart
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user._id) },
      { $set: { cart: cart } }
    );

    // Return updated cart with populated product details
    const populatedCart = [];
    for (const item of cart) {
      try {
        const itemProduct = await productsCollection.findOne({ _id: new ObjectId(item.productId) });
        if (itemProduct) {
          populatedCart.push({
            _id: item._id,
            product: itemProduct,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            addedAt: item.addedAt
          });
        }
      } catch (error) {
        console.error('Error populating cart item:', error);
      }
    }

    // Calculate totals
    let totalItems = 0;
    let totalPrice = 0;
    
    populatedCart.forEach(item => {
      if (item.product && item.quantity) {
        totalItems += item.quantity;
        const price = item.product.salePrice || item.product.price || 0;
        totalPrice += price * item.quantity;
      }
    });

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      cart: populatedCart,
      totalItems,
      totalPrice,
      itemCount: populatedCart.length
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart',
      error: error.message
    });
  }
});

// @route   PUT /api/users/cart/:itemId
// @desc    Update cart item quantity - Azure version
// @access  Private
router.put('/cart/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
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

    // Update cart item quantity
    const result = await usersCollection.updateOne(
      { 
        _id: new ObjectId(req.user._id),
        'cart._id': new ObjectId(itemId)
      },
      { 
        $set: { 'cart.$.quantity': quantity }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Get updated cart
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user._id) });
    const cart = user.cart || [];
    
    // Populate product details
    const productsCollection = await azureCosmosService.getCollection('products');
    const populatedCart = [];
    for (const item of cart) {
      try {
        const product = await productsCollection.findOne({ _id: new ObjectId(item.productId) });
        if (product) {
          populatedCart.push({
            _id: item._id,
            product: product,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            addedAt: item.addedAt
          });
        }
      } catch (error) {
        console.error('Error populating cart item:', error);
      }
    }

    // Calculate totals
    let totalItems = 0;
    let totalPrice = 0;
    
    populatedCart.forEach(item => {
      if (item.product && item.quantity) {
        totalItems += item.quantity;
        const price = item.product.salePrice || item.product.price || 0;
        totalPrice += price * item.quantity;
      }
    });

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      cart: populatedCart,
      totalItems,
      totalPrice,
      itemCount: populatedCart.length
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart item',
      error: error.message
    });
  }
});

// @route   DELETE /api/users/cart/:itemId
// @desc    Remove item from cart - Azure version
// @access  Private
router.delete('/cart/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;

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

    // Remove item from cart
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(req.user._id) },
      { 
        $pull: { 
          cart: { _id: new ObjectId(itemId) }
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart',
      error: error.message
    });
  }
});

// @route   DELETE /api/users/cart
// @desc    Clear entire cart - Azure version
// @access  Private
router.delete('/cart', protect, async (req, res) => {
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

    // Clear user's cart
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user._id) },
      { $set: { cart: [] } }
    );

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart',
      error: error.message
    });
  }
});

module.exports = router;
