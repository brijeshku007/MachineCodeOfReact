# ⚡ Async Thunks - Handling API Calls and Async Operations

## 🎯 What Are Async Thunks?

Async thunks are Redux Toolkit's solution for handling asynchronous operations like API calls, file uploads, or any operation that returns a Promise. They provide a standardized way to manage loading states, handle errors, and update your store with async data.

## 🤔 Why Do We Need Async Thunks?

### **The Problem with Sync Reducers:**
```jsx
// ❌ This won't work - reducers must be synchronous
const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false },
  reducers: {
    fetchUser: async (state, action) => {  // ❌ Can't use async in reducers!
      state.loading = true
      const user = await api.getUser(action.payload)
      state.data = user
      state.loading = false
    }
  }
})
```

### **The Solution with Async Thunks:**
```jsx
// ✅ This works - async thunks handle the async logic
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Create async thunk
const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId) => {
    const response = await api.getUser(userId)
    return response.data
  }
)

// Handle in slice
const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})
```

## 🧩 createAsyncThunk Anatomy

### **Basic Structure:**
```jsx
const asyncThunk = createAsyncThunk(
  'slice/actionName',        // Action type prefix
  async (arg, thunkAPI) => { // Payload creator function
    // Async logic here
    const result = await someAsyncOperation(arg)
    return result // This becomes action.payload
  }
)
```

### **Complete Example:**
```jsx
const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId, { getState, dispatch, rejectWithValue }) => {
    try {
      // Access current state
      const currentUser = getState().auth.user
      
      // Make API call
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      })
      
      if (!response.ok) {
        // Return custom error payload
        return rejectWithValue({
          message: 'Failed to fetch user',
          status: response.status
        })
      }
      
      const userData = await response.json()
      
      // Dispatch additional actions if needed
      dispatch(logUserActivity(`Viewed user ${userId}`))
      
      return userData
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        status: 'NETWORK_ERROR'
      })
    }
  }
)
```

## 🔄 Async Thunk Lifecycle

### **Three Automatic Actions:**
Every async thunk automatically generates three action types:

```jsx
const fetchUser = createAsyncThunk('user/fetch', async (id) => {
  return await api.getUser(id)
})

// Automatically generates:
// - fetchUser.pending    → 'user/fetch/pending'
// - fetchUser.fulfilled  → 'user/fetch/fulfilled'  
// - fetchUser.rejected   → 'user/fetch/rejected'
```

### **Handling All States:**
```jsx
const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastFetch: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Pending state
      .addCase(fetchUser.pending, (state, action) => {
        state.loading = true
        state.error = null
        console.log('Fetching user...', action.meta.arg) // Original argument
      })
      
      // Success state
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.lastFetch = new Date().toISOString()
        state.error = null
      })
      
      // Error state
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
        console.error('Failed to fetch user:', action.error)
      })
  }
})
```

## 🎨 Advanced Async Thunk Patterns

### **1. Conditional Thunks:**
```jsx
const fetchUserIfNeeded = createAsyncThunk(
  'user/fetchIfNeeded',
  async (userId, { getState }) => {
    const state = getState()
    const existingUser = state.users.entities[userId]
    
    // Only fetch if user doesn't exist or is stale
    if (existingUser && !isStale(existingUser.lastUpdated)) {
      return existingUser // Return existing data
    }
    
    const response = await api.getUser(userId)
    return response.data
  },
  {
    // Condition function - prevents dispatch if returns false
    condition: (userId, { getState }) => {
      const state = getState()
      const existingUser = state.users.entities[userId]
      
      // Don't fetch if already loading
      if (state.users.loading) {
        return false
      }
      
      // Don't fetch if data is fresh
      if (existingUser && !isStale(existingUser.lastUpdated)) {
        return false
      }
      
      return true
    }
  }
)
```

### **2. Thunks with Multiple API Calls:**
```jsx
const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      // Fetch user data and posts in parallel
      const [userResponse, postsResponse, settingsResponse] = await Promise.all([
        api.getUser(userId),
        api.getUserPosts(userId),
        api.getUserSettings(userId)
      ])
      
      // Dispatch additional actions
      dispatch(setPosts(postsResponse.data))
      dispatch(setSettings(settingsResponse.data))
      
      return {
        user: userResponse.data,
        postsCount: postsResponse.data.length,
        lastLogin: userResponse.data.lastLogin
      }
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to load user profile',
        details: error.message
      })
    }
  }
)
```

### **3. Paginated Data Fetching:**
```jsx
const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, limit = 10, reset = false }, { getState, rejectWithValue }) => {
    try {
      const response = await api.getPosts({ page, limit })
      
      return {
        posts: response.data,
        pagination: {
          page,
          limit,
          total: response.total,
          hasMore: response.data.length === limit
        },
        reset // Whether to replace or append data
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Handle in slice
const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    pagination: { page: 1, hasMore: true, total: 0 },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const { posts, pagination, reset } = action.payload
        
        if (reset) {
          state.items = posts
        } else {
          state.items.push(...posts)
        }
        
        state.pagination = pagination
        state.loading = false
      })
  }
})
```

### **4. Optimistic Updates:**
```jsx
const updatePost = createAsyncThunk(
  'posts/update',
  async ({ postId, updates }, { getState, dispatch, rejectWithValue }) => {
    // Optimistic update
    dispatch(postsSlice.actions.updatePostOptimistic({ postId, updates }))
    
    try {
      const response = await api.updatePost(postId, updates)
      return { postId, updates: response.data }
    } catch (error) {
      // Revert optimistic update on error
      dispatch(postsSlice.actions.revertPostUpdate(postId))
      return rejectWithValue(error.message)
    }
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState: { entities: {}, optimisticUpdates: {} },
  reducers: {
    updatePostOptimistic: (state, action) => {
      const { postId, updates } = action.payload
      state.optimisticUpdates[postId] = { ...state.entities[postId] } // Backup
      Object.assign(state.entities[postId], updates)
    },
    revertPostUpdate: (state, action) => {
      const postId = action.payload
      if (state.optimisticUpdates[postId]) {
        state.entities[postId] = state.optimisticUpdates[postId]
        delete state.optimisticUpdates[postId]
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePost.fulfilled, (state, action) => {
        const { postId } = action.payload
        delete state.optimisticUpdates[postId] // Confirm optimistic update
      })
  }
})
```

## 🔄 Error Handling Patterns

### **1. Comprehensive Error Handling:**
```jsx
const createPost = createAsyncThunk(
  'posts/create',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await api.createPost(postData)
      return response.data
    } catch (error) {
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response
        
        switch (status) {
          case 400:
            return rejectWithValue({
              type: 'VALIDATION_ERROR',
              message: 'Please check your input',
              details: data.errors
            })
          case 401:
            return rejectWithValue({
              type: 'AUTH_ERROR',
              message: 'Please log in to continue'
            })
          case 403:
            return rejectWithValue({
              type: 'PERMISSION_ERROR',
              message: 'You don\'t have permission to create posts'
            })
          case 500:
            return rejectWithValue({
              type: 'SERVER_ERROR',
              message: 'Server error. Please try again later.'
            })
          default:
            return rejectWithValue({
              type: 'UNKNOWN_ERROR',
              message: data.message || 'Something went wrong'
            })
        }
      } else if (error.request) {
        // Network error
        return rejectWithValue({
          type: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection.'
        })
      } else {
        // Other error
        return rejectWithValue({
          type: 'CLIENT_ERROR',
          message: error.message
        })
      }
    }
  }
)
```

### **2. Retry Logic:**
```jsx
const fetchWithRetry = createAsyncThunk(
  'data/fetchWithRetry',
  async (url, { rejectWithValue }) => {
    const maxRetries = 3
    let lastError
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        return await response.json()
      } catch (error) {
        lastError = error
        
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          const delay = Math.pow(2, attempt) * 1000
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    return rejectWithValue({
      message: `Failed after ${maxRetries} attempts`,
      lastError: lastError.message
    })
  }
)
```

### **3. Global Error Handling:**
```jsx
// Global error handler middleware
const errorHandlerMiddleware = (store) => (next) => (action) => {
  const result = next(action)
  
  // Handle all rejected async thunks
  if (action.type.endsWith('/rejected')) {
    const error = action.payload || action.error
    
    // Log error
    console.error('Async thunk failed:', action.type, error)
    
    // Show user notification
    store.dispatch(showNotification({
      type: 'error',
      message: error.message || 'Something went wrong'
    }))
    
    // Handle auth errors globally
    if (error.type === 'AUTH_ERROR') {
      store.dispatch(logout())
    }
  }
  
  return result
}
```

## 🎯 Real-World Async Thunk Examples

### **1. User Authentication Flow:**
```jsx
const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.login({ email, password })
      const { user, token, refreshToken } = response.data
      
      // Store tokens
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      
      // Set up token refresh
      dispatch(scheduleTokenRefresh(token))
      
      return { user, token }
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Login failed'
      })
    }
  }
)

const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }
      
      const response = await api.refreshToken(refreshToken)
      const { token: newToken } = response.data
      
      localStorage.setItem('token', newToken)
      
      return { token: newToken }
    } catch (error) {
      // Clear tokens on refresh failure
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      
      return rejectWithValue('Session expired')
    }
  }
)
```

### **2. File Upload with Progress:**
```jsx
const uploadFile = createAsyncThunk(
  'files/upload',
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        // Track upload progress
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          dispatch(setUploadProgress(progress))
        }
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const result = await response.json()
      
      // Reset progress
      dispatch(setUploadProgress(0))
      
      return result
    } catch (error) {
      dispatch(setUploadProgress(0))
      return rejectWithValue(error.message)
    }
  }
)
```

### **3. Search with Debouncing:**
```jsx
let searchTimeout

const searchProducts = createAsyncThunk(
  'products/search',
  async (query, { dispatch, getState }) => {
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    // Debounce search
    return new Promise((resolve) => {
      searchTimeout = setTimeout(async () => {
        try {
          const response = await api.searchProducts(query)
          resolve(response.data)
        } catch (error) {
          resolve([]) // Return empty results on error
        }
      }, 300) // 300ms debounce
    })
  },
  {
    condition: (query, { getState }) => {
      // Don't search for empty queries
      return query.trim().length > 0
    }
  }
)
```

## 🎨 Using Async Thunks in Components

### **1. Basic Usage:**
```jsx
import { useSelector, useDispatch } from 'react-redux'
import { fetchUser } from './userSlice'

function UserProfile({ userId }) {
  const dispatch = useDispatch()
  const { data: user, loading, error } = useSelector(state => state.user)
  
  useEffect(() => {
    dispatch(fetchUser(userId))
  }, [dispatch, userId])
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>User not found</div>
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### **2. Handling Promise Results:**
```jsx
function CreatePostForm() {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ title: '', content: '' })
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Async thunks return promises
      const result = await dispatch(createPost(formData)).unwrap()
      
      // Success - redirect or show success message
      console.log('Post created:', result)
      setFormData({ title: '', content: '' })
      
    } catch (error) {
      // Error - show error message
      console.error('Failed to create post:', error)
      alert(error.message)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="Post title"
      />
      <textarea
        value={formData.content}
        onChange={(e) => setFormData({...formData, content: e.target.value})}
        placeholder="Post content"
      />
      <button type="submit">Create Post</button>
    </form>
  )
}
```

## 🎉 What You've Mastered

After completing async thunks, you can:

- ✅ **Handle async operations** with createAsyncThunk
- ✅ **Manage loading states** automatically with pending/fulfilled/rejected
- ✅ **Implement error handling** with custom error payloads
- ✅ **Create conditional thunks** that prevent unnecessary API calls
- ✅ **Handle complex async flows** with multiple API calls
- ✅ **Implement optimistic updates** for better UX
- ✅ **Add retry logic** for robust error recovery
- ✅ **Integrate with React components** effectively

## 🚀 What's Next?

Now that you understand async thunks, you're ready for:

1. **RTK Query** → `05-rtk-query` - Modern data fetching with caching
2. **Advanced Patterns** → `06-advanced-patterns` - Entity adapters and optimization
3. **Middleware** → `07-middleware` - Custom middleware and side effects

---

**🎉 You can now handle any async operation in Redux Toolkit!**

**Next:** `05-rtk-query/rtk-query-concepts.md`