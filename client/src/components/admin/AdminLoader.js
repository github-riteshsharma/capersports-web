import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AdminLoader = ({ size = 'lg', showText = true, className = '', context = 'general' }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  // Admin-specific premium loading messages
  const adminMessages = {
    general: [
      "Loading admin dashboard...",
      "Preparing management tools...",
      "Initializing control panel...",
      "Loading business insights...",
      "Setting up admin interface...",
      "Preparing analytics data...",
      "Loading management suite...",
      "Initializing admin tools..."
    ],
    products: [
      "Loading product catalog...",
      "Fetching inventory data...",
      "Preparing product management...",
      "Loading merchandise database...",
      "Initializing product suite...",
      "Gathering product insights...",
      "Loading catalog management...",
      "Preparing inventory tools..."
    ],
    orders: [
      "Loading order management...",
      "Fetching order history...",
      "Preparing order tracking...",
      "Loading transaction data...",
      "Initializing order system...",
      "Gathering sales insights...",
      "Loading order analytics...",
      "Preparing fulfillment tools..."
    ],
    users: [
      "Loading user management...",
      "Fetching customer data...",
      "Preparing user analytics...",
      "Loading member database...",
      "Initializing user system...",
      "Gathering user insights...",
      "Loading customer suite...",
      "Preparing user tools..."
    ],
    dashboard: [
      "Loading business dashboard...",
      "Preparing performance metrics...",
      "Fetching analytics data...",
      "Loading KPI dashboard...",
      "Initializing business insights...",
      "Gathering performance data...",
      "Loading executive summary...",
      "Preparing business intelligence..."
    ]
  };

  const messages = adminMessages[context] || adminMessages.general;

  // Rotate through messages
  useEffect(() => {
    if (!showText) return;
    
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % messages.length);
    }, 2000); // Faster rotation for admin
    
    return () => clearInterval(interval);
  }, [showText, messages.length]);

  const logoSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] w-full ${className}`}>
      {/* Logo with Admin-style Animation */}
      <motion.div 
        className="flex items-center justify-center mb-8"
        animate={{ 
          scale: [1, 1.05, 1],
          rotateY: [0, 5, 0, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="relative">
          <img
            src="/images/logo.png"
            alt="Caper Sports Admin"
            className={`${logoSizes[size]} object-contain drop-shadow-xl filter brightness-110`}
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = e.target.nextSibling;
              if (fallback) {
                fallback.style.display = 'flex';
              }
            }}
          />
          {/* Fallback Logo Text */}
          <div className="hidden flex-col items-center justify-center text-center">
            <div className={`font-black ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'} text-red-600 leading-none mb-1`}>
              CAPER
            </div>
            <div className={`font-bold ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : size === 'lg' ? 'text-lg' : 'text-xl'} text-blue-600 leading-none`}>
              SPORTS
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Loading Dots */}
      <div className="flex space-x-3 mb-8">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className={`${dotSizes[size]} bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full shadow-lg`}
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.4, 1, 0.4],
              y: [0, -8, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: index * 0.15,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Premium Admin Loading Text */}
      {showText && (
        <motion.div 
          className="text-center max-w-md px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.p 
            key={currentTextIndex}
            className={`${textSizes[size]} font-semibold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent tracking-wide`}
            style={{ 
              fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: '0.05em'
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {messages[currentTextIndex]}
          </motion.p>
          
          {/* Admin-style progress indicator */}
          <motion.div 
            className="mt-4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full shadow-sm"
            animate={{ 
              scaleX: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Admin loading dots */}
          <div className="flex justify-center space-x-1 mt-3">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-1 h-1 bg-blue-500 rounded-full"
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ 
                  duration: 1.2, 
                  repeat: Infinity, 
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminLoader;
