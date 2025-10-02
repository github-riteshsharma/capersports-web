import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

// Icons
import { 
  FiSearch, 
  FiShoppingCart, 
  FiHeart, 
  FiUser, 
  FiMenu, 
  FiX,
  FiSun,
  FiMoon,
  FiSettings,
  FiLogOut,
  FiPackage,
  FiHome,
  FiGrid,
  FiMail,
  FiInfo
} from 'react-icons/fi';

// Components
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

// Store
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/uiSlice';
import { getCart } from '../../store/slices/cartSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const { totalItems, items } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  // Debug cart and wishlist state
  console.log('Navbar state:', { 
    cartItems: totalItems, 
    wishlistItems: wishlistItems?.length || 0 
  });
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get cart data on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const navigation = [
    { name: 'Home', href: '/', icon: FiHome },
    { name: 'Products', href: '/products', icon: FiGrid },
    { name: 'About', href: '/about', icon: FiInfo },
    { name: 'Contact', href: '/contact', icon: FiMail },
  ];

  const userNavigation = [
    { name: 'Profile', href: '/profile', icon: FiUser },
    { name: 'Orders', href: '/orders', icon: FiPackage },
    { name: 'Wishlist', href: '/wishlist', icon: FiHeart },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg' 
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              {/* Custom CaperSports Logo */}
              <motion.div
                className="w-10 h-10 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src="/images/capersports-logo.png"
                  alt="CaperSports Logo"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    // Fallback to branded text logo if image fails to load
                    e.target.style.display = 'none';
                    const fallback = e.target.parentElement.querySelector('.logo-fallback');
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                {/* Fallback Logo */}
                <div className="logo-fallback w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center" style={{ display: 'none' }}>
                  <span className="text-white font-bold text-xl">CS</span>
                </div>
              </motion.div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                CaperSports
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Expands inline */}
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.form
                  key="search-form"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSearch}
                  className="flex items-center"
                >
                  <div className="relative flex items-center">
                    <FiSearch className="absolute left-3 text-gray-400 z-10" size={18} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white bg-white transition-all"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.button
                  key="search-button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  <FiSearch size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                <FiHeart size={20} />
                {wishlistItems?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span 
                      className={`text-white text-sm font-medium ${user?.avatar ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
                      style={{ display: user?.avatar ? 'none' : 'flex' }}
                    >
                      {user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.firstName || 'User'}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <item.icon className="mr-3" size={16} />
                          {item.name}
                        </Link>
                      ))}
                      
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <FiSettings className="mr-3" size={16} />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <FiLogOut className="mr-3" size={16} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Sign In
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Sign Up
                </Button>
                <Link
                  to="/login"
                  className="sm:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  <FiUser size={20} />
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="mr-3" size={18} />
                  {item.name}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-2 space-y-1">
                  <Link
                    to="/login"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                  >
                    <FiUser className="mr-3" size={18} />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                  >
                    <FiUser className="mr-3" size={18} />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
