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
        <FiStar key={i} className="text-yellow-400 fill-current" size={14} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar key="half" className="text-yellow-400 fill-current opacity-50" size={14} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FiStar key={`empty-${i}`} className="text-gray-300" size={14} />
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
      className={`group relative bg-white dark:bg-gray-900 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
        <Link to={`/products/${product._id}`} className="block relative w-full h-full">
          {/* Main Product Image */}
          <div className="relative w-full h-full">
            <img
              src={product.images?.[currentImageIndex] || product.images?.[0] || '/images/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src = '/images/placeholder-product.jpg';
              }}
            />
            
            {/* Image Navigation Dots */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Stock Status */}
          {totalStock === 0 ? (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-medium text-lg">Out of Stock</span>
            </div>
          ) : totalStock <= (product.lowStockThreshold || 10) && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                Only {totalStock} left!
              </span>
            </div>
          )}
        </Link>
        
        {/* Quick Actions - Nike Style */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2 }}
            onClick={handleAddToWishlist}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
              isInWishlist 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500 shadow-md'
            }`}
          >
            <FiHeart size={16} className={isInWishlist ? 'fill-current' : ''} />
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="p-2 bg-white/90 text-gray-700 rounded-full backdrop-blur-md hover:bg-gray-50 transition-all duration-200 shadow-md"
          >
            <FiEye size={16} />
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-4 pb-2">
        {/* Product Category */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-medium">
          {product.category}
        </p>
        
        {/* Product Name */}
        <Link to={`/products/${product._id}`} className="block group/link">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover/link:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        
        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex space-x-1">
              {product.colors.slice(0, 4).map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    selectedColor === color.name
                      ? 'border-gray-900 dark:border-white scale-110'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ₹{product.price?.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-base text-gray-500 dark:text-gray-400 line-through">
              ₹{product.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>
        
        {/* Product Rating */}
        {product.rating && (
          <div className="flex items-center space-x-1 mb-4">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({product.numReviews || 0})
            </span>
          </div>
        )}
      </div>

      {/* Hover Actions */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4"
          >
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => {
                    // Handle both string sizes and object sizes {size, stock, _id}
                    const sizeName = typeof size === 'string' ? size : (size.size || size.name || size);
                    const stockValue = getSizeStock(sizeName);
                    
                    // Skip invalid or corrupted ObjectId data
                    if (typeof sizeName === 'string' && sizeName.length === 24 && /^[0-9a-f]{24}$/i.test(sizeName)) {
                      return null;
                    }
                    
                    // Skip if sizeName is still an object (shouldn't happen but safety check)
                    if (typeof sizeName === 'object') {
                      return null;
                    }
                    
                    return (
                      <div key={sizeName || index} className="relative">
                        <button
                          onClick={() => setSelectedSize(sizeName)}
                          disabled={stockValue === 0}
                          className={`px-3 py-1 text-sm rounded-md border transition-all duration-200 relative ${
                            selectedSize === sizeName
                              ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                              : stockValue === 0
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-white'
                          }`}
                          title={stockValue === 0 ? 'Out of stock' : `${stockValue} in stock`}
                        >
                          {sizeName}
                          {stockValue === 0 && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs text-red-500 font-medium">✕</span>
                            </span>
                          )}
                        </button>
                        {stockValue > 0 && stockValue <= 5 && (
                          <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {stockValue}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Stock Information */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  stockStatus.bgColor
                } ${stockStatus.color}`}>
                  {stockStatus.text}
                </span>
                {totalStock > 0 && totalStock <= (product.lowStockThreshold || 10) && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Only {totalStock} left
                  </span>
                )}
              </div>
              {totalStock > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {totalStock} in stock
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: totalStock > 0 ? 1.02 : 1 }}
              whileTap={{ scale: totalStock > 0 ? 0.98 : 1 }}
              onClick={handleAddToCart}
              disabled={isLoading || totalStock === 0 || (selectedSize && getSizeStock(selectedSize) === 0)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                totalStock === 0 || (selectedSize && getSizeStock(selectedSize) === 0)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin dark:border-gray-900 dark:border-t-transparent" />
              ) : totalStock === 0 ? (
                <>
                  <span>Out of Stock</span>
                </>
              ) : selectedSize && getSizeStock(selectedSize) === 0 ? (
                <>
                  <span>Size Out of Stock</span>
                </>
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
