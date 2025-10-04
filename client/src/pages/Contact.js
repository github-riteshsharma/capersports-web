import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock, 
  FiMessageCircle, 
  FiSend,
  FiUser,
  FiHelpCircle,
  FiShoppingBag,
  FiTruck,
  FiCreditCard,
  FiRefreshCw,
  FiPackage,
  FiTool,
  FiAward,
  FiHeart,
  FiStar,
  FiCheck,
  FiArrowRight,
  FiZap,
  FiShield,
  FiHeadphones,
  FiUpload,
  FiX,
  FiFile,
  FiImage
} from 'react-icons/fi';

// Components
import CaperSportsLoader from '../components/common/CaperSportsLoader';

const Contact = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeContactMethod, setActiveContactMethod] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Check if user came from order process
  const fromOrderProcess = location.state?.fromOrderProcess || false;

  useEffect(() => {
    if (fromOrderProcess) {
      setFormData(prev => ({
        ...prev,
        inquiryType: 'custom-order',
        subject: 'Custom Order Inquiry'
      }));
    }
  }, [fromOrderProcess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'image/svg+xml'];
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} is not a supported format. Please use images (JPG, PNG, GIF, WebP, SVG) or PDF files.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      // Add to existing files instead of replacing
      setUploadedFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) uploaded successfully`);
    }
    
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <FiImage className="w-5 h-5 text-blue-600" />;
    } else if (fileType === 'application/pdf') {
      return <FiFile className="w-5 h-5 text-red-600" />;
    }
    return <FiFile className="w-5 h-5 text-gray-600" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createImagePreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  const isImageFile = (fileType) => {
    return fileType.startsWith('image/');
  };

  // File Preview Component
  const FilePreview = ({ file, index }) => {
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
      if (isImageFile(file.type)) {
        createImagePreview(file).then(setImagePreview);
      }
    }, [file]);

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative group"
      >
        {isImageFile(file.type) ? (
          // Image Preview Card
          <div className="relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-red-300 transition-colors duration-200">
            <div className="aspect-square bg-gray-50">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              )}
            </div>
            
            {/* Image Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-white text-sm font-medium truncate">
                {file.name}
              </p>
              <p className="text-white/80 text-xs">
                {formatFileSize(file.size)}
              </p>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // Non-Image File Card
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-red-300 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              {getFileIcon(file.type)}
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call with file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
      setUploadedFiles([]);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const contactMethods = [
    {
      id: 'email',
      icon: FiMail,
      title: 'Email Support',
      primary: 'hello@capersports.com',
      secondary: 'support@capersports.com',
      description: 'Get detailed responses within 24 hours',
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: 'Send Email',
      href: 'mailto:hello@capersports.com'
    },
    {
      id: 'phone',
      icon: FiPhone,
      title: 'Call Us Direct',
      primary: '+91 98765 43210',
      secondary: 'Mon-Fri: 9AM-6PM IST',
      description: 'Speak with our team immediately',
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      action: 'Call Now',
      href: 'tel:+919876543210'
    },
    {
      id: 'whatsapp',
      icon: FiMessageCircle,
      title: 'WhatsApp Chat',
      primary: '+91 98765 43210',
      secondary: 'Quick responses guaranteed',
      description: 'Chat with us on your favorite platform',
      color: 'from-green-400 to-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-50',
      action: 'Start Chat',
      href: 'https://wa.me/919876543210'
    },
    {
      id: 'visit',
      icon: FiMapPin,
      title: 'Visit Our Store',
      primary: 'Sector 62, Noida',
      secondary: 'Uttar Pradesh 201301',
      description: 'Experience our products firsthand',
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      action: 'Get Directions',
      href: 'https://maps.google.com'
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: FiMessageCircle, color: 'text-blue-600' },
    { value: 'custom-order', label: 'Custom Order', icon: FiTool, color: 'text-purple-600' },
    { value: 'support', label: 'Customer Support', icon: FiHelpCircle, color: 'text-green-600' },
    { value: 'orders', label: 'Order Status', icon: FiShoppingBag, color: 'text-orange-600' },
    { value: 'shipping', label: 'Shipping & Delivery', icon: FiTruck, color: 'text-blue-500' },
    { value: 'returns', label: 'Returns & Exchanges', icon: FiRefreshCw, color: 'text-red-600' },
    { value: 'payments', label: 'Payment Issues', icon: FiCreditCard, color: 'text-indigo-600' },
    { value: 'wholesale', label: 'Wholesale Inquiry', icon: FiPackage, color: 'text-gray-600' }
  ];

  const supportFeatures = [
    {
      icon: FiZap,
      title: 'Quick Response',
      description: 'Average response time under 2 hours during business hours'
    },
    {
      icon: FiShield,
      title: 'Secure Support',
      description: 'Your information is protected with enterprise-grade security'
    },
    {
      icon: FiHeadphones,
      title: '24/7 Assistance',
      description: 'Round-the-clock support for urgent matters and emergencies'
    },
    {
      icon: FiAward,
      title: 'Expert Team',
      description: 'Knowledgeable staff with deep product and industry expertise'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - Caper Sports | Premium Customer Support</title>
        <meta name="description" content="Get in touch with Caper Sports for custom orders, support, or any questions. Multiple contact methods available with quick response times." />
        <meta name="keywords" content="contact capersports, customer support, custom orders, sports clothing help" />
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
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              {fromOrderProcess && (
                <motion.div
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <FiTool className="w-4 h-4" />
                  <span>Custom Order Process</span>
                </motion.div>
              )}

              <motion.h1 
                className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                Get in Touch with
                <br />
                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  Team Caper Sports
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {fromOrderProcess 
                  ? "Ready to bring your custom sports apparel vision to life? Our design team is here to help you create something extraordinary."
                  : "Whether you need support, have questions, or want to explore custom solutions, we're here to help you achieve your athletic goals."
                }
              </motion.p>
            </motion.div>

            {/* Contact Methods Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  variants={fadeInUp}
                  className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 cursor-pointer overflow-hidden ${
                    activeContactMethod === method.id ? 'ring-2 ring-red-500 ring-offset-2' : ''
                  }`}
                  onMouseEnter={() => setActiveContactMethod(method.id)}
                  onMouseLeave={() => setActiveContactMethod(null)}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${method.color} text-white rounded-2xl mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <method.icon size={24} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                    {method.title}
                  </h3>
                  
                  <div className="space-y-1 mb-4">
                    <p className="font-semibold text-gray-800">
                      {method.primary}
                    </p>
                    <p className="text-sm text-gray-600">
                      {method.secondary}
                    </p>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {method.description}
                  </p>
                  
                  <motion.a
                    href={method.href}
                    target={method.href.startsWith('http') ? '_blank' : '_self'}
                    rel={method.href.startsWith('http') ? 'noopener noreferrer' : ''}
                    className={`inline-flex items-center space-x-2 ${method.textColor} font-semibold text-sm group-hover:text-opacity-80 transition-all duration-300`}
                    whileHover={{ x: 5 }}
                  >
                    <span>{method.action}</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Contact Form */}
              <motion.div
                className="lg:col-span-2"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Send us a Message
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-4 top-4 text-gray-400" size={18} />
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-200"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-4 top-4 text-gray-400" size={18} />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-200"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        What can we help you with?
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {inquiryTypes.map((type) => (
                          <motion.label
                            key={type.value}
                            className={`relative flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                              formData.inquiryType === type.value
                                ? 'bg-gradient-to-r from-red-50 to-blue-50 border-2 border-red-500 shadow-lg'
                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="radio"
                              name="inquiryType"
                              value={type.value}
                              checked={formData.inquiryType === type.value}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <type.icon className={`w-6 h-6 mb-2 ${type.color}`} />
                            <span className="text-xs font-medium text-gray-900 text-center leading-tight">
                              {type.label}
                            </span>
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-200"
                        placeholder="What's this about?"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-200 resize-none"
                        placeholder={fromOrderProcess 
                          ? "Tell us about your custom design requirements, preferred colors, sizes, quantities, and any specific details..."
                          : "Tell us how we can help you..."
                        }
                      />
                    </div>

                    {/* File Upload for Custom Orders */}
                    {formData.inquiryType === 'custom-order' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Design Files <span className="text-gray-500 font-normal">(Optional)</span>
                        </label>
                        <p className="text-xs text-gray-600 mb-3">
                          Upload your design files, inspiration images, or sketches. Supported formats: JPG, PNG, GIF, WebP, SVG, PDF (Max 10MB each)
                        </p>
                        
                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-red-400 transition-colors duration-200">
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center space-y-2"
                          >
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <FiUpload className="w-6 h-6 text-gray-500" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                Click to upload files
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                or drag and drop your design files here
                              </p>
                            </div>
                          </label>
                        </div>

                        {/* Uploaded Files List */}
                        {uploadedFiles.length > 0 && (
                          <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-gray-900">
                                Uploaded Files ({uploadedFiles.length})
                              </h4>
                              <button
                                type="button"
                                onClick={() => setUploadedFiles([])}
                                className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                              >
                                Clear All
                              </button>
                            </div>
                            
                            {/* Files Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              <AnimatePresence>
                                {uploadedFiles.map((file, index) => (
                                  <FilePreview key={`${file.name}-${index}`} file={file} index={index} />
                                ))}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <CaperSportsLoader size="sm" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <FiSend size={20} />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>

              {/* Support Features */}
              <motion.div
                className="space-y-6"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Why Choose Our Support?
                  </h3>
                  
                  <div className="space-y-6">
                    {supportFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-3xl p-8 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FiClock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Business Hours
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Monday - Friday</span>
                      <span className="text-gray-900 font-semibold">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Saturday</span>
                      <span className="text-gray-900 font-semibold">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Sunday</span>
                      <span className="text-red-600 font-semibold">Closed</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-200">
                    <div className="flex items-center space-x-2 text-green-600 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-semibold text-sm">We're Online Now</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Average response time: <strong>Under 2 hours</strong>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;