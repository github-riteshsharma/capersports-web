import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiTrendingDown,
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiDownload,
  FiCalendar,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiShare
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock reports data
  const overviewStats = {
    totalRevenue: 450000,
    totalOrders: 1250,
    totalCustomers: 890,
    averageOrderValue: 3600,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    customersGrowth: 15.2,
    aovGrowth: -2.1
  };

  const topProducts = [
    { name: 'Nike Air Max 270', sales: 145, revenue: 290000, growth: 23.5 },
    { name: 'Adidas Ultraboost 22', sales: 128, revenue: 256000, growth: 18.2 },
    { name: 'Puma RS-X', sales: 95, revenue: 190000, growth: -5.3 },
    { name: 'Nike React Infinity', sales: 87, revenue: 174000, growth: 12.8 },
    { name: 'Adidas Stan Smith', sales: 76, revenue: 152000, growth: 8.9 }
  ];

  const recentReports = [
    { id: 1, name: 'Monthly Sales Report', type: 'Sales', date: '2025-01-15', status: 'Ready', size: '2.4 MB' },
    { id: 2, name: 'Customer Analytics', type: 'Analytics', date: '2025-01-14', status: 'Processing', size: '1.8 MB' },
    { id: 3, name: 'Inventory Report', type: 'Inventory', date: '2025-01-13', status: 'Ready', size: '3.2 MB' },
    { id: 4, name: 'Financial Summary', type: 'Finance', date: '2025-01-12', status: 'Ready', size: '1.5 MB' },
    { id: 5, name: 'Marketing Performance', type: 'Marketing', date: '2025-01-11', status: 'Ready', size: '2.1 MB' }
  ];

  const reportCategories = [
    { name: 'Sales Reports', count: 12, icon: FiBarChart2, color: 'blue' },
    { name: 'Customer Analytics', count: 8, icon: FiUsers, color: 'green' },
    { name: 'Product Performance', count: 15, icon: FiShoppingBag, color: 'purple' },
    { name: 'Financial Reports', count: 6, icon: FiDollarSign, color: 'orange' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Reports - Admin - Caper Sports</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Comprehensive business insights and data analysis</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center space-x-2 transition-all duration-200">
              <FiDownload className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'products', 'customers', 'finance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Stats */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">₹{overviewStats.totalRevenue.toLocaleString('en-IN')}</p>
                    <div className="flex items-center mt-2">
                      <FiTrendingUp className="w-4 h-4 mr-1 text-green-500" />
                      <span className="text-sm font-medium text-green-600">+{overviewStats.revenueGrowth}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiDollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              {/* Total Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{overviewStats.totalOrders.toLocaleString('en-IN')}</p>
                    <div className="flex items-center mt-2">
                      <FiTrendingUp className="w-4 h-4 mr-1 text-green-500" />
                      <span className="text-sm font-medium text-green-600">+{overviewStats.ordersGrowth}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiShoppingBag className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              {/* Total Customers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{overviewStats.totalCustomers.toLocaleString('en-IN')}</p>
                    <div className="flex items-center mt-2">
                      <FiTrendingUp className="w-4 h-4 mr-1 text-green-500" />
                      <span className="text-sm font-medium text-green-600">+{overviewStats.customersGrowth}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>

              {/* Average Order Value */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">₹{overviewStats.averageOrderValue.toLocaleString('en-IN')}</p>
                    <div className="flex items-center mt-2">
                      <FiTrendingDown className="w-4 h-4 mr-1 text-red-500" />
                      <span className="text-sm font-medium text-red-600">{overviewStats.aovGrowth}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FiBarChart2 className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Top Performing Products</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Product</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Sales</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Revenue</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topProducts.map((product, index) => (
                      <tr key={product.name} className="hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-sm font-semibold text-gray-600">#{index + 1}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">{product.sales} units</td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-900">₹{product.revenue.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {product.growth >= 0 ? (
                              <FiTrendingUp className="w-4 h-4 mr-1 text-green-500" />
                            ) : (
                              <FiTrendingDown className="w-4 h-4 mr-1 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {product.growth >= 0 ? '+' : ''}{product.growth}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {/* Report Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Report Categories</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.name}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(category.color)} group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-bold text-gray-900">{category.count}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500">Available reports</p>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                  <FiFilter className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                  <FiRefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Report Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Size</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{report.name}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {report.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{report.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{report.size}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors duration-200" title="View">
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-green-600 transition-colors duration-200" title="Download">
                          <FiDownload className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-purple-600 transition-colors duration-200" title="Share">
                          <FiShare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
