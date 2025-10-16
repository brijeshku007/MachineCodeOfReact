import React, { useReducer } from 'react';

/**
 * useReducer Hook - Complete Learning Example
 * 
 * This demonstrates useReducer for complex state management with multiple examples:
 * 1. Basic Counter (useState vs useReducer comparison)
 * 2. Shopping Cart (complex state with multiple actions)
 * 3. Form Management (multiple fields with validation)
 * 4. Todo App (CRUD operations with useReducer)
 */

// 1. BASIC COUNTER REDUCER
const counterReducer = (state, action) => {
  console.log('🔄 Counter Reducer:', { currentState: state, action });

  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'INCREMENT_BY':
      return { count: state.count + action.payload };
    case 'RESET':
      return { count: 0 };
    default:
      console.warn('Unknown action type:', action.type);
      return state;
  }
};

// 2. SHOPPING CART REDUCER
const cartInitialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null
};

const cartReducer = (state, action) => {
  console.log('🛒 Cart Reducer:', { currentState: state, action });

  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + newItem.price,
          itemCount: state.itemCount + 1
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...newItem, quantity: 1 }],
          total: state.total + newItem.price,
          itemCount: state.itemCount + 1
        };
      }
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (!itemToRemove) return state;

      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove.price * itemToRemove.quantity),
        itemCount: state.itemCount - itemToRemove.quantity
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (!item || quantity < 0) return state;

      const quantityDiff = quantity - item.quantity;

      if (quantity === 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
          total: state.total - (item.price * item.quantity),
          itemCount: state.itemCount - item.quantity
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
        total: state.total + (item.price * quantityDiff),
        itemCount: state.itemCount + quantityDiff
      };
    }

    case 'CLEAR_CART':
      return cartInitialState;

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

// 3. FORM REDUCER
const formInitialState = {
  fields: {
    name: '',
    email: '',
    message: ''
  },
  errors: {},
  isSubmitting: false,
  isValid: false
};

const formReducer = (state, action) => {
  console.log('📝 Form Reducer:', { currentState: state, action });

  switch (action.type) {
    case 'SET_FIELD': {
      const { field, value } = action.payload;
      const newFields = { ...state.fields, [field]: value };

      // Simple validation
      const errors = {};
      if (!newFields.name.trim()) errors.name = 'Name is required';
      if (!newFields.email.includes('@')) errors.email = 'Valid email is required';
      if (newFields.message.length < 10) errors.message = 'Message must be at least 10 characters';

      return {
        ...state,
        fields: newFields,
        errors,
        isValid: Object.keys(errors).length === 0
      };
    }

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };

    case 'RESET_FORM':
      return formInitialState;

    case 'SET_ERRORS':
      return { ...state, errors: action.payload, isSubmitting: false };

    default:
      return state;
  }
};

// 4. TODO REDUCER
const todoInitialState = {
  todos: [],
  filter: 'all', // 'all', 'active', 'completed'
  nextId: 1
};

const todoReducer = (state, action) => {
  console.log('📋 Todo Reducer:', { currentState: state, action });

  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: state.nextId,
            text: action.payload,
            completed: false,
            createdAt: new Date().toISOString()
          }
        ],
        nextId: state.nextId + 1
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };

    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        )
      };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };

    default:
      return state;
  }
};

// MAIN COMPONENT
const UseReducerExample = () => {
  // 1. Counter with useReducer
  const [counterState, counterDispatch] = useReducer(counterReducer, { count: 0 });

  // 2. Shopping cart with useReducer
  const [cartState, cartDispatch] = useReducer(cartReducer, cartInitialState);

  // 3. Form with useReducer
  const [formState, formDispatch] = useReducer(formReducer, formInitialState);

  // 4. Todo with useReducer
  const [todoState, todoDispatch] = useReducer(todoReducer, todoInitialState);

  // Sample products for cart
  const products = [
    { id: 1, name: 'React Book', price: 29.99 },
    { id: 2, name: 'JavaScript Course', price: 49.99 },
    { id: 3, name: 'TypeScript Guide', price: 39.99 }
  ];

  // Action creators for better organization
  const counterActions = {
    increment: () => counterDispatch({ type: 'INCREMENT' }),
    decrement: () => counterDispatch({ type: 'DECREMENT' }),
    incrementBy: (amount) => counterDispatch({ type: 'INCREMENT_BY', payload: amount }),
    reset: () => counterDispatch({ type: 'RESET' })
  };

  const cartActions = {
    addItem: (item) => cartDispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (id) => cartDispatch({ type: 'REMOVE_ITEM', payload: id }),
    updateQuantity: (id, quantity) => cartDispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
    clearCart: () => cartDispatch({ type: 'CLEAR_CART' })
  };

  // Form handlers
  const handleFieldChange = (field, value) => {
    formDispatch({ type: 'SET_FIELD', payload: { field, value } });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.isValid) return;

    formDispatch({ type: 'SET_SUBMITTING', payload: true });

    // Simulate API call
    setTimeout(() => {
      alert('Form submitted successfully!');
      formDispatch({ type: 'RESET_FORM' });
    }, 2000);
  };

  // Todo handlers
  const [newTodo, setNewTodo] = React.useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      todoDispatch({ type: 'ADD_TODO', payload: newTodo.trim() });
      setNewTodo('');
    }
  };

  const filteredTodos = todoState.todos.filter(todo => {
    if (todoState.filter === 'active') return !todo.completed;
    if (todoState.filter === 'completed') return todo.completed;
    return true;
  });

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#333',
      borderBottom: '2px solid #9c27b0',
      paddingBottom: '10px',
      marginBottom: '30px'
    },
    section: {
      marginBottom: '40px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    },
    button: {
      padding: '8px 16px',
      margin: '5px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#9c27b0',
      color: 'white'
    },
    input: {
      padding: '8px',
      margin: '5px',
      border: '1px solid #ddd',
      borderRadius: '4px'
    },
    cartItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      margin: '5px 0',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '4px'
    },
    todoItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      margin: '5px 0',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '4px'
    },
    error: {
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '5px'
    },
    stateDisplay: {
      backgroundColor: '#e7f3ff',
      padding: '10px',
      borderRadius: '4px',
      marginTop: '10px',
      fontSize: '12px',
      fontFamily: 'monospace'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>useReducer Hook - Complete Examples</h1>

      {/* 1. COUNTER EXAMPLE */}
      <div style={styles.section}>
        <h2>1. Counter with useReducer</h2>
        <p>Compare this with useState - useReducer provides more predictable state updates.</p>

        <div style={{ marginBottom: '15px' }}>
          <h3>Count: {counterState.count}</h3>
          <button style={styles.button} onClick={counterActions.increment}>
            Increment
          </button>
          <button style={styles.button} onClick={counterActions.decrement}>
            Decrement
          </button>
          <button style={styles.button} onClick={() => counterActions.incrementBy(5)}>
            +5
          </button>
          <button style={styles.button} onClick={counterActions.reset}>
            Reset
          </button>
        </div>

        <div style={styles.stateDisplay}>
          <strong>Current State:</strong> {JSON.stringify(counterState, null, 2)}
        </div>
      </div>

      {/* 2. SHOPPING CART EXAMPLE */}
      <div style={styles.section}>
        <h2>2. Shopping Cart with Complex State</h2>
        <p>This demonstrates managing complex state with multiple related values.</p>

        <div style={{ marginBottom: '15px' }}>
          <h3>Products:</h3>
          {products.map(product => (
            <div key={product.id} style={styles.cartItem}>
              <span>{product.name} - ${product.price}</span>
              <button
                style={styles.button}
                onClick={() => cartActions.addItem(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3>Cart ({cartState.itemCount} items) - Total: ${cartState.total.toFixed(2)}</h3>
          {cartState.items.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            cartState.items.map(item => (
              <div key={item.id} style={styles.cartItem}>
                <span>{item.name} x {item.quantity}</span>
                <div>
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => cartActions.updateQuantity(item.id, parseInt(e.target.value) || 0)}
                    style={{ ...styles.input, width: '60px' }}
                  />
                  <button
                    style={{ ...styles.button, backgroundColor: '#dc3545' }}
                    onClick={() => cartActions.removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
          {cartState.items.length > 0 && (
            <button
              style={{ ...styles.button, backgroundColor: '#6c757d' }}
              onClick={cartActions.clearCart}
            >
              Clear Cart
            </button>
          )}
        </div>

        <div style={styles.stateDisplay}>
          <strong>Cart State:</strong> {JSON.stringify(cartState, null, 2)}
        </div>
      </div>

      {/* 3. FORM MANAGEMENT EXAMPLE */}
      <div style={styles.section}>
        <h2>3. Form Management with Validation</h2>
        <p>useReducer excels at managing form state with complex validation logic.</p>

        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              style={styles.input}
              type="text"
              placeholder="Name"
              value={formState.fields.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
            />
            {formState.errors.name && (
              <div style={styles.error}>{formState.errors.name}</div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={formState.fields.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
            />
            {formState.errors.email && (
              <div style={styles.error}>{formState.errors.email}</div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <textarea
              style={{ ...styles.input, width: '300px', height: '80px' }}
              placeholder="Message (min 10 characters)"
              value={formState.fields.message}
              onChange={(e) => handleFieldChange('message', e.target.value)}
            />
            {formState.errors.message && (
              <div style={styles.error}>{formState.errors.message}</div>
            )}
          </div>

          <button
            style={{
              ...styles.button,
              backgroundColor: formState.isValid ? '#28a745' : '#6c757d'
            }}
            type="submit"
            disabled={!formState.isValid || formState.isSubmitting}
          >
            {formState.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

          <button
            style={{ ...styles.button, backgroundColor: '#6c757d' }}
            type="button"
            onClick={() => formDispatch({ type: 'RESET_FORM' })}
          >
            Reset
          </button>
        </form>

        <div style={styles.stateDisplay}>
          <strong>Form State:</strong> {JSON.stringify(formState, null, 2)}
        </div>
      </div>

      {/* 4. TODO APP EXAMPLE */}
      <div style={styles.section}>
        <h2>4. Todo App with CRUD Operations</h2>
        <p>Complete todo management showcasing all types of state operations.</p>

        <div style={{ marginBottom: '15px' }}>
          <input
            style={styles.input}
            type="text"
            placeholder="Add new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button style={styles.button} onClick={addTodo}>
            Add Todo
          </button>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <button
            style={{
              ...styles.button,
              backgroundColor: todoState.filter === 'all' ? '#9c27b0' : '#6c757d'
            }}
            onClick={() => todoDispatch({ type: 'SET_FILTER', payload: 'all' })}
          >
            All ({todoState.todos.length})
          </button>
          <button
            style={{
              ...styles.button,
              backgroundColor: todoState.filter === 'active' ? '#9c27b0' : '#6c757d'
            }}
            onClick={() => todoDispatch({ type: 'SET_FILTER', payload: 'active' })}
          >
            Active ({todoState.todos.filter(t => !t.completed).length})
          </button>
          <button
            style={{
              ...styles.button,
              backgroundColor: todoState.filter === 'completed' ? '#9c27b0' : '#6c757d'
            }}
            onClick={() => todoDispatch({ type: 'SET_FILTER', payload: 'completed' })}
          >
            Completed ({todoState.todos.filter(t => t.completed).length})
          </button>
          <button
            style={{ ...styles.button, backgroundColor: '#dc3545' }}
            onClick={() => todoDispatch({ type: 'CLEAR_COMPLETED' })}
          >
            Clear Completed
          </button>
        </div>

        <div>
          {filteredTodos.map(todo => (
            <div key={todo.id} style={styles.todoItem}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => todoDispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
              />
              <span style={{
                marginLeft: '10px',
                textDecoration: todo.completed ? 'line-through' : 'none',
                flex: 1
              }}>
                {todo.text}
              </span>
              <button
                style={{ ...styles.button, backgroundColor: '#dc3545' }}
                onClick={() => todoDispatch({ type: 'DELETE_TODO', payload: todo.id })}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div style={styles.stateDisplay}>
          <strong>Todo State:</strong> {JSON.stringify(todoState, null, 2)}
        </div>
      </div>

      {/* KEY CONCEPTS */}
      <div style={styles.section}>
        <h2>🎓 Key useReducer Concepts</h2>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px' }}>
          <h3>When to Use useReducer:</h3>
          <ul>
            <li>✅ <strong>Complex State:</strong> Multiple related values (like shopping cart)</li>
            <li>✅ <strong>State Dependencies:</strong> Next state depends on previous state</li>
            <li>✅ <strong>Predictable Updates:</strong> Centralized state logic</li>
            <li>✅ <strong>Testing:</strong> Easy to test reducer functions</li>
          </ul>

          <h3>Reducer Rules:</h3>
          <ul>
            <li>🔄 <strong>Pure Functions:</strong> No side effects, same input = same output</li>
            <li>🚫 <strong>No Mutations:</strong> Always return new state objects</li>
            <li>📝 <strong>Action Types:</strong> Use descriptive action type strings</li>
            <li>🛡️ <strong>Default Case:</strong> Always include default case in switch</li>
          </ul>

          <p><strong>💡 Pro Tip:</strong> Open browser console to see reducer logs in action!</p>
        </div>
      </div>
    </div>
  );
};

export default UseReducerExample;