import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiMoreVertical,
  FiPackage,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertTriangle,
  FiDownload,
  FiX,
  FiUpload
} from 'react-icons/fi';

// Store
import { getAdminProducts, deleteProduct, createProduct, updateProduct } from '../../store/slices/adminSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import AdminLayout from '../../components/admin/AdminLayout';

// Helper function to get hex color from color name
const getColorHex = (colorName) => {
  const colorMap = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#FF0000',
    'Blue': '#0000FF',
    'Green': '#00FF00',
    'Yellow': '#FFFF00',
    'Navy': '#000080',
    'Gray': '#808080',
    'Pink': '#FFC0CB',
    'Purple': '#800080',
    'Orange': '#FFA500',
    'Brown': '#A52A2A'
  };
  return colorMap[colorName] || '#000000'; // Default to black if color not found
};

// Helper function for stock status
const getStockStatus = (product) => {
  const stock = product.totalStock || product.stock || 0;
  if (stock === 0) {
    return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
  } else if (stock < 10) {
    return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
  }
  return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
};

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error, pagination } = useSelector((state) => state.admin);
  
  // Extract pagination values to avoid infinite loops
  const currentPage = pagination?.page || 1;
  const pageLimit = pagination?.limit || 10;
  
  // Subcategory options based on category
  const subCategoryOptions = {
    'T-Shirts': ['Polo', 'Round Neck', 'V-Neck', 'Henley', 'Long Sleeve'],
    'Hoodies': ['Pullover', 'Zip-Up', 'Sleeveless', 'Oversized'],
    'Jackets': ['Bomber', 'Windbreaker', 'Puffer', 'Track Jacket', 'Rain Jacket'],
    'Shorts': ['Athletic', 'Running', 'Basketball', 'Cargo', 'Compression'],
    'Pants': ['Joggers', 'Track Pants', 'Leggings', 'Sweatpants', 'Cargo Pants'],
    'Shoes': ['Running', 'Training', 'Basketball', 'Casual', 'Walking'],
    'Accessories': ['Caps', 'Socks', 'Bags', 'Gloves', 'Headbands', 'Water Bottles'],
    'Sportswear': ['Jerseys', 'Sports Bra', 'Compression Wear', 'Base Layer'],
    'Athleisure': ['Casual Wear', 'Loungewear', 'Streetwear'],
    'Swimwear': ['Swim Trunks', 'Rash Guards', 'Swim Caps']
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    brand: 'Caper Sports',
    category: '',
    subCategory: '',
    gender: '',
    ageGroup: '',
    material: '',
    careInstructions: '',
    price: '',
    description: '',
    stock: '',
    salePrice: '',
    isFeatured: false,
    isOnSale: false,
    sizes: []
  });

  // Fetch products on component mount and when filters change
  useEffect(() => {
    const filters = {
      search: searchQuery,
      category: selectedCategory,
      brand: selectedBrand,
      status: statusFilter,
      sortBy: sortBy,
      page: currentPage,
      limit: pageLimit
    };
    
    dispatch(getAdminProducts(filters));
  }, [dispatch, searchQuery, selectedCategory, selectedBrand, statusFilter, sortBy, currentPage, pageLimit]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect above
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        toast.success('Product deleted successfully', { autoClose: 2000 });
        // Product is automatically removed from state by the reducer
      } catch (error) {
        toast.error(error || 'Failed to delete product', { autoClose: 3000 });
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      sku: product.sku || '',
      brand: product.brand || 'Caper Sports',
      category: product.category || '',
      subCategory: product.subCategory || '',
      gender: product.gender || '',
      ageGroup: product.ageGroup || '',
      material: product.material || '',
      careInstructions: product.careInstructions || '',
      price: product.price?.toString() || '',
      description: product.description || '',
      stock: product.stock?.toString() || product.totalStock?.toString() || '0',
      salePrice: product.salePrice?.toString() || '',
      isFeatured: product.isFeatured || false,
      isOnSale: product.isOnSale || false,
      sizes: product.sizes?.map(s => s.size || s) || []
    });
    // Set existing images if any
    if (product.images && product.images.length > 0) {
      const existingImages = product.images.map((imageUrl, index) => ({
        preview: imageUrl,
        name: `existing-image-${index}`,
        size: 0,
        existing: true
      }));
      setSelectedImages(existingImages);
    }
    setShowProductModal(true);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) {
      try {
        // Delete each product
        const deletePromises = selectedProducts.map(productId => 
          dispatch(deleteProduct(productId)).unwrap()
        );
        
        await Promise.all(deletePromises);
        toast.success(`${selectedProducts.length} product(s) deleted successfully`, { autoClose: 2000 });
        setSelectedProducts([]);
      } catch (error) {
        toast.error(error || 'Failed to delete products', { autoClose: 3000 });
      }
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setStatusFilter('');
    setSortBy('createdAt');
  };

  // Image upload handlers
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            file: file,
            preview: e.target.result,
            name: file.name,
            size: file.size
          };
          newImages.push(imageData);
          if (newImages.length === files.length) {
            setSelectedImages(prev => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormChange = (field, value) => {
    setProductForm(prev => {
      // Reset subcategory when category changes
      if (field === 'category') {
        return {
          ...prev,
          [field]: value,
          subCategory: ''
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleColorChange = (color, checked) => {
    setProductForm(prev => ({
      ...prev,
      colors: checked 
        ? [...prev.colors, color]
        : prev.colors.filter(c => c !== color)
    }));
  };

  const handleSizeChange = (size, checked) => {
    setProductForm(prev => ({
      ...prev,
      sizes: checked 
        ? [...prev.sizes, size]
        : prev.sizes.filter(s => s !== size)
    }));
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      sku: '',
      brand: 'Caper Sports',
      category: '',
      subCategory: '',
      gender: '',
      ageGroup: '',
      material: '',
      careInstructions: '',
      price: '',
      description: '',
      stock: '',
      salePrice: '',
      isFeatured: false,
      isOnSale: false,
      sizes: []
    });
    setSelectedImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.description || !productForm.subCategory || !productForm.gender || !productForm.ageGroup || !productForm.material || !productForm.careInstructions) {
      toast.error('Please fill in all required fields (name, price, category, subcategory, description, gender, age group, material, care instructions)');
      return;
    }
    
    // Validate images
    if (!selectedImages || selectedImages.length === 0) {
      toast.error('Please select at least one image');
      return;
    }
    
    // Validate sizes
    if (!productForm.sizes || productForm.sizes.length === 0) {
      toast.error('Please select at least one size');
      return;
    }
    
    
    // Generate SKU if not provided
    let sku = productForm.sku;
    if (!sku) {
      // Generate SKU from brand, category, and name
      const brandCode = productForm.brand.substring(0, 3).toUpperCase();
      const categoryCode = productForm.category.substring(0, 3).toUpperCase();
      const nameCode = productForm.name.substring(0, 3).toUpperCase();
      const randomCode = Math.random().toString(36).substring(2, 5).toUpperCase();
      sku = `${brandCode}-${categoryCode}-${nameCode}-${randomCode}`;
    }
    
    try {
      // Prepare product data
      const productData = {
        ...productForm,
        sku: sku,
        price: parseFloat(productForm.price),
        salePrice: productForm.salePrice ? parseFloat(productForm.salePrice) : null,
        totalStock: parseInt(productForm.stock) || 0,
        weight: 0, // Default weight to 0
        colors: [], // Default colors to empty array
        images: selectedImages.map(img => img.preview),
        // Transform sizes from array of strings to array of objects  
        sizes: productForm.sizes.map((sizeName, index) => {
          const totalStock = parseInt(productForm.stock) || 0;
          const numSizes = productForm.sizes.length;
          const baseStock = Math.floor(totalStock / numSizes);
          const remainder = totalStock % numSizes;
          return {
            size: sizeName,
            stock: baseStock + (index < remainder ? 1 : 0)
          };
        })
      };
      
      if (editingProduct) {
        // Update existing product
        await dispatch(updateProduct({ 
          productId: editingProduct._id, 
          productData 
        })).unwrap();
        toast.success('Product updated successfully');
      } else {
        // Create new product
        await dispatch(createProduct(productData)).unwrap();
        toast.success('Product created successfully');
      }
      
      // Close modal and reset form
      setShowProductModal(false);
      setEditingProduct(null);
      resetForm();
      
      // Refresh products list
      dispatch(getAdminProducts({
        search: searchQuery,
        category: selectedCategory,
        brand: selectedBrand,
        status: statusFilter,
        sortBy: sortBy,
        page: currentPage,
        limit: pageLimit
      }));
      
    } catch (error) {
      console.error('Product save error:', error);
      
      // Show detailed error message
      if (error.details && Array.isArray(error.details)) {
        const errorMessages = error.details.map(d => `${d.field}: ${d.message}`).join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        toast.error(error || 'Failed to save product');
      }
    }
  };

  const ProductCard = React.memo(({ product, isSelected, onSelect, onEdit, onDelete }) => {
    const stockStatus = getStockStatus(product);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect(product._id);
                }}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md mr-3"
                      onError={(e) => {
                        // Prevent infinite loop by checking if we already tried to set a placeholder
                        if (e.target.src.includes('placeholder') || e.target.dataset.errorHandled) {
                          // If placeholder also fails, show fallback div
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                          return;
                        }
                        e.target.dataset.errorHandled = 'true';
                        e.target.src = 'https://via.placeholder.com/48x48/0ea5e9/ffffff?text=IMG';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md mr-3 flex items-center justify-center">
                      <FiPackage className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  {/* Fallback div for when both original and placeholder images fail */}
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md mr-3 items-center justify-center" style={{display: 'none'}}>
                    <FiPackage className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.brand} • {product.category}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FiEdit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product._id);
                }}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</p>
              <p className="text-sm font-semibold text-gray-900">
                ₹{product.price?.toLocaleString()}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-through ml-2">
                    ₹{product.originalPrice?.toLocaleString()}
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stock</p>
              <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.color}`}>
                {product.totalStock} {stockStatus.text}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <FiEye className="w-3 h-3 mr-1" />
                <span>Views: {product.views || 0}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <FiTrendingUp className="w-3 h-3 mr-1" />
                <span>Sales: {product.sales || 0}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {product.isFeatured && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Featured
                </span>
              )}
              {product.isOnSale && (
                <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                  On Sale
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Products - Caper Sports</title>
        <meta name="description" content="Manage products - Create, edit, and delete products" />
      </Helmet>

      <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Product Management
              </h1>
              <p className="text-gray-600">
                Manage your product catalog - Add, edit, and organize your products
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowProductModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FiPlus className="mr-2" />
                Add Product
              </Button>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </form>
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiFilter className="mr-2" />
                  Filters
                </button>
                
                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {selectedProducts.length} selected
                    </span>
                    <button 
                      onClick={handleBulkDelete}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Delete Selected
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Categories</option>
                      <option value="Shoes">Shoes</option>
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Shorts">Shorts</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brand
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Brands</option>
                      <option value="Caper Sports">Caper Sports</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="lowStock">Low Stock</option>
                      <option value="outOfStock">Out of Stock</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="createdAt">Newest First</option>
                      <option value="-createdAt">Oldest First</option>
                      <option value="name">Name A-Z</option>
                      <option value="-name">Name Z-A</option>
                      <option value="price">Price Low to High</option>
                      <option value="-price">Price High to Low</option>
                      <option value="totalStock">Stock Low to High</option>
                      <option value="-totalStock">Stock High to Low</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Products Grid */}
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 text-lg">
                Error loading products: {error}
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">
                No products found
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                Try adjusting your search or filters, or add a new product.
              </p>
            </div>
          ) : (
            <>
              {/* Bulk Actions Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    {selectedProducts.length > 0 ? `${selectedProducts.length} selected` : 'Select all'}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Showing {products.length} of {pagination.total} products
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <FiDownload className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <FiUpload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product}
                    isSelected={selectedProducts.includes(product._id)}
                    onSelect={handleSelectProduct}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={pagination.page === 1}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors ${
                          page === pagination.page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Product Modal */}
          {showProductModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowProductModal(false);
                setEditingProduct(null);
                resetForm();
              }
            }}>
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowProductModal(false);
                        setEditingProduct(null);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter product name"
                          value={productForm.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* SKU */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          SKU <span className="text-gray-500 text-xs">(Leave blank to auto-generate)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter SKU or leave blank"
                          value={productForm.sku}
                          onChange={(e) => handleFormChange('sku', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category *
                        </label>
                        <select 
                          value={productForm.category}
                          onChange={(e) => handleFormChange('category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select Category</option>
                          <option value="T-Shirts">T-Shirts</option>
                          <option value="Hoodies">Hoodies</option>
                          <option value="Jackets">Jackets</option>
                          <option value="Shorts">Shorts</option>
                          <option value="Pants">Pants</option>
                          <option value="Shoes">Shoes</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Sportswear">Sportswear</option>
                          <option value="Athleisure">Athleisure</option>
                          <option value="Swimwear">Swimwear</option>
                        </select>
                      </div>

                      {/* Sub Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Sub Category *
                        </label>
                        <select
                          value={productForm.subCategory}
                          onChange={(e) => handleFormChange('subCategory', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          disabled={!productForm.category}
                        >
                          <option value="">Select Sub Category</option>
                          {productForm.category && subCategoryOptions[productForm.category]?.map((subCat) => (
                            <option key={subCat} value={subCat}>{subCat}</option>
                          ))}
                        </select>
                        {!productForm.category && (
                          <p className="mt-1 text-xs text-gray-500">Please select a category first</p>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Gender *
                        </label>
                        <select 
                          value={productForm.gender}
                          onChange={(e) => handleFormChange('gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select Gender</option>
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                          <option value="Unisex">Unisex</option>
                          <option value="Kids">Kids</option>
                        </select>
                      </div>

                      {/* Age Group */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Age Group *
                        </label>
                        <select 
                          value={productForm.ageGroup}
                          onChange={(e) => handleFormChange('ageGroup', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select Age Group</option>
                          <option value="Adult">Adult</option>
                          <option value="Teen">Teen</option>
                          <option value="Kid">Kid</option>
                          <option value="All Ages">All Ages</option>
                        </select>
                      </div>

                      {/* Material */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Material *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter material (e.g., Cotton, Polyester)"
                          value={productForm.material}
                          onChange={(e) => handleFormChange('material', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => handleFormChange('price', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Enter product description"
                        value={productForm.description}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    {/* Care Instructions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Care Instructions *
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Enter care instructions (e.g., Machine wash cold, tumble dry low)"
                        value={productForm.careInstructions}
                        onChange={(e) => handleFormChange('careInstructions', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    {/* Images */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Images *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Drag & drop images here, or click to select
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          PNG, JPG, JPEG up to 5MB each
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          id="product-images"
                          onChange={handleImageUpload}
                        />
                        <label
                          htmlFor="product-images"
                          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                        >
                          Select Images
                        </label>
                      </div>
                      
                      {/* Image Previews */}
                      {selectedImages.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Selected Images ({selectedImages.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image.preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                                  {image.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sizes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Available Sizes *
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <label key={size} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <input
                              type="checkbox"
                              checked={productForm.sizes.includes(size)}
                              onChange={(e) => handleSizeChange(size, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Stock and Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Stock */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          value={productForm.stock}
                          onChange={(e) => handleFormChange('stock', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        {productForm.sizes.length > 0 && productForm.stock && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Will be distributed across {productForm.sizes.length} size{productForm.sizes.length > 1 ? 's' : ''} 
                            (~{Math.floor(parseInt(productForm.stock) / productForm.sizes.length)} per size)
                          </p>
                        )}
                      </div>

                      {/* Featured */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={productForm.isFeatured}
                          onChange={(e) => handleFormChange('isFeatured', e.target.checked)}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Featured Product
                        </label>
                      </div>

                      {/* On Sale */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="onSale"
                          checked={productForm.isOnSale}
                          onChange={(e) => handleFormChange('isOnSale', e.target.checked)}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="onSale" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          On Sale
                        </label>
                      </div>
                    </div>

                    {/* Sale Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sale Price (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowProductModal(false);
                          setEditingProduct(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                      >
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
    </AdminLayout>
  );
};

export default AdminProducts;
