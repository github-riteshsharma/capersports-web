import React from 'react';
import { motion } from 'framer-motion';
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
  FiCheck
} from 'react-icons/fi';

// Components
import Button from '../components/common/Button';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const values = [
    {
      icon: FiTarget,
      title: 'Performance First',
      description: 'Every product is designed to enhance athletic performance and comfort during intense training sessions.',
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      icon: FiHeart,
      title: 'Passion for Sports',
      description: 'We are athletes ourselves, driven by the same passion that motivates our customers to push their limits.',
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-500 to-red-600'
    },
    {
      icon: FiShield,
      title: 'Quality Guarantee',
      description: 'Premium materials and rigorous testing ensure our products meet the highest standards of durability.',
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      icon: FiGlobe,
      title: 'Global Impact',
      description: 'Supporting athletes worldwide while maintaining sustainable and ethical manufacturing practices.',
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-500 to-red-600'
    }
  ];

  const achievements = [
    {
      number: '50K+',
      label: 'Happy Customers',
      description: 'Athletes trust our gear'
    },
    {
      number: '15+',
      label: 'Years Experience',
      description: 'In sports apparel industry'
    },
    {
      number: '200+',
      label: 'Product Lines',
      description: 'Diverse range of sports gear'
    },
    {
      number: '99%',
      label: 'Customer Satisfaction',
      description: 'Based on verified reviews'
    }
  ];

  const teamMembers = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      image: '/images/team-placeholder.jpg',
      bio: 'Former professional athlete with 20+ years in sports industry'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Design',
      image: '/images/team-placeholder.jpg',
      bio: 'Award-winning designer specializing in athletic wear'
    },
    {
      name: 'Arjun Patel',
      role: 'CTO',
      image: '/images/team-placeholder.jpg',
      bio: 'Tech innovator bringing cutting-edge solutions to sports'
    },
    {
      name: 'Meera Singh',
      role: 'Head of Operations',
      image: '/images/team-placeholder.jpg',
      bio: 'Operations expert ensuring quality and timely delivery'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - CaperSports | Premium Sports Clothing</title>
        <meta name="description" content="Learn about CaperSports' mission to provide premium sports clothing for athletes. Discover our story, values, and commitment to quality." />
        <meta name="keywords" content="about capersports, sports clothing company, athletic wear brand, sports apparel mission" />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />
          {/* Brand color accents */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
          
          <motion.div
            className="relative z-10 text-center max-w-4xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Empowering Athletes
              <span className="block text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Since 2008
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We believe that every athlete deserves gear that matches their dedication and passion.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                as={Link}
                to="/products"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Shop Our Collection
              </Button>
              
              <Button
                as={Link}
                to="/contact"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
              >
                Get in Touch
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p className="text-lg leading-relaxed">
                    CaperSports was born from a simple belief: athletes deserve gear that enhances their performance, 
                    not holds them back. Founded in 2008 by former professional athlete Rajesh Kumar, we started with 
                    a mission to create premium sports clothing that combines cutting-edge technology with uncompromising comfort.
                  </p>
                  <p className="text-lg leading-relaxed">
                    What began as a small startup in Mumbai has grown into a trusted brand serving athletes across India and beyond. 
                    Our journey has been driven by continuous innovation, customer feedback, and an unwavering commitment to quality.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Today, we're proud to be the go-to choice for athletes who demand excellence in every aspect of their gear. 
                    From weekend warriors to professional competitors, CaperSports empowers athletes to perform at their best.
                  </p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="relative">
                <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-blue-600 to-red-600 rounded-2xl overflow-hidden">
                  <img
                    src="/images/about-story-placeholder.jpg"
                    alt="CaperSports Story"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center p-8">
                      <FiStar className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Excellence in Every Thread</h3>
                      <p className="text-lg opacity-90">Quality that speaks for itself</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Our Values
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                These core values guide everything we do, from product design to customer service.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-transparent overflow-hidden"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 ${value.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className={`inline-flex items-center justify-center w-20 h-20 ${value.bgColor} text-white rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                    <value.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Achievements
              </h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Numbers that reflect our commitment to excellence and customer satisfaction.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2 text-white">
                    {achievement.number}
                  </div>
                  <div className="text-xl font-semibold mb-2">
                    {achievement.label}
                  </div>
                  <div className="text-blue-100 text-sm">
                    {achievement.description}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                The passionate individuals behind CaperSports, dedicated to bringing you the best in sports apparel.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
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
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Ready to Join the CaperSports Family?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Discover premium sports clothing designed for athletes who never settle for less. 
                Experience the difference quality makes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  as={Link}
                  to="/products"
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  Shop Now
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
