import React, { useState } from 'react';

/**
 * useState Hook - Complete Learning Example
 * 
 * useState is the most fundamental hook for managing state in functional components.
 * It returns an array with two elements:
 * 1. Current state value
 * 2. Function to update the state
 */

const UseStateExample = () => {
  // 1. BASIC USAGE - Number State
  const [count, setCount] = useState(0);

  // 2. STRING STATE
  const [name, setName] = useState('');

  // 3. BOOLEAN STATE
  const [isVisible, setIsVisible] = useState(true);

  // 4. OBJECT STATE
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // 5. ARRAY STATE
  const [items, setItems] = useState(['Apple', 'Banana']);
  const [newItem, setNewItem] = useState('');

  // 6. MULTIPLE STATE VARIABLES
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Event Handlers
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  // Functional update (recommended for state that depends on previous state)
  const incrementFunctional = () => setCount(prevCount => prevCount + 1);

  // Object state update (spread operator to maintain immutability)
  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  // Array state operations
  const addItem = () => {
    if (newItem.trim()) {
      setItems(prevItems => [...prevItems, newItem]);
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  // Simulate async operation
  const simulateLoading = () => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      // Simulate random success/error
      if (Math.random() > 0.3) {
        setLoading(false);
        alert('Operation successful!');
      } else {
        setLoading(false);
        setError('Something went wrong!');
      }
    }, 2000);
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    section: {
      marginBottom: '30px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    },
    title: {
      color: '#333',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px'
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
    list: {
      listStyle: 'none',
      padding: 0
    },
    listItem: {
      padding: '8px',
      margin: '5px 0',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>useState Hook - Complete Examples</h1>

      {/* 1. BASIC COUNTER */}
      <div style={styles.section}>
        <h2>1. Basic Counter (Number State)</h2>
        <p>Current Count: <strong>{count}</strong></p>
        <button style={styles.button} onClick={increment}>
          Increment (+1)
        </button>
        <button style={styles.button} onClick={decrement}>
          Decrement (-1)
        </button>
        <button style={styles.button} onClick={incrementFunctional}>
          Functional Increment
        </button>
        <button style={styles.button} onClick={reset}>
          Reset
        </button>
        
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <strong>Key Learning:</strong> State updates are asynchronous. 
          Use functional updates when new state depends on previous state.
        </div>
      </div>

      {/* 2. STRING INPUT */}
      <div style={styles.section}>
        <h2>2. Text Input (String State)</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>Hello, <strong>{name || 'Anonymous'}</strong>!</p>
        <button style={styles.button} onClick={() => setName('')}>
          Clear Name
        </button>
      </div>

      {/* 3. BOOLEAN TOGGLE */}
      <div style={styles.section}>
        <h2>3. Visibility Toggle (Boolean State)</h2>
        <button style={styles.button} onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Hide' : 'Show'} Content
        </button>
        {isVisible && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e7f3ff' }}>
            <p>🎉 This content is conditionally rendered based on boolean state!</p>
          </div>
        )}
      </div>

      {/* 4. OBJECT STATE */}
      <div style={styles.section}>
        <h2>4. User Form (Object State)</h2>
        <div>
          <input
            style={styles.input}
            type="text"
            placeholder="First Name"
            value={user.firstName}
            onChange={(e) => updateUser('firstName', e.target.value)}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Last Name"
            value={user.lastName}
            onChange={(e) => updateUser('lastName', e.target.value)}
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => updateUser('email', e.target.value)}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <strong>User Info:</strong>
          <pre style={{ backgroundColor: 'white', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        <button 
          style={styles.button} 
          onClick={() => setUser({ firstName: '', lastName: '', email: '' })}
        >
          Clear Form
        </button>
      </div>

      {/* 5. ARRAY STATE */}
      <div style={styles.section}>
        <h2>5. Todo List (Array State)</h2>
        <div>
          <input
            style={styles.input}
            type="text"
            placeholder="Add new item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <button style={styles.button} onClick={addItem}>
            Add Item
          </button>
        </div>
        <ul style={styles.list}>
          {items.map((item, index) => (
            <li key={index} style={styles.listItem}>
              <span>{item}</span>
              <button 
                style={{...styles.button, backgroundColor: '#dc3545'}} 
                onClick={() => removeItem(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <p>Total items: <strong>{items.length}</strong></p>
      </div>

      {/* 6. LOADING & ERROR STATES */}
      <div style={styles.section}>
        <h2>6. Loading & Error States</h2>
        <button 
          style={styles.button} 
          onClick={simulateLoading}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Simulate Async Operation'}
        </button>
        
        {loading && (
          <div style={{ marginTop: '10px', color: '#007bff' }}>
            ⏳ Processing your request...
          </div>
        )}
        
        {error && (
          <div style={{ marginTop: '10px', color: '#dc3545', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px' }}>
            ❌ {error}
            <button 
              style={{...styles.button, marginLeft: '10px', backgroundColor: '#6c757d'}} 
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* KEY CONCEPTS */}
      <div style={styles.section}>
        <h2>🎓 Key useState Concepts</h2>
        <ul>
          <li><strong>State Initialization:</strong> useState(initialValue) - can be any data type</li>
          <li><strong>State Updates:</strong> Always use the setter function, never mutate state directly</li>
          <li><strong>Functional Updates:</strong> Use when new state depends on previous state</li>
          <li><strong>Object/Array Updates:</strong> Use spread operator to maintain immutability</li>
          <li><strong>Multiple State Variables:</strong> Use separate useState calls for unrelated state</li>
          <li><strong>Async Nature:</strong> State updates are asynchronous and may be batched</li>
        </ul>
      </div>
    </div>
  );
};

export default UseStateExample;