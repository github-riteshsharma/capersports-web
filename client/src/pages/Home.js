import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Components
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import AnimatedCounter from '../components/common/AnimatedCounter';

// Icons
import { FiArrowRight, FiPlay, FiStar, FiAward, FiZap, FiTarget } from 'react-icons/fi';

// Store
import { getFeaturedProducts } from '../store/slices/productSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getFeaturedProducts(8));
  }, [dispatch]);

  // Apple-inspired smooth animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Nike-inspired features with performance focus
  const features = [
    {
      icon: FiZap,
      title: 'Performance First',
      description: 'Engineered for peak athletic performance with cutting-edge technology.',
    },
    {
      icon: FiAward,
      title: 'Athlete Approved',
      description: 'Tested and trusted by professional athletes worldwide.',
    },
    {
      icon: FiTarget,
      title: 'Precision Fit',
      description: 'Tailored for optimal comfort and movement in every sport.',
    },
  ];

  // Product categories with athletic focus
  const categories = [
    {
      name: 'Running',
      tagline: 'Run Your World',
      image: '/images/categories/running.jpg',
      link: '/products?category=Running',
    },
    {
      name: 'Training',
      tagline: 'No Limits',
      image: '/images/categories/training.jpg',
      link: '/products?category=Training',
    },
    {
      name: 'Lifestyle',
      tagline: 'Sport Meets Style',
      image: '/images/categories/lifestyle.jpg',
      link: '/products?category=Lifestyle',
    },
  ];

  return (
    <>
      <Helmet>
        <title>CaperSports - Just Do It. Premium Athletic Performance</title>
        <meta name="description" content="Unleash your potential with CaperSports premium athletic wear. Engineered for champions, designed for victory." />
        <meta name="keywords" content="athletic performance, sports clothing, nike style, apple design, premium sportswear" />
        <link rel="canonical" href="https://capersports.com" />
      </Helmet>

      <div className="min-h-screen font-sans">
        {/* Hero Section - Apple Minimalism + Nike Bold */}
        <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
          {/* Background Video Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />
          
          {/* Athletic imagery overlay */}
          <div className="absolute inset-0 opacity-20">
            <img 
              src="/images/athlete-hero.jpg" 
              alt="Athletic Performance" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          
          {/* Enhanced Athletic Player Animations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Elite Basketball Player - Left side */}
            <motion.div
              className="absolute left-8 md:left-16 top-1/2 transform -translate-y-1/2"
              animate={{
                y: [-25, -95, -25],
                rotate: [0, 12, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0
              }}
              whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
            >
              <div className="relative">
                <svg width="80" height="100" viewBox="0 0 80 100" className="text-white/50 hover:text-white/80 transition-all duration-500 filter drop-shadow-lg">
                  <defs>
                    <linearGradient id="playerGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <g fill="url(#playerGradient1)">
                    {/* Head with hair */}
                    <circle cx="40" cy="18" r="12" />
                    <path d="M28 12 Q40 8 52 12 Q48 6 40 6 Q32 6 28 12" fill="currentColor" opacity="0.6" />
                    {/* Athletic jersey */}
                    <rect x="32" y="26" width="16" height="32" rx="4" />
                    <rect x="30" y="28" width="20" height="4" rx="2" opacity="0.7" />
                    {/* Muscular arms in shooting position */}
                    <ellipse cx="22" cy="35" rx="6" ry="12" transform="rotate(-25 22 35)" />
                    <ellipse cx="58" cy="35" rx="6" ry="12" transform="rotate(25 58 35)" />
                    {/* Basketball */}
                    <circle cx="65" cy="25" r="6" fill="#ff6b35" opacity="0.8" />
                    <path d="M59 25 Q65 20 71 25 M59 25 Q65 30 71 25 M65 19 L65 31" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
                    {/* Athletic shorts */}
                    <rect x="34" y="54" width="12" height="16" rx="3" />
                    {/* Powerful legs in jumping position */}
                    <ellipse cx="36" cy="75" rx="5" ry="18" transform="rotate(-12 36 75)" />
                    <ellipse cx="44" cy="75" rx="5" ry="18" transform="rotate(12 44 75)" />
                    {/* Athletic shoes */}
                    <ellipse cx="30" cy="95" rx="8" ry="4" transform="rotate(-12 30 95)" fill="#3b82f6" />
                    <ellipse cx="50" cy="95" rx="8" ry="4" transform="rotate(12 50 95)" fill="#3b82f6" />
                  </g>
                </svg>
                {/* Energy trail effect */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-transparent rounded-full blur-xl"
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
            
            {/* Pro Soccer Player - Right side */}
            <motion.div
              className="absolute right-8 md:right-16 top-1/3 transform -translate-y-1/2"
              animate={{
                y: [-35, -110, -35],
                rotate: [0, -18, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 1
              }}
              whileHover={{ scale: 1.25, transition: { duration: 0.3 } }}
            >
              <div className="relative">
                <svg width="90" height="110" viewBox="0 0 90 110" className="text-red-500/60 hover:text-red-400/90 transition-all duration-500 filter drop-shadow-xl">
                  <defs>
                    <linearGradient id="playerGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  <g fill="url(#playerGradient2)">
                    {/* Head with dynamic hair */}
                    <circle cx="45" cy="20" r="14" />
                    <path d="M30 14 Q45 8 60 14 Q55 6 45 6 Q35 6 30 14" fill="currentColor" opacity="0.7" />
                    {/* Soccer jersey */}
                    <rect x="36" y="30" width="18" height="35" rx="5" />
                    <rect x="34" y="32" width="22" height="5" rx="2" opacity="0.8" />
                    {/* Dynamic arms in running motion */}
                    <ellipse cx="25" cy="42" rx="7" ry="15" transform="rotate(-35 25 42)" />
                    <ellipse cx="65" cy="42" rx="7" ry="15" transform="rotate(35 65 42)" />
                    {/* Soccer ball */}
                    <circle cx="75" cy="85" r="7" fill="#ffffff" opacity="0.9" />
                    <path d="M68 85 L82 85 M75 78 L75 92 M70 80 L80 90 M80 80 L70 90" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                    {/* Athletic shorts */}
                    <rect x="38" y="60" width="14" height="18" rx="4" />
                    {/* Powerful legs in kicking motion */}
                    <ellipse cx="40" cy="85" rx="6" ry="20" transform="rotate(-15 40 85)" />
                    <ellipse cx="50" cy="85" rx="6" ry="20" transform="rotate(25 50 85)" />
                    {/* Soccer cleats */}
                    <ellipse cx="32" cy="108" rx="10" ry="5" transform="rotate(-15 32 108)" fill="#000000" />
                    <ellipse cx="58" cy="108" rx="10" ry="5" transform="rotate(25 58 108)" fill="#000000" />
                  </g>
                </svg>
                {/* Energy trail effect */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-l from-red-500/25 to-transparent rounded-full blur-xl"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.4, 1]
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </div>
            </motion.div>
            
            {/* Elite Runner - Center background */}
            <motion.div
              className="absolute left-1/2 top-3/4 transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                y: [-45, -130, -45],
                rotate: [0, 25, 0],
                scale: [1, 1.25, 1],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 2
              }}
              whileHover={{ scale: 1.3, transition: { duration: 0.3 } }}
            >
              <div className="relative">
                <svg width="70" height="90" viewBox="0 0 70 90" className="text-yellow-400/50 hover:text-yellow-300/80 transition-all duration-500 filter drop-shadow-lg">
                  <defs>
                    <linearGradient id="playerGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <g fill="url(#playerGradient3)">
                    {/* Head */}
                    <circle cx="35" cy="15" r="10" />
                    {/* Running tank top */}
                    <rect x="28" y="22" width="14" height="25" rx="3" />
                    {/* Arms in running motion */}
                    <ellipse cx="18" cy="32" rx="5" ry="12" transform="rotate(-45 18 32)" />
                    <ellipse cx="52" cy="32" rx="5" ry="12" transform="rotate(45 52 32)" />
                    {/* Running shorts */}
                    <rect x="30" y="43" width="10" height="12" rx="2" />
                    {/* Legs in sprint position */}
                    <ellipse cx="32" cy="65" rx="4" ry="16" transform="rotate(-20 32 65)" />
                    <ellipse cx="38" cy="65" rx="4" ry="16" transform="rotate(30 38 65)" />
                    {/* Running shoes */}
                    <ellipse cx="26" cy="85" rx="6" ry="3" transform="rotate(-20 26 85)" fill="#ef4444" />
                    <ellipse cx="44" cy="85" rx="6" ry="3" transform="rotate(30 44 85)" fill="#ef4444" />
                  </g>
                </svg>
                {/* Speed lines effect */}
                <motion.div
                  className="absolute -inset-6 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent rounded-full blur-lg"
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                    scaleX: [1, 1.8, 1]
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                />
              </div>
            </motion.div>
            
            {/* Dynamic sports elements */}
            <motion.div
              className="absolute left-1/4 top-1/4"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30" className="text-yellow-400/30">
                <circle cx="15" cy="15" r="12" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                <circle cx="15" cy="15" r="3" fill="currentColor" />
              </svg>
            </motion.div>
            
            <motion.div
              className="absolute right-1/4 top-3/4"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "linear",
                delay: 2
              }}
            >
              <svg width="25" height="25" viewBox="0 0 25 25" className="text-primary-400/40">
                <polygon points="12.5,2 16,10 24,10 18,16 20,24 12.5,20 5,24 7,16 1,10 9,10" fill="currentColor" />
              </svg>
            </motion.div>
          </div>
          
          <motion.div
            className="relative z-10 text-center max-w-5xl mx-auto px-4"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            {/* Apple-style clean typography with Nike energy */}
            <motion.div
              className="mb-8"
              variants={fadeInUp}
            >
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-4 leading-none tracking-tight" 
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>
                <span className="block text-white mb-2">PUSH</span>
                <span className="block bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">BEYOND</span>
              </h1>
              <p className="text-2xl md:text-3xl font-light text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
                 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                Engineered for athletes who refuse to settle. 
                <br className="hidden md:block" />
                Performance meets perfection.
              </p>
            </motion.div>
            
            {/* Nike-style call-to-action */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Button
                  as={Link}
                  to="/products"
                  className="bg-white text-black hover:bg-gray-100 px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 shadow-2xl relative overflow-hidden"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
                >
                  <span className="relative z-10 flex items-center">
                    Shop Now
                    <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Button
                  as={Link}
                  to="#featured"
                  className="border-2 border-white text-white hover:bg-white hover:text-black px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 backdrop-blur-sm"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
                >
                  <span className="flex items-center">
                    <FiPlay className="mr-3 group-hover:scale-110 transition-transform" />
                    Watch Story
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Elite Performance Statistics */}
        <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-red-100 bg-clip-text text-transparent"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>
                ELITE PERFORMANCE
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto"
                 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                Trusted by champions worldwide. Numbers that speak for themselves.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Statistic 1 - Athletes */}
              <motion.div
                className="text-center group"
                variants={scaleIn}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div className="relative">
                  <motion.div
                    className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <AnimatedCounter end={50000} duration={2000} suffix="+" />
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-300 mb-2"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                    Elite Athletes
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Professional athletes trust our gear
                  </p>
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-blue-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>

              {/* Statistic 2 - Countries */}
              <motion.div
                className="text-center group"
                variants={scaleIn}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div className="relative">
                  <motion.div
                    className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-b from-red-400 to-red-600 bg-clip-text text-transparent"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <AnimatedCounter end={120} duration={2000} suffix="+" />
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-300 mb-2"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                    Countries
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Global reach across continents
                  </p>
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-red-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>

              {/* Statistic 3 - Championships */}
              <motion.div
                className="text-center group"
                variants={scaleIn}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div className="relative">
                  <motion.div
                    className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-b from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <AnimatedCounter end={2500} duration={2000} suffix="+" />
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-300 mb-2"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                    Championships
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Victories powered by our gear
                  </p>
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-yellow-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>

              {/* Statistic 4 - Performance Boost */}
              <motion.div
                className="text-center group"
                variants={scaleIn}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div className="relative">
                  <motion.div
                    className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-b from-green-400 to-emerald-600 bg-clip-text text-transparent"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <AnimatedCounter end={23} duration={2000} suffix="%" />
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-300 mb-2"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                    Performance Boost
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Average improvement in athlete performance
                  </p>
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-green-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            </motion.div>

            {/* Floating achievement badges */}
            <div className="absolute top-10 left-10 opacity-20">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <FiAward className="text-yellow-400 text-4xl" />
              </motion.div>
            </div>
            
            <div className="absolute top-20 right-20 opacity-15">
              <motion.div
                animate={{
                  rotate: [360, 0],
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2
                }}
              >
                <FiTarget className="text-blue-400 text-5xl" />
              </motion.div>
            </div>

            <div className="absolute bottom-10 left-1/4 opacity-10">
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FiZap className="text-red-400 text-6xl" />
              </motion.div>
            </div>
          </div>

          {/* Background gradient effects */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-2xl" />
          </div>
        </section>

        {/* Nike-style bold statement section */}
        <section className="py-32 bg-red-500 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight" 
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>
                CHAMPIONS
                <span className="block text-white/80">CHOOSE US</span>
              </h2>
              <p className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto" 
                 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                Every champion needs the right gear. We provide the tools for greatness.
              </p>
            </motion.div>
          </div>
          
          {/* Geometric background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-2xl" />
        </section>

        {/* Apple-style feature showcase */}
        <section className="py-32 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center mb-20"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white" 
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>
                Engineered for Excellence
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-light" 
                 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                Every detail matters when performance is everything.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  variants={scaleIn}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white" 
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed" 
                     style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
                variants={fadeInUp}
              >
                Featured Products
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                Discover our handpicked selection of premium sports clothing and gear.
              </motion.p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center">
                <LoadingSpinner size="lg" text="Loading featured products..." />
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {featuredProducts.map((product) => (
                  <motion.div key={product._id} variants={scaleIn}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div
              className="text-center mt-12"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Button
                as={Link}
                to="/products"
                size="lg"
                className="px-8 py-4 text-lg"
              >
                View All Products
                <FiArrowRight className="ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>







        {/* Apple-style Newsletter */}
        <section className="py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white" 
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>
                Stay Connected
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-light mb-12" 
                 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                Get exclusive access to new releases, athlete stories, and performance tips.
              </p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                variants={fadeInUp}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 bg-white border-2 border-gray-200 focus:border-black focus:outline-none transition-colors duration-300 text-lg"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg text-lg"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
                  >
                    Subscribe
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
