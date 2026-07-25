import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Caper Sports</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-9xl font-bold text-red-600">
              404
            </h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              The page you're looking for doesn't exist.
            </p>
            <Button as={Link} to="/" size="lg">
              Go Back Home
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
