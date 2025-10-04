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
      if (item.size) {
        // If size is provided, check size-specific stock
        const sizeStock = product.sizes.find(s => s.size === item.size);
        if (!sizeStock || sizeStock.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name} (Size: ${item.size})`,
          });
        }
      } else {
        // If no size provided, check general stock
        const totalStock = product.totalStock || product.stock || 0;
        if (totalStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}`,
          });
        }
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
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
      if (item.size) {
        // Update size-specific stock
        const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
        if (sizeIndex !== -1) {
          product.sizes[sizeIndex].stock -= item.quantity;
        }
      } else {
        // Update general stock
        product.totalStock = Math.max(0, (product.totalStock || 0) - item.quantity);
      }
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
      if (item.size) {
        // Restore size-specific stock
        const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
        if (sizeIndex !== -1) {
          product.sizes[sizeIndex].stock += item.quantity;
        }
      } else {
        // Restore general stock
        product.totalStock = (product.totalStock || 0) + item.quantity;
      }
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
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.5;
          color: #000000;
          background: #ffffff;
          font-size: 14px;
          padding: 60px 40px;
          font-weight: 400;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
        }
        
        /* Header Section */
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 60px;
          padding-bottom: 30px;
        }
        
        .invoice-title-section {
          flex: 1;
        }
        
        .invoice-title {
          font-size: 40px;
          font-weight: 300;
          color: #000000;
          margin-bottom: 8px;
          letter-spacing: -0.8px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .invoice-number {
          font-size: 14px;
          color: #6b7280;
          font-weight: 400;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .logo-section {
          flex-shrink: 0;
          margin-left: 40px;
        }
        
        .logo {
          width: 60px;
          height: 60px;
          background-image: url('/images/logo.png');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          border-radius: 8px;
        }
        
        /* Company and Customer Info */
        .info-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          margin-bottom: 60px;
        }
        
        .info-block {
          
        }
        
        .info-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 10px;
          font-weight: 400;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .company-name {
          font-size: 20px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 6px;
          line-height: 1.2;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .company-address,
        .customer-address {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          font-weight: 400;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .customer-name {
          font-size: 20px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 6px;
          line-height: 1.2;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        /* Date Section */
        .date-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          margin-bottom: 60px;
        }
        
        .date-block {
          
        }
        
        .date-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 10px;
          font-weight: 400;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .date-value {
          font-size: 20px;
          font-weight: 600;
          color: #000000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        /* Invoice Details Title */
        .invoice-details-title {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 25px;
          font-weight: 400;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        /* Items Table */
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 50px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .items-table thead th {
          padding: 0 0 18px 0;
          text-align: left;
          font-weight: 500;
          font-size: 14px;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .items-table thead th:nth-child(2) {
          text-align: center;
        }
        
        .items-table thead th:nth-child(3),
        .items-table thead th:nth-child(4) {
          text-align: right;
        }
        
        .items-table tbody td {
          padding: 22px 0;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: top;
          font-size: 14px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .items-table tbody tr:last-child td {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .product-name {
          font-weight: 500;
          color: #000000;
          margin-bottom: 4px;
          line-height: 1.4;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .product-details {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.4;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .quantity {
          text-align: center;
          font-weight: 500;
          color: #000000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .unit-price,
        .total-price {
          text-align: right;
          font-weight: 500;
          color: #000000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        /* Totals Section */
        .totals-section {
          margin-top: 50px;
          padding-top: 25px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          font-size: 14px;
        }
        
        .total-row:last-child {
          padding-top: 18px;
          margin-top: 18px;
          border-top: 1px solid #e5e7eb;
        }
        
        .total-label {
          color: #000000;
          font-weight: 500;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .total-amount {
          color: #000000;
          font-weight: 500;
          text-align: right;
          min-width: 120px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .total-row:last-child .total-label,
        .total-row:last-child .total-amount {
          font-weight: 700;
          font-size: 16px;
        }
        
        .total-row.discount .total-amount {
          color: #000000;
        }
        
        /* Notes Section */
        .notes-section {
          margin-top: 70px;
        }
        
        .notes-title {
          font-size: 16px;
          color: #000000;
          margin-bottom: 18px;
          font-weight: 500;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .notes-content {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .notes-content ul {
          list-style: none;
          padding: 0;
        }
        
        .notes-content li {
          margin-bottom: 4px;
          position: relative;
          padding-left: 16px;
        }
        
        .notes-content li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #6b7280;
        }
        
        /* Footer */
        .footer {
          margin-top: 70px;
          padding-top: 35px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .company-footer {
          font-size: 16px;
          font-weight: 600;
          color: #000000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .contact-info {
          font-size: 14px;
          color: #6b7280;
          text-align: right;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        /* Print Styles */
        @media print {
          body { 
            padding: 40px 20px;
            background: #ffffff;
          }
          .invoice-container { 
            box-shadow: none;
          }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          body {
            padding: 40px 20px;
          }
          
          .invoice-header {
            flex-direction: column;
            gap: 30px;
          }
          
          .logo-section {
            margin-left: 0;
          }
          
          .info-section,
          .date-section {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .footer {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
          
          .contact-info {
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header Section -->
        <div class="invoice-header">
          <div class="invoice-title-section">
            <div class="invoice-title">Invoice</div>
            <div class="invoice-number">Invoice Number #${order.orderNumber || 'INV-' + order._id.toString().slice(-6).toUpperCase() + '-000'}</div>
          </div>
          <div class="logo-section">
            <div class="logo"></div>
          </div>
        </div>
        
        <!-- Company and Customer Info -->
        <div class="info-section">
          <div class="info-block">
            <div class="info-label">Billed By :</div>
            <div class="company-name">CaperSports</div>
            <div class="company-address">
              123 Sports Avenue, Floor 2,<br>
              Mumbai, India
            </div>
          </div>
          <div class="info-block">
            <div class="info-label">Billed To :</div>
            <div class="customer-name">${order.shippingAddress.fullName}</div>
            <div class="customer-address">
              ${order.shippingAddress.addressLine1}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.pinCode}
            </div>
          </div>
        </div>
        
        <!-- Date Information -->
        <div class="date-section">
          <div class="date-block">
            <div class="date-label">Date Issued :</div>
            <div class="date-value">${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div class="date-block">
            <div class="date-label">Due Date:</div>
            <div class="date-value">${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
        
        <!-- Invoice Details Title -->
        <div class="invoice-details-title">Invoice Details</div>
        
        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th>Items/Service</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>
                  <div class="product-name">${item.name}</div>
                  <div class="product-details">
                    ${item.size ? `Size: ${item.size}` : ''} ${item.size && item.color ? ', ' : ''} ${item.color ? `Color: ${item.color}` : ''}
                  </div>
                </td>
                <td class="quantity">${item.quantity}</td>
                <td class="unit-price">₹${item.price.toLocaleString('en-IN')}</td>
                <td class="total-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <!-- Totals Section -->
        <div class="totals-section">
          <div class="total-row">
            <div class="total-label">Subtotal</div>
            <div class="total-amount">₹${order.subtotal.toLocaleString('en-IN')}</div>
          </div>
          <div class="total-row">
            <div class="total-label">Tax (GST 18%)</div>
            <div class="total-amount">₹${order.tax.toLocaleString('en-IN')}</div>
          </div>
          ${order.discount > 0 ? `
            <div class="total-row discount">
              <div class="total-label">Discount</div>
              <div class="total-amount">-₹${order.discount.toLocaleString('en-IN')}</div>
            </div>
          ` : ''}
          <div class="total-row">
            <div class="total-label">Grand Total</div>
            <div class="total-amount">₹${order.total.toLocaleString('en-IN')}</div>
          </div>
        </div>
        
        <!-- Notes Section -->
        <div class="notes-section">
          <div class="notes-title">Notes</div>
          <div class="notes-content">
            <ul>
              <li>Payment is due by ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
              <li>Include the invoice number in the payment reference to ensure accurate processing</li>
            </ul>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div class="company-footer">CaperSports Private Limited, IND</div>
          <div class="contact-info">(+91) 823-4567-8901</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;
