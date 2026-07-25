import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  text = '',
  fullScreen = false,
  variant = 'sports' // New variant prop for different loading animations
}) => {
  const sizes = {
    sm: { container: 'w-12 h-12', element: 'w-3 h-3' },
    md: { container: 'w-16 h-16', element: 'w-4 h-4' },
    lg: { container: 'w-24 h-24', element: 'w-6 h-6' },
    xl: { container: 'w-32 h-32', element: 'w-8 h-8' },
  };

  const colors = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    white: 'bg-white',
    gray: 'bg-gray-600',
  };

  // Sports-themed loading animation
  const SportsLoader = () => {
    const ballVariants = {
      bounce: {
        y: [0, -20, 0],
        transition: {
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    };

    const equipmentVariants = {
      rotate: {
        rotate: [0, 360],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }
      }
    };

    const runnerVariants = {
      run: {
        x: [-10, 10, -10],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    };

    return (
      <div className={`relative ${sizes[size].container}`}>
        {/* Central bouncing basketball */}
        <motion.div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizes[size].element} bg-orange-500 rounded-full`}
          variants={ballVariants}
          animate="bounce"
          style={{
            background: 'linear-gradient(45deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          {/* Basketball lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-black/20 absolute top-1/2 transform -translate-y-1/2"></div>
            <div className="w-0.5 h-full bg-black/20 absolute left-1/2 transform -translate-x-1/2"></div>
          </div>
        </motion.div>

        {/* Rotating equipment icons around the ball */}
        <motion.div
          className="absolute inset-0"
          variants={equipmentVariants}
          animate="rotate"
        >
          {/* Dumbbell */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full">
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-3 bg-gray-700 rounded"></div>
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-3 bg-gray-700 rounded"></div>
          </div>
          
          {/* Running shoe */}
          <div className="absolute bottom-0 right-0 w-3 h-2 bg-blue-600 rounded-full transform rotate-45">
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded"></div>
          </div>
          
          {/* Whistle */}
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rounded-full">
            <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-1 h-0.5 bg-gray-800"></div>
          </div>
          
          {/* Trophy */}
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-500 rounded-t-full">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-600"></div>
          </div>
        </motion.div>

        {/* Animated running figure */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center"
          variants={runnerVariants}
          animate="run"
        >
          <div className="text-2xl">🏃‍♂️</div>
        </motion.div>
      </div>
    );
  };

  // Athletic gear loading animation
  const AthleticGearLoader = () => {
    const gearItems = ['🏀', '⚽', '🏈', '🎾', '🏐', '⚾'];
    
    return (
      <div className={`relative ${sizes[size].container}`}>
        {gearItems.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: '0 0'
            }}
            animate={{
              rotate: [0, 360],
              x: Math.cos((index * 60) * Math.PI / 180) * 20,
              y: Math.sin((index * 60) * Math.PI / 180) * 20
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.1
            }}
          >
            {item}
          </motion.div>
        ))}
      </div>
    );
  };

  // Simple spinner fallback
  const SimpleSpinner = () => (
    <motion.div
      className={`${sizes[size].container.replace('w-', 'w-').replace('h-', 'h-')} border-2 ${colors[color].replace('bg-', 'border-')} border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );

  const renderLoader = () => {
    switch (variant) {
      case 'sports':
        return <SportsLoader />;
      case 'athletic-gear':
        return <AthleticGearLoader />;
      default:
        return <SimpleSpinner />;
    }
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : ''} ${className}`}>
      {renderLoader()}
      {text && (
        <motion.p
          className="mt-6 text-sm text-gray-600 dark:text-gray-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.p>
      )}
      <motion.div
        className="mt-2 text-xs text-primary-600 dark:text-primary-400 font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Caper Sports
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
