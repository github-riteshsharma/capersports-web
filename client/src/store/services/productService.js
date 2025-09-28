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

const productService = {
  // Get all products with filters and pagination
  getProducts: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/products?${queryParams.toString()}`);
  },

  // Get featured products
  getFeaturedProducts: (limit = 8) => {
    return api.get(`/products/featured?limit=${limit}`);
  },

  // Get product by ID
  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },

  // Get all categories
  getCategories: () => {
    return api.get('/products/categories');
  },

  // Get all brands
  getBrands: () => {
    return api.get('/products/brands');
  },

  // Search products
  searchProducts: (query, params = {}) => {
    const queryParams = new URLSearchParams({ search: query });
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/products?${queryParams.toString()}`);
  },

  // Add review to product
  addReview: (productId, reviewData) => {
    return api.post(`/products/${productId}/reviews`, reviewData);
  },

  // Update review
  updateReview: (productId, reviewId, reviewData) => {
    return api.put(`/products/${productId}/reviews/${reviewId}`, reviewData);
  },

  // Delete review
  deleteReview: (productId, reviewId) => {
    return api.delete(`/products/${productId}/reviews/${reviewId}`);
  },

  // Get product recommendations
  getRecommendations: (productId) => {
    return api.get(`/products/${productId}/recommendations`);
  },

  // Get related products
  getRelatedProducts: (productId, limit = 4) => {
    return api.get(`/products/${productId}/related?limit=${limit}`);
  },

  // Get products by category
  getProductsByCategory: (category, params = {}) => {
    const queryParams = new URLSearchParams({ category });
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/products?${queryParams.toString()}`);
  },

  // Get products by brand
  getProductsByBrand: (brand, params = {}) => {
    const queryParams = new URLSearchParams({ brand });
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/products?${queryParams.toString()}`);
  },

  // Get trending products
  getTrendingProducts: (limit = 8) => {
    return api.get(`/products?sortBy=popularity&limit=${limit}`);
  },

  // Get new arrivals
  getNewArrivals: (limit = 8) => {
    return api.get(`/products?sortBy=createdAt&sortOrder=desc&limit=${limit}`);
  },

  // Get sale products
  getSaleProducts: (limit = 8) => {
    return api.get(`/products?onSale=true&limit=${limit}`);
  },
};

export default productService;
