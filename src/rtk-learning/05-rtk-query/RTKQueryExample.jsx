import React, { useState } from 'react'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider, useDispatch } from 'react-redux'

// 🔄 RTK Query API Slice
const jsonPlaceholderApi = createApi({
  reducerPath: 'jsonPlaceholderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Post', 'User', 'Comment'],
  endpoints: (builder) => ({
    // 📖 Query Endpoints (GET requests)
    getPosts: builder.query({
      query: (limit = 10) => `/posts?_limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Post', id })),
            { type: 'Post', id: 'LIST' },
          ]
          : [{ type: 'Post', id: 'LIST' }],
    }),

    getPost: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),

    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),

    getPostComments: builder.query({
      query: (postId) => `/posts/${postId}/comments`,
      providesTags: (result, error, postId) => [
        { type: 'Comment', id: `POST_${postId}` },
      ],
    }),

    // ✏️ Mutation Endpoints (POST, PUT, DELETE)
    addPost: builder.mutation({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
      // Optimistic update
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          jsonPlaceholderApi.util.updateQueryData('getPosts', 10, (draft) => {
            draft.unshift({ id: Date.now(), ...newPost })
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),

    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
      // Optimistic update
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          jsonPlaceholderApi.util.updateQueryData('getPost', id, (draft) => {
            Object.assign(draft, patch)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
      ],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetUsersQuery,
  useGetPostCommentsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = jsonPlaceholderApi

// 🏪 Store Configuration
const store = configureStore({
  reducer: {
    [jsonPlaceholderApi.reducerPath]: jsonPlaceholderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jsonPlaceholderApi.middleware),
})

// 📝 Posts List Component
function PostsList() {
  const [limit, setLimit] = useState(5)
  const {
    data: posts,
    error,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
  } = useGetPostsQuery(limit)

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading posts...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="error">
        <h3>❌ Failed to load posts</h3>
        <p>{error.status}: {error.data?.message || error.error}</p>
        <button onClick={refetch} className="retry-btn">
          🔄 Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="posts-section">
      <div className="posts-header">
        <h2>📚 Posts ({posts?.length})</h2>
        <div className="controls">
          <label>
            Limit:
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={5}>5 posts</option>
              <option value={10}>10 posts</option>
              <option value={20}>20 posts</option>
            </select>
          </label>
          <button onClick={refetch} disabled={isFetching}>
            {isFetching ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      <div className="posts-grid">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

// 🃏 Post Card Component
function PostCard({ post }) {
  const [showDetails, setShowDetails] = useState(false)
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id).unwrap()
        console.log('Post deleted successfully')
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <h3>#{post.id}: {post.title}</h3>
        <div className="post-actions">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="details-btn"
          >
            {showDetails ? '👁️ Hide' : '👁️ Show'}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="delete-btn"
          >
            {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete'}
          </button>
        </div>
      </div>

      <p className="post-body">{post.body}</p>

      {showDetails && <PostDetails postId={post.id} />}
    </div>
  )
}

// 📋 Post Details Component
function PostDetails({ postId }) {
  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = useGetPostQuery(postId)

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useGetPostCommentsQuery(postId)

  if (postLoading || commentsLoading) {
    return <div className="loading-details">Loading details...</div>
  }

  if (postError || commentsError) {
    return <div className="error-details">Failed to load details</div>
  }

  return (
    <div className="post-details">
      <div className="post-meta">
        <p><strong>User ID:</strong> {post?.userId}</p>
        <p><strong>Post ID:</strong> {post?.id}</p>
      </div>

      <div className="comments-section">
        <h4>💬 Comments ({comments?.length})</h4>
        <div className="comments-list">
          {comments?.slice(0, 3).map((comment) => (
            <div key={comment.id} className="comment">
              <strong>{comment.name}</strong>
              <p>{comment.body}</p>
              <small>📧 {comment.email}</small>
            </div>
          ))}
          {comments?.length > 3 && (
            <p className="more-comments">
              ... and {comments.length - 3} more comments
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ➕ Add Post Form Component
function AddPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [userId, setUserId] = useState(1)
  const [addPost, { isLoading, error, isSuccess }] = useAddPostMutation()

  const { data: users } = useGetUsersQuery()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return

    try {
      const result = await addPost({
        title: title.trim(),
        body: body.trim(),
        userId: Number(userId),
      }).unwrap()

      console.log('Post added successfully:', result)
      setTitle('')
      setBody('')
      setUserId(1)
    } catch (error) {
      console.error('Failed to add post:', error)
    }
  }

  return (
    <div className="add-post-section">
      <h2>➕ Add New Post</h2>
      <form onSubmit={handleSubmit} className="add-post-form">
        <div className="form-group">
          <label htmlFor="userId">👤 User:</label>
          <select
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.username})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">📝 Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="body">📄 Content:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter post content..."
            rows={4}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? '➕ Adding...' : '➕ Add Post'}
          </button>
          {isSuccess && (
            <span className="success-message">✅ Post added successfully!</span>
          )}
        </div>

        {error && (
          <div className="error-message">
            ❌ Error: {error.data?.message || error.error}
          </div>
        )}
      </form>
    </div>
  )
}

// ✏️ Edit Post Component
function EditPostExample() {
  const [postId, setPostId] = useState(1)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const {
    data: post,
    isLoading: fetchLoading,
  } = useGetPostQuery(postId, {
    skip: !postId,
  })

  const [updatePost, { isLoading: updateLoading, error, isSuccess }] =
    useUpdatePostMutation()

  // Update form when post data loads
  React.useEffect(() => {
    if (post) {
      setTitle(post.title)
      setBody(post.body)
    }
  }, [post])

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return

    try {
      const result = await updatePost({
        id: postId,
        title: title.trim(),
        body: body.trim(),
      }).unwrap()

      console.log('Post updated successfully:', result)
    } catch (error) {
      console.error('Failed to update post:', error)
    }
  }

  return (
    <div className="edit-post-section">
      <h2>✏️ Edit Post</h2>

      <div className="post-selector">
        <label htmlFor="postSelect">Select Post to Edit:</label>
        <input
          id="postSelect"
          type="number"
          min="1"
          max="100"
          value={postId}
          onChange={(e) => setPostId(Number(e.target.value))}
        />
      </div>

      {fetchLoading && <div className="loading">Loading post...</div>}

      {post && (
        <form onSubmit={handleUpdate} className="edit-post-form">
          <div className="form-group">
            <label htmlFor="editTitle">📝 Title:</label>
            <input
              id="editTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editBody">📄 Content:</label>
            <textarea
              id="editBody"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={updateLoading} className="update-btn">
              {updateLoading ? '✏️ Updating...' : '✏️ Update Post'}
            </button>
            {isSuccess && (
              <span className="success-message">✅ Post updated successfully!</span>
            )}
          </div>

          {error && (
            <div className="error-message">
              ❌ Error: {error.data?.message || error.error}
            </div>
          )}
        </form>
      )}
    </div>
  )
}

// 📊 Cache Status Component
function CacheStatus() {
  const dispatch = useDispatch()

  const clearCache = () => {
    dispatch(jsonPlaceholderApi.util.resetApiState())
    console.log('Cache cleared!')
  }

  const invalidatePosts = () => {
    dispatch(
      jsonPlaceholderApi.util.invalidateTags([{ type: 'Post', id: 'LIST' }])
    )
    console.log('Posts cache invalidated!')
  }

  return (
    <div className="cache-status">
      <h3>🗄️ Cache Management</h3>
      <div className="cache-actions">
        <button onClick={clearCache} className="cache-btn">
          🗑️ Clear All Cache
        </button>
        <button onClick={invalidatePosts} className="cache-btn">
          🔄 Invalidate Posts
        </button>
      </div>
      <p className="cache-info">
        💡 Open Redux DevTools to see cache state and network requests
      </p>
    </div>
  )
}

// 🎯 Main RTK Query Example Component
function RTKQueryExample() {
  const [activeTab, setActiveTab] = useState('posts')

  const tabs = [
    { id: 'posts', label: '📚 Posts List', component: PostsList },
    { id: 'add', label: '➕ Add Post', component: AddPostForm },
    { id: 'edit', label: '✏️ Edit Post', component: EditPostExample },
    { id: 'cache', label: '🗄️ Cache', component: CacheStatus },
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="rtk-query-example">
      <div className="header">
        <h1>🔄 RTK Query Example</h1>
        <p>Modern data fetching with automatic caching, background updates, and optimistic updates</p>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {ActiveComponent && <ActiveComponent />}
      </div>

      <div className="features-info">
        <h3>🎯 RTK Query Features Demonstrated:</h3>
        <ul>
          <li>✅ <strong>Automatic Caching:</strong> Data is cached and reused across components</li>
          <li>✅ <strong>Background Refetching:</strong> Data stays fresh with automatic updates</li>
          <li>✅ <strong>Optimistic Updates:</strong> UI updates instantly, reverts on error</li>
          <li>✅ <strong>Loading States:</strong> Built-in loading, error, and success states</li>
          <li>✅ <strong>Cache Invalidation:</strong> Smart cache updates with tags</li>
          <li>✅ <strong>Error Handling:</strong> Comprehensive error management</li>
          <li>✅ <strong>TypeScript Ready:</strong> Full type safety (when using TypeScript)</li>
          <li>✅ <strong>DevTools Integration:</strong> Excellent debugging experience</li>
        </ul>
      </div>

      <style jsx>{`
        .rtk-query-example {
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
          min-height: 400px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .posts-section h2,
        .add-post-section h2,
        .edit-post-section h2 {
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

        .controls {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .controls label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .controls select,
        .controls button {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .controls button {
          background: #667eea;
          color: white;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .controls button:hover:not(:disabled) {
          background: #5a6fd8;
        }

        .controls button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          transition: box-shadow 0.2s ease;
        }

        .post-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .post-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.2rem;
          flex: 1;
          margin-right: 15px;
        }

        .post-actions {
          display: flex;
          gap: 8px;
        }

        .post-actions button {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .details-btn:hover {
          background: #e3f2fd;
          border-color: #2196f3;
        }

        .delete-btn:hover:not(:disabled) {
          background: #ffebee;
          border-color: #f44336;
          color: #f44336;
        }

        .post-body {
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .post-details {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e1e5e9;
        }

        .post-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          font-size: 0.9rem;
        }

        .post-meta p {
          margin: 0;
          color: #666;
        }

        .comments-section h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .comments-list {
          max-height: 200px;
          overflow-y: auto;
        }

        .comment {
          padding: 10px;
          margin-bottom: 10px;
          background: white;
          border-radius: 6px;
          border-left: 3px solid #667eea;
        }

        .comment strong {
          color: #333;
          display: block;
          margin-bottom: 5px;
        }

        .comment p {
          margin: 0 0 5px 0;
          color: #666;
          font-size: 0.9rem;
        }

        .comment small {
          color: #999;
          font-size: 0.8rem;
        }

        .more-comments {
          text-align: center;
          color: #666;
          font-style: italic;
          margin: 10px 0 0 0;
        }

        .add-post-form,
        .edit-post-form {
          max-width: 600px;
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

        .form-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .submit-btn,
        .update-btn {
          padding: 12px 24px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .submit-btn:hover:not(:disabled),
        .update-btn:hover:not(:disabled) {
          background: #5a6fd8;
        }

        .submit-btn:disabled,
        .update-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .success-message {
          color: #4caf50;
          font-weight: 500;
        }

        .error-message {
          color: #f44336;
          background: #ffebee;
          padding: 10px;
          border-radius: 6px;
          margin-top: 10px;
        }

        .post-selector {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .post-selector label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .post-selector input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100px;
        }

        .cache-status {
          text-align: center;
        }

        .cache-actions {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin: 20px 0;
        }

        .cache-btn {
          padding: 12px 24px;
          background: #ff9800;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s ease;
        }

        .cache-btn:hover {
          background: #f57c00;
        }

        .cache-info {
          color: #666;
          font-style: italic;
          margin-top: 20px;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 40px;
          color: #666;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e1e5e9;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-details {
          text-align: center;
          padding: 20px;
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

        .error h3 {
          margin: 0 0 10px 0;
        }

        .retry-btn {
          margin-top: 15px;
          padding: 10px 20px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .retry-btn:hover {
          background: #d32f2f;
        }

        .error-details {
          text-align: center;
          padding: 15px;
          color: #f44336;
          background: #ffebee;
          border-radius: 6px;
          margin: 10px 0;
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
          .rtk-query-example {
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

          .controls {
            flex-wrap: wrap;
          }

          .post-header {
            flex-direction: column;
            gap: 10px;
          }

          .post-actions {
            align-self: flex-start;
          }

          .post-meta {
            flex-direction: column;
            gap: 5px;
          }

          .cache-actions {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  )
}

// 🎯 Main App Component with Provider
export default function RTKQueryApp() {
  return (
    <Provider store={store}>
      <RTKQueryExample />
    </Provider>
  )
}