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

const cartService = {
  // Get user's cart
  getCart: () => {
    return api.get('/users/cart');
  },

  // Add item to cart
  addToCart: (itemData) => {
    return api.post('/users/cart', itemData);
  },

  // Update cart item quantity
  updateCartItem: (itemId, quantity) => {
    return api.put(`/users/cart/${itemId}`, { quantity });
  },

  // Remove item from cart
  removeFromCart: (itemId) => {
    return api.delete(`/users/cart/${itemId}`);
  },

  // Clear entire cart
  clearCart: () => {
    return api.delete('/users/cart');
  },

  // Apply coupon code
  applyCoupon: (couponCode) => {
    return api.post('/users/cart/coupon', { couponCode });
  },

  // Remove coupon
  removeCoupon: () => {
    return api.delete('/users/cart/coupon');
  },

  // Get cart summary
  getCartSummary: () => {
    return api.get('/users/cart/summary');
  },

  // Validate cart items (check stock, prices, etc.)
  validateCart: () => {
    return api.post('/users/cart/validate');
  },

  // Save cart for later (wishlist)
  saveForLater: (itemId) => {
    return api.post(`/users/cart/${itemId}/save-for-later`);
  },

  // Move item from wishlist to cart
  moveToCart: (itemId) => {
    return api.post(`/users/cart/${itemId}/move-to-cart`);
  },
};

export default cartService;
