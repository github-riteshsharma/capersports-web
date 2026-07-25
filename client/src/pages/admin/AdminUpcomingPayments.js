import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiAlertCircle,
  FiCheckCircle,
  FiDollarSign,
  FiUser,
  FiTruck,
  FiCreditCard,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiEdit,
  FiSend
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminUpcomingPayments = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock upcoming payments data
  const paymentSummary = {
    totalUpcoming: 285000,
    overdue: 45000,
    dueToday: 75000,
    dueThisWeek: 165000
  };

  const upcomingPayments = [
    {
      id: 1,
      type: 'vendor',
      recipient: 'Nike India Pvt Ltd',
      description: 'Inventory Purchase - Q1 2025',
      amount: 125000,
      dueDate: '2025-01-20',
      status: 'pending',
      priority: 'high',
      paymentMethod: 'Bank Transfer',
      invoiceNumber: 'INV-NK-2025-001'
    },
    {
      id: 2,
      type: 'employee',
      recipient: 'Marketing Team',
      description: 'Monthly Salary - January 2025',
      amount: 85000,
      dueDate: '2025-01-25',
      status: 'scheduled',
      priority: 'high',
      paymentMethod: 'Direct Deposit',
      invoiceNumber: 'PAY-SAL-2025-001'
    },
    {
      id: 3,
      type: 'service',
      recipient: 'DHL Express',
      description: 'Shipping & Logistics Services',
      amount: 15000,
      dueDate: '2025-01-18',
      status: 'overdue',
      priority: 'medium',
      paymentMethod: 'Credit Card',
      invoiceNumber: 'INV-DHL-2025-003'
    },
    {
      id: 4,
      type: 'vendor',
      recipient: 'Adidas Sports India',
      description: 'Product Procurement',
      amount: 95000,
      dueDate: '2025-01-22',
      status: 'pending',
      priority: 'medium',
      paymentMethod: 'Bank Transfer',
      invoiceNumber: 'INV-AD-2025-002'
    },
    {
      id: 5,
      type: 'service',
      recipient: 'Google Ads',
      description: 'Digital Marketing Campaign',
      amount: 25000,
      dueDate: '2025-01-15',
      status: 'overdue',
      priority: 'low',
      paymentMethod: 'Credit Card',
      invoiceNumber: 'INV-GOO-2025-001'
    },
    {
      id: 6,
      type: 'utility',
      recipient: 'Mumbai Electricity Board',
      description: 'Monthly Electricity Bill',
      amount: 8500,
      dueDate: '2025-01-28',
      status: 'pending',
      priority: 'low',
      paymentMethod: 'Auto Debit',
      invoiceNumber: 'ELEC-2025-001'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'vendor': return FiTruck;
      case 'employee': return FiUser;
      case 'service': return FiCreditCard;
      case 'utility': return FiDollarSign;
      default: return FiDollarSign;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'vendor': return 'bg-blue-100 text-blue-600';
      case 'employee': return 'bg-green-100 text-green-600';
      case 'service': return 'bg-purple-100 text-purple-600';
      case 'utility': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredPayments = upcomingPayments.filter(payment => {
    const statusMatch = filterStatus === 'all' || payment.status === filterStatus;
    const typeMatch = filterType === 'all' || payment.type === filterType;
    return statusMatch && typeMatch;
  });

  return (
    <AdminLayout>
      <Helmet>
        <title>Upcoming Payments - Admin - Caper Sports</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upcoming Payments</h1>
            <p className="text-gray-600 mt-1">Manage and track your payment obligations</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center space-x-2 transition-all duration-200">
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center space-x-2 transition-all duration-200">
              <FiCalendar className="w-4 h-4" />
              <span>Schedule Payment</span>
            </button>
          </div>
        </div>

        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Upcoming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Upcoming</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{paymentSummary.totalUpcoming.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500 mt-1">All pending payments</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          {/* Overdue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-red-600 mt-2">₹{paymentSummary.overdue.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500 mt-1">Requires immediate attention</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FiAlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          {/* Due Today */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due Today</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">₹{paymentSummary.dueToday.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500 mt-1">Payment due today</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FiClock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          {/* Due This Week */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due This Week</p>
                <p className="text-3xl font-bold text-green-600 mt-2">₹{paymentSummary.dueThisWeek.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500 mt-1">Next 7 days</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Payment Schedule</h2>
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="overdue">Overdue</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  <option value="all">All Types</option>
                  <option value="vendor">Vendor</option>
                  <option value="employee">Employee</option>
                  <option value="service">Service</option>
                  <option value="utility">Utility</option>
                </select>
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
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Recipient</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Due Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Priority</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => {
                  const TypeIcon = getTypeIcon(payment.type);
                  const daysUntilDue = getDaysUntilDue(payment.dueDate);
                  
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getTypeColor(payment.type)}`}>
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{payment.recipient}</p>
                            <p className="text-xs text-gray-500">{payment.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                          {payment.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm text-gray-900">{payment.dueDate}</p>
                          <p className={`text-xs ${
                            daysUntilDue < 0 ? 'text-red-600' : 
                            daysUntilDue === 0 ? 'text-orange-600' : 
                            daysUntilDue <= 7 ? 'text-yellow-600' : 'text-gray-500'
                          }`}>
                            {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                             daysUntilDue === 0 ? 'Due today' :
                             `${daysUntilDue} days left`}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                        ₹{payment.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)} capitalize`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(payment.priority)} capitalize`}>
                          {payment.priority}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-gray-400 hover:text-blue-600 transition-colors duration-200" title="View Details">
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-green-600 transition-colors duration-200" title="Edit Payment">
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-purple-600 transition-colors duration-200" title="Send Payment">
                            <FiSend className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminUpcomingPayments;
