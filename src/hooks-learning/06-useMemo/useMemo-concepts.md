# useMemo Hook - Deep Dive Concepts

## 🧠 What is useMemo?

useMemo is a React hook that **memoizes the result of a calculation**. It only recalculates when its dependencies change, helping to optimize performance by avoiding expensive computations on every render.

### Basic Syntax
```javascript
const memoizedValue = useMemo(() => expensiveCalculation(a, b), [a, b]);
```

---

## 🎯 Why useMemo Exists

### **The Problem: Expensive Calculations on Every Render**

```javascript
// ❌ Problem: Expensive calculation runs on every render
function ExpensiveComponent({ items, filter }) {
  const [count, setCount] = useState(0);
  
  // This runs on EVERY render, even when items/filter haven't changed
  const expensiveValue = items
    .filter(item => item.category === filter)
    .reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div>
      <p>Total: ${expensiveValue}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment Count
      </button>
    </div>
  );
}
```

**Problem:** The expensive calculation runs every time `count` changes, even though it doesn't depend on `count`!

### **The Solution: useMemo**

```javascript
// ✅ Solution: Memoized calculation
function OptimizedComponent({ items, filter }) {
  const [count, setCount] = useState(0);
  
  // This only runs when items or filter change
  const expensiveValue = useMemo(() => {
    console.log('💰 Calculating expensive value...');
    return items
      .filter(item => item.category === filter)
      .reduce((sum, item) => sum + item.price, 0);
  }, [items, filter]); // Only recalculates when these change
  
  return (
    <div>
      <p>Total: ${expensiveValue}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment Count
      </button>
    </div>
  );
}
```

---

## 🔍 How useMemo Works

### **Dependency Array Behavior**

```javascript
function MyComponent({ data, filter, sortBy }) {
  // 1. No dependencies - never recalculates (rarely useful)
  const staticValue = useMemo(() => {
    return "This never changes";
  }, []);
  
  // 2. Single dependency - recalculates when data changes
  const filteredData = useMemo(() => {
    return data.filter(item => item.active);
  }, [data]);
  
  // 3. Multiple dependencies - recalculates when any dependency changes
  const processedData = useMemo(() => {
    return data
      .filter(item => item.category === filter)
      .sort((a, b) => a[sortBy] - b[sortBy]);
  }, [data, filter, sortBy]);
  
  return <div>...</div>;
}
```

---

## 🎨 Real-World Use Cases

### 1. **Expensive Calculations**

```javascript
function DataAnalytics({ salesData, dateRange }) {
  // Expensive statistical calculations
  const analytics = useMemo(() => {
    console.log('📊 Calculating analytics...');
    
    const filteredData = salesData.filter(sale => 
      sale.date >= dateRange.start && sale.date <= dateRange.end
    );
    
    const totalRevenue = filteredData.reduce((sum, sale) => sum + sale.amount, 0);
    const averageOrderValue = totalRevenue / filteredData.length;
    const topProducts = filteredData
      .reduce((acc, sale) => {
        acc[sale.product] = (acc[sale.product] || 0) + sale.amount;
        return acc;
      }, {});
    
    return {
      totalRevenue,
      averageOrderValue,
      topProducts: Object.entries(topProducts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    };
  }, [salesData, dateRange]);
  
  return (
    <div>
      <h2>Sales Analytics</h2>
      <p>Total Revenue: ${analytics.totalRevenue}</p>
      <p>Average Order: ${analytics.averageOrderValue}</p>
      <h3>Top Products:</h3>
      {analytics.topProducts.map(([product, revenue]) => (
        <div key={product}>{product}: ${revenue}</div>
      ))}
    </div>
  );
}
```

### 2. **Stable Object References**

```javascript
function UserProfile({ userId, preferences }) {
  // Create stable object reference for child components
  const userConfig = useMemo(() => ({
    id: userId,
    theme: preferences.theme,
    language: preferences.language,
    notifications: preferences.notifications
  }), [userId, preferences.theme, preferences.language, preferences.notifications]);
  
  // This child won't re-render unless userConfig actually changes
  return <UserSettings config={userConfig} />;
}

const UserSettings = memo(({ config }) => {
  console.log('UserSettings rendered');
  return <div>Settings for user {config.id}</div>;
});
```

### 3. **Filtered and Sorted Lists**

```javascript
function ProductList({ products, searchTerm, category, sortBy }) {
  const processedProducts = useMemo(() => {
    console.log('🔍 Processing products...');
    
    let result = products;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (category !== 'all') {
      result = result.filter(product => product.category === category);
    }
    
    // Sort
    result = result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });
    
    return result;
  }, [products, searchTerm, category, sortBy]);
  
  return (
    <div>
      {processedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## ⚠️ Common Pitfalls

### 1. **Overusing useMemo**

```javascript
// ❌ Don't do this - unnecessary overhead
function MyComponent({ name }) {
  // Simple string concatenation doesn't need memoization
  const greeting = useMemo(() => `Hello, ${name}!`, [name]);
  
  // Simple arithmetic doesn't need memoization
  const doubled = useMemo(() => count * 2, [count]);
  
  return <div>{greeting} - {doubled}</div>;
}

// ✅ Better - just use regular calculations
function MyComponent({ name }) {
  const greeting = `Hello, ${name}!`;
  const doubled = count * 2;
  
  return <div>{greeting} - {doubled}</div>;
}
```

### 2. **Missing Dependencies**

```javascript
// ❌ Wrong - missing dependency
function MyComponent({ items, multiplier }) {
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * multiplier), 0);
  }, [items]); // Missing multiplier!
  
  // This will use stale multiplier value
}

// ✅ Correct - include all dependencies
function MyComponent({ items, multiplier }) {
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * multiplier), 0);
  }, [items, multiplier]); // Include all dependencies
}
```

### 3. **Complex Dependencies**

```javascript
// ❌ Problematic - object dependency changes every render
function MyComponent({ config }) {
  const processedData = useMemo(() => {
    return expensiveCalculation(config);
  }, [config]); // config object might change every render
}

// ✅ Better - use specific properties
function MyComponent({ config }) {
  const processedData = useMemo(() => {
    return expensiveCalculation(config);
  }, [config.apiUrl, config.timeout, config.retries]);
}

// ✅ Even better - destructure props
function MyComponent({ apiUrl, timeout, retries }) {
  const processedData = useMemo(() => {
    return expensiveCalculation({ apiUrl, timeout, retries });
  }, [apiUrl, timeout, retries]);
}
```

---

## 🔧 useMemo vs useCallback

```javascript
// useMemo - memoizes VALUES (results of calculations)
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// useCallback - memoizes FUNCTIONS
const expensiveCallback = useCallback(() => {
  doSomething(data);
}, [data]);

// These are equivalent:
const memoizedCallback = useCallback(fn, deps);
const memoizedCallback = useMemo(() => fn, deps);
```

### **When to Use Which:**

- **useMemo:** For expensive calculations, object creation, array processing
- **useCallback:** For function references passed to child components

---

## 🎯 When to Use useMemo

### ✅ **Use useMemo When:**

1. **Expensive calculations** that don't need to run on every render
2. **Creating objects/arrays** that are passed to child components
3. **Processing large datasets** (filtering, sorting, transforming)
4. **Complex computations** that depend on specific props/state
5. **Preventing child re-renders** by providing stable references

### ❌ **Don't Use useMemo When:**

1. **Simple calculations** (basic math, string operations)
2. **Values that change frequently** (defeats the purpose)
3. **No performance issues** observed
4. **Premature optimization** without measuring

---

## 📊 Performance Measurement

### **Measuring useMemo Impact:**

```javascript
function PerformanceTest({ data }) {
  // Without useMemo
  const start1 = performance.now();
  const result1 = expensiveCalculation(data);
  const end1 = performance.now();
  console.log(`Without useMemo: ${end1 - start1}ms`);
  
  // With useMemo
  const result2 = useMemo(() => {
    const start = performance.now();
    const result = expensiveCalculation(data);
    const end = performance.now();
    console.log(`With useMemo calculation: ${end - start}ms`);
    return result;
  }, [data]);
  
  return <div>Results: {result1} vs {result2}</div>;
}
```

### **React DevTools Profiler:**
- Measure component render times
- Identify performance bottlenecks
- Compare before/after optimization

---

## 🧪 Testing useMemo

```javascript
import { renderHook } from '@testing-library/react-hooks';

function useExpensiveCalculation(data) {
  return useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);
}

test('should memoize expensive calculation', () => {
  const data = [{ value: 1 }, { value: 2 }, { value: 3 }];
  const { result, rerender } = renderHook(
    ({ data }) => useExpensiveCalculation(data),
    { initialProps: { data } }
  );
  
  const firstResult = result.current;
  
  // Re-render with same data
  rerender({ data });
  
  // Should return same reference (memoized)
  expect(result.current).toBe(firstResult);
  
  // Re-render with different data
  const newData = [{ value: 4 }, { value: 5 }];
  rerender({ data: newData });
  
  // Should return new value
  expect(result.current).not.toBe(firstResult);
  expect(result.current).toBe(9);
});
```

---

## 🎓 Best Practices

### ✅ **DO:**
- Profile before optimizing
- Include all dependencies
- Use for genuinely expensive operations
- Measure the performance impact
- Use ESLint exhaustive-deps rule

### ❌ **DON'T:**
- Overuse for simple calculations
- Forget dependencies
- Use without measuring performance
- Optimize prematurely
- Create complex dependency arrays

---

## 💡 Advanced Patterns

### **1. Memoized Custom Hook:**
```javascript
function useProcessedData(rawData, filters) {
  return useMemo(() => {
    return rawData
      .filter(item => filters.category ? item.category === filters.category : true)
      .filter(item => filters.minPrice ? item.price >= filters.minPrice : true)
      .sort((a, b) => filters.sortBy === 'price' ? a.price - b.price : a.name.localeCompare(b.name));
  }, [rawData, filters.category, filters.minPrice, filters.sortBy]);
}
```

### **2. Memoized Context Value:**
```javascript
function MyProvider({ children }) {
  const [state, setState] = useState(initialState);
  
  const contextValue = useMemo(() => ({
    state,
    actions: {
      updateUser: (user) => setState(prev => ({ ...prev, user })),
      updateSettings: (settings) => setState(prev => ({ ...prev, settings }))
    }
  }), [state]);
  
  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}
```

This comprehensive guide covers all aspects of useMemo for performance optimization!