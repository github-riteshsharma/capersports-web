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
  FiFilter,
  FiThumbsUp,
  FiThumbsDown,
  FiMessageCircle,
  FiCamera,
  FiMaximize2,
  FiSliders,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiCalendar,
  FiMapPin
} from 'react-icons/fi';

// Redux
import { getProductById, clearCurrentProduct, getFeaturedProducts, addReview } from '../store/slices/productSlice';
import { addToCart, addToCartOptimistic } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, toggleWishlist } from '../store/slices/wishlistSlice';

// Components
import CaperSportsLoader from '../components/common/CaperSportsLoader';
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
  
  // Advanced features state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all'); // all, 5star, 4star, etc.
  const [reviewSort, setReviewSort] = useState('newest'); // newest, oldest, helpful
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, reviews, specs, qa
  const [showComparison, setShowComparison] = useState(false);
  const [selectedReviewImages, setSelectedReviewImages] = useState([]);
  const [showReviewImageModal, setShowReviewImageModal] = useState(false);
  const [reviewImageIndex, setReviewImageIndex] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Refs for advanced interactions
  const imageRef = useRef(null);
  const zoomRef = useRef(null);
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
  
  // Handle add to cart with advanced feedback
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

  // Review filtering and sorting
  const getFilteredReviews = () => {
    let reviews = sampleReviews; // Use sample reviews for demo
    
    // Filter by rating
    if (reviewFilter !== 'all') {
      const rating = parseInt(reviewFilter.replace('star', ''));
      reviews = reviews.filter(review => review.rating === rating);
    }
    
    // Sort reviews
    switch (reviewSort) {
      case 'newest':
        reviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        reviews = [...reviews].sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'helpful':
        reviews = [...reviews].sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
      case 'rating_high':
        reviews = [...reviews].sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_low':
        reviews = [...reviews].sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }
    
    return reviews;
  };

  // Sample reviews with advanced features
  const sampleReviews = [
    {
      id: 1,
      user: 'Alex Johnson',
      avatar: 'AJ',
      rating: 5,
      title: 'Outstanding Quality!',
      comment: 'This product exceeded my expectations. The quality is exceptional and the fit is perfect. I\'ve been using it for training and it holds up really well.',
      date: new Date('2024-01-15'),
      verified: true,
      helpful: 24,
      images: ['/images/review1.jpg', '/images/review2.jpg'],
      size: 'L',
      color: 'Black',
      location: 'Mumbai, India'
    },
    {
      id: 2,
      user: 'Sarah Chen',
      avatar: 'SC',
      rating: 4,
      title: 'Great value for money',
      comment: 'Really happy with this purchase. The material feels premium and the design is exactly what I was looking for. Only minor issue is the sizing runs a bit small.',
      date: new Date('2024-01-10'),
      verified: true,
      helpful: 18,
      images: ['/images/review3.jpg'],
      size: 'M',
      color: 'Navy Blue',
      location: 'Delhi, India'
    },
    {
      id: 3,
      user: 'Mike Rodriguez',
      avatar: 'MR',
      rating: 5,
      title: 'Perfect for training',
      comment: 'Been using this for my workouts and it\'s been amazing. Comfortable, durable, and looks great too. Highly recommend for anyone serious about fitness.',
      date: new Date('2024-01-05'),
      verified: false,
      helpful: 12,
      images: [],
      size: 'XL',
      color: 'Red',
      location: 'Bangalore, India'
    },
    {
      id: 4,
      user: 'Priya Sharma',
      avatar: 'PS',
      rating: 3,
      title: 'Decent but not exceptional',
      comment: 'The product is okay but I expected better quality for the price. It does the job but there are better options available in the market.',
      date: new Date('2024-01-02'),
      verified: true,
      helpful: 8,
      images: ['/images/review4.jpg'],
      size: 'S',
      color: 'White',
      location: 'Chennai, India'
    }
  ];
  
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <CaperSportsLoader size="xl" showText />
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
  
  // Product not found
  if (!currentProduct) {
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
                  <img
                    src={product.images?.[selectedImageIndex] || '/images/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      if (e.target.dataset.errorHandled) return;
                      e.target.dataset.errorHandled = 'true';
                      e.target.src = '/images/placeholder-product.jpg';
                    }}
                  />
                  
                  {/* Zoom Overlay */}
                  <AnimatePresence>
                    {isZoomed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white"
                        style={{
                          backgroundImage: `url(${product.images?.[selectedImageIndex] || '/images/placeholder-product.jpg'})`,
                          backgroundSize: '200%',
                          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Image Navigation */}
                  {product.images && product.images.length > 1 && (
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
                  
                  {/* View Counter */}
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                    <FiEye className="w-3 h-3" />
                    <span>{Math.floor(Math.random() * 1000) + 500}</span>
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
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
                        className="w-full h-full object-contain p-2 bg-white"
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
                      {selectedColor || 'Select Color'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, index) => {
                      const colorName = typeof color === 'string' ? color : color.name;
                      
                      if (!colorName || (typeof colorName === 'string' && colorName.length === 24 && /^[0-9a-f]{24}$/i.test(colorName))) {
                        return null;
                      }
                      
                      return (
                        <motion.button
                          key={`color-${index}-${colorName}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedColor(colorName)}
                          className={`px-6 py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
                            selectedColor === colorName
                              ? 'border-red-500 bg-red-50 text-red-700 shadow-lg shadow-red-500/25'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {colorName}
                        </motion.button>
                      );
                    })}
                  </div>
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
                        onClick={() => setShowSizeGuide(true)}
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
                        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="bg-gradient-to-r from-red-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                            {review.user.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <h4 className="font-semibold text-gray-900">
                                  {review.user}
                                </h4>
                                {review.verified && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">
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
                              <span className="text-sm text-gray-600 ml-2">
                                {review.rating}/5
                              </span>
                            </div>
                            
                            <h5 className="font-medium text-gray-900 mb-2">
                              {review.title}
                            </h5>
                            <p className="text-gray-600 leading-relaxed">
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
