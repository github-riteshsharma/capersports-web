import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState = {
  theme: getInitialTheme(),
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  cartOpen: false,
  wishlistOpen: false,
  searchQuery: '',
  notifications: [],
  loading: {
    global: false,
    products: false,
    orders: false,
    auth: false,
  },
  modals: {
    productQuickView: {
      isOpen: false,
      product: null,
    },
    addressModal: {
      isOpen: false,
      address: null,
      mode: 'add', // 'add' or 'edit'
    },
    confirmDialog: {
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null,
    },
  },
  filters: {
    category: '',
    brand: '',
    priceRange: [0, 10000],
    size: '',
    color: '',
    rating: 0,
    inStock: false,
    sortBy: 'newest',
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme);
    },

    // Sidebar and menus
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setSearchOpen: (state, action) => {
      state.searchOpen = action.payload;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    setCartOpen: (state, action) => {
      state.cartOpen = action.payload;
    },
    toggleCart: (state) => {
      state.cartOpen = !state.cartOpen;
    },
    setWishlistOpen: (state, action) => {
      state.wishlistOpen = action.payload;
    },
    toggleWishlist: (state) => {
      state.wishlistOpen = !state.wishlistOpen;
    },

    // Search
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
    },

    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: action.payload.type || 'info',
        title: action.payload.title,
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        timestamp: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
      
      // Keep only last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Loading states
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },

    // Modals
    openProductQuickView: (state, action) => {
      state.modals.productQuickView.isOpen = true;
      state.modals.productQuickView.product = action.payload;
    },
    closeProductQuickView: (state) => {
      state.modals.productQuickView.isOpen = false;
      state.modals.productQuickView.product = null;
    },
    openAddressModal: (state, action) => {
      state.modals.addressModal.isOpen = true;
      state.modals.addressModal.address = action.payload?.address || null;
      state.modals.addressModal.mode = action.payload?.mode || 'add';
    },
    closeAddressModal: (state) => {
      state.modals.addressModal.isOpen = false;
      state.modals.addressModal.address = null;
      state.modals.addressModal.mode = 'add';
    },
    openConfirmDialog: (state, action) => {
      state.modals.confirmDialog.isOpen = true;
      state.modals.confirmDialog.title = action.payload.title;
      state.modals.confirmDialog.message = action.payload.message;
      state.modals.confirmDialog.onConfirm = action.payload.onConfirm;
      state.modals.confirmDialog.onCancel = action.payload.onCancel;
    },
    closeConfirmDialog: (state) => {
      state.modals.confirmDialog.isOpen = false;
      state.modals.confirmDialog.title = '';
      state.modals.confirmDialog.message = '';
      state.modals.confirmDialog.onConfirm = null;
      state.modals.confirmDialog.onCancel = null;
    },

    // Filters
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        brand: '',
        priceRange: [0, 10000],
        size: '',
        color: '',
        rating: 0,
        inStock: false,
        sortBy: 'newest',
      };
    },

    // Pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
    setTotal: (state, action) => {
      state.pagination.total = action.payload;
    },

    // Close all overlays
    closeAllOverlays: (state) => {
      state.sidebarOpen = false;
      state.mobileMenuOpen = false;
      state.searchOpen = false;
      state.cartOpen = false;
      state.wishlistOpen = false;
      state.modals.productQuickView.isOpen = false;
      state.modals.addressModal.isOpen = false;
      state.modals.confirmDialog.isOpen = false;
    },

    // Reset UI state
    resetUI: (state) => {
      return {
        ...initialState,
        theme: state.theme, // Preserve theme
      };
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setMobileMenuOpen,
  toggleMobileMenu,
  setSearchOpen,
  toggleSearch,
  setCartOpen,
  toggleCart,
  setWishlistOpen,
  toggleWishlist,
  setSearchQuery,
  clearSearch,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setGlobalLoading,
  openProductQuickView,
  closeProductQuickView,
  openAddressModal,
  closeAddressModal,
  openConfirmDialog,
  closeConfirmDialog,
  setFilter,
  setFilters,
  clearFilters,
  setPagination,
  setPage,
  setLimit,
  setTotal,
  closeAllOverlays,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
