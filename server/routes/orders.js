const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, [
  body('items').isArray({ min: 1 }).withMessage('Items are required'),
  body('shippingAddress.fullName').notEmpty().withMessage('Full name is required'),
  body('shippingAddress.email').isEmail().withMessage('Valid email is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
  body('shippingAddress.addressLine1').notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.pinCode').notEmpty().withMessage('Pin code is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
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

    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      orderNotes,
      customerNotes,
      isGift,
      giftMessage,
      couponCode,
    } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      // Check stock
      const sizeStock = product.sizes.find(s => s.size === item.size);
      if (!sizeStock || sizeStock.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images[0],
        sku: product.sku,
      });
    }

    // Calculate tax (18% GST for India)
    const tax = subtotal * 0.18;
    
    // Calculate shipping (free for orders above ₹1000)
    const shippingFee = subtotal >= 1000 ? 0 : 100;
    
    // Apply discount if coupon is provided
    let discount = 0;
    if (couponCode) {
      // Add coupon logic here
      if (couponCode === 'WELCOME10') {
        discount = subtotal * 0.1; // 10% discount
      }
    }

    const total = subtotal + tax + shippingFee - discount;

    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      subtotal,
      tax,
      shippingFee,
      discount,
      couponCode,
      total,
      customerNotes: orderNotes || customerNotes,
      isGift,
      giftMessage,
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
      product.sizes[sizeIndex].stock -= item.quantity;
      await product.save();
    }

    // Clear user's cart
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ user: req.user.id });
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.product', 'name images');

    res.json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images')
      .populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order
    if (order.user._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled',
      });
    }

    order.orderStatus = 'cancelled';
    order.addStatusToHistory('cancelled', 'Cancelled by customer', req.user.id);
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
      product.sizes[sizeIndex].stock += item.quantity;
      await product.save();
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order',
    });
  }
});

// @route   POST /api/orders/:id/return
// @desc    Return order
// @access  Private
router.post('/:id/return', protect, [
  body('reason').notEmpty().withMessage('Return reason is required'),
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

    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to return this order',
      });
    }

    // Check if order can be returned
    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Only delivered orders can be returned',
      });
    }

    // Check if return period is valid (30 days)
    const returnDeadline = new Date(order.actualDelivery);
    returnDeadline.setDate(returnDeadline.getDate() + 30);
    
    if (new Date() > returnDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Return period has expired',
      });
    }

    order.orderStatus = 'returned';
    order.returnReason = reason;
    order.returnDate = new Date();
    order.addStatusToHistory('returned', `Return requested: ${reason}`, req.user.id);
    await order.save();

    res.json({
      success: true,
      message: 'Return request submitted successfully',
      order,
    });
  } catch (error) {
    console.error('Return order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing return',
    });
  }
});

// @route   GET /api/orders/:id/invoice
// @desc    Download order invoice
// @access  Private
router.get('/:id/invoice', protect, async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Validate orderId
    if (!orderId || orderId === 'undefined' || orderId === 'null') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID provided',
      });
    }
    
    // Check if orderId is a valid ObjectId
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      });
    }
    
    const order = await Order.findById(orderId)
      .populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order
    if (order.user._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    // Generate invoice HTML
    const invoiceHTML = generateInvoiceHTML(order);
    
    // For now, return the HTML content (will be converted to PDF on frontend)
    res.json({
      success: true,
      html: invoiceHTML,
      orderNumber: order.orderNumber || 'N/A'
    });
  } catch (error) {
    console.error('Download invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating invoice',
      error: error.message
    });
  }
});

// Helper function to generate invoice HTML
function generateInvoiceHTML(order) {
  const currentDate = new Date().toLocaleDateString('en-IN');
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${order.orderNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          color: #1d1d1f;
          background: linear-gradient(135deg, #f8faff 0%, #fff5f5 100%);
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
          margin: 0;
          padding: 40px 20px;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          min-height: calc(100vh - 80px);
          box-shadow: 0 4px 25px rgba(59, 130, 246, 0.08);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        
        .invoice-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6 0%, #ef4444 100%);
        }
        
        .invoice-header {
          padding: 50px 50px 40px 50px;
          border-bottom: 1px solid #f0f2f5;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(239, 68, 68, 0.02) 100%);
          position: relative;
        }
        
        .header-top {
          display: table;
          width: 100%;
          table-layout: fixed;
        }
        
        .logo-section {
          display: table-cell;
          vertical-align: middle;
          width: 60%;
        }
        
        .logo-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .logo {
          width: 52px;
          height: 52px;
          background-image: url('/images/capersports-logo.png');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
          background-color: #ffffff;
          padding: 4px;
        }
        
        .company-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        
        .company-name {
          font-size: 26px;
          font-weight: 700;
          color: #1d1d1f;
          margin-bottom: 2px;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        
        .company-tagline {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 0;
        }
        
        .invoice-meta-header {
          display: table-cell;
          vertical-align: middle;
          text-align: right;
          width: 40%;
        }
        
        .invoice-title {
          font-size: 36px;
          font-weight: 800;
          color: #1d1d1f;
          margin-bottom: 6px;
          letter-spacing: -1.5px;
          line-height: 1;
        }
        
        .invoice-number {
          font-size: 16px;
          color: #6b7280;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .invoice-content {
          padding: 0 50px 40px 50px;
          position: relative;
        }
        
        .invoice-details {
          display: table;
          width: 100%;
          table-layout: fixed;
          margin-bottom: 45px;
        }
        
        .detail-section {
          display: table-cell;
          vertical-align: top;
          padding-right: 40px;
        }
        
        .detail-section:last-child {
          padding-right: 0;
          padding-left: 40px;
        }
        
        .section-title {
          font-size: 12px;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 2px solid #f0f2f5;
        }
        
        .detail-content {
          color: #1d1d1f;
          line-height: 1.6;
        }
        
        .detail-content .name {
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 16px;
        }
        
        .detail-content .address {
          color: #86868b;
          margin-bottom: 2px;
        }
        
        .detail-row {
          display: table;
          width: 100%;
          margin-bottom: 12px;
          table-layout: fixed;
        }
        
        .detail-label {
          display: table-cell;
          color: #6b7280;
          font-weight: 500;
          width: 40%;
          vertical-align: top;
          padding-right: 16px;
        }
        
        .detail-value {
          display: table-cell;
          color: #1d1d1f;
          font-weight: 600;
          width: 60%;
          vertical-align: top;
          text-align: left;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 20px;
          height: 20px;
          min-width: 60px;
          text-align: center;
          vertical-align: baseline;
        }
        
        .status-delivered { background: #d1fae5; color: #065f46; }
        .status-shipped { background: #dbeafe; color: #1e40af; }
        .status-processing { background: #fef3c7; color: #92400e; }
        .status-pending { background: #fee2e2; color: #dc2626; }
        
        .items-section {
          margin-bottom: 40px;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        .items-table thead th {
          padding: 16px 0;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          color: #86868b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #f5f5f7;
        }
        
        .items-table tbody td {
          padding: 20px 0;
          border-bottom: 1px solid #f5f5f7;
          vertical-align: top;
        }
        
        .items-table tbody tr:last-child td {
          border-bottom: none;
        }
        
        .product-name {
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 4px;
        }
        
        .product-details {
          font-size: 13px;
          color: #86868b;
        }
        
        .quantity {
          text-align: center;
          font-weight: 600;
        }
        
        .price {
          text-align: right;
          font-weight: 600;
        }
        
        .total-section {
          border-top: 1px solid #f5f5f7;
          padding-top: 30px;
          margin-top: 30px;
        }
        
        .total-rows {
          max-width: 300px;
          margin-left: auto;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }
        
        .total-row .label {
          color: #86868b;
          font-size: 14px;
        }
        
        .total-row .amount {
          color: #1d1d1f;
          font-weight: 600;
          text-align: right;
        }
        
        .total-row.final {
          border-top: 1px solid #f5f5f7;
          margin-top: 12px;
          padding-top: 16px;
        }
        
        .total-row.final .label {
          font-weight: 600;
          color: #1d1d1f;
          font-size: 16px;
        }
        
        .total-row.final .amount {
          font-size: 18px;
          font-weight: 700;
        }
        
        .footer {
          padding: 40px 60px;
          border-top: 1px solid #f5f5f7;
          margin-top: 60px;
        }
        
        .footer-content {
          text-align: center;
        }
        
        .footer-title {
          font-size: 16px;
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 8px;
        }
        
        .footer-text {
          font-size: 13px;
          color: #86868b;
          margin-bottom: 20px;
        }
        
        .contact-info {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        
        .contact-item {
          font-size: 13px;
          color: #86868b;
        }
        
        .legal-info {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #f5f5f7;
          font-size: 11px;
          color: #86868b;
          text-align: center;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-delivered { background: #dcfce7; color: #166534; }
        .status-shipped { background: #dbeafe; color: #1d4ed8; }
        .status-processing { background: #fef3c7; color: #92400e; }
        .status-pending { background: #fee2e2; color: #dc2626; }
        
        @media print {
          body { padding: 0; }
          .invoice-container { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="header-top">
            <div class="logo-section">
              <div class="logo-content">
                <div class="logo"></div>
                <div class="company-info">
                  <div class="company-name">CaperSports</div>
                  <div class="company-tagline">Premium Athletic Wear & Sports Equipment</div>
                </div>
              </div>
            </div>
            <div class="invoice-meta-header">
              <div class="invoice-title">Invoice</div>
              <div class="invoice-number">#${order.orderNumber}</div>
            </div>
          </div>
        </div>
        
        <div class="invoice-content">
          <div class="invoice-details">
            <div class="detail-section">
              <div class="section-title">Bill To</div>
              <div class="detail-content">
                <div class="name">${order.shippingAddress.fullName}</div>
                <div class="address">${order.shippingAddress.addressLine1}</div>
                ${order.shippingAddress.addressLine2 ? `<div class="address">${order.shippingAddress.addressLine2}</div>` : ''}
                <div class="address">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pinCode}</div>
                <div class="address">${order.shippingAddress.country}</div>
                <div class="address">${order.shippingAddress.phone}</div>
                <div class="address">${order.shippingAddress.email}</div>
              </div>
            </div>
            
            <div class="detail-section">
              <div class="section-title">Invoice Details</div>
              <div class="detail-content">
                <div class="detail-row">
                  <span class="detail-label">Order Date</span>
                  <span class="detail-value">${orderDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Invoice Date</span>
                  <span class="detail-value">${currentDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment Method</span>
                  <span class="detail-value">${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status</span>
                  <span class="status-badge status-${order.orderStatus.replace('_', '-')}">
                    ${order.orderStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="items-section">
            <div class="section-title">Items</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>
                      <div class="product-name">${item.name}</div>
                      <div class="product-details">${item.size} • ${item.color}</div>
                    </td>
                    <td class="quantity">${item.quantity}</td>
                    <td class="price">₹${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="total-section">
            <div class="total-rows">
              <div class="total-row">
                <span class="label">Subtotal</span>
                <span class="amount">₹${order.subtotal.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span class="label">Shipping</span>
                <span class="amount">${order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee.toFixed(2)}`}</span>
              </div>
              <div class="total-row">
                <span class="label">Tax (GST 18%)</span>
                <span class="amount">₹${order.tax.toFixed(2)}</span>
              </div>
              ${order.discount > 0 ? `
                <div class="total-row">
                  <span class="label">Discount</span>
                  <span class="amount">-₹${order.discount.toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="total-row final">
                <span class="label">Total</span>
                <span class="amount">₹${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-content">
            <div class="footer-title">Thank you for your purchase</div>
            <div class="footer-text">We appreciate your business and trust in our premium athletic wear.</div>
            
            <div class="contact-info">
              <div class="contact-item">support@capersports.com</div>
              <div class="contact-item">+91-1800-CAPER-SPORTS</div>
              <div class="contact-item">www.capersports.com</div>
            </div>
            
            <div class="legal-info">
              CaperSports Private Limited • 123 Sports Avenue, Athletic District, Mumbai 400001<br>
              GST: 27ABCCS1234A1Z5 • CIN: U74999MH2023PTC123456
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;
