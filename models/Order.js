const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: 'India',
    },
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'upi', 'netbanking', 'cod'],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partial_refund'],
    default: 'pending',
  },
  paymentDetails: {
    transactionId: String,
    paymentId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  shippingFee: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  discount: {
    type: Number,
    min: 0,
    default: 0,
  },
  couponCode: {
    type: String,
    trim: true,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'returned',
      'refunded',
    ],
    default: 'pending',
  },
  orderStatusHistory: [{
    status: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  trackingNumber: {
    type: String,
    trim: true,
  },
  carrier: {
    type: String,
    trim: true,
  },
  estimatedDelivery: {
    type: Date,
  },
  actualDelivery: {
    type: Date,
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
  customerNotes: {
    type: String,
    maxlength: [500, 'Customer notes cannot exceed 500 characters'],
  },
  refundAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  refundReason: {
    type: String,
    trim: true,
  },
  refundDate: {
    type: Date,
  },
  returnReason: {
    type: String,
    trim: true,
  },
  returnDate: {
    type: Date,
  },
  isGift: {
    type: Boolean,
    default: false,
  },
  giftMessage: {
    type: String,
    maxlength: [200, 'Gift message cannot exceed 200 characters'],
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  },
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'admin', 'phone'],
    default: 'website',
  },
}, {
  timestamps: true,
});

// Indexes for better performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to generate order number and update status history
orderSchema.pre('save', async function(next) {
  try {
    // Generate order number for new orders
    if (this.isNew) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      
      // Find the latest order for today
      const latestOrder = await this.constructor.findOne({
        orderNumber: { $regex: `^CS${year}${month}${day}` }
      }).sort({ orderNumber: -1 });
      
      let sequence = 1;
      if (latestOrder) {
        const lastSequence = parseInt(latestOrder.orderNumber.slice(-4));
        sequence = lastSequence + 1;
      }
      
      this.orderNumber = `CS${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
    }
    
    // Update status history for existing orders
    if (this.isModified('orderStatus') && !this.isNew) {
      this.addStatusToHistory(this.orderStatus);
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to add status to history
orderSchema.methods.addStatusToHistory = function(status, note = '', updatedBy = null) {
  this.orderStatusHistory.push({
    status,
    note,
    updatedBy,
    timestamp: new Date(),
  });
};

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.total = this.subtotal + this.tax + this.shippingFee - this.discount;
};

module.exports = mongoose.model('Order', orderSchema);
