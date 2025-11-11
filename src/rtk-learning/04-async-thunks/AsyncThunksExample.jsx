// ⚡ Async Thunks - Complete Working Examples
// This demonstrates async operations, API integration, and error handling

import React, { useState, useEffect } from 'react';
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// =============================================================================
// MOCK API SERVICES
// =============================================================================

// Simulate network delays and potential failures
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockApi = {
  // Users API
  async getUsers() {
    await delay(1000);
    if (Math.random() < 0.1) throw new Error('Network error');

    return {
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive' }
      ]
    };
  },

  async getUserById(id) {
    await delay(800);
    if (Math.random() < 0.15) throw new Error('User not found');

    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', posts: 15, followers: 120 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', posts: 8, followers: 89 },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', posts: 23, followers: 156 }
    ];

    const user = users.find(u => u.id === parseInt(id));
    if (!user) throw new Error('User not found');

    return { data: user };
  },

  async createUser(userData) {
    await delay(1200);
    if (Math.random() < 0.2) {
      throw new Error('Validation failed: Email already exists');
    }

    return {
      data: {
        id: Date.now(),
        ...userData,
        status: 'active',
        createdAt: new Date().toISOString()
      }
    };
  },

  async updateUser(id, updates) {
    await delay(900);
    if (Math.random() < 0.1) throw new Error('Update failed');

    return {
      data: {
        id: parseInt(id),
        ...updates,
        updatedAt: new Date().toISOString()
      }
    };
  },

  // Posts API
  async getPosts(page = 1, limit = 5) {
    await delay(600);
    if (Math.random() < 0.05) throw new Error('Failed to load posts');

    const allPosts = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Post ${i + 1}`,
      content: `This is the content of post ${i + 1}`,
      authorId: Math.floor(Math.random() * 3) + 1,
      likes: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));

    const start = (page - 1) * limit;
    const posts = allPosts.slice(start, start + limit);

    return {
      data: posts,
      total: allPosts.length,
      page,
      hasMore: start + limit < allPosts.length
    };
  },

  async searchPosts(query) {
    await delay(400);

    const allPosts = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `${query} related post ${i + 1}`,
      content: `Content about ${query}`,
      authorId: Math.floor(Math.random() * 3) + 1
    }));

    return { data: allPosts };
  }
};

// =============================================================================
// ASYNC THUNKS
// =============================================================================

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockApi.getUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
);

// Fetch user by ID with conditional logic
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const response = await mockApi.getUserById(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        userId,
        timestamp: new Date().toISOString()
      });
    }
  },
  {
    condition: (userId, { getState }) => {
      const { users } = getState();
      // Don't fetch if already loading
      return !users.loading;
    }
  }
);

// Create user with optimistic updates
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { dispatch, rejectWithValue }) => {
    // Optimistic update
    const tempUser = {
      id: `temp_${Date.now()}`,
      ...userData,
      status: 'pending'
    };

    dispatch(usersSlice.actions.addUserOptimistic(tempUser));

    try {
      const response = await mockApi.createUser(userData);
      return { tempId: tempUser.id, user: response.data };
    } catch (error) {
      // Revert optimistic update
      dispatch(usersSlice.actions.removeUserOptimistic(tempUser.id));
      return rejectWithValue({
        message: error.message,
        userData
      });
    }
  }
);

// Update user with retry logic
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, updates }, { rejectWithValue }) => {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await mockApi.updateUser(userId, updates);
        return response.data;
      } catch (error) {
        lastError = error;

        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          const delay = Math.pow(2, attempt) * 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    return rejectWithValue({
      message: `Failed after ${maxRetries} attempts: ${lastError.message}`,
      userId,
      updates
    });
  }
);

// Fetch posts with pagination
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, reset = false }, { rejectWithValue }) => {
    try {
      const response = await mockApi.getPosts(page, 5);
      return { ...response, reset };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        page
      });
    }
  }
);

// Search posts with debouncing (handled in component)
export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async (query, { rejectWithValue }) => {
    try {
      if (!query.trim()) return [];
      const response = await mockApi.searchPosts(query);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        query
      });
    }
  },
  {
    condition: (query) => {
      return query && query.trim().length > 0;
    }
  }
);

// =============================================================================
// SLICES
// =============================================================================

// Users slice with comprehensive async handling
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    selectedUser: null,
    loading: false,
    error: null,
    lastFetch: null,
    optimisticUpdates: []
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    addUserOptimistic: (state, action) => {
      state.items.push(action.payload);
      state.optimisticUpdates.push(action.payload.id);
    },
    removeUserOptimistic: (state, action) => {
      const tempId = action.payload;
      state.items = state.items.filter(user => user.id !== tempId);
      state.optimisticUpdates = state.optimisticUpdates.filter(id => id !== tempId);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedUser = null;
      })

      // Create User
      .addCase(createUser.fulfilled, (state, action) => {
        const { tempId, user } = action.payload;
        // Replace optimistic update with real data
        const index = state.items.findIndex(item => item.id === tempId);
        if (index !== -1) {
          state.items[index] = user;
        }
        state.optimisticUpdates = state.optimisticUpdates.filter(id => id !== tempId);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.items.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updatedUser };
        }
        if (state.selectedUser && state.selectedUser.id === updatedUser.id) {
          state.selectedUser = { ...state.selectedUser, ...updatedUser };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

// Posts slice with pagination
const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    searchResults: [],
    pagination: {
      page: 1,
      hasMore: true,
      total: 0
    },
    loading: false,
    searchLoading: false,
    error: null
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    resetPagination: (state) => {
      state.items = [];
      state.pagination = { page: 1, hasMore: true, total: 0 };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const { data, page, hasMore, total, reset } = action.payload;

        state.loading = false;

        if (reset) {
          state.items = data;
        } else {
          state.items.push(...data);
        }

        state.pagination = { page, hasMore, total };
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Posts
      .addCase(searchPosts.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSelectedUser } = usersSlice.actions;
export const { clearSearchResults, resetPagination } = postsSlice.actions;//
 =============================================================================
// STORE CONFIGURATION
// =============================================================================

const store = configureStore({
  reducer: {
    users: usersSlice.reducer,
    posts: postsSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

// =============================================================================
// COMPONENTS
// =============================================================================

// Users Management Component
function UsersManager() {
  const dispatch = useDispatch();
  const { items: users, selectedUser, loading, error } = useSelector(state => state.users);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUserClick = (userId) => {
    dispatch(fetchUserById(userId));
  };

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  return (
    <div className="users-manager">
      <div className="section-header">
        <h2>👥 Users Management</h2>
        <div className="header-actions">
          <button onClick={handleRefresh} disabled={loading} className="btn-secondary">
            {loading ? '🔄 Loading...' : '↻ Refresh'}
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? 'Cancel' : '+ Add User'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>❌ {error.message}</span>
          <button onClick={() => dispatch(clearError())} className="btn-small">×</button>
        </div>
      )}

      {showCreateForm && <CreateUserForm onClose={() => setShowCreateForm(false)} />}

      <div className="users-content">
        <div className="users-list">
          <h3>All Users ({users.length})</h3>
          {loading && users.length === 0 ? (
            <div className="loading-state">Loading users...</div>
          ) : (
            <div className="user-cards">
              {users.map(user => (
                <div
                  key={user.id}
                  className={`user-card ${user.status === 'pending' ? 'optimistic' : ''}`}
                  onClick={() => handleUserClick(user.id)}
                >
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  <span className={`status ${user.status}`}>{user.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="user-details">
          {selectedUser ? (
            <UserDetails user={selectedUser} />
          ) : (
            <div className="no-selection">
              <p>Select a user to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Create User Form with Optimistic Updates
function CreateUserForm({ onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await dispatch(createUser(formData)).unwrap();
      setFormData({ name: '', email: '' });
      onClose();
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-form">
      <h3>Create New User</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} disabled={submitting} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}

// User Details with Update Functionality
function UserDetails({ user }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email });
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await dispatch(updateUser({
        userId: user.id,
        updates: formData
      })).unwrap();
      setEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="user-details-panel">
      <div className="details-header">
        <h3>User Details</h3>
        <button
          onClick={() => setEditing(!editing)}
          className="btn-secondary"
          disabled={updating}
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleUpdate} className="edit-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={updating}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={updating}
            />
          </div>

          <button type="submit" disabled={updating} className="btn-primary">
            {updating ? 'Updating...' : 'Update User'}
          </button>
        </form>
      ) : (
        <div className="user-info">
          <div className="info-item">
            <label>ID:</label>
            <span>{user.id}</span>
          </div>
          <div className="info-item">
            <label>Name:</label>
            <span>{user.name}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="info-item">
            <label>Status:</label>
            <span className={`status ${user.status}`}>{user.status}</span>
          </div>
          {user.posts && (
            <div className="info-item">
              <label>Posts:</label>
              <span>{user.posts}</span>
            </div>
          )}
          {user.followers && (
            <div className="info-item">
              <label>Followers:</label>
              <span>{user.followers}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Posts with Pagination and Search
function PostsManager() {
  const dispatch = useDispatch();
  const {
    items: posts,
    searchResults,
    pagination,
    loading,
    searchLoading,
    error
  } = useSelector(state => state.posts);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, reset: true }));
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(searchPosts(searchQuery));
      } else {
        dispatch(clearSearchResults());
      }
    }, 300);

    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [searchQuery, dispatch]);

  const handleLoadMore = () => {
    if (!loading && pagination.hasMore) {
      dispatch(fetchPosts({ page: pagination.page + 1, reset: false }));
    }
  };

  const handleRefresh = () => {
    dispatch(resetPagination());
    dispatch(fetchPosts({ page: 1, reset: true }));
  };

  return (
    <div className="posts-manager">
      <div className="section-header">
        <h2>📝 Posts Manager</h2>
        <button onClick={handleRefresh} disabled={loading} className="btn-secondary">
          {loading ? '🔄 Loading...' : '↻ Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>❌ {error.message}</span>
        </div>
      )}

      {/* Search */}
      <div className="search-section">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchLoading && <span className="search-loading">🔍</span>}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="search-results">
          <h3>Search Results ({searchResults.length})</h3>
          {searchResults.length === 0 && !searchLoading ? (
            <p>No results found for "{searchQuery}"</p>
          ) : (
            <div className="posts-list">
              {searchResults.map(post => (
                <PostCard key={`search-${post.id}`} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Posts */}
      <div className="all-posts">
        <h3>All Posts ({pagination.total})</h3>
        <div className="posts-list">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More */}
        {pagination.hasMore && (
          <div className="load-more">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Loading...' : 'Load More Posts'}
            </button>
          </div>
        )}

        {!pagination.hasMore && posts.length > 0 && (
          <div className="end-message">
            <p>You've reached the end! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Post Card Component
function PostCard({ post }) {
  return (
    <div className="post-card">
      <h4>{post.title}</h4>
      <p>{post.content}</p>
      <div className="post-meta">
        <span>👤 Author: {post.authorId}</span>
        <span>❤️ {post.likes || 0} likes</span>
        {post.createdAt && (
          <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN APP
// =============================================================================

function AsyncThunksApp() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <Provider store={store}>
      <div className="async-app">
        <header className="app-header">
          <h1>⚡ Async Thunks Demo</h1>
          <p>Complete async operations with loading states, error handling, and optimistic updates</p>

          <nav className="tab-nav">
            <button
              onClick={() => setActiveTab('users')}
              className={activeTab === 'users' ? 'active' : ''}
            >
              👥 Users
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={activeTab === 'posts' ? 'active' : ''}
            >
              📝 Posts
            </button>
          </nav>
        </header>

        <main className="app-content">
          {activeTab === 'users' && <UsersManager />}
          {activeTab === 'posts' && <PostsManager />}
        </main>

        <footer className="async-concepts">
          <h3>🎯 Async Thunk Concepts Demonstrated:</h3>
          <div className="concepts-grid">
            <div className="concept-card">
              <h4>⏳ Loading States</h4>
              <p>Automatic pending/fulfilled/rejected state management</p>
            </div>
            <div className="concept-card">
              <h4>🚨 Error Handling</h4>
              <p>Custom error payloads and retry logic</p>
            </div>
            <div className="concept-card">
              <h4>⚡ Optimistic Updates</h4>
              <p>Immediate UI updates with rollback on failure</p>
            </div>
            <div className="concept-card">
              <h4>🔍 Conditional Thunks</h4>
              <p>Preventing unnecessary API calls</p>
            </div>
            <div className="concept-card">
              <h4>📄 Pagination</h4>
              <p>Load more data with proper state management</p>
            </div>
            <div className="concept-card">
              <h4>🔎 Debounced Search</h4>
              <p>Efficient search with delayed API calls</p>
            </div>
          </div>
        </footer>
      </div>
    </Provider>
  );
}

export default AsyncThunksApp;/
/ =============================================================================
// CSS STYLES
// =============================================================================

const styles = `
.async-app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.app-header {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: white;
}

.app-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
}

.app-header p {
  margin: 0 0 2rem 0;
  opacity: 0.9;
}

.tab-nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.tab-nav button {
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.tab-nav button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tab-nav button.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.app-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

/* Users Manager */
.users-manager {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

.section-header h2 {
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.error-banner {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #fcc;
}

.create-form {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 2px solid #e3f2fd;
}

.create-form h3 {
  margin: 0 0 1rem 0;
  color: #1976d2;
}

.users-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.users-list h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.user-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.user-card:hover {
  background: #e3f2fd;
  border-color: #1976d2;
  transform: translateY(-1px);
}

.user-card.optimistic {
  background: #fff3e0;
  border-color: #ff9800;
}

.user-card h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.user-card p {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.inactive {
  background: #f8d7da;
  color: #721c24;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.user-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.no-selection {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.user-details-panel {
  height: fit-content;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottomet);
}eSheild(styld.appendChument.heayles;
  docent = stextContyleSheet.te');
  stt('styllemeneateE.crt = document styleShee
  consted') {undefin= 'cument !=typeof dont
if ( to documestyles

// Add 
}
`;: 1fr;
  }e-columnsmplatd-te
    gririd {ncepts-g 
  .com;
  }
 ap: 0.5ren;
    g: columrectionflex-di
     {eta-m
  .post
  lumn;
  }rection: co flex-di{
   ctions m-aor }
  
  .f column;
 tion:lex-direc {
    f.tab-nav  }
  
  : center;
fy-contentsti{
    juions ader-acthe  }
  
  .etch;
items: str align-   1rem;
p: n;
    gaon: columdirectiex-{
    flon-header  .secti}
  
 r;
  umns: 1fte-colrid-templa g
   content {rs-  .use }
  
m;
 g: 1repaddinpp {
    async-a) {
  .768pxwidth: @media (max- */
esignsive D Respon
/*.9rem;
}
ont-size: 0: 0.9;
  f opacity: 0;
  margincard p {
 concept-
.em;
}
: 1.1rfont-size0;
   1rem argin: 0 0h4 {
  m-card ceptcon}

.center;
t-align: 
  tex 8px;r-radius:rde;
  borem1.5adding: .1);
  p 255, 255, 0(255,d: rgbaunkgrod {
  bac.concept-car


}p: 1.5rem;;
  ga250px, 1fr))minmax(, t(auto-fitns: repealate-columd-tempgrid;
  grisplay:   di-grid {


.conceptsm 0;
}n: 0 0 2re
  margin: center;-aligext{
  tpts h3 async-conce}

.e;
whit;
  color:  2remdding:
  pa: 12px;der-radius0.1);
  bor5, 255, 255, 25ound: rgba(
  backgrconcepts {nc-*/
.asyoter cepts Foync Con
}

/* As;9ecefd: #eunro
  backghover {mall:.btn-s}

d #ddd;
lipx sor: 1borde  33;
or: #3  col9fa;
#f8fkground: m;
  bacze: 0.9re  font-si5rem 1rem;
: 0.{
  padding
.btn-small ;
}
owedsor: not-allcur
   #ccc;ound:  backgrdisabled {
ondary:

.btn-sec;
}#5a6268kground: 
  bacsabled) {er:not(:didary:hovn-secon}

.bt white;

  color: #6c757d;und: backgroary {
 ond-sec
.btn;
}
nonesform: ed;
  tranllowor: not-a curs #ccc;
 d:ckgroun  bad {
bleprimary:disa
.btn-0.4);
}
126, 234, (102, rgba0 4px 12px adow:  box-shY(-1px);
 lateorm: trans {
  transfabled)r:not(:dishovetn-primary:
}

.blor: white;
  co%);a2 100%, #764b 0 #667eeaient(135deg,adlinear-ground:  backgrary {
 imprbtn-

. 1rem;
}ont-size:
  f.3s;l 0n: alitio;
  transointer pr:urso
  c;weight: 500;
  font-radius: 6pxr-bordenone;
  border: .5rem;
  rem 1ing: 0.75l {
  paddmal,
.btn-sondaryecn-s
.bttn-primary,ttons */
.b
}

/* Buop: 1rem;  margin-torm {


.edit-f1.5rem;
}-top: ;
  margin 1remgap:x;
  y: fleplas {
  dis.form-action
}

owed;allursor: not-;
  cf5f5f5or: #d-colroun
  backgisabled {t:dinpuroup 

.form-g none;
}
  outline:2;or: #1976dder-colus {
  bornput:focm-group i
.for}
s;
r-color 0.3n: bordeitiom;
  transize: 1re;
  font-sdius: 4pxborder-ra
  lid #ddd;r: 1px so borde75rem;
  0. padding:;
 idth: 100%ut {
  wgroup inp
.form- #333;
}
r: coloold;
 t-weight: b
  fonrem;: 0.5in-bottomk;
  margisplay: bloc
  dabel {m-group l}

.form;
om: 1reott  margin-bm-group {
rms */
.for}

/* Foic;
le: italnt-sty  foor: #666;
m;
  col2reing:   paddenter;
t-align: c  texssage {
.end-mem 0;
}

 2re margin:ter;
  cengn:ali{
  text-e 

.load-mor;
} #888;
  color:: 0.9remizefont-s
   gap: 1rem;ay: flex;
 spleta {
  dist-m5;
}

.po1.eight: line-h: #666;
  colorrem 0;
   0 1rgin: 0map {
  t-card 
}

.poslor: #333;m 0;
  co0 0.5re: 0   margind h4 {

.post-car(-1px);
}
eYrm: translattransfo
   0, 0.1);rgba(0, 0,0 4px 12px w:   box-shadoover {
card:hpost-}

..3s;
 0nsition: all;
  tra #e0e0e0olidpx s: 1;
  border: 8pxradiusder-bor5rem;
  ding: 1.pad#f8f9fa;
  ckground:  {
  bacard

.post-
}em;p: 1rolumn;
  gaction: c flex-dire
 lay: flex;isplist {
  dsts-
}

.pocolor: #333;em 0;
   0 1rn: 0argi h3 {
  m-posts}

.all;
 #1976d2or:
  col0;1rem gin: 0 0 h3 {
  maresults search-rpx;
}

.dius: 8border-ra#e3f2fd;
  und: roackg  b1rem;
 padding: em;
 m: 2rrgin-botto
  mah-results {

.searc}
}360deg); rotate(: form{ trans  to g); }
deate(0orm: rotnsftra
  from { n {spies 
@keyframinite;
}
inf linear 1sation: spin imrem;
  an  right: 1ute;
tion: absolsig {
  pooadin

.search-le;
}ine: nond2;
  outl: #1976order-colorus {
  bt:focrch-inpu
.seas;
}
olor 0.3on: border-cnsitirem;
  trasize: 1font-;
  ius: 8px border-rad;
  solid #dddrder: 2px bo 1rem;
 
  padding:;100%: t {
  widthinpu
.search-
}
 center;lign-items:
  a flex;isplay:  dtive;
tion: rela
  posiainer {ut-continph-rc}

.seatom: 2rem;
botgin-  mar-section {
.search


}auto; 0 
  margin:00px;width: 8er {
  max-posts-managr */
.Manage Posts ;
}

/*olor: #333 span {
  cfo-item.in6;
}

color: #66: bold;
  ght
  font-weim label {-ite
.infoee;
}
x solid #e-bottom: 1p0;
  borderrem 0.5g: paddin
  center;tems: 
  align-ietween; space-bt:stify-conten flex;
  ju display: {
 nfo-itemem;
}

.iap: 1r
  gon: column;directi;
  flex-exy: fl
  displa {ser-info
.u
}
lor: #333;: 0;
  co  marginer h3 {
tails-head
.de
rem;
}: 1.5