import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiSave, 
  FiSend, 
  FiEye, 
  FiEdit, 
  FiTrash2,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiFileText,
  FiDownload,
  FiMail,
  FiSettings,
  FiX
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminInvoices = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Add custom CSS for hiding scrollbars
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;  /* Internet Explorer 10+ */
        scrollbar-width: none;  /* Firefox */
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;  /* Safari and Chrome */
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Invoice form state
  const [isCreating, setIsCreating] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6).padStart(6, '0')}-000`,
    dateIssued: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    billedTo: {
      name: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pinCode: '',
      phone: ''
    },
    items: [
      { name: '', quantity: 1, unitPrice: 0, total: 0 }
    ],
    subtotal: 0,
    taxPercentage: 18,
    tax: 0,
    discount: 0,
    grandTotal: 0,
    notes: 'Payment is due by the due date mentioned above.\nInclude the invoice number in the payment reference to ensure accurate processing.'
  });

  // Mock existing invoices data
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-129482-001',
      customer: 'Brightstone Industries',
      amount: 6080,
      status: 'Paid',
      date: '2025-01-17',
      dueDate: '2025-01-31'
    },
    {
      id: 'INV-129483-002',
      customer: 'Tech Solutions Ltd',
      amount: 4500,
      status: 'Pending',
      date: '2025-01-16',
      dueDate: '2025-01-30'
    },
    {
      id: 'INV-129484-003',
      customer: 'Global Enterprises',
      amount: 8200,
      status: 'Overdue',
      date: '2025-01-10',
      dueDate: '2025-01-25'
    }
  ]);

  // Generate new invoice number
  const generateNewInvoiceNumber = () => {
    return `INV-${Date.now().toString().slice(-6).padStart(6, '0')}-000`;
  };

  // Handle invoice actions
  const handleViewInvoice = (invoice) => {
    // Set the invoice data for viewing
    setInvoiceData({
      invoiceNumber: invoice.id,
      dateIssued: invoice.date,
      dueDate: invoice.dueDate || invoice.date,
      billedTo: {
        name: invoice.customer,
        email: invoice.email || '',
        address: invoice.address || '',
        city: invoice.city || '',
        state: invoice.state || '',
        pinCode: invoice.pinCode || ''
      },
      items: invoice.items || [
        { name: 'Sample Item', quantity: 1, unitPrice: invoice.amount, total: invoice.amount }
      ],
      subtotal: invoice.amount,
      taxPercentage: 18,
      tax: Math.round(invoice.amount * 0.18),
      discount: 0,
      grandTotal: Math.round(invoice.amount * 1.18),
      notes: invoice.notes || ''
    });
    setIsCreating(true);
  };

  const handleEditInvoice = (invoice) => {
    handleViewInvoice(invoice);
  };

  const handleDownloadInvoice = (invoice) => {
    // Create a temporary invoice data for download
    const tempInvoiceData = {
      invoiceNumber: invoice.id,
      dateIssued: invoice.date,
      dueDate: invoice.dueDate || invoice.date,
      billedTo: {
        name: invoice.customer,
        email: invoice.email || '',
        address: invoice.address || '',
        city: invoice.city || '',
        state: invoice.state || '',
        pinCode: invoice.pinCode || ''
      },
      items: invoice.items || [
        { name: 'Sample Item', quantity: 1, unitPrice: invoice.amount, total: invoice.amount }
      ],
      subtotal: invoice.amount,
      taxPercentage: 18,
      tax: Math.round(invoice.amount * 0.18),
      discount: 0,
      grandTotal: Math.round(invoice.amount * 1.18),
      notes: invoice.notes || ''
    };

    // Generate HTML and download
    const htmlContent = generateInvoiceHTMLWithLogo(tempInvoiceData);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleDeleteInvoice = (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.id}?`)) {
      setInvoices(prevInvoices => prevInvoices.filter(inv => inv.id !== invoice.id));
      toast.success('Invoice deleted successfully');
    }
  };

  // Initialize with auto-generated invoice number
  useEffect(() => {
    if (!invoiceData.invoiceNumber || invoiceData.invoiceNumber.startsWith('INV-')) {
      setInvoiceData(prev => ({
        ...prev,
        invoiceNumber: generateNewInvoiceNumber()
      }));
    }
  }, [isCreating]);
  useEffect(() => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = (subtotal * invoiceData.taxPercentage) / 100;
    const grandTotal = subtotal + tax - invoiceData.discount;

    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      tax,
      grandTotal: Math.max(0, grandTotal)
    }));
  }, [invoiceData.items, invoiceData.taxPercentage, invoiceData.discount]);

  // Update item totals when quantity or price changes
  const updateItemTotal = (index, field, value) => {
    const newItems = [...invoiceData.items];
    if (field === 'name') {
      newItems[index][field] = value; // For name, just set the string value
    } else {
      newItems[index][field] = field === 'quantity' ? parseInt(value) || 0 : parseFloat(value) || 0;
    }
    newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    
    setInvoiceData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setInvoiceData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setInvoiceData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveInvoice = () => {
    // Here you would save the invoice to your backend
    console.log('Saving invoice:', invoiceData);
    alert('Invoice saved successfully!');
  };

  const handleSendInvoice = () => {
    // Here you would send the invoice via email
    console.log('Sending invoice:', invoiceData);
    alert('Invoice sent successfully!');
  };

  // Download PDF functionality with better logo handling
  const handleDownloadPDF = async () => {
    try {
      // Create a new window with the invoice HTML
      const printWindow = window.open('', '_blank');
      const invoiceHTML = await generateInvoiceHTMLWithLogo();
      
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 1000); // Increased timeout to allow logo to load
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Generate invoice HTML with better logo handling
  const generateInvoiceHTMLWithLogo = async () => {
    // Try to convert logo to base64 for better PDF compatibility
    let logoDataUrl = '';
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      const loadImage = new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(''); // Fallback to empty string
      });
      
      img.src = '/images/logo.png';
      logoDataUrl = await loadImage;
    } catch (error) {
      console.log('Could not load logo, using fallback');
      logoDataUrl = '';
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${invoiceData.invoiceNumber}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5; color: #000000; background: #ffffff; font-size: 14px; padding: 60px 40px; font-weight: 400;
          }
          .invoice-container { max-width: 800px; margin: 0 auto; background: #ffffff; }
          .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; padding-bottom: 30px; }
          .invoice-title-section { flex: 1; }
          .invoice-title { font-size: 40px; font-weight: 300; color: #000000; margin-bottom: 8px; letter-spacing: -0.8px; }
          .invoice-number { font-size: 14px; color: #6b7280; font-weight: 400; }
          .logo-section { flex-shrink: 0; margin-left: 40px; }
          .logo { width: 60px; height: 60px; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .logo img { width: 100%; height: 100%; object-fit: contain; }
          .logo-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #0d9488; color: white; font-weight: bold; font-size: 20px; border-radius: 8px; }
          .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 60px; }
          .info-label { font-size: 14px; color: #6b7280; margin-bottom: 10px; font-weight: 400; }
          .company-name, .customer-name { font-size: 20px; font-weight: 600; color: #000000; margin-bottom: 6px; line-height: 1.2; }
          .company-address, .customer-address { font-size: 14px; color: #6b7280; line-height: 1.6; font-weight: 400; }
          .date-section { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 60px; }
          .date-label { font-size: 14px; color: #6b7280; margin-bottom: 10px; font-weight: 400; }
          .date-value { font-size: 20px; font-weight: 600; color: #000000; }
          .invoice-details-title { font-size: 16px; color: #6b7280; margin-bottom: 25px; font-weight: 400; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 50px; }
          .items-table thead th { padding: 0 0 18px 0; text-align: left; font-weight: 500; font-size: 14px; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
          .items-table thead th:nth-child(2) { text-align: center; }
          .items-table thead th:nth-child(3), .items-table thead th:nth-child(4) { text-align: right; }
          .items-table tbody td { padding: 22px 0; border-bottom: 1px solid #f3f4f6; vertical-align: top; font-size: 14px; }
          .items-table tbody tr:last-child td { border-bottom: none; padding-bottom: 0; }
          .product-name { font-weight: 500; color: #000000; margin-bottom: 4px; line-height: 1.4; }
          .quantity { text-align: center; font-weight: 500; color: #000000; }
          .unit-price, .total-price { text-align: right; font-weight: 500; color: #000000; }
          .totals-section { margin-top: 50px; padding-top: 25px; }
          .total-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 14px; }
          .total-row:last-child { padding-top: 18px; margin-top: 18px; border-top: 1px solid #e5e7eb; }
          .total-label { color: #000000; font-weight: 500; }
          .total-amount { color: #000000; font-weight: 500; text-align: right; min-width: 120px; }
          .total-row:last-child .total-label, .total-row:last-child .total-amount { font-weight: 700; font-size: 16px; }
          .notes-section { margin-top: 70px; }
          .notes-title { font-size: 16px; color: #000000; margin-bottom: 18px; font-weight: 500; }
          .notes-content { color: #6b7280; font-size: 14px; line-height: 1.6; white-space: pre-line; }
          .footer { margin-top: 70px; padding-top: 35px; border-top: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
          .company-footer { font-size: 16px; font-weight: 600; color: #000000; }
          .contact-info { font-size: 14px; color: #6b7280; text-align: right; }
          @media print { body { padding: 40px 20px; } }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="invoice-title-section">
              <div class="invoice-title">Invoice</div>
              <div class="invoice-number">Invoice Number #${invoiceData.invoiceNumber}</div>
            </div>
            <div class="logo-section">
              <div class="logo">
                ${logoDataUrl ? 
                  `<img src="${logoDataUrl}" alt="CaperSports Logo" />` : 
                  `<div class="logo-fallback">CS</div>`
                }
              </div>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-block">
              <div class="info-label">Billed By :</div>
              <div class="company-name">CaperSports</div>
              <div class="company-address">123 Sports Avenue, Floor 2,<br>Mumbai, India</div>
            </div>
            <div class="info-block">
              <div class="info-label">Billed To :</div>
              <div class="customer-name">${invoiceData.billedTo.name || 'Customer Name'}</div>
              <div class="customer-address">
                ${invoiceData.billedTo.address ? `${invoiceData.billedTo.address}<br>` : ''}
                ${(invoiceData.billedTo.city || invoiceData.billedTo.state || invoiceData.billedTo.pinCode) ? 
                  `${invoiceData.billedTo.city}${invoiceData.billedTo.city && invoiceData.billedTo.state ? ', ' : ''}${invoiceData.billedTo.state} ${invoiceData.billedTo.pinCode}` : ''}
              </div>
            </div>
          </div>
          
          <div class="date-section">
            <div class="date-block">
              <div class="date-label">Date Issued :</div>
              <div class="date-value">${new Date(invoiceData.dateIssued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div class="date-block">
              <div class="date-label">Due Date:</div>
              <div class="date-value">${new Date(invoiceData.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
          
          <div class="invoice-details-title">Invoice Details</div>
          
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
              ${invoiceData.items.map(item => `
                <tr>
                  <td><div class="product-name">${item.name || 'Item Name'}</div></td>
                  <td class="quantity">${item.quantity}</td>
                  <td class="unit-price">₹${item.unitPrice.toLocaleString('en-IN')}</td>
                  <td class="total-price">₹${item.total.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals-section">
            <div class="total-row">
              <div class="total-label">Subtotal</div>
              <div class="total-amount">₹${invoiceData.subtotal.toLocaleString('en-IN')}</div>
            </div>
            <div class="total-row">
              <div class="total-label">Tax (${invoiceData.taxPercentage}%)</div>
              <div class="total-amount">₹${invoiceData.tax.toLocaleString('en-IN')}</div>
            </div>
            ${invoiceData.discount > 0 ? `
              <div class="total-row">
                <div class="total-label">Discount</div>
                <div class="total-amount">-₹${invoiceData.discount.toLocaleString('en-IN')}</div>
              </div>
            ` : ''}
            <div class="total-row">
              <div class="total-label">Grand Total</div>
              <div class="total-amount">₹${invoiceData.grandTotal.toLocaleString('en-IN')}</div>
            </div>
          </div>
          
          ${invoiceData.notes ? `
            <div class="notes-section">
              <div class="notes-title">Notes</div>
              <div class="notes-content">${invoiceData.notes}</div>
            </div>
          ` : ''}
          
          <div class="footer">
            <div class="company-footer">CaperSports Private Limited, IND</div>
            <div class="contact-info">(+91) 823-4567-8901</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Email functionality
  const handleEmailInvoice = () => {
    try {
      if (!invoiceData.billedTo.email) {
        alert('Please enter customer email address first.');
        return;
      }

      const subject = `Invoice ${invoiceData.invoiceNumber} from CaperSports`;
      const body = `Dear ${invoiceData.billedTo.name || 'Customer'},

Please find attached your invoice ${invoiceData.invoiceNumber} for the amount of ₹${invoiceData.grandTotal.toLocaleString('en-IN')}.

Invoice Details:
- Invoice Number: ${invoiceData.invoiceNumber}
- Date Issued: ${new Date(invoiceData.dateIssued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
- Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
- Total Amount: ₹${invoiceData.grandTotal.toLocaleString('en-IN')}

Thank you for your business!

Best regards,
CaperSports Team
support@capersports.com
+91-1800-CAPER-SPORTS`;

      const mailtoLink = `mailto:${invoiceData.billedTo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
      
      alert('Email client opened with invoice details. Please attach the invoice PDF if needed.');
    } catch (error) {
      console.error('Error opening email client:', error);
      alert('Error opening email client. Please try again.');
    }
  };

  // Generate invoice HTML for PDF
  const generateInvoiceHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${invoiceData.invoiceNumber}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5; color: #000000; background: #ffffff; font-size: 14px; padding: 60px 40px; font-weight: 400;
          }
          .invoice-container { max-width: 800px; margin: 0 auto; background: #ffffff; }
          .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; padding-bottom: 30px; }
          .invoice-title-section { flex: 1; }
          .invoice-title { font-size: 40px; font-weight: 300; color: #000000; margin-bottom: 8px; letter-spacing: -0.8px; }
          .invoice-number { font-size: 14px; color: #6b7280; font-weight: 400; }
          .logo-section { flex-shrink: 0; margin-left: 40px; }
          .logo { width: 60px; height: 60px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background-color: #0d9488; color: white; font-weight: bold; font-size: 20px; }
          .logo img { width: 100%; height: 100%; object-fit: contain; border-radius: 8px; }
          .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 60px; }
          .info-label { font-size: 14px; color: #6b7280; margin-bottom: 10px; font-weight: 400; }
          .company-name, .customer-name { font-size: 20px; font-weight: 600; color: #000000; margin-bottom: 6px; line-height: 1.2; }
          .company-address, .customer-address { font-size: 14px; color: #6b7280; line-height: 1.6; font-weight: 400; }
          .date-section { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 60px; }
          .date-label { font-size: 14px; color: #6b7280; margin-bottom: 10px; font-weight: 400; }
          .date-value { font-size: 20px; font-weight: 600; color: #000000; }
          .invoice-details-title { font-size: 16px; color: #6b7280; margin-bottom: 25px; font-weight: 400; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 50px; }
          .items-table thead th { padding: 0 0 18px 0; text-align: left; font-weight: 500; font-size: 14px; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
          .items-table thead th:nth-child(2) { text-align: center; }
          .items-table thead th:nth-child(3), .items-table thead th:nth-child(4) { text-align: right; }
          .items-table tbody td { padding: 22px 0; border-bottom: 1px solid #f3f4f6; vertical-align: top; font-size: 14px; }
          .items-table tbody tr:last-child td { border-bottom: none; padding-bottom: 0; }
          .product-name { font-weight: 500; color: #000000; margin-bottom: 4px; line-height: 1.4; }
          .quantity { text-align: center; font-weight: 500; color: #000000; }
          .unit-price, .total-price { text-align: right; font-weight: 500; color: #000000; }
          .totals-section { margin-top: 50px; padding-top: 25px; }
          .total-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 14px; }
          .total-row:last-child { padding-top: 18px; margin-top: 18px; border-top: 1px solid #e5e7eb; }
          .total-label { color: #000000; font-weight: 500; }
          .total-amount { color: #000000; font-weight: 500; text-align: right; min-width: 120px; }
          .total-row:last-child .total-label, .total-row:last-child .total-amount { font-weight: 700; font-size: 16px; }
          .notes-section { margin-top: 70px; }
          .notes-title { font-size: 16px; color: #000000; margin-bottom: 18px; font-weight: 500; }
          .notes-content { color: #6b7280; font-size: 14px; line-height: 1.6; white-space: pre-line; }
          .footer { margin-top: 70px; padding-top: 35px; border-top: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
          .company-footer { font-size: 16px; font-weight: 600; color: #000000; }
          .contact-info { font-size: 14px; color: #6b7280; text-align: right; }
          @media print { body { padding: 40px 20px; } }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="invoice-title-section">
              <div class="invoice-title">Invoice</div>
              <div class="invoice-number">Invoice Number #${invoiceData.invoiceNumber}</div>
            </div>
            <div class="logo-section">
              <div class="logo">
                <img src="/images/logo.png" alt="CaperSports Logo" onerror="this.style.display='none'; this.parentNode.innerHTML='CS';" />
              </div>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-block">
              <div class="info-label">Billed By :</div>
              <div class="company-name">CaperSports</div>
              <div class="company-address">123 Sports Avenue, Floor 2,<br>Mumbai, India</div>
            </div>
            <div class="info-block">
              <div class="info-label">Billed To :</div>
              <div class="customer-name">${invoiceData.billedTo.name || 'Customer Name'}</div>
              <div class="customer-address">
                ${invoiceData.billedTo.address ? `${invoiceData.billedTo.address}<br>` : ''}
                ${(invoiceData.billedTo.city || invoiceData.billedTo.state || invoiceData.billedTo.pinCode) ? 
                  `${invoiceData.billedTo.city}${invoiceData.billedTo.city && invoiceData.billedTo.state ? ', ' : ''}${invoiceData.billedTo.state} ${invoiceData.billedTo.pinCode}` : ''}
              </div>
            </div>
          </div>
          
          <div class="date-section">
            <div class="date-block">
              <div class="date-label">Date Issued :</div>
              <div class="date-value">${new Date(invoiceData.dateIssued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div class="date-block">
              <div class="date-label">Due Date:</div>
              <div class="date-value">${new Date(invoiceData.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
          
          <div class="invoice-details-title">Invoice Details</div>
          
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
              ${invoiceData.items.map(item => `
                <tr>
                  <td><div class="product-name">${item.name || 'Item Name'}</div></td>
                  <td class="quantity">${item.quantity}</td>
                  <td class="unit-price">₹${item.unitPrice.toLocaleString('en-IN')}</td>
                  <td class="total-price">₹${item.total.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals-section">
            <div class="total-row">
              <div class="total-label">Subtotal</div>
              <div class="total-amount">₹${invoiceData.subtotal.toLocaleString('en-IN')}</div>
            </div>
            <div class="total-row">
              <div class="total-label">Tax (${invoiceData.taxPercentage}%)</div>
              <div class="total-amount">₹${invoiceData.tax.toLocaleString('en-IN')}</div>
            </div>
            ${invoiceData.discount > 0 ? `
              <div class="total-row">
                <div class="total-label">Discount</div>
                <div class="total-amount">-₹${invoiceData.discount.toLocaleString('en-IN')}</div>
              </div>
            ` : ''}
            <div class="total-row">
              <div class="total-label">Grand Total</div>
              <div class="total-amount">₹${invoiceData.grandTotal.toLocaleString('en-IN')}</div>
            </div>
          </div>
          
          ${invoiceData.notes ? `
            <div class="notes-section">
              <div class="notes-title">Notes</div>
              <div class="notes-content">${invoiceData.notes}</div>
            </div>
          ` : ''}
          
          <div class="footer">
            <div class="company-footer">CaperSports Private Limited, IND</div>
            <div class="contact-info">(+91) 823-4567-8901</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Invoice Preview Component
  const InvoicePreview = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-h-[800px] overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-light text-gray-900 mb-2">Invoice</h1>
          <p className="text-sm text-gray-500">Invoice Number #{invoiceData.invoiceNumber}</p>
        </div>
        <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
          <img 
            src="/images/logo.png" 
            alt="CaperSports Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to CS text if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-full h-full bg-teal-600 rounded-lg hidden items-center justify-center">
            <div className="text-white font-bold text-xl">CS</div>
          </div>
        </div>
      </div>

      {/* Company and Customer Info */}
      <div className="grid grid-cols-2 gap-16 mb-12">
        <div>
          <p className="text-sm text-gray-500 mb-2">Billed By :</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">CaperSports</h3>
          <div className="text-sm text-gray-600 leading-relaxed">
            123 Sports Avenue, Floor 2,<br />
            Mumbai, India
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Billed To :</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {invoiceData.billedTo.name || 'Customer Name'}
          </h3>
          <div className="text-sm text-gray-600 leading-relaxed">
            {invoiceData.billedTo.address && `${invoiceData.billedTo.address}`}<br />
            {(invoiceData.billedTo.city || invoiceData.billedTo.state || invoiceData.billedTo.pinCode) && 
              `${invoiceData.billedTo.city}${invoiceData.billedTo.city && invoiceData.billedTo.state ? ', ' : ''}${invoiceData.billedTo.state} ${invoiceData.billedTo.pinCode}`
            }
          </div>
        </div>
      </div>

      {/* Date Information */}
      <div className="grid grid-cols-2 gap-16 mb-12">
        <div>
          <p className="text-sm text-gray-500 mb-2">Date Issued :</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(invoiceData.dateIssued).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Due Date:</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(invoiceData.dueDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <p className="text-gray-500 mb-6">Invoice Details</p>

      {/* Items Table */}
      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-500 pb-4">Items/Service</th>
              <th className="text-center text-sm font-medium text-gray-500 pb-4">Quantity</th>
              <th className="text-right text-sm font-medium text-gray-500 pb-4">Unit Price</th>
              <th className="text-right text-sm font-medium text-gray-500 pb-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-5">
                  <div className="font-medium text-gray-900">{item.name || 'Item Name'}</div>
                </td>
                <td className="py-5 text-center font-medium text-gray-900">{item.quantity}</td>
                <td className="py-5 text-right font-medium text-gray-900">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                <td className="py-5 text-right font-medium text-gray-900">₹{item.total.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="space-y-2 mb-12">
        <div className="flex justify-between py-2">
          <span className="text-gray-900 font-medium">Subtotal</span>
          <span className="text-gray-900 font-medium">₹{invoiceData.subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-900 font-medium">Tax ({invoiceData.taxPercentage}%)</span>
          <span className="text-gray-900 font-medium">₹{invoiceData.tax.toLocaleString('en-IN')}</span>
        </div>
        {invoiceData.discount > 0 && (
          <div className="flex justify-between py-2">
            <span className="text-gray-900 font-medium">Discount</span>
            <span className="text-gray-900 font-medium">-₹{invoiceData.discount.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="flex justify-between py-4 border-t border-gray-200">
          <span className="text-gray-900 font-bold text-lg">Grand Total</span>
          <span className="text-gray-900 font-bold text-lg">₹{invoiceData.grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Notes */}
      {invoiceData.notes && (
        <div className="mb-12">
          <h4 className="text-gray-900 font-medium mb-4">Notes</h4>
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {invoiceData.notes}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-100">
        <div className="text-gray-900 font-semibold">CaperSports Private Limited, IND</div>
        <div className="text-sm text-gray-600">(+91) 823-4567-8901</div>
      </div>
    </div>
  );

  return (
    <AdminLayout fullWidth={true}>
      <Helmet>
        <title>Invoice Management - Admin - Caper Sports</title>
      </Helmet>

      <div className="space-y-6 w-full max-w-none px-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">Create and manage customer invoices</p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              // Generate new invoice number when creating new invoice
              setInvoiceData(prev => ({
                ...prev,
                invoiceNumber: `INV-${Date.now().toString().slice(-6).padStart(6, '0')}-000`
              }));
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>

        {!isCreating ? (
          // Invoice List View
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Invoice #</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{invoice.id}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{invoice.customer}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">₹{invoice.amount.toLocaleString('en-IN')}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{invoice.date}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewInvoice(invoice)}
                            className="text-gray-400 hover:text-gray-600"
                            title="View Invoice"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditInvoice(invoice)}
                            className="text-gray-400 hover:text-blue-600"
                            title="Edit Invoice"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="text-gray-400 hover:text-green-600"
                            title="Download PDF"
                          >
                            <FiDownload className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteInvoice(invoice)}
                            className="text-gray-400 hover:text-red-600"
                            title="Delete Invoice"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Invoice Creation View
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
            {/* Left Side - Form - Equal width */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-w-0">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Invoice Detail</h2>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    // Generate new invoice number when closing and reopening
                    setInvoiceData(prev => ({
                      ...prev,
                      invoiceNumber: `INV-${Date.now().toString().slice(-6).padStart(6, '0')}-000`
                    }));
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[800px] overflow-y-auto scrollbar-hide">
                {/* Invoice Information */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Invoice Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={invoiceData.invoiceNumber}
                          onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                        />
                        <button
                          onClick={() => handleInputChange('invoiceNumber', `INV-${Date.now().toString().slice(-6).padStart(6, '0')}-000`)}
                          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Issued</label>
                        <input
                          type="date"
                          value={invoiceData.dateIssued}
                          onChange={(e) => handleInputChange('dateIssued', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                          type="date"
                          value={invoiceData.dueDate}
                          onChange={(e) => handleInputChange('dueDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billed To */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Billed To</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                      <input
                        type="text"
                        value={invoiceData.billedTo.name}
                        onChange={(e) => handleInputChange('billedTo.name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={invoiceData.billedTo.email}
                        onChange={(e) => handleInputChange('billedTo.email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                        placeholder="customer@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={invoiceData.billedTo.address}
                        onChange={(e) => handleInputChange('billedTo.address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                        placeholder="Street address"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={invoiceData.billedTo.city}
                          onChange={(e) => handleInputChange('billedTo.city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          value={invoiceData.billedTo.state}
                          onChange={(e) => handleInputChange('billedTo.state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
                        <input
                          type="text"
                          value={invoiceData.billedTo.pinCode}
                          onChange={(e) => handleInputChange('billedTo.pinCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                          placeholder="Pin"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">Invoice Items/Service</h3>
                    <button
                      onClick={addItem}
                      className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add New Items</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {invoiceData.items.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                          {invoiceData.items.length > 1 && (
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItemTotal(index, 'name', e.target.value)}
                            placeholder="Item name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                          />
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItemTotal(index, 'quantity', e.target.value)}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price</label>
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => updateItemTotal(index, 'unitPrice', e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Total</label>
                              <input
                                type="text"
                                value={`₹${item.total.toLocaleString('en-IN')}`}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tax and Discount */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Tax & Discount</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tax Percentage</label>
                      <input
                        type="number"
                        value={invoiceData.taxPercentage}
                        onChange={(e) => handleInputChange('taxPercentage', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discount (₹)</label>
                      <input
                        type="number"
                        value={invoiceData.discount}
                        onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={invoiceData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSaveInvoice}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <FiSave className="w-4 h-4" />
                      <span>Save as Draft</span>
                    </button>
                    <button
                      onClick={handleSendInvoice}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <FiSend className="w-4 h-4" />
                      <span>Send Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Preview - Equal width */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-w-0">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <FiSettings className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleEmailInvoice}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <FiMail className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <FiDownload className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <InvoicePreview />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
