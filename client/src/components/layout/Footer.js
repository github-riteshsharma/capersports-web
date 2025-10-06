import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiTwitter, 
  FiInstagram, 
  FiDribbble,
  FiGithub
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
      title: 'Categories',
      links: [
        { name: 'Running', href: '/products?category=running' },
        { name: 'Training', href: '/products?category=training' },
        { name: 'Lifestyle', href: '/products?category=lifestyle' },
        { name: 'Footwear', href: '/products?category=footwear' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'Returns', href: '/returns' },
        { name: 'Shipping Info', href: '/shipping' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: FiTwitter },
    { name: 'Instagram', href: '#', icon: FiInstagram },
    { name: 'Dribbble', href: '#', icon: FiDribbble },
    { name: 'GitHub', href: '#', icon: FiGithub },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Section - Brand Description */}
            <div className="space-y-8">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <img
                  src="/images/logo.png"
                  alt="Caper Sports Logo"
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    // Fallback to CSS logo if image fails
                    e.target.style.display = 'none';
                  }}
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-900 bg-clip-text text-transparent">
                  CAPER SPORTS
                </span>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Premium athletic gear for champions.
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                  Quality, comfort, and performance in every product. Engineered for athletes who never settle for less.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-200 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={18} className="text-gray-700 hover:text-red-600" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Right Section - Footer Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {footerSections.map((section, index) => (
                <div key={index}>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">{section.title}</h4>
                  <ul className="space-y-4">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          to={link.href}
                          className="text-gray-600 hover:text-red-600 transition-colors duration-200"
                        >
                          <span>{link.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Caper Sports. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
