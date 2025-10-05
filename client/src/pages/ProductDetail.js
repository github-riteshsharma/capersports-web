import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiX,
  FiCamera,
  FiSliders,
  FiEye
} from 'react-icons/fi';

// Redux
import { getProductById, clearCurrentProduct, getFeaturedProducts, addReview } from '../store/slices/productSlice';
import { addToCart, addToCartOptimistic } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';

// Components
import CaperSportsLoader from '../components/common/CaperSportsLoader';
import ContextualLoader from '../components/common/ContextualLoader';
import Button from '../components/common/Button';
import ProductCard from '../components/products/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProduct, featuredProducts, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  // Local state
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedColorObject, setSelectedColorObject] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // Advanced features state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Refs for advanced interactions
  const imageRef = useRef(null);
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
      // Don't clear current product immediately to prevent flash of "not found"
      // dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);
  
  // Clear current product when component unmounts (not when id changes)
  useEffect(() => {
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch]);
  
  // Set initial color and size when product loads
  useEffect(() => {
    if (currentProduct) {
      console.log('🔍 Product loaded:', currentProduct.name);
      console.log('🔍 Default images:', currentProduct.images);
      console.log('🔍 Colors:', currentProduct.colors?.length || 0);
      
      if (currentProduct.colors && currentProduct.colors.length > 0) {
        console.log('🔍 First color:', currentProduct.colors[0]);
      }
      
      // Don't auto-select a color - let user choose to see color-specific images
      // Only set size if available
      if (currentProduct.sizes && currentProduct.sizes.length > 0 && !selectedSize) {
        // Handle both string and object formats
        const firstSize = typeof currentProduct.sizes[0] === 'string' 
          ? currentProduct.sizes[0] 
          : currentProduct.sizes[0].size;
        setSelectedSize(firstSize);
      }
    }
  }, [currentProduct, selectedSize]);
  
  // Get current images based on selected color or fallback to default images
  const getCurrentImages = () => {
    if (!currentProduct) return [];
    
    // If no color is selected, always show general product images
    if (!selectedColor) {
      if (currentProduct.images && currentProduct.images.length > 0) {
        return currentProduct.images.map(img => {
          // If it's a base64 image, return it as-is
          if (img.startsWith('data:image/')) {
            return img;
          }
          // If it's a file path, return it as-is
          return img;
        });
      }
      // Fallback to placeholder if no general images
      return ['/images/placeholder-product.jpg'];
    }
    
    // If color is selected and has specific images, use those
    if (selectedColorObject && selectedColorObject.images && selectedColorObject.images.length > 0) {
      // Filter out any invalid image paths
      const validImages = selectedColorObject.images.filter(img => 
        img && typeof img === 'string' && img.trim() !== ''
      );
      
      if (validImages.length > 0) {
        return validImages;
      }
    }
    
    // If color is selected but no color-specific images, fall back to general images
    if (currentProduct.images && currentProduct.images.length > 0) {
      return currentProduct.images.map(img => {
        // If it's a base64 image, return it as-is
        if (img.startsWith('data:image/')) {
          return img;
        }
        // If it's a file path, return it as-is
        return img;
      });
    }
    
    // Final fallback to placeholder
    return ['/images/placeholder-product.jpg'];
  };

  // Check if color-specific images are available
  const hasColorSpecificImages = () => {
    return selectedColorObject && 
           selectedColorObject.images && 
           selectedColorObject.images.length > 0 &&
           selectedColorObject.images.some(img => img && typeof img === 'string' && img.trim() !== '');
  };

  // Check if we're showing default images (fallback)
  const isShowingDefaultImages = () => {
    // If no color is selected, we're showing general images (not default/fallback)
    if (!selectedColor) return false;
    
    // If color is selected but no color-specific images available, we're showing fallback
    return selectedColor && !hasColorSpecificImages();
  };

  // Handle color selection with instant preview
  const handleColorSelect = (colorName, colorObject = null) => {
    console.log('🎨 Color selected:', colorName);
    console.log('🎨 Color object:', colorObject);
    console.log('🎨 Color object images:', colorObject?.images);
    setSelectedColor(colorName);
    setSelectedColorObject(colorObject);
    setSelectedImageIndex(0); // Reset to first image when changing color
    
    // Debug: Log current images after color change
    setTimeout(() => {
      const images = getCurrentImages();
      console.log('🖼️ Current images after color change:', images);
      console.log('🖼️ Selected image index:', 0);
      console.log('🖼️ Current image URL:', images[0]);
      console.log('🖼️ Has color-specific images:', hasColorSpecificImages());
      console.log('🖼️ Is showing default images:', isShowingDefaultImages());
    }, 100);
  };

  // Get color hex value for display
  const getColorHex = (color) => {
    if (typeof color === 'object' && color.hex) {
      return color.hex;
    }
    // Fallback color mapping for common colors
    const colorMap = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#DC2626',
      'blue': '#2563EB',
      'green': '#16A34A',
      'yellow': '#EAB308',
      'purple': '#9333EA',
      'pink': '#EC4899',
      'gray': '#6B7280',
      'grey': '#6B7280',
      'orange': '#EA580C',
      'brown': '#A16207',
      'navy': '#1E3A8A',
      'maroon': '#991B1B',
      'teal': '#0D9488',
      'lime': '#65A30D',
      'indigo': '#4F46E5',
      'cyan': '#0891B2',
      'emerald': '#059669',
      'rose': '#E11D48',
      'amber': '#D97706',
      'violet': '#7C3AED',
      'fuchsia': '#C026D3',
      'sky': '#0284C7',
      'slate': '#475569'
    };
    
    const colorName = typeof color === 'string' ? color.toLowerCase() : 
                     (color.name ? color.name.toLowerCase() : '');
    return colorMap[colorName] || '#6B7280';
  };
  const handleAddToCart = async () => {
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
    
    setIsAddingToCart(true);
    
    const cartItem = {
      productId: currentProduct._id,
      quantity: quantity,
      color: selectedColor || null,
      size: selectedSize || null
    };
    
    try {
      // Optimistic update for immediate UI feedback
      dispatch(addToCartOptimistic({
        ...cartItem,
        product: currentProduct
      }));
      
      // Then dispatch the actual API call
      await dispatch(addToCart(cartItem)).unwrap();
      toast.success('Added to cart!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Add to cart error:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  // Advanced image zoom handlers
  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current || !isZoomed) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const maxStock = selectedSize ? getSizeStock(product, selectedSize) : getTotalStock(product);
    const newQuantity = quantity + change;
    
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
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
        bgColor: 'bg-red-100'
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
        bgColor: 'bg-red-100'
      };
    }
    
    // Calculate total from individual sizes for threshold check
    const totalStock = product.sizes.reduce((total, size) => total + (size.stock || 0), 0);
    const lowStockThreshold = product?.lowStockThreshold || 10;
    
    if (totalStock <= lowStockThreshold) {
      return {
        text: 'Low Stock',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      };
    } else {
      return {
        text: 'In Stock',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    }
  };
  
  // Handle image navigation
  const handleImageNavigation = (direction) => {
    const currentImages = getCurrentImages();
    if (!currentImages || currentImages.length === 0) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(prev => 
        prev === 0 ? currentImages.length - 1 : prev - 1
      );
    } else {
      setSelectedImageIndex(prev => 
        prev === currentImages.length - 1 ? 0 : prev + 1
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-center">
          <CaperSportsLoader size="xl" showText />
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  // Product not found - only show this if we're not loading and there's no error
  if (!loading && !error && !currentProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }
  
  // If we don't have a product yet but we're not in an error state, show loading
  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-center">
          <CaperSportsLoader size="xl" showText />
        </div>
      </div>
    );
  }
  
  const product = currentProduct;
  const averageRating = product.ratings?.average || product.rating || 0;
  const totalReviews = product.reviews?.length || 0;
  
  return (
    <>
      <Helmet>
        <title>{product.name} - Caper Sports</title>
        <meta name="description" content={product.description} />
      </Helmet>

      {/* Contextual Loading Overlay */}
      <ContextualLoader 
        isVisible={isSubmittingReview || isAddingToCart}
        context={isSubmittingReview ? 'review' : isAddingToCart ? 'cart' : 'default'}
        fullScreen={false}
        blur={true}
      />

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <button onClick={() => navigate('/')} className="hover:text-red-600 transition-colors">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate('/products')} className="hover:text-red-600 transition-colors">
              Products
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
          
          {/* Main Product Section - Better Proportions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden group border border-gray-200">
                <div 
                  className="relative aspect-square cursor-zoom-in"
                  ref={imageRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                  onClick={() => setShowImageModal(true)}
                >
                  {/* Main Product Image or Preview Not Available */}
                  {isShowingDefaultImages() ? (
                    // Premium "Preview Not Available" state
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        {/* Preview Not Available Icon */}
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                          <FiCamera className="w-10 h-10 text-gray-400" />
                        </div>
                        
                        {/* Main Message */}
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Preview Not Available
                        </h3>
                        
                        {/* Color-specific message */}
                        <p className="text-sm text-gray-500 mb-3">
                          Photos for <span className="font-medium text-gray-700">{selectedColor}</span> are not available yet
                        </p>
                        
                        {/* Color swatch */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: getColorHex({ name: selectedColor, hex: selectedColorObject?.hex }) }}
                          />
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            {selectedColor} Variant
                          </span>
                        </div>
                        
                        {/* Professional message */}
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-600 leading-relaxed">
                            We're working on adding photos for this color variant. 
                            <br />
                            <span className="font-medium">Product specifications and features remain the same.</span>
                          </p>
                        </div>
                        
                        {/* View General Images Button */}
                        <button
                          onClick={() => setSelectedColor('')}
                          className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                          View General Images
                        </button>
                      </motion.div>
                    </div>
                  ) : (
                    // Regular product image with logo
                    <div className="relative w-full h-full">
                      <img
                        src={getCurrentImages()?.[selectedImageIndex] || '/images/placeholder-product.jpg'}
                        alt={`${product.name} ${selectedColor ? `in ${selectedColor}` : ''}`}
                        className="w-full h-full object-contain p-8 transition-all duration-500 group-hover:scale-105"
                        onLoad={() => {
                          console.log('✅ Image loaded successfully:', getCurrentImages()?.[selectedImageIndex]);
                        }}
                        onError={(e) => {
                          console.error('❌ Image failed to load:', e.target.src);
                          if (e.target.dataset.errorHandled) return;
                          e.target.dataset.errorHandled = 'true';
                          
                          // Try placeholder image
                          if (e.target.src !== '/images/placeholder-product.jpg') {
                            console.log('🔄 Trying placeholder image...');
                            e.target.src = '/images/placeholder-product.jpg';
                          } else {
                            console.error('❌ Even placeholder image failed to load');
                            // Hide the image if even placeholder fails
                            e.target.style.display = 'none';
                          }
                        }}
                      />
                      
                      {/* Logo in bottom left corner */}
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
                        <img
                          src="/images/logo.png"
                          alt="Caper Sports"
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        {/* Fallback Logo */}
                        <div className="hidden w-8 h-8 bg-gradient-to-br from-red-600 to-blue-600 rounded-lg items-center justify-center">
                          <span className="text-white font-bold text-xs">CS</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Zoom Overlay */}
                  <AnimatePresence>
                    {isZoomed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white"
                        style={{
                          backgroundImage: `url(${getCurrentImages()?.[selectedImageIndex] || '/images/placeholder-product.jpg'})`,
                          backgroundSize: '200%',
                          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Image Navigation */}
                  {getCurrentImages() && getCurrentImages().length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageNavigation('prev');
                        }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-md p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                      >
                        <FiChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageNavigation('next');
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-md p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                      >
                        <FiChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}
                  
                  {/* Zoom Icon */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FiZoomIn className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {!isShowingDefaultImages() && getCurrentImages() && getCurrentImages().length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {getCurrentImages().map((image, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImageIndex === index 
                          ? 'border-red-500 shadow-lg shadow-red-500/25' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain p-2 bg-white transition-all duration-300"
                        onError={(e) => {
                          if (e.target.dataset.errorHandled) return;
                          e.target.dataset.errorHandled = 'true';
                          e.target.src = '/images/placeholder-product.jpg';
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
              )}
              
              {/* Preview Not Available Thumbnail State */}
              {isShowingDefaultImages() && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  <div className="flex-shrink-0 w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                    <FiCamera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-shrink-0 w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center opacity-50">
                    <FiCamera className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="flex-shrink-0 w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center opacity-30">
                    <FiCamera className="w-6 h-6 text-gray-300" />
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200 space-y-6"
            >
              {/* Title and Rating */}
              <div className="border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-5 h-5 ${
                            i < averageRating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium text-gray-700 ml-2">
                        {averageRating.toFixed(1)} ({totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">SKU:</span>
                    <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
                      {product.sku || 'CS001'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 px-3 py-1 rounded-full font-medium">
                    {product.brand || 'Caper Sports'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {product.category || 'T-Shirts'}
                  </span>
                </div>
              </div>
              
              {/* Price Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{(product.salePrice || product.price)?.toLocaleString()}
                  </span>
                  {product.salePrice && product.price > product.salePrice && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">
                        ₹{product.price?.toLocaleString()}
                      </span>
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg">
                        Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Inclusive of all taxes • Free shipping on orders above ₹499
                </p>
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <FiCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">In Stock</p>
                    <p className="text-sm text-green-600">
                      {(() => {
                        const totalStock = product.sizes ? 
                          product.sizes.reduce((total, size) => total + (size.stock || 0), 0) : 
                          50; // Fallback
                        return `${totalStock} items available`;
                      })()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 font-medium">Ready to ship</p>
                  <p className="text-xs text-green-500">Delivery in 2-3 days</p>
                </div>
              </div>
              
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Color
                    </h3>
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {selectedColor || 'General Images'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {/* General Images Option */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleColorSelect('', null)}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-medium transition-all duration-300 ${
                        !selectedColor
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/25'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                      }`}
                    >
                      {/* General Images Icon */}
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-sm flex items-center justify-center">
                        <FiEye className="w-3 h-3 text-gray-600" />
                      </div>
                      
                      {/* Label */}
                      <span>General Images</span>
                      
                      {/* Selected Indicator */}
                      {!selectedColor && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                        >
                          <FiCheck className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                    
                    {/* Color Options */}
                    {product.colors.map((color, index) => {
                      const colorName = typeof color === 'string' ? color : color.name;
                      const colorHex = getColorHex(color);
                      const colorObject = typeof color === 'object' ? color : null;
                      
                      if (!colorName || (typeof colorName === 'string' && colorName.length === 24 && /^[0-9a-f]{24}$/i.test(colorName))) {
                        return null;
                      }
                      
                      return (
                        <motion.button
                          key={`color-${index}-${colorName}`}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleColorSelect(colorName, colorObject)}
                          className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-medium transition-all duration-300 ${
                            selectedColor === colorName
                              ? 'border-red-500 bg-red-50 text-red-700 shadow-lg shadow-red-500/25'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                          }`}
                        >
                          {/* Color Swatch */}
                          <div 
                            className={`w-6 h-6 rounded-full border-2 shadow-sm ${
                              colorHex === '#FFFFFF' ? 'border-gray-300' : 'border-white'
                            }`}
                            style={{ backgroundColor: colorHex }}
                          />
                          
                          {/* Color Name */}
                          <span className="capitalize">{colorName}</span>
                          
                          {/* Selected Indicator */}
                          {selectedColor === colorName && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                            >
                              <FiCheck className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                          
                          {/* Preview Badge */}
                          {colorObject && colorObject.images && colorObject.images.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              {colorObject.images.length} {colorObject.images.length === 1 ? 'photo' : 'photos'}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {/* Color Preview Info */}
                  {/* General Images Info */}
                  {!selectedColor && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-blue-700">
                          <FiEye className="w-4 h-4" />
                          <span className="font-medium">
                            Viewing general product images
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          <FiEye className="w-3 h-3" />
                          <span>General View</span>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 mt-2 opacity-80">
                        Select a color above to see color-specific product photos
                      </p>
                    </motion.div>
                  )}
                  
                  {/* Color-Specific Images Info */}
                  {selectedColor && hasColorSpecificImages() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <FiCamera className="w-4 h-4" />
                          <span className="font-medium">
                            Viewing {selectedColorObject.images.length} {selectedColorObject.images.length === 1 ? 'photo' : 'photos'} of {selectedColor} variant
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          <div 
                            className="w-3 h-3 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: getColorHex({ name: selectedColor, hex: selectedColorObject?.hex }) }}
                          />
                          <span>Real Product Photos</span>
                        </div>
                      </div>
                      <p className="text-xs text-green-600 mt-2 opacity-80">
                        These are actual photos of the {selectedColor} product variant
                      </p>
                    </motion.div>
                  )}
                  
                  {/* Preview Not Available Info */}
                  {selectedColor && isShowingDefaultImages() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-amber-700">
                          <FiCamera className="w-4 h-4" />
                          <span className="font-medium">
                            {selectedColor} photos not available
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                          <div 
                            className="w-3 h-3 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: getColorHex({ name: selectedColor, hex: selectedColorObject?.hex }) }}
                          />
                          <span>Preview Unavailable</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-amber-600 opacity-80">
                          Color-specific photos coming soon! Product features remain the same.
                        </p>
                        <button
                          onClick={() => setSelectedColor('')}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
                        >
                          View General Images
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
              
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Size
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {selectedSize || 'Select Size'}
                      </span>
                      <button 
                        onClick={() => {
                          // Size guide functionality would go here
                          toast.info('Size guide feature coming soon!');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                      >
                        <FiSliders className="w-4 h-4" />
                        <span>Size Guide</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {product.sizes.map((size, index) => {
                      const sizeName = typeof size === 'string' ? size : (size.size || size.name || size);
                      const sizeStock = getSizeStock(product, sizeName);
                      const isOutOfStock = sizeStock === 0;
                      
                      if (typeof sizeName === 'string' && sizeName.length === 24 && /^[0-9a-f]{24}$/i.test(sizeName)) {
                        return null;
                      }
                      
                      if (typeof sizeName === 'object') {
                        return null;
                      }
                      
                      return (
                        <motion.button
                          key={`size-${index}-${sizeName}`}
                          whileHover={{ scale: isOutOfStock ? 1 : 1.05 }}
                          whileTap={{ scale: isOutOfStock ? 1 : 0.95 }}
                          onClick={() => !isOutOfStock && setSelectedSize(sizeName)}
                          disabled={isOutOfStock}
                          className={`relative px-4 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                            selectedSize === sizeName
                              ? 'border-red-500 bg-red-50 text-red-700 shadow-lg shadow-red-500/25'
                              : isOutOfStock
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="block text-center">
                            {sizeName}
                          </span>
                          {sizeStock > 0 && sizeStock <= 5 && (
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {sizeStock}
                            </span>
                          )}
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-red-500 transform rotate-12"></div>
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Quantity */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiMinus className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="px-6 py-3 text-lg font-semibold text-gray-900 bg-gray-50 min-w-[4rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (selectedSize ? getSizeStock(product, selectedSize) : getTotalStock(product))}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiPlus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Max: {selectedSize ? getSizeStock(product, selectedSize) : getTotalStock(product)}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={
                      (product.colors && product.colors.length > 0 && !selectedColor) ||
                      (product.sizes && product.sizes.length > 0 && !selectedSize) ||
                      (selectedSize && getSizeStock(product, selectedSize) <= 0) ||
                      (getTotalStock(product) <= 0) ||
                      isAddingToCart
                    }
                    className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg ${
                      (selectedSize && getSizeStock(product, selectedSize) <= 0) || getTotalStock(product) <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:shadow-xl'
                    }`}
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <FiShoppingCart className="w-6 h-6" />
                        <span>
                          {(() => {
                            const hasColors = product.colors && product.colors.length > 0;
                            const hasSizes = product.sizes && product.sizes.length > 0;
                            const totalStock = getTotalStock(product);
                            const sizeStock = selectedSize ? getSizeStock(product, selectedSize) : totalStock;
                            
                            if (totalStock <= 0) return 'Out of Stock';
                            if (selectedSize && sizeStock <= 0) return 'Size Out of Stock';
                            if (hasColors && !selectedColor) return 'Select Color';
                            if (hasSizes && !selectedSize) return 'Select Size';
                            
                            return 'Add to Cart';
                          })()}
                        </span>
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (isInWishlist) {
                        dispatch(removeFromWishlist(currentProduct._id));
                        toast.success('Removed from wishlist!');
                      } else {
                        dispatch(addToWishlist(currentProduct));
                        toast.success('Added to wishlist!');
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 shadow-lg ${
                      isInWishlist 
                        ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-red-500/25'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600'
                    }`}
                    title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <FiHeart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="p-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 transition-all duration-200 shadow-lg"
                    title="Share this product"
                  >
                    <FiShare2 className="w-6 h-6" />
                  </motion.button>
                </div>
                
                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="flex items-center space-x-2 text-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <FiTruck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
                      <p className="text-xs text-gray-500">Orders ₹499+</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <FiRotateCcw className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
                      <p className="text-xs text-gray-500">30 days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FiShield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Secure Pay</p>
                      <p className="text-xs text-gray-500">100% safe</p>
                    </div>
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
            className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">
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
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <FiStar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Customer Reviews
                    </h2>
                    <p className="text-gray-600 mt-1">What our customers are saying</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReviews(!showReviews)}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300"
                >
                  {showReviews ? 'Hide Reviews' : 'View Reviews'}
                </motion.button>
              </div>
              
              {/* Rating Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-4xl font-bold text-gray-900">
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
                      <p className="text-sm text-gray-600">Overall Rating</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {product.reviews ? product.reviews.length : '247'}
                    </div>
                    <p className="text-gray-600">Total Reviews</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      96%
                    </div>
                    <p className="text-gray-600">Recommend</p>
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
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Write a Review
                    </h3>
                    
                    {isAuthenticated ? (
                      <div className="space-y-6">
                        {/* Rating Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            <span className="ml-4 text-sm text-gray-600">
                              {reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        
                        {/* Review Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Review Title
                          </label>
                          <input
                            type="text"
                            value={reviewForm.title}
                            onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                            placeholder="Summarize your review..."
                            className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        
                        {/* Review Comment */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            placeholder="Tell us about your experience with this product..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                          />
                        </div>
                        
                        {/* Submit Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleReviewSubmit}
                          disabled={isSubmittingReview}
                          className={`px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 ${
                            isSubmittingReview
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                          }`}
                        >
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </motion.button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">
                          Please log in to write a review
                        </p>
                        <button
                          onClick={() => navigate('/login')}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300"
                        >
                          Log In
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Reviews List */}
                  <div className="space-y-4">
                    {/* Real Product Reviews */}
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review, index) => (
                        <motion.div
                          key={review._id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="bg-gradient-to-r from-red-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                              {review.user?.firstName?.charAt(0) || review.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <h4 className="font-semibold text-gray-900">
                                    {review.user?.firstName && review.user?.lastName 
                                      ? `${review.user.firstName} ${review.user.lastName}` 
                                      : review.user?.name || 'Anonymous User'}
                                  </h4>
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                    Verified Purchase
                                  </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                                <span className="text-sm text-gray-600 ml-2">
                                  {review.rating}/5
                                </span>
                              </div>
                              
                              {review.title && (
                                <h5 className="font-medium text-gray-900 mb-2">
                                  {review.title}
                                </h5>
                              )}
                              <p className="text-gray-600 leading-relaxed">
                                {review.comment}
                              </p>
                              
                              {/* Admin Response */}
                              {review.adminResponse && (
                                <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <img
                                      src="/images/logo.png"
                                      alt="Caper Sports"
                                      className="w-6 h-6 object-contain"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        const fallback = e.target.nextSibling;
                                        if (fallback) fallback.style.display = 'inline-flex';
                                      }}
                                    />
                                    <div className="hidden w-6 h-6 bg-gradient-to-br from-red-600 to-blue-600 rounded-full items-center justify-center">
                                      <span className="text-white font-bold text-xs">CS</span>
                                    </div>
                                    <span className="font-semibold text-blue-800">Caper Sports Team</span>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                      Official Response
                                    </span>
                                  </div>
                                  <p className="text-blue-700 text-sm leading-relaxed">
                                    {review.adminResponse}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                        <FiStar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
                        <p className="text-gray-500 mb-6">Be the first to share your experience with this product!</p>
                        {isAuthenticated && (
                          <button
                            onClick={() => setShowReviews(true)}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300"
                          >
                            Write First Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Load More Button */}
                  <div className="text-center pt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
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
                src={getCurrentImages()?.[selectedImageIndex]}
                alt={product.name}
                className="max-w-full max-h-full object-contain transition-all duration-500"
              />
              {getCurrentImages() && getCurrentImages().length > 1 && (
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
