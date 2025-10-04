import React from 'react';
import { motion } from 'framer-motion';

const CaperSportsLoader = ({ size = 'md', showText = false, className = '' }) => {
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
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Logo with Zoom Animation */}
      <motion.div 
        className="flex items-center justify-center mb-6"
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
          className={`${logoSizes[size]} object-contain`}
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
      <div className="flex space-x-2 mb-4">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${dotSizes[size]} bg-gradient-to-r from-red-500 to-blue-600 rounded-full`}
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
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p 
            className={`${textSizes[size]} font-semibold text-gray-800 tracking-wide`}
            style={{ 
              fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: '0.05em'
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading...
          </motion.p>
        </motion.div>
      )}
    </div>
  );
};

export default CaperSportsLoader;