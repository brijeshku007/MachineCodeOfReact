import React, { useState, useEffect } from 'react';

/**
 * Debounced Effects Demo
 * 
 * This demonstrates how to use debouncing with useEffect to optimize
 * performance for search inputs, auto-save, and other expensive operations.
 */

// Basic debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    console.log(`⏱️ Setting up debounce timer for: "${value}"`);

    const timer = setTimeout(() => {
      console.log(`✅ Debounce timer fired for: "${value}"`);
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Clear timer if value changes before delay
    return () => {
      console.log(`🧹 Clearing debounce timer for: "${value}"`);
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Advanced debounced effect hook
function useDebouncedEffect(callback, dependencies, delay) {
  useEffect(() => {
    console.log(`⏱️ Setting up debounced effect timer`);

    const timer = setTimeout(() => {
      console.log(`✅ Debounced effect executing`);
      callback();
    }, delay);

    return () => {
      console.log(`🧹 Clearing debounced effect timer`);
      clearTimeout(timer);
    };
  }, [...dependencies, delay]);
}

// Search component with debouncing
const SearchDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  // Debounce search term by 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Mock search data
  const mockData = [
    'React Hooks', 'useState', 'useEffect', 'useContext', 'useReducer',
    'useCallback', 'useMemo', 'useRef', 'Custom Hooks', 'JavaScript',
    'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL'
  ];

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      setSearchCount(prev => prev + 1);

      console.log(`🔍 Searching for: "${debouncedSearchTerm}"`);

      // Simulate API call
      setTimeout(() => {
        const filteredResults = mockData.filter(item =>
          item.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        setResults(filteredResults);
        setLoading(false);
        console.log(`✅ Search completed for: "${debouncedSearchTerm}"`);
      }, 1000);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [debouncedSearchTerm]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Search with Debouncing</h3>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Search for technologies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '300px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
        <div>Current input: "{searchTerm}"</div>
        <div>Debounced value: "{debouncedSearchTerm}"</div>
        <div>Search count: {searchCount}</div>
      </div>

      {loading && (
        <div style={{ color: '#007bff', marginBottom: '10px' }}>
          🔍 Searching...
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h4>Results ({results.length}):</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((result, index) => (
              <li key={index} style={{
                padding: '8px',
                margin: '4px 0',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #e9ecef'
              }}>
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchTerm && !loading && results.length === 0 && (
        <div style={{ color: '#6c757d', fontStyle: 'italic' }}>
          No results found for "{debouncedSearchTerm}"
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>How it works:</strong> Search only happens 500ms after you stop typing.
        Check console to see debounce timing logs.
      </div>
    </div>
  );
};

// Auto-save demo
const AutoSaveDemo = () => {
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved');
  const [saveCount, setSaveCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);

  // Auto-save 2 seconds after user stops typing
  useDebouncedEffect(() => {
    if (content.trim()) {
      setSaveStatus('saving');
      console.log(`💾 Auto-saving content: "${content.substring(0, 20)}..."`);

      // Simulate save operation
      setTimeout(() => {
        setSaveCount(prev => prev + 1);
        setLastSaved(new Date().toLocaleTimeString());
        setSaveStatus('saved');
        console.log(`✅ Content saved successfully`);
      }, 1000);
    }
  }, [content], 2000);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (saveStatus === 'saved') {
      setSaveStatus('unsaved');
    }
  };

  const getStatusColor = () => {
    switch (saveStatus) {
      case 'saved': return '#28a745';
      case 'saving': return '#007bff';
      case 'unsaved': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saved': return '✅';
      case 'saving': return '⏳';
      case 'unsaved': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Auto-save with Debouncing</h3>

      <div style={{ marginBottom: '15px' }}>
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing to see auto-save in action..."
          style={{
            width: '100%',
            height: '120px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '8px 12px',
          backgroundColor: getStatusColor(),
          color: 'white',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {getStatusIcon()} Status: {saveStatus}
        </div>
      </div>

      <div style={{ fontSize: '14px', color: '#666' }}>
        <div>Characters: {content.length}</div>
        <div>Save count: {saveCount}</div>
        {lastSaved && <div>Last saved: {lastSaved}</div>}
      </div>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>How it works:</strong> Content is automatically saved 2 seconds after you stop typing.
        Check console to see auto-save timing logs.
      </div>
    </div>
  );
};

// Window resize demo
const ResizeDemo = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [resizeCount, setResizeCount] = useState(0);

  useEffect(() => {
    let resizeTimer;

    const handleResize = () => {
      // Clear existing timer
      clearTimeout(resizeTimer);

      // Set new timer (debounce)
      resizeTimer = setTimeout(() => {
        console.log('📏 Window resized, updating size');
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
        setResizeCount(prev => prev + 1);
      }, 250);
    };

    console.log('🎧 Adding resize listener');
    window.addEventListener('resize', handleResize);

    return () => {
      console.log('🧹 Removing resize listener and clearing timer');
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Window Resize with Debouncing</h3>

      <div style={{
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        marginBottom: '15px'
      }}>
        <div><strong>Window Size:</strong> {windowSize.width} × {windowSize.height}</div>
        <div><strong>Resize Events:</strong> {resizeCount}</div>
      </div>

      <div style={{ fontSize: '12px', color: '#666' }}>
        <strong>How it works:</strong> Window size is updated 250ms after you stop resizing.
        Try resizing your browser window and check the console for logs.
      </div>
    </div>
  );
};

// Performance comparison demo
const PerformanceComparisonDemo = () => {
  const [input, setInput] = useState('');
  const [immediateCount, setImmediateCount] = useState(0);
  const [debouncedCount, setDebouncedCount] = useState(0);

  const debouncedInput = useDebounce(input, 300);

  // Immediate effect (runs on every keystroke)
  useEffect(() => {
    if (input) {
      setImmediateCount(prev => prev + 1);
      console.log(`🔥 Immediate effect: ${immediateCount + 1}`);
    }
  }, [input]);

  // Debounced effect (runs only after user stops typing)
  useEffect(() => {
    if (debouncedInput) {
      setDebouncedCount(prev => prev + 1);
      console.log(`⏱️ Debounced effect: ${debouncedCount + 1}`);
    }
  }, [debouncedInput]);

  const resetCounters = () => {
    setInput('');
    setImmediateCount(0);
    setDebouncedCount(0);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Performance Comparison</h3>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Type to see the difference..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: '300px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <button
          onClick={resetCounters}
          style={{
            marginLeft: '10px',
            padding: '10px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          flex: 1
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#c62828' }}>❌ Without Debouncing</h4>
          <div>Effect runs: <strong>{immediateCount}</strong> times</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Runs on every keystroke</div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#e8f5e8',
          borderRadius: '4px',
          flex: 1
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>✅ With Debouncing</h4>
          <div>Effect runs: <strong>{debouncedCount}</strong> times</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Runs 300ms after stopping</div>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#666' }}>
        <strong>Try this:</strong> Type "Hello World" quickly and see the difference in effect counts.
        The debounced version will run far fewer times, saving performance!
      </div>
    </div>
  );
};

// Main demo component
const DebounceDemo = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#333',
      borderBottom: '2px solid #ffc107',
      paddingBottom: '10px',
      marginBottom: '30px'
    },
    section: {
      marginBottom: '30px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Debounced Effects Demo</h1>

      <div style={styles.section}>
        <SearchDemo />
      </div>

      <div style={styles.section}>
        <AutoSaveDemo />
      </div>

      <div style={styles.section}>
        <ResizeDemo />
      </div>

      <div style={styles.section}>
        <PerformanceComparisonDemo />
      </div>

      <div style={styles.section}>
        <div style={{
          padding: '20px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px'
        }}>
          <h3>🎓 Key Benefits of Debouncing:</h3>
          <ul>
            <li><strong>Performance:</strong> Reduces expensive operations (API calls, calculations)</li>
            <li><strong>User Experience:</strong> Prevents lag from excessive updates</li>
            <li><strong>Network Efficiency:</strong> Fewer API requests save bandwidth</li>
            <li><strong>Battery Life:</strong> Less processing on mobile devices</li>
            <li><strong>Server Load:</strong> Reduces stress on backend systems</li>
          </ul>

          <h3>🎯 Common Use Cases:</h3>
          <ul>
            <li>Search inputs and autocomplete</li>
            <li>Auto-save functionality</li>
            <li>Window resize handlers</li>
            <li>Form validation</li>
            <li>API calls triggered by user input</li>
          </ul>

          <p><strong>💡 Pro Tip:</strong> Open console to see detailed timing logs for all debounce operations!</p>
        </div>
      </div>
    </div>
  );
};

export default DebounceDemo;