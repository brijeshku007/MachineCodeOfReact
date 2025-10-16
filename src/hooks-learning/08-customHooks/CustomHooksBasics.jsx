import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom Hooks Basics - Step by Step Learning
 * 
 * This demonstrates the fundamentals of custom hooks:
 * 1. What are custom hooks and why use them
 * 2. Building your first custom hook
 * 3. Common patterns and best practices
 * 4. Real-world examples
 */

// ===== CUSTOM HOOKS =====

// 1. Simple Counter Hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(prev => prev + 1), []);
  const decrement = useCallback(() => setCount(prev => prev - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
}

// 2. Toggle Hook
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(prev => !prev), []);

  return [value, toggle];
}

// 3. Local Storage Hook
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

// 4. Fetch Hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data based on URL
        const mockData = url.includes('users')
          ? [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }]
          : [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }];

        setData(mockData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// ===== DEMO COMPONENTS =====

// Demo 1: Before and After Custom Hooks
const BeforeAfterDemo = () => {
  return (
    <div style={{ padding: '20px', border: '2px solid #007bff', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>🔄 Before vs After Custom Hooks</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Before - Without Custom Hooks */}
        <div style={{ padding: '15px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <h3>❌ Before (Without Custom Hooks)</h3>
          <pre style={{ fontSize: '12px', backgroundColor: 'white', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
            {`function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// Same logic repeated in every component! 😫`}
          </pre>
        </div>

        {/* After - With Custom Hooks */}
        <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <h3>✅ After (With Custom Hooks)</h3>
          <pre style={{ fontSize: '12px', backgroundColor: 'white', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
            {`function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => 
    setCount(prev => prev + 1), []);
  const decrement = useCallback(() => 
    setCount(prev => prev - 1), []);
  const reset = useCallback(() => 
    setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset };
}

function Counter() {
  const counter = useCounter(0);
  
  return (
    <div>
      <p>Count: {counter.count}</p>
      <button onClick={counter.increment}>+</button>
      <button onClick={counter.decrement}>-</button>
      <button onClick={counter.reset}>Reset</button>
    </div>
  );
}

// Reusable logic! 🎉`}
          </pre>
        </div>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
        <strong>Benefits:</strong> Reusable logic, cleaner components, easier testing, and better separation of concerns!
      </div>
    </div>
  );
};

// Demo 2: Interactive Custom Hooks
const InteractiveDemo = () => {
  // Using our custom hooks
  const counter = useCounter(5);
  const [isVisible, toggleVisible] = useToggle(true);
  const [name, setName] = useLocalStorage('userName', '');
  const { data, loading, error } = useFetch(name ? '/api/users' : '');

  return (
    <div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>🎮 Interactive Custom Hooks Demo</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
        {/* Counter Hook */}
        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h3>🔢 useCounter Hook</h3>
          <p>Count: <strong>{counter.count}</strong></p>
          <button onClick={counter.increment} style={{ padding: '5px 10px', margin: '2px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>+</button>
          <button onClick={counter.decrement} style={{ padding: '5px 10px', margin: '2px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>-</button>
          <button onClick={counter.reset} style={{ padding: '5px 10px', margin: '2px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Reset</button>
        </div>

        {/* Toggle Hook */}
        <div style={{ padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
          <h3>🔄 useToggle Hook</h3>
          <p>Visible: <strong>{isVisible ? 'Yes' : 'No'}</strong></p>
          {isVisible && (
            <div style={{ padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px', marginBottom: '10px' }}>
              👋 Hello! I can be toggled!
            </div>
          )}
          <button onClick={toggleVisible} style={{ padding: '5px 10px', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px' }}>
            Toggle Visibility
          </button>
        </div>

        {/* LocalStorage Hook */}
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h3>💾 useLocalStorage Hook</h3>
          <p>Stored Name: <strong>{name || 'None'}</strong></p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{ padding: '5px', marginBottom: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <div style={{ fontSize: '12px', color: '#856404' }}>
            This value persists in localStorage!
          </div>
        </div>

        {/* Fetch Hook */}
        <div style={{ padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '4px' }}>
          <h3>🌐 useFetch Hook</h3>
          {!name ? (
            <p>Enter a name to trigger fetch</p>
          ) : loading ? (
            <p>🔄 Loading...</p>
          ) : error ? (
            <p style={{ color: '#dc3545' }}>❌ Error occurred</p>
          ) : (
            <div>
              <p>✅ Data loaded!</p>
              <div style={{ fontSize: '12px', backgroundColor: 'white', padding: '5px', borderRadius: '4px' }}>
                {data?.length} users found
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px', fontSize: '14px' }}>
        <strong>Try it:</strong> Interact with each hook to see how they work independently and can be reused across components!
      </div>
    </div>
  );
};

// Demo 3: Custom Hook Rules
const CustomHookRules = () => {
  return (
    <div style={{ padding: '20px', border: '2px solid #ffc107', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>📋 Custom Hook Rules & Best Practices</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h3>✅ Rules to Follow</h3>
          <ul style={{ fontSize: '14px' }}>
            <li><strong>Start with "use":</strong> useCounter, useFetch, useToggle</li>
            <li><strong>Can call other hooks:</strong> useState, useEffect, useCallback</li>
            <li><strong>Return anything:</strong> values, objects, arrays, functions</li>
            <li><strong>Keep them focused:</strong> One responsibility per hook</li>
            <li><strong>Handle cleanup:</strong> Clean up subscriptions and timers</li>
          </ul>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
          <h3>❌ Common Mistakes</h3>
          <ul style={{ fontSize: '14px' }}>
            <li><strong>Don't call conditionally:</strong> Always call hooks at top level</li>
            <li><strong>Don't make them too generic:</strong> Avoid over-abstraction</li>
            <li><strong>Don't forget dependencies:</strong> Include all deps in useEffect</li>
            <li><strong>Don't ignore performance:</strong> Use useCallback when needed</li>
            <li><strong>Don't skip error handling:</strong> Always handle potential errors</li>
          </ul>
        </div>
      </div>

      <div style={{ padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '4px', marginTop: '15px' }}>
        <h3>🎯 When to Create Custom Hooks</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', fontSize: '14px' }}>
          <div>
            <strong>Reusable Logic:</strong>
            <ul>
              <li>Used in multiple components</li>
              <li>Complex state patterns</li>
              <li>API integrations</li>
            </ul>
          </div>
          <div>
            <strong>Separation of Concerns:</strong>
            <ul>
              <li>Business logic vs UI</li>
              <li>Data fetching logic</li>
              <li>Form handling</li>
            </ul>
          </div>
          <div>
            <strong>Testing Benefits:</strong>
            <ul>
              <li>Isolated logic testing</li>
              <li>Easier mocking</li>
              <li>Better coverage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
const CustomHooksBasics = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#333',
      borderBottom: '2px solid #ffc107',
      paddingBottom: '10px',
      marginBottom: '30px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Custom Hooks - The Basics</h1>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h2>🎯 What Are Custom Hooks?</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Custom hooks are <strong>JavaScript functions that use other React hooks</strong> and allow you to
          <strong> extract and reuse stateful logic</strong> between components. They're the secret weapon
          of professional React developers!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' }}>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🔄</div>
            <strong>Reusable Logic</strong>
          </div>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🧹</div>
            <strong>Cleaner Components</strong>
          </div>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🧪</div>
            <strong>Easier Testing</strong>
          </div>
        </div>
      </div>

      <BeforeAfterDemo />
      <InteractiveDemo />
      <CustomHookRules />

      <div style={{ padding: '20px', backgroundColor: '#d1ecf1', borderRadius: '8px', marginTop: '30px' }}>
        <h2>🎉 You're Ready for Custom Hooks!</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Custom hooks are where React development becomes truly powerful. They allow you to:
        </p>
        <ul style={{ fontSize: '16px', lineHeight: '1.6' }}>
          <li><strong>Share logic</strong> between components without prop drilling</li>
          <li><strong>Separate concerns</strong> - keep business logic separate from UI</li>
          <li><strong>Test easily</strong> - test hooks independently from components</li>
          <li><strong>Build libraries</strong> - create reusable hook libraries for your team</li>
        </ul>

        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
          <strong>🚀 Next Steps:</strong> Try building your own custom hooks! Start with simple patterns like
          useCounter or useToggle, then move to more complex ones like useApi or useForm.
        </div>
      </div>
    </div>
  );
};

export default CustomHooksBasics;