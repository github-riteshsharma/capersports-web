import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CaperSportsLoader = ({ size = 'md', showText = false, className = '' }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  // Premium loading messages
  const premiumMessages = [
    "Curating premium sports gear...",
    "Crafting your perfect experience...",
    "Loading exceptional quality...",
    "Preparing athletic excellence...",
    "Discovering performance perfection...",
    "Unveiling sports innovation...",
    "Building your sports journey...",
    "Elevating your game...",
    "Perfecting every detail...",
    "Loading championship quality..."
  ];

  // Rotate through messages
  useEffect(() => {
    if (!showText) return;
    
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % premiumMessages.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [showText, premiumMessages.length]);

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
      {/* Logo with Zoom Animation */}
      <motion.div 
        className="flex items-center justify-center mb-8"
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <img
          src="/images/logo.png"
          alt="Caper Sports"
          className={`${logoSizes[size]} object-contain drop-shadow-lg`}
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
      </motion.div>

      {/* Loading Dots */}
      <div className="flex space-x-3 mb-8">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${dotSizes[size]} bg-gradient-to-r from-red-500 via-orange-500 to-blue-600 rounded-full shadow-lg`}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
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

      {/* Premium Loading Text */}
      {showText && (
        <motion.div 
          className="text-center max-w-md px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p 
            key={currentTextIndex}
            className={`${textSizes[size]} font-semibold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-wide`}
            style={{ 
              fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: '0.05em'
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {premiumMessages[currentTextIndex]}
          </motion.p>
          
          {/* Elegant loading indicator */}
          <motion.div 
            className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"
            animate={{ 
              scaleX: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default CaperSportsLoader;