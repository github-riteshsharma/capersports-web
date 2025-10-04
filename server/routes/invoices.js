const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Mock invoice storage (in production, this would be a database)
let invoices = [
  {
    id: 'INV-129482-001',
    invoiceNumber: 'INV-129482-001',
    customer: {
      name: 'Brightstone Industries',
      email: 'contact@brightstone.com',
      address: '45 Evergreen Lane, Suite 102',
      city: 'Brookfield',
      state: 'NY',
      pinCode: '11234',
      phone: '+1-555-0123'
    },
    dateIssued: '2025-01-17',
    dueDate: '2025-01-31',
    items: [
      { name: 'Cloud Hosting Subscription', quantity: 1, unitPrice: 3500, total: 3500 },
      { name: 'Data Analytics Report', quantity: 2, unitPrice: 750, total: 1500 },
      { name: 'On-Site Technical Support', quantity: 1, unitPrice: 400, total: 400 }
    ],
    subtotal: 5400,
    taxPercentage: 18,
    tax: 540,
    discount: 0,
    grandTotal: 6080,
    status: 'Paid',
    notes: 'Payment is due by January 31, 2025.\nInclude the invoice number in the payment reference to ensure accurate processing.',
    createdAt: new Date('2025-01-17'),
    updatedAt: new Date('2025-01-17')
  }
];

// @desc    Get all invoices
// @route   GET /api/admin/invoices
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let filteredInvoices = [...invoices];
    
    // Filter by status
    if (status && status !== 'all') {
      filteredInvoices = filteredInvoices.filter(invoice => 
        invoice.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Search by customer name or invoice number
    if (search) {
      const searchLower = search.toLowerCase();
      filteredInvoices = filteredInvoices.filter(invoice =>
        invoice.customer.name.toLowerCase().includes(searchLower) ||
        invoice.invoiceNumber.toLowerCase().includes(searchLower)
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedInvoices,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredInvoices.length / limit),
        totalInvoices: filteredInvoices.length,
        hasNext: endIndex < filteredInvoices.length,
        hasPrev: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching invoices',
      error: error.message
    });
  }
});

// @desc    Get single invoice
// @route   GET /api/admin/invoices/:id
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const invoice = invoices.find(inv => inv.id === req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching invoice',
      error: error.message
    });
  }
});

// @desc    Create new invoice
// @route   POST /api/admin/invoices
// @access  Private/Admin
router.post('/', protect, admin, [
  body('invoiceNumber').notEmpty().withMessage('Invoice number is required'),
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('customer.email').isEmail().withMessage('Valid email is required'),
  body('dateIssued').notEmpty().withMessage('Issue date is required'),
  body('dueDate').notEmpty().withMessage('Due date is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Item quantity must be at least 1'),
  body('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Item price must be a positive number'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      invoiceNumber,
      customer,
      dateIssued,
      dueDate,
      items,
      taxPercentage = 18,
      discount = 0,
      notes = ''
    } = req.body;

    // Check if invoice number already exists
    const existingInvoice = invoices.find(inv => inv.invoiceNumber === invoiceNumber);
    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: 'Invoice number already exists'
      });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = (subtotal * taxPercentage) / 100;
    const grandTotal = subtotal + tax - discount;

    // Create new invoice
    const newInvoice = {
      id: invoiceNumber,
      invoiceNumber,
      customer,
      dateIssued,
      dueDate,
      items: items.map(item => ({
        ...item,
        total: item.quantity * item.unitPrice
      })),
      subtotal,
      taxPercentage,
      tax,
      discount,
      grandTotal: Math.max(0, grandTotal),
      status: 'Pending',
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    invoices.push(newInvoice);

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: newInvoice
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating invoice',
      error: error.message
    });
  }
});

// @desc    Update invoice
// @route   PUT /api/admin/invoices/:id
// @access  Private/Admin
router.put('/:id', protect, admin, [
  body('customer.name').optional().notEmpty().withMessage('Customer name cannot be empty'),
  body('customer.email').optional().isEmail().withMessage('Valid email is required'),
  body('dateIssued').optional().notEmpty().withMessage('Issue date cannot be empty'),
  body('dueDate').optional().notEmpty().withMessage('Due date cannot be empty'),
  body('items').optional().isArray({ min: 1 }).withMessage('At least one item is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const invoiceIndex = invoices.findIndex(inv => inv.id === req.params.id);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const existingInvoice = invoices[invoiceIndex];
    const updateData = req.body;

    // Recalculate totals if items are updated
    if (updateData.items) {
      const subtotal = updateData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const tax = (subtotal * (updateData.taxPercentage || existingInvoice.taxPercentage)) / 100;
      const discount = updateData.discount !== undefined ? updateData.discount : existingInvoice.discount;
      const grandTotal = subtotal + tax - discount;

      updateData.items = updateData.items.map(item => ({
        ...item,
        total: item.quantity * item.unitPrice
      }));
      updateData.subtotal = subtotal;
      updateData.tax = tax;
      updateData.grandTotal = Math.max(0, grandTotal);
    }

    // Update invoice
    const updatedInvoice = {
      ...existingInvoice,
      ...updateData,
      updatedAt: new Date()
    };

    invoices[invoiceIndex] = updatedInvoice;

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: updatedInvoice
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating invoice',
      error: error.message
    });
  }
});

// @desc    Delete invoice
// @route   DELETE /api/admin/invoices/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const invoiceIndex = invoices.findIndex(inv => inv.id === req.params.id);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    invoices.splice(invoiceIndex, 1);

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting invoice',
      error: error.message
    });
  }
});

// @desc    Update invoice status
// @route   PATCH /api/admin/invoices/:id/status
// @access  Private/Admin
router.patch('/:id/status', protect, admin, [
  body('status').isIn(['Pending', 'Paid', 'Overdue', 'Cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const invoiceIndex = invoices.findIndex(inv => inv.id === req.params.id);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    invoices[invoiceIndex].status = req.body.status;
    invoices[invoiceIndex].updatedAt = new Date();

    res.json({
      success: true,
      message: 'Invoice status updated successfully',
      data: invoices[invoiceIndex]
    });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating invoice status',
      error: error.message
    });
  }
});

// @desc    Generate invoice PDF
// @route   GET /api/admin/invoices/:id/pdf
// @access  Private/Admin
router.get('/:id/pdf', protect, admin, async (req, res) => {
  try {
    const invoice = invoices.find(inv => inv.id === req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Generate invoice HTML (reuse the existing generateInvoiceHTML function)
    const invoiceHTML = generateInvoiceHTML(invoice);
    
    res.json({
      success: true,
      html: invoiceHTML,
      invoiceNumber: invoice.invoiceNumber
    });
  } catch (error) {
    console.error('Generate PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating PDF',
      error: error.message
    });
  }
});

// Helper function to generate invoice HTML (same as in orders.js)
function generateInvoiceHTML(invoice) {
  const currentDate = new Date().toLocaleDateString('en-IN');
  const orderDate = new Date(invoice.dateIssued).toLocaleDateString('en-IN');
  const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-IN');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${invoice.invoiceNumber}</title>
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
          white-space: pre-line;
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
        
        @media print {
          body { 
            padding: 40px 20px;
            background: #ffffff;
          }
          .invoice-container { 
            box-shadow: none;
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
            <div class="invoice-number">Invoice Number #${invoice.invoiceNumber}</div>
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
            <div class="customer-name">${invoice.customer.name}</div>
            <div class="customer-address">
              ${invoice.customer.address}<br>
              ${invoice.customer.city}, ${invoice.customer.state}, ${invoice.customer.pinCode}
            </div>
          </div>
        </div>
        
        <!-- Date Information -->
        <div class="date-section">
          <div class="date-block">
            <div class="date-label">Date Issued :</div>
            <div class="date-value">${new Date(invoice.dateIssued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div class="date-block">
            <div class="date-label">Due Date:</div>
            <div class="date-value">${new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
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
            ${invoice.items.map(item => `
              <tr>
                <td>
                  <div class="product-name">${item.name}</div>
                </td>
                <td class="quantity">${item.quantity}</td>
                <td class="unit-price">₹${item.unitPrice.toLocaleString('en-IN')}</td>
                <td class="total-price">₹${item.total.toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <!-- Totals Section -->
        <div class="totals-section">
          <div class="total-row">
            <div class="total-label">Subtotal</div>
            <div class="total-amount">₹${invoice.subtotal.toLocaleString('en-IN')}</div>
          </div>
          <div class="total-row">
            <div class="total-label">Tax (GST ${invoice.taxPercentage}%)</div>
            <div class="total-amount">₹${invoice.tax.toLocaleString('en-IN')}</div>
          </div>
          ${invoice.discount > 0 ? `
            <div class="total-row">
              <div class="total-label">Discount</div>
              <div class="total-amount">-₹${invoice.discount.toLocaleString('en-IN')}</div>
            </div>
          ` : ''}
          <div class="total-row">
            <div class="total-label">Grand Total</div>
            <div class="total-amount">₹${invoice.grandTotal.toLocaleString('en-IN')}</div>
          </div>
        </div>
        
        ${invoice.notes ? `
          <!-- Notes Section -->
          <div class="notes-section">
            <div class="notes-title">Notes</div>
            <div class="notes-content">${invoice.notes}</div>
          </div>
        ` : ''}
        
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
