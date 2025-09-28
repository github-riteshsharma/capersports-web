import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone, FiArrowRight, FiShield, FiCheck } from 'react-icons/fi';

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
      navigate('/', { replace: true });
      toast.success('Welcome to CaperSports!');
    } catch (error) {
      toast.error(error || 'Registration failed');
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
        <title>Sign Up - CaperSports</title>
        <meta name="description" content="Create your CaperSports account" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/3 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-700 to-blue-600 relative overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            <motion.div 
              className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl"
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
              className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-xl"
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
                  Join the<br />
                  <span className="bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                    CaperSports Family
                  </span>
                </h1>
                <p className="text-xl text-red-100 max-w-md leading-relaxed">
                  Start your journey to athletic excellence with premium gear and expert guidance.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col items-center space-y-4 text-red-100"
              >
                <div className="flex items-center space-x-3">
                  <FiCheck className="w-5 h-5" />
                  <span>Free shipping on orders over ₹2000</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiCheck className="w-5 h-5" />
                  <span>30-day return guarantee</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiCheck className="w-5 h-5" />
                  <span>Exclusive member discounts</span>
                </div>
              </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
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
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  CaperSports
                </span>
              </Link>
              
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Join thousands of athletes worldwide
              </p>
            </motion.div>

            {/* Form */}
            <form 
              className="space-y-6" 
              onSubmit={handleSubmit}
            >
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
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

              <FloatingLabelInput
                icon={FiPhone}
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocusedField('phone')}
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
                    w-full h-14 bg-gradient-to-r from-red-600 to-blue-600 
                    text-white font-bold text-lg rounded-2xl
                    hover:from-red-700 hover:to-blue-700
                    focus:outline-none focus:ring-4 focus:ring-red-500/30
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300 ease-out
                    flex items-center justify-center space-x-2
                    group relative overflow-hidden
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
