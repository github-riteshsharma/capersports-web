import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  ShoppingBagIcon,
  CreditCardIcon,
  MapPinIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items, totalPrice, shipping, tax, grandTotal, loading } = useSelector(state => state.cart);
  const { loading: orderLoading } = useSelector(state => state.orders);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Address
    shippingAddress: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pinCode: '',
      phone: '',
      email: user?.email || ''
    },
    // Payment Method
    paymentMethod: 'card',
    // Selected Bank for Net Banking
    selectedBank: '',
    // Card Payment Details
    cardDetails: {
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: ''
    },
    // UPI Payment Details
    upiId: '',
    // Order Notes
    orderNotes: ''
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const steps = [
    { id: 1, name: 'Shipping', icon: MapPinIcon },
    { id: 2, name: 'Payment', icon: CreditCardIcon },
    { id: 3, name: 'Review', icon: CheckCircleIcon }
  ];

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, items, navigate]);

  const handleInputChange = (section, field, value) => {
    if (section === '' || section === null) {
      // Handle top-level fields like paymentMethod, selectedBank, upiId
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    } else {
      // Handle nested fields like shippingAddress.field, cardDetails.field
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
      // Clear error when user starts typing
      if (errors[`${section}.${field}`]) {
        setErrors(prev => ({ ...prev, [`${section}.${field}`]: null }));
      }
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      // Validate shipping address
      const { shippingAddress } = formData;
      if (!shippingAddress.fullName) newErrors['shippingAddress.fullName'] = 'Full name is required';
      if (!shippingAddress.addressLine1) newErrors['shippingAddress.addressLine1'] = 'Address is required';
      if (!shippingAddress.city) newErrors['shippingAddress.city'] = 'City is required';
      if (!shippingAddress.state) newErrors['shippingAddress.state'] = 'State is required';
      if (!shippingAddress.pinCode) newErrors['shippingAddress.pinCode'] = 'Pin code is required';
      if (!shippingAddress.phone) newErrors['shippingAddress.phone'] = 'Phone number is required';
      if (!shippingAddress.email) newErrors['shippingAddress.email'] = 'Email is required';
    }
    
    if (step === 2) {
      // Validate payment method
      if (!formData.paymentMethod) newErrors['paymentMethod'] = 'Payment method is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePaymentProcessing = async () => {
    if (!validateStep(2)) return;
    
    const orderData = {
      items: items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product.price
      })),
      shippingAddress: formData.shippingAddress,
      paymentMethod: formData.paymentMethod,
      orderNotes: formData.orderNotes,
      subtotal: totalPrice,
      shippingFee: shipping,
      tax,
      total: grandTotal
    };

    try {
      // Handle different payment methods
      if (formData.paymentMethod === 'cod') {
        // Cash on Delivery - Direct order creation
        await handleDirectOrderCreation(orderData);
      } else if (formData.paymentMethod === 'card') {
        // Credit/Debit Card - Payment gateway integration
        await handleCardPayment(orderData);
      } else if (formData.paymentMethod === 'upi') {
        // UPI Payment - Payment gateway integration
        await handleUPIPayment(orderData);
      } else if (formData.paymentMethod === 'netbanking') {
        // Net Banking - Bank redirection
        await handleNetBankingPayment(orderData);
      }
    } catch (error) {
      toast.error(error || 'Payment processing failed');
    }
  };

  const handleDirectOrderCreation = async (orderData) => {
    const result = await dispatch(createOrder(orderData)).unwrap();
    await dispatch(clearCart());
    setOrderPlaced(true);
    toast.success('Order placed successfully!');
    
    // Redirect to order confirmation after 3 seconds
    setTimeout(() => {
      navigate(`/orders/${result.order._id}`);
    }, 3000);
  };

  const handleCardPayment = async (orderData) => {
    // Get card details from state
    const { cardNumber, cardholderName, expiryDate, cvv } = formData.cardDetails;

    // Validate card details
    if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
      toast.error('Please fill in all card details');
      return;
    }

    // Additional validation
    if (cardNumber.replace(/\s/g, '').length < 13) {
      toast.error('Please enter a valid card number');
      return;
    }
    if (expiryDate.length !== 5) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return;
    }
    if (cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return;
    }

    // Card Payment Gateway Integration Required
    toast.loading('Processing card payment...');
    
    // In a real application, you would integrate with a payment gateway like Razorpay, Stripe, etc.
    setTimeout(() => {
      toast.dismiss();
      
      // Show payment gateway integration message
      const proceedWithDemo = window.confirm(
        'Card Payment Gateway Integration Required\n\n' +
        'This is a demo application. In production, this would integrate with a real payment gateway like Razorpay, Stripe, or PayU.\n\n' +
        'For demonstration purposes only, click OK to simulate a successful payment, or Cancel to abort.\n\n' +
        'WARNING: In production, orders should only be created after verified payment completion.'
      );
      
      if (proceedWithDemo) {
        toast.success('Demo: Card payment simulated as successful');
        handleDirectOrderCreation(orderData);
      } else {
        toast.error('Card payment cancelled');
      }
    }, 2000);
  };

  const handleUPIPayment = async (orderData) => {
    // Get UPI ID from state
    const upiId = formData.upiId;

    if (!upiId) {
      toast.error('Please enter your UPI ID');
      return;
    }

    // Validate UPI ID format
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiId)) {
      toast.error('Please enter a valid UPI ID');
      return;
    }

    // UPI Payment Gateway Integration Required
    toast.loading('Initiating UPI payment...');
    
    // In a real application, you would integrate with a UPI payment gateway like Razorpay, PayU, etc.
    // For now, we'll show a message that payment gateway integration is needed
    setTimeout(() => {
      toast.dismiss();
      
      // Show payment gateway integration message
      const proceedWithDemo = window.confirm(
        'UPI Payment Gateway Integration Required\n\n' +
        'This is a demo application. In production, this would integrate with a real UPI payment gateway like Razorpay, PayU, or Paytm.\n\n' +
        'For demonstration purposes only, click OK to simulate a successful payment, or Cancel to abort.\n\n' +
        'WARNING: In production, orders should only be created after verified payment completion.'
      );
      
      if (proceedWithDemo) {
        toast.success('Demo: UPI payment simulated as successful');
        handleDirectOrderCreation(orderData);
      } else {
        toast.error('UPI payment cancelled');
      }
    }, 2000);
  };

  const handleNetBankingPayment = async (orderData) => {
    // Get selected bank from state
    const selectedBank = formData.selectedBank;

    if (!selectedBank) {
      toast.error('Please select your bank');
      return;
    }

    // Bank URLs for redirection (demo URLs - in production, use actual payment gateway URLs)
    const bankUrls = {
      'sbi': 'https://retail.onlinesbi.sbi/retail/login.htm',
      'hdfc': 'https://netbanking.hdfcbank.com/netbanking/',
      'icici': 'https://infinity.icicibank.com/corp/Login.jsp',
      'axis': 'https://www.axisbank.com/retail/online-services/axisbank-internet-banking',
      'kotak': 'https://netbanking.kotak.com/knb2/',
      'pnb': 'https://netpnb.com/',
      'bob': 'https://www.bankofbaroda.in/personal-banking/digital-products/internet-banking',
      'canara': 'https://netbanking.canarabank.com/entry/ENULogin.jsp',
      'union': 'https://www.unionbankofindia.co.in/english/internet-banking.aspx'
    };

    const bankUrl = bankUrls[selectedBank];
    
    if (bankUrl) {
      // Show loading message
      toast.loading('Redirecting to bank login page...');
      
      // In a real application, you would:
      // 1. Create a pending order
      // 2. Generate a payment session with your payment gateway
      // 3. Redirect to the payment gateway URL with order details
      // 4. Handle the callback from the payment gateway
      
      // For demo purposes, simulate the redirection process
      setTimeout(() => {
        toast.dismiss();
        
        // Show confirmation dialog
        const userConfirmed = window.confirm(
          `You will be redirected to ${selectedBank.toUpperCase()} Bank's secure login page.\n\n` +
          `Please complete your payment there and return to this page.\n\n` +
          `Click OK to proceed with redirection.`
        );
        
        if (userConfirmed) {
          // Open bank URL in new tab
          const bankWindow = window.open(bankUrl, '_blank');
          
          if (bankWindow) {
            toast.success('Redirected to bank login page. Complete your payment and return here.');
            
            // Simulate successful payment after user returns
            // In real implementation, this would be handled by payment gateway callback
            setTimeout(async () => {
              const paymentCompleted = window.confirm(
                'Have you completed the payment on the bank website?\n\n' +
                'Click OK if payment was successful, or Cancel to try again.'
              );
              
              if (paymentCompleted) {
                toast.success('Net banking payment successful!');
                await handleDirectOrderCreation(orderData);
              } else {
                toast.error('Payment was not completed. Please try again.');
              }
            }, 5000);
          } else {
            toast.error('Popup blocked. Please allow popups and try again.');
          }
        }
      }, 1000);
    } else {
      toast.error('Bank redirection not available. Please select a different payment method.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return;
    await handlePaymentProcessing();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          >
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for your order. You will receive a confirmation email shortly.
            </p>
            <div className="animate-pulse text-sm text-gray-500 dark:text-gray-400">
              Redirecting to order details...
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Caper Sports</title>
        <meta name="description" content="Complete your purchase" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isActive ? 'bg-blue-600 text-white' : 
                      isCompleted ? 'bg-green-600 text-white' : 
                      'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 
                      isCompleted ? 'text-green-600 dark:text-green-400' : 
                      'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.name}
                    </span>
                    {step.id < steps.length && (
                      <div className={`ml-4 w-16 h-0.5 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* This will be populated with step content */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {steps[currentStep - 1].name} Information
                </h2>
                {/* Step 1: Shipping Address */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.shippingAddress.fullName}
                          onChange={(e) => handleInputChange('shippingAddress', 'fullName', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                            errors['shippingAddress.fullName'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors['shippingAddress.fullName'] && (
                          <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.fullName']}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.shippingAddress.email}
                          onChange={(e) => handleInputChange('shippingAddress', 'email', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                            errors['shippingAddress.email'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Enter your email"
                        />
                        {errors['shippingAddress.email'] && (
                          <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.email']}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.addressLine1}
                        onChange={(e) => handleInputChange('shippingAddress', 'addressLine1', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                          errors['shippingAddress.addressLine1'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Street address, P.O. Box, company name"
                      />
                      {errors['shippingAddress.addressLine1'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.addressLine1']}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.addressLine2}
                        onChange={(e) => handleInputChange('shippingAddress', 'addressLine2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={formData.shippingAddress.city}
                          onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                            errors['shippingAddress.city'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Enter city"
                        />
                        {errors['shippingAddress.city'] && (
                          <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.city']}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State *
                        </label>
                        <select
                          value={formData.shippingAddress.state}
                          onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                            errors['shippingAddress.state'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <option value="">Select State</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                          <option value="Assam">Assam</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                          <option value="Goa">Goa</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Himachal Pradesh">Himachal Pradesh</option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Manipur">Manipur</option>
                          <option value="Meghalaya">Meghalaya</option>
                          <option value="Mizoram">Mizoram</option>
                          <option value="Nagaland">Nagaland</option>
                          <option value="Odisha">Odisha</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Sikkim">Sikkim</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tripura">Tripura</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Uttarakhand">Uttarakhand</option>
                          <option value="West Bengal">West Bengal</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                          <option value="Ladakh">Ladakh</option>
                          <option value="Puducherry">Puducherry</option>
                          <option value="Chandigarh">Chandigarh</option>
                        </select>
                        {errors['shippingAddress.state'] && (
                          <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.state']}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Pin Code *
                        </label>
                        <input
                          type="text"
                          value={formData.shippingAddress.pinCode}
                          onChange={(e) => handleInputChange('shippingAddress', 'pinCode', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                            errors['shippingAddress.pinCode'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Enter pin code"
                          maxLength="6"
                        />
                        {errors['shippingAddress.pinCode'] && (
                          <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.pinCode']}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.shippingAddress.phone}
                        onChange={(e) => handleInputChange('shippingAddress', 'phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                          errors['shippingAddress.phone'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Enter phone number"
                      />
                      {errors['shippingAddress.phone'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.phone']}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Credit/Debit Card */}
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'card' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => handleInputChange(null, 'paymentMethod', 'card')}
                      >
                        <div className="flex items-center space-x-3">
                          <CreditCardIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Credit/Debit Card</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Visa, MasterCard, RuPay</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* UPI */}
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'upi' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => handleInputChange(null, 'paymentMethod', 'upi')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-6 w-6 bg-orange-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">UPI</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">UPI</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pay using UPI ID</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Net Banking */}
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'netbanking' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => handleInputChange(null, 'paymentMethod', 'netbanking')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-6 w-6 bg-green-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">NB</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Net Banking</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">All major banks</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Cash on Delivery */}
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === 'cod' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => handleInputChange(null, 'paymentMethod', 'cod')}
                      >
                        <div className="flex items-center space-x-3">
                          <TruckIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Cash on Delivery</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {errors['paymentMethod'] && (
                      <p className="text-sm text-red-600">{errors['paymentMethod']}</p>
                    )}
                    
                    {/* Payment Details Forms */}
                    {formData.paymentMethod && (
                      <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Payment Details
                        </h3>
                        
                        {/* Credit/Debit Card Form */}
                        {formData.paymentMethod === 'card' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Card Number
                                </label>
                                <input
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  value={formData.cardDetails.cardNumber}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                  maxLength="19"
                                  onChange={(e) => {
                                    // Format card number with spaces
                                    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                                    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                    handleInputChange('cardDetails', 'cardNumber', value);
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Cardholder Name
                                </label>
                                <input
                                  type="text"
                                  placeholder="John Doe"
                                  value={formData.cardDetails.cardholderName}
                                  onChange={(e) => handleInputChange('cardDetails', 'cardholderName', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  placeholder="MM/YY"
                                  value={formData.cardDetails.expiryDate}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                  maxLength="5"
                                  onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, '');
                                    if (value.length >= 2) {
                                      value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                    }
                                    handleInputChange('cardDetails', 'expiryDate', value);
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  CVV
                                </label>
                                <input
                                  type="text"
                                  placeholder="123"
                                  value={formData.cardDetails.cvv}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                  maxLength="4"
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    handleInputChange('cardDetails', 'cvv', value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* UPI Form */}
                        {formData.paymentMethod === 'upi' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                UPI ID
                              </label>
                              <input
                                type="text"
                                placeholder="yourname@paytm / yourname@gpay"
                                value={formData.upiId}
                                onChange={(e) => handleInputChange(null, 'upiId', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                              />
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>Popular UPI Apps:</strong> Google Pay, PhonePe, Paytm, BHIM, Amazon Pay
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Net Banking Form */}
                        {formData.paymentMethod === 'netbanking' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select Your Bank
                              </label>
                              <select 
                                value={formData.selectedBank}
                                onChange={(e) => handleInputChange(null, 'selectedBank', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                              >
                                <option value="">Choose your bank</option>
                                <option value="sbi">State Bank of India</option>
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="axis">Axis Bank</option>
                                <option value="kotak">Kotak Mahindra Bank</option>
                                <option value="pnb">Punjab National Bank</option>
                                <option value="bob">Bank of Baroda</option>
                                <option value="canara">Canara Bank</option>
                                <option value="union">Union Bank of India</option>
                                <option value="other">Other Banks</option>
                              </select>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                              <p className="text-sm text-green-700 dark:text-green-300">
                                You will be redirected to your bank's secure login page to complete the payment.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Cash on Delivery Info */}
                        {formData.paymentMethod === 'cod' && (
                          <div className="space-y-4">
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md p-4">
                              <div className="flex items-start">
                                <TruckIcon className="h-5 w-5 text-orange-400 mt-0.5 mr-3" />
                                <div>
                                  <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                    Cash on Delivery
                                  </h4>
                                  <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                                    Pay ₹{grandTotal.toFixed(2)} in cash when your order is delivered to your doorstep.
                                  </p>
                                  <ul className="mt-2 text-xs text-orange-600 dark:text-orange-400 space-y-1">
                                    <li>• Please keep exact change ready</li>
                                    <li>• COD available for orders up to ₹50,000</li>
                                    <li>• Additional COD charges may apply</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ShieldCheckIcon className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Secure Payment
                          </h3>
                          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                            Your payment information is encrypted and secure. We never store your payment details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Shipping Address Review */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipping Address</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p className="font-medium">{formData.shippingAddress.fullName}</p>
                        <p>{formData.shippingAddress.addressLine1}</p>
                        {formData.shippingAddress.addressLine2 && (
                          <p>{formData.shippingAddress.addressLine2}</p>
                        )}
                        <p>
                          {formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.pinCode}
                        </p>
                        <p>{formData.shippingAddress.phone}</p>
                        <p>{formData.shippingAddress.email}</p>
                      </div>
                    </div>
                    
                    {/* Payment Method Review */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Method</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p className="capitalize">
                          {formData.paymentMethod === 'card' ? 'Credit/Debit Card' :
                           formData.paymentMethod === 'upi' ? 'UPI' :
                           formData.paymentMethod === 'netbanking' ? 'Net Banking' :
                           formData.paymentMethod === 'cod' ? 'Cash on Delivery' : formData.paymentMethod}
                        </p>
                      </div>
                    </div>
                    
                    {/* Order Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        value={formData.orderNotes}
                        onChange={(e) => handleInputChange(null, 'orderNotes', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Any special instructions for your order..."
                      />
                    </div>
                    
                    {/* Order Confirmation */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Ready to Place Order
                          </h3>
                          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                            Please review your order details above and click "Place Order" to confirm your purchase.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back
                </button>
                
                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderLoading}
                    className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {orderLoading ? 'Processing...' : 'Place Order'}
                    <CheckCircleIcon className="h-4 w-4 ml-2" />
                  </button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ShoppingBagIcon className="h-5 w-5 mr-2" />
                  Order Summary
                </h3>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.product._id}-${item.size}-${item.color}`} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.size} • {item.color} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pricing Summary */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-white">
                      {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax (GST)</span>
                    <span className="text-gray-900 dark:text-white">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium border-t border-gray-200 dark:border-gray-700 pt-2">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Security Features */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <TruckIcon className="h-4 w-4" />
                    <span>Free shipping on orders over ₹1000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
