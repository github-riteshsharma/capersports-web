import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

// Store
import { register, clearError } from '../../store/slices/authSlice';

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Home from '../Home';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+1'); // Default to US
  const [passwordStrength, setPasswordStrength] = useState('');

  // Common country codes
  const countryCodes = [
    { code: '+1', country: 'US', flag: '🇺🇸' },
    { code: '+1', country: 'CA', flag: '🇨🇦' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+33', country: 'FR', flag: '🇫🇷' },
    { code: '+81', country: 'JP', flag: '🇯🇵' },
    { code: '+82', country: 'KR', flag: '🇰🇷' },
    { code: '+61', country: 'AU', flag: '🇦🇺' },
    { code: '+55', country: 'BR', flag: '🇧🇷' },
    { code: '+7', country: 'RU', flag: '🇷🇺' },
    { code: '+34', country: 'ES', flag: '🇪🇸' },
    { code: '+39', country: 'IT', flag: '🇮🇹' },
    { code: '+31', country: 'NL', flag: '🇳🇱' },
  ];

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

  // Password strength checker
  useEffect(() => {
    const password = formData.password;
    if (password.length === 0) {
      setPasswordStrength('');
    } else if (password.length < 8) {
      setPasswordStrength('Weak');
    } else if (password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordStrength('Strong');
    } else {
      setPasswordStrength('Medium');
    }
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const registrationData = {
        ...formData,
        mobile: `${countryCode}${formData.mobile}` // Combine country code with mobile number
      };
      await dispatch(register(registrationData)).unwrap();
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

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Create Account - Caper Sports | Premium Athletic Wear</title>
        <meta name="description" content="Join Caper Sports to shop premium athletic wear, enjoy faster checkout, and get access to exclusive member benefits." />
      </Helmet>

      {/* Background Content (Home Page) - Clear, no blur */}
      <div className="fixed inset-0 z-0">
        <Home />
      </div>
      
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
        {/* Modal Content - Optimized Dimensions */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative overflow-hidden"
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
          <div className="text-center pt-6 pb-4 px-10">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img
                src="/images/logo.png"
                alt="Caper Sports Logo"
                className="h-12 w-auto object-contain"
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
              Join Caper Sports!
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Create your account to shop premium athletic wear, enjoy faster checkout, and get access to exclusive member benefits.
            </p>
          </div>

          {/* Form */}
          <div className="px-10 pb-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200"
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
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters
                  </p>
                  {passwordStrength && (
                    <span className={`text-xs font-medium ${
                      passwordStrength === 'Strong' ? 'text-green-600' :
                      passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength}
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile Number Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="flex gap-3">
                  {/* Country Code Dropdown */}
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-24 px-3 py-3 bg-gray-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                    >
                      {countryCodes.map((country, index) => (
                        <option key={index} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Mobile Number Input */}
                  <div className="flex-1">
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="123 456 7890"
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll send you a verification code
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Creating account...</span>
                  </>
                ) : (
                  'Register'
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
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or Register with</span>
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

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-gray-500 text-sm">
                  Already have account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-gray-900 hover:text-gray-700 transition-colors underline"
                  >
                    Log In
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

export default Register;
