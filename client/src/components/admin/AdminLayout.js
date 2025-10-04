import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  FiHome, 
  FiShoppingBag, 
  FiShoppingCart, 
  FiUsers, 
  FiFileText, 
  FiSettings, 
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronLeft,
  FiPackage,
  FiTrendingUp,
  FiDollarSign,
  FiMail,
  FiBell,
  FiUser,
  FiSearch,
  FiCalendar,
  FiGlobe,
  FiHeart,
  FiUserPlus
} from 'react-icons/fi';

const AdminLayout = ({ children, fullWidth = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: FiHome,
      description: 'Overview & Analytics'
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: FiShoppingBag,
      description: 'Manage Inventory'
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: FiShoppingCart,
      description: 'Order Management'
    },
    {
      name: 'Customers',
      path: '/admin/users',
      icon: FiUsers,
      description: 'User Management'
    },
    {
      name: 'Invoices',
      path: '/admin/invoices',
      icon: FiFileText,
      description: 'Invoice Creation'
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: FiBarChart2,
      description: 'Sales Reports'
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: FiSettings,
      description: 'System Config'
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200/60 flex flex-col shadow-xl">
        {/* Logo Section */}
        <div className="flex items-center px-6 py-5 border-b border-gray-200/60 bg-gradient-to-r from-white to-gray-50/50">
          <button
            onClick={() => navigate('/')}
            className="flex items-center group transition-all duration-300 hover:scale-105"
          >
            <div className="w-12 h-12 mr-4 rounded-xl overflow-hidden bg-white shadow-lg flex items-center justify-center ring-1 ring-gray-100 group-hover:shadow-xl transition-all duration-300">
              <img
                src="/images/logo.png"
                alt="CaperSports Logo"
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl hidden items-center justify-center">
                <span className="text-white font-bold text-sm">CS</span>
              </div>
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent group-hover:from-red-500 group-hover:to-blue-500 transition-all duration-300 tracking-tight">
                CAPER SPORTS
              </span>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-4 border-b border-gray-100/60">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 hover:bg-white"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">⌘F</span>
          </div>
        </div>

        {/* Navigation - General Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4">
            <div className="flex items-center mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">GENERAL</span>
            </div>
            <nav className="space-y-2">
              {[
                { name: 'Dashboard', icon: FiHome, path: '/admin', active: location.pathname === '/admin' },
                { name: 'Cash Flow', icon: FiTrendingUp, path: '/admin/cashflow' },
                { name: 'Invoices', icon: FiFileText, path: '/admin/invoices', active: location.pathname === '/admin/invoices' },
                { name: 'Expenses', icon: FiDollarSign, path: '/admin/expenses' },
                { name: 'Reports', icon: FiBarChart2, path: '/admin/reports' },
                { name: 'Upcoming Payments', icon: FiCalendar, path: '/admin/payments' }
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 group ${
                    item.active 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-sm border border-blue-100' 
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 transition-all duration-200 ${
                    item.active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Others Section */}
          <div className="px-4 py-4 border-t border-gray-100/60">
            <div className="flex items-center mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">OTHERS</span>
            </div>
            <nav className="space-y-2">
              {[
                { name: 'Products', icon: FiShoppingBag, path: '/admin/products' },
                { name: 'Orders', icon: FiShoppingCart, path: '/admin/orders' },
                { name: 'Customers', icon: FiUsers, path: '/admin/users' },
                { name: 'Settings', icon: FiSettings, path: '/admin/settings' }
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center px-4 py-3 text-sm text-gray-600 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm transition-all duration-200 group"
                >
                  <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="border-t border-gray-200/60 p-4 bg-gradient-to-r from-gray-50/50 to-white">
          <div className="flex items-center h-10">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mr-3 shadow-lg ring-2 ring-white flex-shrink-0">
              <span className="text-white text-sm font-bold">
                {(user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'A').toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0 flex items-center h-10">
              <p className="text-sm font-semibold text-gray-900 truncate leading-none">
                {user?.firstName || user?.name?.split(' ')[0] || 'Admin'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-50 flex-shrink-0 w-10 h-10 flex items-center justify-center"
              title="Sign Out"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-gray-100/50">
          <div className={`${fullWidth ? 'p-6' : 'max-w-7xl mx-auto p-6'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
