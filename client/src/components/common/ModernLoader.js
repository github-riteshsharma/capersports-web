import React from 'react';
import { motion } from 'framer-motion';

const ModernLoader = ({ size = 'medium', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerSizeClasses = {
    small: 'gap-1',
    medium: 'gap-2',
    large: 'gap-3',
    xl: 'gap-4'
  };

  const dotSize = {
    small: 'w-1 h-1',
    medium: 'w-2 h-2',
    large: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Animated Dots Loader */}
      <div className={`flex items-center space-x-2 ${containerSizeClasses[size]}`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${dotSize[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      {text && (
        <motion.p
          className="text-gray-600 font-medium text-sm"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Spinner Loader Alternative
export const SpinnerLoader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-blue-200 border-t-blue-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

// Pulse Loader for Cards
export const CardLoader = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

// Full Page Loader
export const FullPageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
      >
        <ModernLoader size="large" text={text} />
      </motion.div>
    </div>
  );
};

export default ModernLoader;
