import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHeart, 
  FiShoppingCart, 
  FiStar, 
  FiPackage, 
  FiUser, 
  FiCreditCard,
  FiRefreshCw,
  FiBox,
  FiShoppingBag,
  FiTrendingUp,
  FiDatabase,
  FiLayers,
  FiUsers,
  FiFileText,
  FiSettings,
  FiSearch,
  FiFilter,
  FiDownload,
  FiUpload,
  FiTrash2,
  FiEdit,
  FiSave,
  FiCheckCircle
} from 'react-icons/fi';

const ContextualLoader = ({ 
  isVisible = false, 
  context = 'default', 
  message = '', 
  fullScreen = false,
  blur = true 
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Context-specific configurations
  const contextConfig = {
    // Shopping & Cart
    cart: {
      icon: FiShoppingCart,
      color: 'from-green-500 to-blue-500',
      messages: [
        'Adding to cart...',
        'Updating cart...',
        'Almost ready...'
      ],
      bgColor: 'bg-green-50/90'
    },
    removeCart: {
      icon: FiTrash2,
      color: 'from-red-500 to-orange-500',
      messages: [
        'Removing from cart...',
        'Updating cart...',
        'Almost done...'
      ],
      bgColor: 'bg-red-50/90'
    },
    
    // Wishlist
    wishlist: {
      icon: FiHeart,
      color: 'from-pink-500 to-red-500',
      messages: [
        'Adding to wishlist...',
        'Saving to favorites...',
        'Almost done...'
      ],
      bgColor: 'bg-pink-50/90'
    },
    removeWishlist: {
      icon: FiHeart,
      color: 'from-gray-500 to-gray-600',
      messages: [
        'Removing from wishlist...',
        'Updating favorites...',
        'Almost done...'
      ],
      bgColor: 'bg-gray-50/90'
    },
    checkWishlist: {
      icon: FiHeart,
      color: 'from-pink-400 to-red-400',
      messages: [
        'Checking wishlist...',
        'Loading favorites...',
        'Almost ready...'
      ],
      bgColor: 'bg-pink-50/90'
    },
    
    // Orders
    order: {
      icon: FiPackage,
      color: 'from-blue-500 to-purple-500',
      messages: [
        'Processing order...',
        'Confirming details...',
        'Finalizing...'
      ],
      bgColor: 'bg-blue-50/90'
    },
    loadingOrders: {
      icon: FiPackage,
      color: 'from-indigo-500 to-blue-500',
      messages: [
        'Loading your orders...',
        'Fetching order history...',
        'Almost ready...'
      ],
      bgColor: 'bg-indigo-50/90'
    },
    checkingOrders: {
      icon: FiCheckCircle,
      color: 'from-green-500 to-emerald-500',
      messages: [
        'Checking order status...',
        'Retrieving details...',
        'Almost done...'
      ],
      bgColor: 'bg-green-50/90'
    },
    
    // Products
    loadingProducts: {
      icon: FiShoppingBag,
      color: 'from-orange-500 to-red-500',
      messages: [
        'Loading products...',
        'Fetching catalog...',
        'Almost ready...'
      ],
      bgColor: 'bg-orange-50/90'
    },
    loadingProduct: {
      icon: FiBox,
      color: 'from-purple-500 to-pink-500',
      messages: [
        'Loading product details...',
        'Fetching information...',
        'Almost there...'
      ],
      bgColor: 'bg-purple-50/90'
    },
    
    // Reviews
    review: {
      icon: FiStar,
      color: 'from-yellow-500 to-orange-500',
      messages: [
        'Submitting your review...',
        'Processing feedback...',
        'Almost done...'
      ],
      bgColor: 'bg-yellow-50/90'
    },
    
    // User & Profile
    profile: {
      icon: FiUser,
      color: 'from-purple-500 to-indigo-500',
      messages: [
        'Updating profile...',
        'Saving changes...',
        'Almost ready...'
      ],
      bgColor: 'bg-purple-50/90'
    },
    
    // Payment
    payment: {
      icon: FiCreditCard,
      color: 'from-emerald-500 to-teal-500',
      messages: [
        'Processing payment...',
        'Securing transaction...',
        'Completing order...'
      ],
      bgColor: 'bg-emerald-50/90'
    },
    
    // Page Actions
    refreshing: {
      icon: FiRefreshCw,
      color: 'from-blue-500 to-cyan-500',
      messages: [
        'Refreshing page...',
        'Updating content...',
        'Almost ready...'
      ],
      bgColor: 'bg-blue-50/90'
    },
    searching: {
      icon: FiSearch,
      color: 'from-teal-500 to-green-500',
      messages: [
        'Searching...',
        'Finding results...',
        'Almost there...'
      ],
      bgColor: 'bg-teal-50/90'
    },
    filtering: {
      icon: FiFilter,
      color: 'from-indigo-500 to-purple-500',
      messages: [
        'Applying filters...',
        'Updating results...',
        'Almost done...'
      ],
      bgColor: 'bg-indigo-50/90'
    },
    
    // Admin Dashboard
    dashboard: {
      icon: FiTrendingUp,
      color: 'from-blue-600 to-indigo-600',
      messages: [
        'Loading dashboard...',
        'Fetching analytics...',
        'Almost ready...'
      ],
      bgColor: 'bg-blue-50/90'
    },
    adminProducts: {
      icon: FiLayers,
      color: 'from-orange-600 to-red-600',
      messages: [
        'Loading products...',
        'Fetching inventory...',
        'Almost there...'
      ],
      bgColor: 'bg-orange-50/90'
    },
    adminOrders: {
      icon: FiPackage,
      color: 'from-purple-600 to-pink-600',
      messages: [
        'Loading orders...',
        'Fetching transactions...',
        'Almost ready...'
      ],
      bgColor: 'bg-purple-50/90'
    },
    adminUsers: {
      icon: FiUsers,
      color: 'from-green-600 to-teal-600',
      messages: [
        'Loading users...',
        'Fetching customer data...',
        'Almost done...'
      ],
      bgColor: 'bg-green-50/90'
    },
    adminReports: {
      icon: FiFileText,
      color: 'from-cyan-600 to-blue-600',
      messages: [
        'Generating report...',
        'Analyzing data...',
        'Almost ready...'
      ],
      bgColor: 'bg-cyan-50/90'
    },
    adminSettings: {
      icon: FiSettings,
      color: 'from-gray-600 to-slate-600',
      messages: [
        'Loading settings...',
        'Fetching configuration...',
        'Almost there...'
      ],
      bgColor: 'bg-gray-50/90'
    },
    
    // Admin Actions
    creating: {
      icon: FiUpload,
      color: 'from-green-500 to-emerald-500',
      messages: [
        'Creating item...',
        'Saving data...',
        'Almost done...'
      ],
      bgColor: 'bg-green-50/90'
    },
    updating: {
      icon: FiEdit,
      color: 'from-blue-500 to-indigo-500',
      messages: [
        'Updating item...',
        'Saving changes...',
        'Almost ready...'
      ],
      bgColor: 'bg-blue-50/90'
    },
    deleting: {
      icon: FiTrash2,
      color: 'from-red-500 to-orange-500',
      messages: [
        'Deleting item...',
        'Removing data...',
        'Almost done...'
      ],
      bgColor: 'bg-red-50/90'
    },
    saving: {
      icon: FiSave,
      color: 'from-teal-500 to-cyan-500',
      messages: [
        'Saving...',
        'Updating database...',
        'Almost complete...'
      ],
      bgColor: 'bg-teal-50/90'
    },
    downloading: {
      icon: FiDownload,
      color: 'from-indigo-500 to-blue-500',
      messages: [
        'Downloading...',
        'Preparing file...',
        'Almost ready...'
      ],
      bgColor: 'bg-indigo-50/90'
    },
    uploading: {
      icon: FiUpload,
      color: 'from-purple-500 to-pink-500',
      messages: [
        'Uploading...',
        'Processing file...',
        'Almost done...'
      ],
      bgColor: 'bg-purple-50/90'
    },
    
    // Data Operations
    loading: {
      icon: FiDatabase,
      color: 'from-blue-500 to-purple-500',
      messages: [
        'Loading data...',
        'Fetching information...',
        'Almost ready...'
      ],
      bgColor: 'bg-blue-50/90'
    },
    
    // Default
    default: {
      icon: FiPackage,
      color: 'from-red-600 to-blue-700',
      messages: [
        'Loading...',
        'Please wait...',
        'Almost there...'
      ],
      bgColor: 'bg-gray-50/90'
    }
  };

  const config = contextConfig[context] || contextConfig.default;
  const Icon = config.icon;
  const displayMessage = message || config.messages[currentTextIndex];

  // Rotate through context messages
  useEffect(() => {
    if (!message && config.messages.length > 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % config.messages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [message, config.messages.length]);

  if (!isVisible) return null;

  const LoaderContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center"
    >
      {/* Icon with Smooth Slow Motion Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
        }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ 
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="relative mb-6"
      >
        {/* Subtle pulsing glow */}
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-0 -m-8 bg-gradient-to-r ${config.color} rounded-full blur-2xl`}
        />
        
        {/* Icon */}
        <motion.div
          animate={{ 
            y: [0, -8, 0]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`relative w-24 h-24 bg-gradient-to-br ${config.color} rounded-3xl flex items-center justify-center shadow-2xl`}
        >
          <Icon className="w-12 h-12 text-white" strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      {/* Loading Text - Slow Fade In */}
      <motion.p
        key={displayMessage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="text-2xl font-semibold text-white text-center tracking-tight"
      >
        {displayMessage}
      </motion.p>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
        >
          <LoaderContent />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Partial/Overlay loading
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-40 flex items-center justify-center ${
          blur ? 'backdrop-blur-sm bg-black/20' : 'bg-black/20'
        }`}
        style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      >
        <LoaderContent />
      </motion.div>
    </AnimatePresence>
  );
};

export default ContextualLoader;
