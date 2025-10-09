import { configureStore } from '@reduxjs/toolkit';

// Import slices
import authSlice from './slices/authSlice';
import productSlice from './slices/productSlice';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';
import uiSlice from './slices/uiSlice';
import adminSlice from './slices/adminSlice';
import wishlistSlice from './slices/wishlistSlice';

// Import API services
import { clientApi } from './services/clientService';

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
    [clientApi.reducerPath]: clientApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }).concat(clientApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Types
export const RootState = typeof store.getState;
export const AppDispatch = typeof store.dispatch;
