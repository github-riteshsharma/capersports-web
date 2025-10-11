import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { FiFilter, FiSearch, FiX, FiChevronDown, FiStar, FiLoader, FiPackage, FiArrowRight } from 'react-icons/fi';

// Components
import ProductCard from '../components/products/ProductCard';
import CaperSportsLoader from '../components/common/CaperSportsLoader';
import { ProductGridSkeleton } from '../components/products/ProductCardSkeleton';

// Store
import { getProducts, getCategories, getBrands } from '../store/slices/productSlice';

// Loading Component
const PremiumProductLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-center">
        <CaperSportsLoader size="xl" showText />
      </div>
    </div>
  );
};

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error, categories, brands } = useSelector((state) => state.products);
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [showFilters, setShowFilters] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Read category from URL parameters on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // Detect if screen is desktop size
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Size options - Complete range from 5XS to 5XL
  const sizeOptions = [
    '5XS', '4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'
  ];

  // Color options
  const colorOptions = [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Red', value: 'red', hex: '#EF4444' },
    { name: 'Blue', value: 'blue', hex: '#3B82F6' },
    { name: 'Green', value: 'green', hex: '#10B981' },
    { name: 'Yellow', value: 'yellow', hex: '#F59E0B' },
    { name: 'Purple', value: 'purple', hex: '#8B5CF6' },
    { name: 'Pink', value: 'pink', hex: '#EC4899' },
    { name: 'Gray', value: 'gray', hex: '#6B7280' },
    { name: 'Navy', value: 'navy', hex: '#1E40AF' },
    { name: 'Orange', value: 'orange', hex: '#F97316' },
    { name: 'Teal', value: 'teal', hex: '#14B8A6' }
  ];

  // Subcategories based on main categories
  const getSubCategories = (category) => {
    const subCategoryMap = {
      'T-Shirts': ['Polo T-Shirt', 'Sublimation', 'Round Neck', 'Travel', 'Training'],
      'Jackets': ['Wind Breakers', 'Rain Jackets', 'Varsity', 'Bomber', 'Custom'],
      'Tracksuits': ['Full Set', 'Top Only', 'Bottom Only', 'Custom'],
      'Hoodies': ['Pullover', 'Zip-up', 'Sleeveless', 'Custom'],
      'Shorts': ['Athletic Shorts', 'Running Shorts', 'Basketball Shorts', 'Training Shorts'],
      'Pants': ['Track Pants', 'Joggers', 'Training Pants', 'Custom'],
      'Bags': ['Backpack', 'Duffle Bag', 'Gym Bag', 'Kit Bag', 'Custom'],
      'Caps': ['Baggy Cap', 'Bucket Cap', 'Snapback', 'Custom'],
      'Hats': ['Sun Hat', 'Beanie', 'Visor', 'Custom'],
      'Cricket Whites': ['Full Kit', 'Shirt', 'Trousers', 'Sweater', 'Custom'],
      'Cricket Coloured': ['Full Kit', 'Jersey', 'Trousers', 'Training Wear', 'Custom'],
      'Basketball': ['Jersey', 'Shorts', 'Full Kit', 'Warm-up', 'Custom'],
      'Football': ['Jersey', 'Shorts', 'Full Kit', 'Training Wear', 'Custom'],
      'Marathon': ['Running Vest', 'Running Shorts', 'Full Kit', 'Training Wear', 'Custom'],
      'Gathering': ['T-Shirts', 'Polo Shirts', 'Hoodies', 'Caps', 'Custom'],
      'Officials': ['Shirt', 'Trousers', 'Full Kit', 'Accessories', 'Custom'],
      'Accessories': ['Gloves', 'Socks', 'Belts', 'Watches', 'Custom'],
      'Sportswear': ['Training Wear', 'Competition Wear', 'Casual Wear', 'Custom'],
      'Athleisure': ['Casual', 'Street Style', 'Lounge Wear', 'Custom'],
      'Swimwear': ['Swimsuit', 'Trunks', 'Rash Guard', 'Custom']
    };
    return subCategoryMap[category] || [];
  };

  // Fetch products on component mount with optimized loading
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      setProductsLoaded(false);
      
      try {
        // Load data with proper error handling
        await Promise.all([
          dispatch(getProducts()).unwrap(),
          dispatch(getCategories()).unwrap(),
          dispatch(getBrands()).unwrap()
        ]);
        
        // Remove artificial delay for better performance
        setProductsLoaded(true);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setInitialLoading(false);
        // Mark initial mount as complete after a short delay
        setTimeout(() => setIsInitialMount(false), 100);
      }
    };
    
    loadInitialData();
  }, [dispatch]);

  // Optimized filter effect with debouncing - only run when filters actually change
  useEffect(() => {
    // Skip if initial loading or if this is the initial mount
    if (initialLoading || isInitialMount) return;
    
    const timeoutId = setTimeout(() => {
      const filters = {
        search: searchQuery,
        category: selectedCategory,
        subCategory: selectedSubCategory,
        size: selectedSize,
        color: selectedColor,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy: sortBy,
      };

      // Apply active filter tab logic
      if (activeFilter === 'Men') {
        filters.gender = 'Men';
      } else if (activeFilter === 'Women') {
        filters.gender = 'Women';
      } else if (activeFilter === 'New Arrivals') {
        // For new arrivals, we'll sort by newest and limit to recent products
        filters.sortBy = 'createdAt';
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 30); // 30 days for more results
        filters.createdAfter = weekAgo.toISOString();
      }
      
      dispatch(getProducts(filters));
    }, 300); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [dispatch, searchQuery, selectedCategory, selectedSubCategory, selectedSize, selectedColor, priceRange, sortBy, activeFilter, initialLoading, isInitialMount]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange([0, 10000]);
    setSortBy('createdAt');
    setActiveFilter('All');
  };

  const filterTabs = [
    { name: 'All', count: products?.length || 0 },
    { name: 'Men', count: products?.filter(p => p.category?.toLowerCase().includes('men')).length || 0 },
    { name: 'Women', count: products?.filter(p => p.category?.toLowerCase().includes('women')).length || 0 },
    { name: 'New Arrivals', count: products?.filter(p => {
      const createdAt = new Date(p.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdAt > weekAgo;
    }).length || 0 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Show premium loader during initial loading
  if (initialLoading) {
    return <PremiumProductLoader />;
  }

  return (
    <>
      <Helmet>
        <title>Explore - Caper Sports</title>
        <meta name="description" content="Browse our collection of premium sports clothing and gear designed for champions" />
      </Helmet>

      <div className="min-h-screen bg-white pt-16 sm:pt-20">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16">
          {/* Apple-Style Filter Tabs - Horizontal Scroll on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 sm:mb-10"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Scrollable Tab Container */}
              <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex items-center gap-2 min-w-max">
                  {filterTabs.map((tab) => (
                    <motion.button
                      key={tab.name}
                      onClick={() => setActiveFilter(tab.name)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap ${
                        activeFilter === tab.name
                          ? 'bg-black text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{tab.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        activeFilter === tab.name ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Apple-Style Filter Toggle - Mobile Only */}
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`lg:hidden flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap ${
                  showFilters
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <FiFilter size={18} />
                <span>Filters</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Apple-Style Scrollbar CSS */}
          <style jsx>{`
            /* Hide scrollbar for horizontal scroll tabs */
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }

            /* Beautiful Apple-Style Scrollbar for Filter Sidebar */
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
              margin: 4px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(0, 0, 0, 0.15);
              border-radius: 10px;
              border: 2px solid transparent;
              background-clip: padding-box;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 0, 0, 0.25);
              border-radius: 10px;
              border: 2px solid transparent;
              background-clip: padding-box;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:active {
              background: rgba(0, 0, 0, 0.35);
            }

            /* Firefox */
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
            }

            /* Smooth scrolling */
            .custom-scrollbar {
              scroll-behavior: smooth;
            }
          `}</style>

          {/* Apple-Style Filter Backdrop */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
            )}
          </AnimatePresence>

          {/* Apple-Style Main Layout */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:h-[calc(100vh-12rem)]">
            {/* Apple-Style Filter Sidebar - Always visible on desktop, drawer on mobile */}
            <AnimatePresence>
              {(showFilters || isDesktop) && (
                <motion.div
                  initial={{ x: isDesktop ? 0 : -320, opacity: isDesktop ? 1 : 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: isDesktop ? 0 : -320, opacity: isDesktop ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed left-0 top-0 bottom-0 lg:relative lg:top-auto lg:bottom-auto z-50 lg:z-auto w-80 lg:w-72 xl:w-80 flex-shrink-0 bg-white lg:rounded-3xl shadow-2xl lg:shadow-lg border-r lg:border border-gray-200 overflow-y-auto lg:h-full custom-scrollbar"
                >
                  {/* Apple-Style Header */}
                  <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Filters</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Refine your search</p>
                      </div>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="lg:hidden w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  </div>

                    {/* Apple-Style Filter Content */}
                    <div className="p-6 space-y-6">
                      {/* Clear All Button */}
                      <motion.button
                        onClick={clearFilters}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-semibold text-sm transition-all duration-200"
                      >
                        Clear All
                      </motion.button>

                      {/* Search */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Search
                        </label>
                        <div className="relative">
                          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm transition-all duration-200"
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery('')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <FiX size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">
                          Category
                        </label>
                        <div className="relative">
                          <select
                            value={selectedCategory}
                            onChange={(e) => {
                              setSelectedCategory(e.target.value);
                              setSelectedSubCategory('');
                            }}
                            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none font-medium text-gray-900"
                          >
                            <option value="">All Categories</option>
                            {(categories || []).map((category) => (
                              <option key={category._id || category} value={category._id || category}>
                                {category._id || category}
                              </option>
                            ))}
                          </select>
                          <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                      </div>

                      {/* Sub Category Filter */}
                      {selectedCategory && getSubCategories(selectedCategory).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <label className="block text-sm font-bold text-gray-800 mb-3">
                            Sub Category
                          </label>
                          <div className="relative">
                            <select
                              value={selectedSubCategory}
                              onChange={(e) => setSelectedSubCategory(e.target.value)}
                              className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none font-medium text-gray-900"
                            >
                              <option value="">All {selectedCategory}</option>
                              {getSubCategories(selectedCategory).map((subCat) => (
                                <option key={subCat} value={subCat}>
                                  {subCat}
                                </option>
                              ))}
                            </select>
                            <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          </div>
                        </motion.div>
                      )}

                      {/* Size Filter */}
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">
                          Size
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            onClick={() => setSelectedSize('')}
                            className={`px-3 py-3 text-sm rounded-xl font-medium transition-all duration-200 ${
                              selectedSize === ''
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            All
                          </button>
                          {sizeOptions.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-3 py-3 text-sm rounded-xl font-medium transition-all duration-200 ${
                                selectedSize === size
                                  ? 'bg-red-600 text-white shadow-lg'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Filter */}
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">
                          Color
                        </label>
                        <div className="grid grid-cols-6 gap-3">
                          <button
                            onClick={() => setSelectedColor('')}
                            className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ${
                              selectedColor === ''
                                ? 'border-red-600 bg-gray-100 shadow-lg scale-110'
                                : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                            }`}
                            title="All Colors"
                          >
                            <span className="text-xs font-bold text-gray-600">All</span>
                          </button>
                          {colorOptions.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setSelectedColor(color.value)}
                              className={`w-12 h-12 rounded-2xl border-2 transition-all duration-200 ${
                                selectedColor === color.value
                                  ? 'border-red-600 scale-110 shadow-lg'
                                  : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                              }`}
                              style={{ 
                                backgroundColor: color.hex,
                                border: color.value === 'white' ? '2px solid #E5E7EB' : `2px solid ${selectedColor === color.value ? '#DC2626' : '#E5E7EB'}`
                              }}
                              title={color.name}
                            >
                              {selectedColor === color.value && (
                                <div className={`w-3 h-3 rounded-full ${color.value === 'white' || color.value === 'yellow' ? 'bg-gray-800' : 'bg-white'}`} />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">
                          Price Range
                        </label>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <input
                              type="number"
                              placeholder="Min"
                              value={priceRange[0]}
                              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                              className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-gray-900"
                            />
                            <span className="text-gray-400 font-bold">to</span>
                            <input
                              type="number"
                              placeholder="Max"
                              value={priceRange[1]}
                              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                              className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-gray-900"
                            />
                          </div>
                          <div className="text-center p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl">
                            <span className="text-red-800 font-bold">₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sort By */}
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">
                          Sort By
                        </label>
                        <div className="relative">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none font-medium text-gray-900"
                          >
                            <option value="createdAt">Latest</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                            <option value="name">Name: A to Z</option>
                            <option value="-name">Name: Z to A</option>
                            <option value="rating">Rating</option>
                          </select>
                          <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>

            {/* Products Content - Apple-Style Centered */}
            <div className="flex-1 min-w-0 max-w-[1400px] mx-auto w-full lg:overflow-y-auto lg:h-full custom-scrollbar lg:pr-2">
              {loading ? (
                /* Loading Skeleton Grid */
                <ProductGridSkeleton count={12} />
              ) : error ? (
                <div className="flex justify-center items-center py-20">
                  <div className="bg-white rounded-3xl p-12 shadow-lg border border-red-200 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : !products || products.length === 0 ? (
                /* Beautiful Apple-Inspired Empty State */
                <div className="flex items-center justify-center min-h-[60vh] px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center max-w-2xl"
                  >
                    {/* Icon */}
                    <div className="mb-8">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <FiSearch className="w-8 h-8 text-gray-400" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                      No products found
                    </h2>

                    {/* Description */}
                    <p className="text-lg text-gray-600 mb-8">
                      Try adjusting your filters or search to find what you're looking for.
                    </p>

                    {/* Primary Action */}
                    <button
                      onClick={clearFilters}
                      className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Clear all filters
                    </button>

                    {/* Suggestions */}
                    <div className="mt-12 pt-12 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-6">
                        Try browsing these categories
                      </p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {['T-Shirts', 'Jerseys', 'Shorts', 'Hoodies'].map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setActiveFilter(category);
                            }}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium text-sm transition-colors duration-200"
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Apple-Style Results Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {products.length} {products.length === 1 ? 'Product' : 'Products'}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                          {activeFilter !== 'All' ? `In ${activeFilter}` : 'Across all categories'}
                        </p>
                      </div>
                      {/* Sort indicator - Desktop only */}
                      <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
                        <span>Sorted by:</span>
                        <span className="font-semibold text-gray-900">
                          {sortBy === 'createdAt' ? 'Latest' :
                           sortBy === 'price' ? 'Price: Low to High' :
                           sortBy === '-price' ? 'Price: High to Low' :
                           sortBy === 'name' ? 'Name: A-Z' :
                           sortBy === '-name' ? 'Name: Z-A' : 'Rating'}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Active Filters Chips */}
                  {(selectedCategory || selectedSubCategory || selectedSize || selectedColor || (priceRange[0] > 0 || priceRange[1] < 10000) || searchQuery) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="mb-8 flex flex-wrap items-center gap-2"
                    >
                      <span className="text-sm text-gray-600 mr-2">Active filters:</span>
                      
                      {searchQuery && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                        >
                          <span>Search: "{searchQuery}"</span>
                          <button
                            onClick={() => setSearchQuery('')}
                            className="hover:bg-blue-100 rounded p-0.5 transition-colors"
                          >
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}

                      {selectedCategory && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                        >
                          <span>Category: {selectedCategory}</span>
                          <button
                            onClick={() => setSelectedCategory('')}
                            className="hover:bg-gray-200 rounded p-0.5 transition-colors"
                          >
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}

                      {selectedSubCategory && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                        >
                          <span>Type: {selectedSubCategory}</span>
                          <button
                            onClick={() => setSelectedSubCategory('')}
                            className="hover:bg-gray-200 rounded p-0.5 transition-colors"
                          >
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}

                      {selectedSize && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                        >
                          <span>Size: {selectedSize}</span>
                          <button
                            onClick={() => setSelectedSize('')}
                            className="hover:bg-gray-200 rounded p-0.5 transition-colors"
                          >
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}

                      {selectedColor && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                        >
                          <span>Color: {selectedColor}</span>
                          <button
                            onClick={() => setSelectedColor('')}
                            className="hover:bg-gray-200 rounded p-0.5 transition-colors"
                          >
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}

                      {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                        >
                          <span>Price: ₹{priceRange[0]} - ₹{priceRange[1]}</span>
                          <button
                            onClick={() => setPriceRange([0, 10000])}
                            className="hover:bg-gray-200 rounded p-0.5 transition-colors"
                          >
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}

                      {/* Clear All Button */}
                      <button
                        onClick={clearFilters}
                        className="ml-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Clear all
                      </button>
                    </motion.div>
                  )}

                  {/* Apple-Style Products Grid - Centered & Balanced */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-6 xl:gap-8 justify-items-center">
                    {products.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.05,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        className="w-full max-w-sm"
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;