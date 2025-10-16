import React, { useState, useEffect } from 'react';

/**
 * useEffect Hook - Complete Learning Example
 * 
 * useEffect handles side effects in functional components:
 * - Data fetching
 * - Subscriptions
 * - DOM manipulation
 * - Cleanup operations
 * 
 * Syntax: useEffect(callback, dependencies)
 */

const UseEffectExample = () => {
  // State for different examples
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 1. EFFECT WITH NO DEPENDENCIES - Runs on every render
  useEffect(() => {
    console.log('🔄 This runs on every render');
    document.title = `Count: ${count} | Name: ${name}`;
  });

  // 2. EFFECT WITH EMPTY DEPENDENCIES - Runs only once (componentDidMount)
  useEffect(() => {
    console.log('🚀 Component mounted - runs only once');
    
    // Simulate initial data loading
    const savedCount = localStorage.getItem('savedCount');
    if (savedCount) {
      setCount(parseInt(savedCount));
    }
  }, []); // Empty dependency array

  // 3. EFFECT WITH DEPENDENCIES - Runs when dependencies change
  useEffect(() => {
    console.log('📊 Count changed:', count);
    
    // Save count to localStorage whenever it changes
    localStorage.setItem('savedCount', count.toString());
  }, [count]); // Runs when count changes

  // 4. EFFECT WITH MULTIPLE DEPENDENCIES
  useEffect(() => {
    console.log('👤 User info changed:', { count, name });
    
    // Could trigger analytics or other side effects
    if (name && count > 0) {
      console.log(`User ${name} has clicked ${count} times`);
    }
  }, [count, name]); // Runs when either count or name changes

  // 5. EFFECT WITH CLEANUP - Prevents memory leaks
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    console.log('🎧 Resize listener added');

    // Cleanup function (componentWillUnmount equivalent)
    return () => {
      window.removeEventListener('resize', handleResize);
      console.log('🧹 Resize listener removed');
    };
  }, []); // Empty dependency - setup once, cleanup on unmount

  // 6. TIMER EFFECT WITH CLEANUP
  useEffect(() => {
    let interval;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
      console.log('⏰ Timer started');
    }

    return () => {
      if (interval) {
        clearInterval(interval);
        console.log('⏹️ Timer stopped');
      }
    };
  }, [isTimerRunning]); // Runs when timer state changes

  // 7. DATA FETCHING EFFECT
  useEffect(() => {
    const fetchUsers = async () => {
      if (count > 0 && count % 5 === 0) { // Fetch when count is multiple of 5
        setLoading(true);
        try {
          console.log('🌐 Fetching users...');
          
          // Simulate API call
          const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=3');
          const userData = await response.json();
          
          setUsers(userData);
          console.log('✅ Users fetched successfully');
        } catch (error) {
          console.error('❌ Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [count]); // Fetch when count changes

  // Event handlers
  const incrementCount = () => setCount(prev => prev + 1);
  const resetCount = () => setCount(0);
  const toggleTimer = () => setIsTimerRunning(prev => !prev);
  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    section: {
      marginBottom: '25px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    },
    title: {
      color: '#333',
      borderBottom: '2px solid #28a745',
      paddingBottom: '10px'
    },
    button: {
      padding: '8px 16px',
      margin: '5px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#28a745',
      color: 'white'
    },
    input: {
      padding: '8px',
      margin: '5px',
      border: '1px solid #ddd',
      borderRadius: '4px'
    },
    infoBox: {
      padding: '10px',
      backgroundColor: '#e7f3ff',
      border: '1px solid #b3d9ff',
      borderRadius: '4px',
      margin: '10px 0'
    },
    userCard: {
      padding: '10px',
      margin: '5px 0',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>useEffect Hook - Complete Examples</h1>

      {/* BASIC COUNTER WITH EFFECTS */}
      <div style={styles.section}>
        <h2>1. Basic Effects & Document Title</h2>
        <p>Count: <strong>{count}</strong></p>
        <button style={styles.button} onClick={incrementCount}>
          Increment Count
        </button>
        <button style={styles.button} onClick={resetCount}>
          Reset Count
        </button>
        
        <div style={styles.infoBox}>
          <strong>Effects Running:</strong>
          <ul>
            <li>Document title updates on every render</li>
            <li>Count is saved to localStorage when it changes</li>
            <li>Console logs show when effects run</li>
          </ul>
        </div>
      </div>

      {/* NAME INPUT */}
      <div style={styles.section}>
        <h2>2. Input with Effect Dependencies</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>Hello, <strong>{name || 'Anonymous'}</strong>!</p>
        
        <div style={styles.infoBox}>
          <strong>Effect Behavior:</strong> When both name and count have values, 
          a message is logged to console showing user interaction.
        </div>
      </div>

      {/* WINDOW RESIZE LISTENER */}
      <div style={styles.section}>
        <h2>3. Event Listener with Cleanup</h2>
        <p>Current window width: <strong>{windowWidth}px</strong></p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Try resizing your browser window to see the width update in real-time.
        </p>
        
        <div style={styles.infoBox}>
          <strong>Cleanup Demo:</strong> Resize event listener is added on mount 
          and removed on unmount to prevent memory leaks.
        </div>
      </div>

      {/* TIMER WITH CLEANUP */}
      <div style={styles.section}>
        <h2>4. Timer with Interval Cleanup</h2>
        <p>Timer: <strong>{timer} seconds</strong></p>
        <button 
          style={{
            ...styles.button, 
            backgroundColor: isTimerRunning ? '#dc3545' : '#28a745'
          }} 
          onClick={toggleTimer}
        >
          {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
        </button>
        <button style={styles.button} onClick={resetTimer}>
          Reset Timer
        </button>
        
        <div style={styles.infoBox}>
          <strong>Interval Management:</strong> Timer interval is created when started 
          and cleaned up when stopped or component unmounts.
        </div>
      </div>

      {/* DATA FETCHING */}
      <div style={styles.section}>
        <h2>5. Data Fetching Effect</h2>
        <p>Users will be fetched when count reaches multiples of 5 (5, 10, 15...)</p>
        <p>Current count: <strong>{count}</strong></p>
        
        {loading && (
          <div style={{ color: '#007bff' }}>
            🔄 Loading users...
          </div>
        )}
        
        {users.length > 0 && (
          <div>
            <h4>Fetched Users:</h4>
            {users.map(user => (
              <div key={user.id} style={styles.userCard}>
                <strong>{user.name}</strong> - {user.email}
              </div>
            ))}
          </div>
        )}
        
        <div style={styles.infoBox}>
          <strong>Async Effect:</strong> Data is fetched when count changes and meets 
          certain conditions. Loading state is managed during the fetch.
        </div>
      </div>

      {/* EFFECT PATTERNS */}
      <div style={styles.section}>
        <h2>🎓 useEffect Patterns & Best Practices</h2>
        
        <h3>Effect Types:</h3>
        <ul>
          <li><strong>No Dependencies:</strong> <code>useEffect(() =&gt; &#123;&#125;)</code> - Runs on every render</li>
          <li><strong>Empty Dependencies:</strong> <code>useEffect(() =&gt; &#123;&#125;, [])</code> - Runs once on mount</li>
          <li><strong>With Dependencies:</strong> <code>useEffect(() =&gt; &#123;&#125;, [dep1, dep2])</code> - Runs when dependencies change</li>
        </ul>
        
        <h3>Common Use Cases:</h3>
        <ul>
          <li>🌐 <strong>Data Fetching:</strong> API calls, loading external data</li>
          <li>🎧 <strong>Event Listeners:</strong> Window events, keyboard shortcuts</li>
          <li>⏰ <strong>Timers:</strong> Intervals, timeouts</li>
          <li>📊 <strong>Analytics:</strong> Tracking user interactions</li>
          <li>💾 <strong>Persistence:</strong> Saving to localStorage</li>
          <li>🎨 <strong>DOM Manipulation:</strong> Direct DOM updates</li>
        </ul>
        
        <h3>Cleanup Checklist:</h3>
        <ul>
          <li>✅ Remove event listeners</li>
          <li>✅ Clear intervals and timeouts</li>
          <li>✅ Cancel network requests</li>
          <li>✅ Unsubscribe from subscriptions</li>
        </ul>
      </div>

      {/* DEBUGGING TIPS */}
      <div style={styles.section}>
        <h2>🐛 Debugging Tips</h2>
        <ul>
          <li><strong>Console Logs:</strong> Add logs to see when effects run</li>
          <li><strong>React DevTools:</strong> Use Profiler to see effect timing</li>
          <li><strong>Dependency Array:</strong> Include all values used inside effect</li>
          <li><strong>ESLint Plugin:</strong> Use exhaustive-deps rule</li>
          <li><strong>Infinite Loops:</strong> Check dependency arrays carefully</li>
        </ul>
        
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <strong>Pro Tip:</strong> Open browser console to see effect logs in action!
        </div>
      </div>
    </div>
  );
};

export default UseEffectExample;