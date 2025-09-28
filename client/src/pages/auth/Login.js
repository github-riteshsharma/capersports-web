import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight, FiShield } from 'react-icons/fi';

// Store
import { login, clearError } from '../../store/slices/authSlice';

// Components
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
  const [focusedField, setFocusedField] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

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
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(error || 'Login failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const FloatingLabelInput = ({ icon: Icon, label, type = 'text', name, value, onChange, onFocus, onBlur, showToggle, onToggleShow }) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;
    const isFloating = isFocused || hasValue;

    const handleFocus = (e) => {
      setIsFocused(true);
      onFocus && onFocus(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      onBlur && onBlur(e);
    };

    return (
      <div className="relative group">
        <div className="relative">
          <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 ${
            isFocused ? 'text-blue-600' : 'text-gray-400'
          }`} size={20} />
          
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              w-full h-16 pl-12 pr-12 pt-6 pb-2 
              bg-white/80 backdrop-blur-sm 
              border-2 rounded-2xl 
              text-gray-900 text-lg font-medium
              focus:outline-none focus:bg-white
              placeholder-transparent
              ${
                isFocused 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
            placeholder={label}
            required
          />
          
          <label
            className={`
              absolute left-12 pointer-events-none
              ${
                isFloating
                  ? 'top-2 text-xs font-semibold text-blue-600'
                  : 'top-1/2 transform -translate-y-1/2 text-base text-gray-500'
              }
            `}
            style={{
              transition: 'all 0.15s ease-out',
              transformOrigin: 'left center'
            }}
          >
            {label}
          </label>
          
          {showToggle && (
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
              onClick={onToggleShow}
            >
              {type === 'password' ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Sign In - CaperSports</title>
        <meta name="description" content="Sign in to your CaperSports account" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/3 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 min-h-screen flex">
          {/* Left Side - Branding */}
          <motion.div 
            className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 relative overflow-hidden"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0">
              <motion.div 
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-xl"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full h-full">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md text-center text-white">
                <div className="flex flex-col items-center space-y-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6">
                    <span className="text-3xl font-black">C</span>
                  </div>
                  <h1 className="text-4xl font-black mb-4 leading-tight">
                    Welcome to<br />
                    <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      CaperSports
                    </span>
                  </h1>
                  <p className="text-xl text-blue-100 max-w-md leading-relaxed">
                    Elevate your athletic performance with premium sports gear designed for champions.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col items-center space-y-4 text-blue-100"
                >
                  <div className="flex items-center space-x-3">
                    <FiShield className="w-5 h-5" />
                    <span>Secure & Trusted Platform</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiShield className="w-5 h-5" />
                    <span>Premium Athletic Gear</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiShield className="w-5 h-5" />
                    <span>Performance Guaranteed</span>
                  </div>
                </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <motion.div 
              className="w-full max-w-md"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Header */}
              <motion.div 
                className="text-center mb-8"
                variants={itemVariants}
              >
                <Link to="/" className="lg:hidden flex items-center justify-center space-x-2 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-red-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">C</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    CaperSports
                  </span>
                </Link>
                
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Sign in to continue your athletic journey
                </p>
              </motion.div>

              {/* Form */}
              <form 
                className="space-y-6" 
                onSubmit={handleSubmit}
              >
                <FloatingLabelInput
                  icon={FiMail}
                  label="Email address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />

                <FloatingLabelInput
                  icon={FiLock}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  showToggle
                  onToggleShow={() => setShowPassword(!showPassword)}
                />

                {/* Options */}
                <motion.div 
                  className="flex items-center justify-between"
                  variants={itemVariants}
                >
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="
                      w-full h-14 bg-gradient-to-r from-blue-600 to-red-600 
                      text-white font-bold text-lg rounded-2xl
                      hover:from-blue-700 hover:to-red-700
                      focus:outline-none focus:ring-4 focus:ring-blue-500/30
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-300 ease-out
                      flex items-center justify-center space-x-2
                      group relative overflow-hidden
                    "
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center space-x-2"
                        >
                          <LoadingSpinner size="sm" />
                          <span>Signing in...</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="signin"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center space-x-2"
                        >
                          <span>Sign In</span>
                          <motion.div
                            animate={{ x: isHovered ? 4 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiArrowRight className="w-5 h-5" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sign Up Link */}
                <motion.div 
                  className="text-center"
                  variants={itemVariants}
                >
                  <p className="text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      Sign up
                    </Link>
                  </p>
                </motion.div>

                {/* Demo Accounts */}
                <motion.div 
                  className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  variants={itemVariants}
                >
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Demo Accounts
                  </p>
                  <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <p>Admin: admin@capersports.com / admin123</p>
                    <p>User: john@example.com / password123</p>
                  </div>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
