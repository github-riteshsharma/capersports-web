import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Store
import { getCurrentUser } from '../../store/slices/authSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminAuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch current user if not already loaded
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, user]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying admin access..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    toast.error('Please login to access the admin dashboard');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator';
  const hasAdminAccess = isAdmin || isModerator;

  // Show access denied if not admin/moderator
  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShield className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have permission to access the admin dashboard. 
              Only administrators and moderators can view this content.
            </p>

            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center">
                <FiUser className="w-4 h-4 mr-1" />
                <span>Current Role: {user?.role || 'user'}</span>
              </div>
              <div className="flex items-center">
                <FiLock className="w-4 h-4 mr-1" />
                <span>Required: admin</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // User has admin access, render children
  return children;
};

export default AdminAuthGuard;
