import React, { useState } from 'react'
import {
  createSlice,
  createAsyncThunk,
  configureStore,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { Provider, useSelector, useDispatch } from 'react-redux'

// 🧪 This component demonstrates testable RTK patterns
// In a real app, these would be in separate files with corresponding test files

// 📊 Mock API for demonstration
const mockApi = {
  fetchTodos: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      { id: 1, text: 'Learn RTK testing', completed: false, priority: 'high' },
      { id: 2, text: 'Write comprehensive tests', completed: true, priority: 'medium' },
      { id: 3, text: 'Deploy to production', completed: false, priority: 'low' },
    ]
  },

  addTodo: async (todo) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      id: Date.now(),
      ...todo,
      completed: false,
      createdAt: new Date().toISOString(),
    }
  },

  updateTodo: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return { id, ...updates }
  },

  deleteTodo: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return id
  },
}

// 🔄 Async Thunks (Testable)
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const todos = await mockApi.fetchTodos()
      return todos
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addTodoAsync = createAsyncThunk(
  'todos/addTodo',
  async (todoData, { rejectWithValue }) => {
    try {
      const newTodo = await mockApi.addTodo(todoData)
      return newTodo
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateTodoAsync = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const updatedTodo = await mockApi.updateTodo(id, updates)
      return updatedTodo
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteTodoAsync = createAsyncThunk(
  'todos/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      await mockApi.deleteTodo(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// 🗃️ Entity Adapter (Testable)
const todosAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    // Sort by priority: high -> medium -> low
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  }
})

// 🏪 Todos Slice (Testable)
const todosSlice = createSlice({
  name: 'todos',
  initialState: todosAdapter.getInitialState({
    loading: false,
    error: null,
    filter: 'all', // all, active, completed
    stats: {
      total: 0,
      completed: 0,
      active: 0,
    }
  }),
  reducers: {
    // Synchronous actions (Easy to test)
    todoToggled: (state, action) => {
      const { id } = action.payload
      const todo = state.entities[id]
      if (todo) {
        todo.completed = !todo.completed
        // Update stats
        if (todo.completed) {
          state.stats.completed += 1
          state.stats.active -= 1
        } else {
          state.stats.completed -= 1
          state.stats.active += 1
        }
      }
    },

    filterChanged: (state, action) => {
      state.filter = action.payload
    },

    todoTextUpdated: (state, action) => {
      const { id, text } = action.payload
      const todo = state.entities[id]
      if (todo) {
        todo.text = text
      }
    },

    todoPriorityUpdated: (state, action) => {
      const { id, priority } = action.payload
      todosAdapter.updateOne(state, { id, changes: { priority } })
    },

    allTodosCompleted: (state) => {
      const todoIds = state.ids
      todoIds.forEach(id => {
        const todo = state.entities[id]
        if (todo && !todo.completed) {
          todo.completed = true
        }
      })
      state.stats.completed = state.stats.total
      state.stats.active = 0
    },

    completedTodosCleared: (state) => {
      const completedIds = state.ids.filter(id =>
        state.entities[id].completed
      )
      todosAdapter.removeMany(state, completedIds)
      state.stats.total -= completedIds.length
      state.stats.completed = 0
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false
        todosAdapter.setAll(state, action.payload)
        // Update stats
        const todos = action.payload
        state.stats.total = todos.length
        state.stats.completed = todos.filter(t => t.completed).length
        state.stats.active = todos.filter(t => !t.completed).length
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Add todo
      .addCase(addTodoAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.loading = false
        todosAdapter.addOne(state, action.payload)
        state.stats.total += 1
        state.stats.active += 1
      })
      .addCase(addTodoAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update todo
      .addCase(updateTodoAsync.fulfilled, (state, action) => {
        todosAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload
        })
      })

      // Delete todo
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        const todoId = action.payload
        const todo = state.entities[todoId]
        if (todo) {
          todosAdapter.removeOne(state, todoId)
          state.stats.total -= 1
          if (todo.completed) {
            state.stats.completed -= 1
          } else {
            state.stats.active -= 1
          }
        }
      })
  },
})

// Export actions
export const {
  todoToggled,
  filterChanged,
  todoTextUpdated,
  todoPriorityUpdated,
  allTodosCompleted,
  completedTodosCleared,
} = todosSlice.actions

// 🎯 Selectors (Testable)
const todosSelectors = todosAdapter.getSelectors(state => state.todos)

export const selectAllTodos = todosSelectors.selectAll
export const selectTodoById = todosSelectors.selectById
export const selectTodosLoading = state => state.todos.loading
export const selectTodosError = state => state.todos.error
export const selectTodosFilter = state => state.todos.filter
export const selectTodosStats = state => state.todos.stats

// Derived selectors (Great for testing memoization)
export const selectFilteredTodos = (state) => {
  const todos = selectAllTodos(state)
  const filter = selectTodosFilter(state)

  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed)
    case 'completed':
      return todos.filter(todo => todo.completed)
    default:
      return todos
  }
}

export const selectTodosByPriority = (state) => {
  const todos = selectAllTodos(state)
  return {
    high: todos.filter(todo => todo.priority === 'high'),
    medium: todos.filter(todo => todo.priority === 'medium'),
    low: todos.filter(todo => todo.priority === 'low'),
  }
}

// 🏪 Store Configuration
const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

// 📊 Stats Component (Testable)
const TodoStats = React.memo(() => {
  const stats = useSelector(selectTodosStats)
  const loading = useSelector(selectTodosLoading)

  if (loading) {
    return <div className="stats loading">Loading stats...</div>
  }

  return (
    <div className="todo-stats">
      <h3>📊 Todo Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card active">
          <div className="stat-number">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card progress">
          <div className="stat-number">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
          </div>
          <div className="stat-label">Progress</div>
        </div>
      </div>
    </div>
  )
})

// 🔍 Filter Component (Testable)
const TodoFilter = React.memo(() => {
  const dispatch = useDispatch()
  const currentFilter = useSelector(selectTodosFilter)

  const filters = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'active', label: 'Active', icon: '⏳' },
    { key: 'completed', label: 'Completed', icon: '✅' },
  ]

  return (
    <div className="todo-filter">
      <h4>🔍 Filter Todos</h4>
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.key}
            className={`filter-btn ${currentFilter === filter.key ? 'active' : ''}`}
            onClick={() => dispatch(filterChanged(filter.key))}
            data-testid={`filter-${filter.key}`}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
})

// ➕ Add Todo Form (Testable)
const AddTodoForm = React.memo(() => {
  const dispatch = useDispatch()
  const loading = useSelector(selectTodosLoading)
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return

    dispatch(addTodoAsync({
      text: text.trim(),
      priority,
    }))

    setText('')
    setPriority('medium')
  }

  return (
    <div className="add-todo-form">
      <h3>➕ Add New Todo</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            disabled={loading}
            data-testid="todo-input"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={loading}
            data-testid="priority-select"
          >
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading || !text.trim()}
          data-testid="add-todo-btn"
        >
          {loading ? '➕ Adding...' : '➕ Add Todo'}
        </button>
      </form>
    </div>
  )
})

// 📝 Todo Item Component (Testable)
const TodoItem = React.memo(({ todo }) => {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleToggle = () => {
    dispatch(todoToggled({ id: todo.id }))
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      dispatch(deleteTodoAsync(todo.id))
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditText(todo.text)
  }

  const handleSave = () => {
    if (editText.trim() && editText !== todo.text) {
      dispatch(todoTextUpdated({ id: todo.id, text: editText.trim() }))
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handlePriorityChange = (newPriority) => {
    dispatch(todoPriorityUpdated({ id: todo.id, priority: newPriority }))
  }

  const priorityColors = {
    high: '#ff4444',
    medium: '#ffaa00',
    low: '#44aa44',
  }

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      data-testid={`todo-${todo.id}`}
    >
      <div className="todo-main">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          data-testid={`todo-checkbox-${todo.id}`}
        />

        {isEditing ? (
          <div className="todo-edit">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') handleCancel()
              }}
              autoFocus
              data-testid={`todo-edit-input-${todo.id}`}
            />
            <div className="edit-actions">
              <button onClick={handleSave} data-testid={`todo-save-${todo.id}`}>
                💾 Save
              </button>
              <button onClick={handleCancel} data-testid={`todo-cancel-${todo.id}`}>
                ❌ Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="todo-content">
            <span
              className="todo-text"
              onDoubleClick={handleEdit}
              data-testid={`todo-text-${todo.id}`}
            >
              {todo.text}
            </span>
            <div className="todo-meta">
              <span
                className="priority-badge"
                style={{ backgroundColor: priorityColors[todo.priority] }}
                data-testid={`todo-priority-${todo.id}`}
              >
                {todo.priority}
              </span>
              {todo.createdAt && (
                <span className="created-date">
                  {new Date(todo.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="todo-actions">
        {!isEditing && (
          <>
            <select
              value={todo.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="priority-select"
              data-testid={`todo-priority-select-${todo.id}`}
            >
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <button
              onClick={handleEdit}
              data-testid={`todo-edit-${todo.id}`}
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              data-testid={`todo-delete-${todo.id}`}
            >
              🗑️ Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
})

// 📋 Todo List Component (Testable)
const TodoList = React.memo(() => {
  const dispatch = useDispatch()
  const filteredTodos = useSelector(selectFilteredTodos)
  const loading = useSelector(selectTodosLoading)
  const error = useSelector(selectTodosError)
  const stats = useSelector(selectTodosStats)

  const handleCompleteAll = () => {
    dispatch(allTodosCompleted())
  }

  const handleClearCompleted = () => {
    if (window.confirm('Are you sure you want to clear all completed todos?')) {
      dispatch(completedTodosCleared())
    }
  }

  if (loading && filteredTodos.length === 0) {
    return (
      <div className="todo-list loading" data-testid="todos-loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading todos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="todo-list error" data-testid="todos-error">
        <h3>❌ Error Loading Todos</h3>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchTodos())}>
          🔄 Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="todo-list">
      <div className="list-header">
        <h3>📋 Todo List ({filteredTodos.length})</h3>
        <div className="bulk-actions">
          {stats.active > 0 && (
            <button
              onClick={handleCompleteAll}
              data-testid="complete-all-btn"
            >
              ✅ Complete All
            </button>
          )}
          {stats.completed > 0 && (
            <button
              onClick={handleClearCompleted}
              data-testid="clear-completed-btn"
            >
              🗑️ Clear Completed
            </button>
          )}
        </div>
      </div>

      <div className="todos-container" data-testid="todos-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state" data-testid="empty-todos">
            <p>No todos found. Add one above! 👆</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
    </div>
  )
})

// 🎯 Main Testing Example Component
function TestingExample() {
  const dispatch = useDispatch()
  const loading = useSelector(selectTodosLoading)

  // Load initial data
  React.useEffect(() => {
    dispatch(fetchTodos())
  }, [dispatch])

  return (
    <div className="testing-example">
      <div className="header">
        <h1>🧪 RTK Testing Example</h1>
        <p>Comprehensive testing patterns for Redux Toolkit applications</p>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <AddTodoForm />
          <TodoFilter />
          <TodoStats />
        </div>

        <div className="right-panel">
          <TodoList />
        </div>
      </div>

      <div className="testing-info">
        <h3>🧪 Testing Patterns Demonstrated:</h3>
        <div className="testing-patterns">
          <div className="pattern-category">
            <h4>🏪 Slice Testing</h4>
            <ul>
              <li>✅ Reducer pure function testing</li>
              <li>✅ Action creator testing</li>
              <li>✅ Initial state validation</li>
              <li>✅ Complex state updates</li>
            </ul>
          </div>

          <div className="pattern-category">
            <h4>🔄 Async Testing</h4>
            <ul>
              <li>✅ Thunk success scenarios</li>
              <li>✅ Error handling testing</li>
              <li>✅ Loading state management</li>
              <li>✅ API mocking strategies</li>
            </ul>
          </div>

          <div className="pattern-category">
            <h4>🧩 Integration Testing</h4>
            <ul>
              <li>✅ Component-store integration</li>
              <li>✅ User interaction testing</li>
              <li>✅ State synchronization</li>
              <li>✅ End-to-end workflows</li>
            </ul>
          </div>

          <div className="pattern-category">
            <h4>🎯 Selector Testing</h4>
            <ul>
              <li>✅ Memoization validation</li>
              <li>✅ Derived state testing</li>
              <li>✅ Filter logic testing</li>
              <li>✅ Performance optimization</li>
            </ul>
          </div>
        </div>

        <div className="test-commands">
          <h4>🚀 Test Commands</h4>
          <div className="commands">
            <code>npm test</code> - Run all tests
            <br />
            <code>npm test -- --coverage</code> - Run with coverage
            <br />
            <code>npm test -- --watch</code> - Run in watch mode
            <br />
            <code>npm test TodoSlice.test.js</code> - Run specific test file
          </div>
        </div>
      </div>

      <style jsx>{`
        .testing-example {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
        }

        .header h1 {
          margin: 0 0 10px 0;
          font-size: 2.5rem;
        }

        .header p {
          margin: 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .main-content {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }

        .left-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .right-panel {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 20px;
        }

        .add-todo-form,
        .todo-filter,
        .todo-stats {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 20px;
        }

        .add-todo-form h3,
        .todo-filter h4,
        .todo-stats h3 {
          margin-top: 0;
          color: #333;
        }

        .form-row {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .form-row input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }

        .form-row select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.9rem;
          min-width: 120px;
        }

        .add-todo-form button {
          width: 100%;
          padding: 12px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .add-todo-form button:hover:not(:disabled) {
          background: #45a049;
        }

        .add-todo-form button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          background: #f0f0f0;
        }

        .filter-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .stat-card {
          text-align: center;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid;
        }

        .stat-card.total {
          background: #e3f2fd;
          border-left-color: #2196f3;
        }

        .stat-card.active {
          background: #fff3e0;
          border-left-color: #ff9800;
        }

        .stat-card.completed {
          background: #e8f5e8;
          border-left-color: #4caf50;
        }

        .stat-card.progress {
          background: #f3e5f5;
          border-left-color: #9c27b0;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #666;
          margin-top: 5px;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e1e5e9;
        }

        .list-header h3 {
          margin: 0;
          color: #333;
        }

        .bulk-actions {
          display: flex;
          gap: 10px;
        }

        .bulk-actions button {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .bulk-actions button:hover {
          background: #f0f0f0;
        }

        .todos-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .todo-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 15px;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          background: #fafbfc;
          transition: all 0.2s ease;
        }

        .todo-item:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .todo-item.completed {
          opacity: 0.7;
          background: #f5f5f5;
        }

        .todo-item.completed .todo-text {
          text-decoration: line-through;
          color: #999;
        }

        .todo-main {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          flex: 1;
        }

        .todo-main input[type="checkbox"] {
          margin-top: 2px;
          transform: scale(1.2);
        }

        .todo-content {
          flex: 1;
        }

        .todo-text {
          display: block;
          font-size: 1rem;
          color: #333;
          margin-bottom: 8px;
          cursor: pointer;
        }

        .todo-text:hover {
          color: #667eea;
        }

        .todo-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .priority-badge {
          padding: 2px 8px;
          border-radius: 12px;
          color: white;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .created-date {
          font-size: 0.75rem;
          color: #999;
        }

        .todo-edit {
          flex: 1;
        }

        .todo-edit input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          margin-bottom: 8px;
        }

        .edit-actions {
          display: flex;
          gap: 8px;
        }

        .edit-actions button {
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .todo-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .todo-actions select {
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .todo-actions button {
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }

        .todo-actions button:hover {
          background: #f0f0f0;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
          font-style: italic;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .loading-spinner {
          font-size: 2rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error {
          text-align: center;
          padding: 40px;
          color: #f44336;
          background: #ffebee;
          border-radius: 8px;
        }

        .error button {
          margin-top: 15px;
          padding: 10px 20px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .testing-info {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 30px;
        }

        .testing-info h3 {
          margin-top: 0;
          color: #333;
          text-align: center;
        }

        .testing-patterns {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .pattern-category {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .pattern-category h4 {
          margin-top: 0;
          color: #667eea;
          border-bottom: 2px solid #e1e5e9;
          padding-bottom: 10px;
        }

        .pattern-category ul {
          list-style: none;
          padding: 0;
        }

        .pattern-category li {
          padding: 5px 0;
          color: #666;
        }

        .test-commands {
          text-align: center;
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .test-commands h4 {
          margin-top: 0;
          color: #333;
        }

        .commands {
          font-family: 'Courier New', monospace;
          background: #2d3748;
          color: #e2e8f0;
          padding: 15px;
          border-radius: 6px;
          text-align: left;
        }

        .commands code {
          color: #68d391;
        }

        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .left-panel {
            order: 2;
          }

          .right-panel {
            order: 1;
          }

          .testing-patterns {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .testing-example {
            padding: 10px;
          }

          .header h1 {
            font-size: 2rem;
          }

          .form-row {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .list-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .todo-item {
            flex-direction: column;
            gap: 15px;
          }

          .todo-actions {
            align-self: flex-start;
          }

          .bulk-actions {
            flex-direction: column;
            width: 100%;
          }

          .bulk-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

// 🎯 Main App Component with Provider
export default function TestingApp() {
  return (
    <Provider store={store}>
      <TestingExample />
    </Provider>
  )
}