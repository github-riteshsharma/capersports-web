import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { FiFilter, FiSearch, FiGrid, FiList } from 'react-icons/fi';

// Components
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

// Store
import { getProducts, getCategories, getBrands } from '../store/slices/productSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error, categories, brands } = useSelector((state) => state.products);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      setProductsLoaded(false);
      
      // Load all initial data
      await Promise.all([
        dispatch(getProducts()),
        dispatch(getCategories()),
        dispatch(getBrands())
      ]);
      
      setProductsLoaded(true);
      setInitialLoading(false);
    };
    
    loadInitialData();
  }, [dispatch]);

  // Filter products based on search and filters
  useEffect(() => {
    // Skip if initial loading is still happening
    if (initialLoading) return;
    
    const filters = {
      search: searchQuery,
      category: selectedCategory,
      brand: selectedBrand,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy: sortBy,
    };
    
    dispatch(getProducts(filters));
  }, [dispatch, searchQuery, selectedCategory, selectedBrand, priceRange, sortBy, initialLoading]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect above
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange([0, 10000]);
    setSortBy('createdAt');
  };

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

  return (
    <>
      <Helmet>
        <title>Products - CaperSports</title>
        <meta name="description" content="Browse our collection of premium sports clothing and gear" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Products
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Discover our premium collection of sports clothing and gear
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                  <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </form>
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <FiFilter size={18} />
                  Filters
                </Button>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
                    }`}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
                    }`}
                  >
                    <FiList size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Categories</option>
                      {(categories || []).map((category) => (
                        <option key={category._id || category} value={category._id || category}>
                          {category._id || category} {category.count && `(${category.count})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brand
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Brands</option>
                      {(brands || []).map((brand) => (
                        <option key={brand._id || brand} value={brand._id || brand}>
                          {brand._id || brand} {brand.count && `(${brand.count})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price Range
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="createdAt">Newest First</option>
                      <option value="price">Price: Low to High</option>
                      <option value="-price">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                      <option value="-name">Name: Z to A</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Products Grid */}
          {initialLoading || (loading && !productsLoaded) ? (
            <div className="space-y-8">
              {/* Loading Message */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <LoadingSpinner size="xl" text="Loading amazing products..." />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-6 space-y-2"
                >
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Discovering the best sports gear for you
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This won't take long...
                  </p>
                </motion.div>
              </motion.div>
                
              {/* Loading skeleton preview - Matching actual product grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className={`grid gap-8 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {[...Array(8)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.8 + (index * 0.1),
                      ease: "easeOut"
                    }}
                    className="group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    {/* Product Image Skeleton - Matching aspect-square */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"
                           style={{
                             backgroundSize: '200% 100%',
                             animation: `shimmer 2s infinite linear`,
                             animationDelay: `${index * 0.2}s`
                           }}>
                      </div>
                      
                      {/* Wishlist button skeleton */}
                      <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                      
                      {/* Discount badge skeleton */}
                      {index % 3 === 0 && (
                        <div className="absolute top-3 left-3 w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    {/* Product Info Skeleton */}
                    <div className="p-4 space-y-3">
                      {/* Product name */}
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                      
                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, starIndex) => (
                          <div key={starIndex} className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        ))}
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8 ml-2 animate-pulse"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-red-600 dark:text-red-400 mb-4">
                  {error}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-gray-400 text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No products match your current search criteria.
                </p>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid gap-8 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              {products.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard 
                    product={product} 
                    className={viewMode === 'list' ? 'flex flex-row max-w-2xl mx-auto' : ''}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Products;
