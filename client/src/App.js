import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { checkAuthStatus } from './store/slices/authSlice';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// Route Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// SEO
import { Helmet } from 'react-helmet';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  useEffect(() => {
    // Check authentication status on app load
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Remove loading screen once app is ready
  useEffect(() => {
    const loadingScreen = document.querySelector('.initial-loading');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.remove();
        }, 300);
      }, 1000);
    }
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Helmet>
        <title>CaperSports - Premium Sports Clothing</title>
        <meta name="description" content="Discover premium sports clothing and gear for your active lifestyle" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
      </Helmet>
      
      <ScrollToTop />
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Auth Routes */}
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? <Navigate to="/" replace /> : <Login />
                } 
              />
              <Route 
                path="/register" 
                element={
                  isAuthenticated ? <Navigate to="/" replace /> : <Register />
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders/:id" 
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wishlist" 
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000',
            border: theme === 'dark' ? '1px solid #4B5563' : '1px solid #E5E7EB',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
