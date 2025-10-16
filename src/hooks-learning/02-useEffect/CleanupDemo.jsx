import React, { useState, useEffect } from 'react';

/**
 * Cleanup Functions Demo
 * 
 * This component demonstrates when and how to use cleanup functions
 * in useEffect to prevent memory leaks and unwanted side effects.
 */

// Component that demonstrates event listener cleanup
const EventListenerDemo = ({ isActive }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    console.log('🎧 Adding event listeners...');

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setClickCount(prev => prev + 1);
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // ✅ CLEANUP: Remove event listeners
    return () => {
      console.log('🧹 Removing event listeners...');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [isActive]);

  if (!isActive) {
    return <div>Event listeners are inactive</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h4>Event Listener Demo</h4>
      <p>Mouse Position: ({mousePosition.x}, {mousePosition.y})</p>
      <p>Click Count: {clickCount}</p>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Move your mouse and click anywhere to see the tracking in action.
        Check console for cleanup logs.
      </p>
    </div>
  );
};

// Component that demonstrates timer cleanup
const TimerDemo = ({ isRunning }) => {
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (isRunning) {
      console.log('⏰ Starting timer...');

      const id = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);

      setIntervalId(id);

      // ✅ CLEANUP: Clear interval
      return () => {
        console.log('🛑 Clearing timer...');
        clearInterval(id);
      };
    }
  }, [isRunning]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h4>Timer Demo</h4>
      <p>Seconds: {seconds}</p>
      <p>Status: {isRunning ? 'Running' : 'Stopped'}</p>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Timer {isRunning ? 'is' : 'is not'} running.
        Check console for cleanup logs when toggling.
      </p>
    </div>
  );
};

// Component that demonstrates API request cleanup
const ApiRequestDemo = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    setUser(null);

    console.log(`🌐 Fetching user ${userId}...`);

    // Create AbortController for cleanup
    const abortController = new AbortController();

    const fetchUser = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check if request was aborted
        if (abortController.signal.aborted) {
          console.log('🚫 Request was aborted');
          return;
        }

        // Simulate API response
        const userData = {
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
          avatar: `https://ui-avatars.com/api/?name=User${userId}&background=007bff&color=fff`
        };

        setUser(userData);
        console.log(`✅ User ${userId} loaded successfully`);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          console.error('❌ Error fetching user:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // ✅ CLEANUP: Abort request if component unmounts or userId changes
    return () => {
      console.log(`🧹 Aborting request for user ${userId}...`);
      abortController.abort();
    };
  }, [userId]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h4>API Request Demo</h4>
      {loading && <p>Loading user {userId}...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {user && (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      <p style={{ fontSize: '12px', color: '#666' }}>
        Change user ID quickly to see request cancellation in action.
        Check console for cleanup logs.
      </p>
    </div>
  );
};

// Component that demonstrates subscription cleanup
const SubscriptionDemo = ({ isSubscribed }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!isSubscribed) return;

    console.log('📡 Subscribing to messages...');

    // Simulate subscription (like WebSocket or EventEmitter)
    const messageInterval = setInterval(() => {
      const message = {
        id: Date.now(),
        text: `Message at ${new Date().toLocaleTimeString()}`,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev.slice(-4), message]); // Keep last 5 messages
    }, 2000);

    // ✅ CLEANUP: Unsubscribe
    return () => {
      console.log('🔌 Unsubscribing from messages...');
      clearInterval(messageInterval);
    };
  }, [isSubscribed]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h4>Subscription Demo</h4>
      <p>Status: {isSubscribed ? 'Subscribed' : 'Not subscribed'}</p>
      <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            padding: '5px',
            margin: '2px 0',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {msg.text}
          </div>
        ))}
      </div>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Messages appear every 2 seconds when subscribed.
        Check console for cleanup logs.
      </p>
    </div>
  );
};

// Main demo component
const CleanupDemo = () => {
  const [eventListenersActive, setEventListenersActive] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#333',
      borderBottom: '2px solid #dc3545',
      paddingBottom: '10px',
      marginBottom: '30px'
    },
    section: {
      marginBottom: '30px'
    },
    controls: {
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
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
    activeButton: {
      backgroundColor: '#28a745'
    },
    inactiveButton: {
      backgroundColor: '#6c757d'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>useEffect Cleanup Functions Demo</h1>

      <div style={styles.section}>
        <h2>🎧 Event Listeners Cleanup</h2>
        <div style={styles.controls}>
          <button
            style={{
              ...styles.button,
              ...(eventListenersActive ? styles.activeButton : styles.inactiveButton)
            }}
            onClick={() => setEventListenersActive(!eventListenersActive)}
          >
            {eventListenersActive ? 'Deactivate' : 'Activate'} Event Listeners
          </button>
        </div>
        <EventListenerDemo isActive={eventListenersActive} />
      </div>

      <div style={styles.section}>
        <h2>⏰ Timer Cleanup</h2>
        <div style={styles.controls}>
          <button
            style={{
              ...styles.button,
              ...(timerRunning ? styles.activeButton : styles.inactiveButton)
            }}
            onClick={() => setTimerRunning(!timerRunning)}
          >
            {timerRunning ? 'Stop' : 'Start'} Timer
          </button>
        </div>
        <TimerDemo isRunning={timerRunning} />
      </div>

      <div style={styles.section}>
        <h2>🌐 API Request Cleanup</h2>
        <div style={styles.controls}>
          <button
            style={styles.button}
            onClick={() => setSelectedUserId(1)}
          >
            Load User 1
          </button>
          <button
            style={styles.button}
            onClick={() => setSelectedUserId(2)}
          >
            Load User 2
          </button>
          <button
            style={styles.button}
            onClick={() => setSelectedUserId(3)}
          >
            Load User 3
          </button>
          <button
            style={{ ...styles.button, backgroundColor: '#dc3545' }}
            onClick={() => setSelectedUserId(null)}
          >
            Clear
          </button>
        </div>
        <ApiRequestDemo userId={selectedUserId} />
      </div>

      <div style={styles.section}>
        <h2>📡 Subscription Cleanup</h2>
        <div style={styles.controls}>
          <button
            style={{
              ...styles.button,
              ...(subscriptionActive ? styles.activeButton : styles.inactiveButton)
            }}
            onClick={() => setSubscriptionActive(!subscriptionActive)}
          >
            {subscriptionActive ? 'Unsubscribe' : 'Subscribe'}
          </button>
        </div>
        <SubscriptionDemo isSubscribed={subscriptionActive} />
      </div>

      <div style={styles.section}>
        <h2>🎓 Key Takeaways</h2>
        <div style={{
          padding: '20px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px'
        }}>
          <h3>When to Use Cleanup:</h3>
          <ul>
            <li>✅ <strong>Event Listeners:</strong> Always remove to prevent memory leaks</li>
            <li>✅ <strong>Timers/Intervals:</strong> Clear to prevent multiple timers</li>
            <li>✅ <strong>API Requests:</strong> Cancel to avoid setting state on unmounted components</li>
            <li>✅ <strong>Subscriptions:</strong> Unsubscribe to prevent memory leaks</li>
          </ul>

          <h3>When NOT to Use Cleanup:</h3>
          <ul>
            <li>❌ Simple state updates</li>
            <li>❌ localStorage operations</li>
            <li>❌ One-time calculations</li>
            <li>❌ Console logs</li>
          </ul>

          <p><strong>💡 Pro Tip:</strong> Open your browser console to see cleanup logs in action!</p>
        </div>
      </div>
    </div>
  );
};

export default CleanupDemo;