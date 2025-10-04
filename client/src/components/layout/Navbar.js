import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

// Icons
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX,
  FiSettings,
  FiLogOut,
  FiPackage,
  FiHeart
} from 'react-icons/fi';

// Store
import { logout } from '../../store/slices/authSlice';
import { getCart } from '../../store/slices/cartSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);

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
  }, [location.pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isProfileOpen]);

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
      setSearchQuery('');
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const userNavigation = [
    { name: 'Profile', href: '/profile', icon: FiUser },
    { name: 'Orders', href: '/orders', icon: FiPackage },
    { name: 'Wishlist', href: '/wishlist', icon: FiHeart },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-4 group">
              <motion.div
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <img
                    src="/images/logo.png"
                    alt="Caper Sports"
                    className="h-16 w-auto object-contain"
                    onError={(e) => {
                      e.target.src = "/images/capersports-logo.png";
                      e.target.onerror = (err) => {
                        err.target.style.display = 'none';
                        const fallback = err.target.parentElement.parentElement.querySelector('.logo-fallback');
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      };
                    }}
                  />
                </div>
                {/* Brand Text - Desktop Only */}
                <div className="hidden lg:flex flex-col">
                  <span className="text-2xl font-black bg-gradient-to-r from-red-600 via-red-700 to-blue-700 bg-clip-text text-transparent tracking-tight leading-none">
                    CAPER SPORTS
                  </span>
                </div>
                {/* Fallback Logo */}
                <div className="logo-fallback hidden items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">CS</span>
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-2xl font-black bg-gradient-to-r from-red-600 via-red-700 to-blue-700 bg-clip-text text-transparent tracking-tight leading-none">
                      CAPER SPORTS
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative text-sm font-medium transition-all duration-200 group ${
                  location.pathname === item.href
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {location.pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center">
              <form onSubmit={handleSearch} className="relative group">
                <motion.div 
                  className="relative bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300 focus-within:border-red-400 focus-within:shadow-lg focus-within:shadow-red-100/50"
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-red-500 transition-colors duration-300">
                    <div className="relative">
                      <FiSearch className="text-gray-400 group-focus-within:text-red-500 transition-colors duration-300" size={18} />
                      {/* Premium search icon glow */}
                      <div className="absolute inset-0 bg-red-500/20 rounded-full blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  <motion.input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-80 pl-12 pr-6 py-3 text-sm bg-transparent border-0 rounded-full focus:outline-none placeholder-gray-400 text-gray-900 font-medium focus:placeholder-gray-300 transition-all duration-300"
                    whileFocus={{ 
                      width: "22rem"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                  {/* Premium glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </motion.div>
              </form>
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100/50 rounded-xl"
            >
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2.5 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-100/50 rounded-2xl group"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-red-600 to-blue-600 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 ring-2 ring-white">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {user?.firstName?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 py-3 overflow-hidden"
                    >
                      {/* Premium header */}
                      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-red-600 to-blue-600 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-white">
                            {user?.avatar ? (
                              <img
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-lg font-bold">
                                {user?.firstName?.charAt(0) || 'U'}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-base font-bold text-gray-900">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-medium">Online</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Navigation items */}
                      <div className="py-2">
                        {userNavigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200 group"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors duration-200">
                              <item.icon className="text-gray-500 group-hover:text-gray-700" size={18} />
                            </div>
                            <div className="flex-1">
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </Link>
                        ))}
                        
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200 group"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors duration-200">
                              <FiSettings className="text-gray-500 group-hover:text-gray-700" size={18} />
                            </div>
                            <div className="flex-1">
                              <span className="font-medium">Admin Dashboard</span>
                            </div>
                          </Link>
                        )}
                      </div>
                      
                      <hr className="my-2 border-gray-100/50" />
                      
                      <div className="px-3 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-all duration-200 group rounded-2xl"
                        >
                          <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors duration-200">
                            <FiLogOut className="text-red-500 group-hover:text-red-600" size={18} />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">Sign Out</span>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-gray-100/50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100/50 rounded-xl"
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
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
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100/50"
          >
            <div className="px-6 py-6 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="relative">
                    <FiSearch className="text-gray-400 group-focus-within:text-red-500 transition-colors duration-300" size={18} />
                    {/* Premium search icon glow */}
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 font-medium shadow-sm"
                />
              </form>

              {/* Mobile Navigation */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block py-3 text-base font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    to="/login"
                    className="block py-3 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 text-base font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200 text-center"
                  >
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
