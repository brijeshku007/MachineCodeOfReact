# Custom Hooks - Deep Dive Concepts

## 🎯 What are Custom Hooks?

Custom hooks are **JavaScript functions that use other hooks** and allow you to **extract and reuse stateful logic** between components. They're the secret weapon of professional React developers!

### Basic Rules
1. **Must start with "use"** - `useCustomHook`, `useFetch`, `useLocalStorage`
2. **Can call other hooks** - useState, useEffect, useCallback, etc.
3. **Return anything** - values, objects, arrays, functions
4. **Are just functions** - no magic, just JavaScript functions that use hooks

---

## 🔥 Why Custom Hooks are Game-Changers

### **Before Custom Hooks (The Problem):**
```javascript
// ❌ Repeated logic in every component
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>Welcome {user.name}</div>;
}

function PostsList() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(setPosts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  // Same loading/error logic repeated...
}
```

### **After Custom Hooks (The Solution):**
```javascript
// ✅ Reusable custom hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
}

// ✅ Clean, reusable components
function UserProfile() {
  const { data: user, loading, error } = useFetch('/api/user');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>Welcome {user.name}</div>;
}

function PostsList() {
  const { data: posts, loading, error } = useFetch('/api/posts');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return posts.map(post => <div key={post.id}>{post.title}</div>);
}
```

---

## 🎨 Custom Hook Patterns

### 1. **Data Fetching Hooks**

#### **Basic Fetch Hook:**
```javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, {
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    return () => abortController.abort();
  }, [url]);
  
  return { data, loading, error };
}
```

#### **Advanced API Hook:**
```javascript
function useApi(baseUrl) {
  const [cache, setCache] = useState(new Map());
  
  const request = useCallback(async (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`;
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the result
      setCache(prev => new Map(prev).set(cacheKey, data));
      
      return data;
    } catch (error) {
      throw error;
    }
  }, [baseUrl, cache]);
  
  const get = useCallback((endpoint) => request(endpoint), [request]);
  const post = useCallback((endpoint, data) => 
    request(endpoint, { method: 'POST', body: JSON.stringify(data) }), [request]);
  const put = useCallback((endpoint, data) => 
    request(endpoint, { method: 'PUT', body: JSON.stringify(data) }), [request]);
  const del = useCallback((endpoint) => 
    request(endpoint, { method: 'DELETE' }), [request]);
  
  return { get, post, put, delete: del, clearCache: () => setCache(new Map()) };
}
```

### 2. **State Management Hooks**

#### **Local Storage Hook:**
```javascript
function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);
  
  return [storedValue, setValue, removeValue];
}
```

#### **Toggle Hook:**
```javascript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, { toggle, setTrue, setFalse, setValue }];
}
```

### 3. **Form Handling Hooks**

#### **Form Hook:**
```javascript
function useForm(initialValues, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);
  
  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);
  
  const validate = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = values[field];
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = rule.required;
      } else if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[field] = rule.patternMessage || 'Invalid format';
      } else if (rule.minLength && value && value.length < rule.minLength) {
        newErrors[field] = `Minimum ${rule.minLength} characters required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);
  
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);
      
      if (validate()) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }
      
      setIsSubmitting(false);
    };
  }, [values, validate]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  const isValid = Object.keys(errors).length === 0;
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setFieldTouched,
    handleSubmit,
    reset,
    validate
  };
}
```

### 4. **UI Interaction Hooks**

#### **Click Outside Hook:**
```javascript
function useClickOutside(ref, callback) {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [ref, callback]);
}
```

#### **Debounce Hook:**
```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}
```

#### **Window Size Hook:**
```javascript
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}
```

---

## 🎯 Advanced Custom Hook Patterns

### 1. **Hook Composition**
```javascript
// Combine multiple hooks for complex functionality
function useAuthenticatedApi(baseUrl) {
  const { user, token } = useAuth();
  const api = useApi(baseUrl);
  
  const authenticatedRequest = useCallback(async (endpoint, options = {}) => {
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    return api.request(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers
      }
    });
  }, [api, token]);
  
  return {
    ...api,
    request: authenticatedRequest,
    isAuthenticated: !!token,
    user
  };
}
```

### 2. **Hook with Reducer**
```javascript
function useAsyncReducer(reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const asyncDispatch = useCallback(async (action) => {
    if (typeof action === 'function') {
      // Handle async actions
      return action(dispatch, state);
    } else {
      // Handle regular actions
      dispatch(action);
    }
  }, [state]);
  
  return [state, asyncDispatch];
}
```

### 3. **Hook with Context**
```javascript
// Create a custom hook that uses context
function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  const { theme, setTheme } = context;
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, [setTheme]);
  
  const isDark = theme === 'dark';
  const isLight = theme === 'light';
  
  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
    isLight
  };
}
```

---

## 🧪 Testing Custom Hooks

### **Using React Testing Library:**
```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  test('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });
  
  test('should initialize with provided value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });
  
  test('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  test('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });
});
```

---

## 🎓 Best Practices for Custom Hooks

### ✅ **DO:**

1. **Start with "use"** - Always prefix with "use" for React DevTools
2. **Keep them focused** - One responsibility per hook
3. **Return objects for multiple values** - `{ data, loading, error }`
4. **Use useCallback for functions** - Prevent unnecessary re-renders
5. **Handle cleanup** - Always clean up subscriptions, timers, etc.
6. **Add error handling** - Gracefully handle edge cases
7. **Document your hooks** - Clear JSDoc comments
8. **Test thoroughly** - Unit test your custom hooks

### ❌ **DON'T:**

1. **Make them too generic** - Avoid over-abstraction
2. **Forget dependencies** - Include all dependencies in useEffect
3. **Ignore performance** - Don't create unnecessary re-renders
4. **Skip error handling** - Always handle potential errors
5. **Make them stateful when unnecessary** - Sometimes a regular function is better

---

## 🚀 Real-World Custom Hook Examples

### **1. Shopping Cart Hook:**
```javascript
function useShoppingCart() {
  const [items, setItems] = useLocalStorage('cart', []);
  
  const addItem = useCallback((product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, [setItems]);
  
  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  }, [setItems]);
  
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [setItems, removeItem]);
  
  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);
  
  const total = useMemo(() =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  
  const itemCount = useMemo(() =>
    items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  
  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    isEmpty: items.length === 0
  };
}
```

### **2. Infinite Scroll Hook:**
```javascript
function useInfiniteScroll(fetchMore, hasMore) {
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
        && hasMore
        && !loading
      ) {
        setLoading(true);
        try {
          await fetchMore();
        } finally {
          setLoading(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchMore, hasMore, loading]);
  
  return { loading };
}
```

This comprehensive guide covers everything you need to know about creating powerful, reusable custom hooks!