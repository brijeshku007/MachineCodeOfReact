# ⚙️ RTK Middleware & Side Effects

## 🎯 Learning Objectives

By the end of this module, you will:
- ✅ Master custom middleware creation and integration
- ✅ Implement side effects with listener middleware
- ✅ Handle complex async flows and business logic
- ✅ Integrate with external services and APIs
- ✅ Create debugging and monitoring solutions

## 📚 What is Middleware?

Middleware in Redux provides a third-party extension point between dispatching an action and the moment it reaches the reducer. It's perfect for logging, crash reporting, talking to an asynchronous API, routing, and more.

### **Key Concepts:**
- **Action Interception** - Catch and modify actions
- **Side Effects** - Handle async operations and external interactions
- **Cross-cutting Concerns** - Logging, analytics, error handling
- **Business Logic** - Complex workflows and state orchestration

## 🔧 Built-in RTK Middleware

### **1. Redux Toolkit Default Middleware**

```javascript
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    // your reducers
  },
  // RTK includes these middleware by default:
  // - redux-thunk (for async actions)
  // - Immutability check middleware (development)
  // - Serializability check middleware (development)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configure default middleware
      thunk: {
        extraArgument: { api: myApi }, // Add extra argument to thunks
      },
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore specific actions
        ignoredPaths: ['some.nested.path'], // Ignore specific state paths
      },
      immutableCheck: {
        ignoredPaths: ['some.nested.path'], // Ignore specific state paths
      },
    }),
})
```

### **2. Adding Custom Middleware**

```javascript
import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(logger) // Add logger middleware
      .concat(customMiddleware) // Add custom middleware
      .prepend(firstMiddleware), // Add middleware at the beginning
})
```

## 🏗️ Creating Custom Middleware

### **1. Basic Middleware Structure**

```javascript
// Basic middleware template
const customMiddleware = (store) => (next) => (action) => {
  // Before action reaches reducer
  console.log('Dispatching:', action)
  console.log('Current state:', store.getState())
  
  // Call the next middleware or reducer
  const result = next(action)
  
  // After action has been processed
  console.log('New state:', store.getState())
  
  return result
}

// Alternative arrow function syntax
const customMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  // Middleware logic here
  return next(action)
}
```

### **2. Logging Middleware**

```javascript
const loggerMiddleware = ({ getState }) => (next) => (action) => {
  const prevState = getState()
  const result = next(action)
  const nextState = getState()
  
  console.group(`Action: ${action.type}`)
  console.log('Previous State:', prevState)
  console.log('Action:', action)
  console.log('Next State:', nextState)
  console.groupEnd()
  
  return result
}
```

### **3. Error Handling Middleware**

```javascript
const errorHandlingMiddleware = ({ dispatch }) => (next) => (action) => {
  try {
    return next(action)
  } catch (error) {
    console.error('Middleware caught an error:', error)
    
    // Dispatch error action
    dispatch({
      type: 'ERROR_OCCURRED',
      payload: {
        error: error.message,
        action: action.type,
        timestamp: new Date().toISOString(),
      }
    })
    
    // Re-throw or handle gracefully
    throw error
  }
}
```

### **4. Analytics Middleware**

```javascript
const analyticsMiddleware = ({ getState }) => (next) => (action) => {
  const result = next(action)
  
  // Track specific actions
  const trackableActions = [
    'user/login',
    'user/logout',
    'post/created',
    'post/liked',
    'purchase/completed',
  ]
  
  if (trackableActions.includes(action.type)) {
    // Send to analytics service
    analytics.track(action.type, {
      userId: getState().auth.userId,
      timestamp: Date.now(),
      payload: action.payload,
    })
  }
  
  return result
}
```

## 🎧 Listener Middleware

RTK's listener middleware provides a powerful way to handle side effects in response to actions or state changes.

### **1. Basic Listener Setup**

```javascript
import { createListenerMiddleware, addListener } from '@reduxjs/toolkit'

// Create listener middleware instance
const listenerMiddleware = createListenerMiddleware()

// Add to store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})

// Add listeners
listenerMiddleware.startListening({
  actionCreator: userLoggedIn,
  effect: async (action, listenerApi) => {
    // Side effect logic
    console.log('User logged in:', action.payload)
    
    // Access store methods
    const state = listenerApi.getState()
    const dispatch = listenerApi.dispatch
    
    // Perform async operations
    try {
      const userProfile = await fetchUserProfile(action.payload.userId)
      dispatch(profileLoaded(userProfile))
    } catch (error) {
      dispatch(profileLoadFailed(error.message))
    }
  },
})
```

### **2. Advanced Listener Patterns**

```javascript
// Listen to multiple actions
listenerMiddleware.startListening({
  matcher: (action) => ['user/login', 'user/register'].includes(action.type),
  effect: async (action, listenerApi) => {
    // Handle both login and register
    await initializeUserSession(action.payload)
  },
})

// Listen to action with predicate
listenerMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    return action.type === 'cart/itemAdded' && 
           currentState.cart.items.length > previousState.cart.items.length
  },
  effect: async (action, listenerApi) => {
    // Only run when item is actually added to cart
    await updateCartOnServer(listenerApi.getState().cart)
  },
})

// Listen to state changes
listenerMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    return currentState.auth.isAuthenticated !== previousState.auth.isAuthenticated
  },
  effect: async (action, listenerApi) => {
    const { isAuthenticated } = listenerApi.getState().auth
    
    if (isAuthenticated) {
      // User just logged in
      await loadUserData(listenerApi.dispatch)
    } else {
      // User just logged out
      await clearUserData(listenerApi.dispatch)
    }
  },
})
```

## 🌐 Real-World Middleware Examples

### **1. API Synchronization Middleware**

```javascript
const apiSyncMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  const result = next(action)
  
  // Sync certain actions to server
  const syncActions = {
    'posts/postAdded': (action) => ({
      method: 'POST',
      url: '/api/posts',
      data: action.payload,
    }),
    'posts/postUpdated': (action) => ({
      method: 'PUT',
      url: `/api/posts/${action.payload.id}`,
      data: action.payload.changes,
    }),
    'posts/postDeleted': (action) => ({
      method: 'DELETE',
      url: `/api/posts/${action.payload}`,
    }),
  }
  
  const syncConfig = syncActions[action.type]
  if (syncConfig && getState().auth.isAuthenticated) {
    // Queue API call (don't block the action)
    setTimeout(async () => {
      try {
        await fetch(syncConfig.url, {
          method: syncConfig.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getState().auth.token}`,
          },
          body: syncConfig.data ? JSON.stringify(syncConfig.data) : undefined,
        })
      } catch (error) {
        dispatch(syncFailed({ action: action.type, error: error.message }))
      }
    }, 0)
  }
  
  return result
}
```

### **2. Performance Monitoring Middleware**

```javascript
const performanceMiddleware = ({ getState }) => (next) => (action) => {
  const startTime = performance.now()
  const startMemory = performance.memory?.usedJSHeapSize || 0
  
  const result = next(action)
  
  const endTime = performance.now()
  const endMemory = performance.memory?.usedJSHeapSize || 0
  const duration = endTime - startTime
  const memoryDelta = endMemory - startMemory
  
  // Log slow actions
  if (duration > 10) { // More than 10ms
    console.warn(`Slow action detected: ${action.type}`, {
      duration: `${duration.toFixed(2)}ms`,
      memoryDelta: `${(memoryDelta / 1024).toFixed(2)}KB`,
      action,
    })
  }
  
  return result
}
```

## 🎯 Key Takeaways

### **Middleware Benefits:**
- **Cross-cutting Concerns** - Handle logging, analytics, error tracking
- **Side Effects** - Manage async operations and external integrations
- **Business Logic** - Implement complex workflows and state orchestration
- **Development Tools** - Add debugging and monitoring capabilities

### **When to Use Middleware:**
- ✅ Logging and debugging
- ✅ Analytics and tracking
- ✅ API synchronization
- ✅ Error handling and monitoring
- ✅ Complex async workflows

## 🚀 Next Steps

After mastering middleware, you'll be ready for:
- **Testing** - Comprehensive testing strategies
- **Real-world Architecture** - Large-scale application patterns
- **Performance Optimization** - Advanced optimization techniques

---

**Ready to implement middleware?** Check out `MiddlewareExample.jsx` for hands-on practice! 🎯