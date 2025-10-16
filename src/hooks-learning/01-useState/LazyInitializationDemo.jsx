import React, { useState } from 'react';

/**
 * Lazy Initial State Demo
 * 
 * This component demonstrates the difference between regular initialization
 * and lazy initialization for performance optimization.
 */

// Simulate expensive operations
const expensiveCalculation = () => {
  console.log('🐌 Expensive calculation running...');
  const start = Date.now();
  
  // Simulate heavy computation (100ms delay)
  while (Date.now() - start < 100) {
    // Busy wait to simulate expensive operation
  }
  
  return {
    result: Math.floor(Math.random() * 1000),
    timestamp: Date.now(),
    computationTime: Date.now() - start
  };
};

const readFromLocalStorage = () => {
  console.log('💾 Reading from localStorage...');
  
  // Simulate localStorage read
  const saved = localStorage.getItem('demoData');
  if (saved) {
    return JSON.parse(saved);
  }
  
  return {
    name: 'Default User',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true
    },
    lastLogin: new Date().toISOString()
  };
};

const createComplexObject = () => {
  console.log('🏗️ Creating complex object...');
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    metadata: {
      created: new Date().toISOString(),
      version: '1.0.0',
      features: ['feature1', 'feature2', 'feature3']
    },
    settings: {
      advanced: {
        caching: true,
        compression: false,
        debugging: process.env.NODE_ENV === 'development'
      }
    }
  };
};

// Component with BAD initialization (runs on every render)
const BadInitializationExample = () => {
  console.log('🔴 BadInitializationExample rendering...');
  
  // ❌ These run on EVERY render
  const [expensiveData, setExpensiveData] = useState(expensiveCalculation());
  const [userData, setUserData] = useState(readFromLocalStorage());
  const [complexObj, setComplexObj] = useState(createComplexObject());
  
  const [renderCount, setRenderCount] = useState(0);

  const styles = {
    container: {
      padding: '20px',
      border: '2px solid #dc3545',
      borderRadius: '8px',
      backgroundColor: '#f8d7da',
      marginBottom: '20px'
    },
    button: {
      padding: '8px 16px',
      margin: '5px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#dc3545',
      color: 'white'
    }
  };

  return (
    <div style={styles.container}>
      <h3>❌ Bad Example - Regular Initialization</h3>
      <p><strong>Render Count:</strong> {renderCount}</p>
      <p><strong>Expensive Result:</strong> {expensiveData.result}</p>
      <p><strong>User Name:</strong> {userData.name}</p>
      <p><strong>Object ID:</strong> {complexObj.id}</p>
      
      <button 
        style={styles.button}
        onClick={() => setRenderCount(prev => prev + 1)}
      >
        Force Re-render (Check Console!)
      </button>
      
      <div style={{ fontSize: '12px', marginTop: '10px', color: '#721c24' }}>
        <strong>Problem:</strong> All initialization functions run on every render!
        Check the console to see the logs.
      </div>
    </div>
  );
};

// Component with GOOD initialization (runs only once)
const GoodInitializationExample = () => {
  console.log('🟢 GoodInitializationExample rendering...');
  
  // ✅ These run ONLY on initial render
  const [expensiveData, setExpensiveData] = useState(() => expensiveCalculation());
  const [userData, setUserData] = useState(() => readFromLocalStorage());
  const [complexObj, setComplexObj] = useState(() => createComplexObject());
  
  const [renderCount, setRenderCount] = useState(0);

  const styles = {
    container: {
      padding: '20px',
      border: '2px solid #28a745',
      borderRadius: '8px',
      backgroundColor: '#d4edda',
      marginBottom: '20px'
    },
    button: {
      padding: '8px 16px',
      margin: '5px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#28a745',
      color: 'white'
    }
  };

  return (
    <div style={styles.container}>
      <h3>✅ Good Example - Lazy Initialization</h3>
      <p><strong>Render Count:</strong> {renderCount}</p>
      <p><strong>Expensive Result:</strong> {expensiveData.result}</p>
      <p><strong>User Name:</strong> {userData.name}</p>
      <p><strong>Object ID:</strong> {complexObj.id}</p>
      
      <button 
        style={styles.button}
        onClick={() => setRenderCount(prev => prev + 1)}
      >
        Force Re-render (Check Console!)
      </button>
      
      <div style={{ fontSize: '12px', marginTop: '10px', color: '#155724' }}>
        <strong>Optimization:</strong> Initialization functions run only once!
        Notice no console logs on re-renders.
      </div>
    </div>
  );
};

// Main demo component
const LazyInitializationDemo = () => {
  const [showBad, setShowBad] = useState(true);
  const [showGood, setShowGood] = useState(true);

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#333',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px',
      marginBottom: '30px'
    },
    toggleButton: {
      padding: '8px 16px',
      margin: '5px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white'
    },
    explanation: {
      padding: '20px',
      backgroundColor: '#e7f3ff',
      border: '1px solid #b3d9ff',
      borderRadius: '8px',
      marginBottom: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>useState Lazy Initialization Demo</h1>
      
      <div style={styles.explanation}>
        <h3>🎯 What This Demo Shows:</h3>
        <ul>
          <li><strong>Performance Impact:</strong> See the difference in console logs</li>
          <li><strong>When to Use:</strong> Expensive calculations, localStorage reads, complex objects</li>
          <li><strong>How to Fix:</strong> Wrap initialization in arrow function</li>
        </ul>
        
        <h4>📝 Instructions:</h4>
        <ol>
          <li>Open browser console (F12)</li>
          <li>Click "Force Re-render" buttons</li>
          <li>Compare console output between bad and good examples</li>
          <li>Notice how bad example logs on every render, good example doesn't</li>
        </ol>
      </div>

      <div>
        <button 
          style={styles.toggleButton}
          onClick={() => setShowBad(!showBad)}
        >
          {showBad ? 'Hide' : 'Show'} Bad Example
        </button>
        <button 
          style={styles.toggleButton}
          onClick={() => setShowGood(!showGood)}
        >
          {showGood ? 'Hide' : 'Show'} Good Example
        </button>
      </div>

      {showBad && <BadInitializationExample />}
      {showGood && <GoodInitializationExample />}

      <div style={styles.explanation}>
        <h3>🔑 Key Takeaways:</h3>
        <ul>
          <li><strong>Regular:</strong> <code>useState(expensiveFunction())</code> - Runs every render</li>
          <li><strong>Lazy:</strong> <code>useState(() =&gt; expensiveFunction())</code> - Runs once</li>
          <li><strong>Use When:</strong> Initial state requires expensive computation</li>
          <li><strong>Performance:</strong> Prevents unnecessary work on re-renders</li>
        </ul>
      </div>
    </div>
  );
};

export default LazyInitializationDemo;