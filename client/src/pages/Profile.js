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
  FiCamera, 
  FiEdit3, 
  FiSave,
  FiX,
  FiEye,
  FiEyeOff,
  FiShield,
  FiSettings,
  FiMapPin,
  FiCalendar,
  FiBell,
  FiGlobe,
  FiMoon,
  FiSun,
  FiHome,
  FiCreditCard,
  FiHeart,
  FiShoppingBag,
  FiTruck,
  FiDownload,
  FiTrash2,
  FiAlertTriangle,
  FiPlus,
  FiEdit2,
  FiCheck
} from 'react-icons/fi';

// Store
import { updateProfile, changePassword, clearError, getCurrentUser } from '../store/slices/authSlice';
import { setTheme, toggleTheme } from '../store/slices/uiSlice';

// Components
import Button from '../components/common/Button';
import CaperSportsLoader from '../components/common/CaperSportsLoader';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  });
  
  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    newsletter: true,
    language: 'en',
    currency: 'INR'
  });
  
  // Additional settings state
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'shipping',
      name: 'Home Address',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: true
    }
  ]);
  
  const [shoppingPreferences, setShoppingPreferences] = useState({
    favoriteCategories: [],
    preferredSizes: {
      clothing: 'M',
      shoes: '9'
    },
    favoriteSports: [],
    priceRange: {
      min: 0,
      max: 10000
    },
    brandPreferences: []
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    showOrderHistory: false,
    allowDataSharing: false,
    trackingOptOut: false,
    reviewsPublic: true
  });
  
  const [accountSettings, setAccountSettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    dataExportRequested: false,
    accountDeactivationRequested: false
  });
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: 'shipping',
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false
  });
  
  // Initialize profile data when user data is available
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'India'
        }
      });
      
      // Initialize preferences from user data
      setPreferences({
        emailNotifications: user.preferences?.emailNotifications ?? true,
        smsNotifications: user.preferences?.smsNotifications ?? false,
        marketingEmails: user.preferences?.marketingEmails ?? true,
        orderUpdates: user.preferences?.orderUpdates ?? true,
        newsletter: user.preferences?.newsletter ?? true,
        language: user.preferences?.language || 'en',
        currency: user.preferences?.currency || 'INR'
      });
    }
  }, [user]);
  
  // Clear error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Profile picture upload handlers
  const handleProfilePictureSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setProfilePictureFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePictureFile) {
      toast.error('Please select an image first');
      return;
    }

    setUploadingProfilePicture(true);
    
    try {
      const formData = new FormData();
      formData.append('profilePicture', profilePictureFile);

      const response = await fetch('http://localhost:5001/api/auth/upload-profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }

      const data = await response.json();
      
      // Update user data with new avatar URL by calling getCurrentUser to refresh the entire user object
      await dispatch(getCurrentUser()).unwrap();
      
      // Clear upload state
      setProfilePictureFile(null);
      setProfilePicturePreview(null);
      
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Profile picture upload error:', error);
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setUploadingProfilePicture(false);
    }
  };

  const handleProfilePictureCancel = () => {
    setProfilePictureFile(null);
    setProfilePicturePreview(null);
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
  
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(updateProfile({ preferences })).unwrap();
      toast.success('Preferences updated successfully!');
    } catch (error) {
      toast.error(error || 'Failed to update preferences');
    }
  };
  
  // Address handlers
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddAddress = () => {
    if (newAddress.name && newAddress.street && newAddress.city) {
      const address = {
        ...newAddress,
        id: Date.now()
      };
      setAddresses(prev => [...prev, address]);
      setNewAddress({
        type: 'shipping',
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        isDefault: false
      });
      setShowAddressForm(false);
      toast.success('Address added successfully!');
    } else {
      toast.error('Please fill in all required fields');
    }
  };
  
  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast.success('Address deleted successfully!');
  };
  
  const handleSetDefaultAddress = (id) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success('Default address updated!');
  };
  
  // Shopping preferences handlers
  const handleShoppingPreferenceChange = (key, value) => {
    setShoppingPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSizeChange = (type, size) => {
    setShoppingPreferences(prev => ({
      ...prev,
      preferredSizes: {
        ...prev.preferredSizes,
        [type]: size
      }
    }));
  };
  
  // Privacy settings handlers
  const handlePrivacyChange = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Account settings handlers
  const handleAccountSettingChange = (key, value) => {
    setAccountSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleDataExport = () => {
    setAccountSettings(prev => ({
      ...prev,
      dataExportRequested: true
    }));
    toast.success('Data export requested. You will receive an email with your data within 24 hours.');
  };
  
  const handleAccountDeactivation = () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      setAccountSettings(prev => ({
        ...prev,
        accountDeactivationRequested: true
      }));
      toast.success('Account deactivation requested. You will receive a confirmation email.');
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
  
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-32">
            <CaperSportsLoader size="xl" showText />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Profile & Settings - Caper Sports</title>
        <meta name="description" content="Manage your profile and account settings" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
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
                  <h1 className="text-3xl font-bold text-gray-900">
                    Profile & Settings
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Manage your account information and preferences
                  </p>
                </div>
                
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    {profilePicturePreview ? (
                      <img
                        src={profilePicturePreview}
                        alt="Profile preview"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    )}
                  </div>
                  
                  {/* File input (hidden) */}
                  <input
                    type="file"
                    id="profilePictureInput"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleProfilePictureSelect}
                    className="hidden"
                  />
                  
                  {/* Camera button */}
                  <button 
                    onClick={() => document.getElementById('profilePictureInput').click()}
                    disabled={uploadingProfilePicture}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingProfilePicture ? (
                      <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiCamera size={14} className="text-gray-600" />
                    )}
                  </button>
                  
                  {/* Upload/Cancel buttons when file is selected */}
                  {profilePictureFile && (
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleProfilePictureUpload}
                        disabled={uploadingProfilePicture}
                        className="px-3 py-1 text-xs"
                      >
                        {uploadingProfilePicture ? 'Uploading...' : 'Upload'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleProfilePictureCancel}
                        disabled={uploadingProfilePicture}
                        className="px-3 py-1 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
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
            <div className="bg-white rounded-lg shadow-lg">
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Security Settings
                    </h2>
                    <p className="text-gray-600">
                      Manage your password and security preferences
                    </p>
                  </div>
                  
                  {/* Password Section */}
                  <div className="space-y-6">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Password
                          </h3>
                          <p className="text-sm text-gray-600">
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
              
              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Address Management
                      </h2>
                      <p className="text-gray-600">
                        Manage your shipping and billing addresses
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center"
                    >
                      <FiPlus className="mr-2 w-4 h-4" />
                      Add Address
                    </Button>
                  </div>
                  
                  {/* Address List */}
                  <div className="space-y-4 mb-6">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="font-medium text-gray-900 mr-2">
                                {address.name}
                              </h3>
                              {address.isDefault && (
                                <span className="px-2 py-1 text-xs bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full">
                                  Default
                                </span>
                              )}
                              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full capitalize">
                                {address.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.street}<br />
                              {address.city}, {address.state} {address.zipCode}<br />
                              {address.country}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="p-2 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                                title="Set as default"
                              >
                                <FiCheck className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setEditingAddress(address)}
                              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              title="Edit address"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete address"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Address Form */}
                  {showAddressForm && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Add New Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Address Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={newAddress.name}
                            onChange={handleAddressChange}
                            placeholder="Home, Office, etc."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type
                          </label>
                          <select
                            name="type"
                            value={newAddress.type}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          >
                            <option value="shipping">Shipping</option>
                            <option value="billing">Billing</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Street Address
                          </label>
                          <input
                            type="text"
                            name="street"
                            value={newAddress.street}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            State
                          </label>
                          <select
                            name="state"
                            value={newAddress.state}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          >
                            <option value="">Select State</option>
                            {indianStates.map((state) => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={newAddress.zipCode}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={newAddress.country}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={newAddress.isDefault}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Set as default address
                          </span>
                        </label>
                        <div className="flex space-x-3">
                          <Button
                            variant="secondary"
                            onClick={() => setShowAddressForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            onClick={handleAddAddress}
                          >
                            Add Address
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Shopping Preferences Tab */}
              {activeTab === 'shopping' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Shopping Preferences
                    </h2>
                    <p className="text-gray-600">
                      Customize your shopping experience
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Preferred Sizes */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Preferred Sizes
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Clothing Size
                          </label>
                          <select
                            value={shoppingPreferences.preferredSizes.clothing}
                            onChange={(e) => handleSizeChange('clothing', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          >
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Shoe Size
                          </label>
                          <select
                            value={shoppingPreferences.preferredSizes.shoes}
                            onChange={(e) => handleSizeChange('shoes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          >
                            {Array.from({ length: 10 }, (_, i) => i + 6).map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Favorite Sports */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Favorite Sports
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Running', 'Basketball', 'Football', 'Tennis', 'Cricket', 'Swimming', 'Cycling', 'Gym'].map((sport) => (
                          <label key={sport} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={shoppingPreferences.favoriteSports.includes(sport)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleShoppingPreferenceChange('favoriteSports', [...shoppingPreferences.favoriteSports, sport]);
                                } else {
                                  handleShoppingPreferenceChange('favoriteSports', shoppingPreferences.favoriteSports.filter(s => s !== sport));
                                }
                              }}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {sport}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price Range */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Preferred Price Range
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Minimum Price (₹)
                          </label>
                          <input
                            type="number"
                            value={shoppingPreferences.priceRange.min}
                            onChange={(e) => handleShoppingPreferenceChange('priceRange', {
                              ...shoppingPreferences.priceRange,
                              min: parseInt(e.target.value) || 0
                            })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Maximum Price (₹)
                          </label>
                          <input
                            type="number"
                            value={shoppingPreferences.priceRange.max}
                            onChange={(e) => handleShoppingPreferenceChange('priceRange', {
                              ...shoppingPreferences.priceRange,
                              max: parseInt(e.target.value) || 10000
                            })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Preferences
                    </h2>
                    <p className="text-gray-600">
                      Customize your experience
                    </p>
                  </div>
                  
                  <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Theme */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Theme
                        </label>
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={() => dispatch(setTheme('light'))}
                            className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
                              theme === 'light'
                                ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <FiSun className="mr-2 w-4 h-4" />
                            Light
                          </button>
                          <button
                            type="button"
                            onClick={() => dispatch(setTheme('dark'))}
                            className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
                              theme === 'dark'
                                ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <FiMoon className="mr-2 w-4 h-4" />
                            Dark
                          </button>
                        </div>
                      </div>
                      
                      {/* Language */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Language
                        </label>
                        <div className="relative">
                          <FiGlobe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <select
                            value={preferences.language}
                            onChange={(e) => handlePreferenceChange('language', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          >
                            <option value="en">English</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          variant="primary"
                          loading={loading}
                          className="flex items-center"
                        >
                          <FiSave className="mr-2 w-4 h-4" />
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Notification Settings
                    </h2>
                    <p className="text-gray-600">
                      Choose what notifications you want to receive
                    </p>
                  </div>
                  
                  <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                    <div className="space-y-4">
                      {/* Email Notifications */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            Email Notifications
                          </h3>
                          <p className="text-sm text-gray-600">
                            Receive notifications via email
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.emailNotifications}
                            onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      
                      {/* Order Updates */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            Order Updates
                          </h3>
                          <p className="text-sm text-gray-600">
                            Get notified about order status changes
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.orderUpdates}
                            onChange={(e) => handlePreferenceChange('orderUpdates', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      
                      {/* Newsletter */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            Newsletter
                          </h3>
                          <p className="text-sm text-gray-600">
                            Receive our weekly newsletter with updates and offers
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.newsletter}
                            onChange={(e) => handlePreferenceChange('newsletter', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          variant="primary"
                          loading={loading}
                          className="flex items-center"
                        >
                          <FiSave className="mr-2 w-4 h-4" />
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Privacy Settings Tab */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Privacy Settings
                    </h2>
                    <p className="text-gray-600">
                      Control your privacy and data sharing preferences
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Profile Visibility
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="public"
                            checked={privacySettings.profileVisibility === 'public'}
                            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Public - Anyone can view your profile
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="private"
                            checked={privacySettings.profileVisibility === 'private'}
                            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Private - Only you can view your profile
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Data Sharing */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Data Sharing
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Show Order History
                            </h4>
                            <p className="text-sm text-gray-600">
                              Allow others to see your order history
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings.showOrderHistory}
                              onChange={(e) => handlePrivacyChange('showOrderHistory', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Allow Data Sharing
                            </h4>
                            <p className="text-sm text-gray-600">
                              Share anonymized data for analytics
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings.allowDataSharing}
                              onChange={(e) => handlePrivacyChange('allowDataSharing', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Opt Out of Tracking
                            </h4>
                            <p className="text-sm text-gray-600">
                              Disable analytics and tracking cookies
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings.trackingOptOut}
                              onChange={(e) => handlePrivacyChange('trackingOptOut', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Public Reviews
                            </h4>
                            <p className="text-sm text-gray-600">
                              Show your name on product reviews
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings.reviewsPublic}
                              onChange={(e) => handlePrivacyChange('reviewsPublic', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Account Settings Tab */}
              {activeTab === 'account' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Account Settings
                    </h2>
                    <p className="text-gray-600">
                      Advanced account management options
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-gray-600">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={accountSettings.twoFactorEnabled}
                            onChange={(e) => handleAccountSettingChange('twoFactorEnabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      {accountSettings.twoFactorEnabled && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center">
                            <FiShield className="w-5 h-5 text-green-500 mr-2" />
                            <span className="text-sm text-green-700 dark:text-green-400">
                              Two-factor authentication is enabled
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Login Notifications */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Login Notifications
                          </h3>
                          <p className="text-sm text-gray-600">
                            Get notified when someone logs into your account
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={accountSettings.loginNotifications}
                            onChange={(e) => handleAccountSettingChange('loginNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    {/* Data Export */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Data Export
                          </h3>
                          <p className="text-sm text-gray-600">
                            Download all your account data
                          </p>
                        </div>
                        <Button
                          variant="primary"
                          onClick={handleDataExport}
                          disabled={accountSettings.dataExportRequested}
                          className="flex items-center"
                        >
                          <FiDownload className="mr-2 w-4 h-4" />
                          {accountSettings.dataExportRequested ? 'Export Requested' : 'Export Data'}
                        </Button>
                      </div>
                      {accountSettings.dataExportRequested && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center">
                            <FiDownload className="w-5 h-5 text-blue-500 mr-2" />
                            <span className="text-sm text-blue-700 dark:text-blue-400">
                              Data export requested. You will receive an email within 24 hours.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Account Deactivation */}
                    <div className="border border-red-200 dark:border-red-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-red-900 dark:text-red-400">
                            Account Deactivation
                          </h3>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Permanently deactivate your account
                          </p>
                        </div>
                        <Button
                          variant="danger"
                          onClick={handleAccountDeactivation}
                          disabled={accountSettings.accountDeactivationRequested}
                          className="flex items-center bg-red-600 hover:bg-red-700 text-white"
                        >
                          <FiAlertTriangle className="mr-2 w-4 h-4" />
                          {accountSettings.accountDeactivationRequested ? 'Deactivation Requested' : 'Deactivate Account'}
                        </Button>
                      </div>
                      {accountSettings.accountDeactivationRequested && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div className="flex items-center">
                            <FiAlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                            <span className="text-sm text-red-700 dark:text-red-400">
                              Account deactivation requested. You will receive a confirmation email.
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs text-gray-600">
                          <strong>Warning:</strong> Account deactivation is permanent and cannot be undone. 
                          All your data, orders, and preferences will be permanently deleted.
                        </p>
                      </div>
                    </div>
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

export default Profile;
