# 🧪 RTK Testing Strategies

## 🎯 Learning Objectives

By the end of this module, you will:
- ✅ Master testing RTK slices, reducers, and actions
- ✅ Test async thunks and error handling
- ✅ Mock RTK Query endpoints and API calls
- ✅ Implement integration testing with React components
- ✅ Apply Test-Driven Development (TDD) with RTK
- ✅ Create comprehensive test suites for production apps

## 📚 Why Test RTK Applications?

Testing RTK applications ensures:
- **Reliability** - State changes work as expected
- **Maintainability** - Refactoring doesn't break functionality
- **Documentation** - Tests serve as living documentation
- **Confidence** - Deploy with confidence knowing your state logic works
- **Team Collaboration** - Clear contracts between team members

### **Testing Pyramid for RTK:**
```
    🔺 E2E Tests (Few)
   🔺🔺 Integration Tests (Some)
  🔺🔺🔺 Unit Tests (Many)
```

## 🏗️ Testing Setup

### **1. Essential Testing Libraries**

```bash
# Core testing libraries
npm install --save-dev @testing-library/react
npm install --save-dev @testing-library/jest-dom
npm install --save-dev @testing-library/user-event

# RTK testing utilities
npm install --save-dev @reduxjs/toolkit/query/react
npm install --save-dev redux-mock-store

# API mocking
npm install --save-dev msw
npm install --save-dev fetch-mock
```

### **2. Test Utilities Setup**

```javascript
// src/utils/test-utils.js
import React from 'react'
import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

// Import your reducers
import userReducer from '../features/user/userSlice'
import postsReducer from '../features/posts/postsSlice'
import { apiSlice } from '../features/api/apiSlice'

// Create a custom render function that includes providers
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        user: userReducer,
        posts: postsReducer,
        api: apiSlice.reducer,
      },
      preloadedState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Re-export everything
export * from '@testing-library/react'
```

## 🧪 Testing RTK Slices

### **1. Testing Reducers**

```javascript
// features/counter/counterSlice.test.js
import counterReducer, {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from './counterSlice'

describe('counter reducer', () => {
  const initialState = {
    value: 0,
    status: 'idle',
  }

  test('should return the initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  test('should handle increment', () => {
    const actual = counterReducer(initialState, increment())
    expect(actual.value).toEqual(1)
  })

  test('should handle decrement', () => {
    const actual = counterReducer(initialState, decrement())
    expect(actual.value).toEqual(-1)
  })

  test('should handle incrementByAmount', () => {
    const actual = counterReducer(initialState, incrementByAmount(2))
    expect(actual.value).toEqual(2)
  })

  test('should handle reset', () => {
    const currentState = { value: 10, status: 'idle' }
    const actual = counterReducer(currentState, reset())
    expect(actual.value).toEqual(0)
  })
})
```

### **2. Testing Complex State Updates**

```javascript
// features/todos/todosSlice.test.js
import todosReducer, {
  todoAdded,
  todoToggled,
  todoDeleted,
  todosLoaded,
  todoUpdated,
} from './todosSlice'

describe('todos reducer', () => {
  const initialState = {
    items: [],
    status: 'idle',
    error: null,
  }

  test('should add a new todo', () => {
    const todoText = 'Learn RTK testing'
    const action = todoAdded(todoText)
    const result = todosReducer(initialState, action)

    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toEqual({
      id: expect.any(String),
      text: todoText,
      completed: false,
      createdAt: expect.any(String),
    })
  })

  test('should toggle todo completion', () => {
    const existingTodo = {
      id: '1',
      text: 'Test todo',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
    }
    const stateWithTodo = {
      ...initialState,
      items: [existingTodo],
    }

    const result = todosReducer(stateWithTodo, todoToggled('1'))
    expect(result.items[0].completed).toBe(true)
  })
})
```

## 🔄 Testing Async Thunks

### **1. Basic Thunk Testing**

```javascript
// features/user/userSlice.test.js
import { configureStore } from '@reduxjs/toolkit'
import userReducer, { fetchUserById } from './userSlice'

// Mock the API
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('fetchUserById thunk', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: { user: userReducer },
    })
    mockFetch.mockClear()
  })

  test('should fetch user successfully', async () => {
    const userData = { id: 1, name: 'John Doe', email: 'john@example.com' }
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => userData,
    })

    await store.dispatch(fetchUserById(1))

    const state = store.getState()
    expect(state.user.loading).toBe(false)
    expect(state.user.currentUser).toEqual(userData)
    expect(state.user.error).toBeNull()
  })

  test('should handle fetch user error', async () => {
    const errorMessage = 'User not found'
    
    mockFetch.mockRejectedValueOnce(new Error(errorMessage))

    await store.dispatch(fetchUserById(999))

    const state = store.getState()
    expect(state.user.loading).toBe(false)
    expect(state.user.currentUser).toBeNull()
    expect(state.user.error).toBe(errorMessage)
  })
})
```

## 🌐 Testing RTK Query

### **1. Mocking API Endpoints**

```javascript
// features/api/apiSlice.test.js
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'

// Mock server setup
const server = setupServer(
  rest.get('/api/posts', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' },
      ])
    )
  }),

  rest.post('/api/posts', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 3,
        title: 'New Post',
        content: 'New Content',
      })
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('API slice', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        api: apiSlice.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    })
  })

  test('should fetch posts', async () => {
    const promise = store.dispatch(apiSlice.endpoints.getPosts.initiate())
    const result = await promise

    expect(result.data).toEqual([
      { id: 1, title: 'Post 1', content: 'Content 1' },
      { id: 2, title: 'Post 2', content: 'Content 2' },
    ])
  })
})
```

## 🧩 Integration Testing

### **1. Testing Component-Store Integration**

```javascript
// components/TodoApp.test.js
import { renderWithProviders } from '../../utils/test-utils'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoApp from './TodoApp'

describe('TodoApp integration', () => {
  test('should add and display new todo', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TodoApp />)

    const input = screen.getByPlaceholderText('Add a new todo...')
    const addButton = screen.getByText('Add Todo')

    await user.type(input, 'Learn RTK testing')
    await user.click(addButton)

    expect(screen.getByText('Learn RTK testing')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  test('should toggle todo completion', async () => {
    const user = userEvent.setup()
    const preloadedState = {
      todos: {
        items: [
          { id: '1', text: 'Test todo', completed: false },
        ],
        status: 'idle',
        error: null,
      },
    }

    renderWithProviders(<TodoApp />, { preloadedState })

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })
})
```

## 🎯 Test-Driven Development (TDD)

### **1. TDD Cycle with RTK**

```javascript
// Step 1: Write failing test
describe('shopping cart slice', () => {
  test('should add item to cart', () => {
    const initialState = { items: [], total: 0 }
    const item = { id: 1, name: 'Product', price: 10, quantity: 1 }
    
    const result = cartReducer(initialState, addToCart(item))
    
    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toEqual(item)
    expect(result.total).toBe(10)
  })
})

// Step 2: Write minimal code to pass
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload)
      state.total += action.payload.price * action.payload.quantity
    },
  },
})
```

## 🎯 Key Takeaways

### **Testing Strategy:**
- **Unit Tests** - Test individual slices, reducers, and selectors
- **Integration Tests** - Test component-store interactions
- **E2E Tests** - Test complete user workflows
- **TDD Approach** - Write tests first, then implement

### **RTK Testing Benefits:**
- **Predictable State** - Pure functions are easy to test
- **Isolated Logic** - Business logic separated from UI
- **Comprehensive Coverage** - Test all state transitions
- **Confidence** - Deploy knowing your state management works

### **Best Practices:**
- ✅ Use descriptive test names
- ✅ Test behavior, not implementation
- ✅ Mock external dependencies
- ✅ Maintain high test coverage
- ✅ Keep tests fast and isolated

## 🚀 Next Steps

After mastering RTK testing, you'll be ready for:
- **Real-world Architecture** - Large-scale application patterns
- **Advanced RTK** - Expert-level techniques and optimizations
- **Production Deployment** - Best practices for production apps

---

**Ready to implement testing strategies?** Check out `TestingExample.jsx` for hands-on practice! 🎯