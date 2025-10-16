import React, { useState, useEffect } from 'react';

/**
 * useEffect Practice Exercise
 * 
 * Implement these features using useEffect:
 * 1. Auto-save form data to localStorage
 * 2. Real-time clock
 * 3. Mouse position tracker
 * 4. API data fetcher with search
 */

const UseEffectPractice = () => {
  // TODO: Add your state variables here
  
  // Exercise 1: Auto-save form
  // - formData (object)
  // - lastSaved (string/date)

  // Exercise 2: Real-time clock
  // - currentTime (Date)

  // Exercise 3: Mouse tracker
  // - mousePosition (object with x, y)

  // Exercise 4: API search
  // - searchTerm (string)
  // - searchResults (array)
  // - isSearching (boolean)

  // TODO: Add your useEffect hooks here

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
    input: {
      padding: '8px',
      margin: '5px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      width: '200px'
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
      <h1>useEffect Practice Exercises</h1>

      {/* Exercise 1: Auto-save Form */}
      <div style={styles.section}>
        <h2>Exercise 1: Auto-save Form</h2>
        <p>Create a form that automatically saves to localStorage:</p>
        <ul>
          <li>Save form data whenever it changes (with debouncing)</li>
          <li>Load saved data on component mount</li>
          <li>Show "last saved" timestamp</li>
          <li>Clear saved data option</li>
        </ul>
        
        {/* TODO: Implement auto-save form */}
        <div>
          <input style={styles.input} placeholder="Name" />
          <input style={styles.input} placeholder="Email" />
          <textarea style={{...styles.input, width: '300px', height: '60px'}} placeholder="Message" />
        </div>
        <div style={{ color: '#666', fontStyle: 'italic', marginTop: '10px' }}>
          Last saved: Never
        </div>
      </div>

      {/* Exercise 2: Real-time Clock */}
      <div style={styles.section}>
        <h2>Exercise 2: Real-time Clock</h2>
        <p>Display a clock that updates every second:</p>
        <ul>
          <li>Show current time in HH:MM:SS format</li>
          <li>Update every second</li>
          <li>Clean up interval on unmount</li>
          <li>Add start/stop functionality</li>
        </ul>
        
        {/* TODO: Implement real-time clock */}
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
          --:--:--
        </div>
        <button style={styles.button}>Start Clock</button>
        <button style={styles.button}>Stop Clock</button>
      </div>

      {/* Exercise 3: Mouse Position Tracker */}
      <div style={styles.section}>
        <h2>Exercise 3: Mouse Position Tracker</h2>
        <p>Track mouse position across the entire window:</p>
        <ul>
          <li>Show current mouse X and Y coordinates</li>
          <li>Update position in real-time</li>
          <li>Add/remove event listener properly</li>
          <li>Toggle tracking on/off</li>
        </ul>
        
        {/* TODO: Implement mouse tracker */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <p>Mouse Position: X: --, Y: --</p>
          <button style={styles.button}>Start Tracking</button>
          <button style={styles.button}>Stop Tracking</button>
        </div>
      </div>

      {/* Exercise 4: API Search */}
      <div style={styles.section}>
        <h2>Exercise 4: API Search with Debouncing</h2>
        <p>Search users from JSONPlaceholder API:</p>
        <ul>
          <li>Search as user types (with debouncing)</li>
          <li>Show loading state during search</li>
          <li>Display search results</li>
          <li>Handle empty results and errors</li>
          <li>Cancel previous requests</li>
        </ul>
        
        {/* TODO: Implement API search */}
        <div>
          <input 
            style={styles.input} 
            placeholder="Search users..." 
          />
          <div style={{ marginTop: '10px' }}>
            <div style={{ color: '#666', fontStyle: 'italic' }}>
              Start typing to search users...
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3>💡 Implementation Tips:</h3>
        <ul>
          <li><strong>Auto-save:</strong> Use setTimeout for debouncing, clear timeout in cleanup</li>
          <li><strong>Clock:</strong> Use setInterval, remember to clear it</li>
          <li><strong>Mouse tracking:</strong> Add mousemove listener to window</li>
          <li><strong>API search:</strong> Use AbortController to cancel requests</li>
          <li><strong>Dependencies:</strong> Be careful with dependency arrays</li>
          <li><strong>Cleanup:</strong> Always clean up subscriptions and timers</li>
        </ul>
        
        <h3>🎯 Learning Goals:</h3>
        <ul>
          <li>Understand different useEffect patterns</li>
          <li>Master cleanup functions</li>
          <li>Handle async operations properly</li>
          <li>Optimize with proper dependencies</li>
          <li>Debug effect-related issues</li>
        </ul>
      </div>
    </div>
  );
};

export default UseEffectPractice;