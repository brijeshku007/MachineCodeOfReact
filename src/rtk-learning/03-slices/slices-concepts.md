# 🍰 Slices - Advanced State Management Patterns

## 🎯 What Are Advanced Slice Patterns?

Advanced slice patterns go beyond basic createSlice usage to handle complex state structures, cross-slice communication, performance optimization, and real-world application scenarios. These patterns help you build scalable, maintainable state management solutions.

## 🧩 Advanced Slice Structure

### **Complete Slice Anatomy:**
```jsx
import { createSlice, createSelector } from '@reduxjs/toolkit'

const advancedSlice = createSlice({
  name: 'advanced',
  
  // Complex initial state
  initialState: {
    // Data entities
    entities: {},
    ids: [],
    
    // UI state
    ui: {
      loading: false,
      error: null,
      selectedId: null,
      filters: {
        category: 'all',
        sortBy: 'name',
        searchTerm: ''
      }
    },
    
    // Metadata
    meta: {
      lastUpdated: null,
      version: 1,
      totalCount: 0
    }
  },
  
  reducers: {
    // Simple reducers
    setLoading: (state, action) => {
      state.ui.loading = action.payload
    },
    
    // Complex reducers with validation
    updateEntity: (state, action) => {
      const { id, updates } = action.payload
      
      if (state.entities[id]) {
        Object.assign(state.entities[id], updates)
        state.meta.lastUpdated = Date.now()
      }
    },
    
    // Prepared action creators
    addEntity: {
      reducer: (state, action) => {
        const entity = action.payload
        state.entities[entity.id] = entity
        state.ids.push(entity.id)
        state.meta.totalCount += 1
      },
      prepare: (data) => ({
        payload: {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString()
        }
      })
    }
  },
  
  // Handle external actions
  extraReducers: (builder) => {
    builder
      .addCase('auth/logout', (state) => {
        // Reset state on logout
        return initialState
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.ui.loading = true
          state.ui.error = null
        }
      )
  }
})

export const { setLoading, updateEntity, addEntity } = advancedSlice.actions
export default advancedSlice.reducer
```

## 🎨 State Normalization Patterns

### **1. Normalized Entity Structure:**
```jsx
// ❌ Denormalized - Hard to update
const badState = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      author: { id: 1, name: 'John', email: 'john@example.com' },
      comments: [
        { id: 1, text: 'Great post!', author: { id: 2, name: 'Jane' } }
      ]
    }
  ]
}

// ✅ Normalized - Easy to update
const goodState = {
  posts: {
    entities: {
      1: { id: 1, title: 'Post 1', authorId: 1, commentIds: [1] }
    },
    ids: [1]
  },
  authors: {
    entities: {
      1: { id: 1, name: 'John', email: 'john@example.com' },
      2: { id: 2, name: 'Jane', email: 'jane@example.com' }
    },
    ids: [1, 2]
  },
  comments: {
    entities: {
      1: { id: 1, text: 'Great post!', authorId: 2, postId: 1 }
    },
    ids: [1]
  }
}
```

### **2. Entity Adapter Pattern:**
```jsx
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

// Create entity adapter
const postsAdapter = createEntityAdapter({
  // Sort by title
  sortComparer: (a, b) => a.title.localeCompare(b.title),
  
  // Custom ID selector (if not 'id')
  selectId: (post) => post.postId
})

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({
    // Additional state
    loading: false,
    error: null
  }),
  reducers: {
    // Entity adapter methods
    addPost: postsAdapter.addOne,
    addPosts: postsAdapter.addMany,
    updatePost: postsAdapter.updateOne,
    removePost: postsAdapter.removeOne,
    
    // Custom reducers
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    // Bulk operations
    upsertPosts: postsAdapter.upsertMany,
    
    // Custom update logic
    likePost: (state, action) => {
      const postId = action.payload
      const post = state.entities[postId]
      if (post) {
        post.likes = (post.likes || 0) + 1
      }
    }
  }
})

// Export entity selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectEntities: selectPostEntities,
  selectTotal: selectTotalPosts
} = postsAdapter.getSelectors(state => state.posts)

export const { addPost, updatePost, removePost, likePost } = postsSlice.actions
export default postsSlice.reducer
```

## 🔄 Cross-Slice Communication

### **1. Using extraReducers for Cross-Slice Actions:**
```jsx
// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null, preferences: {} },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    logout: (state) => {
      state.profile = null
      state.preferences = {}
    }
  }
})

// Posts slice that responds to user actions
const postsSlice = createSlice({
  name: 'posts',
  initialState: { items: [], userPosts: [] },
  reducers: {
    addPost: (state, action) => {
      state.items.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      // Listen to user logout
      .addCase(userSlice.actions.logout, (state) => {
        state.userPosts = []
      })
      // Listen to user profile changes
      .addCase(userSlice.actions.setProfile, (state, action) => {
        const userId = action.payload.id
        state.userPosts = state.items.filter(post => post.authorId === userId)
      })
  }
})
```

### **2. Shared Action Patterns:**
```jsx
// Shared actions file
export const sharedActions = {
  resetApp: () => ({ type: 'app/reset' }),
  setTheme: (theme) => ({ type: 'app/setTheme', payload: theme })
}

// Multiple slices can respond to shared actions
const slice1 = createSlice({
  name: 'slice1',
  initialState: { data: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase('app/reset', () => ({ data: [] }))
  }
})

const slice2 = createSlice({
  name: 'slice2',
  initialState: { items: {} },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase('app/reset', () => ({ items: {} }))
  }
})
```

## 🎯 Advanced Reducer Patterns

### **1. Conditional Updates:**
```jsx
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], filter: 'all' },
  reducers: {
    toggleTask: (state, action) => {
      const taskId = action.payload
      const task = state.items.find(t => t.id === taskId)
      
      if (task) {
        task.completed = !task.completed
        
        // Conditional side effects
        if (task.completed) {
          task.completedAt = new Date().toISOString()
        } else {
          delete task.completedAt
        }
      }
    },
    
    updateTaskPriority: (state, action) => {
      const { taskId, priority } = action.payload
      const task = state.items.find(t => t.id === taskId)
      
      if (task && ['low', 'medium', 'high'].includes(priority)) {
        task.priority = priority
        
        // Auto-sort by priority
        state.items.sort((a, b) => {
          const priorities = { high: 3, medium: 2, low: 1 }
          return priorities[b.priority] - priorities[a.priority]
        })
      }
    }
  }
})
```

### **2. Batch Operations:**
```jsx
const inventorySlice = createSlice({
  name: 'inventory',
  initialState: { items: {}, categories: {} },
  reducers: {
    // Single item update
    updateItem: (state, action) => {
      const { id, updates } = action.payload
      if (state.items[id]) {
        Object.assign(state.items[id], updates)
      }
    },
    
    // Batch updates
    batchUpdateItems: (state, action) => {
      const updates = action.payload // Array of { id, updates }
      
      updates.forEach(({ id, updates }) => {
        if (state.items[id]) {
          Object.assign(state.items[id], updates)
        }
      })
    },
    
    // Bulk operations with validation
    bulkDeleteItems: (state, action) => {
      const idsToDelete = action.payload
      
      idsToDelete.forEach(id => {
        if (state.items[id] && !state.items[id].protected) {
          delete state.items[id]
        }
      })
    }
  }
})
```

### **3. Complex State Calculations:**
```jsx
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {},
    discounts: [],
    shipping: { method: 'standard', cost: 0 },
    tax: { rate: 0.08, amount: 0 },
    totals: { subtotal: 0, total: 0 }
  },
  reducers: {
    addItem: (state, action) => {
      const { productId, quantity, price } = action.payload
      
      if (state.items[productId]) {
        state.items[productId].quantity += quantity
      } else {
        state.items[productId] = { productId, quantity, price }
      }
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    removeItem: (state, action) => {
      const productId = action.payload
      delete state.items[productId]
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    applyDiscount: (state, action) => {
      const discount = action.payload
      state.discounts.push(discount)
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    // Internal reducer for calculations
    calculateTotals: (state) => {
      // Calculate subtotal
      const subtotal = Object.values(state.items).reduce(
        (sum, item) => sum + (item.quantity * item.price), 0
      )
      
      // Apply discounts
      const discountAmount = state.discounts.reduce(
        (sum, discount) => sum + (subtotal * discount.percentage / 100), 0
      )
      
      // Calculate tax
      const taxableAmount = subtotal - discountAmount
      const taxAmount = taxableAmount * state.tax.rate
      
      // Update totals
      state.totals.subtotal = subtotal
      state.tax.amount = taxAmount
      state.totals.total = taxableAmount + taxAmount + state.shipping.cost
    }
  }
})
```

## 🎨 Payload Preparation Patterns

### **1. Data Validation and Transformation:**
```jsx
const usersSlice = createSlice({
  name: 'users',
  initialState: { entities: {}, ids: [] },
  reducers: {
    addUser: {
      reducer: (state, action) => {
        const user = action.payload
        state.entities[user.id] = user
        state.ids.push(user.id)
      },
      prepare: (userData) => {
        // Validation
        if (!userData.email || !userData.name) {
          throw new Error('Email and name are required')
        }
        
        // Data transformation
        return {
          payload: {
            id: crypto.randomUUID(),
            ...userData,
            email: userData.email.toLowerCase(),
            name: userData.name.trim(),
            createdAt: new Date().toISOString(),
            status: 'active'
          }
        }
      }
    },
    
    updateUser: {
      reducer: (state, action) => {
        const { id, updates } = action.payload
        if (state.entities[id]) {
          Object.assign(state.entities[id], updates)
        }
      },
      prepare: (id, updates) => {
        // Sanitize updates
        const sanitizedUpdates = {
          ...updates,
          updatedAt: new Date().toISOString()
        }
        
        // Remove undefined values
        Object.keys(sanitizedUpdates).forEach(key => {
          if (sanitizedUpdates[key] === undefined) {
            delete sanitizedUpdates[key]
          }
        })
        
        return {
          payload: { id, updates: sanitizedUpdates }
        }
      }
    }
  }
})
```

### **2. Complex Payload Structures:**
```jsx
const ordersSlice = createSlice({
  name: 'orders',
  initialState: { entities: {}, ids: [] },
  reducers: {
    createOrder: {
      reducer: (state, action) => {
        const order = action.payload
        state.entities[order.id] = order
        state.ids.push(order.id)
      },
      prepare: (customerId, items, shippingAddress, paymentMethod) => {
        const orderId = `order_${Date.now()}`
        const subtotal = items.reduce((sum, item) => sum + item.total, 0)
        const tax = subtotal * 0.08
        const shipping = subtotal > 50 ? 0 : 9.99
        
        return {
          payload: {
            id: orderId,
            customerId,
            items: items.map(item => ({
              ...item,
              orderId // Add back-reference
            })),
            shippingAddress,
            paymentMethod,
            pricing: {
              subtotal,
              tax,
              shipping,
              total: subtotal + tax + shipping
            },
            status: 'pending',
            createdAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          meta: {
            analytics: {
              event: 'order_created',
              value: subtotal + tax + shipping,
              items: items.length
            }
          }
        }
      }
    }
  }
})
```

## 🔍 Advanced Selector Patterns

### **1. Memoized Selectors with createSelector:**
```jsx
import { createSelector } from '@reduxjs/toolkit'

// Basic selectors
const selectPosts = (state) => state.posts.entities
const selectAuthors = (state) => state.authors.entities
const selectCurrentUserId = (state) => state.auth.userId

// Memoized complex selectors
export const selectPostsWithAuthors = createSelector(
  [selectPosts, selectAuthors],
  (posts, authors) => {
    return Object.values(posts).map(post => ({
      ...post,
      author: authors[post.authorId]
    }))
  }
)

export const selectUserPosts = createSelector(
  [selectPostsWithAuthors, selectCurrentUserId],
  (postsWithAuthors, currentUserId) => {
    return postsWithAuthors.filter(post => post.author?.id === currentUserId)
  }
)

// Parameterized selectors
export const makeSelectPostsByCategory = () =>
  createSelector(
    [selectPostsWithAuthors, (state, category) => category],
    (posts, category) => {
      return posts.filter(post => post.category === category)
    }
  )

// Usage in component
const selectPostsByTech = makeSelectPostsByCategory()
const techPosts = useSelector(state => selectPostsByTech(state, 'tech'))
```

### **2. Performance-Optimized Selectors:**
```jsx
// Expensive computation selector
export const selectExpensiveComputation = createSelector(
  [selectLargeDataset, selectFilters],
  (dataset, filters) => {
    console.log('Expensive computation running...') // Only runs when inputs change
    
    return dataset
      .filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true
          return item[key]?.toString().toLowerCase().includes(value.toLowerCase())
        })
      })
      .sort((a, b) => {
        // Complex sorting logic
        return a.priority - b.priority || a.createdAt.localeCompare(b.createdAt)
      })
      .map(item => ({
        ...item,
        // Expensive transformation
        computedValue: expensiveFunction(item)
      }))
  }
)

// Selector with multiple levels of memoization
export const selectDashboardData = createSelector(
  [selectUsers, selectPosts, selectComments],
  (users, posts, comments) => {
    const userStats = Object.values(users).map(user => ({
      ...user,
      postCount: Object.values(posts).filter(p => p.authorId === user.id).length,
      commentCount: Object.values(comments).filter(c => c.authorId === user.id).length
    }))
    
    return {
      totalUsers: users.length,
      totalPosts: posts.length,
      totalComments: comments.length,
      topUsers: userStats
        .sort((a, b) => (b.postCount + b.commentCount) - (a.postCount + a.commentCount))
        .slice(0, 10)
    }
  }
)
```

## 🎯 Real-World Slice Examples

### **1. E-commerce Product Catalog:**
```jsx
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    entities: {},
    ids: [],
    categories: {},
    filters: {
      category: null,
      priceRange: [0, 1000],
      inStock: false,
      rating: 0
    },
    ui: {
      loading: false,
      error: null,
      view: 'grid', // 'grid' | 'list'
      sortBy: 'name', // 'name' | 'price' | 'rating'
      sortOrder: 'asc' // 'asc' | 'desc'
    }
  },
  reducers: {
    // Product management
    setProducts: (state, action) => {
      const products = action.payload
      state.entities = {}
      state.ids = []
      
      products.forEach(product => {
        state.entities[product.id] = product
        state.ids.push(product.id)
      })
    },
    
    updateProductStock: (state, action) => {
      const { productId, quantity } = action.payload
      const product = state.entities[productId]
      
      if (product) {
        product.stock = Math.max(0, product.stock - quantity)
        product.inStock = product.stock > 0
      }
    },
    
    // Filter management
    setFilter: (state, action) => {
      const { filterType, value } = action.payload
      state.filters[filterType] = value
    },
    
    clearFilters: (state) => {
      state.filters = {
        category: null,
        priceRange: [0, 1000],
        inStock: false,
        rating: 0
      }
    },
    
    // UI management
    setView: (state, action) => {
      state.ui.view = action.payload
    },
    
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload
      state.ui.sortBy = sortBy
      state.ui.sortOrder = sortOrder
    }
  }
})

// Selectors for filtered and sorted products
export const selectFilteredProducts = createSelector(
  [
    (state) => state.products.entities,
    (state) => state.products.ids,
    (state) => state.products.filters,
    (state) => state.products.ui
  ],
  (entities, ids, filters, ui) => {
    let products = ids.map(id => entities[id])
    
    // Apply filters
    if (filters.category) {
      products = products.filter(p => p.category === filters.category)
    }
    
    if (filters.inStock) {
      products = products.filter(p => p.inStock)
    }
    
    products = products.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )
    
    if (filters.rating > 0) {
      products = products.filter(p => p.rating >= filters.rating)
    }
    
    // Apply sorting
    products.sort((a, b) => {
      let comparison = 0
      
      switch (ui.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'price':
          comparison = a.price - b.price
          break
        case 'rating':
          comparison = a.rating - b.rating
          break
        default:
          comparison = 0
      }
      
      return ui.sortOrder === 'desc' ? -comparison : comparison
    })
    
    return products
  }
)
```

## 🎉 What You've Mastered

After completing advanced slices, you can:

- ✅ **Design complex state structures** with normalization
- ✅ **Use entity adapters** for efficient data management
- ✅ **Implement cross-slice communication** with extraReducers
- ✅ **Create advanced reducer patterns** with conditional logic
- ✅ **Prepare and validate payloads** with custom logic
- ✅ **Build performance-optimized selectors** with memoization
- ✅ **Handle real-world state management** scenarios

## 🚀 What's Next?

Now that you understand advanced slices, you're ready for:

1. **Async Thunks** → `04-async-thunks` - Handling API calls and async operations
2. **RTK Query** → `05-rtk-query` - Modern data fetching patterns
3. **Advanced Patterns** → `06-advanced-patterns` - Entity adapters and optimization

---

**🎉 You can now build sophisticated state management with advanced slice patterns!**

**Next:** `04-async-thunks/async-thunks-concepts.md`