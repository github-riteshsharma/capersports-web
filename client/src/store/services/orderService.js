import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const orderService = {
  // Create new order
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },

  // Get user's orders
  getOrders: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/orders?${queryParams.toString()}`);
  },

  // Get order by ID
  getOrderById: (orderId) => {
    return api.get(`/orders/${orderId}`);
  },

  // Cancel order
  cancelOrder: (orderId) => {
    return api.put(`/orders/${orderId}/cancel`);
  },

  // Return order
  returnOrder: (orderId, reason) => {
    return api.post(`/orders/${orderId}/return`, { reason });
  },

  // Track order
  trackOrder: (orderId) => {
    return api.get(`/orders/${orderId}/track`);
  },

  // Get order history
  getOrderHistory: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/orders/history?${queryParams.toString()}`);
  },

  // Reorder items from previous order
  reorderItems: (orderId) => {
    return api.post(`/orders/${orderId}/reorder`);
  },

  // Get order receipt
  getOrderReceipt: (orderId) => {
    return api.get(`/orders/${orderId}/receipt`);
  },

  // Download order invoice
  downloadInvoice: (orderId) => {
    return api.get(`/orders/${orderId}/invoice`);
  },

  // Update order status (admin only)
  updateOrderStatus: (orderId, status) => {
    return api.put(`/orders/${orderId}/status`, { status });
  },

  // Get order statistics
  getOrderStats: () => {
    return api.get('/orders/stats');
  },

  // Get order analytics
  getOrderAnalytics: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/orders/analytics?${queryParams.toString()}`);
  },
};

export default orderService;
