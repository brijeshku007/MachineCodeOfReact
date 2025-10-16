import React, { useState, useCallback, memo } from 'react';

/**
 * useCallback Practice Exercises
 * 
 * Complete these exercises to master useCallback:
 * 1. Product List with Search and Filters
 * 2. Chat Application with Message List
 * 3. Data Table with Sorting and Pagination
 * 4. Form with Dynamic Fields
 */

const UseCallbackPractice = () => {
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
    }
  };

  return (
    <div style={styles.container}>
      <h1>useCallback Practice Exercises</h1>

      {/* Exercise 1: Product List */}
      <div style={styles.section}>
        <h2>Exercise 1: Product List with Search & Filters</h2>
        <p>Create an optimized product list:</p>
        <ul>
          <li>Product list with name, price, category</li>
          <li>Search functionality (debounced)</li>
          <li>Category filter dropdown</li>
          <li>Sort by price/name buttons</li>
          <li>Each ProductItem should be memoized with React.memo</li>
          <li>Use useCallback for all event handlers</li>
        </ul>

        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Your optimized product list implementation goes here...

          {/* TODO: Implement product list with useCallback optimization */}
          <div style={{ marginTop: '20px' }}>
            <h3>Product Store</h3>

            <div style={{ marginBottom: '15px' }}>
              <input style={styles.input} placeholder="Search products..." />
              <select style={styles.input}>
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Books</option>
              </select>
              <button style={styles.button}>Sort by Price</button>
              <button style={styles.button}>Sort by Name</button>
            </div>

            <div>
              <div style={{ padding: '10px', border: '1px solid #ddd', margin: '5px 0' }}>
                Product 1 - $99 (Electronics)
                <button style={{ ...styles.button, marginLeft: '10px' }}>Add to Cart</button>
              </div>
              <div style={{ padding: '10px', border: '1px solid #ddd', margin: '5px 0' }}>
                Product 2 - $49 (Clothing)
                <button style={{ ...styles.button, marginLeft: '10px' }}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise 2: Chat Application */}
      <div style={styles.section}>
        <h2>Exercise 2: Chat Application</h2>
        <p>Build a chat app with performance optimization:</p>
        <ul>
          <li>Message list with sender, text, timestamp</li>
          <li>Send message functionality</li>
          <li>Delete message feature</li>
          <li>User typing indicator</li>
          <li>Each Message component should be memoized</li>
          <li>Optimize all callbacks to prevent unnecessary re-renders</li>
        </ul>

        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Your optimized chat application implementation goes here...

          {/* TODO: Implement chat app with useCallback optimization */}
          <div style={{ marginTop: '20px' }}>
            <h3>Chat Room</h3>

            <div style={{
              height: '200px',
              border: '1px solid #ddd',
              padding: '10px',
              overflowY: 'auto',
              backgroundColor: '#f9f9f9',
              marginBottom: '10px'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>John:</strong> Hello everyone! <small>(2:30 PM)</small>
                <button style={{ ...styles.button, fontSize: '12px', padding: '2px 6px', marginLeft: '10px' }}>Delete</button>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Jane:</strong> How's everyone doing? <small>(2:31 PM)</small>
                <button style={{ ...styles.button, fontSize: '12px', padding: '2px 6px', marginLeft: '10px' }}>Delete</button>
              </div>
            </div>

            <div>
              <input style={{ ...styles.input, width: '200px' }} placeholder="Type a message..." />
              <button style={styles.button}>Send</button>
            </div>

            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              Jane is typing...
            </div>
          </div>
        </div>
      </div>

      {/* Exercise 3: Data Table */}
      <div style={styles.section}>
        <h2>Exercise 3: Data Table with Sorting & Pagination</h2>
        <p>Create an optimized data table:</p>
        <ul>
          <li>Table with user data (name, email, age, status)</li>
          <li>Sortable columns (click header to sort)</li>
          <li>Pagination controls</li>
          <li>Items per page selector</li>
          <li>Row selection with checkboxes</li>
          <li>Each TableRow should be memoized</li>
          <li>Optimize all sorting and pagination callbacks</li>
        </ul>

        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Your optimized data table implementation goes here...

          {/* TODO: Implement data table with useCallback optimization */}
          <div style={{ marginTop: '20px' }}>
            <h3>User Data Table</h3>

            <div style={{ marginBottom: '15px' }}>
              <label>
                Items per page:
                <select style={styles.input}>
                  <option>5</option>
                  <option>10</option>
                  <option>20</option>
                </select>
              </label>
              <span style={{ marginLeft: '20px' }}>Selected: 0 items</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <input type="checkbox" />
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', cursor: 'pointer' }}>
                    Name ↕️
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', cursor: 'pointer' }}>
                    Email ↕️
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', cursor: 'pointer' }}>
                    Age ↕️
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <input type="checkbox" />
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>John Doe</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>john@example.com</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>30</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button style={{ ...styles.button, fontSize: '12px', padding: '4px 8px' }}>Edit</button>
                    <button style={{ ...styles.button, fontSize: '12px', padding: '4px 8px', backgroundColor: '#dc3545' }}>Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '15px' }}>
              <button style={styles.button}>Previous</button>
              <span style={{ margin: '0 15px' }}>Page 1 of 5</span>
              <button style={styles.button}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise 4: Dynamic Form */}
      <div style={styles.section}>
        <h2>Exercise 4: Dynamic Form Builder</h2>
        <p>Build a form with dynamic fields:</p>
        <ul>
          <li>Add/remove form fields dynamically</li>
          <li>Different field types (text, email, select, checkbox)</li>
          <li>Field validation with error messages</li>
          <li>Form submission with validation</li>
          <li>Each FormField component should be memoized</li>
          <li>Optimize all field update callbacks</li>
        </ul>

        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Your dynamic form implementation goes here...

          {/* TODO: Implement dynamic form with useCallback optimization */}
          <div style={{ marginTop: '20px' }}>
            <h3>Dynamic Form Builder</h3>

            <div style={{ marginBottom: '15px' }}>
              <button style={styles.button}>Add Text Field</button>
              <button style={styles.button}>Add Email Field</button>
              <button style={styles.button}>Add Select Field</button>
              <button style={styles.button}>Add Checkbox</button>
            </div>

            <form>
              <div style={{ marginBottom: '15px' }}>
                <label>Name (Text Field):</label>
                <input style={styles.input} type="text" />
                <button type="button" style={{ ...styles.button, backgroundColor: '#dc3545' }}>Remove</button>
                <div style={{ color: '#dc3545', fontSize: '12px' }}>This field is required</div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Email (Email Field):</label>
                <input style={styles.input} type="email" />
                <button type="button" style={{ ...styles.button, backgroundColor: '#dc3545' }}>Remove</button>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <button type="submit" style={{ ...styles.button, backgroundColor: '#28a745' }}>Submit Form</button>
                <button type="button" style={{ ...styles.button, backgroundColor: '#6c757d' }}>Reset</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3>💡 Implementation Tips:</h3>
        <ul>
          <li><strong>React.memo:</strong> Wrap child components to prevent unnecessary re-renders</li>
          <li><strong>useCallback dependencies:</strong> Include all values used inside the callback</li>
          <li><strong>Functional updates:</strong> Use when possible to reduce dependencies</li>
          <li><strong>Performance measurement:</strong> Use React DevTools Profiler</li>
          <li><strong>ESLint rule:</strong> Enable exhaustive-deps for useCallback</li>
          <li><strong>Don't overuse:</strong> Only optimize when you have performance issues</li>
        </ul>

        <h3>🎯 Learning Goals:</h3>
        <ul>
          <li>Master useCallback for performance optimization</li>
          <li>Understand when to use React.memo with useCallback</li>
          <li>Learn to identify performance bottlenecks</li>
          <li>Practice proper dependency management</li>
          <li>Build real-world optimized components</li>
        </ul>

        <h3>🧪 Testing Performance:</h3>
        <p>Use these tools to measure your optimizations:</p>
        <ul>
          <li><strong>React DevTools Profiler:</strong> Measure render performance</li>
          <li><strong>Console logs:</strong> Track component re-renders</li>
          <li><strong>Performance.now():</strong> Measure execution time</li>
          <li><strong>React.StrictMode:</strong> Catch performance issues in development</li>
        </ul>
      </div>
    </div>
  );
};

export default UseCallbackPractice;