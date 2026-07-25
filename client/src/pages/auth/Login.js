import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

// Store
import { login, clearError } from '../../store/slices/authSlice';

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Home from '../Home';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(login(formData)).unwrap();
      toast.success('Welcome back!', { 
        toastId: 'login-success',
        autoClose: 3000,
        hideProgressBar: false
      });
      const from = location.state?.from?.pathname || '/';
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    } catch (error) {
      toast.error(error || 'Login failed', { 
        toastId: 'login-error',
        autoClose: 3000,
        hideProgressBar: false
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Sign In - Caper Sports | Premium Athletic Wear</title>
        <meta name="description" content="Sign in to your Caper Sports account to shop premium athletic wear, track orders, and access exclusive deals." />
      </Helmet>

      {/* Background Content (Home Page) - Clear, no blur */}
      <div className="fixed inset-0 z-0">
        <Home />
        </div>

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
        {/* Modal Content - Optimized Dimensions */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <FiX size={18} />
          </button>

          {/* Modal Header */}
          <div className="text-center pt-8 pb-6 px-10">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="/images/logo.png"
                alt="Caper Sports Logo"
                className="h-14 w-auto object-contain"
                onError={(e) => {
                  // Fallback to CSS logo if image fails
                  e.target.style.display = 'none';
                  const fallback = e.target.nextSibling;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
              {/* Fallback Logo */}
              <div className="hidden w-16 h-16 bg-gradient-to-br from-red-600 via-red-700 to-blue-900 rounded-3xl items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">CS</span>
              </div>
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Welcome Back to Caper Sports!
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Sign in to your account to shop premium athletic wear, track your orders, and access exclusive deals.
            </p>
          </div>

          {/* Form */}
          <div className="px-10 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  Must be at least 8 characters
                  {formData.password && formData.password.length >= 8 && (
                    <span className="ml-2 text-green-600 font-medium text-xs">Strong</span>
                  )}
                </p>
              </div>

                  {/* Submit Button */}
              <button
                      type="submit"
                      disabled={loading}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-8"
              >
                        {loading ? (
                  <>
                            <LoadingSpinner size="sm" />
                    <span className="ml-2">Logging in...</span>
                  </>
                ) : (
                  'Log In'
                )}
              </button>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or Log in with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => toast.info('Google OAuth coming soon!')}
                  className="flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors duration-200"
                >
                  <FcGoogle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('Apple ID coming soon!')}
                  className="flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors duration-200"
                >
                  <FaApple className="w-5 h-5 mr-2 text-gray-900" />
                  <span className="text-sm font-medium text-gray-700">Apple ID</span>
                </button>
              </div>

                  {/* Sign Up Link */}
              <div className="text-center mt-8">
                <p className="text-gray-500 text-sm">
                  Don't have account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-gray-900 hover:text-gray-700 transition-colors underline"
                  >
                    Sign Up
                      </Link>
                    </p>
              </div>
                </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;