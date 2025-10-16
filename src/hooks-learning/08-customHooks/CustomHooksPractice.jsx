import React, { useState } from 'react';

/**
 * Custom Hooks Practice Exercises
 * 
 * Build these custom hooks to master the concepts:
 * 1. useTimer - Timer with start/stop/reset functionality
 * 2. useWindowSize - Track window dimensions
 * 3. useApi - Advanced API hook with caching
 * 4. useShoppingCart - Shopping cart management
 * 5. useForm - Form handling with validation
 * 6. useInfiniteScroll - Infinite scrolling functionality
 */

const CustomHooksPractice = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    section: {
      marginBottom: '30px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    },
    button: {
      padding: '8px 16px',
      margin: '5px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white'
    },
    input: {
      padding: '8px',
      margin: '5px',
      border: '1px solid #ddd',
      borderRadius: '4px'
    },
    codeBlock: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'monospace',
      border: '1px solid #e9ecef',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <h1>Custom Hooks Practice Exercises</h1>

      {/* Exercise 1: Timer Hook */}
      <div style={styles.section}>
        <h2>Exercise 1: useTimer Hook</h2>
        <p>Create a timer hook with start, stop, reset, and pause functionality:</p>

        <div style={styles.codeBlock}>
          {`// TODO: Implement useTimer hook
function useTimer(initialTime = 0) {
  // State: seconds, isRunning, isPaused
  // Functions: start, stop, pause, reset, setTime
  // Return: { seconds, isRunning, isPaused, start, stop, pause, reset, setTime }
}

// Usage example:
function TimerComponent() {
  const timer = useTimer(0);
  
  return (
    <div>
      <h3>Timer: {timer.seconds}s</h3>
      <button onClick={timer.start}>Start</button>
      <button onClick={timer.pause}>Pause</button>
      <button onClick={timer.stop}>Stop</button>
      <button onClick={timer.reset}>Reset</button>
    </div>
  );
}`}
        </div>

        <div style={{ marginTop: '15px' }}>
          <h4>Requirements:</h4>
          <ul>
            <li>Track elapsed time in seconds</li>
            <li>Start/stop/pause/reset functionality</li>
            <li>Handle cleanup on unmount</li>
            <li>Allow setting custom initial time</li>
          </ul>
        </div>

        <div style={{ color: '#666', fontStyle: 'italic', marginTop: '15px' }}>
          Your useTimer implementation and demo goes here...
        </div>
      </div>

      {/* Exercise 2: Window Size Hook */}
      <div style={styles.section}>
        <h2>Exercise 2: useWindowSize Hook</h2>
        <p>Create a hook that tracks window dimensions and provides responsive breakpoints:</p>

        <div style={styles.codeBlock}>
          {`// TODO: Implement useWindowSize hook
function useWindowSize() {
  // State: width, height
  // Computed: isMobile, isTablet, isDesktop
  // Return: { width, height, isMobile, isTablet, isDesktop }
}

// Usage example:
function ResponsiveComponent() {
  const { width, height, isMobile, isTablet, isDesktop } = useWindowSize();
  
  return (
    <div>
      <p>Window: {width} x {height}</p>
      <p>Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</p>
    </div>
  );
}`}
        </div>

        <div style={{ marginTop: '15px' }}>
          <h4>Requirements:</h4>
          <ul>
            <li>Track window width and height</li>
            <li>Provide breakpoint helpers (isMobile, isTablet, isDesktop)</li>
            <li>Debounce resize events for performance</li>
            <li>Handle cleanup properly</li>
          </ul>
        </div>

        <div style={{ color: '#666', fontStyle: 'italic', marginTop: '15px' }}>
          Your useWindowSize implementation and demo goes here...
        </div>
      </div>

      {/* Exercise 3: API Hook */}
      <div style={styles.section}>
        <h2>Exercise 3: useApi Hook</h2>
        <p>Build an advanced API hook with caching, retry logic, and request cancellation:</p>

        <div style={styles.codeBlock}>
          {`// TODO: Implement useApi hook
function useApi(baseUrl, options = {}) {
  // Options: cache, retryCount, timeout
  // Methods: get, post, put, delete
  // State management for each request
  // Return: { get, post, put, delete, clearCache }
}

// Usage example:
function UsersList() {
  const api = useApi('https://jsonplaceholder.typicode.com');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button onClick={fetchUsers}>Fetch Users</button>
      {loading ? <p>Loading...</p> : <p>{users.length} users loaded</p>}
    </div>
  );
}`}
        </div>

        <div style={{ marginTop: '15px' }}>
          <h4>Requirements:</h4>
          <ul>
            <li>Support GET, POST, PUT, DELETE methods</li>
            <li>Implement caching with expiration</li>
            <li>Add retry logic for failed requests</li>
            <li>Handle request cancellation</li>
            <li>Provide loading and error states</li>
          </ul>
        </div>

        <div style={{ color: '#666', fontStyle: 'italic', marginTop: '15px' }}>
          Your useApi implementation and demo goes here...
        </div>
      </div>

      {/* Exercise 4: Shopping Cart Hook */}
      <div style={styles.section}>
        <h2>Exercise 4: useShoppingCart Hook</h2>
        <p>Create a comprehensive shopping cart management hook:</p>

        <div style={styles.codeBlock}>
          {`// TODO: Implement useShoppingCart hook
function useShoppingCart() {
  // State: items, total, itemCount
  // Functions: addItem, removeItem, updateQuantity, clearCart
  // Persistence: localStorage integration
  // Return: { items, total, itemCount, addItem, removeItem, updateQuantity, clearCart }
}

// Usage example:
function ShoppingCart() {
  const cart = useShoppingCart();
  
  const product = { id: 1, name: 'T-Shirt', price: 25.99 };
  
  return (
    <div>
      <h3>Cart ({cart.itemCount} items) - Total: ${cart.total}</h3>
      <button onClick={() => cart.addItem(product)}>Add T-Shirt</button>
      <button onClick={cart.clearCart}>Clear Cart</button>
      
      {cart.items.map(item => (
        <div key={item.id}>
          {item.name} x {item.quantity} = ${item.price * item.quantity}
          <button onClick={() => cart.removeItem(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}`}
        </div>

        <div style={{ marginTop: '15px' }}>
          <h4>Requirements:</h4>
          <ul>
            <li>Add/remove items with quantity management</li>
            <li>Calculate total price and item count</li>
            <li>Persist cart data in localStorage</li>
            <li>Handle duplicate items (increase quantity)</li>
            <li>Provide cart summary information</li>
          </ul>
        </div>

        <div style={{ color: '#666', fontStyle: 'italic', marginTop: '15px' }}>
          Your useShoppingCart implementation and demo goes here...
        </div>
      </div>

      {/* Exercise 5: Form Hook */}
      <div style={styles.section}>
        <h2>Exercise 5: useForm Hook</h2>
        <p>Build a comprehensive form handling hook with validation:</p>

        <div style={styles.codeBlock}>
          {`// TODO: Implement useForm hook
function useForm(initialValues, validationSchema) {
  // State: values, errors, touched, isSubmitting
  // Functions: setValue, setError, validate, handleSubmit, reset
  // Return: { values, errors, touched, isSubmitting, setValue, handleSubmit, reset }
}

// Usage example:
function ContactForm() {
  const form = useForm(
    { name: '', email: '', message: '' },
    {
      name: { required: true, minLength: 2 },
      email: { required: true, pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ },
      message: { required: true, minLength: 10 }
    }
  );
  
  const onSubmit = async (data) => {
    console.log('Submitting:', data);
    // API call here
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input
        value={form.values.name}
        onChange={(e) => form.setValue('name', e.target.value)}
        placeholder="Name"
      />
      {form.errors.name && <span>{form.errors.name}</span>}
      
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}`}
        </div>

        <div style={{ marginTop: '15px' }}>
          <h4>Requirements:</h4>
          <ul>
            <li>Handle form values and validation</li>
            <li>Support multiple validation rules</li>
            <li>Track touched fields and submission state</li>
            <li>Provide easy field update methods</li>
            <li>Handle async form submission</li>
          </ul>
        </div>

        <div style={{ color: '#666', fontStyle: 'italic', marginTop: '15px' }}>
          Your useForm implementation and demo goes here...
        </div>
      </div>

      {/* Exercise 6: Infinite Scroll Hook */}
      <div style={styles.section}>
        <h2>Exercise 6: useInfiniteScroll Hook</h2>
        <p>Create an infinite scrolling hook for loading data as user scrolls:</p>

        <div style={styles.codeBlock}>
          {`// TODO: Implement useInfiniteScroll hook
function useInfiniteScroll(fetchMore, hasMore, threshold = 100) {
  // State: loading, error
  // Logic: scroll detection, automatic loading
  // Return: { loading, error }
}

// Usage example:
function InfiniteList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchMore = async () => {
    const newItems = await fetchItemsFromAPI(page);
    setItems(prev => [...prev, ...newItems]);
    setPage(prev => prev + 1);
    setHasMore(newItems.length > 0);
  };
  
  const { loading } = useInfiniteScroll(fetchMore, hasMore);
  
  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      {loading && <div>Loading more...</div>}
    </div>
  );
}`}
        </div>

        <div style={{ marginTop: '15px' }}>
          <h4>Requirements:</h4>
          <ul>
            <li>Detect when user scrolls near bottom</li>
            <li>Automatically trigger data loading</li>
            <li>Handle loading states and errors</li>
            <li>Configurable scroll threshold</li>
            <li>Prevent multiple simultaneous requests</li>
          </ul>
        </div>

        <div style={{ color: '#666', fontStyle: 'italic', marginTop: '15px' }}>
          Your useInfiniteScroll implementation and demo goes here...
        </div>
      </div>

      {/* Implementation Tips */}
      <div style={styles.section}>
        <h3>💡 Implementation Tips:</h3>
        <ul>
          <li><strong>Start Simple:</strong> Begin with basic functionality, then add features</li>
          <li><strong>Use useCallback:</strong> Memoize functions to prevent unnecessary re-renders</li>
          <li><strong>Handle Cleanup:</strong> Always clean up timers, listeners, and subscriptions</li>
          <li><strong>Error Handling:</strong> Gracefully handle edge cases and errors</li>
          <li><strong>TypeScript:</strong> Consider adding TypeScript for better developer experience</li>
          <li><strong>Testing:</strong> Write tests for your custom hooks using React Testing Library</li>
        </ul>

        <h3>🎯 Learning Goals:</h3>
        <ul>
          <li>Master custom hook creation patterns</li>
          <li>Understand hook composition and reusability</li>
          <li>Learn to separate business logic from UI components</li>
          <li>Practice real-world hook scenarios</li>
          <li>Build a library of reusable hooks</li>
        </ul>

        <h3>🧪 Testing Your Hooks:</h3>
        <div style={styles.codeBlock}>
          {`import { renderHook, act } from '@testing-library/react-hooks';

test('useCounter should increment', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});`}
        </div>
      </div>
    </div>
  );
};

export default CustomHooksPractice;