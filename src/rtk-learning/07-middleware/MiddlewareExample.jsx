import React, { useState, useEffect } from 'react'
import {
  createSlice,
  configureStore,
  createListenerMiddleware
} from '@reduxjs/toolkit'
import { Provider, useSelector, useDispatch } from 'react-redux'

// 📊 Analytics Mock
const analytics = {
  track: (event, data) => {
    console.log('📊 Analytics:', event, data)
  }
}

// ⚙️ Custom Middleware Examples

// 1. Logger Middleware
const loggerMiddleware = ({ getState }) => (next) => (action) => {
  const prevState = getState()
  const result = next(action)
  const nextState = getState()

  console.group(`🔄 Action: ${action.type}`)
  console.log('📥 Previous State:', prevState)
  console.log('⚡ Action:', action)
  console.log('📤 Next State:', nextState)
  console.groupEnd()

  return result
}

// 2. Analytics Middleware
const analyticsMiddleware = ({ getState }) => (next) => (action) => {
  const result = next(action)

  // Track specific actions
  const trackableActions = [
    'user/login',
    'user/logout',
    'posts/postAdded',
    'posts/postLiked',
    'posts/postShared',
  ]

  if (trackableActions.includes(action.type)) {
    const state = getState()
    analytics.track(action.type, {
      userId: state.user.id,
      timestamp: Date.now(),
      payload: action.payload,
    })
  }

  return result
}

// 3. Performance Monitoring Middleware
const performanceMiddleware = ({ getState }) => (next) => (action) => {
  const startTime = performance.now()
  const result = next(action)
  const endTime = performance.now()
  const duration = endTime - startTime

  // Log slow actions
  if (duration > 5) { // More than 5ms
    console.warn(`🐌 Slow action detected: ${action.type}`, {
      duration: `${duration.toFixed(2)}ms`,
      action,
    })
  }

  // Track performance metrics
  if (window.performanceMetrics) {
    window.performanceMetrics.push({
      actionType: action.type,
      duration,
      timestamp: Date.now(),
    })
  }

  return result
}

// 4. Error Handling Middleware
const errorHandlingMiddleware = ({ dispatch }) => (next) => (action) => {
  try {
    return next(action)
  } catch (error) {
    console.error('❌ Middleware caught an error:', error)

    // Dispatch error action
    dispatch({
      type: 'system/errorOccurred',
      payload: {
        error: error.message,
        action: action.type,
        timestamp: new Date().toISOString(),
      }
    })

    return { type: 'ERROR', error: error.message }
  }
}

// 5. Rate Limiting Middleware
const rateLimitMiddleware = (() => {
  const actionCounts = new Map()
  const RATE_LIMIT = 5 // actions per 10 seconds
  const TIME_WINDOW = 10000 // 10 seconds

  return ({ dispatch }) => (next) => (action) => {
    const now = Date.now()
    const actionType = action.type

    // Skip system actions
    if (actionType.startsWith('system/')) {
      return next(action)
    }

    // Get or create action history
    if (!actionCounts.has(actionType)) {
      actionCounts.set(actionType, [])
    }

    const history = actionCounts.get(actionType)

    // Remove old entries
    const recentActions = history.filter(timestamp =>
      now - timestamp < TIME_WINDOW
    )

    // Check rate limit
    if (recentActions.length >= RATE_LIMIT) {
      dispatch({
        type: 'system/rateLimitExceeded',
        payload: {
          actionType,
          limit: RATE_LIMIT,
          timeWindow: TIME_WINDOW,
        }
      })
      return { type: 'RATE_LIMITED', originalAction: action }
    }

    // Add current action to history
    recentActions.push(now)
    actionCounts.set(actionType, recentActions)

    return next(action)
  }
})()

// 🎧 Listener Middleware Setup
const listenerMiddleware = createListenerMiddleware()

// 🏪 Slices
const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    name: '',
    email: '',
    isAuthenticated: false,
    profile: null,
    loginAttempts: 0,
  },
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.email = action.payload.email
      state.isAuthenticated = true
      state.loginAttempts = 0
    },
    logout: (state) => {
      state.id = null
      state.name = ''
      state.email = ''
      state.isAuthenticated = false
      state.profile = null
    },
    profileLoaded: (state, action) => {
      state.profile = action.payload
    },
    loginAttemptFailed: (state) => {
      state.loginAttempts += 1
    },
  },
})

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    selectedPost: null,
  },
  reducers: {
    postAdded: (state, action) => {
      state.items.push({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        likes: 0,
        shares: 0,
      })
    },
    postLiked: (state, action) => {
      const post = state.items.find(p => p.id === action.payload.postId)
      if (post) {
        post.likes += 1
      }
    },
    postShared: (state, action) => {
      const post = state.items.find(p => p.id === action.payload.postId)
      if (post) {
        post.shares += 1
      }
    },
    postSelected: (state, action) => {
      state.selectedPost = action.payload
    },
  },
})

const systemSlice = createSlice({
  name: 'system',
  initialState: {
    errors: [],
    notifications: [],
    rateLimitWarnings: [],
    performanceMetrics: [],
  },
  reducers: {
    errorOccurred: (state, action) => {
      state.errors.push(action.payload)
    },
    notificationAdded: (state, action) => {
      state.notifications.push({
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      })
    },
    rateLimitExceeded: (state, action) => {
      state.rateLimitWarnings.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      })
      state.notifications.push({
        id: Date.now(),
        type: 'warning',
        message: `Rate limit exceeded for ${action.payload.actionType}`,
        timestamp: new Date().toISOString(),
      })
    },
    performanceMetricAdded: (state, action) => {
      state.performanceMetrics.push(action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

// Export actions
const { login, logout, profileLoaded, loginAttemptFailed } = userSlice.actions
const { postAdded, postLiked, postShared, postSelected } = postsSlice.actions
const {
  errorOccurred,
  notificationAdded,
  rateLimitExceeded,
  performanceMetricAdded,
  clearNotifications
} = systemSlice.actions

// 🎧 Listener Effects

// User login side effects
listenerMiddleware.startListening({
  actionCreator: login,
  effect: async (action, listenerApi) => {
    const { id } = action.payload

    // Simulate loading user profile
    listenerApi.dispatch(notificationAdded({
      type: 'info',
      message: 'Loading user profile...',
    }))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockProfile = {
        bio: 'Software developer passionate about React and Redux',
        avatar: '👨‍💻',
        joinDate: '2023-01-15',
        postsCount: 42,
        followersCount: 156,
      }

      listenerApi.dispatch(profileLoaded(mockProfile))
      listenerApi.dispatch(notificationAdded({
        type: 'success',
        message: 'Profile loaded successfully!',
      }))

    } catch (error) {
      listenerApi.dispatch(notificationAdded({
        type: 'error',
        message: 'Failed to load profile',
      }))
    }
  },
})

// Auto-logout after inactivity
listenerMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    return currentState.user.isAuthenticated &&
      !previousState.user.isAuthenticated
  },
  effect: async (action, listenerApi) => {
    // Set up auto-logout timer
    const INACTIVITY_TIMEOUT = 30000 // 30 seconds for demo

    const timeoutId = setTimeout(() => {
      if (listenerApi.getState().user.isAuthenticated) {
        listenerApi.dispatch(logout())
        listenerApi.dispatch(notificationAdded({
          type: 'warning',
          message: 'Logged out due to inactivity',
        }))
      }
    }, INACTIVITY_TIMEOUT)

    // Cancel timeout if user logs out manually
    await listenerApi.condition((action) => action.type === 'user/logout')
    clearTimeout(timeoutId)
  },
})

// Post sharing side effects
listenerMiddleware.startListening({
  actionCreator: postShared,
  effect: async (action, listenerApi) => {
    const { postId } = action.payload
    const state = listenerApi.getState()
    const post = state.posts.items.find(p => p.id === postId)

    if (post) {
      // Simulate sharing to social media
      listenerApi.dispatch(notificationAdded({
        type: 'success',
        message: `"${post.title}" shared successfully!`,
      }))

      // Track sharing analytics
      analytics.track('post_shared', {
        postId,
        postTitle: post.title,
        userId: state.user.id,
        platform: 'internal',
      })
    }
  },
})

// 🏪 Store Configuration
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    posts: postsSlice.reducer,
    system: systemSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(
        // Early middleware
        errorHandlingMiddleware,
        rateLimitMiddleware,
        listenerMiddleware.middleware,
      )
      .concat(
        // Late middleware
        performanceMiddleware,
        analyticsMiddleware,
        loggerMiddleware, // Logger should be last
      ),
})

// Initialize performance metrics tracking
window.performanceMetrics = []

// 👤 User Component
function UserSection() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [loginForm, setLoginForm] = useState({ name: '', email: '' })

  const handleLogin = () => {
    if (!loginForm.name || !loginForm.email) return

    dispatch(login({
      id: Date.now(),
      name: loginForm.name,
      email: loginForm.email,
    }))

    setLoginForm({ name: '', email: '' })
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  if (user.isAuthenticated) {
    return (
      <div className="user-section authenticated">
        <div className="user-info">
          <h3>👋 Welcome, {user.name}!</h3>
          <p>📧 {user.email}</p>

          {user.profile && (
            <div className="user-profile">
              <p>{user.profile.avatar} {user.profile.bio}</p>
              <div className="profile-stats">
                <span>📝 {user.profile.postsCount} posts</span>
                <span>👥 {user.profile.followersCount} followers</span>
                <span>📅 Joined {user.profile.joinDate}</span>
              </div>
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    )
  }

  return (
    <div className="user-section login">
      <h3>🔐 Login</h3>
      <div className="login-form">
        <input
          type="text"
          placeholder="Your name"
          value={loginForm.name}
          onChange={(e) => setLoginForm(prev => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="email"
          placeholder="Your email"
          value={loginForm.email}
          onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
        />
        <button onClick={handleLogin} className="login-btn">
          🔑 Login
        </button>
      </div>
    </div>
  )
}

// 📝 Posts Component
function PostsSection() {
  const dispatch = useDispatch()
  const posts = useSelector(state => state.posts.items)
  const user = useSelector(state => state.user)
  const [newPost, setNewPost] = useState({ title: '', content: '' })

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content || !user.isAuthenticated) return

    dispatch(postAdded({
      title: newPost.title,
      content: newPost.content,
      author: user.name,
      authorId: user.id,
    }))

    setNewPost({ title: '', content: '' })
  }

  const handleLike = (postId) => {
    dispatch(postLiked({ postId }))
  }

  const handleShare = (postId) => {
    dispatch(postShared({ postId }))
  }

  // Rapid fire actions for testing rate limiting
  const handleRapidActions = () => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        dispatch(postLiked({ postId: posts[0]?.id || 1 }))
      }, i * 100)
    }
  }

  return (
    <div className="posts-section">
      <h3>📝 Posts</h3>

      {user.isAuthenticated && (
        <div className="add-post">
          <input
            type="text"
            placeholder="Post title"
            value={newPost.title}
            onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
          />
          <textarea
            placeholder="Post content"
            value={newPost.content}
            onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
            rows={3}
          />
          <div className="post-actions">
            <button onClick={handleAddPost} className="add-btn">
              ➕ Add Post
            </button>
            <button onClick={handleRapidActions} className="test-btn">
              ⚡ Test Rate Limiting
            </button>
          </div>
        </div>
      )}

      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <div className="post-meta">
              <span>👤 {post.author}</span>
              <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="post-stats">
              <button
                onClick={() => handleLike(post.id)}
                className="stat-btn"
              >
                👍 {post.likes}
              </button>
              <button
                onClick={() => handleShare(post.id)}
                className="stat-btn"
              >
                🔗 {post.shares}
              </button>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="no-posts">
          <p>No posts yet. {user.isAuthenticated ? 'Create your first post!' : 'Login to create posts.'}</p>
        </div>
      )}
    </div>
  )
}

// 🔔 Notifications Component
function NotificationsSection() {
  const dispatch = useDispatch()
  const notifications = useSelector(state => state.system.notifications)
  const errors = useSelector(state => state.system.errors)
  const rateLimitWarnings = useSelector(state => state.system.rateLimitWarnings)

  const handleClearNotifications = () => {
    dispatch(clearNotifications())
  }

  return (
    <div className="notifications-section">
      <div className="section-header">
        <h3>🔔 System Status</h3>
        <button onClick={handleClearNotifications} className="clear-btn">
          🗑️ Clear
        </button>
      </div>

      <div className="notifications-list">
        {notifications.slice(-5).map(notification => (
          <div
            key={notification.id}
            className={`notification ${notification.type}`}
          >
            <span className="notification-icon">
              {notification.type === 'success' && '✅'}
              {notification.type === 'error' && '❌'}
              {notification.type === 'warning' && '⚠️'}
              {notification.type === 'info' && 'ℹ️'}
            </span>
            <span className="notification-message">{notification.message}</span>
            <span className="notification-time">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="errors-section">
          <h4>❌ Recent Errors ({errors.length})</h4>
          <div className="errors-list">
            {errors.slice(-3).map((error, index) => (
              <div key={index} className="error-item">
                <strong>{error.action}:</strong> {error.error}
              </div>
            ))}
          </div>
        </div>
      )}

      {rateLimitWarnings.length > 0 && (
        <div className="rate-limit-section">
          <h4>⚠️ Rate Limit Warnings ({rateLimitWarnings.length})</h4>
          <div className="warnings-list">
            {rateLimitWarnings.slice(-3).map((warning, index) => (
              <div key={index} className="warning-item">
                <strong>{warning.actionType}:</strong> {warning.limit} actions per {warning.timeWindow / 1000}s
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 📊 Performance Monitor
function PerformanceMonitor() {
  const [metrics, setMetrics] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.performanceMetrics) {
        setMetrics([...window.performanceMetrics.slice(-10)])
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const avgDuration = metrics.length > 0
    ? (metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length).toFixed(2)
    : 0

  const slowActions = metrics.filter(m => m.duration > 5)

  return (
    <div className="performance-monitor">
      <h3>📊 Performance Monitor</h3>

      <div className="performance-stats">
        <div className="stat-card">
          <div className="stat-number">{metrics.length}</div>
          <div className="stat-label">Recent Actions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{avgDuration}ms</div>
          <div className="stat-label">Avg Duration</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{slowActions.length}</div>
          <div className="stat-label">Slow Actions</div>
        </div>
      </div>

      {slowActions.length > 0 && (
        <div className="slow-actions">
          <h4>🐌 Slow Actions</h4>
          {slowActions.slice(-3).map((action, index) => (
            <div key={index} className="slow-action">
              <strong>{action.actionType}:</strong> {action.duration.toFixed(2)}ms
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 🎯 Main Middleware Example Component
function MiddlewareExample() {
  const [activeTab, setActiveTab] = useState('user')

  const tabs = [
    { id: 'user', label: '👤 User', component: UserSection },
    { id: 'posts', label: '📝 Posts', component: PostsSection },
    { id: 'notifications', label: '🔔 System', component: NotificationsSection },
    { id: 'performance', label: '📊 Performance', component: PerformanceMonitor },
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="middleware-example">
      <div className="header">
        <h1>⚙️ RTK Middleware Example</h1>
        <p>Custom middleware, listener effects, and side effect management</p>
      </div>

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {ActiveComponent && <ActiveComponent />}
      </div>

      <div className="middleware-info">
        <h3>⚙️ Active Middleware:</h3>
        <ul>
          <li>✅ <strong>Error Handling:</strong> Catches and logs errors</li>
          <li>✅ <strong>Rate Limiting:</strong> Prevents spam actions (5 per 10s)</li>
          <li>✅ <strong>Listener Effects:</strong> Side effects for login, sharing, etc.</li>
          <li>✅ <strong>Performance Monitor:</strong> Tracks action execution time</li>
          <li>✅ <strong>Analytics:</strong> Tracks user interactions</li>
          <li>✅ <strong>Logger:</strong> Logs all actions and state changes</li>
        </ul>
        <p>💡 Open browser console to see middleware logs in action!</p>
      </div>

      <style jsx>{`
        .middleware-example {
          max-width: 1000px;
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
          min-height: 400px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .user-section h3,
        .posts-section h3,
        .notifications-section h3,
        .performance-monitor h3 {
          margin-top: 0;
          color: #333;
        }

        .user-section.authenticated {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #4caf50;
        }

        .user-info h3 {
          margin: 0 0 10px 0;
          color: #4caf50;
        }

        .user-profile {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e1e5e9;
        }

        .profile-stats {
          display: flex;
          gap: 15px;
          margin-top: 10px;
          font-size: 0.9rem;
          color: #666;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 300px;
        }

        .login-form input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }

        .login-btn,
        .logout-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .login-btn {
          background: #4caf50;
          color: white;
        }

        .login-btn:hover {
          background: #45a049;
        }

        .logout-btn {
          background: #f44336;
          color: white;
        }

        .logout-btn:hover {
          background: #d32f2f;
        }

        .add-post {
          margin-bottom: 20px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .add-post input,
        .add-post textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          margin-bottom: 10px;
        }

        .post-actions {
          display: flex;
          gap: 10px;
        }

        .add-btn,
        .test-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s ease;
        }

        .add-btn {
          background: #2196f3;
          color: white;
        }

        .add-btn:hover {
          background: #1976d2;
        }

        .test-btn {
          background: #ff9800;
          color: white;
        }

        .test-btn:hover {
          background: #f57c00;
        }

        .posts-list {
          display: grid;
          gap: 15px;
        }

        .post-card {
          padding: 15px;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          background: #fafbfc;
        }

        .post-card h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .post-card p {
          margin: 0 0 10px 0;
          color: #666;
          line-height: 1.5;
        }

        .post-meta {
          display: flex;
          gap: 15px;
          font-size: 0.85rem;
          color: #999;
          margin-bottom: 10px;
        }

        .post-stats {
          display: flex;
          gap: 10px;
        }

        .stat-btn {
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }

        .stat-btn:hover {
          background: #f0f0f0;
        }

        .no-posts {
          text-align: center;
          padding: 40px;
          color: #666;
          font-style: italic;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .clear-btn {
          padding: 6px 12px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .clear-btn:hover {
          background: #d32f2f;
        }

        .notifications-list {
          display: grid;
          gap: 8px;
          margin-bottom: 20px;
        }

        .notification {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .notification.success {
          background: #e8f5e8;
          border-left: 4px solid #4caf50;
        }

        .notification.error {
          background: #ffebee;
          border-left: 4px solid #f44336;
        }

        .notification.warning {
          background: #fff3e0;
          border-left: 4px solid #ff9800;
        }

        .notification.info {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
        }

        .notification-message {
          flex: 1;
        }

        .notification-time {
          font-size: 0.75rem;
          color: #999;
        }

        .errors-section,
        .rate-limit-section {
          margin-top: 20px;
          padding: 15px;
          background: #ffebee;
          border-radius: 6px;
          border-left: 4px solid #f44336;
        }

        .rate-limit-section {
          background: #fff3e0;
          border-left-color: #ff9800;
        }

        .errors-list,
        .warnings-list {
          display: grid;
          gap: 5px;
          margin-top: 10px;
        }

        .error-item,
        .warning-item {
          font-size: 0.85rem;
          color: #666;
        }

        .performance-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .stat-card {
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #666;
          margin-top: 5px;
        }

        .slow-actions {
          padding: 15px;
          background: #fff3e0;
          border-radius: 6px;
          border-left: 4px solid #ff9800;
        }

        .slow-actions h4 {
          margin: 0 0 10px 0;
          color: #f57c00;
        }

        .slow-action {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 5px;
        }

        .middleware-info {
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .middleware-info h3 {
          margin-top: 0;
          color: #333;
        }

        .middleware-info ul {
          list-style: none;
          padding: 0;
        }

        .middleware-info li {
          padding: 5px 0;
          border-bottom: 1px solid #e1e5e9;
        }

        .middleware-info li:last-child {
          border-bottom: none;
        }

        .middleware-info p {
          margin-top: 15px;
          font-style: italic;
          color: #666;
        }

        @media (max-width: 768px) {
          .middleware-example {
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
            min-width: 100px;
          }

          .user-section.authenticated {
            flex-direction: column;
            gap: 15px;
          }

          .profile-stats {
            flex-direction: column;
            gap: 5px;
          }

          .post-actions {
            flex-direction: column;
          }

          .performance-stats {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}

// 🎯 Main App Component with Provider
export default function MiddlewareApp() {
  return (
    <Provider store={store}>
      <MiddlewareExample />
    </Provider>
  )
}