import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiArrowUpRight, 
  FiArrowDownRight,
  FiCalendar,
  FiFilter,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminCashFlow = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock cash flow data
  const cashflowData = {
    totalInflow: 125000,
    totalOutflow: 89000,
    netCashFlow: 36000,
    previousPeriod: {
      totalInflow: 110000,
      totalOutflow: 95000,
      netCashFlow: 15000
    }
  };

  const transactions = [
    { id: 1, type: 'inflow', description: 'Product Sales Revenue', amount: 45000, date: '2025-01-15', category: 'Sales' },
    { id: 2, type: 'outflow', description: 'Inventory Purchase', amount: -25000, date: '2025-01-14', category: 'Inventory' },
    { id: 3, type: 'inflow', description: 'Customer Payment', amount: 18000, date: '2025-01-13', category: 'Receivables' },
    { id: 4, type: 'outflow', description: 'Marketing Expenses', amount: -8500, date: '2025-01-12', category: 'Marketing' },
    { id: 5, type: 'outflow', description: 'Staff Salaries', amount: -35000, date: '2025-01-10', category: 'Payroll' },
    { id: 6, type: 'inflow', description: 'Wholesale Order', amount: 62000, date: '2025-01-08', category: 'Sales' }
  ];

  const calculateChange = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return { value: change, isPositive: change > 0 };
  };

  const inflowChange = calculateChange(cashflowData.totalInflow, cashflowData.previousPeriod.totalInflow);
  const outflowChange = calculateChange(Math.abs(cashflowData.totalOutflow), Math.abs(cashflowData.previousPeriod.totalOutflow));
  const netChange = calculateChange(cashflowData.netCashFlow, cashflowData.previousPeriod.netCashFlow);

  return (
    <AdminLayout>
      <Helmet>
        <title>Cash Flow - Admin - Caper Sports</title>
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
                <span className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                  Admin
                </span>
                <span className="mx-2 text-gray-300">/</span>
                <span className="text-blue-600 font-semibold">Cash Flow</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Cash Flow</h1>
              <p className="text-gray-600 mt-1">Monitor your business cash flow and financial health</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center space-x-2 transition-all duration-200">
                <FiDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cash Flow Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Inflow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inflow</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{cashflowData.totalInflow.toLocaleString('en-IN')}</p>
                <div className="flex items-center mt-2">
                  <FiArrowUpRight className={`w-4 h-4 mr-1 ${inflowChange.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ${inflowChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(inflowChange.value).toFixed(1)}%
                  </span>
                  <span className="text-gray-500 text-sm ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          {/* Total Outflow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Outflow</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{Math.abs(cashflowData.totalOutflow).toLocaleString('en-IN')}</p>
                <div className="flex items-center mt-2">
                  <FiArrowDownRight className={`w-4 h-4 mr-1 ${outflowChange.isPositive ? 'text-red-500' : 'text-green-500'}`} />
                  <span className={`text-sm font-medium ${outflowChange.isPositive ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.abs(outflowChange.value).toFixed(1)}%
                  </span>
                  <span className="text-gray-500 text-sm ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FiTrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          {/* Net Cash Flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Cash Flow</p>
                <p className={`text-3xl font-bold mt-2 ${cashflowData.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{cashflowData.netCashFlow.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center mt-2">
                  <FiArrowUpRight className={`w-4 h-4 mr-1 ${netChange.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ${netChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(netChange.value).toFixed(1)}%
                  </span>
                  <span className="text-gray-500 text-sm ml-1">vs last period</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cashflowData.netCashFlow >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <FiDollarSign className={`w-6 h-6 ${cashflowData.netCashFlow >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
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
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${transaction.type === 'inflow' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-medium text-gray-900">{transaction.description}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{transaction.date}</td>
                    <td className={`py-4 px-6 text-right text-sm font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
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

export default AdminCashFlow;
