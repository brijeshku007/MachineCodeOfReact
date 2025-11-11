# 🚀 Advanced RTK Patterns

## 🎯 Learning Objectives

By the end of this module, you will:
- ✅ Master normalized state structures with Entity Adapters
- ✅ Implement advanced selector patterns with Reselect
- ✅ Optimize performance with memoization techniques
- ✅ Handle complex data relationships efficiently
- ✅ Create scalable state architecture patterns

## 📚 What are Advanced Patterns?

Advanced RTK patterns are sophisticated techniques for managing complex state structures, optimizing performance, and creating maintainable architectures in large-scale applications.

### **Key Areas:**
- **Entity Adapters** - Normalized data management
- **Advanced Selectors** - Efficient data derivation
- **Performance Optimization** - Memoization and re-render prevention
- **State Normalization** - Flat, relational data structures
- **Complex Relationships** - Managing interconnected data

## 🗃️ Entity Adapters

Entity Adapters provide a standardized way to manage normalized data collections with built-in CRUD operations and selectors.

### **1. Basic Entity Adapter Setup**

```javascript
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

// Define the entity adapter
const postsAdapter = createEntityAdapter({
  // Optional: custom ID field (defaults to 'id')
  selectId: (post) => post.id,
  
  // Optional: sorting function
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
})

// Get initial state with normalized structure
const initialState = postsAdapter.getInitialState({
  // Additional state properties
  loading: false,
  error: null,
  selectedPostId: null,
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Entity adapter provides these methods:
    postAdded: postsAdapter.addOne,
    postsReceived: postsAdapter.setAll,
    postUpdated: postsAdapter.updateOne,
    postRemoved: postsAdapter.removeOne,
    
    // Custom reducers can use adapter methods
    postLiked: (state, action) => {
      const { postId } = action.payload
      postsAdapter.updateOne(state, {
        id: postId,
        changes: { 
          likes: (state.entities[postId]?.likes || 0) + 1 
        }
      })
    },
    
    // Combine with additional state updates
    selectPost: (state, action) => {
      state.selectedPostId = action.payload
    },
  },
})
```

### **2. Entity Adapter Methods**

```javascript
// Adding entities
postsAdapter.addOne(state, entity)           // Add single entity
postsAdapter.addMany(state, entities)        // Add multiple entities
postsAdapter.setOne(state, entity)           // Add or replace single entity
postsAdapter.setMany(state, entities)        // Add or replace multiple entities
postsAdapter.setAll(state, entities)         // Replace all entities

// Updating entities
postsAdapter.updateOne(state, { id, changes })     // Update single entity
postsAdapter.updateMany(state, updates)            // Update multiple entities
postsAdapter.upsertOne(state, entity)              // Add or update single entity
postsAdapter.upsertMany(state, entities)           // Add or update multiple entities

// Removing entities
postsAdapter.removeOne(state, id)            // Remove single entity
postsAdapter.removeMany(state, ids)          // Remove multiple entities
postsAdapter.removeAll(state)                // Remove all entities
```

### **3. Entity Selectors**

```javascript
// Get the selectors
const postsSelectors = postsAdapter.getSelectors((state) => state.posts)

// Available selectors
const {
  selectIds,        // Array of all IDs
  selectEntities,   // Normalized entities object
  selectAll,        // Array of all entities
  selectTotal,      // Total count
  selectById,       // Select entity by ID
} = postsSelectors

// Usage in components
function PostsList() {
  const posts = useSelector(postsSelectors.selectAll)
  const postIds = useSelector(postsSelectors.selectIds)
  const totalPosts = useSelector(postsSelectors.selectTotal)
  
  return (
    <div>
      <h2>Posts ({totalPosts})</h2>
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  )
}

function PostDetail({ postId }) {
  const post = useSelector(state => 
    postsSelectors.selectById(state, postId)
  )
  
  if (!post) return <div>Post not found</div>
  
  return <div>{post.title}</div>
}
```

## 🎯 Advanced Selector Patterns

### **1. Memoized Selectors with Reselect**

```javascript
import { createSelector } from '@reduxjs/toolkit'

// Basic memoized selector
const selectPosts = (state) => state.posts.entities
const selectUsers = (state) => state.users.entities
const selectCurrentUserId = (state) => state.auth.userId

// Derived selector with memoization
const selectPostsWithAuthors = createSelector(
  [selectPosts, selectUsers],
  (posts, users) => {
    return Object.values(posts).map(post => ({
      ...post,
      author: users[post.userId] || null,
    }))
  }
)

// Parameterized selectors
const selectPostsByCategory = createSelector(
  [selectPosts, (state, category) => category],
  (posts, category) => {
    return Object.values(posts).filter(post => 
      post.category === category
    )
  }
)

// Complex derived data
const selectPostsStats = createSelector(
  [selectPosts],
  (posts) => {
    const postsArray = Object.values(posts)
    return {
      total: postsArray.length,
      published: postsArray.filter(p => p.status === 'published').length,
      draft: postsArray.filter(p => p.status === 'draft').length,
      categories: [...new Set(postsArray.map(p => p.category))],
      averageLikes: postsArray.reduce((sum, p) => sum + (p.likes || 0), 0) / postsArray.length,
    }
  }
)
```

### **2. Factory Selectors for Dynamic Data**

```javascript
// Factory function for creating parameterized selectors
const makeSelectPostsByUser = () => createSelector(
  [selectPosts, (state, userId) => userId],
  (posts, userId) => {
    return Object.values(posts).filter(post => post.userId === userId)
  }
)

// Usage in components
function UserPosts({ userId }) {
  const selectPostsByUser = useMemo(makeSelectPostsByUser, [])
  const userPosts = useSelector(state => selectPostsByUser(state, userId))
  
  return (
    <div>
      {userPosts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  )
}
```

### **3. Selector Composition**

```javascript
// Base selectors
const selectAllPosts = postsSelectors.selectAll
const selectAllUsers = usersSelectors.selectAll
const selectAllComments = commentsSelectors.selectAll

// Composed selector for rich data
const selectPostsWithDetails = createSelector(
  [selectAllPosts, selectAllUsers, selectAllComments],
  (posts, users, comments) => {
    return posts.map(post => ({
      ...post,
      author: users.find(user => user.id === post.userId),
      comments: comments.filter(comment => comment.postId === post.id),
      commentCount: comments.filter(comment => comment.postId === post.id).length,
    }))
  }
)

// Filtered and sorted selector
const selectFeaturedPosts = createSelector(
  [selectPostsWithDetails],
  (postsWithDetails) => {
    return postsWithDetails
      .filter(post => post.featured)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5)
  }
)
```

## 🏗️ State Normalization Patterns

### **1. Relational Data Structure**

```javascript
// Normalized state shape
const initialState = {
  users: {
    ids: [1, 2, 3],
    entities: {
      1: { id: 1, name: 'John', email: 'john@example.com' },
      2: { id: 2, name: 'Jane', email: 'jane@example.com' },
      3: { id: 3, name: 'Bob', email: 'bob@example.com' },
    }
  },
  posts: {
    ids: [101, 102, 103],
    entities: {
      101: { id: 101, title: 'Post 1', userId: 1, categoryId: 1 },
      102: { id: 102, title: 'Post 2', userId: 2, categoryId: 2 },
      103: { id: 103, title: 'Post 3', userId: 1, categoryId: 1 },
    }
  },
  categories: {
    ids: [1, 2],
    entities: {
      1: { id: 1, name: 'Technology', slug: 'tech' },
      2: { id: 2, name: 'Design', slug: 'design' },
    }
  },
  comments: {
    ids: [201, 202, 203],
    entities: {
      201: { id: 201, content: 'Great post!', postId: 101, userId: 2 },
      202: { id: 202, content: 'Thanks!', postId: 101, userId: 1 },
      203: { id: 203, content: 'Interesting', postId: 102, userId: 3 },
    }
  }
}
```

### **2. Multiple Entity Adapters**

```javascript
// Create adapters for each entity type
const usersAdapter = createEntityAdapter()
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
})
const categoriesAdapter = createEntityAdapter()
const commentsAdapter = createEntityAdapter()

// Combined slice with multiple adapters
const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    users: usersAdapter.getInitialState(),
    posts: postsAdapter.getInitialState({
      selectedPostId: null,
      filter: 'all',
    }),
    categories: categoriesAdapter.getInitialState(),
    comments: commentsAdapter.getInitialState(),
    ui: {
      loading: false,
      error: null,
    }
  },
  reducers: {
    // Users
    userAdded: (state, action) => {
      usersAdapter.addOne(state.users, action.payload)
    },
    usersLoaded: (state, action) => {
      usersAdapter.setAll(state.users, action.payload)
    },
    
    // Posts
    postAdded: (state, action) => {
      postsAdapter.addOne(state.posts, action.payload)
    },
    postsLoaded: (state, action) => {
      postsAdapter.setAll(state.posts, action.payload)
    },
    postUpdated: (state, action) => {
      postsAdapter.updateOne(state.posts, action.payload)
    },
    
    // Categories
    categoriesLoaded: (state, action) => {
      categoriesAdapter.setAll(state.categories, action.payload)
    },
    
    // Comments
    commentAdded: (state, action) => {
      commentsAdapter.addOne(state.comments, action.payload)
    },
    commentsLoaded: (state, action) => {
      commentsAdapter.setAll(state.comments, action.payload)
    },
    
    // UI state
    setSelectedPost: (state, action) => {
      state.posts.selectedPostId = action.payload
    },
    setPostFilter: (state, action) => {
      state.posts.filter = action.payload
    },
  }
})
```

## ⚡ Performance Optimization Patterns

### **1. Preventing Unnecessary Re-renders**

```javascript
// Use React.memo for components
const PostItem = React.memo(({ post, onLike, onDelete }) => {
  return (
    <div className="post-item">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <button onClick={() => onLike(post.id)}>
        👍 {post.likes}
      </button>
      <button onClick={() => onDelete(post.id)}>
        🗑️ Delete
      </button>
    </div>
  )
})

// Memoize callback functions
function PostsList() {
  const posts = useSelector(selectAllPosts)
  
  const handleLike = useCallback((postId) => {
    dispatch(postLiked({ postId }))
  }, [dispatch])
  
  const handleDelete = useCallback((postId) => {
    dispatch(postDeleted({ postId }))
  }, [dispatch])
  
  return (
    <div>
      {posts.map(post => (
        <PostItem
          key={post.id}
          post={post}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
```

### **2. Selective State Subscription**

```javascript
// Only subscribe to specific parts of state
function PostTitle({ postId }) {
  const title = useSelector(state => 
    state.posts.entities[postId]?.title
  )
  
  return <h2>{title}</h2>
}

function PostLikes({ postId }) {
  const likes = useSelector(state => 
    state.posts.entities[postId]?.likes || 0
  )
  
  return <span>👍 {likes}</span>
}

// Use shallowEqual for object comparisons
import { shallowEqual } from 'react-redux'

function PostMetadata({ postId }) {
  const metadata = useSelector(
    state => ({
      author: state.users.entities[state.posts.entities[postId]?.userId],
      category: state.categories.entities[state.posts.entities[postId]?.categoryId],
      createdAt: state.posts.entities[postId]?.createdAt,
    }),
    shallowEqual
  )
  
  return (
    <div>
      <span>By: {metadata.author?.name}</span>
      <span>Category: {metadata.category?.name}</span>
      <span>Date: {metadata.createdAt}</span>
    </div>
  )
}
```

### **3. Batch Updates**

```javascript
import { batch } from 'react-redux'

// Batch multiple dispatches
function loadBlogData() {
  return async (dispatch) => {
    const [users, posts, categories] = await Promise.all([
      fetchUsers(),
      fetchPosts(),
      fetchCategories(),
    ])
    
    batch(() => {
      dispatch(usersLoaded(users))
      dispatch(postsLoaded(posts))
      dispatch(categoriesLoaded(categories))
    })
  }
}
```

## 🔗 Complex Relationship Patterns

### **1. Many-to-Many Relationships**

```javascript
// Tags and Posts (many-to-many)
const tagsAdapter = createEntityAdapter()
const postTagsAdapter = createEntityAdapter({
  selectId: (postTag) => `${postTag.postId}-${postTag.tagId}`
})

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    // ... other entities
    tags: tagsAdapter.getInitialState(),
    postTags: postTagsAdapter.getInitialState(), // Junction table
  },
  reducers: {
    tagsLoaded: (state, action) => {
      tagsAdapter.setAll(state.tags, action.payload)
    },
    postTagsLoaded: (state, action) => {
      postTagsAdapter.setAll(state.postTags, action.payload)
    },
    tagAddedToPost: (state, action) => {
      const { postId, tagId } = action.payload
      postTagsAdapter.addOne(state.postTags, { postId, tagId })
    },
    tagRemovedFromPost: (state, action) => {
      const { postId, tagId } = action.payload
      postTagsAdapter.removeOne(state.postTags, `${postId}-${tagId}`)
    },
  }
})

// Selectors for many-to-many relationships
const selectPostTags = createSelector(
  [selectAllPostTags, selectAllTags, (state, postId) => postId],
  (postTags, tags, postId) => {
    const postTagRelations = postTags.filter(pt => pt.postId === postId)
    return postTagRelations.map(pt => tags.find(tag => tag.id === pt.tagId))
  }
)

const selectTagPosts = createSelector(
  [selectAllPostTags, selectAllPosts, (state, tagId) => tagId],
  (postTags, posts, tagId) => {
    const tagPostRelations = postTags.filter(pt => pt.tagId === tagId)
    return tagPostRelations.map(pt => posts.find(post => post.id === pt.postId))
  }
)
```

### **2. Hierarchical Data**

```javascript
// Nested comments (tree structure)
const commentsAdapter = createEntityAdapter()

const commentsSlice = createSlice({
  name: 'comments',
  initialState: commentsAdapter.getInitialState(),
  reducers: {
    commentsLoaded: commentsAdapter.setAll,
    commentAdded: commentsAdapter.addOne,
    commentUpdated: commentsAdapter.updateOne,
  }
})

// Selector for comment tree
const selectCommentTree = createSelector(
  [selectAllComments, (state, postId) => postId],
  (comments, postId) => {
    const postComments = comments.filter(comment => comment.postId === postId)
    
    const buildTree = (parentId = null) => {
      return postComments
        .filter(comment => comment.parentId === parentId)
        .map(comment => ({
          ...comment,
          children: buildTree(comment.id)
        }))
    }
    
    return buildTree()
  }
)
```

## 🎯 Best Practices

### **1. Entity Adapter Guidelines**

```javascript
// ✅ Good: Use entity adapters for collections
const usersAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})

// ✅ Good: Combine with additional state
const initialState = usersAdapter.getInitialState({
  loading: false,
  error: null,
  selectedUserId: null,
  filters: {
    search: '',
    role: 'all',
  }
})

// ❌ Avoid: Don't use for single entities
// Use regular state for single values
const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    theme: 'light',
    language: 'en',
    notifications: true,
  }
})
```

### **2. Selector Optimization**

```javascript
// ✅ Good: Memoize expensive computations
const selectExpensiveData = createSelector(
  [selectLargeDataset],
  (data) => {
    // Expensive computation here
    return data.map(item => ({
      ...item,
      computed: expensiveCalculation(item)
    }))
  }
)

// ✅ Good: Use factory selectors for parameterized data
const makeSelectUserPosts = () => createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.userId === userId)
)

// ❌ Avoid: Creating new objects in selectors without memoization
const selectBadData = (state) => ({
  posts: state.posts.entities,
  users: state.users.entities, // New object every time
})
```

### **3. State Shape Design**

```javascript
// ✅ Good: Normalized, flat structure
const goodState = {
  entities: {
    users: { ids: [], entities: {} },
    posts: { ids: [], entities: {} },
    comments: { ids: [], entities: {} },
  },
  ui: {
    selectedPostId: null,
    filters: {},
    loading: false,
  }
}

// ❌ Avoid: Deeply nested structures
const badState = {
  users: [
    {
      id: 1,
      posts: [
        {
          id: 101,
          comments: [
            { id: 201, replies: [...] } // Deep nesting
          ]
        }
      ]
    }
  ]
}
```

## 🧪 Testing Advanced Patterns

### **1. Testing Entity Adapters**

```javascript
import { configureStore } from '@reduxjs/toolkit'
import postsSlice, { postAdded, postUpdated } from './postsSlice'

describe('Posts Entity Adapter', () => {
  let store
  
  beforeEach(() => {
    store = configureStore({
      reducer: { posts: postsSlice.reducer }
    })
  })
  
  test('should add post to normalized state', () => {
    const post = { id: 1, title: 'Test Post', content: 'Content' }
    
    store.dispatch(postAdded(post))
    
    const state = store.getState()
    expect(state.posts.ids).toContain(1)
    expect(state.posts.entities[1]).toEqual(post)
  })
  
  test('should update post in normalized state', () => {
    const post = { id: 1, title: 'Test Post', content: 'Content' }
    store.dispatch(postAdded(post))
    
    store.dispatch(postUpdated({
      id: 1,
      changes: { title: 'Updated Title' }
    }))
    
    const state = store.getState()
    expect(state.posts.entities[1].title).toBe('Updated Title')
    expect(state.posts.entities[1].content).toBe('Content') // Unchanged
  })
})
```

### **2. Testing Selectors**

```javascript
import { selectPostsWithAuthors, selectPostsByCategory } from './selectors'

describe('Advanced Selectors', () => {
  const mockState = {
    posts: {
      ids: [1, 2],
      entities: {
        1: { id: 1, title: 'Post 1', userId: 1, category: 'tech' },
        2: { id: 2, title: 'Post 2', userId: 2, category: 'design' },
      }
    },
    users: {
      ids: [1, 2],
      entities: {
        1: { id: 1, name: 'John' },
        2: { id: 2, name: 'Jane' },
      }
    }
  }
  
  test('should select posts with authors', () => {
    const result = selectPostsWithAuthors(mockState)
    
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      id: 1,
      title: 'Post 1',
      userId: 1,
      category: 'tech',
      author: { id: 1, name: 'John' }
    })
  })
  
  test('should filter posts by category', () => {
    const result = selectPostsByCategory(mockState, 'tech')
    
    expect(result).toHaveLength(1)
    expect(result[0].category).toBe('tech')
  })
})
```

## 🎯 Key Takeaways

### **Entity Adapters Benefits:**
- **Normalized State** - Flat, efficient data structure
- **Built-in CRUD** - Standardized operations
- **Automatic Selectors** - Generated selector functions
- **Performance** - Optimized updates and lookups
- **Consistency** - Standardized patterns across entities

### **Advanced Selector Benefits:**
- **Memoization** - Prevents unnecessary recalculations
- **Composition** - Build complex data from simple selectors
- **Reusability** - Share logic across components
- **Performance** - Minimize re-renders
- **Testability** - Easy to unit test

### **When to Use Advanced Patterns:**
- ✅ Large datasets with complex relationships
- ✅ Frequent data updates and queries
- ✅ Performance-critical applications
- ✅ Complex data transformations
- ✅ Multiple related entity types

## 🚀 Next Steps

After mastering advanced patterns, you'll be ready for:
- **Middleware** - Custom middleware and side effects
- **Testing** - Comprehensive testing strategies
- **Real-world Architecture** - Large-scale application patterns
- **Performance Monitoring** - Advanced optimization techniques

Advanced RTK patterns provide the foundation for building scalable, performant applications with complex state management needs. These patterns become essential as your application grows in size and complexity.

---

**Ready to implement advanced patterns?** Check out `AdvancedPatternsExample.jsx` for hands-on practice! 🎯