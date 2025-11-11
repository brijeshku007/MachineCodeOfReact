# 🏪 Store Setup - Configuring Your RTK Store

## 🎯 What is Store Configuration?

Store configuration is the process of setting up your Redux store with the right reducers, middleware, and development tools. RTK's `configureStore` makes this process simple while providing excellent defaults and flexibility for customization.

## 🔧 Basic Store Setup

### **Simple Store Configuration:**
```jsx
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import todosReducer from '../features/todos/todosSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer
  }
})

export default store
```

### **What configureStore Provides by Default:**
- ✅ **Redux DevTools Extension** - Automatic integration
- ✅ **Serializable State Check** - Warns about non-serializable values
- ✅ **Immutable State Check** - Warns about state mutations
- ✅ **Thunk Middleware** - For async operations
- ✅ **Good Defaults** - Optimized for development and production

## 🏗️ Advanced Store Configuration

### **Complete Store Setup:**
```jsx
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import logger from 'redux-logger'

// Import reducers
import counterReducer from '../features/counter/counterSlice'
import todosReducer from '../features/todos/todosSlice'
import userReducer from '../features/user/userSlice'

// Persistence configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'todos'] // Only persist these reducers
}

// Root reducer
const rootReducer = {
  counter: counterReducer,
  todos: todosReducer,
  user: userReducer
}

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // RTK default middleware options
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      },
      immutableCheck: {
        warnAfter: 128 // Warn if check takes longer than 128ms
      }
    }).concat(
      // Add custom middleware
      logger, // Redux logger for development
      // Add more middleware here
    ),
    
  // DevTools configuration
  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'My App Store',
    trace: true,
    traceLimit: 25
  },
  
  // Preloaded state (optional)
  preloadedState: {
    counter: { value: 10 },
    user: { isAuthenticated: false }
  }
})

// Create persistor
export const persistor = persistStore(store)
export default store
```

## 🔄 Root Reducer Patterns

### **1. Simple Object Reducer:**
```jsx
// Simple approach - good for small apps
const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
    user: userReducer
  }
})

// State shape: { counter: {...}, todos: {...}, user: {...} }
```

### **2. Combined Reducer:**
```jsx
import { combineReducers } from '@reduxjs/toolkit'

// Explicit combining - good for complex apps
const rootReducer = combineReducers({
  counter: counterReducer,
  todos: todosReducer,
  user: userReducer
})

const store = configureStore({
  reducer: rootReducer
})
```

### **3. Nested Reducer Structure:**
```jsx
// Organized by feature domains
const rootReducer = combineReducers({
  // Authentication domain
  auth: combineReducers({
    user: userReducer,
    session: sessionReducer
  }),
  
  // Application data domain
  data: combineReducers({
    todos: todosReducer,
    projects: projectsReducer
  }),
  
  // UI state domain
  ui: combineReducers({
    modals: modalsReducer,
    notifications: notificationsReducer
  })
})

// State shape: { auth: { user: {...}, session: {...} }, data: {...}, ui: {...} }
```

## 🛠️ Middleware Configuration

### **Default Middleware:**
```jsx
// RTK includes these middleware by default:
const store = configureStore({
  reducer: rootReducer,
  // Default middleware (automatically included):
  // - redux-thunk (for async actions)
  // - Immutability check middleware (development only)
  // - Serializability check middleware (development only)
})
```

### **Customizing Default Middleware:**
```jsx
const store = configureStore({
  reducer: rootReducer,
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Thunk options
      thunk: {
        extraArgument: {
          api: myApiService,
          router: history
        }
      },
      
      // Serializable check options
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
        
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        
        // Ignore these paths in the state
        ignoredPaths: ['items.dates']
      },
      
      // Immutable check options
      immutableCheck: {
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
        warnAfter: 128
      }
    })
})
```

### **Adding Custom Middleware:**
```jsx
import logger from 'redux-logger'
import { createListenerMiddleware } from '@reduxjs/toolkit'

// Create custom middleware
const listenerMiddleware = createListenerMiddleware()

const store = configureStore({
  reducer: rootReducer,
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(logger) // Add redux-logger
      .concat(listenerMiddleware.middleware) // Add listener middleware
      .prepend(
        // Add middleware at the beginning
        customMiddleware
      )
})
```

## 🔍 Development Tools Configuration

### **DevTools Setup:**
```jsx
const store = configureStore({
  reducer: rootReducer,
  
  // DevTools configuration
  devTools: process.env.NODE_ENV !== 'production' && {
    // Custom name in DevTools
    name: 'My Amazing App',
    
    // Enable action stack traces
    trace: true,
    traceLimit: 25,
    
    // Custom action sanitizer
    actionSanitizer: (action) => ({
      ...action,
      // Hide sensitive data
      payload: action.type.includes('password') ? '[HIDDEN]' : action.payload
    }),
    
    // Custom state sanitizer
    stateSanitizer: (state) => ({
      ...state,
      // Hide sensitive state
      user: state.user ? { ...state.user, password: '[HIDDEN]' } : state.user
    })
  }
})
```

### **Production DevTools:**
```jsx
// Conditional DevTools for production debugging
const store = configureStore({
  reducer: rootReducer,
  
  devTools: process.env.NODE_ENV !== 'production' || 
           process.env.REACT_APP_ENABLE_DEVTOOLS === 'true'
})
```

## 💾 State Persistence

### **Redux Persist Integration:**
```jsx
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import sessionStorage from 'redux-persist/lib/storage/session' // sessionStorage

// Persistence configuration
const persistConfig = {
  key: 'root',
  storage, // or sessionStorage
  
  // Only persist these reducers
  whitelist: ['user', 'settings'],
  
  // Don't persist these reducers
  blacklist: ['ui', 'temp'],
  
  // Transform data before persisting
  transforms: [
    // Custom transform
    {
      in: (inboundState, key) => {
        // Transform state before persisting
        return inboundState
      },
      out: (outboundState, key) => {
        // Transform state after rehydrating
        return outboundState
      }
    }
  ],
  
  // Migration for version changes
  version: 1,
  migrate: (state) => {
    // Handle state migrations
    return Promise.resolve(state)
  }
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER'
        ]
      }
    })
})

export const persistor = persistStore(store)
```

### **Using Persisted Store:**
```jsx
// App.js
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <MyApp />
      </PersistGate>
    </Provider>
  )
}
```

## 🎯 Environment-Specific Configuration

### **Development vs Production:**
```jsx
const isDevelopment = process.env.NODE_ENV === 'development'

const store = configureStore({
  reducer: rootReducer,
  
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      // More strict checks in development
      immutableCheck: isDevelopment,
      serializableCheck: isDevelopment
    })
    
    // Add logger only in development
    if (isDevelopment) {
      const logger = require('redux-logger').default
      middleware.push(logger)
    }
    
    return middleware
  },
  
  // DevTools only in development
  devTools: isDevelopment
})
```

### **Feature Flags:**
```jsx
const store = configureStore({
  reducer: {
    ...baseReducers,
    
    // Conditionally add reducers based on feature flags
    ...(process.env.REACT_APP_FEATURE_ANALYTICS && {
      analytics: analyticsReducer
    }),
    
    ...(process.env.REACT_APP_FEATURE_EXPERIMENTS && {
      experiments: experimentsReducer
    })
  }
})
```

## 🔄 Hot Reloading Setup

### **Development Hot Reloading:**
```jsx
// store.js
const store = configureStore({
  reducer: rootReducer
})

// Hot reloading for reducers
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default
    store.replaceReducer(newRootReducer)
  })
}

export default store
```

## 🧪 Testing Store Configuration

### **Test Store Setup:**
```jsx
// testUtils.js
import { configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

// Create test store
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    // Disable middleware for faster tests
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false
      })
  })
}

// Test render helper
export function renderWithStore(ui, { preloadedState = {}, ...renderOptions } = {}) {
  const store = createTestStore(preloadedState)
  
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }
  
  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store
  }
}
```

### **Using Test Store:**
```jsx
// Component.test.js
import { renderWithStore } from './testUtils'
import MyComponent from './MyComponent'

test('renders with initial state', () => {
  const preloadedState = {
    counter: { value: 5 },
    user: { name: 'Test User' }
  }
  
  const { getByText } = renderWithStore(<MyComponent />, { preloadedState })
  
  expect(getByText('5')).toBeInTheDocument()
  expect(getByText('Test User')).toBeInTheDocument()
})
```

## 🎨 Store Organization Patterns

### **1. Feature-Based Structure:**
```
src/
├── app/
│   ├── store.js          # Store configuration
│   └── rootReducer.js    # Root reducer
├── features/
│   ├── counter/
│   │   └── counterSlice.js
│   ├── todos/
│   │   └── todosSlice.js
│   └── user/
│       └── userSlice.js
```

### **2. Domain-Based Structure:**
```
src/
├── store/
│   ├── index.js          # Store configuration
│   ├── rootReducer.js    # Root reducer
│   └── middleware.js     # Custom middleware
├── domains/
│   ├── auth/
│   │   ├── userSlice.js
│   │   └── sessionSlice.js
│   ├── data/
│   │   ├── todosSlice.js
│   │   └── projectsSlice.js
│   └── ui/
│       ├── modalsSlice.js
│       └── notificationsSlice.js
```

## 🎯 Best Practices

### **1. Keep Store Configuration Simple:**
```jsx
// ✅ Good - Simple and clear
const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer
  }
})

// ❌ Avoid - Overly complex configuration
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(middleware1)
      .concat(middleware2)
      .concat(middleware3)
      .prepend(middleware4),
  devTools: {
    // Too many options
  }
})
```

### **2. Use Environment Variables:**
```jsx
// ✅ Good - Environment-aware configuration
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware()
    
    if (process.env.NODE_ENV === 'development') {
      middleware.push(logger)
    }
    
    return middleware
  }
})
```

### **3. Separate Concerns:**
```jsx
// ✅ Good - Separate files for different concerns
// store/index.js
export { default } from './store'

// store/store.js
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import middleware from './middleware'

export default configureStore({
  reducer: rootReducer,
  middleware
})

// store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit'
// ... reducer imports

export default combineReducers({
  // ... reducers
})

// store/middleware.js
export default (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(
    // ... custom middleware
  )
```

## 🎉 What You've Mastered

After completing store setup, you can:

- ✅ **Configure RTK stores** with proper defaults and customization
- ✅ **Organize reducers** in scalable patterns
- ✅ **Add custom middleware** for specific needs
- ✅ **Set up development tools** for better debugging
- ✅ **Implement state persistence** for data retention
- ✅ **Create environment-specific** configurations
- ✅ **Set up testing utilities** for store testing

## 🚀 What's Next?

Now that you understand store configuration, you're ready for:

1. **Slices Deep Dive** → `03-slices` - Advanced slice patterns
2. **Async Operations** → `04-async-thunks` - Handling API calls
3. **RTK Query** → `05-rtk-query` - Modern data fetching

---

**🎉 Your store is now properly configured and ready for complex applications!**

**Next:** `03-slices/slices-concepts.md`