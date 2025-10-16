import React, { useState, useEffect } from 'react';

/**
 * Custom Data Fetching Hook Demo
 * 
 * This demonstrates how to create and use custom hooks for data fetching
 * with features like caching, retry logic, and proper cleanup.
 */

// Simple cache for API responses
const apiCache = new Map();

// Basic data fetching hook
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    setLoading(true);
    setError(null);

    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        console.log(`🌐 Fetching: ${url}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate different responses based on URL
        let result;
        if (url.includes('/users')) {
          result = {
            users: [
              { id: 1, name: 'John Doe', email: 'john@example.com' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
              { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
            ]
          };
        } else if (url.includes('/posts')) {
          result = {
            posts: [
              { id: 1, title: 'First Post', content: 'This is the first post' },
              { id: 2, title: 'Second Post', content: 'This is the second post' }
            ]
          };
        } else {
          throw new Error('Unknown endpoint');
        }

        if (abortController.signal.aborted) return;

        setData(result);
        console.log(`✅ Data loaded: ${url}`);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          console.error(`❌ Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, loading, error };
}

// Advanced data fetching hook with caching and retry
function useApiWithCache(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    enableCache = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retryCount = 2,
    retryDelay = 1000
  } = options;

  useEffect(() => {
    if (!url) return;

    setLoading(true);
    setError(null);

    // Check cache first
    if (enableCache && apiCache.has(url)) {
      const cached = apiCache.get(url);
      const isExpired = Date.now() - cached.timestamp > cacheTime;

      if (!isExpired) {
        console.log(`💾 Using cached data: ${url}`);
        setData(cached.data);
        setLoading(false);
        return;
      } else {
        console.log(`⏰ Cache expired: ${url}`);
        apiCache.delete(url);
      }
    }

    const abortController = new AbortController();
    let retryAttempt = 0;

    const fetchWithRetry = async () => {
      try {
        console.log(`🌐 Fetching (attempt ${retryAttempt + 1}): ${url}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate random failures for retry demo
        if (Math.random() < 0.3 && retryAttempt === 0) {
          throw new Error('Network error (simulated)');
        }

        // Simulate API response
        let result;
        if (url.includes('/users')) {
          result = {
            users: [
              { id: 1, name: 'Alice Wilson', email: 'alice@example.com' },
              { id: 2, name: 'Charlie Brown', email: 'charlie@example.com' }
            ],
            cached: false,
            timestamp: new Date().toISOString()
          };
        } else if (url.includes('/posts')) {
          result = {
            posts: [
              { id: 1, title: 'Advanced React Hooks', content: 'Learn about useEffect...' },
              { id: 2, title: 'State Management', content: 'Managing complex state...' }
            ],
            cached: false,
            timestamp: new Date().toISOString()
          };
        }

        if (abortController.signal.aborted) return;

        // Cache the result
        if (enableCache) {
          apiCache.set(url, {
            data: result,
            timestamp: Date.now()
          });
          console.log(`💾 Data cached: ${url}`);
        }

        setData(result);
        setLoading(false);
        console.log(`✅ Data loaded: ${url}`);

      } catch (err) {
        if (err.name === 'AbortError') return;

        // Retry logic
        if (retryAttempt < retryCount) {
          retryAttempt++;
          console.log(`🔄 Retrying... Attempt ${retryAttempt + 1}`);
          setTimeout(fetchWithRetry, retryDelay * retryAttempt);
        } else {
          setError(err.message);
          setLoading(false);
          console.error(`❌ Final error: ${err.message}`);
        }
      }
    };

    fetchWithRetry();

    return () => {
      abortController.abort();
    };
  }, [url, enableCache, cacheTime, retryCount, retryDelay]);

  // Manual refetch function
  const refetch = () => {
    if (enableCache) {
      apiCache.delete(url);
    }
    setLoading(true);
    setError(null);
  };

  return { data, loading, error, refetch };
}

// Component using basic hook
const BasicApiDemo = () => {
  const [endpoint, setEndpoint] = useState('');
  const { data, loading, error } = useApi(endpoint);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Basic API Hook</h3>

      <div style={{ marginBottom: '15px' }}>
        <button
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          onClick={() => setEndpoint('/api/users')}
        >
          Load Users
        </button>
        <button
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          onClick={() => setEndpoint('/api/posts')}
        >
          Load Posts
        </button>
        <button
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
          onClick={() => setEndpoint('')}
        >
          Clear
        </button>
      </div>

      {loading && <div style={{ color: '#007bff' }}>Loading...</div>}
      {error && <div style={{ color: '#dc3545' }}>Error: {error}</div>}
      {data && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
          <pre style={{ margin: 0, fontSize: '12px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Component using advanced hook with caching
const AdvancedApiDemo = () => {
  const [endpoint, setEndpoint] = useState('');
  const { data, loading, error, refetch } = useApiWithCache(endpoint, {
    enableCache: true,
    cacheTime: 10000, // 10 seconds for demo
    retryCount: 2,
    retryDelay: 1000
  });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Advanced API Hook (with Caching & Retry)</h3>

      <div style={{ marginBottom: '15px' }}>
        <button
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          onClick={() => setEndpoint('/api/users')}
        >
          Load Users
        </button>
        <button
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          onClick={() => setEndpoint('/api/posts')}
        >
          Load Posts
        </button>
        <button
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}
          onClick={refetch}
          disabled={!endpoint || loading}
        >
          Refetch
        </button>
        <button
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
          onClick={() => setEndpoint('')}
        >
          Clear
        </button>
      </div>

      {loading && <div style={{ color: '#007bff' }}>Loading...</div>}
      {error && (
        <div style={{ color: '#dc3545' }}>
          Error: {error}
          <button
            style={{ marginLeft: '10px', padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
            onClick={refetch}
          >
            Retry
          </button>
        </div>
      )}
      {data && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
          <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
            Loaded at: {data.timestamp} | Cached: {data.cached ? 'Yes' : 'No'}
          </div>
          <pre style={{ margin: 0, fontSize: '12px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>Features:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Automatic caching (10 seconds for demo)</li>
          <li>Retry on failure (up to 2 retries)</li>
          <li>Manual refetch capability</li>
          <li>Request cancellation on cleanup</li>
        </ul>
      </div>
    </div>
  );
};

// Cache inspector component
const CacheInspector = () => {
  const [cacheEntries, setCacheEntries] = useState([]);

  useEffect(() => {
    const updateCache = () => {
      const entries = Array.from(apiCache.entries()).map(([url, data]) => ({
        url,
        timestamp: new Date(data.timestamp).toLocaleTimeString(),
        age: Math.round((Date.now() - data.timestamp) / 1000),
        data: data.data
      }));
      setCacheEntries(entries);
    };

    updateCache();
    const interval = setInterval(updateCache, 1000);

    return () => clearInterval(interval);
  }, []);

  const clearCache = () => {
    apiCache.clear();
    setCacheEntries([]);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Cache Inspector</h3>

      <button
        style={{ padding: '8px 16px', marginBottom: '15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        onClick={clearCache}
      >
        Clear Cache
      </button>

      {cacheEntries.length === 0 ? (
        <div style={{ color: '#666', fontStyle: 'italic' }}>Cache is empty</div>
      ) : (
        <div>
          {cacheEntries.map((entry, index) => (
            <div key={index} style={{
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              <div><strong>URL:</strong> {entry.url}</div>
              <div><strong>Cached at:</strong> {entry.timestamp} ({entry.age}s ago)</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main demo component
const DataFetchingDemo = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#333',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px',
      marginBottom: '30px'
    },
    section: {
      marginBottom: '30px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Custom Data Fetching Hooks Demo</h1>

      <div style={styles.section}>
        <BasicApiDemo />
      </div>

      <div style={styles.section}>
        <AdvancedApiDemo />
      </div>

      <div style={styles.section}>
        <CacheInspector />
      </div>

      <div style={styles.section}>
        <div style={{
          padding: '20px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px'
        }}>
          <h3>🎓 Key Features Demonstrated:</h3>
          <ul>
            <li><strong>Basic Hook:</strong> Simple data fetching with loading/error states</li>
            <li><strong>Advanced Hook:</strong> Caching, retry logic, manual refetch</li>
            <li><strong>Request Cancellation:</strong> Prevents memory leaks on unmount</li>
            <li><strong>Cache Management:</strong> Automatic expiration and manual clearing</li>
            <li><strong>Error Handling:</strong> Graceful error handling with retry options</li>
          </ul>

          <p><strong>💡 Pro Tip:</strong> Open console to see detailed logs of API calls, caching, and retries!</p>
        </div>
      </div>
    </div>
  );
};

export default DataFetchingDemo;