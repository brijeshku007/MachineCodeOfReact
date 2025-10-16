# useReducer Hook - Deep Dive Concepts

## 🔄 What is useReducer?

useReducer is an alternative to useState for managing **complex state logic**. It's inspired by Redux and follows the same pattern: **state + action = new state**.

### When to Use useReducer vs useState

#### ✅ **Use useReducer When:**
- State has **multiple sub-values** (objects with many properties)
- **Next state depends on previous state** in complex ways
- State transitions are **predictable and testable**
- You need **centralized state logic**
- Multiple components need to **dispatch the same actions**

#### ✅ **Use useState When:**
- State is **simple** (string, number, boolean)
- State updates are **independent**
- **Local component state** only

---

## 📋 useReducer Syntax & Pattern

### Basic Syntax
```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

### The Reducer Function
```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'ACTION_TYPE':
      return { ...state, /* new state */ };
    default:
      return state;
  }
}
```

### Dispatching Actions
```javascript
dispatch({ type: 'ACTION_TYPE', payload: data });
```

---

## 🎯 Core Concepts

### 1. **State**
The current state of your component (usually an object).

### 2. **Action**
An object that describes what happened. Must have a `type` property.
```javascript
// Simple action
{ type: 'INCREMENT' }

// Action with data
{ type: 'SET_USER', payload: { name: 'John', email: 'john@example.com' } }
```

### 3. **Reducer**
A pure function that takes current state and action, returns new state.
```javascript
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
}
```

### 4. **Dispatch**
Function to send actions to the reducer.

---

## 🆚 useState vs useReducer Comparison

### **Simple Counter with useState:**
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### **Same Counter with useReducer:**
```javascript
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

---

## 🏗️ Complex State Management Examples

### **Shopping Cart with useReducer:**
```javascript
const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + newItem.price
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...newItem, quantity: 1 }],
          total: state.total + newItem.price
        };
      }
      
    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove.price * itemToRemove.quantity)
      };
      
    case 'UPDATE_QUANTITY':
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      const quantityDiff = quantity - item.quantity;
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
        total: state.total + (item.price * quantityDiff)
      };
      
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    default:
      return state;
  }
}
```

---

## 🎨 Advanced useReducer Patterns

### 1. **Lazy Initialization**
```javascript
function init(initialCount) {
  return { count: initialCount };
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  // Third parameter is init function
}
```

### 2. **Action Creators**
```javascript
// Action creators for better organization
const actions = {
  increment: () => ({ type: 'INCREMENT' }),
  decrement: () => ({ type: 'DECREMENT' }),
  reset: () => ({ type: 'RESET' }),
  setCount: (count) => ({ type: 'SET_COUNT', payload: count })
};

// Usage
dispatch(actions.increment());
dispatch(actions.setCount(10));
```

### 3. **Reducer Composition**
```javascript
// Combine multiple reducers
function appReducer(state, action) {
  return {
    user: userReducer(state.user, action),
    cart: cartReducer(state.cart, action),
    ui: uiReducer(state.ui, action)
  };
}
```

### 4. **Middleware Pattern**
```javascript
function withLogging(reducer) {
  return (state, action) => {
    console.log('Previous State:', state);
    console.log('Action:', action);
    const newState = reducer(state, action);
    console.log('New State:', newState);
    return newState;
  };
}

const [state, dispatch] = useReducer(withLogging(myReducer), initialState);
```

---

## 🔄 useReducer with useContext

### **Global State Management:**
```javascript
// Create context
const StateContext = createContext();

// Provider component
function StateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}

// Custom hook to use state
function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within StateProvider');
  }
  return context;
}

// Usage in components
function MyComponent() {
  const { state, dispatch } = useAppState();
  
  return (
    <button onClick={() => dispatch({ type: 'SOME_ACTION' })}>
      Click me
    </button>
  );
}
```

---

## ⚡ Performance Benefits

### **Why useReducer Can Be Better:**

1. **Predictable State Updates**
   - All state logic in one place
   - Easy to test and debug
   - Consistent state transitions

2. **Better for Complex State**
   - Multiple related state values
   - Complex update logic
   - State dependencies

3. **Optimization Opportunities**
   - Dispatch function is stable (doesn't change)
   - Can optimize child components with React.memo
   - Easier to implement undo/redo

---

## 🐛 Common Pitfalls

### 1. **Mutating State**
```javascript
// ❌ Wrong - mutating state
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      state.items.push(action.payload); // Mutating!
      return state;
  }
}

// ✅ Correct - returning new state
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
  }
}
```

### 2. **Missing Default Case**
```javascript
// ❌ Wrong - no default case
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    // Missing default case!
  }
}

// ✅ Correct - always include default
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      return state; // Always return current state for unknown actions
  }
}
```

### 3. **Complex Logic in Components**
```javascript
// ❌ Wrong - complex logic in component
function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const handleComplexUpdate = () => {
    // Complex logic here
    if (state.user.isLoggedIn && state.cart.items.length > 0) {
      dispatch({ type: 'CHECKOUT_START' });
      // More complex logic...
    }
  };
}

// ✅ Better - move logic to reducer
function reducer(state, action) {
  switch (action.type) {
    case 'ATTEMPT_CHECKOUT':
      if (state.user.isLoggedIn && state.cart.items.length > 0) {
        return { ...state, checkout: { loading: true } };
      }
      return { ...state, error: 'Cannot checkout' };
  }
}
```

---

## 🎓 Best Practices

### ✅ **DO:**
- Keep reducers pure (no side effects)
- Use action types as constants
- Include payload in actions when needed
- Always return new state objects
- Use TypeScript for better action typing
- Test reducers independently

### ❌ **DON'T:**
- Mutate state directly
- Perform side effects in reducers
- Forget the default case
- Make actions too granular or too broad
- Use useReducer for simple state

---

## 🧪 Testing useReducer

### **Testing Reducers:**
```javascript
import { counterReducer } from './counterReducer';

describe('counterReducer', () => {
  test('should increment count', () => {
    const initialState = { count: 0 };
    const action = { type: 'INCREMENT' };
    const newState = counterReducer(initialState, action);
    
    expect(newState.count).toBe(1);
  });
  
  test('should not mutate original state', () => {
    const initialState = { count: 0 };
    const action = { type: 'INCREMENT' };
    const newState = counterReducer(initialState, action);
    
    expect(initialState.count).toBe(0); // Original unchanged
    expect(newState).not.toBe(initialState); // New object
  });
});
```

This comprehensive guide covers all the essential concepts of useReducer for complex state management!