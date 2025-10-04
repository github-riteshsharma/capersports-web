import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../services/productService';

// Initial state
const initialState = {
  products: [],
  featuredProducts: [],
  categories: [],
  brands: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  filters: {
    category: '',
    brand: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  // Add caching
  cache: {
    products: null,
    featuredProducts: null,
    categories: null,
    brands: null,
    lastFetch: null,
    cacheExpiry: 5 * 60 * 1000, // 5 minutes
  },
};

// Async thunks
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { cache } = state.products;
      const currentTime = Date.now();
      
      // Check if we have cached data and it's still valid
      if (cache.products && cache.lastFetch && 
          (currentTime - cache.lastFetch) < cache.cacheExpiry &&
          Object.keys(params).length === 0) {
        return cache.products;
      }
      
      const response = await productService.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const getFeaturedProducts = createAsyncThunk(
  'products/getFeaturedProducts',
  async (limit = 8, { rejectWithValue }) => {
    try {
      const response = await productService.getFeaturedProducts(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const getBrands = createAsyncThunk(
  'products/getBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getBrands();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch brands');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);

export const addReview = createAsyncThunk(
  'products/addReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await productService.addReview(productId, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add review');
    }
  }
);

export const updateReview = createAsyncThunk(
  'products/updateReview',
  async ({ productId, reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await productService.updateReview(productId, reviewId, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'products/deleteReview',
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const response = await productService.deleteReview(productId, reviewId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        brand: '',
        search: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Get products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit || 12,
          total: action.payload.total,
          pages: action.payload.pages,
        };
        // Update cache
        state.cache.products = action.payload;
        state.cache.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get featured products
      .addCase(getFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload.products;
        state.error = null;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get product by ID
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.product;
        state.error = null;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get categories
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.error = null;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get brands
      .addCase(getBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands;
        state.error = null;
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit || 12,
          total: action.payload.total,
          pages: action.payload.pages,
        };
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add review
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentProduct) {
          state.currentProduct.reviews.push(action.payload.review);
          state.currentProduct.ratings = action.payload.ratings;
        }
        state.error = null;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentProduct) {
          const reviewIndex = state.currentProduct.reviews.findIndex(
            review => review._id === action.payload.review._id
          );
          if (reviewIndex !== -1) {
            state.currentProduct.reviews[reviewIndex] = action.payload.review;
          }
        }
        state.error = null;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentProduct) {
          state.currentProduct.reviews = state.currentProduct.reviews.filter(
            review => review._id !== action.meta.arg.reviewId
          );
        }
        state.error = null;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearCurrentProduct, 
  setFilters, 
  clearFilters, 
  setPagination 
} = productSlice.actions;

export default productSlice.reducer;
