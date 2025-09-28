import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiEdit3, 
  FiSave,
  FiX,
  FiEye,
  FiEyeOff,
  FiShield,
  FiSettings,
  FiMapPin,
  FiBell,
  FiShoppingBag
} from 'react-icons/fi';

// Store
import { updateProfile, changePassword, clearError } from '../store/slices/authSlice';

// Components
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Settings = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Initialize profile data when user data is available
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);
  
  // Clear error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(updateProfile(profileData)).unwrap();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    try {
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })).unwrap();
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(error || 'Failed to change password');
    }
  };
  
  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
    { id: 'shopping', label: 'Shopping', icon: FiShoppingBag },
    { id: 'preferences', label: 'Preferences', icon: FiSettings },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'privacy', label: 'Privacy', icon: FiShield },
    { id: 'account', label: 'Account', icon: FiUser }
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Settings - CaperSports</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Settings
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage your account settings and preferences
                  </p>
                </div>
                
                {/* Settings Icon */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <FiSettings className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <Icon className="mr-2 w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Personal Information
                    </h2>
                    <Button
                      variant={isEditing ? 'secondary' : 'primary'}
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center"
                    >
                      {isEditing ? (
                        <>
                          <FiX className="mr-2 w-4 h-4" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <FiEdit3 className="mr-2 w-4 h-4" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                      
                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                      
                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Save Button */}
                    {isEditing && (
                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-end space-x-3">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            className="flex items-center"
                          >
                            <FiSave className="mr-2 w-4 h-4" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              )}
              
              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Security Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage your password and security preferences
                    </p>
                  </div>
                  
                  {/* Password Section */}
                  <div className="space-y-6">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Password
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Keep your account secure with a strong password
                          </p>
                        </div>
                        <Button
                          variant="primary"
                          onClick={() => setShowPasswordForm(!showPasswordForm)}
                          className="flex items-center"
                        >
                          <FiLock className="mr-2 w-4 h-4" />
                          Change Password
                        </Button>
                      </div>
                      
                      {showPasswordForm && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <FiLock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                              <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              New Password
                            </label>
                            <div className="relative">
                              <FiLock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <FiLock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-3">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setShowPasswordForm(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              variant="primary"
                              loading={loading}
                              className="flex items-center"
                            >
                              <FiSave className="mr-2 w-4 h-4" />
                              Change Password
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Default message for other tabs */}
              {activeTab !== 'personal' && activeTab !== 'security' && (
                <div className="p-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiSettings className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {tabs.find(tab => tab.id === activeTab)?.label || 'Settings'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      This settings section is being prepared for you.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => window.location.href = '/profile'}
                      className="flex items-center mx-auto"
                    >
                      <FiUser className="mr-2 w-4 h-4" />
                      Go to Full Profile Settings
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Settings;
