import React, { useState, useRef, useEffect } from 'react';

/**
 * useRef Hook - Complete Learning Example
 * 
 * This demonstrates useRef for:
 * 1. DOM element access and manipulation
 * 2. Storing mutable values without re-renders
 * 3. Previous values tracking
 * 4. Timer and interval management
 * 5. Focus management and form handling
 */

// Demo 1: Basic DOM Access
const DOMAccessDemo = () => {
  const inputRef = useRef(null);
  const [message, setMessage] = useState('');

  const focusInput = () => {
    inputRef.current.focus();
  };

  const clearInput = () => {
    inputRef.current.value = '';
    inputRef.current.focus();
  };

  const getInputValue = () => {
    setMessage(`Input value: "${inputRef.current.value}"`);
  };

  const selectAllText = () => {
    inputRef.current.select();
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #007bff', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>🎯 DOM Access with useRef</h2>

      <div style={{ marginBottom: '15px' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type something here..."
          style={{ padding: '8px', width: '250px', marginRight: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button onClick={focusInput} style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Focus Input
        </button>
        <button onClick={clearInput} style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
          Clear Input
        </button>
        <button onClick={getInputValue} style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          Get Value
        </button>
        <button onClick={selectAllText} style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}>
          Select All
        </button>
      </div>

      {message && (
        <div style={{ padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
          {message}
        </div>
      )}

      <div style={{ padding: '10px', backgroundColor: '#cce5ff', borderRadius: '4px', fontSize: '14px', marginTop: '10px' }}>
        <strong>useRef for DOM:</strong> Direct access to DOM elements without causing re-renders.
        Perfect for focus management, getting values, and DOM manipulation.
      </div>
    </div>
  );
};

// Demo 2: useRef vs useState comparison
const RefVsStateDemo = () => {
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);
  const [renderCount, setRenderCount] = useState(0);

  // Track renders
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  const incrementState = () => {
    setStateCount(prev => prev + 1);
  };

  const incrementRef = () => {
    refCount.current += 1;
    console.log('Ref count is now:', refCount.current);
  };

  const forceRender = () => {
    setRenderCount(prev => prev + 1);
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>⚖️ useRef vs useState Comparison</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h3>useState (Triggers Re-renders)</h3>
          <p>State Count: <strong>{stateCount}</strong></p>
          <button onClick={incrementState} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            Increment State
          </button>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
          <h3>useRef (No Re-renders)</h3>
          <p>Ref Count: <strong>{refCount.current}</strong></p>
          <button onClick={incrementRef} style={{ padding: '8px 16px', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px' }}>
            Increment Ref
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <p>Component Renders: <strong>{renderCount}</strong></p>
        <button onClick={forceRender} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
          Force Re-render
        </button>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px', fontSize: '14px' }}>
        <strong>Key Difference:</strong> useState triggers re-renders and updates the UI.
        useRef stores values without triggering re-renders. Check console for ref count updates!
      </div>
    </div>
  );
};

// Demo 3: Timer with useRef
const TimerDemo = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (!intervalRef.current) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const reset = () => {
    stop();
    setSeconds(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div style={{ padding: '20px', border: '2px solid #dc3545', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>⏰ Timer with useRef</h2>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: isRunning ? '#28a745' : '#6c757d' }}>
          {Math.floor(seconds / 60).toString().padStart(2, '0')}:
          {(seconds % 60).toString().padStart(2, '0')}
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Status: {isRunning ? 'Running' : 'Stopped'}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={start}
          disabled={isRunning}
          style={{
            padding: '10px 20px',
            margin: '5px',
            backgroundColor: isRunning ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          Start
        </button>
        <button
          onClick={stop}
          disabled={!isRunning}
          style={{
            padding: '10px 20px',
            margin: '5px',
            backgroundColor: !isRunning ? '#6c757d' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          Stop
        </button>
        <button
          onClick={reset}
          style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}
        >
          Reset
        </button>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
        <strong>useRef for Timers:</strong> Store interval ID in ref to persist across renders without causing re-renders.
        Essential for proper cleanup!
      </div>
    </div>
  );
};

// Demo 4: Previous Value Tracking
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const PreviousValueDemo = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('John');
  const prevCount = usePrevious(count);
  const prevName = usePrevious(name);

  return (
    <div style={{ padding: '20px', border: '2px solid #9c27b0', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>📊 Previous Value Tracking</h2>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <h3>Counter</h3>
          <p>Current Count: <strong>{count}</strong></p>
          <p>Previous Count: <strong>{prevCount ?? 'None'}</strong></p>
          <button
            onClick={() => setCount(count + 1)}
            style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Increment
          </button>
          <button
            onClick={() => setCount(count - 1)}
            style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Decrement
          </button>
        </div>

        <div>
          <h3>Name</h3>
          <p>Current Name: <strong>{name}</strong></p>
          <p>Previous Name: <strong>{prevName ?? 'None'}</strong></p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
          <button
            onClick={() => setName('')}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Clear
          </button>
        </div>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#f3e5f5', borderRadius: '4px', fontSize: '14px' }}>
        <strong>Previous Values:</strong> useRef persists values across renders.
        Perfect for comparing current vs previous values for animations, analytics, or conditional logic.
      </div>
    </div>
  );
};

// Demo 5: Focus Management Form
const FocusManagementDemo = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  // Refs for each input
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  // Focus first input on mount
  useEffect(() => {
    firstNameRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate and focus first error field
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      if (!Object.keys(newErrors).length) firstNameRef.current.focus();
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      if (Object.keys(newErrors).length === 1) lastNameRef.current.focus();
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      if (Object.keys(newErrors).length === 1) emailRef.current.focus();
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
      if (Object.keys(newErrors).length === 1) phoneRef.current.focus();
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
      setFormData({ firstName: '', lastName: '', email: '', phone: '' });
      firstNameRef.current.focus();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const clearForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '' });
    setErrors({});
    firstNameRef.current.focus();
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #fd7e14', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>📝 Focus Management Form</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>First Name:</label>
            <input
              ref={firstNameRef}
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              style={{
                padding: '8px',
                width: '100%',
                border: errors.firstName ? '2px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            {errors.firstName && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>{errors.firstName}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Last Name:</label>
            <input
              ref={lastNameRef}
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              style={{
                padding: '8px',
                width: '100%',
                border: errors.lastName ? '2px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            {errors.lastName && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>{errors.lastName}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
            <input
              ref={emailRef}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              style={{
                padding: '8px',
                width: '100%',
                border: errors.email ? '2px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            {errors.email && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>{errors.email}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone:</label>
            <input
              ref={phoneRef}
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              style={{
                padding: '8px',
                width: '100%',
                border: errors.phone ? '2px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            {errors.phone && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>{errors.phone}</div>}
          </div>
        </div>

        <div>
          <button
            type="submit"
            style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Submit Form
          </button>
          <button
            type="button"
            onClick={clearForm}
            style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Clear Form
          </button>
        </div>
      </form>

      <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
        <strong>Focus Management:</strong> useRef enables smart focus control - auto-focus on mount,
        focus first error field on validation, and programmatic focus management for better UX.
      </div>
    </div>
  );
};

// Main component
const UseRefExample = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#333',
      borderBottom: '2px solid #fd7e14',
      paddingBottom: '10px',
      marginBottom: '30px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>useRef Hook - DOM Access & Persistent Values</h1>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h2>🎯 What You'll Learn:</h2>
        <ul>
          <li><strong>DOM Access:</strong> Direct manipulation of DOM elements</li>
          <li><strong>Persistent Values:</strong> Store values without triggering re-renders</li>
          <li><strong>useRef vs useState:</strong> When to use which approach</li>
          <li><strong>Timer Management:</strong> Storing interval IDs and cleanup</li>
          <li><strong>Previous Values:</strong> Tracking changes across renders</li>
          <li><strong>Focus Management:</strong> Smart form focus control</li>
        </ul>
        <p><strong>💡 Pro Tip:</strong> useRef is perfect when you need to "remember" something without causing re-renders!</p>
      </div>

      <DOMAccessDemo />
      <RefVsStateDemo />
      <TimerDemo />
      <PreviousValueDemo />
      <FocusManagementDemo />

      <div style={{ padding: '20px', backgroundColor: '#d1ecf1', borderRadius: '8px', marginTop: '30px' }}>
        <h2>🎓 Key useRef Concepts</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
            <h3>✅ Use useRef For:</h3>
            <ul>
              <li>DOM element access and manipulation</li>
              <li>Storing timer IDs and intervals</li>
              <li>Previous values tracking</li>
              <li>Mutable values that don't trigger re-renders</li>
              <li>Focus management</li>
              <li>Third-party library integration</li>
            </ul>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
            <h3>❌ Don't Use useRef For:</h3>
            <ul>
              <li>Values that should trigger re-renders</li>
              <li>Values displayed in the UI</li>
              <li>State that affects component behavior</li>
              <li>Values that need to be reactive</li>
            </ul>
          </div>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h3>🔑 Remember:</h3>
          <ul>
            <li><strong>useRef returns an object</strong> with a `.current` property</li>
            <li><strong>Mutating .current doesn't trigger re-renders</strong></li>
            <li><strong>Refs persist across renders</strong> - perfect for timers and DOM elements</li>
            <li><strong>Always check if ref.current exists</strong> before using it</li>
            <li><strong>Use useEffect for DOM access</strong> - refs aren't set during initial render</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UseRefExample;