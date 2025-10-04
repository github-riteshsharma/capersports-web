const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'T-Shirts',
      'Hoodies',
      'Jackets',
      'Shorts',
      'Pants',
      'Shoes',
      'Accessories',
      'Sportswear',
      'Athleisure',
      'Swimwear',
    ],
  },
  subCategory: {
    type: String,
    required: [true, 'Sub-category is required'],
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  colors: [{
    name: {
      type: String,
      required: false,
    },
    hex: {
      type: String,
      required: false,
    },
    images: [{
      type: String,
      required: false,
    }],
  }],
  sizes: [{
    size: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
    },
  }],
  images: [{
    type: String,
    required: true,
  }],
  gender: {
    type: String,
    required: [true, 'Gender specification is required'],
    enum: ['Men', 'Women', 'Unisex', 'Kids'],
  },
  ageGroup: {
    type: String,
    required: [true, 'Age group is required'],
    enum: ['Adult', 'Teen', 'Kid', 'All Ages'],
  },
  material: {
    type: String,
    required: [true, 'Material is required'],
    trim: true,
  },
  careInstructions: {
    type: String,
    required: [true, 'Care instructions are required'],
  },
  features: [{
    type: String,
    trim: true,
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: true,
      maxlength: [500, 'Review comment cannot exceed 500 characters'],
    },
    title: {
      type: String,
      maxlength: [100, 'Review title cannot exceed 100 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    helpful: {
      type: Number,
      default: 0,
    },
  }],
  totalStock: {
    type: Number,
    required: true,
    min: [0, 'Total stock cannot be negative'],
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isOnSale: {
    type: Boolean,
    default: false,
  },
  saleStartDate: {
    type: Date,
  },
  saleEndDate: {
    type: Date,
  },
  weight: {
    type: Number, // in grams
    required: false,
    default: 0,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
  },
  barcode: {
    type: String,
    trim: true,
  },
  seoTitle: {
    type: String,
    maxlength: [60, 'SEO title cannot exceed 60 characters'],
  },
  seoDescription: {
    type: String,
    maxlength: [160, 'SEO description cannot exceed 160 characters'],
  },
  seoKeywords: [{
    type: String,
    trim: true,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes for better performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ brand: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
// Additional performance indexes
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ isActive: 1, totalStock: 1 });
productSchema.index({ isActive: 1, isOnSale: 1 });
productSchema.index({ gender: 1, isActive: 1 });
productSchema.index({ ageGroup: 1, isActive: 1 });
productSchema.index({ category: 1, brand: 1, isActive: 1 });
productSchema.index({ price: 1, isActive: 1 });
productSchema.index({ 'ratings.average': -1, isActive: 1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.totalStock === 0) return 'Out of Stock';
  if (this.totalStock <= this.lowStockThreshold) return 'Low Stock';
  return 'In Stock';
});

// Calculate total stock from sizes
productSchema.pre('save', function(next) {
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((total, size) => total + size.stock, 0);
  }
  next();
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
    return;
  }
  
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  this.ratings.average = Math.round((sum / this.reviews.length) * 10) / 10;
  this.ratings.count = this.reviews.length;
};

// Update rating when review is added
productSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.calculateAverageRating();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
