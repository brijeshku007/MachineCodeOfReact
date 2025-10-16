# 🚀 Custom Hooks Mastery - The Ultimate React Skill

## 🎉 Welcome to Custom Hooks - Where React Gets Powerful!

Custom hooks are the **secret weapon of professional React developers**. They're where you'll spend most of your time building real applications, and they're what separates junior developers from senior ones.

---

## 🎯 What Are Custom Hooks?

**Custom hooks are JavaScript functions that:**
- Start with "use" (useCounter, useFetch, useAuth)
- Use other React hooks inside them
- Allow you to extract and reuse stateful logic
- Return anything you want (values, objects, functions)

### **The Magic Formula:**
```javascript
function useCustomHook(parameters) {
  // 1. Use other hooks (useState, useEffect, etc.)
  // 2. Create reusable logic
  // 3. Return what components need
  
  return { data, actions, helpers };
}
```

---

## 🔥 Why Custom Hooks Are Game-Changers

### **Before Custom Hooks (The Pain):**
```javascript
// ❌ Same logic repeated in every component
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
  
  // 20 lines of repeated logic...
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
  
  // Same 20 lines repeated again! 😫
}
```

### **After Custom Hooks (The Joy):**
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

// ✅ Clean, focused components
function UserProfile() {
  const { data: user, loading, error } = useFetch('/api/user');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>Welcome {user.name}!</div>;
}

function PostsList() {
  const { data: posts, loading, error } = useFetch('/api/posts');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return posts.map(post => <div key={post.id}>{post.title}</div>);
}
```

---

## 🎨 Custom Hook Patterns You'll Master

### **1. State Management Hooks**
```javascript
// useCounter - Simple state with actions
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(prev => prev + 1), []);
  const decrement = useCallback(() => setCount(prev => prev - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset };
}

// useToggle - Boolean state management
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(prev => !prev), []);
  return [value, toggle];
}

// useLocalStorage - Persistent state
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key]);
  
  return [storedValue, setValue];
}
```

### **2. Data Fetching Hooks**
```javascript
// Basic fetch hook
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
    
    if (url) {
      fetchData();
    }
    
    return () => abortController.abort();
  }, [url]);
  
  return { data, loading, error };
}

// Advanced API hook with caching
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
        headers: { 'Content-Type': 'application/json', ...options.headers },
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
  
  return { get, post, clearCache: () => setCache(new Map()) };
}
```

### **3. UI Interaction Hooks**
```javascript
// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Click outside hook
function useClickOutside(ref, callback) {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
}

// Window size hook
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

### **4. Form Handling Hooks**
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
  
  const validate = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = values[field];
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = rule.required;
      } else if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[field] = rule.patternMessage || 'Invalid format';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);
  
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
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
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    handleSubmit,
    reset,
    validate,
    isValid: Object.keys(errors).length === 0
  };
}
```

---

## 🎓 Custom Hook Best Practices

### **✅ DO:**
1. **Start with "use"** - Always prefix with "use" for React DevTools
2. **Keep them focused** - One responsibility per hook
3. **Return objects for multiple values** - `{ data, loading, error }`
4. **Use useCallback for functions** - Prevent unnecessary re-renders
5. **Handle cleanup** - Always clean up subscriptions, timers, etc.
6. **Add error handling** - Gracefully handle edge cases
7. **Document your hooks** - Clear JSDoc comments
8. **Test thoroughly** - Unit test your custom hooks

### **❌ DON'T:**
1. **Make them too generic** - Avoid over-abstraction
2. **Forget dependencies** - Include all dependencies in useEffect
3. **Ignore performance** - Don't create unnecessary re-renders
4. **Skip error handling** - Always handle potential errors
5. **Make them stateful when unnecessary** - Sometimes a regular function is better

---

## 🚀 Real-World Custom Hook Examples

### **Shopping Cart Hook:**
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
  
  const total = useMemo(() =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  
  return { items, addItem, total, itemCount: items.length };
}
```

### **Authentication Hook:**
```javascript
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user
      verifyToken(token).then(setUser).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = useCallback(async (credentials) => {
    const { user, token } = await loginAPI(credentials);
    localStorage.setItem('token', token);
    setUser(user);
  }, []);
  
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);
  
  return { user, loading, login, logout, isAuthenticated: !!user };
}
```

---

## 🎯 Your Learning System

### **📚 Complete Materials Created:**

1. **📖 Comprehensive Concepts** - `customHooks-concepts.md`
   - What are custom hooks and why use them
   - Common patterns and best practices
   - Real-world examples and advanced techniques

2. **💻 Interactive Basics** - `CustomHooksBasics.jsx` (currently active)
   - Before/after comparisons
   - Interactive demos of basic hooks
   - Rules and best practices

3. **🏋️ Practice Exercises** - `CustomHooksPractice.jsx`
   - 6 real-world custom hooks to build
   - Timer, WindowSize, API, ShoppingCart, Form, InfiniteScroll
   - Complete requirements and implementation guides

### **🎮 Currently Active: CustomHooksBasics**

Your browser is showing the **custom hooks basics** which demonstrate:
- 🔄 **Before/After** - See the transformation from repeated logic to reusable hooks
- 🎮 **Interactive Demos** - Try useCounter, useToggle, useLocalStorage, useFetch
- 📋 **Rules & Best Practices** - Learn when and how to create custom hooks

---

## 🏆 Why Custom Hooks Make You a Pro

### **Junior Developer:**
- Uses built-in hooks (useState, useEffect)
- Repeats logic across components
- Focuses on making things work

### **Senior Developer:**
- Creates custom hooks for reusable logic
- Builds hook libraries for the team
- Focuses on maintainable, scalable code

### **Custom Hooks Enable:**
- **Code Reusability** - Write once, use everywhere
- **Separation of Concerns** - Business logic separate from UI
- **Easier Testing** - Test hooks independently
- **Team Collaboration** - Share hooks across projects
- **Maintainability** - Centralized logic updates

---

## 🎉 You're Ready to Become a Custom Hooks Master!

**What This Means:**
- ✅ You can **extract any reusable logic** into custom hooks
- ✅ You can **build hook libraries** for your team
- ✅ You can **write cleaner, more maintainable** React code
- ✅ You can **separate business logic from UI** effectively
- ✅ You have **professional-level React skills**

### **🚀 Next Steps:**
1. **Explore the basics** - Currently running in your browser
2. **Try the practice exercises** - Build 6 real-world custom hooks
3. **Create your own hooks** - Start with simple patterns
4. **Build a hook library** - Share reusable hooks across projects

**Custom hooks are where React development becomes truly powerful and enjoyable!** 🎊

---

**Ready to master the ultimate React skill? Your custom hooks journey starts now!** 🚀