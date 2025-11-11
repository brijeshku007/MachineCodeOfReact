// 🔄 Redux Toolkit Basics - Complete Working Example
// This demonstrates fundamental RTK concepts with practical examples

import React, { useState } from 'react';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// =============================================================================
// EXAMPLE 1: Simple Counter - Basic RTK Concepts
// =============================================================================

// Counter Slice - Demonstrates basic createSlice usage
const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    step: 1
  },
  reducers: {
    // Simple increment
    increment: (state) => {
      state.value += state.step;
    },

    // Simple decrement
    decrement: (state) => {
      state.value -= state.step;
    },

    // Action with payload
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },

    // Multiple state updates
    setStep: (state, action) => {
      state.step = action.payload;
    },

    // Reset to initial state
    reset: (state) => {
      state.value = 0;
      state.step = 1;
    },

    // Complex logic
    multiplyByStep: (state) => {
      state.value = state.value * state.step;
    }
  }
});

// Export actions (auto-generated)
export const {
  increment,
  decrement,
  incrementByAmount,
  setStep,
  reset,
  multiplyByStep
} = counterSlice.actions;

// Counter Component
function Counter() {
  const { value, step } = useSelector(state => state.counter);
  const dispatch = useDispatch();
  const [customAmount, setCustomAmount] = useState(5);

  return (
    <div className="counter-demo">
      <h2>🔢 Counter Demo</h2>

      <div className="counter-display">
        <span className="counter-value">{value}</span>
        <span className="counter-step">Step: {step}</span>
      </div>

      <div className="counter-controls">
        <button onClick={() => dispatch(decrement())} className="btn-secondary">
          - {step}
        </button>

        <button onClick={() => dispatch(increment())} className="btn-primary">
          + {step}
        </button>

        <button onClick={() => dispatch(reset())} className="btn-secondary">
          Reset
        </button>

        <button onClick={() => dispatch(multiplyByStep())} className="btn-secondary">
          × {step}
        </button>
      </div>

      <div className="counter-advanced">
        <div className="input-group">
          <label>Custom Amount:</label>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(Number(e.target.value))}
          />
          <button
            onClick={() => dispatch(incrementByAmount(customAmount))}
            className="btn-primary"
          >
            Add {customAmount}
          </button>
        </div>

        <div className="input-group">
          <label>Step Size:</label>
          <select
            value={step}
            onChange={(e) => dispatch(setStep(Number(e.target.value)))}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      <div className="rtk-explanation">
        <h3>🎯 RTK Concepts Demonstrated:</h3>
        <ul>
          <li><strong>createSlice:</strong> Combines actions and reducers</li>
          <li><strong>Immer:</strong> Direct state mutation (state.value += 1)</li>
          <li><strong>Auto-generated actions:</strong> increment, decrement, etc.</li>
          <li><strong>useSelector:</strong> Reading state from store</li>
          <li><strong>useDispatch:</strong> Dispatching actions</li>
        </ul>
      </div>
    </div>
  );
}

// =============================================================================
// EXAMPLE 2: Todo List - More Complex State Management
// =============================================================================

// Todo Slice - Demonstrates complex state structure
const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [
      { id: 1, text: 'Learn Redux Toolkit basics', completed: true },
      { id: 2, text: 'Build a todo app', completed: false },
      { id: 3, text: 'Master RTK patterns', completed: false }
    ],
    filter: 'all', // 'all', 'active', 'completed'
    nextId: 4
  },
  reducers: {
    // Add new todo
    addTodo: (state, action) => {
      state.items.push({
        id: state.nextId,
        text: action.payload,
        completed: false
      });
      state.nextId += 1;
    },

    // Toggle todo completion
    toggleTodo: (state, action) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },

    // Delete todo
    deleteTodo: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // Edit todo text
    editTodo: (state, action) => {
      const { id, text } = action.payload;
      const todo = state.items.find(item => item.id === id);
      if (todo) {
        todo.text = text;
      }
    },

    // Set filter
    setFilter: (state, action) => {
      state.filter = action.payload;
    },

    // Clear completed todos
    clearCompleted: (state) => {
      state.items = state.items.filter(item => !item.completed);
    },

    // Toggle all todos
    toggleAll: (state) => {
      const allCompleted = state.items.every(item => item.completed);
      state.items.forEach(item => {
        item.completed = !allCompleted;
      });
    }
  }
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  setFilter,
  clearCompleted,
  toggleAll
} = todosSlice.actions;

// Todo List Component
function TodoList() {
  const { items, filter } = useSelector(state => state.todos);
  const dispatch = useDispatch();
  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Filter todos based on current filter
  const filteredTodos = items.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      dispatch(addTodo(newTodoText.trim()));
      setNewTodoText('');
    }
  };

  const handleEditStart = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleEditSave = (id) => {
    if (editText.trim()) {
      dispatch(editTodo({ id, text: editText.trim() }));
    }
    setEditingId(null);
    setEditText('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  const completedCount = items.filter(item => item.completed).length;
  const activeCount = items.length - completedCount;

  return (
    <div className="todo-demo">
      <h2>📝 Todo List Demo</h2>

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button type="submit" className="btn-primary">Add Todo</button>
      </form>

      {/* Todo Stats */}
      <div className="todo-stats">
        <span>Total: {items.length}</span>
        <span>Active: {activeCount}</span>
        <span>Completed: {completedCount}</span>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {['all', 'active', 'completed'].map(filterType => (
          <button
            key={filterType}
            onClick={() => dispatch(setFilter(filterType))}
            className={`filter-btn ${filter === filterType ? 'active' : ''}`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      <div className="bulk-actions">
        <button
          onClick={() => dispatch(toggleAll())}
          className="btn-secondary"
        >
          Toggle All
        </button>
        <button
          onClick={() => dispatch(clearCompleted())}
          className="btn-secondary"
          disabled={completedCount === 0}
        >
          Clear Completed ({completedCount})
        </button>
      </div>

      {/* Todo Items */}
      <div className="todo-list">
        {filteredTodos.map(todo => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo(todo.id))}
              className="todo-checkbox"
            />

            {editingId === todo.id ? (
              <div className="todo-edit">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSave(todo.id);
                    if (e.key === 'Escape') handleEditCancel();
                  }}
                  className="todo-edit-input"
                  autoFocus
                />
                <button onClick={() => handleEditSave(todo.id)} className="btn-small">Save</button>
                <button onClick={handleEditCancel} className="btn-small">Cancel</button>
              </div>
            ) : (
              <div className="todo-content">
                <span
                  className="todo-text"
                  onDoubleClick={() => handleEditStart(todo)}
                >
                  {todo.text}
                </span>
                <div className="todo-actions">
                  <button
                    onClick={() => handleEditStart(todo)}
                    className="btn-small"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => dispatch(deleteTodo(todo.id))}
                    className="btn-small btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <div className="empty-state">
          {filter === 'all' ? 'No todos yet!' : `No ${filter} todos!`}
        </div>
      )}

      <div className="rtk-explanation">
        <h3>🎯 Advanced RTK Concepts:</h3>
        <ul>
          <li><strong>Complex state:</strong> Arrays, objects, and multiple properties</li>
          <li><strong>Array operations:</strong> push, filter, find, forEach</li>
          <li><strong>Conditional logic:</strong> Finding and updating specific items</li>
          <li><strong>State normalization:</strong> Using IDs for efficient updates</li>
          <li><strong>Derived state:</strong> Filtering based on current filter</li>
        </ul>
      </div>
    </div>
  );
}

// =============================================================================
// EXAMPLE 3: User Preferences - Object State Management
// =============================================================================

// User Slice - Demonstrates object state management
const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '👤'
    },
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        sms: false
      }
    },
    settings: {
      autoSave: true,
      showTips: true
    }
  },
  reducers: {
    // Update profile
    updateProfile: (state, action) => {
      Object.assign(state.profile, action.payload);
    },

    // Update preferences
    updatePreferences: (state, action) => {
      Object.assign(state.preferences, action.payload);
    },

    // Toggle notification setting
    toggleNotification: (state, action) => {
      const { type } = action.payload;
      state.preferences.notifications[type] = !state.preferences.notifications[type];
    },

    // Update settings
    updateSettings: (state, action) => {
      Object.assign(state.settings, action.payload);
    },

    // Reset to defaults
    resetPreferences: (state) => {
      state.preferences = {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          sms: false
        }
      };
    }
  }
});

export const {
  updateProfile,
  updatePreferences,
  toggleNotification,
  updateSettings,
  resetPreferences
} = userSlice.actions;

// User Settings Component
function UserSettings() {
  const { profile, preferences, settings } = useSelector(state => state.user);
  const dispatch = useDispatch();

  return (
    <div className="user-demo">
      <h2>👤 User Settings Demo</h2>

      {/* Profile Section */}
      <div className="settings-section">
        <h3>Profile</h3>
        <div className="profile-display">
          <span className="avatar">{profile.avatar}</span>
          <div className="profile-info">
            <div><strong>Name:</strong> {profile.name}</div>
            <div><strong>Email:</strong> {profile.email}</div>
          </div>
        </div>

        <div className="profile-controls">
          <button
            onClick={() => dispatch(updateProfile({
              name: 'Jane Smith',
              email: 'jane@example.com',
              avatar: '👩'
            }))}
            className="btn-secondary"
          >
            Switch to Jane
          </button>
          <button
            onClick={() => dispatch(updateProfile({
              name: 'John Doe',
              email: 'john@example.com',
              avatar: '👤'
            }))}
            className="btn-secondary"
          >
            Switch to John
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="settings-section">
        <h3>Preferences</h3>

        <div className="preference-group">
          <label>Theme:</label>
          <select
            value={preferences.theme}
            onChange={(e) => dispatch(updatePreferences({ theme: e.target.value }))}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div className="preference-group">
          <label>Language:</label>
          <select
            value={preferences.language}
            onChange={(e) => dispatch(updatePreferences({ language: e.target.value }))}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="preference-group">
          <label>Notifications:</label>
          <div className="notification-toggles">
            {Object.entries(preferences.notifications).map(([type, enabled]) => (
              <label key={type} className="toggle-label">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => dispatch(toggleNotification({ type }))}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="settings-section">
        <h3>Settings</h3>

        <label className="toggle-label">
          <input
            type="checkbox"
            checked={settings.autoSave}
            onChange={(e) => dispatch(updateSettings({ autoSave: e.target.checked }))}
          />
          Auto Save
        </label>

        <label className="toggle-label">
          <input
            type="checkbox"
            checked={settings.showTips}
            onChange={(e) => dispatch(updateSettings({ showTips: e.target.checked }))}
          />
          Show Tips
        </label>
      </div>

      <div className="settings-actions">
        <button
          onClick={() => dispatch(resetPreferences())}
          className="btn-secondary"
        >
          Reset Preferences
        </button>
      </div>

      <div className="rtk-explanation">
        <h3>🎯 Object State Management:</h3>
        <ul>
          <li><strong>Nested objects:</strong> profile.name, preferences.notifications.email</li>
          <li><strong>Object.assign:</strong> Merging partial updates</li>
          <li><strong>Deep updates:</strong> Updating nested properties safely</li>
          <li><strong>Selective updates:</strong> Only changing what's needed</li>
        </ul>
      </div>
    </div>
  );
}

// =============================================================================
// STORE CONFIGURATION
// =============================================================================

// Configure the RTK store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    todos: todosSlice.reducer,
    user: userSlice.reducer
  },
  // RTK includes these by default:
  // - Redux DevTools Extension
  // - Serializable state check middleware
  // - Immutable state check middleware
});

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

function RTKBasicsApp() {
  const [activeDemo, setActiveDemo] = useState('counter');

  const demos = {
    counter: { component: Counter, title: '🔢 Counter', description: 'Basic RTK concepts' },
    todos: { component: TodoList, title: '📝 Todo List', description: 'Complex state management' },
    user: { component: UserSettings, title: '👤 User Settings', description: 'Object state management' }
  };

  const ActiveComponent = demos[activeDemo].component;

  return (
    <Provider store={store}>
      <div className="rtk-app">
        <header className="app-header">
          <h1>🔄 Redux Toolkit Basics</h1>
          <p>Learn fundamental RTK concepts with interactive examples</p>
        </header>

        {/* Demo Navigation */}
        <nav className="demo-nav">
          {Object.entries(demos).map(([key, demo]) => (
            <button
              key={key}
              onClick={() => setActiveDemo(key)}
              className={`demo-btn ${activeDemo === key ? 'active' : ''}`}
            >
              <div className="demo-title">{demo.title}</div>
              <div className="demo-description">{demo.description}</div>
            </button>
          ))}
        </nav>

        {/* Active Demo */}
        <main className="demo-content">
          <ActiveComponent />
        </main>

        {/* RTK Overview */}
        <footer className="rtk-overview">
          <h2>🎯 Redux Toolkit Benefits</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>📝 Less Boilerplate</h3>
              <p>createSlice combines actions and reducers in one place</p>
            </div>
            <div className="benefit-card">
              <h3>🔄 Immer Integration</h3>
              <p>Write "mutative" logic that's actually immutable</p>
            </div>
            <div className="benefit-card">
              <h3>🛠️ Great DevTools</h3>
              <p>Redux DevTools included by default</p>
            </div>
            <div className="benefit-card">
              <h3>⚡ Better Performance</h3>
              <p>Optimized for modern React patterns</p>
            </div>
          </div>
        </footer>
      </div>
    </Provider>
  );
}

export default RTKBasicsApp;

// =============================================================================
// CSS STYLES
// =============================================================================

const styles = `
.rtk-app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.app-header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.app-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
}

.app-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

/* Demo Navigation */
.demo-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.demo-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.demo-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.demo-btn.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.demo-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.demo-description {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Demo Content */
.demo-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

/* Counter Demo */
.counter-demo {
  text-align: center;
}

.counter-display {
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.counter-value {
  font-size: 4rem;
  font-weight: bold;
  color: #667eea;
}

.counter-step {
  font-size: 1.2rem;
  color: #666;
}

.counter-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.counter-advanced {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: bold;
  color: #333;
}

.input-group input,
.input-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Todo Demo */
.todo-demo {
  max-width: 600px;
  margin: 0 auto;
}

.add-todo-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.todo-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.todo-input:focus {
  border-color: #667eea;
  outline: none;
}

.todo-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  background: #f8f9fa;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.bulk-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.todo-item:hover {
  background: #e9ecef;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
}

.todo-checkbox {
  width: 1.2rem;
  height: 1.2rem;
}

.todo-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-text {
  flex: 1;
  cursor: pointer;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
}

.todo-edit {
  flex: 1;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.todo-edit-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-style: italic;
}

/* User Demo */
.user-demo {
  max-width: 600px;
  margin: 0 auto;
}

.settings-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.settings-section h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.profile-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar {
  font-size: 3rem;
}

.profile-info {
  flex: 1;
}

.profile-controls {
  display: flex;
  gap: 1rem;
}

.preference-group {
  margin-bottom: 1rem;
}

.preference-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.preference-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.notification-toggles {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.toggle-label input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
}

.settings-actions {
  text-align: center;
  margin-top: 2rem;
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-small,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.btn-secondary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn-small:hover {
  background: #e9ecef;
}

.btn-danger {
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-danger:hover {
  background: #c82333;
}

/* RTK Explanation */
.rtk-explanation {
  margin-top: 3rem;
  padding: 2rem;
  background: #e3f2fd;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
}

.rtk-explanation h3 {
  margin: 0 0 1rem 0;
  color: #1976d2;
}

.rtk-explanation ul {
  margin: 0;
  padding-left: 1.5rem;
}

.rtk-explanation li {
  margin-bottom: 0.5rem;
}

.rtk-explanation strong {
  color: #1976d2;
}

/* RTK Overview */
.rtk-overview {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  color: white;
}

.rtk-overview h2 {
  text-align: center;
  margin: 0 0 2rem 0;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.benefit-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.benefit-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.benefit-card p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .rtk-app {
    padding: 1rem;
  }
  
  .demo-nav {
    grid-template-columns: 1fr;
  }
  
  .counter-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .counter-advanced {
    grid-template-columns: 1fr;
  }
  
  .add-todo-form {
    flex-direction: column;
  }
  
  .todo-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .filter-buttons {
    flex-wrap: wrap;
  }
  
  .bulk-actions {
    flex-direction: column;
  }
  
  .profile-controls {
    flex-direction: column;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}