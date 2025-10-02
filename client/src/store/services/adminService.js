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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Admin API Error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    if (error.response?.status === 401) {
      // Unauthorized - token might be invalid
      console.error('Unauthorized access - redirecting to login');
    }
    return Promise.reject(error);
  }
);

const adminService = {
  // Dashboard
  getDashboardData: () => {
    return api.get('/admin/dashboard');
  },

  // Products
  getProducts: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/admin/products?${queryParams.toString()}`);
  },

  createProduct: (productData) => {
    return api.post('/admin/products', productData);
  },

  updateProduct: (productId, productData) => {
    return api.put(`/admin/products/${productId}`, productData);
  },
  
  deleteProduct: (productId) => {
    return api.delete(`/admin/products/${productId}`);
  },

  deleteProduct: (productId) => {
    return api.delete(`/admin/products/${productId}`);
  },

  // Orders
  getOrders: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/admin/orders?${queryParams.toString()}`);
  },

  updateOrderStatus: (orderId, statusData) => {
    return api.put(`/admin/orders/${orderId}/status`, statusData);
  },

  // Users
  getUsers: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/admin/users?${queryParams.toString()}`);
  },

  updateUserRole: (userId, role) => {
    return api.put(`/admin/users/${userId}/role`, { role });
  },

  deactivateUser: (userId) => {
    return api.put(`/admin/users/${userId}/deactivate`);
  },

  activateUser: (userId) => {
    return api.put(`/admin/users/${userId}/activate`);
  },

  // Analytics
  getAnalytics: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/admin/analytics?${queryParams.toString()}`);
  },

  // Reports
  getSalesReport: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/admin/reports/sales?${queryParams.toString()}`);
  },

  getInventoryReport: () => {
    return api.get('/admin/reports/inventory');
  },

  getCustomerReport: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/admin/reports/customers?${queryParams.toString()}`);
  },

  // Settings
  getSettings: () => {
    return api.get('/admin/settings');
  },

  updateSettings: (settingsData) => {
    return api.put('/admin/settings', settingsData);
  },

  // Bulk operations
  bulkUpdateProducts: (productIds, updateData) => {
    return api.put('/admin/products/bulk', { productIds, updateData });
  },

  bulkDeleteProducts: (productIds) => {
    return api.delete('/admin/products/bulk', { data: { productIds } });
  },

  bulkUpdateOrders: (orderIds, updateData) => {
    return api.put('/admin/orders/bulk', { orderIds, updateData });
  },

  // Export data
  exportProducts: (format = 'csv') => {
    return api.get(`/admin/export/products?format=${format}`, {
      responseType: 'blob',
    });
  },

  exportOrders: (format = 'csv', params = {}) => {
    const queryParams = new URLSearchParams(params);
    queryParams.append('format', format);
    
    return api.get(`/admin/export/orders?${queryParams.toString()}`, {
      responseType: 'blob',
    });
  },

  exportUsers: (format = 'csv') => {
    return api.get(`/admin/export/users?format=${format}`, {
      responseType: 'blob',
    });
  },

  // Import data
  importProducts: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/admin/import/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // System health
  getSystemHealth: () => {
    return api.get('/admin/system/health');
  },

  // Cache management
  clearCache: () => {
    return api.post('/admin/system/clear-cache');
  },
};

export default adminService;
