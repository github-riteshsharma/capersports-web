import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiHeart, FiShoppingCart, FiEye, FiStar } from 'react-icons/fi';

// Store actions
import { addToCart, addToLocalCart, addToCartOptimistic } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, toggleWishlist } from '../../store/slices/wishlistSlice';

const ProductCard = ({ product, className = '' }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(item => item._id === product._id);
  
  // Detect if this is list view based on className
  const isListView = className.includes('flex-row');

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    // Auto-select first available size and color if not selected
    const finalSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0].size : null);
    const finalColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0].name : null);
    
    setIsLoading(true);
    
    try {
      const cartData = {
        productId: product._id,
        quantity: 1,
        size: finalSize,
        color: finalColor,
      };

      if (isAuthenticated) {
        // Optimistic update for immediate UI feedback
        dispatch(addToCartOptimistic({
          ...cartData,
          product: product
        }));
        
        try {
          await dispatch(addToCart(cartData)).unwrap();
          toast.success('Added to cart!');
        } catch (error) {
          toast.error('Failed to add to cart');
          throw error;
        }
      } else {
        dispatch(addToLocalCart({
          ...cartData,
          product: product
        }));
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error || 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist!');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist!');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar key={i} className="text-yellow-500 fill-yellow-500" size={16} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar key="half" className="text-yellow-500 fill-yellow-500 opacity-50" size={16} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FiStar key={`empty-${i}`} className="text-gray-300" size={16} />
      );
    }

    return stars;
  };

  const discountPercentage = product.originalPrice && product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getTotalStock = () => {
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

  const getStockStatus = () => {
    const totalStock = getTotalStock();
    if (totalStock === 0) return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (totalStock <= (product.lowStockThreshold || 10)) return { text: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const getSizeStock = (sizeName) => {
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

  const totalStock = getTotalStock();
  const stockStatus = getStockStatus();

  return (
        <motion.div
          className={`group relative bg-transparent rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 ${
            isListView ? 'flex flex-col sm:flex-row max-w-4xl' : 'h-full flex flex-col'
          } ${className}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
      {/* Product Image Container */}
      <div className={`relative overflow-hidden ${
        isListView ? 'w-full sm:w-80 h-48 sm:h-80 flex-shrink-0' : 'aspect-square'
      } bg-gray-300 rounded-2xl shadow-sm`}>
        <Link to={`/products/${product._id}`} className="block relative w-full h-full">
          {/* Main Product Image */}
          <div className="relative w-full h-full">
            <img
              src={product.images?.[currentImageIndex] || product.images?.[0] || '/images/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextSibling;
                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />
            
            {/* Premium Fallback */}
            <div className="hidden w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center">
              <div className="text-gray-500 text-center">
                <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="text-sm font-medium">Product Image</div>
              </div>
            </div>
          </div>
          
          {/* Website Logo - Bottom Left Corner (moves with image) */}
          <div className="absolute bottom-3 left-3 group-hover:scale-105 transition-transform duration-500 ease-out">
            <img
              src="/images/logo.png"
              alt="Caper Sports"
              className="w-8 h-8 opacity-70 group-hover:opacity-90 transition-opacity duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          
          {/* Rating Badge - Top Right Corner on Image */}
          {(product.ratings?.average || product.rating) > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-full pl-2.5 pr-3 py-1.5 shadow-lg border border-white/50">
              <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" strokeWidth={2} />
              <span className="text-sm font-semibold text-gray-900">
                {(product.ratings?.average || product.rating).toFixed(1)}
              </span>
            </div>
          )}
          
          {/* Discount Badge - Top Left */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-lg">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Stock Status Overlay */}
          {totalStock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </Link>
        
        {/* Quick Actions */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleAddToWishlist}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-lg ${
              isInWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <FiHeart size={16} className={isInWishlist ? 'fill-current' : ''} />
          </motion.button>
        </div>
      </div>

            {/* Product Info - Apple-Style Minimalist Design */}
            <div className={`${isListView ? 'flex-1 p-5 sm:p-6 flex flex-col justify-between' : 'p-5 sm:p-6 flex-1 flex flex-col'} bg-transparent`}>
        
        {/* Product Name - Bold & Clean */}
        <Link to={`/products/${product._id}`} className="block group/link mb-2">
          <h3 className="text-[15px] sm:text-base font-medium text-gray-900 leading-tight group-hover/link:text-gray-600 transition-colors duration-200 line-clamp-2 tracking-tight">
            {product.name}
          </h3>
        </Link>
        
        {/* Category - Subtle Text */}
        {product.category && (
          <p className="text-xs text-gray-500 mb-4 tracking-wide">
            {product.category}
          </p>
        )}
        
        {/* Price Section - Apple Typography */}
        <div className="mt-auto space-y-1">
          {/* Current Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
              ₹{(product.salePrice || product.price)?.toLocaleString()}
            </span>
            
            {/* Original Price & Discount Badge */}
            {product.salePrice && product.price > product.salePrice && (
              <>
                <span className="text-sm text-gray-400 line-through font-normal">
                  ₹{product.price?.toLocaleString()}
                </span>
              </>
            )}
          </div>
          
          {/* Discount Percentage - Eye-catching */}
          {product.salePrice && product.price > product.salePrice && (
            <p className="text-xs text-red-600 font-medium">
              {Math.round(((product.price - product.salePrice) / product.price) * 100)}% off
            </p>
          )}
          
          {/* Original Price Savings */}
          {product.originalPrice && product.originalPrice > product.price && !product.salePrice && (
            <p className="text-xs text-red-600 font-medium">
              Save ₹{(product.originalPrice - product.price).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Hover Actions */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
                   className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-b-2xl shadow-lg"
          >
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => {
                    const sizeName = typeof size === 'string' ? size : (size.size || size.name || size);
                    const stockValue = getSizeStock(sizeName);
                    
                    if (typeof sizeName === 'string' && sizeName.length === 24 && /^[0-9a-f]{24}$/i.test(sizeName)) {
                      return null;
                    }
                    
                    if (typeof sizeName === 'object') {
                      return null;
                    }
                    
                    return (
                             <button
                               key={sizeName || index}
                               onClick={() => setSelectedSize(sizeName)}
                               disabled={stockValue === 0}
                               className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md border transition-all duration-200 ${
                                 selectedSize === sizeName
                                   ? 'bg-gray-900 text-white border-gray-900'
                                   : stockValue === 0
                                   ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                   : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                               }`}
                             >
                        {sizeName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: totalStock > 0 ? 1.02 : 1 }}
              whileTap={{ scale: totalStock > 0 ? 0.98 : 1 }}
              onClick={handleAddToCart}
              disabled={isLoading || totalStock === 0}
                     className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                       totalStock === 0
                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                         : 'bg-gray-900 hover:bg-gray-800 text-white'
                     }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : totalStock === 0 ? (
                <span>Out of Stock</span>
              ) : (
                <>
                  <FiShoppingCart size={18} />
                  <span>Add to Cart</span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
