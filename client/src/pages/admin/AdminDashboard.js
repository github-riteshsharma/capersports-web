import React, { useEffect, useState } from 'react';
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
  FiArrowDownRight,
  FiMoreHorizontal,
  FiCheck,
  FiX,
  FiUser,
  FiCalendar,
  FiMessageCircle,
  FiHeart,
  FiShare2,
  FiRefreshCw,
  FiFilter,
  FiFileText
} from 'react-icons/fi';

// Store
import { getDashboardData } from '../../store/slices/adminSlice';
import ModernLoader, { CardLoader } from '../../components/common/ModernLoader';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  // E-commerce focused data for Caper Sports
  const dashboardData = {
    totalProducts: 156,
    totalUsers: 1234,
    totalOrders: 89,
    totalRevenue: 125000,
    recentOrders: [
      {
        id: 'ORD-001',
        customer: 'John Smith',
        product: 'Premium Running Shoes',
        amount: 4999,
        status: 'Processing',
        date: '2025-01-10',
        avatar: 'JS'
      },
      {
        id: 'ORD-002',
        customer: 'Sarah Johnson',
        product: 'Athletic Performance T-Shirt',
        amount: 1299,
        status: 'Shipped',
        date: '2025-01-10',
        avatar: 'SJ'
      },
      {
        id: 'ORD-003',
        customer: 'Mike Wilson',
        product: 'Training Shorts',
        amount: 2499,
        status: 'Delivered',
        date: '2025-01-09',
        avatar: 'MW'
      },
      {
        id: 'ORD-004',
        customer: 'Emma Davis',
        product: 'Compression Leggings',
        amount: 3299,
        status: 'Pending',
        date: '2025-01-09',
        avatar: 'ED'
      }
    ],
    topProducts: [
      { id: 1, name: 'Premium Running Shoes', sales: 45, revenue: 224550, trend: 'up' },
      { id: 2, name: 'Athletic Performance T-Shirt', sales: 38, revenue: 49362, trend: 'up' },
      { id: 3, name: 'Training Shorts', sales: 32, revenue: 31968, trend: 'down' },
      { id: 4, name: 'Compression Leggings', sales: 28, revenue: 64372, trend: 'up' },
      { id: 5, name: 'Performance Hoodie', sales: 25, revenue: 87475, trend: 'up' }
    ],
    salesData: {
      thisMonth: [12, 19, 15, 27, 32, 25, 18, 22, 28, 35, 30, 42],
      lastMonth: [8, 15, 12, 20, 25, 18, 14, 18, 22, 28, 24, 35]
    },
    lowStockProducts: [
      { id: 1, name: 'Premium Running Shoes', stock: 5, threshold: 10 },
      { id: 2, name: 'Sports Bra', stock: 3, threshold: 10 },
      { id: 3, name: 'Training Shorts', stock: 7, threshold: 10 }
    ]
  };

  // Use dashboard data from store or fallback to mock data
  const data = dashboard.totalProducts ? dashboard : dashboardData;

  const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'bg-gradient-to-br from-blue-500 to-blue-600' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
          {change && (
            <div className={`flex items-center text-sm font-medium ${
              changeType === 'increase' 
                ? 'text-green-600' 
                : 'text-red-500'
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
        <div className={`p-4 rounded-xl ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const OrderRow = ({ order }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-4 px-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50/50 transition-all duration-200 border-b border-gray-100/60 last:border-b-0 group"
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-105 transition-transform duration-200">
          {order?.avatar || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-1">
            <h4 className="text-sm font-semibold text-gray-900">{order?.id || 'N/A'}</h4>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              order?.status === 'Delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
              order?.status === 'Shipped' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
              order?.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
              'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              {order?.status || 'Unknown'}
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">{order?.customer || 'Unknown'} • {order?.product || 'No product'}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-6 text-sm">
        <div className="text-right">
          <p className="font-bold text-gray-900 text-lg">₹{(order?.amount || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500">{order?.date || 'N/A'}</p>
        </div>
      </div>
    </motion.div>
  );

  const SalesChart = () => (
    <div className="h-48 flex items-end justify-center space-x-2 pt-4">
      {(data.salesData?.thisMonth || []).map((value, index) => (
        <div key={index} className="flex flex-col items-center space-y-1">
          <div 
            className="w-6 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
            style={{ height: `${((value || 0) / 50) * 120}px` }}
          ></div>
          <div className="text-xs text-gray-500">{index + 1}</div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          {/* Page Header Skeleton */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl px-6 py-4 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>

          {/* Welcome Header Skeleton */}
          <div className="bg-gray-200 rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-96"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <CardLoader key={i} />
            ))}
          </div>

          {/* Loading Center */}
          <div className="flex items-center justify-center py-12">
            <ModernLoader size="large" text="Loading dashboard data..." />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">Error loading dashboard: {error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard - Caper Sports</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Page Header with Breadcrumb */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-sm mb-2">
                <span className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                  Home
                </span>
                <span className="mx-2 text-gray-300">/</span>
                <span className="text-blue-600 font-semibold">Dashboard</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                <FiRefreshCw className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                <FiFilter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
              <p className="text-red-100">Here's what's happening with your Caper Sports store today.</p>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={(dashboardData.totalProducts || 0).toLocaleString()}
            icon={FiShoppingBag}
            change="+12%"
            changeType="increase"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Users"
            value={(dashboardData.totalUsers || 0).toLocaleString()}
            icon={FiUsers}
            change="+8%"
            changeType="increase"
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Total Orders"
            value={(dashboardData.totalOrders || 0).toLocaleString()}
            icon={FiShoppingCart}
            change="+15%"
            changeType="increase"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${(dashboardData.totalRevenue || 0).toLocaleString()}`}
            icon={FiDollarSign}
            change="+23%"
            changeType="increase"
            color="bg-gradient-to-br from-orange-500 to-red-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6 border-b border-gray-100/60">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Latest customer orders and their status
                  </p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  <span>View All</span>
                  <FiArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Order Headers */}
            <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-50/50 border-b border-gray-100/60">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
                <span>Customer & Order</span>
                <span>Amount & Date</span>
              </div>
            </div>

            {/* Orders List */}
            <div className="divide-y divide-gray-100">
              {(dashboardData.recentOrders || []).map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Sales Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>This Month</span>
                  <FiTrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Sales</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">Daily sales for current month</p>
              
              <SalesChart />
            </motion.div>

            {/* Low Stock Alert */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiAlertTriangle className="mr-2 text-red-500" />
                  Low Stock Alert
                </h3>
                <Link
                  to="/admin/products"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Manage
                </Link>
              </div>
              
              <div className="space-y-3">
                {(data.lowStockProducts || []).map((product) => (
                  <div key={product.id} className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">Threshold: {product.threshold}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-600">{product.stock} left</p>
                        <div className="flex space-x-2 mt-1">
                          <button className="text-xs text-blue-600 hover:text-blue-800">
                            <FiEye className="w-3 h-3" />
                          </button>
                          <button className="text-xs text-green-600 hover:text-green-800">
                            <FiEdit className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
              <Link
                to="/admin/products"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <FiArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {(data.topProducts || []).map((product, index) => (
                <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    {product.trend === 'up' ? (
                      <FiTrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <FiTrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">{product.sales} sales</p>
                    <p className="text-sm font-bold text-gray-900">
                      ₹{(product.revenue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;