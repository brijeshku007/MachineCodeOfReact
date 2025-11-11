# 🔄 Redux Toolkit Basics - Modern State Management

## 🤔 What is Redux Toolkit (RTK)?

Redux Toolkit is the **official, opinionated, batteries-included toolset** for efficient Redux development. It's designed to be the standard way to write Redux logic, addressing common concerns about Redux being "too complicated" or requiring "too much boilerplate code."

## 🎯 Why Redux Toolkit Exists

### **Problems with Vanilla Redux:**
```jsx
// ❌ Vanilla Redux - Too much boilerplate
// Action Types
const INCREMENT = 'counter/increment'
const DECREMENT = 'counter/decrement'

// Action Creators
const increment = () => ({ type: INCREMENT })
const decrement = () => ({ type: DECREMENT })

// Reducer
const counterReducer = (state = { value: 0 }, action) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: state.value + 1 }
    case DECREMENT:
      return { ...state, value: state.value - 1 }
    default:
      return state
  }
}

// Store
const store = createStore(counterReducer)
```

### **RTK Solution - Clean and Simple:**
```jsx
// ✅ Redux Toolkit - Minimal boilerplate
import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1  // Immer makes this safe!
    },
    decrement: (state) => {
      state.value -= 1
    }
  }
})

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
})
```

## 🧩 Core RTK Concepts

### **1. Slices - The Heart of RTK**
A slice is a collection of Redux reducer logic and actions for a single feature.

```jsx
import { createSlice } from '@reduxjs/toolkit'

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    filter: 'all'
  },
  reducers: {
    addTodo: (state, action) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false
      })
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(item => item.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    }
  }
})

// Auto-generated action creators
export const { addTodo, toggleTodo, setFilter } = todosSlice.actions

// Export reducer
export default todosSlice.reducer
```

### **2. Store Configuration**
RTK's `configureStore` provides good defaults and simplifies setup.

```jsx
import { configureStore } from '@reduxjs/toolkit'
import todosReducer from './todosSlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    todos: todosReducer,
    user: userReducer
  },
  // RTK includes these by default:
  // - Redux DevTools Extension
  // - Serializable state check middleware
  // - Immutable state check middleware
})

export default store
```

### **3. Immer Integration**
RTK uses Immer under the hood, allowing you to write "mutative" logic that's actually immutable.

```jsx
// ❌ Vanilla Redux - Manual immutable updates
const todosReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ]
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    default:
      return state
  }
}

// ✅ RTK with Immer - Write like mutable, get immutable
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({  // This is safe with Immer!
        id: action.payload.id,
        text: action.payload.text,
        completed: false
      })
    },
    toggleTodo: (state, action) => {
      const todo = state.find(todo => todo.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed  // Direct mutation is safe!
      }
    }
  }
})
```

## 🔄 State Management Patterns

### **1. Single Source of Truth**
All application state lives in one store.

```jsx
// Global state structure
const store = {
  user: {
    profile: { name: 'John', email: 'john@example.com' },
    preferences: { theme: 'dark', language: 'en' },
    isAuthenticated: true
  },
  todos: {
    items: [
      { id: 1, text: 'Learn RTK', completed: false },
      { id: 2, text: 'Build an app', completed: false }
    ],
    filter: 'all',
    loading: false
  },
  ui: {
    sidebarOpen: false,
    currentModal: null
  }
}
```

### **2. Predictable State Updates**
State can only be changed by dispatching actions.

```jsx
// ✅ Predictable - Actions describe what happened
dispatch(addTodo('Learn Redux Toolkit'))
dispatch(toggleTodo(1))
dispatch(setFilter('completed'))

// ❌ Unpredictable - Direct state mutation
state.todos.push(newTodo)  // Don't do this!
```

### **3. Pure Functions**
Reducers are pure functions that calculate new state.

```jsx
// ✅ Pure function - same input, same output
const counterReducer = (state = { value: 0 }, action) => {
  switch (action.type) {
    case 'increment':
      return { value: state.value + 1 }
    default:
      return state
  }
}

// ❌ Impure function - side effects
const badReducer = (state, action) => {
  console.log('Action dispatched')  // Side effect!
  fetch('/api/log')  // Side effect!
  return { value: state.value + 1 }
}
```

## 🎨 RTK vs Other State Management

### **RTK vs useState:**
```jsx
// useState - Good for local component state
function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}

// RTK - Good for global/shared state
function Counter() {
  const count = useSelector(state => state.counter.value)
  const dispatch = useDispatch()
  
  return (
    <button onClick={() => dispatch(increment())}>
      Count: {count}
    </button>
  )
}
```

### **RTK vs Context API:**
```jsx
// Context API - Good for simple global state
const ThemeContext = createContext()

function App() {
  const [theme, setTheme] = useState('light')
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <MyApp />
    </ThemeContext.Provider>
  )
}

// RTK - Better for complex state with many updates
const themeSlice = createSlice({
  name: 'theme',
  initialState: { current: 'light', available: ['light', 'dark'] },
  reducers: {
    setTheme: (state, action) => {
      state.current = action.payload
    },
    toggleTheme: (state) => {
      state.current = state.current === 'light' ? 'dark' : 'light'
    }
  }
})
```

## 🛠️ Setting Up Your First RTK App

### **Step 1: Installation**
```bash
npm install @reduxjs/toolkit react-redux
```

### **Step 2: Create a Slice**
```jsx
// features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer
```

### **Step 3: Configure Store**
```jsx
// app/store.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
})
```

### **Step 4: Provide Store to React**
```jsx
// index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

### **Step 5: Use in Components**
```jsx
// Counter.js
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, incrementByAmount } from './counterSlice'

function Counter() {
  const count = useSelector(state => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  )
}

export default Counter
```

## 🎯 When to Use RTK

### **✅ Use RTK When:**
- State is shared across multiple components
- State updates are complex or frequent
- You need predictable state updates
- You want time-travel debugging
- You're building a medium to large application
- You need to handle async operations

### **❌ Don't Use RTK When:**
- Simple local component state
- Very small applications
- State is only used in one component
- You're just starting to learn React

## 🔍 RTK DevTools

RTK includes Redux DevTools by default:

```jsx
// DevTools are automatically enabled in development
const store = configureStore({
  reducer: {
    counter: counterReducer
  }
  // DevTools extension is included automatically!
})
```

**DevTools Features:**
- **Action History** - See all dispatched actions
- **State Inspector** - Examine state at any point
- **Time Travel** - Jump to any previous state
- **Action Replay** - Replay actions step by step
- **State Diff** - See what changed between states

## 🎨 RTK Best Practices

### **1. Feature-Based Organization**
```
src/
├── app/
│   └── store.js
├── features/
│   ├── counter/
│   │   ├── counterSlice.js
│   │   └── Counter.js
│   ├── todos/
│   │   ├── todosSlice.js
│   │   └── TodoList.js
│   └── user/
│       ├── userSlice.js
│       └── UserProfile.js
```

### **2. Slice Naming Conventions**
```jsx
// ✅ Good naming
const todosSlice = createSlice({
  name: 'todos',  // Matches the slice name
  // ...
})

// Action types will be: 'todos/addTodo', 'todos/toggleTodo'
```

### **3. Action Payload Patterns**
```jsx
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    // ✅ Simple payload
    addTodo: (state, action) => {
      state.push({
        id: Date.now(),
        text: action.payload,  // Just the text
        completed: false
      })
    },
    
    // ✅ Object payload
    updateTodo: (state, action) => {
      const { id, updates } = action.payload
      const todo = state.find(todo => todo.id === id)
      if (todo) {
        Object.assign(todo, updates)
      }
    },
    
    // ✅ Prepared payload
    addTodoWithId: {
      reducer: (state, action) => {
        state.push(action.payload)
      },
      prepare: (text) => ({
        payload: {
          id: Date.now(),
          text,
          completed: false
        }
      })
    }
  }
})
```

## 🚨 Common Mistakes to Avoid

### **❌ Mistake 1: Mutating State Outside Reducers**
```jsx
// Wrong - Don't mutate state directly
const todos = useSelector(state => state.todos)
todos.push(newTodo)  // This breaks Redux!

// Correct - Dispatch actions
const dispatch = useDispatch()
dispatch(addTodo(newTodo))
```

### **❌ Mistake 2: Async Logic in Reducers**
```jsx
// Wrong - No async in reducers
const userSlice = createSlice({
  name: 'user',
  initialState: { data: null },
  reducers: {
    fetchUser: async (state, action) => {  // ❌ Don't do this!
      const user = await api.getUser(action.payload)
      state.data = user
    }
  }
})

// Correct - Use async thunks (we'll learn this next)
const fetchUser = createAsyncThunk('user/fetchUser', async (userId) => {
  const user = await api.getUser(userId)
  return user
})
```

### **❌ Mistake 3: Too Much State in Redux**
```jsx
// Wrong - Don't put everything in Redux
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mousePosition: { x: 0, y: 0 },  // ❌ Too granular
    inputValue: '',  // ❌ Local form state
    isHovered: false  // ❌ Temporary UI state
  }
})

// Correct - Only shared/persistent state
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,  // ✅ Shared across components
    currentModal: null,  // ✅ App-level state
    theme: 'light'  // ✅ Persistent preference
  }
})
```

## 🎉 What You've Learned

After completing RTK basics, you understand:

- ✅ **What Redux Toolkit is** and why it exists
- ✅ **Core concepts** - slices, store, actions, reducers
- ✅ **Immer integration** for easy immutable updates
- ✅ **Basic setup** and configuration
- ✅ **When to use RTK** vs other state solutions
- ✅ **Best practices** and common patterns
- ✅ **DevTools integration** for debugging

## 🚀 What's Next?

Now that you understand the basics, you're ready to:

1. **Store Setup** → `02-store-setup` - Advanced store configuration
2. **Slices Deep Dive** → `03-slices` - Advanced slice patterns
3. **Async Operations** → `04-async-thunks` - Handling API calls

---

**🎉 You've taken your first step into modern Redux development!**

**Next:** `02-store-setup/store-setup-concepts.md`