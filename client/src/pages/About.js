import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  FiTarget, 
  FiHeart, 
  FiTrendingUp, 
  FiUsers, 
  FiAward, 
  FiShield,
  FiGlobe,
  FiStar,
  FiCheck,
  FiArrowRight,
  FiZap,
  FiTool,
  FiThumbsUp,
  FiCalendar,
  FiMapPin,
  FiMail,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
  FiPlay,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';

// Components
import CaperSportsLoader from '../components/common/CaperSportsLoader';

const About = () => {
  const [activeValue, setActiveValue] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
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

  const values = [
    {
      icon: FiTarget,
      title: 'Performance First',
      description: 'Every product is engineered to enhance athletic performance and provide unmatched comfort during the most intense training sessions.',
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      features: ['Advanced moisture-wicking', 'Ergonomic design', 'Durability tested']
    },
    {
      icon: FiHeart,
      title: 'Passion for Sports',
      description: 'We are athletes ourselves, driven by the same passion and determination that motivates our customers to push beyond their limits.',
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      features: ['Athlete-designed products', 'Real-world testing', 'Community driven']
    },
    {
      icon: FiShield,
      title: 'Quality Guarantee',
      description: 'Premium materials sourced globally and rigorous testing ensure our products meet the highest standards of durability and performance.',
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      features: ['Premium materials', 'Quality assurance', 'Lifetime warranty']
    },
    {
      icon: FiGlobe,
      title: 'Global Impact',
      description: 'Supporting athletes worldwide while maintaining sustainable and ethical manufacturing practices that benefit communities.',
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      features: ['Sustainable practices', 'Ethical manufacturing', 'Global reach']
    }
  ];

  const achievements = [
    {
      number: '50K+',
      label: 'Happy Athletes',
      description: 'Trust our premium gear',
      icon: FiUsers,
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: '15+',
      label: 'Years Excellence',
      description: 'In sports apparel industry',
      icon: FiCalendar,
      color: 'from-green-500 to-green-600'
    },
    {
      number: '200+',
      label: 'Product Lines',
      description: 'Diverse sports gear range',
      icon: FiTool,
      color: 'from-red-500 to-red-600'
    },
    {
      number: '99%',
      label: 'Satisfaction Rate',
      description: 'Based on verified reviews',
      icon: FiThumbsUp,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const teamMembers = [
    {
      name: 'Avinash Sharma',
      role: 'Founder & CEO',
      image: '/images/team/avinash.jpg',
      bio: 'Visionary leader with 15+ years in sports industry and passion for innovation',
      expertise: ['Strategic Leadership', 'Product Innovation', 'Market Expansion'],
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'avinash@capersports.com'
      }
    },
    {
      name: 'Abhishek Sharma',
      role: 'Head of Design',
      image: '/images/team/abhishek.jpg',
      bio: 'Creative designer with expertise in athletic wear and user experience design',
      expertise: ['Product Design', 'User Experience', 'Brand Identity'],
      social: {
        linkedin: '#',
        instagram: '#',
        email: 'abhishek@capersports.com'
      }
    },
    {
      name: 'Priya Patel',
      role: 'Head of Operations',
      image: '/images/team/priya.jpg',
      bio: 'Operations expert ensuring quality and efficiency in all processes',
      expertise: ['Supply Chain', 'Quality Control', 'Process Optimization'],
      social: {
        linkedin: '#',
        email: 'priya@capersports.com'
      }
    },
    {
      name: 'Rahul Kumar',
      role: 'Technology Director',
      image: '/images/team/rahul.jpg',
      bio: 'Tech innovator driving digital transformation and e-commerce excellence',
      expertise: ['E-commerce', 'Digital Innovation', 'Data Analytics'],
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'rahul@capersports.com'
      }
    }
  ];

  const timeline = [
    {
      year: '2008',
      title: 'The Beginning',
      description: 'Founded with a vision to create premium sports clothing for dedicated athletes.',
      icon: FiStar
    },
    {
      year: '2012',
      title: 'First Major Milestone',
      description: 'Reached 10,000 satisfied customers and expanded product line significantly.',
      icon: FiTrendingUp
    },
    {
      year: '2016',
      title: 'Innovation Hub',
      description: 'Established our design and innovation center with state-of-the-art facilities.',
      icon: FiTool
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched our e-commerce platform and embraced digital-first approach.',
      icon: FiGlobe
    },
    {
      year: '2024',
      title: 'Future Ready',
      description: 'Continuing to innovate with sustainable practices and cutting-edge technology.',
      icon: FiZap
    }
  ];

  const faqs = [
    {
      question: 'What makes Caper Sports different from other brands?',
      answer: 'We combine athlete-driven design with premium materials and rigorous testing. Every product is created by athletes, for athletes, ensuring real-world performance and durability.'
    },
    {
      question: 'Do you offer custom design services?',
      answer: 'Yes! We provide comprehensive custom design services for teams, organizations, and individual athletes. Our design team works closely with you to create unique, high-performance apparel.'
    },
    {
      question: 'What is your sustainability commitment?',
      answer: 'We are committed to sustainable practices including eco-friendly materials, ethical manufacturing, and reducing our carbon footprint. We partner with certified suppliers who share our values.'
    },
    {
      question: 'How do you ensure product quality?',
      answer: 'Every product undergoes rigorous testing including durability tests, performance assessments, and athlete feedback sessions. We maintain strict quality control standards throughout production.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we ship within India with plans for international expansion. We offer fast, reliable shipping with tracking and insurance on all orders.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Caper Sports | Premium Athletic Apparel Since 2008</title>
        <meta name="description" content="Discover the story behind Caper Sports - premium athletic apparel designed by athletes, for athletes. Learn about our mission, values, and commitment to excellence." />
        <meta name="keywords" content="about capersports, athletic apparel brand, sports clothing company, premium sportswear, athlete-designed gear" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-500/3 to-blue-500/3 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Content */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <FiAward className="w-4 h-4" />
                  <span>Premium Athletic Apparel Since 2008</span>
                </motion.div>

                <motion.h1 
                  className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  Empowering Athletes
                  <br />
                  <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                    Since Day One
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  We believe that every athlete deserves gear that matches their dedication and passion. 
                  From weekend warriors to professional competitors, we create premium sportswear that 
                  enhances performance and inspires greatness.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <motion.button
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-red-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Explore Our Story</span>
                    <FiArrowRight className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    className="inline-flex items-center space-x-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    as={Link}
                    to="/products"
                  >
                    <span>Shop Collection</span>
                    <FiArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Hero Image/Video */}
              <motion.div
                className="relative"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <div className="relative aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                  {/* Placeholder for hero image/video */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <motion.div
                        className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      >
                        <FiPlay className="w-8 h-8 ml-1" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-2">Our Journey</h3>
                      <p className="text-lg opacity-90">Watch our story unfold</p>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <motion.div
                    className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center space-x-2">
                      <FiStar className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-gray-900">4.9/5</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Customer Rating</p>
                  </motion.div>
                  
                  <motion.div
                    className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  >
                    <div className="flex items-center space-x-2">
                      <FiUsers className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-gray-900">50K+</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Happy Athletes</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Our Core
                <br />
                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  Values
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                These fundamental principles guide everything we do, from product design 
                and customer service to community engagement and business decisions.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 cursor-pointer overflow-hidden ${
                    activeValue === index ? 'ring-2 ring-red-500 ring-offset-2' : ''
                  }`}
                  onMouseEnter={() => setActiveValue(index)}
                  onMouseLeave={() => setActiveValue(null)}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${value.color} text-white rounded-2xl mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <value.icon size={24} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {value.description}
                  </p>
                  
                  {/* Features List */}
                  <ul className="space-y-2">
                    {value.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                        <FiCheck className={`w-4 h-4 ${value.textColor}`} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Our
                <br />
                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  Achievements
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Numbers that reflect our commitment to excellence, innovation, and customer satisfaction 
                throughout our journey in the sports apparel industry.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 text-center overflow-hidden group"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${achievement.color} text-white rounded-2xl mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 mx-auto`}>
                    <achievement.icon size={24} />
                  </div>
                  
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-xl font-semibold text-gray-800 mb-2">
                    {achievement.label}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {achievement.description}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Our
                <br />
                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  Journey
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From humble beginnings to industry leadership - discover the key milestones 
                that shaped Caper Sports into the premium brand it is today.
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-red-500 to-blue-600 h-full rounded-full" />
              
              <div className="space-y-16">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <motion.div
                        className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
                        whileHover={{ scale: 1.02, y: -5 }}
                      >
                        <div className="text-3xl font-bold text-gray-900 mb-2">{item.year}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                      </motion.div>
                    </div>
                    
                    {/* Timeline Node */}
                    <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-blue-600 rounded-full shadow-lg">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Meet Our
                <br />
                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  Team
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The passionate individuals behind Caper Sports, dedicated to bringing you 
                the best in athletic apparel through innovation, design, and excellence.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 text-center overflow-hidden"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Profile Image */}
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="text-white text-xl font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-red-600 font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {member.bio}
                  </p>
                  
                  {/* Expertise Tags */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {member.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  {/* Social Links */}
                  <div className="flex justify-center space-x-3">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors">
                        <FiLinkedin className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors">
                        <FiTwitter className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                      </a>
                    )}
                    {member.social.instagram && (
                      <a href={member.social.instagram} className="p-2 bg-gray-100 hover:bg-pink-100 rounded-full transition-colors">
                        <FiInstagram className="w-4 h-4 text-gray-600 hover:text-pink-600" />
                      </a>
                    )}
                    <a href={`mailto:${member.social.email}`} className="p-2 bg-gray-100 hover:bg-red-100 rounded-full transition-colors">
                      <FiMail className="w-4 h-4 text-gray-600 hover:text-red-600" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Frequently Asked
                <br />
                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Get quick answers to common questions about Caper Sports, our products, and services.
              </p>
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <motion.button
                    className="w-full p-8 text-left focus:outline-none"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-8">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FiChevronDown className="w-6 h-6 text-gray-400" />
                      </motion.div>
                    </div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-8">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-200"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Ready to Join the
                <br />
                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  Caper Sports Family?
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover premium sports clothing designed for athletes who never settle for less. 
                Experience the difference that quality, innovation, and passion make.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-red-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  as={Link}
                  to="/products"
                >
                  <span>Shop Now</span>
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="inline-flex items-center space-x-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  as={Link}
                  to="/contact"
                >
                  <span>Contact Us</span>
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;