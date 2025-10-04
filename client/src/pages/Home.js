import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiArrowRight, FiHeart, FiEye, FiCheck, FiChevronLeft, FiChevronRight, FiMessageCircle, FiEdit, FiSettings, FiTruck, FiInstagram, FiMoreHorizontal } from 'react-icons/fi';

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

  useEffect(() => {
    dispatch(getFeaturedProducts(8));
  }, [dispatch]);

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
        {/* Hero Section - Full Viewport Height */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 w-full py-16 sm:py-20">
            <motion.div
              className="space-y-6 sm:space-y-8 flex flex-col justify-center text-center lg:text-left"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm font-medium text-red-600 tracking-wider uppercase">
                  PREMIUM <span className="text-blue-600">ATHLETIC</span> GEAR
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Unleash Your
                  <br />
                  <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">Potential</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Premium sports clothing and gear for athletes who never settle for less. Quality, comfort, and performance in every product.
                </p>
              </div>
          
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                <motion.button
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 rounded-full font-medium transition-all shadow-lg text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/products')}
                >
                  Shop Now
                </motion.button>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-gray-900 font-medium flex items-center space-x-2 transition-colors text-sm sm:text-base"
                >
                  <span>Learn More</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
            
            {/* Hero Image */}
            <motion.div
              className="relative flex items-center justify-center order-first lg:order-last"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl max-w-sm sm:max-w-md lg:max-w-none mx-auto w-full">
                <img
                  src="/images/hero.png"
                  alt="Caper Sports Athletes in Action"
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-[400px] xl:h-[500px] object-cover"
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
                <div className="hidden w-full h-48 sm:h-64 md:h-80 lg:h-[400px] xl:h-[500px] bg-gradient-to-br from-red-500 via-orange-500 to-blue-600 items-center justify-center">
                  <div className="text-white text-center p-4">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">CAPER SPORTS</div>
                    <div className="text-sm sm:text-lg lg:text-xl opacity-80">Premium Athletic Gear</div>
                  </div>
                </div>
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                {/* Badge */}
                <div className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-white/90 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">Premium Quality</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
            
        {/* Featured Products Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            <div className="space-y-4 sm:space-y-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-xl sm:text-3xl">🏆</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight px-4">
                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">Featured Products</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Discover our handpicked selection of premium athletic wear from our championship collection. Each product represents excellence in performance and design.
              </p>
            </div>
            </motion.div>
            
            {loading ? (
            <div className="flex justify-center items-center py-20">
              <CaperSportsLoader size="lg" />
            </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
            <motion.div
                  key={product._id}
                  variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
              >
                    <ProductCard product={product} />
            </motion.div>
                ))}
          </div>
            )}
          
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
        </section>
            
        {/* Design Showcase Gallery */}
        <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
            className="text-center mb-16"
              variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-3xl">✨</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">Our Design Showcase</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Witness the craftsmanship behind our premium athletic wear. Each design tells a story of excellence, crafted with precision and passion.
              </p>
              </div>
            </motion.div>
            
          {/* Clean Showcase Grid - 4 Cards in Single Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {showcaseProducts.slice(0, 4).map((product, index) => (
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
        </section>

        {/* Customer Testimonials Section */}
        <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">Champions</span> Say
              </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
        </section>

        {/* Interactive Order Process Section */}
        <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
              <motion.div
            className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How We Create Your <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">Perfect Gear</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
            <div className="relative h-96 overflow-hidden">
              <AnimatePresence mode="wait">
                  <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {/* Step 1: Application */}
                  {activeStep === 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 lg:p-12 h-full flex items-center">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <FiMessageCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-3xl font-bold text-gray-900">Share Your Vision</h3>
                              <p className="text-blue-600 font-medium">Step 1 of 4</p>
                            </div>
                          </div>
                          <p className="text-lg text-gray-700 leading-relaxed">
                            Send us your ideas, sketches, or design concepts through our contact form or WhatsApp. 
                            Our team is ready to transform your vision into reality.
                          </p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-4 py-2">
                              <FiCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">Free Consultation</span>
                </div>
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-4 py-2">
                              <FiCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">24/7 Support</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <FiMessageCircle className="w-24 h-24 text-white opacity-80" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Design */}
                  {activeStep === 1 && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 lg:p-12 h-full flex items-center">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <FiEdit className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-3xl font-bold text-gray-900">Design Creation</h3>
                              <p className="text-purple-600 font-medium">Step 2 of 4</p>
                            </div>
                          </div>
                          <p className="text-lg text-gray-700 leading-relaxed">
                            Our expert designers create a detailed preview of your custom gear. 
                            We'll refine every detail until it matches your perfect vision.
                          </p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-4 py-2">
                              <FiCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">3D Preview</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-4 py-2">
                              <FiCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">Unlimited Revisions</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <FiEdit className="w-24 h-24 text-white opacity-80" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Production */}
                  {activeStep === 2 && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 lg:p-12 h-full flex items-center">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <FiSettings className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-3xl font-bold text-gray-900">Premium Production</h3>
                              <p className="text-green-600 font-medium">Step 3 of 4</p>
                            </div>
                          </div>
                          <p className="text-lg text-gray-700 leading-relaxed">
                            Once approved, our skilled craftsmen begin manufacturing your order using 
                            premium materials and cutting-edge techniques.
                          </p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-4 py-2">
                              <FiCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">Quality Materials</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-4 py-2">
                              <FiCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">10-15 Days</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-64 h-64 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <FiSettings className="w-24 h-24 text-white opacity-80" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Delivery */}
                  {activeStep === 3 && (
                    <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-3xl p-8 lg:p-12 h-full flex items-center">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <FiTruck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-3xl font-bold text-gray-900">Fast Delivery</h3>
                              <p className="text-orange-600 font-medium">Step 4 of 4</p>
                            </div>
                          </div>
                          <p className="text-lg text-gray-700 leading-relaxed">
                            Your custom athletic gear is carefully packaged and shipped directly to you. 
                            Track your order every step of the way.
                          </p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-4 py-2">
                              <FiCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">Global Shipping</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/70 rounded-full px-4 py-2">
                              <FiCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">Order Tracking</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-64 h-64 bg-gradient-to-br from-orange-400 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <FiTruck className="w-24 h-24 text-white opacity-80" />
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
        </section>
        <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
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
        </section>


        {/* Instagram Feed Section */}
        <section className="py-16 px-6 lg:px-8 max-w-[90rem] mx-auto">
            <motion.div
              className="text-center mb-12"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <FiInstagram className="w-8 h-8 text-pink-600" />
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Follow Our <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Journey</span>
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay connected with the latest from Caper Sports - behind the scenes, champion moments, and community highlights
            </p>
            <p className="text-sm text-gray-500 mt-2">@caper_sports9</p>
            </motion.div>

          {/* Instagram Posts Grid */}
          {instagramLoading ? (
            <div className="flex justify-center items-center py-20">
              <CaperSportsLoader size="lg" />
              <span className="ml-4 text-gray-600">Loading latest posts from @caper_sports9...</span>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {instagramPosts.slice(0, 4).map((post, index) => (
              <motion.div
                  key={post.id}
                  className="group cursor-pointer"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => window.open(post.permalink, '_blank')}
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                    {/* Post Image - 60% */}
                    <div className="relative h-[60%] min-h-[200px] overflow-hidden">
                      <img
                        src={post.image}
                        alt="Caper Sports Instagram Post"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to placeholder if image fails
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE0NC43NzIgMTAwIDEwMCAxNDQuNzcyIDEwMCAyMDBTMTQ0Ljc3MiAzMDAgMjAwIDMwMFMyMDAgMjU1LjIyOCAyMDAgMjAwUzI1NS4yMjggMTAwIDIwMCAxMDBaIiBmaWxsPSIjOUI5QjlCIi8+CjwvZz4KPC9zdmc+';
                        }}
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex items-center space-x-6 text-white">
                          <div className="flex items-center space-x-2">
                            <FiHeart className="w-6 h-6" />
                            <span className="font-semibold">{post.likes}</span>
          </div>
                          <div className="flex items-center space-x-2">
                            <FiMessageCircle className="w-6 h-6" />
                            <span className="font-semibold">{post.comments?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post Content - 40% */}
                    <div className="p-4 flex flex-col justify-between h-[40%]">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">CS</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 text-sm leading-tight">caper_sports9</p>
                            <p className="text-xs text-gray-500 leading-tight">{post.timeAgo}</p>
                          </div>
                        </div>
                        <FiMoreHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>

                      {/* Caption */}
                      <div className="flex-1 mb-3">
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                          {post.caption}
                        </p>
                      </div>

                      {/* Latest Comments */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="mb-3">
                          {post.comments.slice(0, 1).map((comment, commentIndex) => (
                            <div key={commentIndex} className="flex items-start space-x-2">
                              <span className="font-semibold text-gray-900 text-xs flex-shrink-0 leading-4">{comment.username}</span>
                              <span className="text-gray-700 text-xs leading-4 flex-1">{comment.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Engagement */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FiHeart className="w-3 h-3" />
                            <span>{post.likes} likes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiMessageCircle className="w-3 h-3" />
                            <span>{post.comments?.length || 0} comments</span>
                          </div>
                        </div>
                        <span className="text-gray-400">{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Follow CTA */}
            <motion.div
            className="text-center mt-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 border border-pink-100">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <FiInstagram className="w-8 h-8 text-pink-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Follow Us on Instagram
                </h3>
              </div>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                Join our community of champions and stay updated with the latest gear, 
                behind-the-scenes content, and success stories.
              </p>
              <a
                href="https://instagram.com/caper_sports9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiInstagram className="w-5 h-5" />
                <span>Follow @caper_sports9</span>
              </a>
          </div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default Home;