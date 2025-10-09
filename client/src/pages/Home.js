import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiArrowRight, FiHeart, FiEye, FiCheck, FiChevronLeft, FiChevronRight, FiMessageCircle, FiEdit, FiSettings, FiTruck, FiInstagram, FiMoreHorizontal, FiPackage } from 'react-icons/fi';

// Components
import ProductCard from '../components/products/ProductCard';
import CaperSportsLoader from '../components/common/CaperSportsLoader';

// Services
import instagramService from '../services/instagramService';

// Store
import { getFeaturedProducts } from '../store/slices/productSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featuredProducts, loading } = useSelector((state) => state.products);
  
  // Order Process Interactive State
  const [activeStep, setActiveStep] = useState(0);
  
  // Instagram Posts State
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [instagramLoading, setInstagramLoading] = useState(true);

  // Featured Products Carousel State
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    dispatch(getFeaturedProducts(8));
  }, [dispatch]);

  // Check scroll position for navigation buttons
  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Update scroll position when products load
  useEffect(() => {
    if (featuredProducts.length > 0) {
      checkScrollPosition();
    }
  }, [featuredProducts]);

  // Scroll carousel left
  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  // Scroll carousel right
  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  // Fetch Instagram posts on component mount
  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setInstagramLoading(true);
        const posts = await instagramService.getUserMedia(4);
        setInstagramPosts(posts);
      } catch (error) {
        console.error('Failed to fetch Instagram posts:', error);
        // Fallback posts will be used automatically by the service
      } finally {
        setInstagramLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  // Animation variants
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

  // Product showcase data with actual Caper Sports products
  const productShowcase = [
    {
      id: 1,
      title: "Sublimated Polo T-Shirts",
      category: "Premium Polo Collection",
      image: "/images/products/polo-shirts.jpg",
      description: "Professional sublimated polo shirts with custom designs"
    },
    {
      id: 2,
      title: "Premium Cricket Whites",
      category: "Cricket Collection",
      image: "/images/products/cricket-whites.jpg",
      description: "Breathable, modern fit cricket whites for ultimate comfort"
    },
    {
      id: 3,
      title: "Custom Team Jerseys",
      category: "Team Wear",
      image: "/images/products/team-jerseys.jpg",
      description: "Unique custom jerseys that give your team a different look"
    },
    {
      id: 4,
      title: "Sports Apparel",
      category: "Athletic Wear",
      image: "/images/products/sports-wear.jpg",
      description: "High-performance sportswear for all athletic activities"
    }
  ];

  // Customer testimonials with famous personalities and teams
  const testimonials = [
    {
      id: 1,
      quote: "Thanks, you made the jersey very unique and gave it a different look. Even though we won the first match.",
      team: "Abu Halifa Blasters",
      image: "/images/testimonials/testimonials1.png",
      sport: "Cricket",
      type: "team"
    },
    {
      id: 2,
      quote: "Outstanding quality and professional service. Our team looks amazing in these custom jerseys!",
      team: "Champions United",
      image: "/images/testimonials/testimonials2.png",
      sport: "Cricket",
      type: "team"
    },
    {
      id: 3,
      quote: "Caper Sports delivers exceptional quality athletic wear. Their attention to detail and premium materials make all the difference in performance.",
      name: "Chris Gayle",
      title: "Cricket Legend & Brand Ambassador",
      image: "/images/testimonials/famousPersonality1.jpg",
      sport: "Cricket",
      type: "celebrity"
    },
    {
      id: 4,
      quote: "When I'm on the field, I need gear that performs as hard as I do. Caper Sports delivers that championship quality every time.",
      name: "Professional Athlete",
      title: "Caper Sports Ambassador",
      image: "/images/testimonials/famousPersonality2.jpg",
      sport: "Basketball",
      type: "athlete"
    }
  ];

  // Product Showcase with real uploaded images
  const showcaseProducts = [
    {
      id: 1,
      title: "Premium Cricket Jersey",
      category: "Cricket Wear",
      image: "/images/showcase/showcase1.jpg",
      description: "Professional grade cricket jersey with moisture-wicking technology",
      features: ["Breathable Fabric", "Custom Design", "Team Colors"],
      price: "From $45"
    },
    {
      id: 2,
      title: "Custom Team Kit",
      category: "Team Wear", 
      image: "/images/showcase/showcase2.jpg",
      description: "Complete team uniform set with matching accessories",
      features: ["Full Team Set", "Matching Design", "Premium Quality"],
      price: "From $120"
    },
    {
      id: 3,
      title: "Athletic Performance Wear",
      category: "Performance",
      image: "/images/showcase/showcase3.jpg",
      description: "High-performance athletic wear for serious athletes",
      features: ["Performance Fabric", "Ergonomic Fit", "Durability"],
      price: "From $65"
    },
    {
      id: 4,
      title: "Sports Training Gear",
      category: "Training",
      image: "/images/showcase/showcase4.jpg",
      description: "Professional training equipment and apparel",
      features: ["Training Ready", "Comfort Fit", "Long Lasting"],
      price: "From $35"
    },
    {
      id: 5,
      title: "Championship Collection",
      category: "Premium",
      image: "/images/showcase/showcase5.jpg",
      description: "Elite collection for championship-level performance",
      features: ["Elite Quality", "Championship Grade", "Professional"],
      price: "From $85"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Caper Sports - Premium Athletic Performance Gear</title>
        <meta name="description" content="Unleash your potential with Caper Sports premium athletic wear. Engineered for champions, designed for victory." />
        <meta name="keywords" content="athletic performance, sports clothing, premium sportswear, caper sports" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Minimalistic Professional Design */}
        <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          {/* Main Content Grid */}
          <div className="relative z-10 min-h-screen flex items-center px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-24 pt-24 pb-16">
            <div className="w-full max-w-[90rem] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Content */}
            <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {/* Small Label */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-medium tracking-wider uppercase"
                  >
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <span>Trusted by Champions</span>
                  </motion.div>

                  {/* Main Heading */}
                  <div className="space-y-6">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] text-gray-900 tracking-tight"
                    >
                      Premium
                  <br />
                      <span className="relative inline-block">
                        Athletic Gear
                        <motion.div
                          className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "60%" }}
                          transition={{ delay: 1, duration: 0.8 }}
                        />
                      </span>
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg"
                    >
                      Custom designed athletic wear for teams and athletes who demand excellence in every stitch.
                    </motion.p>
              </div>
          
                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-start gap-4 pt-4"
                  >
                <motion.button
                      className="group relative bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/products')}
                >
                      <span className="flex items-center space-x-2">
                        <span>Explore Collection</span>
                        <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                </motion.button>

                    <motion.button
                      onClick={() => navigate('/contact')}
                      className="group flex items-center space-x-2 px-8 py-4 text-gray-900 font-semibold text-base hover:text-gray-600 transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <span>Get Custom Quote</span>
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="flex items-center gap-8 pt-8 border-t border-gray-200"
                  >
                    <div>
                      <div className="text-3xl font-bold text-gray-900">1000+</div>
                      <div className="text-sm text-gray-500">Happy Athletes</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">100%</div>
                      <div className="text-sm text-gray-500">Custom Made</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">10+</div>
                      <div className="text-sm text-gray-500">Years Experience</div>
              </div>
                  </motion.div>
            </motion.div>
            
                {/* Right Side - Premium Design Like Apple/Nike */}
            <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
                >
                  {/* Large Ambient Gradient Orbs */}
                  <motion.div 
                    className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
                    animate={{
                      scale: [1.2, 1, 1.2],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />

                  {/* Main Card Container */}
                  <div className="relative max-w-xl mx-auto lg:mx-0">
                    
                    {/* Decorative Accent Elements */}
                    <motion.div
                      className="absolute -top-8 -right-8 w-32 h-32 border-4 border-red-600/20 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-2xl blur-xl"
                      animate={{ rotate: [0, 180, 360] }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Premium Card with Glass Effect */}
                    <motion.div
                      className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-2 shadow-2xl shadow-black/10"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Gradient Border Effect */}
                      <div className="absolute inset-0 rounded-[2.5rem] p-[2px] bg-gradient-to-br from-red-600/50 via-purple-600/50 to-blue-600/50 -z-10"></div>
                      
                      {/* Inner Shadow Card */}
                      <div className="relative bg-white rounded-[2.3rem] p-3 shadow-inner">
                        <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          <img
                            src="/images/testimonials/famousPersonality1.jpg"
                            alt="Chris Gayle - Cricket Legend"
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.nextSibling;
                      if (fallback) {
                        fallback.style.display = 'flex';
                      }
                    }}
                  />
                  {/* Fallback */}
                          <div className="hidden absolute inset-0 w-full h-full bg-gradient-to-br from-red-500 to-blue-600 items-center justify-center">
                    <div className="text-white text-center p-4">
                              <div className="text-4xl font-bold mb-4">CAPER SPORTS</div>
                              <div className="text-xl opacity-80">Premium Athletic Gear</div>
                    </div>
                  </div>
                  
                          {/* Sophisticated Gradient Overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-blue-600/5 pointer-events-none"></div>

                          {/* Floating Top Badge - Premium Look */}
                          <motion.div
                            className="absolute top-4 left-4"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                          >
                            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-full shadow-xl backdrop-blur-sm flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-xs font-bold uppercase tracking-wider">Featured</span>
                  </div>
                          </motion.div>

                          {/* Main Info Badge - Glassmorphism */}
                          <motion.div
                            className="absolute bottom-4 left-4 right-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                          >
                            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/20 relative overflow-hidden">
                              {/* Shimmer Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                              
                              <div className="relative flex items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                    <span>Featured Athlete</span>
                                  </div>
                                  <div className="text-2xl font-black text-gray-900 mb-1">Chris Gayle</div>
                                  <div className="text-sm text-gray-600 font-semibold">Cricket Legend • Champion</div>
                                </div>
                                <div className="flex-shrink-0">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-blue-600 rounded-2xl blur-lg opacity-50"></div>
                                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 via-orange-600 to-blue-600 flex items-center justify-center shadow-2xl">
                                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                </div>
              </div>
            </motion.div>
          </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator - Minimalistic */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <motion.div
              className="flex flex-col items-center space-y-2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-300"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
              <div className="w-px h-12 bg-gradient-to-b from-gray-300 to-transparent"></div>
            </motion.div>
          </motion.div>

        </section>
            
        {/* Shop By Category Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 w-full">
          <div className="max-w-[90rem] mx-auto">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight px-4">
                  <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">Shop By Category</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                  Explore our premium collection organized by category. Find exactly what you need for your athletic performance.
              </p>
            </div>
            </motion.div>
            
            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Polo T-Shirt Category */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                onClick={() => navigate('/products?category=T-Shirts')}
                className="group relative cursor-pointer"
              >
                <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/50 backdrop-blur-sm">
                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      Popular
            </div>
                  </div>

                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                    <img
                      src="/images/Banner-5.png"
                      alt="Polo T-Shirt"
                      className="w-full h-full object-contain object-center transition-all duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-product.jpg";
                      }}
                    />
                    
                    {/* Gradient Overlays for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Category Info - Cleaner Design */}
                  <div className="p-5 bg-white/80 backdrop-blur-md">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        Polo T-Shirts
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Premium sublimated designs
                      </p>
                    </div>
                    
                    {/* Shop Now Link */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        Shop Now
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-600 flex items-center justify-center transition-all duration-300">
                        <FiArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Round Neck T-Shirt Category */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onClick={() => navigate('/products?category=T-Shirts')}
                className="group relative cursor-pointer"
              >
                <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/50 backdrop-blur-sm">
                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      Trending
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                    <img
                      src="/images/005.png"
                      alt="Round Neck T-Shirt"
                      className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-product.jpg";
                      }}
                    />
                    
                    {/* Gradient Overlays for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Category Info - Cleaner Design */}
                  <div className="p-5 bg-white/80 backdrop-blur-md">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        Round Neck T-Shirts
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Classic everyday comfort
                      </p>
                    </div>
                    
                    {/* Shop Now Link */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        Shop Now
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-600 flex items-center justify-center transition-all duration-300">
                        <FiArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
            </motion.div>

              {/* Shorts Category */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                onClick={() => navigate('/products?category=Shorts')}
                className="group relative cursor-pointer"
              >
                <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/50 backdrop-blur-sm">
                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      Best Seller
          </div>
                  </div>

                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                    <img
                      src="/shorts.png"
                      alt="Athletic Shorts"
                      className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-product.jpg";
                      }}
                    />
                    
                    {/* Gradient Overlays for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Category Info - Cleaner Design */}
                  <div className="p-5 bg-white/80 backdrop-blur-md">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        Athletic Shorts
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Performance training wear
                      </p>
                    </div>
                    
                    {/* Shop Now Link */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        Shop Now
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-600 flex items-center justify-center transition-all duration-300">
                        <FiArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Lower/Pants Category */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                onClick={() => navigate('/products?category=Pants')}
                className="group relative cursor-pointer"
              >
                <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/50 backdrop-blur-sm">
                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      Essential
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                    <img
                      src="/images/lower.png"
                      alt="Athletic Lower"
                      className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-product.jpg";
                      }}
                    />
                    
                    {/* Gradient Overlays for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Category Info - Cleaner Design */}
                  <div className="p-5 bg-white/80 backdrop-blur-md">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        Athletic Lower
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Track pants & joggers
                      </p>
                    </div>
                    
                    {/* Shop Now Link */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        Shop Now
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-600 flex items-center justify-center transition-all duration-300">
                        <FiArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* View All Products CTA */}
          <motion.div
            className="text-center mt-16"
            variants={fadeInUp}
            initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Explore Our Full Collection
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
                From custom jerseys to premium athletic wear, discover the complete range of products designed for champions like you.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>View All Products</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
          </div>
          </motion.div>
          </div>
        </section>
            
        {/* Design Showcase Gallery */}
        <section className="py-20 px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 w-full">
          <div className="max-w-[90rem] mx-auto">
            <motion.div
            className="text-center mb-16"
              variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">Our Design Showcase</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Witness the craftsmanship behind our premium athletic wear. Each design tells a story of excellence, crafted with precision and passion.
              </p>
              </div>
            </motion.div>
            
          {/* Clean Showcase Grid - 5 Cards in Single Row on Large Screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {showcaseProducts.slice(0, 5).map((product, index) => (
            <motion.div 
                key={product.id}
                className="group h-full"
              variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                  {/* Photo Section - 65% */}
                  <div className="relative h-[65%] min-h-[250px] overflow-hidden">
                    <img
                      src={product.image}
                      alt={`${product.title} - Design Showcase`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ objectPosition: 'center top' }}
                      onError={(e) => {
                        // Fallback to gradient if image fails
                        e.target.style.display = 'none';
                        const fallback = e.target.nextSibling;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                    {/* Simple Fallback */}
                    <div className={`hidden w-full h-full bg-gradient-to-br ${
                      index % 5 === 0 ? 'from-red-500 to-orange-500' :
                      index % 5 === 1 ? 'from-blue-500 to-purple-500' :
                      index % 5 === 2 ? 'from-green-500 to-teal-500' :
                      index % 5 === 3 ? 'from-purple-500 to-pink-500' :
                      'from-indigo-500 to-blue-500'
                    } items-center justify-center`}>
                      <div className="text-white text-center">
                        <div className="text-3xl font-bold mb-2">DESIGN</div>
                        <div className="text-lg opacity-80">{product.category}</div>
              </div>
                    </div>

                    {/* Simple Category Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                      <span className="text-xs font-semibold text-gray-800">{product.category}</span>
                    </div>

                    {/* Simple Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
                        <span className="text-sm font-semibold text-gray-800">Design Showcase</span>
                      </div>
                    </div>
          </div>
          
                  {/* Text Content Section - 35% */}
                  <div className="p-5 flex-1 flex flex-col h-[35%]">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-3 flex-1 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Simple Feature Tags */}
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {product.features.slice(0, 2).map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                          {feature}
                  </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
              
          {/* Simple Showcase Footer */}
              <motion.div
            className="text-center mt-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Crafted for Champions
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Each design represents countless hours of creativity, precision, and passion. 
                Our showcase demonstrates the pinnacle of athletic wear design excellence.
              </p>
              
              {/* Simple Stats */}
              <div className="grid grid-cols-3 gap-8 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">5+</div>
                  <div className="text-sm text-gray-500 font-medium">Premium Designs</div>
            </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">100%</div>
                  <div className="text-sm text-gray-500 font-medium">Custom Made</div>
          </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">∞</div>
                  <div className="text-sm text-gray-500 font-medium">Possibilities</div>
                </div>
              </div>
            </div>
            </motion.div>
            </div>
        </section>

        {/* Customer Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 w-full">
          <div className="max-w-[90rem] mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">Champions</span> Say
              </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              From professional athletes to winning teams, see why champions choose Caper Sports
              </p>
            </motion.div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {testimonials.map((testimonial, index) => (
            <motion.div
                key={testimonial.id}
                className="group"
                variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Image Section - Perfect fit without cropping */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                    <img
                      src={testimonial.image}
                      alt={testimonial.type === 'team' 
                        ? `${testimonial.team} team wearing Caper Sports gear`
                        : `${testimonial.name} wearing Caper Sports gear`
                      }
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        index === 0 ? 'scale-110' : index === 1 ? 'scale-110' : ''
                      }`}
                      style={{ 
                        objectPosition: index === 0 ? 'center right' : 
                                      index === 1 ? 'center bottom' : 
                                      'center top' 
                      }}
                      onError={(e) => {
                        // Fallback to gradient if image fails
                        e.target.style.display = 'none';
                        const fallback = e.target.nextSibling;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                    {/* Fallback */}
                    <div className={`hidden w-full h-full bg-gradient-to-br ${
                      index % 4 === 0 ? 'from-blue-500 to-green-500' :
                      index % 4 === 1 ? 'from-red-500 to-orange-500' :
                      index % 4 === 2 ? 'from-purple-500 to-pink-500' :
                      'from-indigo-500 to-blue-500'
                    } items-center justify-center`}>
                      <div className="text-white text-center">
                        <div className="text-3xl font-bold mb-2">CHAMPION</div>
                        <div className="text-lg opacity-80">
                          {testimonial.type === 'team' ? testimonial.team : testimonial.name}
                        </div>
                      </div>
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Badge */}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                      <span className="text-sm font-medium text-gray-900">
                        {testimonial.type === 'celebrity' ? '⭐ Celebrity' :
                         testimonial.type === 'athlete' ? '🏆 Pro Athlete' : '👥 Team Review'}
                  </span>
                    </div>

                    {/* Sport Badge */}
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-blue-600 text-white rounded-full px-3 py-1">
                      <span className="text-xs font-semibold">{testimonial.sport}</span>
            </div>
          </div>

                  {/* Content Section */}
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {testimonial.type === 'celebrity' ? '⭐' :
                           testimonial.type === 'athlete' ? '🏆' : '★'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">
                          {testimonial.type === 'team' ? testimonial.team : testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {testimonial.type === 'team' 
                            ? `${testimonial.sport} Team` 
                            : testimonial.title
                          }
                        </p>
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-lg">★</span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">5.0 Rating</span>
                      </div>
                      
                      {/* Verified Badge */}
                      <div className="flex items-center space-x-1 text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
              <motion.div
            className="text-center mt-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-3xl p-8 border border-red-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Join Our Champions Community
                  </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Experience the quality that professional athletes and winning teams trust. 
                Start your custom order today and become part of the Caper Sports family.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Get Your Custom Gear</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
                </div>
              </motion.div>
              </div>
        </section>

        {/* Interactive Order Process Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 w-full">
          <div className="max-w-[90rem] mx-auto">
              <motion.div
            className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
              How We Create Your <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">Perfect Gear</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Follow our streamlined process to bring your custom athletic wear to life
              </p>
              </motion.div>

          {/* Interactive Step Cards */}
          <div className="relative max-w-4xl mx-auto">
            {/* Step Indicators */}
            <div className="flex justify-center mb-12">
              <div className="flex items-center space-x-4 bg-white rounded-full p-2 shadow-lg border border-gray-100">
                {[0, 1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() => setActiveStep(step)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      activeStep === step
                        ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg scale-110'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {step + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Content Cards */}
            <div className="relative min-h-[400px] sm:min-h-[450px] lg:h-96">
              <AnimatePresence mode="wait">
                  <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="lg:absolute lg:inset-0"
                >
                  {/* Step 1: Application */}
                  {activeStep === 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 h-full flex items-center">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full">
                        <div className="space-y-4 sm:space-y-6">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                              <FiMessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Share Your Vision</h3>
                              <p className="text-blue-600 font-medium text-sm sm:text-base">Step 1 of 4</p>
                            </div>
                          </div>
                          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                            Send us your ideas, sketches, or design concepts through our contact form or WhatsApp. 
                            Our team is ready to transform your vision into reality.
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-xs sm:text-sm font-medium text-gray-700">Free Consultation</span>
                </div>
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-xs sm:text-sm font-medium text-gray-700">24/7 Support</span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden lg:flex items-center justify-center">
                          <div className="w-48 h-48 xl:w-64 xl:h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <FiMessageCircle className="w-20 h-20 xl:w-24 xl:h-24 text-white opacity-80" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Design */}
                  {activeStep === 1 && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 h-full flex items-center">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full">
                        <div className="space-y-4 sm:space-y-6">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                              <FiEdit className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Design Creation</h3>
                              <p className="text-purple-600 font-medium text-sm sm:text-base">Step 2 of 4</p>
                            </div>
                          </div>
                          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                            Our expert designers create a detailed preview of your custom gear. 
                            We'll refine every detail until it matches your perfect vision.
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-xs sm:text-sm font-medium text-gray-700">3D Preview</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-xs sm:text-sm font-medium text-gray-700">Unlimited Revisions</span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden lg:flex items-center justify-center">
                          <div className="w-48 h-48 xl:w-64 xl:h-64 bg-gradient-to-br from-purple-400 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <FiEdit className="w-20 h-20 xl:w-24 xl:h-24 text-white opacity-80" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Production */}
                  {activeStep === 2 && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 h-full flex items-center">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full">
                        <div className="space-y-4 sm:space-y-6">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                              <FiSettings className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Premium Production</h3>
                              <p className="text-green-600 font-medium text-sm sm:text-base">Step 3 of 4</p>
                            </div>
                          </div>
                          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                            Once approved, our skilled craftsmen begin manufacturing your order using 
                            premium materials and cutting-edge techniques.
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-xs sm:text-sm font-medium text-gray-700">Quality Materials</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-xs sm:text-sm font-medium text-gray-700">10-15 Days</span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden lg:flex items-center justify-center">
                          <div className="w-48 h-48 xl:w-64 xl:h-64 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <FiSettings className="w-20 h-20 xl:w-24 xl:h-24 text-white opacity-80" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Delivery */}
                  {activeStep === 3 && (
                    <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 h-full flex items-center">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full">
                        <div className="space-y-4 sm:space-y-6">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                              <FiTruck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Fast Delivery</h3>
                              <p className="text-orange-600 font-medium text-sm sm:text-base">Step 4 of 4</p>
                            </div>
                          </div>
                          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                            Your custom athletic gear is carefully packaged and shipped directly to you. 
                            Track your order every step of the way.
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-xs sm:text-sm font-medium text-gray-700">Global Shipping</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-xs sm:text-sm font-medium text-gray-700">Order Tracking</span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden lg:flex items-center justify-center">
                          <div className="w-48 h-48 xl:w-64 xl:h-64 bg-gradient-to-br from-orange-400 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <FiTruck className="w-20 h-20 xl:w-24 xl:h-24 text-white opacity-80" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setActiveStep(activeStep > 0 ? activeStep - 1 : 3)}
                className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
              >
                <FiChevronLeft className="w-4 h-4" />
                <span className="font-medium text-gray-700">Previous</span>
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Step {activeStep + 1} of 4
                </p>
                <div className="flex space-x-2">
                  {[0, 1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        step === activeStep ? 'bg-red-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
            </div>
            </div>
            
              <button
                onClick={() => setActiveStep(activeStep < 3 ? activeStep + 1 : 0)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
              >
                <span className="font-medium">Next</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
            </div>

          {/* Important Information Card */}
              <motion.div
            className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">!</span>
            </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Important Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">Minimum Order</h5>
                      <p className="text-gray-700 text-sm">12 units per design (exceptions for 6 units available)</p>
          </div>
          </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">Production Time</h5>
                      <p className="text-gray-700 text-sm">10-15 business days depending on complexity</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">Payment</h5>
                      <p className="text-gray-700 text-sm">50-70% advance, remainder on delivery</p>
                    </div>
                  </div>
                </div>
              </div>
                </div>
              </motion.div>

          {/* CTA Section */}
            <motion.div
            className="text-center mt-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Start Your Custom Order</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
            </motion.div>
            </div>
        </section>
        <section className="py-20 px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 w-full">
          <div className="max-w-[90rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Sublimated Polo T-Shirts */}
            <motion.div
              className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-12 text-white relative overflow-hidden"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                  <span className="text-2xl font-bold">P</span>
                </div>
                <h2 className="text-4xl font-bold mb-4 leading-tight">
                  Sublimated
                  <br />
                  Polo T-Shirts
              </h2>
                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                  Professional sublimated polo shirts with custom designs. Perfect for teams and corporate events.
                </p>
                <Link
                  to="/products?category=polo"
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium transition-colors backdrop-blur-sm inline-block"
                >
                  Shop Polo Collection
                </Link>
                </div>
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-black/10 rounded-full blur-2xl"></div>
            </motion.div>

            {/* Premium Cricket Whites */}
            <motion.div
              className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 relative"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">C</span>
                  </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    Premium
                    <br />
                    Cricket Whites
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    Experience ultimate comfort and style with our breathable, modern fit cricket whites for professional players.
                  </p>
                  <Link
                    to="/products?category=cricket"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors inline-block"
                  >
                    Shop Cricket Gear
                  </Link>
                </div>
                </div>
            </motion.div>
          </div>
          </div>
        </section>


        {/* Instagram Feed Section - Premium Design */}
        <section className="py-24 px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 w-full bg-gradient-to-br from-gray-50 via-white to-pink-50/30">
          <div className="max-w-7xl mx-auto">
            {/* Premium Header - Simplified */}
            <motion.div
              className="text-center mb-20"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Main Title Section */}
              <div className="relative mb-12">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 bg-gradient-to-r from-red-50/30 to-blue-50/30 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative z-10">
                  {/* Main Heading - Single Line */}
                  <div className="space-y-6">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-red-600 via-red-700 to-blue-700 bg-clip-text text-transparent">
                        Follow Our Journey
                      </span>
                    </h2>
                    
                    {/* Subtitle with Brand Colors */}
                    <div className="flex items-center justify-center space-x-3">
                      <div className="h-px bg-gradient-to-r from-transparent via-red-300 to-transparent flex-1 max-w-24"></div>
                      <div className="bg-gradient-to-r from-red-600 to-blue-700 text-white px-6 py-2 rounded-full shadow-lg">
                        <span className="text-sm font-semibold tracking-wide">@caper_sports9</span>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1 max-w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Description - Consistent Typography */}
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Join our community of <span className="font-semibold text-red-600">champions</span> and witness the 
                  <span className="font-semibold text-blue-600"> craftsmanship</span> behind every victory.
                </p>
                
                {/* Stats Row - Brand Colors */}
                <div className="flex items-center justify-center space-x-8 lg:space-x-12">
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                      2.4k+
                    </div>
                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Followers</div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-700 to-blue-600 bg-clip-text text-transparent">
                      150+
                    </div>
                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Posts</div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      12k+
                    </div>
                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Likes</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Premium Instagram Posts */}
            {instagramLoading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100">
                <CaperSportsLoader size="lg" />
                <p className="mt-6 text-gray-600 font-medium">Curating our latest moments...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Main Featured Post - Using 2nd Post */}
                {instagramPosts.length > 1 && (
                  <motion.div
                    className="relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-700"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                      {/* Enhanced Featured Image */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
                        <img
                          src={instagramPosts[1].image}
                          alt="Featured Instagram Post"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE0NC43NzIgMTAwIDEwMCAxNDQuNzcyIDEwMCAyMDBTMTQ0Ljc3MiAzMDAgMjAwIDMwMFMyMDAgMjU1LjIyOCAyMDAgMjAwUzI1NS4yMjggMTAwIDIwMCAxMDBaIiBmaWxsPSIjOUI5QjlCIi8+PC9zdmc+';
                          }}
                        />
                        {/* Enhanced Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-purple-500/10"></div>
                        
                        {/* Premium Featured Badge */}
                        <div className="absolute top-6 left-6">
                          <div className="bg-gradient-to-r from-red-600 to-blue-700 text-white rounded-2xl px-6 py-3 shadow-xl backdrop-blur-sm border border-white/20">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              <span className="text-sm font-bold tracking-wide">FEATURED POST</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Instagram Badge */}
                        <div className="absolute top-6 right-6">
                          <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                            <FiInstagram className="w-6 h-6 text-red-600" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Featured Content */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100 p-1">
                              <img
                                src="/images/logo.png"
                                alt="Caper Sports"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.src = "/images/capersports-logo.png";
                                  e.target.onerror = (err) => {
                                    err.target.style.display = 'none';
                                    const fallback = err.target.parentElement.querySelector('.logo-fallback');
                                    if (fallback) {
                                      fallback.style.display = 'flex';
                                    }
                                  };
                                }}
                              />
                              {/* Fallback Logo */}
                              <div className="logo-fallback hidden w-full h-full bg-gradient-to-br from-red-600 to-blue-600 rounded-xl items-center justify-center">
                                <span className="text-white font-bold text-lg">CS</span>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">caper_sports9</h3>
                              <p className="text-red-600 font-semibold">Champion Creators</p>
                            </div>
                          </div>
                          
                          <blockquote className="text-lg text-gray-700 leading-relaxed italic">
                            "{instagramPosts[1].caption || 'Crafting excellence, one design at a time. Every piece tells a story of dedication and championship spirit.'}"
                          </blockquote>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <div className="flex items-center space-x-6">
                              <div className="flex items-center space-x-2 text-red-600">
                                <FiHeart className="w-5 h-5" />
                                <span className="font-semibold">{instagramPosts[1].likes || '2.4k'}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-blue-600">
                                <FiMessageCircle className="w-5 h-5" />
                                <span className="font-semibold">{instagramPosts[1].comments?.length || 89}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => window.open(instagramPosts[1].permalink, '_blank')}
                              className="bg-gradient-to-r from-red-600 to-blue-700 hover:from-red-700 hover:to-blue-800 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              View on Instagram
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Grid of Additional Posts - First post and posts 3-5 */}
                {instagramPosts.length > 1 && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {[instagramPosts[0], ...instagramPosts.slice(2, 5)].filter(Boolean).map((post, index) => (
                      <motion.div
                        key={post.id}
                        className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: (index + 1) * 0.1 }}
                        onClick={() => window.open(post.permalink, '_blank')}
                      >
                        <div className="aspect-square relative overflow-hidden">
                          <img
                            src={post.image}
                            alt={`Instagram Post ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE0NC43NzIgMTAwIDEwMCAxNDQuNzcyIDEwMCAyMDBTMTQ0Ljc3MiAzMDAgMjAwIDMwMFMyMDAgMjU1LjIyOCAyMDAgMjAwUzI1NS4yMjggMTAwIDIwMCAxMDBaIiBmaWxsPSIjOUI5QjlCIi8+PC9zdmc+';
                            }}
                          />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex items-center justify-between text-white">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-1">
                                    <FiHeart className="w-4 h-4" />
                                    <span className="text-sm font-medium">{post.likes || Math.floor(Math.random() * 500) + 100}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <FiMessageCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">{post.comments?.length || Math.floor(Math.random() * 50) + 10}</span>
                                  </div>
                                </div>
                                <FiInstagram className="w-5 h-5" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Corner Gradient */}
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-500/20 to-transparent"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Premium CTA */}
            <motion.div
              className="mt-20 text-center"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-2xl mx-auto text-white">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <FiInstagram className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-3xl font-bold leading-tight">Join the Champions</h3>
                      <p className="text-pink-100">@caper_sports9</p>
                    </div>
                  </div>
                  <p className="text-xl leading-relaxed mb-8 text-pink-50">
                    Be part of our journey. Follow us for exclusive behind-the-scenes content, 
                    champion stories, and the latest from our premium collection.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <a
                      href="https://instagram.com/caper_sports9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-3 bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:bg-pink-50"
                    >
                      <FiInstagram className="w-6 h-6" />
                      <span>Follow @caper_sports9</span>
                    </a>
                    <div className="flex items-center space-x-2 text-pink-100">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-sm font-medium">2.4k+ Champions Following</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-300/20 rounded-full blur-xl"></div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;