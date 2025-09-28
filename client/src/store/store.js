import { configureStore } from '@reduxjs/toolkit';

// Import slices
import authSlice from './slices/authSlice';
import productSlice from './slices/productSlice';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';
import uiSlice from './slices/uiSlice';
import adminSlice from './slices/adminSlice';
import wishlistSlice from './slices/wishlistSlice';

// Configure store
export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    cart: cartSlice,
    orders: orderSlice,
    ui: uiSlice,
    admin: adminSlice,
    wishlist: wishlistSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Types
export const RootState = typeof store.getState;
export const AppDispatch = typeof store.dispatch;
