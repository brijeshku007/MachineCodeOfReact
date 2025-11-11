# 🔄 RTK Query: Modern Data Fetching

## 🎯 Learning Objectives

By the end of this module, you will:
- ✅ Master RTK Query for modern data fetching
- ✅ Create API slices with queries and mutations
- ✅ Implement caching and invalidation strategies
- ✅ Handle loading states and error management
- ✅ Implement optimistic updates and real-time sync

## 📚 What is RTK Query?

RTK Query is a powerful data fetching and caching solution built on top of Redux Toolkit. It's designed to simplify common cases for loading data in a web application, eliminating the need to hand-write data fetching & caching logic yourself.

### **Key Benefits:**
- **Automatic caching** - Smart caching with invalidation
- **Background refetching** - Keep data fresh automatically
- **Optimistic updates** - Instant UI feedback
- **Error handling** - Built-in error states
- **TypeScript support** - Full type safety
- **DevTools integration** - Excellent debugging experience

## 🏗️ Core Concepts

### **1. API Slice Creation**

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define API slice
const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Post', 'User'],
  endpoints: (builder) => ({
    // Define endpoints here
  }),
})
```

### **2. Query Endpoints**

```javascript
// GET requests - for fetching data
getPosts: builder.query({
  query: () => '/posts',
  providesTags: ['Post'],
}),

getPost: builder.query({
  query: (id) => `/posts/${id}`,
  providesTags: (result, error, id) => [{ type: 'Post', id }],
}),

getPostsByUser: builder.query({
  query: (userId) => `/posts?userId=${userId}`,
  providesTags: (result) =>
    result
      ? [
          ...result.map(({ id }) => ({ type: 'Post', id })),
          { type: 'Post', id: 'LIST' },
        ]
      : [{ type: 'Post', id: 'LIST' }],
}),
```

### **3. Mutation Endpoints**

```javascript
// POST, PUT, DELETE requests - for modifying data
addPost: builder.mutation({
  query: (newPost) => ({
    url: '/posts',
    method: 'POST',
    body: newPost,
  }),
  invalidatesTags: [{ type: 'Post', id: 'LIST' }],
}),

updatePost: builder.mutation({
  query: ({ id, ...patch }) => ({
    url: `/posts/${id}`,
    method: 'PATCH',
    body: patch,
  }),
  invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
}),

deletePost: builder.mutation({
  query: (id) => ({
    url: `/posts/${id}`,
    method: 'DELETE',
  }),
  invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
}),
```

### **4. Generated Hooks**

RTK Query automatically generates hooks for each endpoint:

```javascript
// Export generated hooks
export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetPostsByUserQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = apiSlice

export default apiSlice
```

## 🎣 Using RTK Query Hooks

### **Query Hooks (GET requests)**

```javascript
function PostsList() {
  const {
    data: posts,
    error,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
  } = useGetPostsQuery()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {posts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

### **Mutation Hooks (POST, PUT, DELETE)**

```javascript
function AddPostForm() {
  const [addPost, { isLoading, error }] = useAddPostMutation()

  const handleSubmit = async (formData) => {
    try {
      const result = await addPost(formData).unwrap()
      console.log('Post added:', result)
    } catch (error) {
      console.error('Failed to add post:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Post'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  )
}
```

## 🏷️ Cache Management with Tags

### **Tag System**

Tags are used to define relationships between cached data and mutations:

```javascript
// Define tag types
tagTypes: ['Post', 'User', 'Comment'],

// Provide tags (what data this endpoint provides)
getPosts: builder.query({
  query: () => '/posts',
  providesTags: (result) =>
    result
      ? [
          ...result.map(({ id }) => ({ type: 'Post', id })),
          { type: 'Post', id: 'LIST' },
        ]
      : [{ type: 'Post', id: 'LIST' }],
}),

// Invalidate tags (what cache to clear when this mutation runs)
addPost: builder.mutation({
  query: (newPost) => ({
    url: '/posts',
    method: 'POST',
    body: newPost,
  }),
  invalidatesTags: [{ type: 'Post', id: 'LIST' }],
}),
```

### **Advanced Tag Patterns**

```javascript
// Conditional tags based on result
providesTags: (result, error, arg) => {
  if (error) return []
  return result
    ? [
        { type: 'Post', id: result.id },
        { type: 'Post', id: 'LIST' },
      ]
    : [{ type: 'Post', id: 'LIST' }]
},

// Dynamic invalidation
invalidatesTags: (result, error, { userId }) => [
  { type: 'Post', id: 'LIST' },
  { type: 'User', id: userId },
],
```

## ⚡ Advanced Features

### **1. Optimistic Updates**

```javascript
updatePost: builder.mutation({
  query: ({ id, ...patch }) => ({
    url: `/posts/${id}`,
    method: 'PATCH',
    body: patch,
  }),
  async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
    // Optimistic update
    const patchResult = dispatch(
      apiSlice.util.updateQueryData('getPost', id, (draft) => {
        Object.assign(draft, patch)
      })
    )
    
    try {
      await queryFulfilled
    } catch {
      // Revert optimistic update on error
      patchResult.undo()
    }
  },
}),
```

### **2. Streaming Updates**

```javascript
getPost: builder.query({
  query: (id) => `/posts/${id}`,
  async onCacheEntryAdded(
    arg,
    { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
  ) {
    // Wait for initial data
    await cacheDataLoaded

    // Set up streaming connection
    const ws = new WebSocket(`ws://localhost:8080/posts/${arg}`)
    
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      updateCachedData((draft) => {
        Object.assign(draft, data)
      })
    })

    // Cleanup on cache removal
    await cacheEntryRemoved
    ws.close()
  },
}),
```

### **3. Conditional Fetching**

```javascript
function UserProfile({ userId }) {
  const {
    data: user,
    isLoading,
  } = useGetUserQuery(userId, {
    skip: !userId, // Skip if no userId
    pollingInterval: 30000, // Poll every 30 seconds
    refetchOnMountOrArgChange: true, // Refetch on mount
    refetchOnFocus: true, // Refetch when window gains focus
    refetchOnReconnect: true, // Refetch on network reconnect
  })

  // Component logic
}
```

### **4. Manual Cache Updates**

```javascript
function useOptimisticUpdate() {
  const dispatch = useDispatch()

  const updatePostOptimistically = (id, updates) => {
    dispatch(
      apiSlice.util.updateQueryData('getPost', id, (draft) => {
        Object.assign(draft, updates)
      })
    )
  }

  const invalidatePost = (id) => {
    dispatch(
      apiSlice.util.invalidateTags([{ type: 'Post', id }])
    )
  }

  return { updatePostOptimistically, invalidatePost }
}
```

## 🔧 Error Handling Patterns

### **1. Global Error Handling**

```javascript
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
    
    if (refreshResult.data) {
      api.dispatch(tokenReceived(refreshResult.data))
      // Retry the original query
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(loggedOut())
    }
  }
  
  return result
}
```

### **2. Component Error Handling**

```javascript
function PostsList() {
  const { data, error, isLoading, isError } = useGetPostsQuery()

  if (isLoading) return <LoadingSpinner />
  
  if (isError) {
    return (
      <ErrorBoundary>
        <div className="error">
          <h3>Failed to load posts</h3>
          <p>{error.status}: {error.data?.message || error.error}</p>
          <button onClick={() => refetch()}>Try Again</button>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <div>
      {data?.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

## 🎯 Best Practices

### **1. API Slice Organization**

```javascript
// features/api/apiSlice.js
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Post', 'User', 'Comment'],
  endpoints: () => ({}),
})

// features/posts/postsApiSlice.js
import { apiSlice } from '../api/apiSlice'

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: ['Post'],
    }),
    // ... other post endpoints
  }),
})

export const { useGetPostsQuery } = postsApiSlice
```

### **2. TypeScript Integration**

```typescript
interface Post {
  id: number
  title: string
  content: string
  userId: number
}

interface PostsResponse {
  posts: Post[]
  total: number
  page: number
}

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<PostsResponse, { page?: number }>({
      query: ({ page = 1 } = {}) => `/posts?page=${page}`,
      providesTags: ['Post'],
    }),
  }),
})
```

### **3. Performance Optimization**

```javascript
// Use selectFromResult to minimize re-renders
const { post, isLoading } = useGetPostQuery(postId, {
  selectFromResult: ({ data, isLoading }) => ({
    post: data,
    isLoading,
  }),
})

// Use skip to prevent unnecessary requests
const { data } = useGetUserPostsQuery(userId, {
  skip: !userId || !isAuthenticated,
})

// Use pollingInterval for real-time data
const { data } = useGetNotificationsQuery(undefined, {
  pollingInterval: 5000, // Poll every 5 seconds
})
```

## 🧪 Testing RTK Query

### **1. Mock API Responses**

```javascript
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('/api/posts', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, title: 'Test Post', content: 'Test content' },
      ])
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### **2. Test Components with RTK Query**

```javascript
import { renderWithProviders } from '../../utils/test-utils'
import { PostsList } from './PostsList'

test('displays posts when loaded', async () => {
  render(<PostsList />, { wrapper: renderWithProviders })
  
  expect(screen.getByText('Loading...')).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })
})
```

## 🎯 Key Takeaways

### **RTK Query Advantages:**
- **Automatic caching** - No manual cache management
- **Background updates** - Data stays fresh automatically
- **Optimistic updates** - Instant UI feedback
- **Error handling** - Built-in error states and retry logic
- **TypeScript support** - Full type safety out of the box
- **DevTools integration** - Excellent debugging experience

### **When to Use RTK Query:**
- ✅ API-driven applications
- ✅ Need automatic caching and background updates
- ✅ Want to eliminate boilerplate data fetching code
- ✅ Building real-time or frequently updated UIs
- ✅ Need optimistic updates and error handling

### **When to Consider Alternatives:**
- ❌ Simple applications with minimal API calls
- ❌ Need very specific caching strategies
- ❌ Working with non-REST APIs exclusively
- ❌ Team prefers other data fetching solutions

## 🚀 Next Steps

After mastering RTK Query, you'll be ready for:
- **Advanced Patterns** - Entity adapters and normalized data
- **Middleware** - Custom middleware and side effects
- **Testing** - Comprehensive testing strategies
- **Real-world Architecture** - Large-scale application patterns

RTK Query is a game-changer for data fetching in React applications. It eliminates most of the boilerplate code you'd normally write for API integration while providing powerful features like automatic caching, background updates, and optimistic updates.

---

**Ready to implement RTK Query?** Check out `RTKQueryExample.jsx` for hands-on practice! 🎯