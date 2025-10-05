import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { FiFilter, FiSearch, FiX, FiChevronDown, FiStar, FiLoader, FiPackage } from 'react-icons/fi';

// Components
import ProductCard from '../components/products/ProductCard';
import CaperSportsLoader from '../components/common/CaperSportsLoader';

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

  // Size options from size chart
  const sizeOptions = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
    '28', '30', '32', '34', '36', '38', '40', '42', '44', '46',
    '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'
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
      'T-Shirts': ['Basic Tees', 'Polo Shirts', 'Long Sleeve', 'Tank Tops', 'Graphic Tees'],
      'Jerseys': ['Football', 'Basketball', 'Soccer', 'Baseball', 'Hockey', 'Custom'],
      'Shorts': ['Athletic Shorts', 'Running Shorts', 'Basketball Shorts', 'Swim Shorts'],
      'Pants': ['Track Pants', 'Joggers', 'Leggings', 'Compression Pants'],
      'Hoodies': ['Pullover', 'Zip-up', 'Sleeveless', 'Cropped'],
      'Jackets': ['Wind Breakers', 'Rain Jackets', 'Varsity', 'Bomber'],
      'Shoes': ['Running', 'Basketball', 'Training', 'Casual', 'Cleats'],
      'Accessories': ['Caps', 'Bags', 'Gloves', 'Socks', 'Belts', 'Watches']
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
      }
    };
    
    loadInitialData();
  }, [dispatch]);

  // Optimized filter effect with debouncing
  useEffect(() => {
    if (initialLoading) return;
    
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
  }, [dispatch, searchQuery, selectedCategory, selectedSubCategory, selectedSize, selectedColor, priceRange, sortBy, activeFilter, initialLoading]);

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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  Explore
            </h1>
                <p className="text-lg text-gray-600">
                  Discover premium athletic wear designed for champions
                </p>
              </div>

              {/* Quick Stats */}
              <div className="hidden lg:flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{products?.length || 0}</div>
                  <div className="text-sm text-gray-500">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{categories?.length || 0}</div>
                  <div className="text-sm text-gray-500">Categories</div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-1">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveFilter(tab.name)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeFilter === tab.name
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <span>{tab.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeFilter === tab.name ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                  showFilters
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <motion.div
                  animate={{ rotate: showFilters ? 90 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <FiFilter size={18} />
                </motion.div>
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </motion.div>

          {/* Mobile Filter Backdrop */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Main Content Layout - Responsive */}
          <div className="flex gap-8">
            {/* Filter Sidebar - Always Visible on Same Page */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="fixed inset-0 lg:relative lg:inset-auto z-50 lg:z-auto lg:w-80 flex-shrink-0 bg-white lg:rounded-2xl lg:shadow-lg lg:border lg:border-gray-200 h-full lg:h-fit lg:sticky lg:top-24"
                >
                  {/* Premium Header */}
                  <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                          <FiFilter size={20} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Filters</h3>
                          <p className="text-red-100 text-sm">Refine your search</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-colors duration-200"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  </div>

                    {/* Filter Content */}
                    <div className="p-6 space-y-8">
                      {/* Clear All Button */}
                      <div className="flex justify-center">
                        <button
                          onClick={clearFilters}
                          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors duration-200"
                        >
                          Clear All Filters
                        </button>
                      </div>

                      {/* Search */}
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">
                          Search Products
                        </label>
                        <div className="relative bg-gray-50 rounded-2xl border-0 focus-within:bg-white focus-within:shadow-lg focus-within:ring-2 focus-within:ring-red-500 transition-all duration-200">
                          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="Search for sports gear..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-transparent border-0 rounded-2xl focus:outline-none text-gray-900 placeholder-gray-400 font-medium"
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery('')}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <FiX size={18} />
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

            {/* Products Content - Flexible Width */}
            <div className="flex-1 min-w-0">
              {error ? (
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
                <div className="flex justify-center items-center py-20">
                  <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-8"
                  >
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {products.length} Products Found
                          </h3>
                          <p className="text-gray-600">
                            Showing results for "{activeFilter}" category
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiStar className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">Quality Guaranteed</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Products Grid - Mobile Optimized */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-4 md:gap-6 lg:gap-6 xl:gap-8"
                  >
                    {products.map((product, index) => (
                      <motion.div
                        key={product._id}
                        variants={itemVariants}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
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