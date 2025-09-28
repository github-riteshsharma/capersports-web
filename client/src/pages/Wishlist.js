import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FiHeart, 
  FiShoppingCart, 
  FiX, 
  FiPackage, 
  FiTrash2, 
  FiShoppingBag,
  FiFilter,
  FiSearch,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { 
  removeFromWishlist, 
  clearWishlist, 
  toggleWishlist, 
  fetchWishlist 
} from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showClearModal, setShowClearModal] = useState(false);

  // Get unique categories from wishlist items
  const categories = [...new Set(wishlistItems.map(item => item.category))].filter(Boolean);

  // Filter and sort wishlist items
  const filteredItems = wishlistItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'brand':
          return (a.brand || '').localeCompare(b.brand || '');
        default:
          return 0; // dateAdded - maintain original order
      }
    });

  useEffect(() => {
    // Fetch wishlist on component mount
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.success('Removed from wishlist');
  };

  const handleToggleWishlist = (product) => {
    dispatch(toggleWishlist(product));
  };

  // Stock utility functions
  const getTotalStock = (product) => {
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
    const totalStock = getTotalStock(product);
    const lowStockThreshold = product?.lowStockThreshold || 10;
    
    if (totalStock === 0) {
      return {
        text: 'Out of Stock',
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/20'
      };
    } else if (totalStock <= lowStockThreshold) {
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

  const handleAddToCart = (product) => {
    const totalStock = getTotalStock(product);
    
    if (totalStock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    // Get the first available size
    let selectedSize = null;
    if (product.sizes && product.sizes.length > 0) {
      const availableSize = product.sizes.find(size => {
        const sizeName = size.name || size;
        return getSizeStock(product, sizeName) > 0;
      });
      selectedSize = availableSize ? (availableSize.name || availableSize) : null;
      
      if (!selectedSize) {
        toast.error('All sizes are out of stock');
        return;
      }
    }
    
    const cartItem = {
      productId: product._id,
      quantity: 1,
      size: selectedSize,
      color: product.colors?.[0] || null
    };
    
    dispatch(addToCart(cartItem));
    toast.success('Added to cart');
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
    setShowClearModal(false);
    toast.success('Wishlist cleared');
  };

  const handleSelectItem = (productId) => {
    setSelectedItems(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(productId => {
      dispatch(removeFromWishlist(productId));
    });
    setSelectedItems([]);
    toast.success(`${selectedItems.length} items removed from wishlist`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const WishlistItem = ({ product, isGridView = true }) => {
    const isSelected = selectedItems.includes(product._id);
    const totalStock = getTotalStock(product);
    const stockStatus = getStockStatus(product);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
          isGridView ? 'flex flex-col' : 'flex flex-row'
        }`}
      >
        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleSelectItem(product._id)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
        </div>

        {/* Remove Button */}
        <button
          onClick={() => handleRemoveFromWishlist(product._id)}
          className="absolute top-3 right-3 z-10 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
          aria-label="Remove from wishlist"
        >
          <FiX size={16} />
        </button>

        {/* Product Image */}
        <div className={`relative ${isGridView ? 'w-full h-48' : 'w-48 h-full'}`}>
          <Link to={`/products/${product._id}`}>
            <img
              src={product.images?.[0] || '/placeholder-image.jpg'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </Link>
          {product.salePrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`p-4 ${isGridView ? 'flex-1' : 'flex-1 flex flex-col justify-center'}`}>
          <Link to={`/products/${product._id}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
              {product.name}
            </h3>
          </Link>
          
          {product.brand && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {product.brand}
            </p>
          )}
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-3">
            {product.totalStock > 0 ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Out of Stock
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-2 mt-auto ${isGridView ? 'flex-col' : 'flex-row'}`}>
            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.totalStock === 0}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <FiShoppingCart size={16} />
              Add to Cart
            </button>
            
            <Link
              to={`/products/${product._id}`}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <FiPackage size={16} />
              View Details
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  const EmptyWishlist = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16"
    >
      <FiHeart size={80} className="mx-auto text-gray-400 dark:text-gray-600 mb-6" />
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Your wishlist is empty
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Start adding items to your wishlist to save them for later. You can add items from any product page.
      </p>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
      >
        <FiShoppingBag size={20} />
        Shop Now
      </Link>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>My Wishlist - CaperSports</title>
        <meta name="description" content="Your saved items and wishlist" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
            >
              My Wishlist
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-400">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          {wishlistItems.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <>
              {/* Filters and Controls */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <FiSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search wishlist..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-3 items-center">
                    {/* Category Filter */}
                    {categories.length > 0 && (
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    )}

                    {/* Sort By */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="dateAdded">Date Added</option>
                      <option value="name">Name A-Z</option>
                      <option value="price">Price Low-High</option>
                      <option value="priceDesc">Price High-Low</option>
                      <option value="brand">Brand</option>
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        <FiGrid size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        <FiList size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedItems.length} items selected
                      </span>
                      <button
                        onClick={handleRemoveSelected}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                      >
                        <FiTrash2 size={16} />
                        Remove Selected
                      </button>
                    </div>
                  </div>
                )}

                {/* Clear Wishlist Button */}
                {wishlistItems.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setShowClearModal(true)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    >
                      <FiTrash2 size={16} />
                      Clear Wishlist
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist Items */}
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <FiSearch size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No items found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className={`${viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                  : 'space-y-4'
                }`}>
                  {filteredItems.map((product) => (
                    <WishlistItem 
                      key={product._id} 
                      product={product} 
                      isGridView={viewMode === 'grid'}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Clear Wishlist Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Clear Wishlist
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to clear your entire wishlist? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleClearWishlist}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Clear Wishlist
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Wishlist;
