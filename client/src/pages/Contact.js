import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
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
  FiRefreshCw
} from 'react-icons/fi';

// Components
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email Us',
      details: 'hello@capersports.com',
      subDetails: 'support@capersports.com',
      description: 'Send us an email anytime',
      color: 'text-blue-600'
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      details: '+91 98765 43210',
      subDetails: '+91 98765 43211',
      description: 'Mon-Fri from 9am to 6pm',
      color: 'text-green-600'
    },
    {
      icon: FiMapPin,
      title: 'Visit Us',
      details: '123 Sports Avenue',
      subDetails: 'Mumbai, Maharashtra 400001',
      description: 'Come visit our flagship store',
      color: 'text-red-600'
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      details: 'Monday - Friday: 9AM - 6PM',
      subDetails: 'Saturday: 10AM - 4PM',
      description: 'Sunday: Closed',
      color: 'text-purple-600'
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: FiMessageCircle },
    { value: 'support', label: 'Customer Support', icon: FiHelpCircle },
    { value: 'orders', label: 'Order Related', icon: FiShoppingBag },
    { value: 'shipping', label: 'Shipping & Delivery', icon: FiTruck },
    { value: 'returns', label: 'Returns & Exchanges', icon: FiRefreshCw },
    { value: 'payments', label: 'Payment Issues', icon: FiCreditCard }
  ];

  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer 30-day free returns on all items. Products must be in original condition with tags attached.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we ship within India only. International shipping will be available soon.'
    },
    {
      question: 'How can I track my order?',
      answer: 'You\'ll receive a tracking number via email once your order ships. You can also track it in your account.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and cash on delivery.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - CaperSports | Get in Touch</title>
        <meta name="description" content="Get in touch with CaperSports customer support. Find our contact information, business hours, and send us a message." />
        <meta name="keywords" content="contact capersports, customer support, help center, get in touch, sports clothing support" />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-pattern opacity-10" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Get in Touch
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Have a question, feedback, or need assistance? We're here to help!
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-600 mb-4 ${info.color}`}>
                    <info.icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {info.title}
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                    {info.details}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {info.subDetails}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {info.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  Send us a Message
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Inquiry Type
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full py-4 text-lg"
                  >
                    {isSubmitting ? (
                      <><LoadingSpinner size="sm" className="mr-2" /> Sending...</>
                    ) : (
                      <><FiSend className="mr-2" size={20} /> Send Message</>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:pl-8"
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Quick answers to common questions. Can't find what you're looking for? Send us a message!
                </p>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6"
                    >
                      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <h3 className="text-xl font-semibold mb-3 text-blue-900 dark:text-blue-100">
                    Still need help?
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 mb-4">
                    Our customer support team is available Monday through Friday, 9AM to 6PM IST.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="mailto:support@capersports.com"
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <FiMail className="mr-2" size={16} />
                      Email Support
                    </a>
                    <a
                      href="tel:+919876543210"
                      className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    >
                      <FiPhone className="mr-2" size={16} />
                      Call Us
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Visit Our Store
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Come experience our products in person at our flagship store in Mumbai.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-600">
                <div className="w-full h-96 bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <FiMapPin className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">CaperSports Flagship Store</h3>
                    <p className="text-lg mb-2">123 Sports Avenue</p>
                    <p className="text-lg">Mumbai, Maharashtra 400001</p>
                    <div className="mt-4 text-sm opacity-90">
                      <p>Interactive map coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <FiClock className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Store Hours</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Mon-Fri: 9AM-6PM<br />
                      Sat: 10AM-4PM<br />
                      Sun: Closed
                    </p>
                  </div>
                  <div className="text-center">
                    <FiPhone className="w-8 h-8 mx-auto mb-3 text-red-600" />
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Call Store</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      +91 98765 43210<br />
                      +91 98765 43211
                    </p>
                  </div>
                  <div className="text-center">
                    <FiMapPin className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Get Directions</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Near Sports Complex<br />
                      Free parking available
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
