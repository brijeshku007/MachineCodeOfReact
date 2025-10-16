# useCallback Hook - Deep Dive Concepts

## ⚡ What is useCallback?

useCallback is a React hook that returns a **memoized version of a callback function**. It only changes if one of its dependencies has changed. This is useful for **performance optimization** when passing callbacks to optimized child components.

### Basic Syntax
```javascript
const memoizedCallback = useCallback(callback, dependencies);
```

---

## 🎯 Why useCallback Exists

### **The Problem: Unnecessary Re-renders**

```javascript
// ❌ Problem: New function created on every render
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // This creates a NEW function on every render
  const handleClick = () => {
    console.log('Button clicked');
  };
  
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <ExpensiveChild onClick={handleClick} />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
}

// Child component re-renders even when props haven't "really" changed
const ExpensiveChild = React.memo(({ onClick }) => {
  console.log('ExpensiveChild rendered'); // This logs on every parent render!
  return <button onClick={onClick}>Click me</button>;
});
```

**Problem:** Even though `ExpensiveChild` is wrapped with `React.memo`, it still re-renders because `handleClick` is a new function reference every time.

### **The Solution: useCallback**

```javascript
// ✅ Solution: Memoized function
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // This function is memoized - same reference unless dependencies change
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // Empty dependencies = never changes
  
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <ExpensiveChild onClick={handleClick} />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
}

// Now ExpensiveChild only re-renders when onClick actually changes
const ExpensiveChild = React.memo(({ onClick }) => {
  console.log('ExpensiveChild rendered'); // Only logs when necessary!
  return <button onClick={onClick}>Click me</button>;
});
```

---

## 🔍 How useCallback Works

### **Dependency Array Behavior**

```javascript
function MyComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // 1. No dependencies - callback never changes
  const callback1 = useCallback(() => {
    console.log('This callback never changes');
  }, []);
  
  // 2. With dependencies - callback changes when dependencies change
  const callback2 = useCallback(() => {
    console.log('Count is:', count);
  }, [count]); // Changes when count changes
  
  // 3. Multiple dependencies
  const callback3 = useCallback(() => {
    console.log('Count:', count, 'Name:', name);
  }, [count, name]); // Changes when count OR name changes
  
  return <div>...</div>;
}
```

### **Memory vs Performance Trade-off**

```javascript
// useCallback has its own overhead
const memoizedCallback = useCallback(() => {
  // Simple operation
  console.log('Hello');
}, []);

// For simple callbacks, the overhead might not be worth it
// Only use useCallback when:
// 1. Passing to React.memo components
// 2. Callback is expensive to create
// 3. Callback is used in other hook dependencies
```

---

## 🎨 Real-World Use Cases

### 1. **Optimizing Child Components**

```javascript
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  
  // Without useCallback, TodoItem re-renders on every filter change
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []); // No dependencies needed - uses functional update
  
  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} />
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  console.log('TodoItem rendered:', todo.id);
  
  return (
    <div>
      <span>{todo.text}</span>
      <button onClick={() => onToggle(todo.id)}>Toggle</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});
```

### 2. **Event Handlers with Dependencies**

```javascript
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Callback depends on query - will change when query changes
  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [query]); // Recreated when query changes
  
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(handleSearch, 500);
    return () => clearTimeout(timer);
  }, [handleSearch]); // handleSearch in dependency array
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <div>Searching...</div>}
      <SearchResults results={results} />
    </div>
  );
}
```

### 3. **Custom Hooks with Callbacks**

```javascript
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Memoized fetch function
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]); // Recreated when URL changes
  
  // Memoized refresh function
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, loading, error, refresh };
}
```

---

## ⚠️ Common Pitfalls

### 1. **Overusing useCallback**

```javascript
// ❌ Don't do this - unnecessary overhead
function MyComponent() {
  const [count, setCount] = useState(0);
  
  // This callback is not passed to any child components
  // and is not used in any dependencies - no need to memoize
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return <button onClick={handleClick}>Count: {count}</button>;
}

// ✅ Better - just use regular function
function MyComponent() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(prev => prev + 1);
  };
  
  return <button onClick={handleClick}>Count: {count}</button>;
}
```

### 2. **Missing Dependencies**

```javascript
// ❌ Wrong - missing dependency
function MyComponent() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(2);
  
  const calculate = useCallback(() => {
    return count * multiplier; // Uses multiplier but not in dependencies!
  }, [count]); // Missing multiplier in dependencies
  
  // This will use stale multiplier value
}

// ✅ Correct - include all dependencies
function MyComponent() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(2);
  
  const calculate = useCallback(() => {
    return count * multiplier;
  }, [count, multiplier]); // Include all dependencies
}
```

### 3. **Object/Array Dependencies**

```javascript
// ❌ Problematic - object recreated every render
function MyComponent() {
  const [user, setUser] = useState({ name: 'John', age: 30 });
  
  const handleUpdate = useCallback(() => {
    // Update user
  }, [user]); // user object changes on every render!
}

// ✅ Better - use specific properties
function MyComponent() {
  const [user, setUser] = useState({ name: 'John', age: 30 });
  
  const handleUpdate = useCallback(() => {
    // Update user
  }, [user.name, user.age]); // Use specific properties
}

// ✅ Even better - use useMemo for stable object reference
function MyComponent() {
  const [user, setUser] = useState({ name: 'John', age: 30 });
  
  const stableUser = useMemo(() => user, [user.name, user.age]);
  
  const handleUpdate = useCallback(() => {
    // Update user
  }, [stableUser]);
}
```

---

## 🎯 When to Use useCallback

### ✅ **Use useCallback When:**

1. **Passing callbacks to React.memo components**
2. **Callback is used in other hook dependencies**
3. **Callback creation is expensive**
4. **Preventing unnecessary re-renders in child components**

### ❌ **Don't Use useCallback When:**

1. **Callback is not passed to child components**
2. **Child components are not optimized (no React.memo)**
3. **Callback is simple and cheap to create**
4. **You're not seeing performance issues**

---

## 🔧 useCallback vs useMemo

```javascript
// useCallback - memoizes functions
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// useMemo - memoizes values (including functions)
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// These are equivalent:
const memoizedCallback = useCallback(fn, deps);
const memoizedCallback = useMemo(() => fn, deps);
```

---

## 🧪 Testing useCallback

```javascript
import { renderHook } from '@testing-library/react-hooks';

function useCounter() {
  const [count, setCount] = useState(0);
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return { count, increment };
}

test('increment callback should be stable', () => {
  const { result, rerender } = renderHook(() => useCounter());
  
  const firstIncrement = result.current.increment;
  
  // Trigger re-render
  rerender();
  
  const secondIncrement = result.current.increment;
  
  // Callback should be the same reference
  expect(firstIncrement).toBe(secondIncrement);
});
```

---

## 🎓 Best Practices

### ✅ **DO:**
- Use with React.memo for child component optimization
- Include all dependencies in the dependency array
- Use ESLint plugin for exhaustive-deps
- Profile before optimizing
- Use functional updates to reduce dependencies

### ❌ **DON'T:**
- Overuse - has its own overhead
- Forget dependencies
- Use for every callback
- Optimize prematurely
- Use without measuring performance impact

---

## 📊 Performance Measurement

```javascript
// Use React DevTools Profiler to measure:
// 1. Component render frequency
// 2. Render duration
// 3. Why components re-rendered

// Example: Measuring callback stability
function useCallbackStability() {
  const [count, setCount] = useState(0);
  
  // Without useCallback
  const unstableCallback = () => console.log(count);
  
  // With useCallback
  const stableCallback = useCallback(() => {
    console.log(count);
  }, [count]);
  
  // Measure reference equality
  const prevUnstable = useRef();
  const prevStable = useRef();
  
  useEffect(() => {
    console.log('Unstable changed:', prevUnstable.current !== unstableCallback);
    console.log('Stable changed:', prevStable.current !== stableCallback);
    
    prevUnstable.current = unstableCallback;
    prevStable.current = stableCallback;
  });
}
```

This comprehensive guide covers all aspects of useCallback for performance optimization!