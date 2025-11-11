import React, { useState, useMemo, useCallback } from 'react'
import {
  createSlice,
  createEntityAdapter,
  configureStore,
  createSelector
} from '@reduxjs/toolkit'
import { Provider, useSelector, useDispatch } from 'react-redux'

// 🗃️ Entity Adapters Setup
const usersAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
})

const categoriesAdapter = createEntityAdapter()

const commentsAdapter = createEntityAdapter({
  sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
})

const tagsAdapter = createEntityAdapter()

const postTagsAdapter = createEntityAdapter({
  selectId: (postTag) => `${postTag.postId}-${postTag.tagId}`
})

// 🏪 Blog Slice with Multiple Entity Adapters
const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    users: usersAdapter.getInitialState(),
    posts: postsAdapter.getInitialState({
      selectedPostId: null,
      filter: 'all',
      searchTerm: '',
    }),
    categories: categoriesAdapter.getInitialState(),
    comments: commentsAdapter.getInitialState(),
    tags: tagsAdapter.getInitialState(),
    postTags: postTagsAdapter.getInitialState(),
    ui: {
      loading: false,
      error: null,
      activeTab: 'posts',
    }
  },
  reducers: {
    // Users
    usersLoaded: (state, action) => {
      usersAdapter.setAll(state.users, action.payload)
    },
    userAdded: (state, action) => {
      usersAdapter.addOne(state.users, action.payload)
    },

    // Posts
    postsLoaded: (state, action) => {
      postsAdapter.setAll(state.posts, action.payload)
    },
    postAdded: (state, action) => {
      postsAdapter.addOne(state.posts, {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        likes: 0,
        views: 0,
      })
    },
    postUpdated: (state, action) => {
      postsAdapter.updateOne(state.posts, action.payload)
    },
    postDeleted: (state, action) => {
      postsAdapter.removeOne(state.posts, action.payload)
      // Also remove related comments and tags
      const commentsToRemove = Object.values(state.comments.entities)
        .filter(comment => comment.postId === action.payload)
        .map(comment => comment.id)
      commentsAdapter.removeMany(state.comments, commentsToRemove)

      const postTagsToRemove = Object.values(state.postTags.entities)
        .filter(pt => pt.postId === action.payload)
        .map(pt => pt.id)
      postTagsAdapter.removeMany(state.postTags, postTagsToRemove)
    },
    postLiked: (state, action) => {
      const { postId } = action.payload
      postsAdapter.updateOne(state.posts, {
        id: postId,
        changes: {
          likes: (state.posts.entities[postId]?.likes || 0) + 1
        }
      })
    },
    postViewed: (state, action) => {
      const { postId } = action.payload
      postsAdapter.updateOne(state.posts, {
        id: postId,
        changes: {
          views: (state.posts.entities[postId]?.views || 0) + 1
        }
      })
    },

    // Categories
    categoriesLoaded: (state, action) => {
      categoriesAdapter.setAll(state.categories, action.payload)
    },
    categoryAdded: (state, action) => {
      categoriesAdapter.addOne(state.categories, action.payload)
    },

    // Comments
    commentsLoaded: (state, action) => {
      commentsAdapter.setAll(state.comments, action.payload)
    },
    commentAdded: (state, action) => {
      commentsAdapter.addOne(state.comments, {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      })
    },
    commentDeleted: (state, action) => {
      commentsAdapter.removeOne(state.comments, action.payload)
    },

    // Tags
    tagsLoaded: (state, action) => {
      tagsAdapter.setAll(state.tags, action.payload)
    },
    tagAdded: (state, action) => {
      tagsAdapter.addOne(state.tags, action.payload)
    },

    // Post-Tags (Many-to-Many)
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

    // UI State
    setSelectedPost: (state, action) => {
      state.posts.selectedPostId = action.payload
    },
    setPostFilter: (state, action) => {
      state.posts.filter = action.payload
    },
    setSearchTerm: (state, action) => {
      state.posts.searchTerm = action.payload
    },
    setActiveTab: (state, action) => {
      state.ui.activeTab = action.payload
    },
    setLoading: (state, action) => {
      state.ui.loading = action.payload
    },
  }
})

// Export actions
export const {
  usersLoaded, userAdded,
  postsLoaded, postAdded, postUpdated, postDeleted, postLiked, postViewed,
  categoriesLoaded, categoryAdded,
  commentsLoaded, commentAdded, commentDeleted,
  tagsLoaded, tagAdded,
  postTagsLoaded, tagAddedToPost, tagRemovedFromPost,
  setSelectedPost, setPostFilter, setSearchTerm, setActiveTab, setLoading,
} = blogSlice.actions

// 🎯 Advanced Selectors
// Base selectors from entity adapters
const usersSelectors = usersAdapter.getSelectors(state => state.blog.users)
const postsSelectors = postsAdapter.getSelectors(state => state.blog.posts)
const categoriesSelectors = categoriesAdapter.getSelectors(state => state.blog.categories)
const commentsSelectors = commentsAdapter.getSelectors(state => state.blog.comments)
const tagsSelectors = tagsAdapter.getSelectors(state => state.blog.tags)
const postTagsSelectors = postTagsAdapter.getSelectors(state => state.blog.postTags)

// Advanced memoized selectors
const selectPostsWithDetails = createSelector(
  [
    postsSelectors.selectAll,
    usersSelectors.selectAll,
    categoriesSelectors.selectAll,
    commentsSelectors.selectAll,
    postTagsSelectors.selectAll,
    tagsSelectors.selectAll,
  ],
  (posts, users, categories, comments, postTags, tags) => {
    return posts.map(post => {
      const author = users.find(user => user.id === post.userId)
      const category = categories.find(cat => cat.id === post.categoryId)
      const postComments = comments.filter(comment => comment.postId === post.id)
      const postTagRelations = postTags.filter(pt => pt.postId === post.id)
      const postTagsList = postTagRelations.map(pt =>
        tags.find(tag => tag.id === pt.tagId)
      ).filter(Boolean)

      return {
        ...post,
        author,
        category,
        comments: postComments,
        commentCount: postComments.length,
        tags: postTagsList,
      }
    })
  }
)

// Filtered posts selector
const selectFilteredPosts = createSelector(
  [
    selectPostsWithDetails,
    state => state.blog.posts.filter,
    state => state.blog.posts.searchTerm,
  ],
  (postsWithDetails, filter, searchTerm) => {
    let filtered = postsWithDetails

    // Apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(post =>
        post.category?.slug === filter
      )
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        post.author?.name.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.name.toLowerCase().includes(term))
      )
    }

    return filtered
  }
)

// Statistics selector
const selectBlogStats = createSelector(
  [
    postsSelectors.selectAll,
    usersSelectors.selectAll,
    categoriesSelectors.selectAll,
    commentsSelectors.selectAll,
    tagsSelectors.selectAll,
  ],
  (posts, users, categories, comments, tags) => {
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0)
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0)
    const avgLikes = posts.length > 0 ? totalLikes / posts.length : 0
    const avgComments = posts.length > 0 ? comments.length / posts.length : 0

    return {
      totalPosts: posts.length,
      totalUsers: users.length,
      totalCategories: categories.length,
      totalComments: comments.length,
      totalTags: tags.length,
      totalLikes,
      totalViews,
      avgLikes: Math.round(avgLikes * 10) / 10,
      avgComments: Math.round(avgComments * 10) / 10,
    }
  }
)

// Factory selector for posts by category
const makeSelectPostsByCategory = () => createSelector(
  [selectPostsWithDetails, (state, categorySlug) => categorySlug],
  (posts, categorySlug) => {
    return posts.filter(post => post.category?.slug === categorySlug)
  }
)

// Factory selector for posts by tag
const makeSelectPostsByTag = () => createSelector(
  [selectPostsWithDetails, (state, tagId) => tagId],
  (posts, tagId) => {
    return posts.filter(post =>
      post.tags.some(tag => tag.id === tagId)
    )
  }
)

// 🏪 Store Configuration
const store = configureStore({
  reducer: {
    blog: blogSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

// 📊 Sample Data
const sampleUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', avatar: '👩‍💻' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', avatar: '👨‍🎨' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', avatar: '👩‍🔬' },
  { id: 4, name: 'David Wilson', email: 'david@example.com', avatar: '👨‍💼' },
]

const sampleCategories = [
  { id: 1, name: 'Technology', slug: 'tech', color: '#3b82f6' },
  { id: 2, name: 'Design', slug: 'design', color: '#8b5cf6' },
  { id: 3, name: 'Business', slug: 'business', color: '#10b981' },
  { id: 4, name: 'Science', slug: 'science', color: '#f59e0b' },
]

const sampleTags = [
  { id: 1, name: 'React', color: '#61dafb' },
  { id: 2, name: 'JavaScript', color: '#f7df1e' },
  { id: 3, name: 'CSS', color: '#1572b6' },
  { id: 4, name: 'UI/UX', color: '#ff6b6b' },
  { id: 5, name: 'Performance', color: '#4ecdc4' },
  { id: 6, name: 'Testing', color: '#45b7d1' },
]

const samplePosts = [
  {
    id: 1,
    title: 'Advanced React Patterns',
    content: 'Exploring compound components, render props, and hooks patterns for building reusable React components.',
    userId: 1,
    categoryId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    likes: 24,
    views: 156,
  },
  {
    id: 2,
    title: 'Modern CSS Grid Layouts',
    content: 'Learn how to create responsive layouts using CSS Grid with practical examples and best practices.',
    userId: 2,
    categoryId: 2,
    createdAt: '2024-01-14T14:30:00Z',
    likes: 18,
    views: 89,
  },
  {
    id: 3,
    title: 'Building Scalable APIs',
    content: 'Best practices for designing and implementing RESTful APIs that can handle growth and complexity.',
    userId: 3,
    categoryId: 3,
    createdAt: '2024-01-13T09:15:00Z',
    likes: 31,
    views: 203,
  },
  {
    id: 4,
    title: 'JavaScript Performance Optimization',
    content: 'Techniques for optimizing JavaScript performance including code splitting, lazy loading, and memory management.',
    userId: 1,
    categoryId: 1,
    createdAt: '2024-01-12T16:45:00Z',
    likes: 42,
    views: 287,
  },
]

const sampleComments = [
  { id: 1, content: 'Great article! Very helpful examples.', postId: 1, userId: 2, createdAt: '2024-01-15T11:00:00Z' },
  { id: 2, content: 'Thanks for sharing these patterns.', postId: 1, userId: 3, createdAt: '2024-01-15T12:30:00Z' },
  { id: 3, content: 'CSS Grid is amazing for layouts!', postId: 2, userId: 1, createdAt: '2024-01-14T15:00:00Z' },
  { id: 4, content: 'Could you add more examples?', postId: 2, userId: 4, createdAt: '2024-01-14T16:15:00Z' },
  { id: 5, content: 'This helped me optimize my API design.', postId: 3, userId: 2, createdAt: '2024-01-13T10:00:00Z' },
  { id: 6, content: 'Performance tips are gold!', postId: 4, userId: 3, createdAt: '2024-01-12T17:00:00Z' },
]

const samplePostTags = [
  { postId: 1, tagId: 1 }, // React
  { postId: 1, tagId: 2 }, // JavaScript
  { postId: 2, tagId: 3 }, // CSS
  { postId: 2, tagId: 4 }, // UI/UX
  { postId: 3, tagId: 2 }, // JavaScript
  { postId: 4, tagId: 2 }, // JavaScript
  { postId: 4, tagId: 5 }, // Performance
]

// 📝 Posts List Component
const PostsList = React.memo(() => {
  const dispatch = useDispatch()
  const filteredPosts = useSelector(selectFilteredPosts)
  const filter = useSelector(state => state.blog.posts.filter)
  const searchTerm = useSelector(state => state.blog.posts.searchTerm)
  const categories = useSelector(categoriesSelectors.selectAll)

  const handleLike = useCallback((postId) => {
    dispatch(postLiked({ postId }))
  }, [dispatch])

  const handleView = useCallback((postId) => {
    dispatch(postViewed({ postId }))
    dispatch(setSelectedPost(postId))
  }, [dispatch])

  const handleDelete = useCallback((postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(postDeleted(postId))
    }
  }, [dispatch])

  return (
    <div className="posts-section">
      <div className="posts-header">
        <h2>📚 Posts ({filteredPosts.length})</h2>

        <div className="posts-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search posts..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
          </div>

          <div className="filter-box">
            <select
              value={filter}
              onChange={(e) => dispatch(setPostFilter(e.target.value))}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="posts-grid">
        {filteredPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onView={handleView}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="no-posts">
          <p>No posts found matching your criteria.</p>
        </div>
      )}
    </div>
  )
})

// 🃏 Post Card Component
const PostCard = React.memo(({ post, onLike, onView, onDelete }) => {
  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-meta">
          <span className="author">
            {post.author?.avatar} {post.author?.name}
          </span>
          <span className="category" style={{ color: post.category?.color }}>
            {post.category?.name}
          </span>
          <span className="date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <button
          className="delete-btn"
          onClick={() => onDelete(post.id)}
          title="Delete post"
        >
          🗑️
        </button>
      </div>

      <h3 className="post-title" onClick={() => onView(post.id)}>
        {post.title}
      </h3>

      <p className="post-content">{post.content}</p>

      <div className="post-tags">
        {post.tags.map(tag => (
          <span
            key={tag.id}
            className="tag"
            style={{ backgroundColor: tag.color + '20', color: tag.color }}
          >
            {tag.name}
          </span>
        ))}
      </div>

      <div className="post-stats">
        <button
          className="stat-btn like-btn"
          onClick={() => onLike(post.id)}
        >
          👍 {post.likes}
        </button>
        <span className="stat">👁️ {post.views}</span>
        <span className="stat">💬 {post.commentCount}</span>
      </div>
    </div>
  )
})

// 📊 Statistics Dashboard
const StatsDashboard = React.memo(() => {
  const stats = useSelector(selectBlogStats)

  return (
    <div className="stats-dashboard">
      <h2>📊 Blog Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalPosts}</div>
            <div className="stat-label">Total Posts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Authors</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalComments}</div>
            <div className="stat-label">Comments</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👍</div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalLikes}</div>
            <div className="stat-label">Total Likes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalViews}</div>
            <div className="stat-label">Total Views</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalTags}</div>
            <div className="stat-label">Tags</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <div className="stat-number">{stats.avgLikes}</div>
            <div className="stat-label">Avg Likes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💭</div>
          <div className="stat-info">
            <div className="stat-number">{stats.avgComments}</div>
            <div className="stat-label">Avg Comments</div>
          </div>
        </div>
      </div>
    </div>
  )
})

// ➕ Add Post Form
const AddPostForm = React.memo(() => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState(1)
  const [categoryId, setCategoryId] = useState(1)
  const [selectedTags, setSelectedTags] = useState([])

  const users = useSelector(usersSelectors.selectAll)
  const categories = useSelector(categoriesSelectors.selectAll)
  const tags = useSelector(tagsSelectors.selectAll)

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const postId = Date.now()

    // Add the post
    dispatch(postAdded({
      title: title.trim(),
      content: content.trim(),
      userId: Number(userId),
      categoryId: Number(categoryId),
    }))

    // Add tags to post
    selectedTags.forEach(tagId => {
      dispatch(tagAddedToPost({ postId, tagId }))
    })

    // Reset form
    setTitle('')
    setContent('')
    setUserId(1)
    setCategoryId(1)
    setSelectedTags([])
  }, [dispatch, title, content, userId, categoryId, selectedTags])

  const handleTagToggle = useCallback((tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }, [])

  return (
    <div className="add-post-form">
      <h2>➕ Add New Post</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>👤 Author:</label>
            <select value={userId} onChange={(e) => setUserId(e.target.value)}>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.avatar} {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>📂 Category:</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>📝 Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            required
          />
        </div>

        <div className="form-group">
          <label>📄 Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter post content..."
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label>🏷️ Tags:</label>
          <div className="tags-selector">
            {tags.map(tag => (
              <button
                key={tag.id}
                type="button"
                className={`tag-option ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                style={{
                  backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                  borderColor: tag.color,
                  color: selectedTags.includes(tag.id) ? 'white' : tag.color,
                }}
                onClick={() => handleTagToggle(tag.id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          ➕ Add Post
        </button>
      </form>
    </div>
  )
})

// 🔍 Entity Explorer
const EntityExplorer = React.memo(() => {
  const [selectedEntity, setSelectedEntity] = useState('posts')

  const entities = {
    posts: useSelector(postsSelectors.selectAll),
    users: useSelector(usersSelectors.selectAll),
    categories: useSelector(categoriesSelectors.selectAll),
    comments: useSelector(commentsSelectors.selectAll),
    tags: useSelector(tagsSelectors.selectAll),
    postTags: useSelector(postTagsSelectors.selectAll),
  }

  return (
    <div className="entity-explorer">
      <h2>🔍 Entity Explorer</h2>

      <div className="entity-tabs">
        {Object.keys(entities).map(entityType => (
          <button
            key={entityType}
            className={`entity-tab ${selectedEntity === entityType ? 'active' : ''}`}
            onClick={() => setSelectedEntity(entityType)}
          >
            {entityType} ({entities[entityType].length})
          </button>
        ))}
      </div>

      <div className="entity-data">
        <pre>{JSON.stringify(entities[selectedEntity], null, 2)}</pre>
      </div>
    </div>
  )
})

// 🎯 Main Advanced Patterns Example
function AdvancedPatternsExample() {
  const dispatch = useDispatch()
  const activeTab = useSelector(state => state.blog.ui.activeTab)

  // Initialize sample data
  React.useEffect(() => {
    dispatch(usersLoaded(sampleUsers))
    dispatch(categoriesLoaded(sampleCategories))
    dispatch(tagsLoaded(sampleTags))
    dispatch(postsLoaded(samplePosts))
    dispatch(commentsLoaded(sampleComments))
    dispatch(postTagsLoaded(samplePostTags))
  }, [dispatch])

  const tabs = [
    { id: 'posts', label: '📚 Posts', component: PostsList },
    { id: 'add', label: '➕ Add Post', component: AddPostForm },
    { id: 'stats', label: '📊 Statistics', component: StatsDashboard },
    { id: 'explorer', label: '🔍 Explorer', component: EntityExplorer },
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="advanced-patterns-example">
      <div className="header">
        <h1>🚀 Advanced RTK Patterns</h1>
        <p>Entity Adapters, Advanced Selectors, and Performance Optimization</p>
      </div>

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab(tab.id))}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {ActiveComponent && <ActiveComponent />}
      </div>

      <div className="features-info">
        <h3>🎯 Advanced Patterns Demonstrated:</h3>
        <ul>
          <li>✅ <strong>Entity Adapters:</strong> Normalized state with built-in CRUD operations</li>
          <li>✅ <strong>Advanced Selectors:</strong> Memoized selectors with complex data derivation</li>
          <li>✅ <strong>Many-to-Many Relationships:</strong> Posts and tags with junction table</li>
          <li>✅ <strong>Performance Optimization:</strong> React.memo and useCallback</li>
          <li>✅ <strong>Factory Selectors:</strong> Parameterized selectors for dynamic data</li>
          <li>✅ <strong>State Normalization:</strong> Flat, efficient data structures</li>
          <li>✅ <strong>Complex Data Relationships:</strong> Users, posts, comments, categories, tags</li>
          <li>✅ <strong>Derived State:</strong> Statistics and filtered data</li>
        </ul>
      </div>

      <style jsx>{`
        .advanced-patterns-example {
          max-width: 1200px;
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

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 2px solid #e1e5e9;
        }

        .tab {
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

        .tab:hover {
          color: #333;
          background: #f8f9fa;
        }

        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: #f8f9fa;
        }

        .tab-content {
          min-height: 500px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .posts-section h2,
        .add-post-form h2,
        .stats-dashboard h2,
        .entity-explorer h2 {
          margin-top: 0;
          color: #333;
        }

        .posts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e1e5e9;
        }

        .posts-controls {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .search-box input,
        .filter-box select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .search-box input {
          width: 200px;
        }

        .posts-grid {
          display: grid;
          gap: 20px;
        }

        .post-card {
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 20px;
          background: #fafbfc;
          transition: all 0.2s ease;
        }

        .post-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .post-meta {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 0.85rem;
        }

        .author {
          font-weight: 600;
          color: #333;
        }

        .category {
          font-weight: 500;
        }

        .date {
          color: #666;
        }

        .delete-btn {
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }

        .delete-btn:hover {
          background: #ffebee;
          border-color: #f44336;
        }

        .post-title {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 1.3rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .post-title:hover {
          color: #667eea;
        }

        .post-content {
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }

        .tag {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .post-stats {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .stat-btn {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .like-btn:hover {
          background: #e3f2fd;
          border-color: #2196f3;
        }

        .stat {
          font-size: 0.85rem;
          color: #666;
        }

        .no-posts {
          text-align: center;
          padding: 40px;
          color: #666;
          font-style: italic;
        }

        .stats-dashboard {
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
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

        .stat-icon {
          font-size: 2rem;
        }

        .stat-info {
          text-align: left;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
        }

        .add-post-form {
          max-width: 600px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .tags-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag-option {
          padding: 6px 12px;
          border: 2px solid;
          border-radius: 16px;
          background: transparent;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .tag-option:hover {
          transform: scale(1.05);
        }

        .submit-btn {
          padding: 12px 24px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .submit-btn:hover {
          background: #5a6fd8;
        }

        .entity-explorer {
          max-width: 100%;
        }

        .entity-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .entity-tab {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .entity-tab:hover {
          background: #f8f9fa;
        }

        .entity-tab.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .entity-data {
          background: #f8f9fa;
          border: 1px solid #e1e5e9;
          border-radius: 6px;
          padding: 20px;
          max-height: 400px;
          overflow: auto;
        }

        .entity-data pre {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.4;
          color: #333;
        }

        .features-info {
          margin-top: 40px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .features-info h3 {
          margin-top: 0;
          color: #333;
        }

        .features-info ul {
          list-style: none;
          padding: 0;
        }

        .features-info li {
          padding: 8px 0;
          border-bottom: 1px solid #e1e5e9;
        }

        .features-info li:last-child {
          border-bottom: none;
        }

        @media (max-width: 768px) {
          .advanced-patterns-example {
            padding: 10px;
          }

          .header h1 {
            font-size: 2rem;
          }

          .tabs {
            flex-wrap: wrap;
          }

          .tab {
            flex: 1;
            min-width: 120px;
          }

          .posts-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .posts-controls {
            flex-wrap: wrap;
            width: 100%;
          }

          .search-box input {
            width: 100%;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            flex-direction: column;
            text-align: center;
          }

          .stat-info {
            text-align: center;
          }

          .entity-tabs {
            justify-content: center;
          }

          .entity-tab {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}

// 🎯 Main App Component with Provider
export default function AdvancedPatternsApp() {
  return (
    <Provider store={store}>
      <AdvancedPatternsExample />
    </Provider>
  )
}