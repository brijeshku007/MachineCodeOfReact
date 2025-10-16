# React Hooks - Complete Learning Guide

## Table of Contents
1. [Introduction to Hooks](#introduction-to-hooks)
2. [Basic Hooks](#basic-hooks)
3. [Additional Hooks](#additional-hooks)
4. [Custom Hooks](#custom-hooks)
5. [Hook Rules](#hook-rules)
6. [Advanced Patterns](#advanced-patterns)
7. [Performance Optimization](#performance-optimization)
8. [Best Practices](#best-practices)

---

## Introduction to Hooks

### What are React Hooks?
Hooks are functions that let you "hook into" React features from functional components. They allow you to use state and other React features without writing a class component.

### Why Hooks?
- **Simpler Code**: No need for class components
- **Reusable Logic**: Share stateful logic between components
- **Better Performance**: Easier optimization
- **Cleaner Code**: Less boilerplate, more readable

### Hook Naming Convention
- All hooks start with "use" (useState, useEffect, useCustomHook)
- Custom hooks should also follow this convention

---

## Basic Hooks

### 1. useState
**Purpose**: Manage local component state

**Syntax**: `const [state, setState] = useState(initialValue)`

**Key Points**:
- Returns an array with current state and setter function
- State updates are asynchronous
- Can hold any data type (string, number, object, array)
- Functional updates for complex state changes

**Common Patterns**:
```javascript
// Basic usage
const [count, setCount] = useState(0);

// Object state
const [user, setUser] = useState({ name: '', email: '' });

// Array state
const [items, setItems] = useState([]);

// Functional update
setCount(prevCount => prevCount + 1);
```

### 2. useEffect
**Purpose**: Handle side effects (API calls, subscriptions, DOM manipulation)

**Syntax**: `useEffect(callback, dependencies)`

**Key Points**:
- Runs after every render by default
- Dependency array controls when it runs
- Cleanup function prevents memory leaks
- Multiple useEffect hooks can be used

**Effect Types**:
```javascript
// Run on every render
useEffect(() => {
  console.log('Runs on every render');
});

// Run once (componentDidMount)
useEffect(() => {
  console.log('Runs once');
}, []);

// Run when dependencies change
useEffect(() => {
  console.log('Runs when count changes');
}, [count]);

// Cleanup (componentWillUnmount)
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

### 3. useContext
**Purpose**: Access React Context values

**Syntax**: `const value = useContext(MyContext)`

**Key Points**:
- Replaces Context.Consumer
- Must be used within a Provider
- Automatically re-renders when context value changes

---

## Additional Hooks

### 4. useReducer
**Purpose**: Manage complex state logic (alternative to useState)

**Syntax**: `const [state, dispatch] = useReducer(reducer, initialState)`

**When to Use**:
- Complex state logic
- Multiple sub-values
- Next state depends on previous state
- State transitions need to be predictable

### 5. useCallback
**Purpose**: Memoize functions to prevent unnecessary re-renders

**Syntax**: `const memoizedCallback = useCallback(callback, dependencies)`

**Key Points**:
- Returns memoized version of callback
- Only changes if dependencies change
- Useful for passing callbacks to optimized child components

### 6. useMemo
**Purpose**: Memoize expensive calculations

**Syntax**: `const memoizedValue = useMemo(() => computation, dependencies)`

**Key Points**:
- Only recalculates when dependencies change
- Use for expensive computations
- Don't overuse - has its own overhead

### 7. useRef
**Purpose**: Access DOM elements or persist values across renders

**Syntax**: `const ref = useRef(initialValue)`

**Use Cases**:
- DOM element access
- Storing mutable values that don't trigger re-renders
- Previous value storage
- Timer IDs, intervals

### 8. useLayoutEffect
**Purpose**: Synchronous version of useEffect

**Key Points**:
- Runs synchronously after all DOM mutations
- Use when you need to read DOM layout
- Can cause performance issues if overused

### 9. useImperativeHandle
**Purpose**: Customize instance value exposed to parent components

**Syntax**: `useImperativeHandle(ref, createHandle, dependencies)`

**Use Cases**:
- Exposing imperative API to parent
- Focus management
- Scroll control

### 10. useDebugValue
**Purpose**: Display custom hook values in React DevTools

**Syntax**: `useDebugValue(value, formatter?)`

---

## Custom Hooks

### What are Custom Hooks?
Functions that use other hooks and encapsulate reusable stateful logic.

### Benefits:
- **Reusability**: Share logic between components
- **Separation of Concerns**: Keep components clean
- **Testability**: Easier to test isolated logic

### Common Custom Hook Patterns:
- Data fetching hooks
- Form handling hooks
- Local storage hooks
- API hooks
- Timer hooks

### Example Structure:
```javascript
function useCustomHook(parameter) {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effect logic
  }, [parameter]);
  
  const helperFunction = useCallback(() => {
    // Helper logic
  }, []);
  
  return {
    state,
    helperFunction,
    // Other values/functions
  };
}
```

---

## Hook Rules

### 1. Only Call Hooks at the Top Level
- ❌ Don't call hooks inside loops, conditions, or nested functions
- ✅ Always call hooks at the top level of React functions

### 2. Only Call Hooks from React Functions
- ✅ React functional components
- ✅ Custom hooks
- ❌ Regular JavaScript functions

### 3. Hooks Must Be Called in the Same Order
- React relies on call order to track hook state
- Conditional hooks break this order

---

## Advanced Patterns

### 1. Hook Composition
Combining multiple hooks to create powerful abstractions.

### 2. Hook Dependencies
Understanding when hooks re-run and how to optimize.

### 3. Hook Testing
Testing components and custom hooks effectively.

### 4. Hook Performance
Optimizing hook usage for better performance.

---

## Performance Optimization

### 1. Dependency Arrays
- Always include all dependencies
- Use ESLint plugin for exhaustive-deps
- Be careful with object/array dependencies

### 2. Memoization
- Use useMemo for expensive calculations
- Use useCallback for function references
- Don't over-memoize

### 3. State Structure
- Keep state flat when possible
- Split related state into multiple useState calls
- Use useReducer for complex state

---

## Best Practices

### 1. Naming Conventions
- Use descriptive names for state variables
- Custom hooks should start with "use"
- Boolean state should be named with "is", "has", "should"

### 2. State Management
- Keep state as local as possible
- Lift state up when needed by multiple components
- Use context for truly global state

### 3. Effect Management
- Keep effects focused and single-purpose
- Always clean up subscriptions
- Use multiple effects for different concerns

### 4. Custom Hook Design
- Return objects for multiple values
- Use consistent return patterns
- Document hook behavior clearly

### 5. Testing
- Test hook behavior, not implementation
- Use React Testing Library
- Test custom hooks in isolation

---

## Common Pitfalls

### 1. Stale Closures
When effect callbacks capture old state values.

### 2. Infinite Loops
Missing or incorrect dependencies causing endless re-renders.

### 3. Unnecessary Re-renders
Not memoizing values/functions when needed.

### 4. Memory Leaks
Forgetting to clean up subscriptions and timers.

---

## Learning Path

### Beginner Level
1. useState - State management
2. useEffect - Side effects
3. useContext - Context consumption

### Intermediate Level
4. useReducer - Complex state
5. useCallback - Function memoization
6. useMemo - Value memoization
7. useRef - DOM access and refs

### Advanced Level
8. useLayoutEffect - Synchronous effects
9. useImperativeHandle - Imperative APIs
10. Custom Hooks - Reusable logic

---

## Next Steps

After completing this guide, you should:
1. Understand all built-in React hooks
2. Know when and how to use each hook
3. Be able to create custom hooks
4. Follow React hook best practices
5. Optimize hook performance
6. Test hook-based components

Happy learning! 🚀