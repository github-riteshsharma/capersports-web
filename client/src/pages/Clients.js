import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FiSearch, FiUser, FiMoreVertical, FiPlus, FiCalendar, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import CaperSportsLoader from '../components/common/CaperSportsLoader';
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useDeleteClientMutation,
} from '../store/services/clientService';

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // active, past, all
  const [selectedClient, setSelectedClient] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [newClientData, setNewClientData] = useState({
    name: '',
    program: '',
    clientSince: '',
    avatar: null,
    photos: []
  });
  const [photoInput, setPhotoInput] = useState('');

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.isAdmin || false;
  
  // Debug logging
  console.log('🔍 Client Page Debug:', {
    user,
    isAdmin,
    userIsAdmin: user?.isAdmin,
    userKeys: user ? Object.keys(user) : 'no user'
  });

  // Fetch clients from API
  const { data: clients = [], isLoading, error } = useGetClientsQuery({ 
    status: activeTab === 'all' ? undefined : activeTab,
    search: searchQuery 
  });

  // Mutations
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  // Calculate tab counts
  const activeCount = clients.filter(c => c.status === 'active').length;
  const pastCount = clients.filter(c => c.status === 'past').length;
  const allCount = clients.length;

  // Filter clients
  const filteredClients = clients;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <CaperSportsLoader size="xl" showText />
      </div>
    );
  }

  if (error) {
    console.error('Client fetch error:', error);
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiX className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Clients</h2>
            <p className="text-gray-600 mb-6">
              {error?.data?.message || error?.error || 'Unable to fetch clients from the server'}
            </p>
            
            {/* Debug Info */}
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <p className="text-sm font-semibold text-gray-700 mb-2">Debug Information:</p>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300"
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Clients - Caper Sports</title>
        <meta name="description" content="Manage your clients and track their orders" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            {/* Subtitle */}
            <p className="text-gray-500 text-sm mb-2">{activeCount} Active Clients</p>
            
            {/* Title and Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Clients</h1>
              
              {/* Search and New Client Button */}
              <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 lg:w-80">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search Clients"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
                
                {/* New Client Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddClientModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 whitespace-nowrap"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>New Client</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-8 mb-8 border-b border-gray-200"
          >
            {[
              { key: 'active', label: 'Active Clients', count: activeCount },
              { key: 'past', label: 'Past Clients', count: pastCount },
              { key: 'all', label: 'All Clients', count: allCount }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative pb-4 px-1"
              >
                <span className={`text-sm font-semibold transition-colors ${
                  activeTab === tab.key ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}>
                  {tab.label} ({tab.count})
                </span>
                
                {/* Active Tab Indicator */}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-600"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>

          {/* Clients Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
          >
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  transition: { 
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }
                }}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 aspect-[3/4] cursor-pointer"
              >
                {/* Background Image - Always Full */}
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                  {client.avatar ? (
                    <img 
                      src={client.avatar} 
                      alt={client.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                      <FiUser className="w-20 h-20 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Subtle Bottom Gradient - Always visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />

                {/* Details Overlay - Show on Hover */}
                <div className="absolute inset-0 p-2 sm:p-4 md:p-6 z-20 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  
                  {/* Top Section with Header */}
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    {/* Client Info Card */}
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-xl"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-2 ring-green-500">
                            {client.avatar ? (
                              <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <FiUser className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          {/* Online Status */}
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        
                        {/* Name and Program */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 leading-tight truncate">
                            {client.name}
                          </h3>
                          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 truncate">
                            {client.program}
                          </p>
                        </div>

                        {/* Menu Button with Delete - Temporarily enabled for testing */}
                        <div className="relative group/menu">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 sm:p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                          >
                            <FiMoreVertical className="text-gray-600 w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          </motion.button>
                          
                          {/* Dropdown Menu */}
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-30">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setClientToDelete(client);
                                setShowDeleteModal(true);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <FiX className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Client Since Badge */}
                      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border border-green-100">
                        <FiCalendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-green-700 uppercase tracking-wide">Client Since</p>
                          <p className="text-[10px] sm:text-xs md:text-sm font-bold text-green-900 truncate">{client.clientSince}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom Section - CTA Button */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedClient(client);
                        setCurrentPhotoIndex(0);
                      }}
                      className="w-full px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 shadow-lg shadow-green-500/50"
                    >
                      <span className="text-[10px] sm:text-xs md:text-sm">View Full Profile</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <FiUser className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      </motion.div>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredClients.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiUser className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {clients.length === 0 ? 'No clients yet' : 'No clients found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {clients.length === 0 
                  ? 'Get started by adding your first client!' 
                  : 'Try adjusting your search or filters'}
              </p>
              
              {/* Show Add Client button if no clients exist */}
              {clients.length === 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddClientModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Add Your First Client</span>
                </motion.button>
              )}
            </motion.div>
          )}
        </div>

        {/* Client Photo Gallery Modal */}
        <AnimatePresence>
          {selectedClient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedClient(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-white via-white to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-green-500">
                        {selectedClient.avatar ? (
                          <img src={selectedClient.avatar} alt={selectedClient.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <FiUser className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h3>
                        <p className="text-gray-600">{selectedClient.program}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedClient(null)}
                      className="p-3 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Photo Gallery */}
                <div className="pt-32 pb-8 px-8 max-h-[90vh] overflow-y-auto">
                  {/* Main Photo Display */}
                  <div className="relative mb-8">
                    <motion.div
                      key={currentPhotoIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100"
                    >
                      <img
                        src={selectedClient.photos[currentPhotoIndex]}
                        alt={`${selectedClient.name} - Photo ${currentPhotoIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-product.jpg';
                        }}
                      />
                      
                      {/* Photo Counter */}
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold">
                        {currentPhotoIndex + 1} / {selectedClient.photos.length}
                      </div>
                    </motion.div>

                    {/* Navigation Arrows */}
                    {selectedClient.photos.length > 1 && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1, x: -4 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCurrentPhotoIndex((prev) => (prev === 0 ? selectedClient.photos.length - 1 : prev - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/90 backdrop-blur-md hover:bg-white rounded-full shadow-xl transition-all"
                        >
                          <FiChevronLeft className="w-6 h-6 text-gray-900" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, x: 4 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCurrentPhotoIndex((prev) => (prev === selectedClient.photos.length - 1 ? 0 : prev + 1))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/90 backdrop-blur-md hover:bg-white rounded-full shadow-xl transition-all"
                        >
                          <FiChevronRight className="w-6 h-6 text-gray-900" />
                        </motion.button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    {selectedClient.photos.map((photo, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                          currentPhotoIndex === index
                            ? 'ring-4 ring-green-500 shadow-lg'
                            : 'ring-2 ring-gray-200 hover:ring-gray-300'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/placeholder-product.jpg';
                          }}
                        />
                        {currentPhotoIndex === index && (
                          <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[1px]" />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Client Info */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700 mb-1">Client Since</p>
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-5 h-5 text-green-600" />
                          <p className="text-lg font-bold text-green-900">{selectedClient.clientSince}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-700 mb-1">Total Photos</p>
                        <p className="text-2xl font-bold text-green-900">{selectedClient.photos.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Client Modal */}
        <AnimatePresence>
          {showAddClientModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddClientModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Add New Client</h3>
                      <p className="text-gray-600 mt-1">Fill in the details to add a new client</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowAddClientModal(false)}
                      className="p-3 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Modal Body - Form */}
                <div className="p-6 overflow-y-auto flex-1">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      
                      try {
                        // Create new client
                        const allPhotos = newClientData.avatar 
                          ? [newClientData.avatar, ...newClientData.photos]
                          : newClientData.photos;
                        
                        await createClient({
                          name: newClientData.name,
                          program: newClientData.program,
                          avatar: newClientData.avatar,
                          clientSince: newClientData.clientSince,
                          status: 'active',
                          photos: allPhotos.length > 0 ? allPhotos : []
                        }).unwrap();

                        // Reset form and close modal
                        setNewClientData({
                          name: '',
                          program: '',
                          clientSince: '',
                          avatar: null,
                          photos: []
                        });
                        setPhotoInput('');
                        setShowAddClientModal(false);
                      } catch (error) {
                        console.error('Failed to create client:', error);
                        alert(error?.data?.message || 'Failed to create client. Please try again.');
                      }
                    }}
                    className="space-y-6"
                  >
                    {/* Client Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Client Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newClientData.name}
                        onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                        placeholder="Enter client name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Program */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Program <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newClientData.program}
                        onChange={(e) => setNewClientData({ ...newClientData, program: e.target.value })}
                        placeholder="e.g., Cricket Team Kit"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Client Since */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Client Since <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newClientData.clientSince}
                        onChange={(e) => setNewClientData({ ...newClientData, clientSince: e.target.value })}
                        placeholder="e.g., January 2024"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Avatar URL */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Avatar Image URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={newClientData.avatar || ''}
                        onChange={(e) => setNewClientData({ ...newClientData, avatar: e.target.value || null })}
                        placeholder="Enter image URL or path"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Example: /images/client-photo.jpg
                      </p>
                    </div>

                    {/* Avatar Preview */}
                    {newClientData.avatar && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Avatar Preview
                        </label>
                        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-green-500">
                          <img
                            src={newClientData.avatar}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/images/placeholder-product.jpg';
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Client Photos Gallery */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Client Photos Gallery
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Add photos of the client wearing your products
                      </p>
                      
                      {/* Photo Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={photoInput}
                          onChange={(e) => setPhotoInput(e.target.value)}
                          placeholder="Enter photo URL or path"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (photoInput.trim()) {
                              setNewClientData({
                                ...newClientData,
                                photos: [...newClientData.photos, photoInput.trim()]
                              });
                              setPhotoInput('');
                            }
                          }}
                          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
                        >
                          <FiPlus className="w-4 h-4" />
                          Add
                        </motion.button>
                      </div>

                      {/* Photos Preview Grid */}
                      {newClientData.photos.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-gray-700 mb-3">
                            Added Photos ({newClientData.photos.length})
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                            {newClientData.photos.map((photo, index) => (
                              <div key={index} className="relative group aspect-square">
                                <img
                                  src={photo}
                                  alt={`Photo ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.src = '/images/placeholder-product.jpg';
                                  }}
                                />
                                <motion.button
                                  type="button"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setNewClientData({
                                      ...newClientData,
                                      photos: newClientData.photos.filter((_, i) => i !== index)
                                    });
                                  }}
                                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FiX className="w-3 h-3" />
                                </motion.button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Form Buttons */}
                    <div className="flex gap-4 pt-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddClientModal(false)}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-all duration-300"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isCreating}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCreating ? 'Adding...' : 'Add Client'}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && clientToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => {
                setShowDeleteModal(false);
                setClientToDelete(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Warning Icon */}
                <div className="p-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiX className="w-8 h-8 text-red-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Delete Client?
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Are you sure you want to delete <span className="font-semibold">{clientToDelete.name}</span>? This action cannot be undone.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowDeleteModal(false);
                        setClientToDelete(null);
                      }}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        try {
                          // Delete the client
                          await deleteClient(clientToDelete._id).unwrap();
                          setShowDeleteModal(false);
                          setClientToDelete(null);
                        } catch (error) {
                          console.error('Failed to delete client:', error);
                          alert(error?.data?.message || 'Failed to delete client. Please try again.');
                        }
                      }}
                      disabled={isDeleting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Clients;
