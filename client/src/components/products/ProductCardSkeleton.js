import React from 'react';
import { motion } from 'framer-motion';

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg relative">
      {/* Image Skeleton with shimmer effect */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          style={{
            animation: 'shimmer 2s infinite',
            transform: 'translateX(-100%)'
          }}
        />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Category Badge Skeleton */}
        <div className="h-6 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full overflow-hidden relative">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{
              animation: 'shimmer 2s infinite',
              transform: 'translateX(-100%)'
            }}
          />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 overflow-hidden relative">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              style={{
                animation: 'shimmer 2s infinite 0.2s',
                transform: 'translateX(-100%)'
              }}
            />
          </div>
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2 overflow-hidden relative">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              style={{
                animation: 'shimmer 2s infinite 0.3s',
                transform: 'translateX(-100%)'
              }}
            />
          </div>
        </div>

        {/* Price and Rating Skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-2 flex-1">
            <div className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded overflow-hidden relative">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                style={{
                  animation: 'shimmer 2s infinite 0.4s',
                  transform: 'translateX(-100%)'
                }}
              />
            </div>
            <div className="h-4 w-20 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded overflow-hidden relative">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                style={{
                  animation: 'shimmer 2s infinite 0.5s',
                  transform: 'translateX(-100%)'
                }}
              />
            </div>
          </div>
          <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full overflow-hidden relative">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              style={{
                animation: 'shimmer 2s infinite 0.6s',
                transform: 'translateX(-100%)'
              }}
            />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full overflow-hidden relative">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{
              animation: 'shimmer 2s infinite 0.7s',
              transform: 'translateX(-100%)'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

// Grid of loading skeletons - Apple-Style Centered
export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-6 xl:gap-8 justify-items-center">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="w-full max-w-sm"
        >
          <ProductCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductCardSkeleton;

