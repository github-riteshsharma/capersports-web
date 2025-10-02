import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone, FiArrowRight, FiShield, FiCheck, FiHome } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

// Store
import { register, clearError } from '../../store/slices/authSlice';

// Components
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// FloatingLabelInput component moved outside to prevent re-creation on each render
const FloatingLabelInput = ({ icon: Icon, label, type = 'text', name, value, onChange, onFocus, onBlur, showToggle, onToggleShow, className = '' }) => {
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
    <div className={`relative group ${className}`}>
      <div className="relative">
        <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-colors ${
          isFocused ? 'text-blue-500' : 'text-gray-400'
        }`} size={20} />
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full h-14 pl-12 pr-12 pt-5 pb-2 
            bg-white dark:bg-gray-800 
            border-2 border-gray-200 dark:border-gray-700 rounded-xl 
            text-gray-900 dark:text-white text-base font-medium
            focus:outline-none
            placeholder-transparent
            transition-all duration-200
            ${
              isFocused 
                ? 'border-blue-500 dark:border-blue-400' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }
          `}
          placeholder={label}
        />
        
        <label
          className={`
            absolute left-12 pointer-events-none
            ${
              isFloating
                ? 'top-2 text-xs font-semibold text-blue-500'
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

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the Terms and Conditions');
      return;
    }

    try {
      await dispatch(register(formData)).unwrap();
      toast.success('Welcome to Caper Sports!', { toastId: 'register-success' });
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      toast.error(error || 'Registration failed', { toastId: 'register-error' });
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


  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <>
      <Helmet>
        <title>Sign Up - Caper Sports</title>
        <meta name="description" content="Create your Caper Sports account" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-red-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row lg:p-4">
        {/* Left Side - Illustration/Branding */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-400 via-blue-300 to-red-400 relative overflow-hidden items-center justify-center p-12 rounded-3xl shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative circles */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute top-1/3 right-10 w-16 h-16 bg-white/5 rounded-full" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-8 max-w-lg">
            {/* Logo */}
            <Link to="/">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-2xl mb-8 cursor-pointer"
              >
                <span className="text-4xl font-black bg-gradient-to-br from-blue-500 to-red-500 bg-clip-text text-transparent">C</span>
              </motion.div>
            </Link>

            {/*Illustration placeholder - using geometric shapes */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative w-full h-64 flex items-center justify-center"
            >
              <div className="relative w-48 h-48">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border-4 border-white/20 border-b-white/60 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                    <FiUser className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold text-white">
                Join Caper Sports
              </h1>
              <p className="text-xl text-white/80">
                Start your athletic journey with premium gear and expert guidance
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex justify-center gap-8 pt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-white/70">Athletes</div>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-white/70">Products</div>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-sm text-white/70">Satisfaction</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-6 sm:p-8 lg:p-12 overflow-y-auto min-h-screen lg:min-h-0 bg-gray-50/30 dark:bg-gray-900/30">
          <motion.div 
            className="w-full max-w-md py-8 lg:py-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div 
              className="mb-8"
              variants={itemVariants}
            >
              <Link to="/" className="lg:hidden flex items-center space-x-2 mb-8 hover:scale-105 transition-transform duration-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-red-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Caper Sports
                </span>
              </Link>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up to get started
              </p>
            </motion.div>

            {/* Form */}
            <form 
              className="space-y-4 sm:space-y-5" 
              onSubmit={handleSubmit}
            >
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingLabelInput
                  icon={FiUser}
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                />
                <FloatingLabelInput
                  icon={FiUser}
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

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

              <div className="space-y-2">
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <motion.div 
                    className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password Strength
                      </span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength < 2 ? 'text-red-600' :
                        passwordStrength < 4 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength 
                              ? strengthColors[Math.min(passwordStrength - 1, 4)] 
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <FloatingLabelInput
                icon={FiLock}
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                showToggle
                onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              {/* Terms Agreement */}
              <motion.div 
                className="flex items-start space-x-3"
                variants={itemVariants}
              >
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500 focus:ring-2 mt-0.5"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="font-semibold text-red-600 hover:text-red-700 transition-colors duration-200">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-semibold text-red-600 hover:text-red-700 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading || !agreedToTerms}
                  onClick={handleSubmit}
                  className="
                    w-full h-14 bg-gradient-to-r from-blue-500 to-red-500
                    text-white font-semibold text-lg rounded-xl
                    hover:from-blue-600 hover:to-red-600
                    hover:shadow-lg
                    focus:outline-none focus:ring-4 focus:ring-blue-500/30
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 ease-out
                    flex items-center justify-center space-x-2
                  "
                  whileHover={{ scale: agreedToTerms ? 1.02 : 1 }}
                  whileTap={{ scale: agreedToTerms ? 0.98 : 1 }}
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
                        <span>Creating account...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="create"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <span>Create Account</span>
                        <motion.div
                          animate={{ x: isHovered && agreedToTerms ? 4 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiArrowRight className="w-5 h-5" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>

              {/* Divider */}
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
                </div>
              </motion.div>

              {/* Google Sign Up */}
              <motion.div variants={itemVariants}>
                <button
                  type="button"
                  onClick={() => toast.info('Google OAuth coming soon!')}
                  className="w-full h-14 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <FcGoogle className="w-6 h-6" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Sign up with Google</span>
                </button>
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

              {/* Sign In Link */}
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Register;
