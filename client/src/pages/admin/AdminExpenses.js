import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiDollarSign, 
  FiTrendingUp, 
  FiShoppingCart,
  FiUsers,
  FiTruck,
  FiEdit,
  FiTrash2,
  FiFilter,
  FiDownload,
  FiCalendar
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminExpenses = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock expenses data
  const expenseCategories = [
    { name: 'Inventory', amount: 125000, color: 'blue', icon: FiShoppingCart },
    { name: 'Marketing', amount: 45000, color: 'purple', icon: FiTrendingUp },
    { name: 'Payroll', amount: 85000, color: 'green', icon: FiUsers },
    { name: 'Logistics', amount: 25000, color: 'orange', icon: FiTruck },
  ];

  const expenses = [
    { id: 1, description: 'Nike Shoes Inventory', category: 'Inventory', amount: 45000, date: '2025-01-15', vendor: 'Nike Inc.', status: 'Paid' },
    { id: 2, description: 'Social Media Ads', category: 'Marketing', amount: 12000, date: '2025-01-14', vendor: 'Facebook Ads', status: 'Pending' },
    { id: 3, description: 'Staff Salaries - January', category: 'Payroll', amount: 85000, date: '2025-01-10', vendor: 'Internal', status: 'Paid' },
    { id: 4, description: 'Shipping & Delivery', category: 'Logistics', amount: 8500, date: '2025-01-12', vendor: 'DHL Express', status: 'Paid' },
    { id: 5, description: 'Adidas Product Stock', category: 'Inventory', amount: 38000, date: '2025-01-08', vendor: 'Adidas Ltd.', status: 'Paid' },
    { id: 6, description: 'Google Ads Campaign', category: 'Marketing', amount: 15000, date: '2025-01-06', vendor: 'Google Ads', status: 'Pending' }
  ];

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(expense => expense.status === 'Pending').reduce((sum, expense) => sum + expense.amount, 0);

  const filteredExpenses = filterCategory === 'all' ? expenses : expenses.filter(expense => expense.category === filterCategory);

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Expenses - Admin - Caper Sports</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600 mt-1">Track and manage business expenses</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center space-x-2 transition-all duration-200">
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button 
              onClick={() => setShowAddExpense(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center space-x-2 transition-all duration-200"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Expense Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalExpenses.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500 mt-1">This month</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          {/* Pending Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">₹{pendingExpenses.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500 mt-1">Awaiting payment</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="space-y-2">
              {expenseCategories.slice(0, 3).map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{category.name}</span>
                  <span className="text-sm font-semibold text-gray-900">₹{(category.amount / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Expense Categories</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {expenseCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div key={category.name} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(category.color)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">₹{(category.amount / 1000).toFixed(0)}k</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500">Monthly spend</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Expenses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Expenses</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  <option value="all">All Categories</option>
                  {expenseCategories.map((category) => (
                    <option key={category.name} value={category.name}>{category.name}</option>
                  ))}
                </select>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                  <FiFilter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Vendor</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{expense.description}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{expense.vendor}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{expense.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        expense.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-sm font-semibold text-gray-900">
                      ₹{expense.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors duration-200">
                          <FiTrash2 className="w-4 h-4" />
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

export default AdminExpenses;
