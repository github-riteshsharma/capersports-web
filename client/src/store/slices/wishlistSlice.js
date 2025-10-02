import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import wishlistService from '../services/wishlistService';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Get user wishlist items from localStorage (for now, can be extended to API)
const getWishlistFromStorage = () => {
  try {
    const wishlist = localStorage.getItem('capersports_wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error);
    return [];
  }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem('capersports_wishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

// Initialize wishlist from localStorage
const initialWishlist = getWishlistFromStorage();

// Async thunks for future API integration
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      // For now, return items from localStorage
      // In the future, this can be replaced with API call
      return getWishlistFromStorage();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlistAsync',
  async (product, { getState, rejectWithValue }) => {
    try {
      // For now, save to localStorage
      // In the future, this can be replaced with API call
      const currentWishlist = getState().wishlist.items;
      const newWishlist = [...currentWishlist, product];
      saveWishlistToStorage(newWishlist);
      return product;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlistAsync',
  async (productId, { getState, rejectWithValue }) => {
    try {
      // For now, save to localStorage
      // In the future, this can be replaced with API call
      const currentWishlist = getState().wishlist.items;
      const newWishlist = currentWishlist.filter(item => item._id !== productId);
      saveWishlistToStorage(newWishlist);
      return productId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    }
  }
);

export const clearWishlistAsync = createAsyncThunk(
  'wishlist/clearWishlistAsync',
  async (_, { rejectWithValue }) => {
    try {
      // For now, clear localStorage
      // In the future, this can be replaced with API call
      localStorage.removeItem('capersports_wishlist');
      return [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to clear wishlist');
    }
  }
);

// Wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    ...initialState,
    items: initialWishlist,
  },
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item._id === product._id);
      
      if (!existingItem) {
        state.items.push(product);
        saveWishlistToStorage(state.items);
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item._id !== productId);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('capersports_wishlist');
    },
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item._id === product._id);
      
      if (existingItem) {
        // Remove from wishlist
        state.items = state.items.filter(item => item._id !== product._id);
      } else {
        // Add to wishlist
        state.items.push(product);
      }
      saveWishlistToStorage(state.items);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to wishlist
      .addCase(addToWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        const product = action.payload;
        const existingItem = state.items.find(item => item._id === product._id);
        if (!existingItem) {
          state.items.push(product);
        }
        state.error = null;
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from wishlist
      .addCase(removeFromWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        const productId = action.payload;
        state.items = state.items.filter(item => item._id !== productId);
        state.error = null;
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear wishlist
      .addCase(clearWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWishlistAsync.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.error = null;
      })
      .addCase(clearWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist, 
  toggleWishlist, 
  clearError 
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
