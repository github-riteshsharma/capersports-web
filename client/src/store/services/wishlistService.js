import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Add item to wishlist
  addToWishlist: async (productId) => {
    const response = await api.post('/wishlist', { productId });
    return response.data;
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },

  // Clear entire wishlist
  clearWishlist: async () => {
    const response = await api.delete('/wishlist');
    return response.data;
  },

  // Toggle wishlist item
  toggleWishlist: async (productId) => {
    const response = await api.post(`/wishlist/toggle/${productId}`);
    return response.data;
  },
};

export default wishlistService;
