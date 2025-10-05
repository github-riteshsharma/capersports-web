import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiPackage, FiUser, FiCreditCard } from 'react-icons/fi';

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
    review: {
      icon: FiStar,
      color: 'from-yellow-500 to-orange-500',
      messages: [
        'Submitting your review...',
        'Processing your feedback...',
        'Almost done...'
      ],
      bgColor: 'bg-yellow-50/90'
    },
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
    wishlist: {
      icon: FiHeart,
      color: 'from-pink-500 to-red-500',
      messages: [
        'Adding to wishlist...',
        'Saving item...',
        'Almost done...'
      ],
      bgColor: 'bg-pink-50/90'
    },
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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex flex-col items-center justify-center p-8 rounded-2xl ${config.bgColor} backdrop-blur-md border border-white/20 shadow-2xl max-w-sm mx-auto`}
    >
      {/* Logo */}
      <div className="mb-6">
        <img
          src="/images/logo.png"
          alt="Caper Sports"
          className="w-16 h-16 object-contain drop-shadow-lg"
          onError={(e) => {
            e.target.style.display = 'none';
            const fallback = e.target.nextSibling;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        {/* Fallback Logo */}
        <div className="hidden w-16 h-16 bg-gradient-to-br from-red-600 to-blue-600 rounded-2xl items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">CS</span>
        </div>
      </div>

      {/* Context Icon with Animation */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-full flex items-center justify-center mb-6 shadow-lg`}
      >
        <Icon className="w-6 h-6 text-white" />
      </motion.div>

      {/* Loading Dots */}
      <div className="flex space-x-2 mb-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            className={`w-3 h-3 bg-gradient-to-r ${config.color} rounded-full shadow-lg`}
          />
        ))}
      </div>

      {/* Loading Text */}
      <motion.p
        key={displayMessage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="text-lg font-semibold text-gray-800 text-center mb-4"
      >
        {displayMessage}
      </motion.p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
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
