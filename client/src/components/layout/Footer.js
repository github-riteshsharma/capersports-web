import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin,
  FiHeart 
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' },
      ],
    },
    {
      title: 'Account',
      links: [
        { name: 'My Account', href: '/profile' },
        { name: 'Order History', href: '/orders' },
        { name: 'Wishlist', href: '/wishlist' },
        { name: 'Track Order', href: '/track' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About CaperSports', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Sustainability', href: '/sustainability' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: FiFacebook },
    { name: 'Twitter', href: '#', icon: FiTwitter },
    { name: 'Instagram', href: '#', icon: FiInstagram },
    { name: 'LinkedIn', href: '#', icon: FiLinkedin },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay in the Loop</h3>
            <p className="text-gray-300 mb-6">
              Subscribe to our newsletter for the latest updates on new arrivals, exclusive deals, and sports tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors duration-200"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-xl font-bold">CaperSports</span>
              </Link>
              <p className="text-gray-300 mb-6 max-w-md">
                Premium sports clothing and gear for athletes who never settle for less. 
                Quality, comfort, and performance in every product.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <FiMapPin className="text-primary-400" size={16} />
                  <span className="text-gray-300 text-sm">123 Sports Avenue, Mumbai, India</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="text-primary-400" size={16} />
                  <span className="text-gray-300 text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMail className="text-primary-400" size={16} />
                  <span className="text-gray-300 text-sm">hello@capersports.com</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index} className="lg:col-span-1">
                <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <span>&copy; {currentYear} CaperSports. Made with</span>
              <FiHeart className="text-red-500" size={14} />
              <span>in India. All rights reserved.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
