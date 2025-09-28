import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../services/cartService';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0,
  shipping: 0,
  tax: 0,
  discount: 0,
  grandTotal: 0,
  couponCode: '',
  shippingAddress: null,
  paymentMethod: '',
};

// Async thunks
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      return { itemId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.clearCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await cartService.applyCoupon(couponCode);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply coupon');
    }
  }
);

export const removeCoupon = createAsyncThunk(
  'cart/removeCoupon',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.removeCoupon();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove coupon');
    }
  }
);

// Helper function to calculate cart totals
const calculateCartTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = totalPrice >= 1000 ? 0 : 100; // Free shipping for orders above ₹1000
  const tax = totalPrice * 0.18; // 18% GST
  const grandTotal = totalPrice + shipping + tax;
  
  return {
    totalItems,
    totalPrice,
    shipping,
    tax,
    grandTotal,
  };
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Local cart management (for guest users)
    addToLocalCart: (state, action) => {
      const { product, quantity, size, color } = action.payload;
      const existingItem = state.items.find(
        item => item.product._id === product._id && item.size === size && item.color === color
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          _id: Date.now().toString(),
          product,
          quantity,
          size,
          color,
          addedAt: new Date().toISOString(),
        });
      }
      
      const totals = calculateCartTotals(state.items);
      Object.assign(state, totals);
    },
    updateLocalCartItem: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item._id === itemId);
      
      if (item) {
        item.quantity = quantity;
        const totals = calculateCartTotals(state.items);
        Object.assign(state, totals);
      }
    },
    removeFromLocalCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item._id !== itemId);
      const totals = calculateCartTotals(state.items);
      Object.assign(state, totals);
    },
    clearLocalCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.shipping = 0;
      state.tax = 0;
      state.grandTotal = 0;
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setCouponCode: (state, action) => {
      state.couponCode = action.payload;
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
      state.grandTotal = state.totalPrice + state.shipping + state.tax - state.discount;
    },
    // Optimistic update for immediate UI feedback
    addToCartOptimistic: (state, action) => {
      const { productId, quantity, size, color, product } = action.payload;
      const existingItem = state.items.find(
        item => item.product._id === productId && item.size === size && item.color === color
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          _id: `temp_${Date.now()}`,
          product: product || { _id: productId },
          quantity,
          size,
          color,
          addedAt: new Date().toISOString(),
        });
      }
      
      const totals = calculateCartTotals(state.items);
      Object.assign(state, totals);
    },
  },
  extraReducers: (builder) => {
    builder
      // Get cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart || [];
        const totals = calculateCartTotals(state.items);
        Object.assign(state, totals);
        state.error = null;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Preserve current cart state to prevent UI flickering
        // Don't reset items or totals during loading
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        
        // Debug logging
        console.log('=== ADD TO CART FULFILLED ===');
        console.log('Action payload:', action.payload);
        console.log('Current state items before:', state.items.length);
        console.log('Current totalItems before:', state.totalItems);
        
        // Sync with server response if available, otherwise keep optimistic state
        if (action.payload.cart && action.payload.cart.length > 0) {
          console.log('Using server cart data:', action.payload.cart.length, 'items');
          state.items = action.payload.cart;
          const totals = calculateCartTotals(state.items);
          console.log('Calculated totals:', totals);
          Object.assign(state, totals);
        } else {
          console.log('No server cart data, keeping optimistic state');
        }
        
        console.log('Final state items:', state.items.length);
        console.log('Final totalItems:', state.totalItems);
        console.log('=== END ADD TO CART FULFILLED ===');
        
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        // Find and update the item
        const itemId = action.meta.arg.itemId;
        const item = state.items.find(item => item._id === itemId);
        if (item) {
          item.quantity = action.meta.arg.quantity;
        }
        const totals = calculateCartTotals(state.items);
        Object.assign(state, totals);
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload.itemId);
        const totals = calculateCartTotals(state.items);
        Object.assign(state, totals);
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
        state.shipping = 0;
        state.tax = 0;
        state.grandTotal = 0;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Apply coupon
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.couponCode = action.payload.couponCode;
        state.discount = action.payload.discount;
        state.grandTotal = state.totalPrice + state.shipping + state.tax - state.discount;
        state.error = null;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove coupon
      .addCase(removeCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCoupon.fulfilled, (state) => {
        state.loading = false;
        state.couponCode = '';
        state.discount = 0;
        state.grandTotal = state.totalPrice + state.shipping + state.tax;
        state.error = null;
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  addToLocalCart,
  updateLocalCartItem,
  removeFromLocalCart,
  clearLocalCart,
  setShippingAddress,
  setPaymentMethod,
  setCouponCode,
  setDiscount,
  addToCartOptimistic,
} = cartSlice.actions;

export default cartSlice.reducer;
