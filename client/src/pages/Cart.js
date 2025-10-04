import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FiMinus, 
  FiPlus, 
  FiTrash2, 
  FiShoppingBag, 
  FiArrowLeft,
  FiCreditCard,
  FiTruck,
  FiShield,
  FiGift
} from 'react-icons/fi';

// Components
import Button from '../components/common/Button';
import CaperSportsLoader from '../components/common/CaperSportsLoader';

// Store
import { 
  getCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  applyCoupon,
  removeCoupon,
  // Local cart actions
  addToLocalCart,
  updateLocalCartItem,
  removeFromLocalCart,
  clearLocalCart
} from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { 
    items, 
    loading, 
    error, 
    totalItems, 
    totalPrice, 
    shipping, 
    tax, 
    discount, 
    grandTotal,
    couponCode
  } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [couponInput, setCouponInput] = useState('');
  const [applyCouponLoading, setApplyCouponLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  // Stock utility functions
  const getTotalStock = (product) => {
    if (!product) return 0;
    
    // Prioritize calculating from sizes array for accurate stock
    if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
      return product.sizes.reduce((total, size) => {
        return total + (size.stock || 0);
      }, 0);
    }
    
    // Fall back to totalStock property if sizes array is not available
    if (product.totalStock !== undefined) {
      return product.totalStock;
    }
    
    // Final fallback to general stock property
    return product.stock || 0;
  };

  const getSizeStock = (product, sizeName) => {
    if (!product || !product.sizes || !sizeName) return 0;
    const size = product.sizes.find(s => {
      // Handle both string sizes and object sizes
      const sName = typeof s === 'string' ? s : (s.size || s.name || s);
      return sName === sizeName;
    });
    
    if (!size) return 0;
    
    // If size is an object with stock property, return that stock
    if (typeof size === 'object' && size.stock !== undefined) {
      return size.stock;
    }
    
    // If size is a string, check if product has a general stock property
    if (typeof size === 'string') {
      return product.stock || 0;
    }
    
    return 0;
  };

  const getStockStatus = (product) => {
    const totalStock = getTotalStock(product);
    const lowStockThreshold = product?.lowStockThreshold || 10;
    
    if (totalStock === 0) {
      return {
        text: 'Out of Stock',
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      };
    } else if (totalStock <= lowStockThreshold) {
      return {
        text: 'Low Stock',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      };
    } else {
      return {
        text: 'In Stock',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    // If quantity is being decreased to 0, remove the item instead
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    
    // Find the cart item to validate stock
    const cartItem = items.find(item => item._id === itemId);
    if (!cartItem) return;
    
    const product = cartItem.product;
    const selectedSize = cartItem.size;
    const availableStock = selectedSize ? getSizeStock(product, selectedSize) : getTotalStock(product);
    
    // Validate stock availability
    if (newQuantity > availableStock) {
      toast.error(`Only ${availableStock} items available${selectedSize ? ` for size ${selectedSize}` : ''}`);
      return;
    }
    
    setUpdateLoading(prev => ({ ...prev, [itemId]: true }));
    
    try {
      if (isAuthenticated) {
        await dispatch(updateCartItem({ itemId, quantity: newQuantity })).unwrap();
      } else {
        dispatch(updateLocalCartItem({ itemId, quantity: newQuantity }));
      }
      toast.success('Quantity updated');
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setUpdateLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      if (isAuthenticated) {
        await dispatch(removeFromCart(itemId)).unwrap();
      } else {
        dispatch(removeFromLocalCart(itemId));
      }
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        if (isAuthenticated) {
          await dispatch(clearCart()).unwrap();
        } else {
          dispatch(clearLocalCart());
        }
        toast.success('Cart cleared');
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    setApplyCouponLoading(true);
    
    try {
      await dispatch(applyCoupon(couponInput)).unwrap();
      toast.success('Coupon applied successfully!');
      setCouponInput('');
    } catch (error) {
      toast.error(error || 'Invalid coupon code');
    } finally {
      setApplyCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await dispatch(removeCoupon()).unwrap();
      toast.success('Coupon removed');
    } catch (error) {
      toast.error('Failed to remove coupon');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-32">
            <CaperSportsLoader size="xl" showText />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Shopping Cart (${totalItems || 0}) - Caper Sports`}</title>
        <meta name="description" content="Review your selected items and proceed to checkout" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-4">
              <Link
                to="/products"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
              >
                <FiArrowLeft className="mr-2" size={20} />
                Continue Shopping
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Shopping Cart ({totalItems})
            </h1>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200"
              >
                Clear Cart
              </button>
            )}
          </motion.div>

          {items.length === 0 ? (
            /* Empty Cart */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <FiShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Button
                as={Link}
                to="/products"
                size="lg"
                className="inline-flex items-center"
              >
                <FiShoppingBag className="mr-2" size={20} />
                Start Shopping
              </Button>
            </motion.div>
          ) : (
            /* Cart Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {items.map((item) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 border border-gray-200"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.images?.[0] || '/images/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover rounded-lg"
                            onError={(e) => {
                              // Prevent infinite loop by checking if we already handled the error
                              if (e.target.dataset.errorHandled) {
                                return;
                              }
                              e.target.dataset.errorHandled = 'true';
                              // Hide the broken image and show a fallback
                              e.target.style.display = 'none';
                              const fallback = e.target.parentElement.querySelector('.image-fallback');
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.product._id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors duration-200"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-gray-600 mt-1">
                            {item.product.brand}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            {item.size && (
                              <span className="text-sm text-gray-500">
                                Size: <span className="font-medium">{item.size}</span>
                              </span>
                            )}
                            {item.color && (
                              <span className="text-sm text-gray-500">
                                Color: <span className="font-medium">{item.color}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            disabled={updateLoading[item._id]}
                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="w-12 text-center font-medium text-gray-900">
                            {updateLoading[item._id] ? (
                              <CaperSportsLoader size="sm" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            disabled={updateLoading[item._id]}
                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ₹{item.product.price.toLocaleString()} each
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                          title="Remove item"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h3>

                  {/* Coupon */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Coupon Code
                    </label>
                    {couponCode ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center">
                          <FiGift className="text-green-600 mr-2" size={16} />
                          <span className="text-green-700 dark:text-green-300 font-medium">
                            {couponCode}
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          loading={applyCouponLoading}
                          disabled={applyCouponLoading}
                          variant="outline"
                          size="sm"
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                      <span className="font-medium text-gray-900">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-gray-900">
                        {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (18% GST)</span>
                      <span className="font-medium text-gray-900">
                        ₹{tax.toLocaleString()}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount</span>
                        <span className="font-medium">
                          -₹{discount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        ₹{grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiTruck className="mr-2" size={16} />
                      {shipping === 0 ? (
                        'Free shipping on orders over ₹1,000'
                      ) : (
                        'Add ₹' + (1000 - totalPrice).toLocaleString() + ' more for free shipping'
                      )}
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <FiShield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="text-xs text-gray-600">Secure Payment</p>
                    </div>
                    <div className="text-center">
                      <FiTruck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-xs text-gray-600">Fast Delivery</p>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    as={Link}
                    to="/checkout"
                    size="lg"
                    className="w-full mb-4"
                  >
                    <FiCreditCard className="mr-2" size={20} />
                    Proceed to Checkout
                  </Button>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Secure checkout powered by industry-standard encryption
                  </p>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
