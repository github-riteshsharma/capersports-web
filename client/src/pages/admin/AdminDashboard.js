import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiUsers, 
  FiShoppingCart, 
  FiDollarSign, 
  FiTrendingUp, 
  FiTrendingDown,
  FiPackage,
  FiAlertTriangle,
  FiEye,
  FiEdit,
  FiBarChart3,
  FiPieChart,
  FiActivity,
  FiClock,
  FiStar,
  FiArrowUpRight,
  FiArrowDownRight
} from 'react-icons/fi';

// Store
import { getDashboardData } from '../../store/slices/adminSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  // Mock data for demonstration (replace with actual data from dashboard)
  const mockData = {
    totalProducts: 156,
    totalUsers: 1234,
    totalOrders: 89,
    monthlyRevenue: 125000,
    yearlyRevenue: 1250000,
    monthlyOrders: 89,
    orderStatusStats: [
      { status: 'Pending', count: 12, color: 'bg-yellow-500' },
      { status: 'Processing', count: 8, color: 'bg-blue-500' },
      { status: 'Shipped', count: 15, color: 'bg-purple-500' },
      { status: 'Delivered', count: 45, color: 'bg-green-500' },
      { status: 'Cancelled', count: 9, color: 'bg-red-500' }
    ],
    topProducts: [
      { id: 1, name: 'Premium Running Shoes', sales: 45, revenue: 224550 },
      { id: 2, name: 'Athletic Performance T-Shirt', sales: 38, revenue: 49362 },
      { id: 3, name: 'Training Shorts', sales: 32, revenue: 31968 },
      { id: 4, name: 'Compression Leggings', sales: 28, revenue: 64372 },
      { id: 5, name: 'Performance Hoodie', sales: 25, revenue: 87475 }
    ],
    recentOrders: [
      { id: 'ORD-001', customer: 'John Doe', amount: 4999, status: 'Pending', date: '2025-07-18' },
      { id: 'ORD-002', customer: 'Jane Smith', amount: 1299, status: 'Processing', date: '2025-07-18' },
      { id: 'ORD-003', customer: 'Mike Johnson', amount: 3499, status: 'Shipped', date: '2025-07-17' },
      { id: 'ORD-004', customer: 'Sarah Wilson', amount: 2299, status: 'Delivered', date: '2025-07-17' },
      { id: 'ORD-005', customer: 'Chris Brown', amount: 999, status: 'Cancelled', date: '2025-07-16' }
    ],
    lowStockProducts: [
      { id: 1, name: 'Premium Running Shoes', stock: 5, threshold: 10 },
      { id: 2, name: 'Sports Bra', stock: 3, threshold: 10 },
      { id: 3, name: 'Training Shorts', stock: 7, threshold: 10 }
    ]
  };

  // Use mock data for now, replace with actual dashboard data when available
  const data = dashboard.totalProducts ? dashboard : mockData;

  const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'bg-gradient-to-br from-blue-500 to-blue-600' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl p-6 border border-gray-100 dark:border-gray-700 group cursor-pointer transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-3">{value}</p>
          {change && (
            <div className={`flex items-center text-sm font-medium ${
              changeType === 'increase' 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-red-500 dark:text-red-400'
            }`}>
              {changeType === 'increase' ? (
                <FiArrowUpRight className="mr-1 w-4 h-4" />
              ) : (
                <FiArrowDownRight className="mr-1 w-4 h-4" />
              )}
              <span>{change}</span>
              <span className="ml-1 text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 text-lg">Error loading dashboard: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Caper Sports</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
                  Welcome back! Here's what's happening with your store today.
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Updates</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            <StatCard
              title="Total Products"
              value={data.totalProducts.toLocaleString()}
              icon={FiShoppingBag}
              change="+12%"
              changeType="increase"
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              title="Total Users"
              value={data.totalUsers.toLocaleString()}
              icon={FiUsers}
              change="+8%"
              changeType="increase"
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <StatCard
              title="Total Orders"
              value={data.totalOrders.toLocaleString()}
              icon={FiShoppingCart}
              change="+15%"
              changeType="increase"
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              title="Monthly Revenue"
              value={`₹${data.monthlyRevenue.toLocaleString()}`}
              icon={FiDollarSign}
              change="+23%"
              changeType="increase"
              color="bg-gradient-to-br from-amber-500 to-orange-500"
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Order Status Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Status Overview
              </h3>
              <div className="space-y-4">
                {data.orderStatusStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${stat.color} mr-3`}></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {stat.status}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {stat.count}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Selling Products
              </h3>
              <div className="space-y-4">
                {data.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-3">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.sales} sales
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      ₹{(product.revenue || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Orders
                </h3>
                <Link
                  to="/admin/orders"
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {data.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {order.customer} • {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        ₹{(order.amount || 0).toLocaleString()}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Low Stock Alert */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiAlertTriangle className="mr-2 text-red-500" />
                  Low Stock Alert
                </h3>
                <Link
                  to="/admin/products"
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Manage
                </Link>
              </div>
              <div className="space-y-4">
                {data.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Threshold: {product.threshold}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600 dark:text-red-400">
                        {product.stock} left
                      </p>
                      <div className="flex space-x-2 mt-1">
                        <button className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          <FiEye className="w-3 h-3" />
                        </button>
                        <button className="text-xs text-green-600 hover:text-green-800 dark:text-green-400">
                          <FiEdit className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/products"
                className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <FiShoppingBag className="mr-3 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Manage Products
                </span>
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <FiShoppingCart className="mr-3 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-900 dark:text-green-300">
                  View Orders
                </span>
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <FiUsers className="mr-3 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
                  Manage Users
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
