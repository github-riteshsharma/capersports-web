import React, { useState, useEffect } from 'react';
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
  FiChevronLeft,
  FiTrendingUp,
  FiDollarSign,
  FiSearch,
  FiCalendar
} from 'react-icons/fi';

const AdminLayout = ({ children, fullWidth = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Only auto-close sidebar on mobile, preserve desktop state
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2 rounded-lg overflow-hidden bg-white shadow-md flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="CaperSports Logo"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-blue-600 rounded-lg hidden items-center justify-center">
                <span className="text-white font-bold text-xs">CS</span>
              </div>
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              CAPER SPORTS
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">
                {(user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'A').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'} 
        ${isMobile ? 'top-16 left-0 h-[calc(100vh-4rem)] z-50' : 'h-screen'} 
        ${isMobile ? 'w-72' : sidebarOpen ? 'w-64' : 'w-20'} 
        bg-white/95 backdrop-blur-sm border-r border-gray-200/60 flex flex-col shadow-xl
        transition-all duration-300 ease-in-out will-change-transform
      `}>
        {/* Desktop Toggle Button */}
        {!isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-20 hover:border-blue-300 will-change-transform"
          >
            <FiChevronLeft className={`w-3 h-3 text-gray-600 transition-transform duration-300 ease-in-out ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        )}

        {/* Logo Section */}
        <div className={`flex items-center border-b border-gray-200/60 bg-gradient-to-r from-white to-gray-50/50 transition-all duration-300 ${
          !sidebarOpen && !isMobile ? 'px-3 py-4 justify-center' : 'px-6 py-5'
        }`}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center group transition-all duration-300 hover:scale-105"
          >
            {/* Logo - Always Visible */}
            <div className={`rounded-xl overflow-hidden bg-white shadow-lg flex items-center justify-center ring-1 ring-gray-100 group-hover:shadow-xl transition-all duration-300 ${
              !sidebarOpen && !isMobile ? 'w-10 h-10' : 'w-12 h-12 mr-4'
            }`}>
              <img
                src="/images/logo.png"
                alt="CaperSports Logo"
                className={`object-contain ${!sidebarOpen && !isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className={`bg-gradient-to-br from-red-500 to-blue-600 rounded-xl hidden items-center justify-center ${
                !sidebarOpen && !isMobile ? 'w-8 h-8' : 'w-10 h-10'
              }`}>
                <span className={`text-white font-bold ${!sidebarOpen && !isMobile ? 'text-xs' : 'text-sm'}`}>CS</span>
              </div>
            </div>
            {/* Company Name - Only when expanded */}
            {(sidebarOpen || isMobile) && (
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent group-hover:from-red-500 group-hover:to-blue-500 transition-all duration-300 tracking-tight">
                  CAPER SPORTS
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Search Bar */}
        {(sidebarOpen || isMobile) && (
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
        )}

        {/* Navigation - General Section */}
        <div className="flex-1 overflow-y-auto">
          <div className={`py-4 ${!sidebarOpen && !isMobile ? 'px-2' : 'px-4'}`}>
            {(sidebarOpen || isMobile) && (
              <div className="flex items-center mb-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">GENERAL</span>
              </div>
            )}
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
                  onClick={() => {
                    navigate(item.path);
                    // Only close sidebar on mobile, preserve desktop state
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center ${
                    !sidebarOpen && !isMobile 
                      ? 'px-3 py-3 justify-center' 
                      : 'px-4 py-3'
                  } text-sm rounded-xl transition-all duration-300 ease-in-out group will-change-transform ${
                    item.active 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-sm border border-blue-100' 
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm'
                  }`}
                  title={!sidebarOpen && !isMobile ? item.name : ''}
                >
                  {/* Icon - Always Visible */}
                  <item.icon className={`w-5 h-5 ${
                    (sidebarOpen || isMobile) ? 'mr-3' : ''
                  } transition-all duration-300 ease-in-out ${
                    item.active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  {/* Text - Only when expanded */}
                  <span className={`transition-all duration-300 ease-in-out ${
                    (sidebarOpen || isMobile) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}>
                    {(sidebarOpen || isMobile) && item.name}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Others Section */}
          <div className={`py-4 border-t border-gray-100/60 ${!sidebarOpen && !isMobile ? 'px-2' : 'px-4'}`}>
            {(sidebarOpen || isMobile) && (
              <div className="flex items-center mb-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">OTHERS</span>
              </div>
            )}
            <nav className="space-y-2">
              {[
                { name: 'Products', icon: FiShoppingBag, path: '/admin/products' },
                { name: 'Orders', icon: FiShoppingCart, path: '/admin/orders' },
                { name: 'Customers', icon: FiUsers, path: '/admin/users' },
                { name: 'Settings', icon: FiSettings, path: '/admin/settings' }
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    // Only close sidebar on mobile, preserve desktop state
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center ${
                    !sidebarOpen && !isMobile 
                      ? 'px-3 py-3 justify-center' 
                      : 'px-4 py-3'
                  } text-sm text-gray-600 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm transition-all duration-300 ease-in-out group will-change-transform`}
                  title={!sidebarOpen && !isMobile ? item.name : ''}
                >
                  {/* Icon - Always Visible */}
                  <item.icon className={`w-5 h-5 ${
                    (sidebarOpen || isMobile) ? 'mr-3' : ''
                  } text-gray-400 group-hover:text-gray-600 transition-all duration-300 ease-in-out`} />
                  {/* Text - Only when expanded */}
                  <span className={`transition-all duration-300 ease-in-out ${
                    (sidebarOpen || isMobile) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}>
                    {(sidebarOpen || isMobile) && item.name}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* User Profile Section */}
        <div className={`border-t border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-white ${
          !sidebarOpen && !isMobile ? 'p-3' : 'p-4'
        }`}>
          <div className={`flex items-center ${!sidebarOpen && !isMobile ? 'justify-center' : ''}`}>
            {/* Profile Icon - Always Visible */}
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white flex-shrink-0">
              <span className="text-white text-sm font-bold">
                {(user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'A').toUpperCase()}
              </span>
            </div>
            {/* User Name and Logout - Only when expanded */}
            {(sidebarOpen || isMobile) && (
              <>
                <div className="flex-1 min-w-0 ml-3">
                  <div className="h-10 flex items-start pt-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.firstName || user?.name?.split(' ')[0] || 'Admin'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-50 flex-shrink-0 ml-2 w-10 h-10 flex items-center justify-center"
                  title="Sign Out"
                >
                  <FiLogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {/* Logout Button for Collapsed State */}
          {!sidebarOpen && !isMobile && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-50 w-8 h-8 flex items-center justify-center"
                title="Sign Out"
              >
                <FiLogOut className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden ${isMobile ? 'pt-16' : ''}`}>
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-gray-100/50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className={`${fullWidth ? 'p-3 sm:p-4 lg:p-6' : 'max-w-7xl mx-auto p-3 sm:p-4 lg:p-6'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
