import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  FiSearch, 
  FiFilter, 
  FiEye,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiDownload
} from 'react-icons/fi';

// Store
import { getAdminOrders, updateOrderStatus } from '../../store/slices/adminSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, pagination } = useSelector((state) => state.admin);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Fetch orders on component mount and when filters change
  useEffect(() => {
    const filters = {
      search: searchQuery,
      status: statusFilter,
      sortBy: sortBy,
      page: pagination.page,
      limit: pagination.limit
    };
    
    dispatch(getAdminOrders(filters));
  }, [dispatch, searchQuery, statusFilter, sortBy, pagination.page, pagination.limit]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error(error || 'Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'processing':
        return <FiPackage className="w-4 h-4" />;
      case 'shipped':
        return <FiTruck className="w-4 h-4" />;
      case 'delivered':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <FiXCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const OrderCard = ({ order, onStatusUpdate }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
      >
        {/* Enhanced Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-700/50 dark:via-gray-600/50 dark:to-gray-700/50 p-6 border-b border-gray-200/30 dark:border-gray-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order._id)}
                  onChange={() => setSelectedOrders(prev => 
                    prev.includes(order._id) 
                      ? prev.filter(id => id !== order._id)
                      : [...prev, order._id]
                  )}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg transition-all duration-200 hover:scale-110"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <FiPackage className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                    #{order.orderNumber}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 ml-11 flex items-center">
                  <FiCalendar className="h-3 w-3 mr-1" />
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center shadow-lg ${getStatusColor(order.orderStatus)} transition-all duration-200 hover:scale-105`}>
                {getStatusIcon(order.orderStatus)}
                <span className="ml-2 capitalize">{order.orderStatus}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Content Area */}
        <div className="p-6 space-y-6">
          {/* Customer & Order Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-xl p-4 border border-blue-200/30 dark:border-gray-600/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                    {order.user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Value Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-xl p-4 border border-green-200/30 dark:border-gray-600/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <FiDollarSign className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    ₹{order.total?.toFixed(2) || order.totalAmount?.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {order.items?.length} item(s)
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Info Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-xl p-4 border border-purple-200/30 dark:border-gray-600/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <FiClock className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                    {order.paymentMethod}
                  </p>
                  <p className={`text-xs font-medium capitalize ${
                    order.paymentStatus === 'paid' 
                      ? 'text-green-600 dark:text-green-400' 
                      : order.paymentStatus === 'pending'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Bar */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-xl border border-gray-200/30 dark:border-gray-600/30">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiTruck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
              </div>
              <select
                key={`${order._id}-${order.orderStatus}`}
                value={order.orderStatus || 'pending'}
                onChange={(e) => onStatusUpdate(order._id, e.target.value)}
                className="px-4 py-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium transition-all duration-200 hover:shadow-md"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/orders/${order._id}`, '_blank')}
                className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <FiEye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Invoice
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading orders..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Orders - CaperSports</title>
        <meta name="description" content="Manage orders - View, edit, and track order status" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Helmet>
          <title>Manage Orders - CaperSports Admin</title>
          <style type="text/css">{`
            body {
              padding-top: 4rem;
            }
            @media (min-width: 768px) {
              body {
                padding-top: 5rem;
              }
            }
          `}</style>
        </Helmet>

        {/* Enhanced Header */}
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 mt-16 relative z-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <FiPackage className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                    Manage Orders
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-300 ml-11">
                  Track and manage customer orders with real-time status updates
                </p>
                <div className="flex items-center space-x-6 ml-11 text-sm">
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Live Updates</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    <FiTruck className="h-4 w-4" />
                    <span>{orders?.length || 0} Total Orders</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200"
                >
                  <FiFilter className="h-4 w-4" />
                  <span>Filters</span>
                  {showFilters && <div className="w-2 h-2 bg-blue-500 rounded-full ml-1"></div>}
                </Button>
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <FiDownload className="h-4 w-4 mr-2" />
                  Export Orders
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search orders by order number, customer name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                  />
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 pr-10 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200 appearance-none bg-white/50"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 pr-10 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200 appearance-none bg-white/50"
                  >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="-total">Highest Amount</option>
                    <option value="total">Lowest Amount</option>
                  </select>
                  <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Orders List */}
          {error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-red-200/50 dark:border-red-800/50"
            >
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FiXCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-600 dark:text-red-400 text-lg font-medium mb-2">
                Error loading orders
              </p>
              <p className="text-red-500 dark:text-red-300 text-sm">
                {error}
              </p>
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FiPackage className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-xl font-medium mb-2">
                No orders found
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Try adjusting your search or filters to find orders.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                }}
                variant="outline"
                className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <OrderCard order={order} onStatusUpdate={handleStatusUpdate} />
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Pagination */}
              {pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center justify-center mt-12"
              >
                <div className="flex items-center space-x-3 bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => {
                      // Handle previous page
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 font-medium text-gray-700 dark:text-gray-200"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                      let page;
                      if (pagination.pages <= 5) {
                        page = i + 1;
                      } else if (pagination.page <= 3) {
                        page = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        page = pagination.pages - 4 + i;
                      } else {
                        page = pagination.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => {
                            // Handle page change
                          }}
                          className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                            page === pagination.page
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    disabled={pagination.page === pagination.pages}
                    onClick={() => {
                      // Handle next page
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 font-medium text-gray-700 dark:text-gray-200"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
