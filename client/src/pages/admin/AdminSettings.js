import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const AdminSettings = () => {
  return (
    <>
      <Helmet>
        <title>Admin Settings - Caper Sports</title>
        <meta name="description" content="Admin settings" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Admin Settings
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <p className="text-gray-600 dark:text-gray-400">
                Admin settings page coming soon!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
