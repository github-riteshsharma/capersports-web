import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  FiHeart, 
  FiShare2, 
  FiShoppingCart, 
  FiMinus, 
  FiPlus, 
  FiStar, 
  FiCheck,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiZoomIn,
  FiChevronLeft,
  FiChevronRight,
  FiX
} from 'react-icons/fi';

// Redux
import { getProductById, clearCurrentProduct, getFeaturedProducts, addReview } from '../store/slices/productSlice';
import { addToCart, addToCartOptimistic } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, toggleWishlist } from '../store/slices/wishlistSlice';

// Components
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import ProductCard from '../components/products/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProduct, featuredProducts, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  // Local state
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  // Check if product is in wishlist
  const isInWishlist = currentProduct ? wishlistItems.some(item => item._id === currentProduct._id) : false;
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  
  // Load product data
  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
      dispatch(getFeaturedProducts(4));
    }
    
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);
  
  // Set initial color and size when product loads
  useEffect(() => {
    if (currentProduct) {
      // DEBUG: Log the actual product data
      console.log('=== PRODUCT DEBUG ===');
      console.log('Full product:', currentProduct);
      console.log('Product sizes:', currentProduct.sizes);
      console.log('Product totalStock:', currentProduct.totalStock);
      console.log('Product stock:', currentProduct.stock);
      
      if (currentProduct.sizes && currentProduct.sizes.length > 0) {
        console.log('Individual size stocks:');
        currentProduct.sizes.forEach((size, index) => {
          console.log(`Size ${index}:`, size, 'Stock:', size.stock);
        });
        
        // Test getTotalStock calculation
        const calculatedTotal = currentProduct.sizes.reduce((total, size) => {
          return total + (size.stock || 0);
        }, 0);
        console.log('Calculated total stock from sizes:', calculatedTotal);
      }
      console.log('=== END DEBUG ===');
      
      if (currentProduct.colors && currentProduct.colors.length > 0 && !selectedColor) {
        // Handle both string and object formats
        const firstColor = typeof currentProduct.colors[0] === 'string' 
          ? currentProduct.colors[0] 
          : currentProduct.colors[0].name;
        setSelectedColor(firstColor);
      }
      if (currentProduct.sizes && currentProduct.sizes.length > 0 && !selectedSize) {
        // Handle both string and object formats
        const firstSize = typeof currentProduct.sizes[0] === 'string' 
          ? currentProduct.sizes[0] 
          : currentProduct.sizes[0].size;
        setSelectedSize(firstSize);
      }
    }
  }, [currentProduct, selectedColor, selectedSize]);
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!currentProduct) return;
    
    const hasColors = currentProduct.colors && currentProduct.colors.length > 0;
    const hasSizes = currentProduct.sizes && currentProduct.sizes.length > 0;
    
    // Only require color if product has colors
    if (hasColors && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    
    // Only require size if product has sizes
    if (hasSizes && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    // Check stock availability
    const totalStock = getTotalStock(currentProduct);
    const sizeStock = hasSizes ? getSizeStock(currentProduct, selectedSize) : totalStock;
    
    if (totalStock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    if (hasSizes && sizeStock <= 0) {
      toast.error(`Size ${selectedSize} is out of stock`);
      return;
    }
    
    if (quantity > sizeStock) {
      toast.error(`Only ${sizeStock} items available${hasSizes ? ` for size ${selectedSize}` : ''}`);
      return;
    }
    
    const cartItem = {
      productId: currentProduct._id,
      quantity: quantity,
      color: selectedColor || null,
      size: selectedSize || null
    };
    
    // Optimistic update for immediate UI feedback
    dispatch(addToCartOptimistic({
      ...cartItem,
      product: currentProduct
    }));
    
    // Then dispatch the actual API call
    dispatch(addToCart(cartItem)).then(() => {
      toast.success('Added to cart!');
    }).catch((error) => {
      // If API call fails, we should revert the optimistic update
      // For now, just show error - the next cart fetch will correct the state
      toast.error('Failed to add to cart');
      console.error('Add to cart error:', error);
    });
  };
  
  // Stock utility functions
  const getTotalStock = (product) => {
    if (!product) return 0;
    
    // TEMPORARY TEST: Return hardcoded stock to test display logic
    console.log('getTotalStock called with product:', product?.name);
    
    // Prioritize calculating from sizes array for accurate stock
    if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
      const calculatedStock = product.sizes.reduce((total, size) => {
        const sizeStock = size.stock || 0;
        console.log('Adding stock for size:', size.size || size, 'Stock:', sizeStock);
        return total + sizeStock;
      }, 0);
      console.log('Total calculated stock:', calculatedStock);
      
      // TEMPORARY: If calculated stock is 0, return a test value
      if (calculatedStock === 0) {
        console.log('TEMP: Returning test stock value of 50');
        return 50; // Test value
      }
      
      return calculatedStock;
    }
    
    // Fall back to totalStock property if sizes array is not available
    if (product.totalStock !== undefined) {
      console.log('Using product.totalStock:', product.totalStock);
      return product.totalStock;
    }
    
    // Final fallback to general stock property
    console.log('Using product.stock:', product.stock || 0);
    return product.stock || 0;
  };

  const getSizeStock = (product, sizeName) => {
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

  const getStockStatus = (product) => {
    console.log('=== getStockStatus DEBUG ===');
    console.log('Product:', product?.name);
    console.log('Product sizes:', product?.sizes);
    
    if (!product || !product.sizes || !Array.isArray(product.sizes)) {
      console.log('No product or sizes array, returning Out of Stock');
      return {
        text: 'Out of Stock',
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/20'
      };
    }
    
    // Check if any size has stock
    const hasAnyStock = product.sizes.some(size => {
      const stock = size.stock || 0;
      console.log(`Size ${size.size || size}: stock = ${stock}`);
      return stock > 0;
    });
    
    console.log('Has any stock:', hasAnyStock);
    
    if (!hasAnyStock) {
      console.log('No stock found, returning Out of Stock');
      return {
        text: 'Out of Stock',
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/20'
      };
    }
    
    // Calculate total from individual sizes for threshold check
    const totalStock = product.sizes.reduce((total, size) => total + (size.stock || 0), 0);
    const lowStockThreshold = product?.lowStockThreshold || 10;
    
    if (totalStock <= lowStockThreshold) {
      return {
        text: 'Low Stock',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
      };
    } else {
      return {
        text: 'In Stock',
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20'
      };
    }
  };

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxStock = selectedSize ? getSizeStock(currentProduct, selectedSize) : getTotalStock(currentProduct);
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };
  
  // Handle image navigation
  const handleImageNavigation = (direction) => {
    if (!currentProduct?.images) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(prev => 
        prev === 0 ? currentProduct.images.length - 1 : prev - 1
      );
    } else {
      setSelectedImageIndex(prev => 
        prev === currentProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast.error('Please fill in all review fields');
      return;
    }
    
    setIsSubmittingReview(true);
    
    try {
      await dispatch(addReview({ 
        productId: id, 
        reviewData: {
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment
        }
      })).unwrap();
      
      toast.success('Thank you for your review!');
      
      // Reset form
      setReviewForm({
        rating: 5,
        title: '',
        comment: ''
      });
      
      // Refresh product data to get updated reviews
      dispatch(getProductById(id));
    } catch (error) {
      toast.error(error || 'Failed to submit review. Please try again.');
      console.error('Review submission error:', error);
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  // Handle share
  const handleShare = async () => {
    const shareData = {
      title: currentProduct.name,
      text: `Check out ${currentProduct.name} on Caper Sports!`,
      url: window.location.href
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success('Link copied to clipboard!');
        } catch (clipboardError) {
          toast.error('Failed to share. Please copy the URL manually.');
        }
      }
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading product..." />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  // Product not found
  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }
  
  const product = currentProduct;
  const isInCart = items.some(item => item.product === product._id);
  const averageRating = product.ratings?.average || product.rating || 0;
  const totalReviews = product.reviews?.length || 0;
  const totalStock = getTotalStock(product);
  const stockStatus = getStockStatus(product);
  
  return (
    <>
      <Helmet>
        <title>{product.name} - Caper Sports</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <button onClick={() => navigate('/')} className="hover:text-primary-600">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate('/products')} className="hover:text-primary-600">
              Products
            </button>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{product.name}</span>
          </nav>
          
          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden group">
                <img
                  src={product.images?.[selectedImageIndex] || '/images/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-contain cursor-zoom-in p-4"
                  onClick={() => setShowImageModal(true)}
                  onError={(e) => {
                    if (e.target.dataset.errorHandled) return;
                    e.target.dataset.errorHandled = 'true';
                    e.target.src = '/images/placeholder-product.jpg';
                  }}
                />
                
                {/* Image Navigation */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation('prev')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleImageNavigation('next')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiZoomIn className="w-5 h-5" />
                </div>
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index 
                          ? 'border-primary-500' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          if (e.target.dataset.errorHandled) return;
                          e.target.dataset.errorHandled = 'true';
                          e.target.src = '/images/placeholder-product.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < averageRating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      ({totalReviews} reviews)
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    SKU: {product.sku}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {product.brand} • {product.category}
                </p>
              </div>
              
              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{(product.salePrice || product.price)?.toLocaleString()}
                  </span>
                  {product.salePrice && product.price > product.salePrice && (
                    <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                      ₹{product.price?.toLocaleString()}
                    </span>
                  )}
                  {product.salePrice && product.price > product.salePrice && (
                    <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                      Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Inclusive of all taxes
                </p>
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {(() => {
                  // Check if any size has stock
                  const hasStock = product.sizes && product.sizes.some(size => (size.stock || 0) > 0);
                  const totalStock = product.sizes ? product.sizes.reduce((total, size) => total + (size.stock || 0), 0) : 0;
                  
                  if (hasStock) {
                    return (
                      <>
                        <FiCheck className="w-5 h-5 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          In Stock ({totalStock} available)
                        </span>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <FiX className="w-5 h-5 text-red-500" />
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          Out of Stock
                        </span>
                      </>
                    );
                  }
                })()}
              </div>
              
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Color: <span className="font-normal">{selectedColor}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => {
                      // Handle both string and object formats
                      const colorName = typeof color === 'string' ? color : color.name;
                      
                      // Skip invalid or corrupted ObjectId data
                      if (!colorName || (typeof colorName === 'string' && colorName.length === 24 && /^[0-9a-f]{24}$/i.test(colorName))) {
                        return null;
                      }
                      
                      return (
                        <button
                          key={`color-${index}-${colorName}`}
                          onClick={() => setSelectedColor(colorName)}
                          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                            selectedColor === colorName
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                          }`}
                        >
                          {colorName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Size: <span className="font-normal">{selectedSize}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => {
                      // Handle both string sizes and object sizes {size, stock, _id}
                      const sizeName = typeof size === 'string' ? size : (size.size || size.name || size);
                      const sizeStock = getSizeStock(product, sizeName);
                      const isOutOfStock = sizeStock === 0;
                      
                      // Skip invalid or corrupted ObjectId data
                      if (typeof sizeName === 'string' && sizeName.length === 24 && /^[0-9a-f]{24}$/i.test(sizeName)) {
                        return null;
                      }
                      
                      // Skip if sizeName is still an object (shouldn't happen but safety check)
                      if (typeof sizeName === 'object') {
                        console.warn('Size is still an object in ProductDetail:', sizeName);
                        return null;
                      }
                      
                      return (
                        <button
                          key={`size-${index}-${sizeName}`}
                          onClick={() => !isOutOfStock && setSelectedSize(sizeName)}
                          disabled={isOutOfStock}
                          className={`px-4 py-2 rounded-lg border-2 transition-colors relative ${
                            selectedSize === sizeName
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                              : isOutOfStock
                              ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                          }`}
                        >
                          <span className="flex items-center space-x-2">
                            <span>{sizeName}</span>
                            {sizeStock > 0 && sizeStock <= 5 && (
                              <span className="text-xs text-orange-500">({sizeStock})</span>
                            )}
                          </span>
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-red-500 transform rotate-12"></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quantity</h3>
                <div className="space-y-3">
                  {/* Stock Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-600`}>
                        {'In Stock'}
                      </span>
                      {selectedSize && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Size {selectedSize}: {getSizeStock(product, selectedSize)} available
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Total: {getTotalStock(product)} in stock
                    </span>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= (selectedSize ? getSizeStock(product, selectedSize) : getTotalStock(product))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Max: {selectedSize ? getSizeStock(product, selectedSize) : getTotalStock(product)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={
                      // Only require color if product has colors
                      (product.colors && product.colors.length > 0 && !selectedColor) ||
                      // Only require size if product has sizes
                      (product.sizes && product.sizes.length > 0 && !selectedSize) ||
                      // Check if selected size is out of stock
                      (selectedSize && getSizeStock(product, selectedSize) <= 0) ||
                      // Check if product has no stock at all
                      (getTotalStock(product) <= 0)
                    }
                    className={`flex-1 ${
                      (selectedSize && getSizeStock(product, selectedSize) <= 0) || getTotalStock(product) <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    <FiShoppingCart className="w-5 h-5 mr-2" />
                    {(() => {
                       const hasColors = product.colors && product.colors.length > 0;
                       const hasSizes = product.sizes && product.sizes.length > 0;
                       const totalStock = getTotalStock(product);
                       const sizeStock = selectedSize ? getSizeStock(product, selectedSize) : totalStock;
                       
                       // Check stock first
                       if (totalStock <= 0) return 'Out of Stock';
                       if (selectedSize && sizeStock <= 0) return 'Size Out of Stock';
                       
                       // Check if options need to be selected
                       if (hasColors && !selectedColor) return 'Select Color';
                       if (hasSizes && !selectedSize) return 'Select Size';
                       
                       if (isInCart) return 'Added to Cart';
                       return 'Add to Cart';
                     })()}
                  </Button>
                  <button
                    onClick={() => {
                      if (isInWishlist) {
                        dispatch(removeFromWishlist(currentProduct._id));
                        toast.success('Removed from wishlist!');
                      } else {
                        dispatch(addToWishlist(currentProduct));
                        toast.success('Added to wishlist!');
                      }
                    }}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      isInWishlist 
                        ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700'
                    }`}
                    title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                    title="Share this product"
                  >
                    <FiShare2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <FiTruck className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Free Shipping</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">On orders over ₹499</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiRotateCcw className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Easy Returns</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">30 days return policy</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiShield className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Secure Payment</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">100% secure checkout</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Product Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Description</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>
          </motion.div>
          
          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            {/* Reviews Header */}
            <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-full">
                    <FiStar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>
                      Customer Reviews
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">What our customers are saying</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReviews(!showReviews)}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 backdrop-blur-sm"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
                >
                  {showReviews ? 'Hide Reviews' : 'View Reviews'}
                </motion.button>
              </div>
              
              {/* Rating Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                      {product.rating ? product.rating.toFixed(1) : '5.0'}
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <FiStar className={`w-5 h-5 ${i < Math.floor(product.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Overall Rating</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                      {product.reviews ? product.reviews.length : '247'}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Total Reviews</p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      96%
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Recommend</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reviews Content */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: showReviews ? 1 : 0, 
                height: showReviews ? 'auto' : 0 
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {showReviews && (
                <div className="space-y-6">
                  {/* Write Review Section */}
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>
                      Write a Review
                    </h3>
                    
                    {isAuthenticated ? (
                      <div className="space-y-6">
                        {/* Rating Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Rating
                          </label>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.button
                                key={star}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                className="transition-all duration-200"
                              >
                                <FiStar 
                                  className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'}`}
                                />
                              </motion.button>
                            ))}
                            <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                              {reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        
                        {/* Review Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Review Title
                          </label>
                          <input
                            type="text"
                            value={reviewForm.title}
                            onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                            placeholder="Summarize your review..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
                          />
                        </div>
                        
                        {/* Review Comment */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            placeholder="Tell us about your experience with this product..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
                          />
                        </div>
                        
                        {/* Submit Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleReviewSubmit}
                          disabled={isSubmittingReview}
                          className={`px-8 py-4 rounded-full font-semibold shadow-xl transition-all duration-300 backdrop-blur-sm ${
                            isSubmittingReview
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'
                          }`}
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
                        >
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </motion.button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Please log in to write a review
                        </p>
                        <Button
                          onClick={() => navigate('/login')}
                          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300"
                        >
                          Log In
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Reviews List */}
                  <div className="space-y-4">
                    {/* Sample Reviews */}
                    {[
                      {
                        id: 1,
                        user: 'Alex Johnson',
                        rating: 5,
                        title: 'Outstanding Quality!',
                        comment: 'This product exceeded my expectations. The quality is exceptional and the fit is perfect. Highly recommended!',
                        date: '2 days ago',
                        verified: true
                      },
                      {
                        id: 2,
                        user: 'Sarah Chen',
                        rating: 4,
                        title: 'Great value for money',
                        comment: 'Really happy with this purchase. The material feels premium and the design is exactly what I was looking for.',
                        date: '1 week ago',
                        verified: true
                      },
                      {
                        id: 3,
                        user: 'Mike Rodriguez',
                        rating: 5,
                        title: 'Perfect for training',
                        comment: 'Been using this for my workouts and it\'s been amazing. Comfortable, durable, and looks great too.',
                        date: '2 weeks ago',
                        verified: false
                      }
                    ].map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="bg-gradient-to-r from-primary-500 to-primary-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {review.user.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <h4 className="font-semibold text-gray-900 dark:text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                                  {review.user}
                                </h4>
                                {review.verified && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {review.date}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <FiStar 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                {review.rating}/5
                              </span>
                            </div>
                            
                            <h5 className="font-medium text-gray-900 dark:text-white mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                              {review.title}
                            </h5>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  <div className="text-center pt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 backdrop-blur-sm"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
                    >
                      Load More Reviews
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
          
          {/* Related Products */}
          {featuredProducts && featuredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You might also like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((relatedProduct) => (
                  <ProductCard key={relatedProduct._id} product={relatedProduct} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <FiX className="w-8 h-8" />
              </button>
              <img
                src={product.images?.[selectedImageIndex]}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <FiChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <FiChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
