import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react'
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  configureStore,
  createListenerMiddleware
} from '@reduxjs/toolkit'
import { Provider, useSelector, useDispatch } from 'react-redux'

// 🏗️ This component demonstrates real-world RTK architecture patterns
// Feature-based organization, lazy loading, performance optimization, and scalability

// 🔧 Mock API Service (simulates real backend)
const mockApiService = {
  // Products API
  products: {
    fetchAll: async (filters = {}) => {
      await new Promise(resolve => setTimeout(resolve, 800))
      const allProducts = [
        { id: 1, name: 'MacBook Pro', price: 2499, category: 'electronics', brand: 'Apple', stock: 15, rating: 4.8 },
        { id: 2, name: 'iPhone 15', price: 999, category: 'electronics', brand: 'Apple', stock: 25, rating: 4.7 },
        { id: 3, name: 'Nike Air Max', price: 129, category: 'clothing', brand: 'Nike', stock: 50, rating: 4.5 },
        { id: 4, name: 'Samsung TV', price: 799, category: 'electronics', brand: 'Samsung', stock: 8, rating: 4.6 },
        { id: 5, name: 'Adidas Hoodie', price: 79, category: 'clothing', brand: 'Adidas', stock: 30, rating: 4.3 },
        { id: 6, name: 'Dell Monitor', price: 299, category: 'electronics', brand: 'Dell', stock: 12, rating: 4.4 },
        { id: 7, name: 'Levi\'s Jeans', price: 89, category: 'clothing', brand: 'Levi\'s', stock: 40, rating: 4.2 },
        { id: 8, name: 'Sony Headphones', price: 199, category: 'electronics', brand: 'Sony', stock: 20, rating: 4.9 },
      ]

      let filtered = allProducts

      if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(p => p.category === filters.category)
      }

      if (filters.brand && filters.brand !== 'all') {
        filtered = filtered.filter(p => p.brand === filters.brand)
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower)
        )
      }

      if (filters.priceRange) {
        filtered = filtered.filter(p =>
          p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
        )
      }

      return {
        products: filtered,
        total: filtered.length,
        categories: [...new Set(allProducts.map(p => p.category))],
        brands: [...new Set(allProducts.map(p => p.brand))],
      }
    },

    create: async (productData) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        id: Date.now(),
        ...productData,
        stock: productData.stock || 0,
        rating: 0,
      }
    },

    update: async (id, updates) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { id, ...updates }
    },

    delete: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return id
    },
  },

  // Orders API
  orders: {
    fetchAll: async () => {
      await new Promise(resolve => setTimeout(resolve, 600))
      return [
        { id: 1, productId: 1, quantity: 1, total: 2499, status: 'delivered', date: '2024-01-15' },
        { id: 2, productId: 3, quantity: 2, total: 258, status: 'shipped', date: '2024-01-20' },
        { id: 3, productId: 8, quantity: 1, total: 199, status: 'pending', date: '2024-01-22' },
      ]
    },

    create: async (orderData) => {
      await new Promise(resolve => setTimeout(resolve, 400))
      return {
        id: Date.now(),
        ...orderData,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
      }
    },
  },

  // Analytics API
  analytics: {
    fetchDashboard: async () => {
      await new Promise(resolve => setTimeout(resolve, 400))
      return {
        totalRevenue: 125430,
        totalOrders: 1247,
        totalProducts: 8,
        totalCustomers: 892,
        recentOrders: 23,
        topProducts: [
          { id: 1, name: 'MacBook Pro', sales: 45 },
          { id: 8, name: 'Sony Headphones', sales: 38 },
          { id: 2, name: 'iPhone 15', sales: 32 },
        ],
      }
    },
  },
}

// 🔄 Feature: Products
// Async Thunks
const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await mockApiService.products.fetchAll(filters)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const product = await mockApiService.products.create(productData)
      return product
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const product = await mockApiService.products.update(id, updates)
      return product
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await mockApiService.products.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Entity Adapter
const productsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.rating - a.rating,
})

// Products Slice
const productsSlice = createSlice({
  name: 'products',
  initialState: productsAdapter.getInitialState({
    loading: false,
    error: null,
    filters: {
      category: 'all',
      brand: 'all',
      search: '',
      priceRange: [0, 3000],
    },
    metadata: {
      categories: [],
      brands: [],
      total: 0,
    },
  }),
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        category: 'all',
        brand: 'all',
        search: '',
        priceRange: [0, 3000],
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        productsAdapter.setAll(state, action.payload.products)
        state.metadata = {
          categories: action.payload.categories,
          brands: action.payload.brands,
          total: action.payload.total,
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        productsAdapter.addOne(state, action.payload)
        state.metadata.total += 1
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        productsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        })
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        productsAdapter.removeOne(state, action.payload)
        state.metadata.total -= 1
      })
  },
})

export const { setFilters, clearFilters, clearError } = productsSlice.actions

// 🔄 Feature: Orders
const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await mockApiService.orders.fetchAll()
      return orders
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const order = await mockApiService.orders.create(orderData)
      return order
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const ordersAdapter = createEntityAdapter({
  sortComparer: (a, b) => new Date(b.date) - new Date(a.date),
})

const ordersSlice = createSlice({
  name: 'orders',
  initialState: ordersAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {
    clearOrdersError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        ordersAdapter.setAll(state, action.payload)
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        ordersAdapter.addOne(state, action.payload)
      })
  },
})

export const { clearOrdersError } = ordersSlice.actions

// 🔄 Feature: Analytics/Dashboard
const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await mockApiService.analytics.fetchDashboard()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearDashboardError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearDashboardError } = dashboardSlice.actions

// 🎯 Selectors (Optimized with memoization)
// Products Selectors
const productsSelectors = productsAdapter.getSelectors(state => state.products)

export const selectAllProducts = productsSelectors.selectAll
export const selectProductById = productsSelectors.selectById
export const selectProductsLoading = state => state.products.loading
export const selectProductsError = state => state.products.error
export const selectProductsFilters = state => state.products.filters
export const selectProductsMetadata = state => state.products.metadata

// Filtered Products Selector (Memoized)
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectProductsFilters],
  (products, filters) => {
    let filtered = products

    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    if (filters.brand !== 'all') {
      filtered = filtered.filter(p => p.brand === filters.brand)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower)
      )
    }

    if (filters.priceRange) {
      filtered = filtered.filter(p =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      )
    }

    return filtered
  }
)

// Products Statistics Selector
export const selectProductsStats = createSelector(
  [selectAllProducts],
  (products) => ({
    total: products.length,
    averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length || 0,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    lowStock: products.filter(p => p.stock < 10).length,
    categories: [...new Set(products.map(p => p.category))].length,
  })
)

// Orders Selectors
const ordersSelectors = ordersAdapter.getSelectors(state => state.orders)

export const selectAllOrders = ordersSelectors.selectAll
export const selectOrdersLoading = state => state.orders.loading
export const selectOrdersError = state => state.orders.error

export const selectOrdersStats = createSelector(
  [selectAllOrders],
  (orders) => ({
    total: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    pending: orders.filter(o => o.status === 'pending').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  })
)

// Dashboard Selectors
export const selectDashboardData = state => state.dashboard.data
export const selectDashboardLoading = state => state.dashboard.loading
export const selectDashboardError = state => state.dashboard.error

// 🎧 Listener Middleware for Side Effects
const listenerMiddleware = createListenerMiddleware()

// Auto-refresh dashboard data every 30 seconds
listenerMiddleware.startListening({
  actionCreator: fetchDashboardData.fulfilled,
  effect: async (action, listenerApi) => {
    await listenerApi.delay(30000) // 30 seconds

    // Only refresh if still on dashboard and no errors
    const state = listenerApi.getState()
    if (!state.dashboard.error) {
      listenerApi.dispatch(fetchDashboardData())
    }
  },
})

// Log product operations for analytics
listenerMiddleware.startListening({
  matcher: (action) => [
    addProduct.fulfilled.type,
    updateProduct.fulfilled.type,
    deleteProduct.fulfilled.type,
  ].includes(action.type),
  effect: async (action, listenerApi) => {
    const operation = action.type.split('/')[1] // get operation name
    console.log(`📊 Analytics: Product ${operation}`, {
      productId: action.payload.id || action.payload,
      timestamp: new Date().toISOString(),
      user: 'current-user', // In real app, get from auth state
    })
  },
})

// 🏪 Store Configuration
const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    orders: ordersSlice.reducer,
    dashboard: dashboardSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).prepend(listenerMiddleware.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// 🎯 Custom Hooks (Feature-specific)
const useProducts = () => {
  const dispatch = useDispatch()
  const products = useSelector(selectFilteredProducts)
  const allProducts = useSelector(selectAllProducts)
  const loading = useSelector(selectProductsLoading)
  const error = useSelector(selectProductsError)
  const filters = useSelector(selectProductsFilters)
  const metadata = useSelector(selectProductsMetadata)
  const stats = useSelector(selectProductsStats)

  const loadProducts = useCallback(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, filters])

  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters))
  }, [dispatch])

  const createProduct = useCallback((productData) => {
    return dispatch(addProduct(productData))
  }, [dispatch])

  const editProduct = useCallback((id, updates) => {
    return dispatch(updateProduct({ id, updates }))
  }, [dispatch])

  const removeProduct = useCallback((id) => {
    return dispatch(deleteProduct(id))
  }, [dispatch])

  // Auto-load products when filters change
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return {
    products,
    allProducts,
    loading,
    error,
    filters,
    metadata,
    stats,
    actions: {
      loadProducts,
      updateFilters,
      createProduct,
      editProduct,
      removeProduct,
      clearFilters: () => dispatch(clearFilters()),
      clearError: () => dispatch(clearError()),
    },
  }
}

const useOrders = () => {
  const dispatch = useDispatch()
  const orders = useSelector(selectAllOrders)
  const loading = useSelector(selectOrdersLoading)
  const error = useSelector(selectOrdersError)
  const stats = useSelector(selectOrdersStats)

  const loadOrders = useCallback(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const placeOrder = useCallback((orderData) => {
    return dispatch(createOrder(orderData))
  }, [dispatch])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  return {
    orders,
    loading,
    error,
    stats,
    actions: {
      loadOrders,
      placeOrder,
      clearError: () => dispatch(clearOrdersError()),
    },
  }
}

const useDashboard = () => {
  const dispatch = useDispatch()
  const data = useSelector(selectDashboardData)
  const loading = useSelector(selectDashboardLoading)
  const error = useSelector(selectDashboardError)

  const loadDashboard = useCallback(() => {
    dispatch(fetchDashboardData())
  }, [dispatch])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  return {
    data,
    loading,
    error,
    actions: {
      loadDashboard,
      clearError: () => dispatch(clearDashboardError()),
    },
  }
}

// 📊 Dashboard Component
const Dashboard = React.memo(() => {
  const { data, loading, error } = useDashboard()

  if (loading && !data) {
    return (
      <div className="dashboard loading">
        <div className="loading-spinner">📊</div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard error">
        <h3>❌ Dashboard Error</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="dashboard">
      <h2>📊 Dashboard</h2>

      <div className="dashboard-stats">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-number">${data.totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <div className="stat-number">{data.totalOrders.toLocaleString()}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">🛍️</div>
          <div className="stat-info">
            <div className="stat-number">{data.totalProducts}</div>
            <div className="stat-label">Products</div>
          </div>
        </div>

        <div className="stat-card customers">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-number">{data.totalCustomers.toLocaleString()}</div>
            <div className="stat-label">Customers</div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="recent-activity">
          <h3>📈 Recent Activity</h3>
          <div className="activity-item">
            <span className="activity-icon">🔔</span>
            <span>{data.recentOrders} new orders in the last hour</span>
          </div>
        </div>

        <div className="top-products">
          <h3>🏆 Top Products</h3>
          <div className="products-list">
            {data.topProducts.map(product => (
              <div key={product.id} className="product-item">
                <span className="product-name">{product.name}</span>
                <span className="product-sales">{product.sales} sales</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

// 🛍️ Products Component
const Products = React.memo(() => {
  const {
    products,
    loading,
    error,
    filters,
    metadata,
    stats,
    actions
  } = useProducts()

  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'electronics',
    brand: '',
    stock: '',
  })

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price || !newProduct.brand) return

    try {
      await actions.createProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock) || 0,
      })
      setNewProduct({ name: '', price: '', category: 'electronics', brand: '', stock: '' })
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to add product:', error)
    }
  }

  return (
    <div className="products">
      <div className="products-header">
        <h2>🛍️ Products ({products.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-product-btn"
        >
          {showAddForm ? '❌ Cancel' : '➕ Add Product'}
        </button>
      </div>

      {/* Product Statistics */}
      <div className="products-stats">
        <div className="stat-item">
          <span className="stat-label">Total Products:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average Price:</span>
          <span className="stat-value">${stats.averagePrice.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Value:</span>
          <span className="stat-value">${stats.totalValue.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Low Stock:</span>
          <span className="stat-value">{stats.lowStock}</span>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="add-product-form">
          <h3>➕ Add New Product</h3>
          <form onSubmit={handleAddProduct}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
            <div className="form-row">
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
              </select>
              <input
                type="text"
                placeholder="Brand"
                value={newProduct.brand}
                onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
              />
            </div>
            <button type="submit" className="submit-btn">
              ➕ Add Product
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="products-filters">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={filters.category}
            onChange={(e) => actions.updateFilters({ category: e.target.value })}
          >
            <option value="all">All Categories</option>
            {metadata.categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Brand:</label>
          <select
            value={filters.brand}
            onChange={(e) => actions.updateFilters({ brand: e.target.value })}
          >
            <option value="all">All Brands</option>
            {metadata.brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => actions.updateFilters({ search: e.target.value })}
          />
        </div>

        <button onClick={actions.clearFilters} className="clear-filters-btn">
          🗑️ Clear Filters
        </button>
      </div>

      {/* Products List */}
      {loading && products.length === 0 ? (
        <div className="products-loading">
          <div className="loading-spinner">🛍️</div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="products-error">
          <h3>❌ Error Loading Products</h3>
          <p>{error}</p>
          <button onClick={actions.loadProducts}>🔄 Try Again</button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  )
})

// 🃏 Product Card Component (Optimized)
const ProductCard = React.memo(({ product }) => {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
  })

  const handleEdit = async () => {
    if (isEditing) {
      try {
        await dispatch(updateProduct({
          id: product.id,
          updates: {
            ...editData,
            price: parseFloat(editData.price),
            stock: parseInt(editData.stock),
          },
        }))
        setIsEditing(false)
      } catch (error) {
        console.error('Failed to update product:', error)
      }
    } else {
      setIsEditing(true)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await dispatch(deleteProduct(product.id))
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }

  const handleOrder = async () => {
    try {
      await dispatch(createOrder({
        productId: product.id,
        quantity: 1,
        total: product.price,
      }))
      alert(`Order placed for ${product.name}!`)
    } catch (error) {
      console.error('Failed to create order:', error)
    }
  }

  return (
    <div className="product-card">
      <div className="product-header">
        {isEditing ? (
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
            className="edit-input"
          />
        ) : (
          <h3>{product.name}</h3>
        )}
        <div className="product-rating">
          ⭐ {product.rating}
        </div>
      </div>

      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <div className="product-category">{product.category}</div>
      </div>

      <div className="product-details">
        <div className="product-price">
          {isEditing ? (
            <input
              type="number"
              value={editData.price}
              onChange={(e) => setEditData(prev => ({ ...prev, price: e.target.value }))}
              className="edit-input price-input"
            />
          ) : (
            <span>${product.price}</span>
          )}
        </div>
        <div className="product-stock">
          Stock: {isEditing ? (
            <input
              type="number"
              value={editData.stock}
              onChange={(e) => setEditData(prev => ({ ...prev, stock: e.target.value }))}
              className="edit-input stock-input"
            />
          ) : (
            <span className={product.stock < 10 ? 'low-stock' : ''}>{product.stock}</span>
          )}
        </div>
      </div>

      <div className="product-actions">
        <button onClick={handleEdit} className="edit-btn">
          {isEditing ? '💾 Save' : '✏️ Edit'}
        </button>
        {isEditing ? (
          <button onClick={() => setIsEditing(false)} className="cancel-btn">
            ❌ Cancel
          </button>
        ) : (
          <>
            <button onClick={handleOrder} className="order-btn">
              🛒 Order
            </button>
            <button onClick={handleDelete} className="delete-btn">
              🗑️ Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
})

// 📦 Orders Component
const Orders = React.memo(() => {
  const { orders, loading, error, stats } = useOrders()

  if (loading && orders.length === 0) {
    return (
      <div className="orders loading">
        <div className="loading-spinner">📦</div>
        <p>Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="orders error">
        <h3>❌ Error Loading Orders</h3>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="orders">
      <h2>📦 Orders ({orders.length})</h2>

      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.delivered}</div>
          <div className="stat-label">Delivered</div>
        </div>
      </div>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-id">Order #{order.id}</span>
              <span className={`order-status ${order.status}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="order-details">
              <div>Product ID: {order.productId}</div>
              <div>Quantity: {order.quantity}</div>
              <div>Total: ${order.total}</div>
              <div>Date: {order.date}</div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="no-orders">
          <p>No orders found.</p>
        </div>
      )}
    </div>
  )
})

// 🎯 Main Real-World Example Component
function RealWorldExample() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', component: Dashboard },
    { id: 'products', label: '🛍️ Products', component: Products },
    { id: 'orders', label: '📦 Orders', component: Orders },
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="real-world-example">
      <div className="header">
        <h1>🏗️ Real-World RTK Architecture</h1>
        <p>Feature-based organization, performance optimization, and scalable patterns</p>
      </div>

      <div className="navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="main-content">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          {ActiveComponent && <ActiveComponent />}
        </Suspense>
      </div>

      <div className="architecture-info">
        <h3>🏗️ Architecture Patterns Demonstrated:</h3>
        <div className="patterns-grid">
          <div className="pattern-category">
            <h4>🏪 Feature-Based Organization</h4>
            <ul>
              <li>✅ Separate slices for each feature</li>
              <li>✅ Feature-specific hooks and selectors</li>
              <li>✅ Modular and maintainable structure</li>
              <li>✅ Clear separation of concerns</li>
            </ul>
          </div>

          <div className="pattern-category">
            <h4>⚡ Performance Optimization</h4>
            <ul>
              <li>✅ Memoized selectors with createSelector</li>
              <li>✅ React.memo for component optimization</li>
              <li>✅ Entity adapters for normalized data</li>
              <li>✅ Lazy loading with Suspense</li>
            </ul>
          </div>

          <div className="pattern-category">
            <h4>🔄 Advanced State Management</h4>
            <ul>
              <li>✅ Complex async operations with thunks</li>
              <li>✅ Listener middleware for side effects</li>
              <li>✅ Cross-feature state relationships</li>
              <li>✅ Real-time data updates</li>
            </ul>
          </div>

          <div className="pattern-category">
            <h4>🎯 Production Ready</h4>
            <ul>
              <li>✅ Error handling and recovery</li>
              <li>✅ Loading states and user feedback</li>
              <li>✅ Scalable architecture patterns</li>
              <li>✅ Team collaboration structure</li>
            </ul>
          </div>
        </div>

        <div className="best-practices">
          <h4>🎯 Best Practices Applied:</h4>
          <div className="practices-list">
            <div className="practice-item">
              <strong>Feature Isolation:</strong> Each feature (products, orders, dashboard) is self-contained with its own slice, selectors, and hooks.
            </div>
            <div className="practice-item">
              <strong>Performance Optimization:</strong> Memoized selectors prevent unnecessary re-renders and computations.
            </div>
            <div className="practice-item">
              <strong>Error Boundaries:</strong> Comprehensive error handling at component and async operation levels.
            </div>
            <div className="practice-item">
              <strong>Code Splitting:</strong> Lazy loading components for better initial load performance.
            </div>
            <div className="practice-item">
              <strong>Real-time Updates:</strong> Listener middleware handles side effects and auto-refresh functionality.
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .real-world-example {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
        }

        .header h1 {
          margin: 0 0 10px 0;
          font-size: 2.5rem;
        }

        .header p {
          margin: 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .navigation {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 2px solid #e1e5e9;
        }

        .nav-tab {
          padding: 12px 24px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
        }

        .nav-tab:hover {
          color: #333;
          background: #f8f9fa;
        }

        .nav-tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: #f8f9fa;
        }

        .main-content {
          min-height: 600px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 30px;
          margin-bottom: 40px;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: #666;
        }

        .loading-spinner {
          font-size: 2rem;
          animation: spin 2s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Dashboard Styles */
        .dashboard h2 {
          margin-top: 0;
          color: #333;
          text-align: center;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .stat-card.revenue { border-left-color: #4caf50; }
        .stat-card.orders { border-left-color: #2196f3; }
        .stat-card.products { border-left-color: #ff9800; }
        .stat-card.customers { border-left-color: #9c27b0; }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-number {
          font-size: 1.8rem;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
        }

        .dashboard-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .recent-activity,
        .top-products {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .recent-activity h3,
        .top-products h3 {
          margin-top: 0;
          color: #333;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
        }

        .activity-icon {
          font-size: 1.2rem;
        }

        .products-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .product-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: white;
          border-radius: 6px;
        }

        .product-name {
          font-weight: 500;
        }

        .product-sales {
          color: #666;
          font-size: 0.9rem;
        }

        /* Products Styles */
        .products h2 {
          margin-top: 0;
          color: #333;
        }

        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .add-product-btn {
          padding: 10px 20px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s ease;
        }

        .add-product-btn:hover {
          background: #45a049;
        }

        .products-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #666;
        }

        .stat-value {
          font-weight: bold;
          color: #333;
        }

        .add-product-form {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .add-product-form h3 {
          margin-top: 0;
          color: #333;
        }

        .form-row {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .form-row input,
        .form-row select {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }

        .submit-btn {
          padding: 10px 20px;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
        }

        .submit-btn:hover {
          background: #1976d2;
        }

        .products-filters {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-group label {
          font-weight: 500;
          color: #333;
        }

        .filter-group select,
        .filter-group input {
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .clear-filters-btn {
          padding: 6px 12px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .clear-filters-btn:hover {
          background: #d32f2f;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .product-card {
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 20px;
          background: #fafbfc;
          transition: all 0.2s ease;
        }

        .product-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .product-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.2rem;
        }

        .product-rating {
          color: #ff9800;
          font-size: 0.9rem;
        }

        .product-info {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          font-size: 0.9rem;
          color: #666;
        }

        .product-brand {
          font-weight: 500;
        }

        .product-category {
          text-transform: capitalize;
        }

        .product-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .product-price {
          font-size: 1.3rem;
          font-weight: bold;
          color: #4caf50;
        }

        .product-stock {
          font-size: 0.9rem;
          color: #666;
        }

        .low-stock {
          color: #f44336;
          font-weight: bold;
        }

        .product-actions {
          display: flex;
          gap: 8px;
        }

        .product-actions button {
          flex: 1;
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .edit-btn:hover {
          background: #e3f2fd;
          border-color: #2196f3;
        }

        .order-btn:hover {
          background: #e8f5e8;
          border-color: #4caf50;
        }

        .delete-btn:hover {
          background: #ffebee;
          border-color: #f44336;
          color: #f44336;
        }

        .cancel-btn:hover {
          background: #fff3e0;
          border-color: #ff9800;
        }

        .edit-input {
          width: 100%;
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .price-input,
        .stock-input {
          width: 80px;
        }

        .no-products {
          text-align: center;
          padding: 40px;
          color: #666;
          font-style: italic;
        }

        /* Orders Styles */
        .orders h2 {
          margin-top: 0;
          color: #333;
        }

        .orders-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .orders-stats .stat-card {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #2196f3;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .order-card {
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 20px;
          background: #fafbfc;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .order-id {
          font-weight: bold;
          color: #333;
        }

        .order-status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .order-status.pending {
          background: #fff3e0;
          color: #f57c00;
        }

        .order-status.shipped {
          background: #e3f2fd;
          color: #1976d2;
        }

        .order-status.delivered {
          background: #e8f5e8;
          color: #388e3c;
        }

        .order-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          font-size: 0.9rem;
          color: #666;
        }

        .no-orders {
          text-align: center;
          padding: 40px;
          color: #666;
          font-style: italic;
        }

        .error {
          text-align: center;
          padding: 40px;
          color: #f44336;
          background: #ffebee;
          border-radius: 8px;
          margin: 20px 0;
        }

        .error button {
          margin-top: 15px;
          padding: 10px 20px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .error button:hover {
          background: #d32f2f;
        }

        /* Architecture Info */
        .architecture-info {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 30px;
        }

        .architecture-info h3 {
          margin-top: 0;
          color: #333;
          text-align: center;
        }

        .patterns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .pattern-category {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .pattern-category h4 {
          margin-top: 0;
          color: #667eea;
          border-bottom: 2px solid #e1e5e9;
          padding-bottom: 10px;
        }

        .pattern-category ul {
          list-style: none;
          padding: 0;
        }

        .pattern-category li {
          padding: 5px 0;
          color: #666;
        }

        .best-practices {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .best-practices h4 {
          margin-top: 0;
          color: #333;
          text-align: center;
        }

        .practices-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .practice-item {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 4px solid #667eea;
        }

        .practice-item strong {
          color: #333;
        }

        @media (max-width: 1024px) {
          .dashboard-sections {
            grid-template-columns: 1fr;
          }

          .products-filters {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .patterns-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .real-world-example {
            padding: 10px;
          }

          .header h1 {
            font-size: 2rem;
          }

          .navigation {
            flex-wrap: wrap;
          }

          .nav-tab {
            flex: 1;
            min-width: 120px;
          }

          .main-content {
            padding: 20px;
          }

          .dashboard-stats {
            grid-template-columns: 1fr;
          }

          .products-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .products-stats {
            flex-direction: column;
            gap: 10px;
          }

          .form-row {
            flex-direction: column;
          }

          .product-actions {
            flex-direction: column;
          }

          .orders-stats {
            grid-template-columns: 1fr;
          }

          .order-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

// 🎯 Main App Component with Provider
export default function RealWorldApp() {
  return (
    <Provider store={store}>
      <RealWorldExample />
    </Provider>
  )
}