import React, { useState, useEffect } from 'react';

/**
 * Event Listener Explanation Demo
 * 
 * This demonstrates exactly how event listeners work with useEffect
 * and why the effect runs once but the handler runs multiple times.
 */

const EventListenerExplanation = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [effectRunCount, setEffectRunCount] = useState(0);
  const [handlerRunCount, setHandlerRunCount] = useState(0);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), { message, type, timestamp }]);
  };

  useEffect(() => {
    // This runs ONLY ONCE when component mounts
    setEffectRunCount(prev => prev + 1);
    addLog('🚀 useEffect is running!', 'effect');

    const handleResize = () => {
      // This runs EVERY TIME the window is resized
      setHandlerRunCount(prev => prev + 1);
      setWindowWidth(window.innerWidth);
      addLog(`📏 Window resized to ${window.innerWidth}px`, 'handler');
    };

    // Add event listener - this happens ONCE
    window.addEventListener('resize', handleResize);
    addLog('🎧 Event listener added to window', 'setup');

    // Cleanup function - runs ONCE when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      addLog('🧹 Event listener removed from window', 'cleanup');
    };
  }, []); // Empty dependency array = run only once

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
      marginBottom: '20px'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    statBox: {
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center',
      border: '2px solid'
    },
    effectBox: {
      backgroundColor: '#e3f2fd',
      borderColor: '#2196f3',
      color: '#1565c0'
    },
    handlerBox: {
      backgroundColor: '#f3e5f5',
      borderColor: '#9c27b0',
      color: '#7b1fa2'
    },
    windowBox: {
      backgroundColor: '#e8f5e8',
      borderColor: '#4caf50',
      color: '#2e7d32'
    },
    logContainer: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '15px',
      maxHeight: '300px',
      overflowY: 'auto'
    },
    logEntry: {
      padding: '5px 10px',
      margin: '2px 0',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'monospace'
    },
    effectLog: {
      backgroundColor: '#e3f2fd',
      color: '#1565c0'
    },
    handlerLog: {
      backgroundColor: '#f3e5f5',
      color: '#7b1fa2'
    },
    setupLog: {
      backgroundColor: '#e8f5e8',
      color: '#2e7d32'
    },
    cleanupLog: {
      backgroundColor: '#ffebee',
      color: '#c62828'
    },
    explanation: {
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Event Listener Explanation</h1>

      <div style={styles.statsContainer}>
        <div style={{ ...styles.statBox, ...styles.effectBox }}>
          <h3>useEffect Runs</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {effectRunCount}
          </div>
          <div style={{ fontSize: '12px' }}>Should be 1 (only once)</div>
        </div>

        <div style={{ ...styles.statBox, ...styles.handlerBox }}>
          <h3>Handler Runs</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {handlerRunCount}
          </div>
          <div style={{ fontSize: '12px' }}>Increases with each resize</div>
        </div>

        <div style={{ ...styles.statBox, ...styles.windowBox }}>
          <h3>Current Width</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {windowWidth}px
          </div>
          <div style={{ fontSize: '12px' }}>Updates on resize</div>
        </div>
      </div>

      <div style={styles.logContainer}>
        <h3>Event Log (Real-time)</h3>
        {logs.length === 0 ? (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            Resize your window to see the handler in action...
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                ...styles.logEntry,
                ...styles[`${log.type}Log`]
              }}
            >
              <span style={{ color: '#666' }}>[{log.timestamp}]</span> {log.message}
            </div>
          ))
        )}
      </div>

      <div style={styles.explanation}>
        <h3>🎓 How This Works:</h3>

        <h4>1. useEffect Runs Once (Empty Dependency Array)</h4>
        <ul>
          <li>When component mounts, useEffect executes</li>
          <li>It creates the <code>handleResize</code> function</li>
          <li>It adds the event listener to the window</li>
          <li>It returns a cleanup function</li>
        </ul>

        <h4>2. Event Listener "Watches" for Resize Events</h4>
        <ul>
          <li>The event listener is now registered with the browser</li>
          <li>It's waiting for resize events to happen</li>
          <li>When you resize, the browser calls <code>handleResize</code></li>
        </ul>

        <h4>3. Handler Function Runs on Each Resize</h4>
        <ul>
          <li>Each time you resize, <code>handleResize</code> executes</li>
          <li>It updates the state with new window width</li>
          <li>Component re-renders with new width</li>
          <li>But useEffect doesn't run again (empty dependency array)</li>
        </ul>

        <h4>🔑 Key Point:</h4>
        <p style={{
          backgroundColor: '#e7f3ff',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #b3d9ff'
        }}>
          <strong>useEffect sets up the event listener once.</strong><br />
          <strong>The event listener function runs every time the event occurs.</strong><br />
          These are two different things!
        </p>

        <h4>🧪 Try This:</h4>
        <ul>
          <li>Resize your browser window and watch the counters</li>
          <li>Notice: useEffect runs = 1, Handler runs = increases</li>
          <li>The window width updates because the handler runs, not because useEffect runs</li>
        </ul>
      </div>
    </div>
  );
};

export default EventListenerExplanation;