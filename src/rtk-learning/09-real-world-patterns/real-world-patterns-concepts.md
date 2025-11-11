# 🏗️ Real-World RTK Architecture

## 🎯 Learning Objectives

By the end of this module, you will:
- ✅ Master large-scale application architecture with RTK
- ✅ Implement feature-based code organization
- ✅ Handle code splitting and lazy loading with RTK
- ✅ Design scalable state management patterns
- ✅ Optimize performance for production applications
- ✅ Implement best practices for team collaboration

## 📚 Why Real-World Architecture Matters?

Real-world applications require:
- **Scalability** - Handle growing complexity and team size
- **Maintainability** - Easy to modify and extend
- **Performance** - Fast loading and smooth user experience
- **Team Collaboration** - Clear structure for multiple developers
- **Code Reusability** - Shared components and logic
- **Testing** - Easy to test and debug

### **Architecture Principles:**
- **Feature-Based Organization** - Group by business features
- **Separation of Concerns** - Clear boundaries between layers
- **Dependency Injection** - Loose coupling between modules
- **Single Responsibility** - Each module has one purpose
- **DRY (Don't Repeat Yourself)** - Reusable code patterns

## 🏗️ Feature-Based Architecture

### **1. Directory Structure**

```
src/
├── app/                    # App-level configuration
│   ├── store.js           # Store configuration
│   ├── rootReducer.js     # Root reducer
│   └── middleware.js      # Custom middleware
├── shared/                # Shared utilities and components
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── constants/        # App constants
│   └── types/            # TypeScript types
├── features/             # Feature modules
│   ├── auth/            # Authentication feature
│   │   ├── components/  # Auth-specific components
│   │   ├── hooks/       # Auth-specific hooks
│   │   ├── services/    # Auth API services
│   │   ├── slice/       # Auth RTK slice
│   │   ├── selectors/   # Auth selectors
│   │   └── index.js     # Feature exports
│   ├── dashboard/       # Dashboard feature
│   ├── products/        # Products feature
│   └── orders/          # Orders feature
├── pages/               # Page components
├── layouts/             # Layout components
└── assets/              # Static assets
```

### **2. Feature Module Structure**

```javascript
// features/products/index.js - Feature barrel export
export { default as productsSlice } from './slice/productsSlice'
export * from './slice/productsSlice'
export * from './selectors/productsSelectors'
export * from './components'
export * from './hooks'
export * from './services'

// features/products/slice/productsSlice.js
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../services/productsApi'

const productsAdapter = createEntityAdapter({
  selectId: (product) => product.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
})

const productsSlice = createSlice({
  name: 'products',
  initialState: productsAdapter.getInitialState({
    loading: false,
    error: null,
    filters: {
      category: 'all',
      priceRange: [0, 1000],
      searchTerm: '',
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
    },
  }),
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.page = 1 // Reset to first page
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        productsAdapter.setAll(state, action.payload.products)
        state.pagination.total = action.payload.total
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Add product
      .addCase(addProduct.fulfilled, (state, action) => {
        productsAdapter.addOne(state, action.payload)
      })
      
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        productsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        })
      })
      
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        productsAdapter.removeOne(state, action.payload)
      })
  },
})

export const { setFilters, setPagination, clearError } = productsSlice.actions
export default productsSlice
```

### **3. Feature Services**

```javascript
// features/products/services/productsApi.js
import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from '../../../shared/services/apiClient'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, limit = 20, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      })
      
      const response = await apiClient.get(`/products?${params}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  }
)

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/products', productData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product')
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/products/${id}`, updates)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product')
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/products/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product')
    }
  }
)
```

### **4. Feature Selectors**

```javascript
// features/products/selectors/productsSelectors.js
import { createSelector } from '@reduxjs/toolkit'
import { createEntityAdapter } from '@reduxjs/toolkit'

const productsAdapter = createEntityAdapter()
const productsSelectors = productsAdapter.getSelectors((state) => state.products)

// Base selectors
export const selectAllProducts = productsSelectors.selectAll
export const selectProductById = productsSelectors.selectById
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsError = (state) => state.products.error
export const selectProductsFilters = (state) => state.products.filters
export const selectProductsPagination = (state) => state.products.pagination

// Derived selectors
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectProductsFilters],
  (products, filters) => {
    let filtered = products

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    )

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }
)

export const selectProductsStats = createSelector(
  [selectAllProducts],
  (products) => ({
    total: products.length,
    categories: [...new Set(products.map(p => p.category))],
    averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length || 0,
    priceRange: {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price)),
    },
  })
)

// Factory selectors
export const makeSelectProductsByCategory = () => createSelector(
  [selectAllProducts, (state, category) => category],
  (products, category) => products.filter(product => product.category === category)
)
```

### **5. Feature Hooks**

```javascript
// features/products/hooks/useProducts.js
import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setFilters,
  setPagination,
} from '../services/productsApi'
import {
  selectFilteredProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsFilters,
  selectProductsPagination,
} from '../selectors/productsSelectors'

export const useProducts = () => {
  const dispatch = useDispatch()
  
  const products = useSelector(selectFilteredProducts)
  const loading = useSelector(selectProductsLoading)
  const error = useSelector(selectProductsError)
  const filters = useSelector(selectProductsFilters)
  const pagination = useSelector(selectProductsPagination)

  const loadProducts = useCallback(() => {
    dispatch(fetchProducts({ 
      page: pagination.page, 
      limit: pagination.limit, 
      filters 
    }))
  }, [dispatch, pagination.page, pagination.limit, filters])

  const createProduct = useCallback((productData) => {
    return dispatch(addProduct(productData))
  }, [dispatch])

  const editProduct = useCallback((id, updates) => {
    return dispatch(updateProduct({ id, updates }))
  }, [dispatch])

  const removeProduct = useCallback((id) => {
    return dispatch(deleteProduct(id))
  }, [dispatch])

  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters))
  }, [dispatch])

  const updatePagination = useCallback((newPagination) => {
    dispatch(setPagination(newPagination))
  }, [dispatch])

  // Auto-load products when filters or pagination change
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return {
    products,
    loading,
    error,
    filters,
    pagination,
    actions: {
      loadProducts,
      createProduct,
      editProduct,
      removeProduct,
      updateFilters,
      updatePagination,
    },
  }
}

// features/products/hooks/useProduct.js
export const useProduct = (productId) => {
  const dispatch = useDispatch()
  const product = useSelector(state => selectProductById(state, productId))
  const loading = useSelector(selectProductsLoading)
  const error = useSelector(selectProductsError)

  const updateProduct = useCallback((updates) => {
    return dispatch(editProduct(productId, updates))
  }, [dispatch, productId])

  const deleteProduct = useCallback(() => {
    return dispatch(removeProduct(productId))
  }, [dispatch, productId])

  return {
    product,
    loading,
    error,
    actions: {
      updateProduct,
      deleteProduct,
    },
  }
}
```

## 🏪 Store Architecture

### **1. Root Store Configuration**

```javascript
// app/store.js
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import rootReducer from './rootReducer'
import { customMiddleware } from './middleware'
import { apiSlice } from '../shared/services/api'

export const createStore = (preloadedState) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          ignoredPaths: ['register'],
        },
      })
      .concat(apiSlice.middleware)
      .concat(customMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  })

  // Enable listener behavior for RTK Query
  setupListeners(store.dispatch)

  // Hot reloading for reducers
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./rootReducer', () => {
      const newRootReducer = require('./rootReducer').default
      store.replaceReducer(newRootReducer)
    })
  }

  return store
}

export const store = createStore()
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### **2. Root Reducer**

```javascript
// app/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Feature reducers
import { authSlice } from '../features/auth'
import { productsSlice } from '../features/products'
import { ordersSlice } from '../features/orders'
import { dashboardSlice } from '../features/dashboard'
import { apiSlice } from '../shared/services/api'

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: ['api'], // Don't persist API cache
}

const appReducer = combineReducers({
  auth: authSlice.reducer,
  products: productsSlice.reducer,
  orders: ordersSlice.reducer,
  dashboard: dashboardSlice.reducer,
  api: apiSlice.reducer,
})

// Reset state on logout
const rootReducer = (state, action) => {
  if (action.type === 'auth/logout/fulfilled') {
    // Clear all state except API cache
    const { api } = state
    state = { api }
  }
  return appReducer(state, action)
}

export default persistReducer(persistConfig, rootReducer)
```

### **3. Custom Middleware**

```javascript
// app/middleware.js
import { createListenerMiddleware } from '@reduxjs/toolkit'
import { authMiddleware } from '../features/auth/middleware'
import { analyticsMiddleware } from '../shared/middleware/analytics'
import { errorMiddleware } from '../shared/middleware/error'

// Create listener middleware
export const listenerMiddleware = createListenerMiddleware()

// Add feature-specific listeners
authMiddleware(listenerMiddleware)

export const customMiddleware = [
  listenerMiddleware.middleware,
  analyticsMiddleware,
  errorMiddleware,
]
```

## 🔄 Code Splitting & Lazy Loading

### **1. Route-Based Code Splitting**

```javascript
// app/routes.js
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LoadingSpinner } from '../shared/components/LoadingSpinner'
import { ErrorBoundary } from '../shared/components/ErrorBoundary'

// Lazy load page components
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Products = lazy(() => import('../pages/Products'))
const Orders = lazy(() => import('../pages/Orders'))
const Profile = lazy(() => import('../pages/Profile'))

const LazyRoute = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  </ErrorBoundary>
)

export const AppRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={
      <LazyRoute>
        <Dashboard />
      </LazyRoute>
    } />
    <Route path="/products/*" element={
      <LazyRoute>
        <Products />
      </LazyRoute>
    } />
    <Route path="/orders/*" element={
      <LazyRoute>
        <Orders />
      </LazyRoute>
    } />
    <Route path="/profile" element={
      <LazyRoute>
        <Profile />
      </LazyRoute>
    } />
  </Routes>
)
```

### **2. Dynamic Reducer Loading**

```javascript
// shared/utils/dynamicReducers.js
export const injectReducer = (store, key, reducer) => {
  if (store.asyncReducers[key]) {
    return false
  }

  store.asyncReducers[key] = reducer
  store.replaceReducer(createReducer(store.asyncReducers))
  return true
}

export const createReducer = (asyncReducers = {}) => {
  return combineReducers({
    // Static reducers
    auth: authReducer,
    api: apiSlice.reducer,
    // Dynamic reducers
    ...asyncReducers,
  })
}

// Usage in components
const ProductsPage = () => {
  const store = useStore()
  
  useEffect(() => {
    // Dynamically inject products reducer
    injectReducer(store, 'products', productsSlice.reducer)
  }, [store])

  return <ProductsContainer />
}
```

### **3. Feature-Based Lazy Loading**

```javascript
// shared/hooks/useFeature.js
import { useEffect, useState } from 'react'
import { useStore } from 'react-redux'

export const useFeature = (featureName) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const store = useStore()

  useEffect(() => {
    const loadFeature = async () => {
      try {
        // Dynamically import feature
        const feature = await import(`../../features/${featureName}`)
        
        // Inject reducer
        if (feature.reducer) {
          injectReducer(store, featureName, feature.reducer)
        }
        
        // Initialize feature
        if (feature.initialize) {
          await feature.initialize(store.dispatch)
        }
        
        setIsLoaded(true)
      } catch (err) {
        setError(err)
      }
    }

    loadFeature()
  }, [featureName, store])

  return { isLoaded, error }
}

// Usage
const ProductsPage = () => {
  const { isLoaded, error } = useFeature('products')

  if (error) return <ErrorPage error={error} />
  if (!isLoaded) return <LoadingSpinner />

  return <ProductsContainer />
}
```

## 🎯 Performance Optimization

### **1. Selector Optimization**

```javascript
// shared/utils/selectorUtils.js
import { createSelector } from '@reduxjs/toolkit'
import { shallowEqual } from 'react-redux'

// Memoized selector factory
export const createMemoizedSelector = (dependencies, resultFunc) => {
  return createSelector(dependencies, resultFunc)
}

// Shallow equal selector hook
export const useShallowEqualSelector = (selector) => {
  return useSelector(selector, shallowEqual)
}

// Optimized list selector
export const createListSelector = (selectItems, selectFilter) => {
  return createSelector(
    [selectItems, selectFilter],
    (items, filter) => {
      if (!filter || Object.keys(filter).length === 0) {
        return items
      }
      
      return items.filter(item => {
        return Object.entries(filter).every(([key, value]) => {
          if (value === null || value === undefined || value === '') {
            return true
          }
          return item[key] === value
        })
      })
    }
  )
}
```

### **2. Component Optimization**

```javascript
// shared/components/OptimizedList.jsx
import React, { memo, useMemo, useCallback } from 'react'
import { FixedSizeList as List } from 'react-window'

const OptimizedList = memo(({ 
  items, 
  renderItem, 
  itemHeight = 50,
  height = 400 
}) => {
  const ItemRenderer = useCallback(({ index, style }) => {
    const item = items[index]
    return (
      <div style={style}>
        {renderItem(item, index)}
      </div>
    )
  }, [items, renderItem])

  const listProps = useMemo(() => ({
    height,
    itemCount: items.length,
    itemSize: itemHeight,
  }), [height, items.length, itemHeight])

  return (
    <List {...listProps}>
      {ItemRenderer}
    </List>
  )
})

export default OptimizedList
```

### **3. Bundle Optimization**

```javascript
// webpack.config.js optimization
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        rtk: {
          test: /[\\/]node_modules[\\/]@reduxjs[\\/]/,
          name: 'rtk',
          chunks: 'all',
        },
        features: {
          test: /[\\/]src[\\/]features[\\/]/,
          name: 'features',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
}
```

## 🔒 Security & Error Handling

### **1. API Security**

```javascript
// shared/services/apiClient.js
import axios from 'axios'
import { store } from '../../app/store'
import { logout } from '../../features/auth'

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on unauthorized
      store.dispatch(logout())
    }
    
    if (error.response?.status >= 500) {
      // Log server errors
      console.error('Server error:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
```

### **2. Error Boundaries**

```javascript
// shared/components/ErrorBoundary.jsx
import React from 'react'
import { connect } from 'react-redux'
import { logError } from '../services/errorLogging'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to service
    logError(error, errorInfo, this.props.user)
    
    // Dispatch error action
    this.props.dispatch({
      type: 'app/errorOccurred',
      payload: {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      },
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
})

export default connect(mapStateToProps)(ErrorBoundary)
```

## 🧪 Testing Architecture

### **1. Test Utilities**

```javascript
// shared/utils/testUtils.js
import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { createStore } from '../../app/store'

export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createStore(preloadedState),
    route = '/',
    ...renderOptions
  } = {}
) => {
  window.history.pushState({}, 'Test page', route)

  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

export const createMockStore = (initialState = {}) => {
  return createStore(initialState)
}
```

### **2. Feature Testing**

```javascript
// features/products/tests/products.integration.test.js
import { renderWithProviders } from '../../../shared/utils/testUtils'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import ProductsPage from '../pages/ProductsPage'

const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.json({
        products: [
          { id: 1, name: 'Product 1', price: 100, category: 'electronics' },
          { id: 2, name: 'Product 2', price: 200, category: 'clothing' },
        ],
        total: 2,
      })
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Products Feature Integration', () => {
  test('should load and display products', async () => {
    renderWithProviders(<ProductsPage />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
      expect(screen.getByText('Product 2')).toBeInTheDocument()
    })
  })

  test('should filter products by category', async () => {
    renderWithProviders(<ProductsPage />)

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    const categoryFilter = screen.getByLabelText('Category')
    fireEvent.change(categoryFilter, { target: { value: 'electronics' } })

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument()
  })
})
```

## 🚀 Deployment & Production

### **1. Environment Configuration**

```javascript
// shared/config/environment.js
const config = {
  development: {
    API_URL: 'http://localhost:3001/api',
    ENABLE_REDUX_DEVTOOLS: true,
    LOG_LEVEL: 'debug',
  },
  staging: {
    API_URL: 'https://staging-api.example.com/api',
    ENABLE_REDUX_DEVTOOLS: true,
    LOG_LEVEL: 'info',
  },
  production: {
    API_URL: 'https://api.example.com/api',
    ENABLE_REDUX_DEVTOOLS: false,
    LOG_LEVEL: 'error',
  },
}

export default config[process.env.NODE_ENV || 'development']
```

### **2. Performance Monitoring**

```javascript
// shared/services/monitoring.js
import { store } from '../../app/store'

export const initializeMonitoring = () => {
  // Performance monitoring
  if ('performance' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          // Track page load performance
          trackMetric('page_load_time', entry.loadEventEnd - entry.loadEventStart)
        }
      })
    })
    
    observer.observe({ entryTypes: ['navigation'] })
  }

  // Redux action monitoring
  store.subscribe(() => {
    const state = store.getState()
    
    // Monitor store size
    const storeSize = JSON.stringify(state).length
    if (storeSize > 1000000) { // 1MB
      console.warn('Store size is getting large:', storeSize)
    }
  })
}

const trackMetric = (name, value) => {
  if (window.analytics) {
    window.analytics.track('performance_metric', {
      metric: name,
      value,
      timestamp: Date.now(),
    })
  }
}
```

## 🎯 Key Takeaways

### **Architecture Benefits:**
- **Scalability** - Handle growing complexity with feature-based organization
- **Maintainability** - Clear structure and separation of concerns
- **Performance** - Optimized loading and rendering
- **Team Collaboration** - Consistent patterns and clear boundaries
- **Testing** - Easy to test individual features and integrations

### **Best Practices:**
- ✅ Feature-based directory structure
- ✅ Lazy loading for better performance
- ✅ Proper error handling and boundaries
- ✅ Security-first API integration
- ✅ Comprehensive testing strategy
- ✅ Performance monitoring and optimization

### **When to Use These Patterns:**
- ✅ Large applications with multiple features
- ✅ Team development environments
- ✅ Production applications requiring high performance
- ✅ Applications with complex business logic
- ✅ Long-term maintenance requirements

## 🚀 Next Steps

After mastering real-world architecture, you'll be ready for:
- **Advanced RTK** - Expert-level techniques and optimizations
- **Team Leadership** - Guide architectural decisions
- **Performance Optimization** - Advanced optimization techniques
- **Mentoring** - Help other developers learn RTK

Real-world architecture patterns provide the foundation for building scalable, maintainable applications that can grow with your business needs and team size.

---

**Ready to implement real-world patterns?** Check out `RealWorldExample.jsx` for hands-on practice! 🎯